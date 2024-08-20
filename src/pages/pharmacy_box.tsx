import { useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import AdvancedSearch from "../components/AdvancedSearch";



export function PharmacyBox() {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('Id');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    
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
                    Pharmacy box
                    </h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <Button onClick={handleShow} className="btn btn-primary mt-2 mr-1">
                        <i className="las la-plus mr-3"></i>
                        Add emergency box
                    </Button>
                </div>

                {/* Modal pour Nouvelle Demande */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Nouvelle demande</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formDate">
                                <Form.Label>Date de la demande</Form.Label>
                                <Form.Control type="date" />
                            </Form.Group>

                            <Form.Group controlId="formPriority">
                                <Form.Label></Form.Label>
                                <Form.Control as="select">
                                    <option>Priorité</option>
                                    <option>Normal</option>
                                    <option>Urgent</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formVehicle">
                                <Form.Label>Véhicule</Form.Label>
                                <Form.Control type="text" placeholder="Entrez le véhicule" />
                            </Form.Group>

                            <Form.Group controlId="formMileage">
                                <Form.Label>Kilométrage</Form.Label>
                                <Form.Control type="number" placeholder="Entrez le kilométrage" />
                            </Form.Group>

                            <Form.Group controlId="formSubject">
                                <Form.Label>Objet</Form.Label>
                                <Form.Control type="text" placeholder="Entrez l'objet de la demande" />
                            </Form.Group>

                            <Form.Group controlId="formClient">
                                <Form.Label>Client</Form.Label>
                                <Form.Control type="text" placeholder="Entrez le nom du client" />
                            </Form.Group>

                            <Form.Group controlId="formClientPhone">
                                <Form.Label>Tél Client</Form.Label>
                                <Form.Control type="text" placeholder="Entrez le numéro de téléphone du client" />
                            </Form.Group>

                            <Form.Group controlId="formReceptionistName">
                                <Form.Label>Nom du Réceptionniste</Form.Label>
                                <Form.Control type="text" placeholder="Entrez le nom du réceptionniste" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Annuler
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Sauvegarder la demande
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
                            <th>Date</th>
                            <th>Client</th>
                            <th>Véhicule</th>
                            <th>Odométre</th>
                            <th>Priorité</th>
                            <th>Etat</th>
                            <th>Date Maj</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody key="#" className="ligth-body">
                        <tr className={""}>
                            <td>
                                <div className="form-check form-check-inline">
                                    <input type="checkbox" className="form-check-input" />
                                </div>
                            </td>
                            <td>1</td>
                            <td>2018-09-02</td>
                            <td>EEGH</td>
                            <td>Nissan Micra 02891-117-31</td>
                            <td>10427 Km</td>
                            <td>Normal</td>
                            <td>Cloturée</td>
                            <td>2023-10-5</td>
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

