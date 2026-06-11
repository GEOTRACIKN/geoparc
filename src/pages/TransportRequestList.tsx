import React, { useEffect, useMemo, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Dropdown,
    Form,
    Table,
    Row,
    Col,
    InputGroup,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Bounce, toast } from "react-toastify";
import { useTranslate } from "../hooks/LanguageProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    getTransportRequestList,
    getTransportRequestListCount,
    updateTransportRequestListStatus,
} from "../services/transportRequestList.service";
import {
    TransportRequestListItem,
    TransportRequestListSearchPayload,
} from "../types/transportRequestList.types";
import DetailsDrawer from "../components/TransportRequest/DetailsDrawer";
import { formatDateToTimestamp, } from "../functions";
import { createMissionOrderApi } from "../services/missionOrder.service";



type ColumnKey =
    | "id_transport_request"
    | "request_type"
    | "object_request"
    | "departure_location"
    | "arrival_location"
    | "requester_phone"
    | "status_request"
    | "created_at"
    | "actions";

interface ColumnOption {
    key: ColumnKey;
    label: string;
}

const ALL_COLUMNS: ColumnOption[] = [
    { key: "id_transport_request", label: "ID" },
    { key: "request_type", label: "Type" },
    { key: "object_request", label: "Object" },
    { key: "departure_location", label: "Departure" },
    { key: "arrival_location", label: "Arrival" },
    { key: "requester_phone", label: "Phone" },
    { key: "status_request", label: "Status" },
    { key: "created_at", label: "created_at" },
    { key: "actions", label: "Actions" },
];

const DEFAULT_SELECTED_COLUMNS: ColumnKey[] = [
    "id_transport_request",
    "request_type",
    "object_request",
    "departure_location",
    "arrival_location",
    "status_request",
    "actions",
];
export function TransportRequestList() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const id_user = localStorage.getItem("GeopUserID");

    const [requests, setRequests] = useState<TransportRequestListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [search, setSearch] = useState<string>("");
    const [requestType, setRequestType] = useState<string>("all");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limitValue, setLimitValue] = useState<number>(10);
    const [pageCount, setPageCount] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    const [sortColumn, setSortColumn] = useState<ColumnKey>(
        "id_transport_request",
    );
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

    const [selectedColumns, setSelectedColumns] = useState<ColumnKey[]>(
        DEFAULT_SELECTED_COLUMNS,
    );

    const [selectedRequest, setSelectedRequest] =
        useState<TransportRequestListItem | null>(null);
    const [showDrawer, setShowDrawer] = useState(false);

    const visibleColumns = useMemo(() => {
        return ALL_COLUMNS.filter((column) => selectedColumns.includes(column.key));
    }, [selectedColumns]);

    const { translate } = useTranslate();

    useEffect(() => {
        const mailDecision = searchParams.get("mailDecision");

        if (mailDecision !== "approved" && mailDecision !== "rejected") {
            return;
        }

        const alreadyDecided = searchParams.get("already_decided") === "1";
        const toastOptions = {
            position: "bottom-right" as const,
            autoClose: 3000,
            transition: Bounce,
        };

        if (mailDecision === "approved") {
            toast.success(
                alreadyDecided
                    ? "Cette demande a deja ete approuvee"
                    : "Demande approuvee depuis l'email",
                toastOptions,
            );
        } else {
            toast.warn(
                alreadyDecided
                    ? "Cette demande a deja ete traitee"
                    : "Demande rejetee depuis l'email",
                toastOptions,
            );
        }

        window.history.replaceState({}, document.title, window.location.pathname);
    }, [searchParams]);

    const loadTransportRequests = async (
        page = currentPage,
        searchValue = search,
        typeValue = requestType,
        limit = limitValue,
        column = sortColumn,
        sort = sortOrder,
    ) => {
        try {
            setLoading(true);

            const payload: TransportRequestListSearchPayload = {
                limitValue: limit,
                currentPage: page,
                id_user,
                search: searchValue,
                type: typeValue,
                colum: column,
                sort,
            };

            const [listResponse, countResponse] = await Promise.all([
                getTransportRequestList(payload),
                getTransportRequestListCount({
                    id_user,
                    search: searchValue,
                    type: typeValue,
                }),
            ]);

            const totalCount = Number(countResponse.count || 0);
            const computedPageCount = Math.max(1, Math.ceil(totalCount / limit));

            setRequests(listResponse);
            setTotal(totalCount);
            setPageCount(computedPageCount);

            if (page > computedPageCount) {
                setCurrentPage(1);
            }
        } catch (error: any) {
            console.error("Load transport requests error:", error);
            toast.error(error?.message || "Failed to load transport request list", {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransportRequests();
    }, [currentPage, limitValue, sortColumn, sortOrder]);

    const handleSearch = async () => {
        setCurrentPage(1);
        await loadTransportRequests(
            1,
            search,
            requestType,
            limitValue,
            sortColumn,
            sortOrder,
        );
    };

    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected + 1);
        window.scrollTo(0, 0);
    };

    const handleSort = (column: ColumnKey) => {
        if (column === "actions") return;

        if (sortColumn === column) {
            setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
            return;
        }

        setSortColumn(column);
        setSortOrder("ASC");
    };

    const handleToggleColumn = (columnKey: ColumnKey) => {
        if (columnKey === "actions") return;

        setSelectedColumns((prev) => {
            if (prev.includes(columnKey)) {
                return prev.filter((item) => item !== columnKey);
            }
            return [...prev, columnKey];
        });
    };

    const handleLimitChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const newLimit = Number(event.target.value);
        setLimitValue(newLimit);
        setCurrentPage(1);

        await loadTransportRequests(
            1,
            search,
            requestType,
            newLimit,
            sortColumn,
            sortOrder,
        );
    };

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <Badge bg="success">Approved</Badge>;
            case "rejected":
                return <Badge bg="danger">Rejected</Badge>;
            case "cancelled":
                return <Badge bg="secondary">Cancelled</Badge>;
            case "mission_created":
                return <Badge bg="primary">Mission Created</Badge>;
            case "pending_fleet_processing":
                return (
                    <Badge
                        bg=""
                        style={{
                            backgroundColor: "#fbbf24",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "11px",
                            padding: "6px 10px",
                            borderRadius: "4px",
                        }}
                    >
                        {translate("pending")}
                    </Badge>
                );
            default:
                return <Badge bg="info">Pending</Badge>;
        }
    };

    const openDrawer = (row: TransportRequestListItem) => {
        setSelectedRequest(row);
        setShowDrawer(true);
    };

    const closeDrawer = () => {
        setShowDrawer(false);
        setSelectedRequest(null);
    };

    const updateRequestStatus = (
        id: number,
        newStatus: "approved" | "rejected" | "cancelled" | "mission_created",
    ) => {
        setRequests((prev) =>
            prev.map((item) =>
                item.id_transport_request === id
                    ? { ...item, status_request: newStatus }
                    : item,
            ),
        );

        setSelectedRequest((prev) =>
            prev && prev.id_transport_request === id
                ? { ...prev, status_request: newStatus }
                : prev,
        );
    };

    const handleView = (row: TransportRequestListItem) => {
        openDrawer(row);
    };

    // const handleApprove = (row: TransportRequestListItem) => {
    //     updateRequestStatus(row.id_transport_request, "approved");

    //     toast.success(`Request #${row.id_transport_request} approved`, {
    //         position: "bottom-right",
    //         autoClose: 1800,
    //         transition: Bounce,
    //     });
    // };

    const handleReject = (row: TransportRequestListItem) => {
        updateRequestStatus(row.id_transport_request, "rejected");

        toast.warn(`Request #${row.id_transport_request} rejected`, {
            position: "bottom-right",
            autoClose: 1800,
            transition: Bounce,
        });
    };

    const handleCancel = (row: TransportRequestListItem) => {
        updateRequestStatus(row.id_transport_request, "cancelled");

        toast.warn(`Request #${row.id_transport_request} cancelled`, {
            position: "bottom-right",
            autoClose: 1800,
            transition: Bounce,
        });
    };

    const handleCreateMission = (row: TransportRequestListItem) => {
        updateRequestStatus(row.id_transport_request, "mission_created");

        toast.success(`Request #${row.id_transport_request} converted to mission`, {
            position: "bottom-right",
            autoClose: 1800,
            transition: Bounce,
        });

        closeDrawer();
    };

    const handleNewRequest = () => {
        navigate("/transport-request");
    };

    const handleApprove = async (row: TransportRequestListItem) => {
        try {
            const payload = {
                id_vehicule: 0,
                ref_mission: row.id_transport_request,
                object_mission: row.object_request || "",
                fuel_loading_mission: 0,
                fuel_type_mission: "",
                expenses_mission: 0,
                tank_mission: 0,
                trailer_mission: "0",
                driver_mission: "",
                accomp_mission: "",
                dep_loc_mission: row.departure_location || "",
                dep_date_mission: row.departure_datetime || "",
                dep_dest_mission: row.arrival_location || "",
                return_date_mission: row.arrival_datetime || "",
                itinerary_mission: "",
                new_km_mission: 0,
                fuel_cost_mission: 0,
                fuel_level_mission: 0,
                voucher_mission: 0,
                id_user: localStorage.getItem("GeopUserID"),
            };
            
            const result = await createMissionOrderApi(payload);

            await updateTransportRequestListStatus({
                id_transport_request: row.id_transport_request,
                id_user,
                status_request: "mission_created",
                approval_status: "approved",
                approval_required: 0,
            });

            updateRequestStatus(row.id_transport_request, "mission_created");

            toast.success(result.message || "Mission created successfully", {
                position: "bottom-right",
                autoClose: 2000,
                transition: Bounce,
            });
        } catch (error: any) {
            console.error("Create mission on approve error:", error);

            toast.error(error?.message || "Failed to create mission", {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });
        }
    };

    return (
        <div className="page-content">
            <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                    <div className="mb-4">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <h4 className="mb-1 fw-bold">
                                    {translate("transport_requests")} : {requests?.length || 0}
                                </h4>

                                <p className="text-muted mb-1">
                                    {translate("request_validation_list_before_mission_creation")}
                                </p>
                            </div>

                            <div className="col-md-4 d-flex justify-content-md-end justify-content-start mt-3 mt-md-0">
                                <Button
                                    variant="success"
                                    onClick={handleNewRequest}
                                    style={{ height: "42px", minWidth: "160px" }}
                                    className="d-inline-flex align-items-center justify-content-center gap-2"
                                >
                                    <i className="las la-plus"></i>
                                    {translate("New Request")}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Row className="g-2 align-items-center mb-3">
                        <Col xl={4} lg={4} md={12}>
                            <InputGroup>
                                <InputGroup.Text
                                    style={{
                                        height: "42px",
                                        minHeight: "42px",
                                        backgroundColor: "#fff",
                                        borderRight: "0",
                                    }}
                                >
                                    <i className="las la-search"></i>
                                </InputGroup.Text>

                                <Form.Control
                                    type="text"
                                    placeholder={translate("search") + "..."}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        height: "42px",
                                        minHeight: "42px",
                                        padding: "6px 12px",
                                        lineHeight: "1.2",
                                        borderLeft: "0",
                                        borderRight: search ? "0" : undefined,
                                        boxShadow: "none",
                                    }}
                                />

                                {search && (
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setSearch("")}
                                        style={{
                                            height: "42px",
                                            minHeight: "42px",
                                            borderLeft: "0",
                                        }}
                                        className="d-inline-flex align-items-center justify-content-center"
                                    >
                                        <i className="las la-times"></i>
                                    </Button>
                                )}
                            </InputGroup>
                        </Col>

                        <Col xl={2} lg={3} md={4}>
                            <Form.Select
                                value={requestType}
                                onChange={(e) => setRequestType(e.target.value)}
                                style={{ height: "42px" }}
                            >
                                <option value="all">{translate("all")}</option>
                                <option value="Normal">{translate("Normal")}</option>
                                <option value="Urgent">{translate("Urgent")}</option>
                            </Form.Select>
                        </Col>

                        <Col xl={2} lg={2} md={4}>
                            <Button
                                variant="warning"
                                className="w-100 d-inline-flex align-items-center justify-content-center gap-2"
                                onClick={handleSearch}
                                disabled={loading}
                                style={{ height: "42px" }}
                            >
                                <i className="las la-search-plus"></i>
                                {translate("search")}
                            </Button>
                        </Col>

                        <Col xl={4} lg={4} md={4}>
                            <div className="d-flex align-items-center justify-content-lg-end gap-2 flex-wrap">
                                <span className="fw-medium text-dark">
                                    {translate("displaying")}
                                </span>

                                <Form.Select
                                    value={limitValue}
                                    onChange={handleLimitChange}
                                    style={{ width: "72px", height: "42px" }}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value="100">100</option>
                                    <option value="200">200</option>
                                    <option value="500">500</option>
                                </Form.Select>

                                <Dropdown align="end">
                                    <Dropdown.Toggle
                                        variant="warning"
                                        id="transport-columns-btn"
                                        style={{ height: "42px" }}
                                    >
                                        {translate("columns")}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {ALL_COLUMNS.map((column) => (
                                            <Dropdown.Item
                                                key={column.key}
                                                as="button"
                                                onClick={() => handleToggleColumn(column.key)}
                                                disabled={column.key === "actions"}
                                            >
                                                <Form.Check
                                                    type="checkbox"
                                                    label={translate(column.label)}
                                                    checked={selectedColumns.includes(column.key)}
                                                    readOnly
                                                />
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Col>
                    </Row>

                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead style={{ backgroundColor: "#f8f9fc" }}>
                                <tr>
                                    {visibleColumns.map((column) => (
                                        <th
                                            key={column.key}
                                            className="fw-bold text-dark border-bottom"
                                            style={{
                                                cursor:
                                                    column.key !== "actions" ? "pointer" : "default",
                                                whiteSpace: "nowrap",
                                            }}
                                            onClick={() =>
                                                column.key !== "actions" && handleSort(column.key)
                                            }
                                        >
                                            {translate(column.label)}
                                            {sortColumn === column.key && (
                                                <span className="ms-2">
                                                    {sortOrder === "ASC" ? "▲" : "▼"}
                                                </span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={visibleColumns.length}
                                            className="text-center py-4"
                                        >
                                            {translate("loading")}...
                                        </td>
                                    </tr>
                                ) : requests.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={visibleColumns.length}
                                            className="text-center py-4"
                                        >
                                            {translate("no_transport_requests_found")}
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((row) => (
                                        <tr key={row.id_transport_request}>
                                            {visibleColumns.map((column) => {
                                                switch (column.key) {
                                                    case "id_transport_request":
                                                        return (
                                                            <td key={column.key}>
                                                                {row.id_transport_request}
                                                            </td>
                                                        );

                                                    case "request_type":
                                                        return (
                                                            <td key={column.key}>
                                                                {translate(row.request_type)}
                                                            </td>
                                                        );

                                                    case "object_request":
                                                        return (
                                                            <td key={column.key}>
                                                                {translate(row.object_request)}
                                                            </td>
                                                        );

                                                    case "departure_location":
                                                        return (
                                                            <td key={column.key}>
                                                                <div className="fw-medium">
                                                                    {translate(row.departure_location) || "-"}
                                                                </div>
                                                                <div className="text-muted small">
                                                                    {formatDateToTimestamp(
                                                                        row.departure_datetime || "-",
                                                                    )}
                                                                </div>
                                                            </td>
                                                        );

                                                    case "arrival_location":
                                                        return (
                                                            <td key={column.key}>
                                                                <div className="fw-medium">
                                                                    {row.arrival_location || "-"}
                                                                </div>
                                                                <div className="text-muted small">
                                                                    {formatDateToTimestamp(
                                                                        row.arrival_datetime || "-",
                                                                    )}
                                                                </div>
                                                            </td>
                                                        );
                                                    case "requester_phone":
                                                        return (
                                                            <td key={column.key}>{row.requester_phone}</td>
                                                        );

                                                    case "status_request":
                                                        return (
                                                            <td key={column.key}>
                                                                {renderStatusBadge(row.status_request)}
                                                            </td>
                                                        );

                                                    case "created_at":
                                                        return (
                                                            <td key={column.key}>
                                                                {formatDateToTimestamp(row.created_at || "") ||
                                                                    "-"}
                                                            </td>
                                                        );

                                                    case "actions":
                                                        return (
                                                            <td key={column.key}>
                                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline-primary"
                                                                        onClick={() => handleView(row)}
                                                                    >
                                                                        {translate("view")}
                                                                    </Button>

                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline-success"
                                                                        onClick={() => handleApprove(row)}
                                                                    >
                                                                        {translate("approve")}
                                                                    </Button>

                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline-danger"
                                                                        onClick={() => handleReject(row)}
                                                                    >
                                                                        {translate("reject")}
                                                                    </Button>

                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline-secondary"
                                                                        onClick={() => handleCancel(row)}
                                                                    >
                                                                        {translate("cancel")}
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        );

                                                    default:
                                                        return <td key={column.key}>-</td>;
                                                }
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">
                        <div className="text-dark">
                            {translate("displaying")} {requests.length} {translate("on")}{" "}
                            {total} / {translate("Page")} {currentPage} {translate("on")}{" "}
                            {pageCount}
                        </div>

                        <ReactPaginate
                            previousLabel={translate("previous")}
                            nextLabel={translate("next")}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            forcePage={Math.max(currentPage - 1, 0)}
                            containerClassName={"pagination mb-0"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active"}
                            disabledClassName={"disabled"}
                        />
                    </div>
                </Card.Body>
            </Card>

            <DetailsDrawer
                show={showDrawer}
                request={selectedRequest}
                onClose={closeDrawer}
                onApprove={handleApprove}
                onReject={handleReject}
                onCancel={handleCancel}
            />
        </div>
    );
}

export default TransportRequestList;
