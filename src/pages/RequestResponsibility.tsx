import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import { Bounce, toast } from "react-toastify";
import { useTranslate } from "../hooks/LanguageProvider";
import {
  Responsible,
  Requester,
} from "../types/requestResponsibility.types";
import {
  getRequestersByResponsibleApi,
  searchResponsiblesApi,
} from "../services/requestResponsibility.service";
import ResponsibleDetailsDrawer from "../components/RequestResponsibility/ResponsibleDetailsDrawer";
import RequesterAssignmentDrawer from "../components/RequestResponsibility/RequesterAssignmentDrawer";

export function RequestResponsibility() {
  const { translate } = useTranslate();

  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [assignedRequesters, setAssignedRequesters] = useState<Requester[]>([]);

  const [selectedResponsible, setSelectedResponsible] =
    useState<Responsible | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [showAssignmentDrawer, setShowAssignmentDrawer] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / limit));
  }, [total, limit]);

  const loadResponsibles = async (
    searchValue = search,
    pageValue = page,
    limitValue = limit
  ) => {
    try {
      setLoading(true);

      const result = await searchResponsiblesApi({
        search: searchValue,
        page: pageValue,
        limit: limitValue,
      });

      setResponsibles(result.data || []);
      setTotal(result.total || 0);
      setPage(result.page || pageValue);
      setLimit(result.limit || limitValue);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load responsibles", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAssignedRequesters = async (id_responsable: number) => {
    try {
      const data = await getRequestersByResponsibleApi(id_responsable);
      setAssignedRequesters(data);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load requesters", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    loadResponsibles("", 1, limit);
  }, []);

  const handleSearch = async () => {
    setPage(1);
    await loadResponsibles(search, 1, limit);
  };

  const handleReset = async () => {
    setSearch("");
    setPage(1);
    await loadResponsibles("", 1, limit);
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    setPage(newPage);
    await loadResponsibles(search, newPage, limit);
  };

  const handleLimitChange = async (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    await loadResponsibles(search, 1, newLimit);
  };

  const openCreateDrawer = () => {
    setSelectedResponsible(null);
    setShowDetailsDrawer(true);
  };

  const openDetailsDrawer = (responsible: Responsible) => {
    setSelectedResponsible(responsible);
    setShowDetailsDrawer(true);
  };

  const openAssignmentDrawer = async (responsible: Responsible) => {
    setSelectedResponsible(responsible);
    await loadAssignedRequesters(responsible.id_responsable);
    setShowAssignmentDrawer(true);
  };

  const closeDetailsDrawer = () => {
    setShowDetailsDrawer(false);
    setSelectedResponsible(null);
  };

  const closeAssignmentDrawer = () => {
    setShowAssignmentDrawer(false);
    setSelectedResponsible(null);
    setAssignedRequesters([]);
  };

  const refreshAssignmentDrawer = async () => {
    if (selectedResponsible) {
      await loadAssignedRequesters(selectedResponsible.id_responsable);
      await loadResponsibles(search, page, limit);
    }
  };

  const renderPaginationItems = () => {
    const items = [];

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let currentPage = start; currentPage <= end; currentPage++) {
      items.push(
        <Pagination.Item
          key={currentPage}
          active={currentPage === page}
          onClick={() => handlePageChange(currentPage)}
        >
          {currentPage}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col md={6}>
              <h4 className="mb-0">
                {translate("Request responsibility")}
              </h4>
              <small className="text-muted">
                {translate("Manage responsible users and assigned requesters")}
              </small>
            </Col>

            <Col md={6} className="text-right">
              <Button variant="success" onClick={openCreateDrawer}>
                {translate("Add responsible")}
              </Button>
            </Col>
          </Row>

          <Row className="align-items-center mb-3">
            <Col md={7}>
              <InputGroup>
                <Form.Control
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder={translate("Search by code, name, email or phone")}
                />

                <Button
                  variant="primary"
                  className="ml-2"
                  onClick={handleSearch}
                >
                  {translate("Search")}
                </Button>

                <Button
                  variant="secondary"
                  className="ml-2"
                  onClick={handleReset}
                >
                  {translate("Reset")}
                </Button>
              </InputGroup>
            </Col>

            <Col md={5} className="text-right">
              <div className="d-inline-flex align-items-center">
                <span className="mr-2">{translate("Show")}</span>

                <Form.Control
                  as="select"
                  value={limit}
                  style={{ width: 90 }}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </Form.Control>

                <span className="ml-2">{translate("entries")}</span>
              </div>
            </Col>
          </Row>

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>{translate("ID")}</th>
                  <th>{translate("Code")}</th>
                  <th>{translate("Full name")}</th>
                  <th>{translate("Email")}</th>
                  <th>{translate("Phone")}</th>
                  <th>{translate("Requesters")}</th>
                  <th className="text-right">{translate("Actions")}</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      {translate("Loading...")}
                    </td>
                  </tr>
                ) : responsibles.length > 0 ? (
                  responsibles.map((responsible) => (
                    <tr key={responsible.id_responsable}>
                      <td>{responsible.id_responsable}</td>
                      <td>{responsible.mat || "-"}</td>
                      <td>
                        {responsible.first_name || "-"}{" "}
                        {responsible.last_name || ""}
                      </td>
                      <td>{responsible.email || "-"}</td>
                      <td>{responsible.phone || "-"}</td>
                      <td>
                        <Badge bg="secondary">
                          {responsible.total_requesters || 0}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="mr-2"
                          onClick={() => openDetailsDrawer(responsible)}
                        >
                          {translate("Details")}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() => openAssignmentDrawer(responsible)}
                        >
                          {translate("Requesters")}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      {translate("No data available")}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <Row className="align-items-center mt-3">
            <Col md={6}>
              <small className="text-muted">
                {translate("Total")} : {total}
              </small>
            </Col>

            <Col md={6} className="d-flex justify-content-end">
              <Pagination className="mb-0">
                <Pagination.First
                  disabled={page === 1}
                  onClick={() => handlePageChange(1)}
                />
                <Pagination.Prev
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                />

                {renderPaginationItems()}

                <Pagination.Next
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                />
                <Pagination.Last
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(totalPages)}
                />
              </Pagination>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <ResponsibleDetailsDrawer
        show={showDetailsDrawer}
        responsible={selectedResponsible}
        onClose={closeDetailsDrawer}
        onSaved={() => loadResponsibles(search, page, limit)}
      />

      <RequesterAssignmentDrawer
        show={showAssignmentDrawer}
        responsible={selectedResponsible}
        assignedRequesters={assignedRequesters}
        onClose={closeAssignmentDrawer}
        onRefresh={refreshAssignmentDrawer}
      />
    </>
  );
}