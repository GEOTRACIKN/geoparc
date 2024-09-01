import { useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";
import ModalNewIntervention from "../components/NewIntervention"


interface Intervention {
    id_intervention: number;
    date_intervention: string;
    client: string;
    vehicule: string;
    odometre: string;
    priotité: string;
    etat: string;
    date_modifie: string;


}

export function Reception() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const { translate } = useTranslate();
    const [list_intervention, setintervention] = useState<Intervention[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);



    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const getIntervention = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/intervention/${id_user}/${currentPage}/${limit}`
            );
            const data = await response.json();
            setintervention(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Intervention Requests")}</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <Button onClick={handleShow} className="btn btn-primary mt-2 mr-1">
                        <i className="las la-plus mr-3"></i>

                        {translate("New Request")}
                    </Button>
                </div>
            </div>
            <div className="row">
                <div
                    className="col-md-4"
                    style={{ margin: "0px 0px 10px 0px", padding: "10px" }}
                ></div>
                <div className="col-md-8 d-flex justify-content-end align-items-center">
                    {/* Dropdown Pour le Show du tableau */}
                    <Dropdown>
                        <Dropdown.Toggle
                            variant=""
                            id="dropdown-basic"
                            title="Résultats d'affichage"
                        >
                            <i className="fas fa-list-alt"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu></Dropdown.Menu>
                    </Dropdown>
                    {/* Dropdown Pour le filtrage du tableau */}
                    <Dropdown>
                        <Dropdown.Toggle
                            variant=""
                            id="dropdown-basic"
                            title="Colonnes dʼaffichage"
                        >
                            <i className="fas fa-eye"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as="button"
                                style={{ display: "flex", alignItems: "center" }}
                            ></Dropdown.Item>
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
                            <th>Id</th>
                            <th>{translate("Date")}</th>
                            <th>{translate("Client")}</th>
                            <th>{translate("Vehicle")}</th>
                            <th>{translate("Odometer")}</th>
                            <th>{translate("Priority")}</th>
                            <th>{translate("Status")}</th>
                            <th>{translate("Last Updated Date")}</th>
                            <th>{translate("Actions")}</th>
                        </tr>
                    </thead>
                    <tbody className="light-body">
                        {list_intervention.map((Intervention, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                        // checked={selectedViolations.includes(
                                        //     violation.id_violation
                                        // )}
                                        // onChange={() =>
                                        //     handleSelectViolation(violation.id_violation)
                                        // }
                                        />
                                    </div>
                                </td>
                                <td>{Intervention.id_intervention}</td>
                                <td>{Intervention.date_intervention}</td>
                                <td>{Intervention.client}</td>
                                <td>{Intervention.vehicule}</td>
                                <td>{Intervention.odometre}</td>
                                <td>{Intervention.priotité}</td>
                                <td>{Intervention.etat}</td>
                                <td>{Intervention.date_modifie}</td>
                                <td>
                                    <div className="d-flex align-items-center list-action">
                                        <Link
                                            to={``}
                                            className="badge badge-success mr-2"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Détail"
                                        >
                                            <i
                                                className="fa fa-eye"
                                                style={{ fontSize: "1.2em" }}
                                            ></i>
                                        </Link>
                                        <a
                                            className="badge bg-warning mr-2"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Delete"
                                        >
                                            <i
                                                className="ri-delete-bin-line mr-0"
                                                style={{ fontSize: "1.2em" }}
                                            ></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className="row">
                <div className="col-md-6 d-flex align-items-center">
                    <span>
                        Affichage 1 à {1} sur {1}{" "}
                    </span>
                </div>
                <div className="col-md-6">
                    <ReactPaginate
                        previousLabel={"previous"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        pageCount={1}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        // onPageChange={}
                        containerClassName={"pagination justify-content-end"}
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
            <ModalNewIntervention
                show={show}
                handleClose={handleClose}
                refreshintervention={() => { getIntervention() }}
            />


        </>
    );
}
