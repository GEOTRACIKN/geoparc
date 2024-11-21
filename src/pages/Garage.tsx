/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { Dropdown, Table, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import { PropagateLoader } from "react-spinners";
import { formatDateToTimestamp } from "../utilities/functions";
import UpdateStatusGarageModal from "../components/Garage/updateStatusGarageModal";

interface Intervention {
    id_garage: number;
    id_user: number;
    id_intervention: number;
    date_intervention: string;
    date_update: string;
    priority: string;
    status: string;
    immatriculation_vehicule: string;
    odometer: string;
    subject: string;
    client_name: string;
    client_phone_number: string;
    receptionist_name: string;
    service: string;
}


export function Garage() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const { translate } = useTranslate();
    const [list_garage, setGarages] = useState<Intervention[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID Intervention");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("ASC");
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [Column, setSortColumn] = useState("id_garage");
    const [pageCount, setPageCount] = useState(0);
    const [modalGarageStatus, setModalGarageStatus] = useState<string | null>(null);
    const [titleGarageStatus, setTitleGarageStatus] = useState<string | null>(null);
    const [IdGarage, setIdGarage] = useState<number>(0);
    const [IdUser, setIdUser] = useState<number>(0);

    const handlePageClick = async (data: any) => {
        let page = data.selected + 1;
        await getGarages(limit, page, search, type, Column, sort);

        window.scrollTo(0, 0);
    };


    const handleSortingColumn = (currentColumn: string) => {

        setSortColumn(currentColumn)
        sort === "ASC" ? setSort("DESC") : setSort("ASC");
        getGarages(limit, page, search, type, Column, sort);
    };



    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const searchColumn: { [key: string]: number } = {
        id_garage: 0,
        date_intervention: 1,
        immatriculation_vehicule: 2,
        subject: 3,
        priority: 4,
        service: 5,
        date_update: 6,
    };

    useEffect(() => {
        getGarages(limit, page, search, type, Column, sort);
    }, []);

    const getGarages = async (
        limit: number,
        page: number,
        search: string,
        type: number,
        Column: string,
        sort: string
    ) => {
        try {
            setLoading(true);

            // Preparing the data to send
            const bodyData = JSON.stringify({
                limit,
                page,
                search,
                type,
                id_user,
                Column: searchColumn[Column],
                sort,
            });

            // Retrieve the total number of pages
            const totalPagesResponse = await fetch(
                `${backendUrl}/api/geop/garage/totalpage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: bodyData,
                    mode: "cors",
                }
            );

            const totalPagesJson = await totalPagesResponse.json();
            const total = totalPagesJson[0]["count"];
            setTotal(total);

            // Retrieve driver data
            const DriversResponse = await fetch(
                `${backendUrl}/api/geop/garage/search`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: bodyData,
                    mode: "cors",
                }
            );

            const data = await DriversResponse.json();
            setPageCount(Math.ceil(total / limit));
            setLimit(limit);
            setGarages(data);
            return data;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTypeSearch = (selectedValue: string) => {



        switch (selectedValue) {
            case 'ID ' + translate("Garage"):
                setType(0);
                break;
            case translate("Date of request"):
                setType(1);
                break;
            case translate("Vehicle"):
                setType(2);
                break;
            case translate("Object"):
                setType(3);
                break;
            case translate("Priority"):
                setType(4);
                break;
            case translate("Status"):
                setType(5);
                break;
            case translate("Updated date"):
                setType(6);
                break;
            default:
                console.log("Unknown selection");
                break;
        }
        setTypeSearch(selectedValue);
    };

    const handleAdvancedSearch = (event: any) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const handleSelectChange = (event: any) => {
        const newValue = event.target.value;
        setLimit(parseInt(newValue));
        setPage(1);
    };


    const menuItems = [
        translate("ID"),
        translate("Date of request"),
        translate("Vehicle"),
        translate("Object"),
        translate("Priority"),
        translate("State"),
        translate("Updated date"),
    ];


    const handleResetSearch = async () => {
        setSearch("")

        await getGarages(limit, page, search, type, Column, sort)
    };



    const [selectedColumns, setselectedColumns] = useState({
        id_garage: true,
        date_intervention: true,
        immatriculation_vehicule: true,
        subject: true,
        priority: true,
        status: true,
        service: true,
        date_update: true,
    });


    const ColumnnOptions = [
        { key: "id_garage", label: 'ID ' + translate("Garage") },
        { key: "date_intervention", label: translate("Intervention Requests") },
        { key: "immatriculation_vehicule", label: translate("Matriculation") + ' ' + translate("Vehicle") },
        { key: "subject", label: translate("Subject") },
        { key: "priority", label: translate("Priority") },
        { key: "status", label: translate("Status") },
        { key: "service", label: translate("Service") },
        { key: "date_update", label: translate("Date update") }
    ];


    type selectedColumnsType = {
        id_garage: boolean;
        date_intervention: boolean;
        immatriculation_vehicule: boolean;
        subject: boolean;
        priority: boolean;
        status: boolean;
        service: boolean;
        date_update: boolean;
    };



    const handleColumnnChange = (Columnn: string) => {
        setselectedColumns((prevState: any) => ({
            ...prevState,
            [Columnn]: !prevState[Columnn],
        }));
    };

    const closeGarageModal = () => {
        setModalGarageStatus(null);
        setTitleGarageStatus("");
        setIdUser(0);
        setIdGarage(0);
        setIdGarage(0);
    };

    const handleUpdateGarage = async (id_garage: number, id_user: any) => {
        try {

            setModalGarageStatus('Are you sure you want to update this vehicle to this garage?');
            setTitleGarageStatus('Update status');
            setIdUser(parseInt(id_user || '0', 0));
            setIdGarage(id_garage);

        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateGarageList = () => {
        getGarages(limit, page, search, type, Column, sort).catch(error => {
            console.error('Failed to update driver list:', error);
        });
    };

    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Garage")}</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <button
                        onClick={handleShow}
                        className="btn btn-outline-secondary  mt-2 mr-1"
                    >
                        <i className="las la-download mr-3"></i>
                        {translate("Export")}
                    </button>
                </div>
            </div>
            <div className="row">
                <div
                    className="col-md-4"
                    style={{ margin: "0px 0px 10px 0px", padding: "10px" }}
                >
                    <div className="input-group">
                        <Dropdown>
                            <Dropdown.Toggle variant="link" id="dropdown-basic" >
                                <i
                                    className="fas fa-chevron-down"
                                    style={{ fontSize: "20" }}
                                ></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {menuItems.map((item, index) => (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => handleTypeSearch(item)}
                                        eventKey={item}
                                        active={typeSearch === item}
                                        className={typeSearch === item ? "select-active" : ""}
                                    >
                                        {item}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <input type="text" placeholder={` ${translate("Search by")} ${translate(typeSearch)}`} onChange={handleAdvancedSearch} className="form-control" />
                        <Button
                            variant="secondary"
                            onClick={handleResetSearch}
                            className="btn-reset"
                        >
                            <i className="las la-times" style={{ color: "#fff" }}></i>
                        </Button>
                    </div>
                </div>
                <div className="col-md-8 d-flex justify-content-end align-items-center">
                    <div className="dataTables_length">
                        <label style={{ marginBottom: "0" }}>
                            {translate("Show")}
                            <select
                                className="custom-select custom-select-sm form-control form-control-sm ml-2"
                                style={{ width: "66px" }}
                                onChange={handleSelectChange}
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                                <option value="500">500</option>
                            </select>
                        </label>
                    </div>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant=""
                            id="dropdown-basic"
                            title={translate("Display Columns")}
                        >
                            <i className="las la-eye"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {ColumnnOptions.map((Columnn) => (
                                <Dropdown.Item
                                    as="button"
                                    style={{ display: "flex", alignItems: "center" }}
                                    key={Columnn.key}
                                >
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedColumns[Columnn.key as keyof selectedColumnsType]}
                                        onChange={() => handleColumnnChange(Columnn.key as keyof selectedColumnsType)}
                                    />
                                    <span style={{ marginLeft: "10px" }}>
                                        {translate(Columnn.label)}
                                    </span>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            <div className="row m-1">
                <Table className="dataTable" responsive>
                    <thead className="bg-white text-uppercase">
                        <tr className="ligth ligth-data">
                            <th>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                    //checked={selectAll}
                                    // onChange={handleSelectAll}
                                    />
                                </div>
                            </th>
                            {selectedColumns.id_garage && (<th className="sorting" onClick={() => handleSortingColumn("id_garage")} >  {"Id " + translate("Garage")} </th>)}
                            {selectedColumns.immatriculation_vehicule && (<th className="sorting" onClick={() => handleSortingColumn("immatriculation_vehicule")}>    {translate("Vehicle")} </th>)}
                            {selectedColumns.subject && (<th className="sorting" onClick={() => handleSortingColumn("subject")}  > {translate("Object")} </th>)}
                            {selectedColumns.priority && (<th className="sorting" onClick={() => handleSortingColumn("Priority")}  > {translate("Priority")}  </th>)}
                            {selectedColumns.status && (<th className="sorting" onClick={() => handleSortingColumn("status")} >   {translate("Status")}  </th>)}
                            {selectedColumns.date_intervention && (<th className="sorting" onClick={() => handleSortingColumn("date_intervention")} > {translate("Intervention Requests")}  </th>)}
                            {selectedColumns.date_update && (<th className="sorting" onClick={() => handleSortingColumn("date_update")} >  {translate("Date") + " " + translate("Update")} </th>
                            )}
                            <th>{translate("Action")}</th>
                        </tr>
                    </thead>
                    <tbody className="light-body"> {loading ? (
                        <tr style={{ textAlign: "center" }}>
                            <td className="text-center" colSpan={10}>
                                <p>
                                    <PropagateLoader
                                        color={"#123abc"}
                                        loading={loading}
                                        size={20}
                                    />
                                </p>
                            </td>
                        </tr>
                    ) : list_garage.length > 0 ? (
                        list_garage.map((garage, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                        // Ajouter la logique pour sélectionner une violation
                                        // checked={selectedViolations.includes(violation.id_violation)}
                                        // onChange={() => handleSelectViolation(violation.id_violation)}
                                        />
                                    </div>
                                </td>
                                {selectedColumns.id_garage && (<td>{garage.id_garage}</td>)}
                                {selectedColumns.immatriculation_vehicule && <td>{garage.immatriculation_vehicule}</td>}
                                {selectedColumns.subject && <td>{garage.subject}</td>}
                                {selectedColumns.priority && <td>
                                    {garage.priority === "Urgent" ? (
                                        <>

                                            {translate("Urgent")}
                                        </>
                                    ) : (
                                        <>

                                            {translate("Normal")}
                                        </>
                                    )}
                                </td>}
                                {selectedColumns.status && <td>


                                    {garage.status === "Closed" ? (
                                        <>
                                            <i className="fas fa-check-circle" style={{ marginRight: "5px", color: "#28a745" }}></i>
                                            {translate("Closed")}
                                        </>
                                    ) : garage.status === "Under repair" ? ( 
                                        <>
                                            <i className="fas fa-tools" style={{ marginRight: "5px", color: "#007bff" }}></i>
                                            {translate("Under repair")}
                                        </>
                                    ) : garage.status === "Under diagnosis" ? (
                                        <>
                                            <i className="fas fa-stethoscope" style={{ marginRight: "5px", color: "#ffc107" }}></i>
                                            {translate("Under diagnosis")}
                                        </>
                                    ) : garage.status === "Request" ? (
                                        <>
                                            <i className="fas fa-hourglass-start" style={{ marginRight: "5px", color: "#17a2b8" }}></i>
                                            {translate("Request")}
                                        </>
                                    ) : garage.status === "Pending OR" ? (
                                        <>
                                            <i className="fas fa-clock" style={{ marginRight: "5px", color: "#fd7e14" }}></i>
                                            {translate("Pending OR")}
                                        </>
                                    ) : garage.status === "OR established" ? (
                                        <>
                                            <i className="fas fa-check-double" style={{ marginRight: "5px", color: "#6f42c1" }}></i>
                                            {translate("OR established")}
                                        </>
                                    ) : garage.status === "Pending part" ? (
                                        <>
                                            <i className="fas fa-box-open" style={{ marginRight: "5px", color: "#dc3545" }}></i>
                                            {translate("Pending part")}
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-question-circle" style={{ marginRight: "5px", color: "#6c757d" }}></i>
                                            {translate("Unknown")}
                                        </>
                                    )}


                                </td>
                                }
                                {selectedColumns.date_intervention && (<td>{formatDateToTimestamp(garage.date_intervention)}</td>)}
                                {selectedColumns.date_update && <td>{formatDateToTimestamp(garage.date_update)}</td>}
                                <td>
                                    <div className="d-flex align-items-center list-action">
                                        <Link
                                            to={``}
                                            onClick={() => handleUpdateGarage(garage.id_garage, id_user)}
                                            className="badge badge-success mr-2"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title={translate("Status") + " " + translate("Update")}
                                        >
                                            <i className="las la-sync" style={{ fontSize: "1.2em" }}></i>
                                        </Link>
                                        <Link
                                            to={``}
                                            className="badge bg-primary mr-2"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title={translate("See request")}
                                        >
                                            <i className="fa fa fa-eye" style={{ fontSize: "1.2em" }}></i>
                                        </Link>
                                        <Link
                                            to={``}
                                            className="badge badge-success mr-2"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title={translate("Estimate")}
                                        >
                                            <i className="las la-chart-bar" style={{ fontSize: "1.2em" }}></i>
                                        </Link>
                                        <Link
                                            to={``}
                                            className="badge bg-warning mr-2"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title={translate("Request for parts")}
                                        >
                                            <i className="ri-delete-bin-line mr-0" style={{ fontSize: "1.2em" }}></i>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={10} style={{ textAlign: "center" }}>Aucun conducteur disponible</td>
                        </tr>
                    )}

                    </tbody>
                </Table>
            </div>
            <div className="row">
                <div className="col-md-6 d-flex align-items-center">
                    <span>
                        {translate("Displaying")} {list_garage.length} {translate("on")} {total} {" "}
                    </span>
                </div>
                <div className="col-md-6 d-flex justify-content-end">
                    <ReactPaginate
                        previousLabel={translate("previous")}
                        nextLabel={translate("next")}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination justify-right"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                    />
                </div>
            </div>
            <UpdateStatusGarageModal
                show={modalGarageStatus !== null}
                onHide={closeGarageModal}
                status={modalGarageStatus}
                title={titleGarageStatus}
                id_user={IdUser}
                id_garage={IdGarage}
                updateGarageList={handleUpdateGarageList}
            />

        </>
    );
}
