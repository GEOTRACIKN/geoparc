import { useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import AdvancedSearch from "../components/AdvancedSearch";
import { useTranslate } from "../components/LanguageProvider";




export function Reception() {
    const { translate } = useTranslate();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('Id');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const data = [
        {
            id: 1,
            date: "2023-08-01",
            client: "Client A",
            vehicle: "Toyota Prius 12345",
            odometer: "5021 Km",
            priority: "Urgent",
            status: "En cours",
            lastUpdate: "2023-08-05",
        },
        {
            id: 2,
            date: "2023-07-25",
            client: "Client B",
            vehicle: "Ford Fiesta 67890",
            odometer: "11020 Km",
            priority: "Normal",
            status: "Cloturée",
            lastUpdate: "2023-07-29",
        },
        {
            id: 3,
            date: "2023-07-15",
            client: "Client C",
            vehicle: "Honda Civic 11121",
            odometer: "7560 Km",
            priority: "Urgent",
            status: "En attente",
            lastUpdate: "2023-07-17",
        },
        // Add more objects here to have 10 rows
    ];

    // Function to handle search
    const searchOptions = ['Id', 'Client', 'Véhicule'];
    const handleSearch = (term: string, type: string) => {
    };

    const clearSearchTerm = () => {
        setSearchTerm('');

    };


    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>

                        {translate("Intervention Requests")}
                    </h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <Button onClick={handleShow} className="btn btn-primary mt-2 mr-1">
                        <i className="las la-plus mr-3"></i>

                        {translate("New Request")}
                    </Button>
                </div>

                {/* Modal pour Nouvelle Demande */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{translate("New Request")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formDate">
                                <Form.Label>{translate("Request Date")}</Form.Label>
                                <Form.Control type="date" />
                            </Form.Group>

                            <Form.Group controlId="formPriority">
                                <Form.Label></Form.Label>
                                <Form.Control as="select">
                                    <option>{translate("Priority")}</option>
                                    <option>{translate("Normal")}</option>
                                    <option>{translate("Urgent")}</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formVehicle">
                                <Form.Label>{translate("Vehicle")}</Form.Label>
                                <Form.Control type="text" placeholder="Entrez le véhicule" />
                            </Form.Group>

                            <Form.Group controlId="formMileage">
                                <Form.Label>{translate("Km")}</Form.Label>
                                <Form.Control type="number" placeholder="Entrez le kilométrage" />
                            </Form.Group>

                            <Form.Group controlId="formSubject">
                                <Form.Label>{translate("Subject")}</Form.Label>
                                <Form.Control type="text" placeholder="Entrez l'objet de la demande" />
                            </Form.Group>

                            <Form.Group controlId="formClient">
                                <Form.Label>{translate("Client")}</Form.Label>
                                <Form.Control type="text" placeholder="Entrez le nom du client" />
                            </Form.Group>

                            <Form.Group controlId="formClientPhone">
                                <Form.Label>{translate("Client Phone")}</Form.Label>
                                <Form.Control type="text" placeholder="Entrez le numéro de téléphone du client" />
                            </Form.Group>

                            <Form.Group controlId="formReceptionistName">
                                <Form.Label>{translate("Receptionist's Name")}</Form.Label>
                                <Form.Control type="text" placeholder="Entrez le nom du réceptionniste" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            {translate("Cancel")}
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            {translate("Save Request")}
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
            <div className="row">
                <div className="col-md-4" style={{ margin: '0px 0px 10px 0px', padding: '10px' }}>
                    <AdvancedSearch
                        searchOptions={searchOptions}
                        onSearch={handleSearch}
                        clearSearchTerm={clearSearchTerm}
                        placeholderText={`${searchType}`}
                    />
                </div>
                <div className="col-md-8 d-flex justify-content-end align-items-center">
                    {/* Dropdown Pour le Show du tableau */}
                    <Dropdown>
                        <Dropdown.Toggle variant="" id="dropdown-basic" title="Résultats d'affichage">
                            <i className="fas fa-list-alt"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>

                        </Dropdown.Menu>

                    </Dropdown>
                    {/* Dropdown Pour le filtrage du tableau */}
                    <Dropdown>
                        <Dropdown.Toggle variant="" id="dropdown-basic" title="Colonnes dʼaffichage">
                            <i className="fas fa-eye"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>

                            </Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <div className="row m-1">
                <Table>
                    <thead className="bg-white text-uppercase">
                        <tr className="ligth ligth-data">
                            <th>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" />
                                    <label className="form-check-label"></label>
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
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="form-check form-check-inline">
                                        <input type="checkbox" className="form-check-input" />
                                    </div>
                                </td>
                                <td>{item.id}</td>
                                <td>{item.date}</td>
                                <td>{item.client}</td>
                                <td>{item.vehicle}</td>
                                <td>{item.odometer}</td>
                                <td>{item.priority}</td>
                                <td>{item.status}</td>
                                <td>{item.lastUpdate}</td>
                                <td>
                                    <div className="d-flex align-items-center list-action">
                                        <Link
                                            to={``}
                                            className="badge badge-success mr-2"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Détail"
                                        >
                                            <i className="fa fa-eye" style={{ fontSize: "1.2em" }}></i>
                                        </Link>
                                        <a
                                            className="badge bg-warning mr-2"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Delete"
                                        >
                                            <i className="ri-delete-bin-line mr-0" style={{ fontSize: "1.2em" }}></i>
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
                    <span>Affichage 1 à {1} sur {1} </span>
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

        </>
    );

}

