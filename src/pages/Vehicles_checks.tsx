import { Button, Dropdown, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { useState } from "react";



export function Vehicleschecks() {

    const { translate } = useTranslate();
    const [currentPage, setCurrentPage] = useState(0); // État pour suivre la page actuelle
    const itemsPerPage = 5; // Nombre d'éléments par page



      // Données statiques
      const staticData = [
        { id: 1, creationDate: "2024-05-12", auditor: "John Doe", outgoingDriver: "Alice", incomingDriver: "Bob", immatriculation: "XYZ123", maintenance: "Scheduled", actions: "Edit/Delete" },
        { id: 2, creationDate: "2024-05-13", auditor: "Jane Smith", outgoingDriver: "Eve", incomingDriver: "Charlie", immatriculation: "ABC456", maintenance: "Unscheduled", actions: "Edit/Delete" },
        { id: 3, creationDate: "2024-05-14", auditor: "Michael Johnson", outgoingDriver: "Grace", incomingDriver: "David", immatriculation: "DEF789", maintenance: "Scheduled", actions: "Edit/Delete" },
        { id: 4, creationDate: "2024-05-15", auditor: "Sarah Williams", outgoingDriver: "Frank", incomingDriver: "Emily", immatriculation: "GHI012", maintenance: "Unscheduled", actions: "Edit/Delete" },
        { id: 5, creationDate: "2024-05-16", auditor: "Chris Brown", outgoingDriver: "Hannah", incomingDriver: "George", immatriculation: "JKL345", maintenance: "Scheduled", actions: "Edit/Delete" },
        { id: 6, creationDate: "2024-05-17", auditor: "Amanda Davis", outgoingDriver: "Isaac", incomingDriver: "Olivia", immatriculation: "MNO678", maintenance: "Unscheduled", actions: "Edit/Delete" },
        { id: 7, creationDate: "2024-05-18", auditor: "Jason Taylor", outgoingDriver: "Julia", incomingDriver: "Kevin", immatriculation: "PQR901", maintenance: "Scheduled", actions: "Edit/Delete" },
        { id: 8, creationDate: "2024-05-19", auditor: "Lisa Martinez", outgoingDriver: "Liam", incomingDriver: "Natalie", immatriculation: "STU234", maintenance: "Unscheduled", actions: "Edit/Delete" },
        { id: 9, creationDate: "2024-05-20", auditor: "Matthew Rodriguez", outgoingDriver: "Sophia", incomingDriver: "Robert", immatriculation: "VWX567", maintenance: "Scheduled", actions: "Edit/Delete" },
        { id: 10, creationDate: "2024-05-21", auditor: "Jennifer Wilson", outgoingDriver: "Tom", incomingDriver: "Victoria", immatriculation: "YZA890", maintenance: "Unscheduled", actions: "Edit/Delete" }
    ];
    
   
    const handlePageClick = async (data: any) => {
        const selectedPage = data.selected;
        setCurrentPage(selectedPage); // Mettre à jour la page actuelle
        window.scrollTo(0, 0); // Fait défiler vers le haut de la page
    };

    // Calcule l'indice de début et de fin pour les éléments à afficher
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Extrait les éléments correspondant à la page actuelle
    const currentItems = staticData.slice(startIndex, endIndex);
    
    
   
    return (
        <>
         <div className="row">
          <div className="col-md-6 col-sm-12">
            <h4>
              <i className="las la-car" data-rel="bootstrap-tooltip" title="Increased"></i>{translate('List of checks')}
            </h4>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="text-right">
              <Link to="#" className="btn btn-primary mt-2 mr-1">
                <i className="las la-plus mr-3"></i>
                {translate('Add Verification')}   
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
        <div className="col-md-4"  style={{ margin: "0px 0px 10px 0px", padding: "10px" }}>
            <div className="input-group">
                <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                    <i className="fas fa-chevron-down" style={{ color: 'black' }}></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item >test1</Dropdown.Item>
                        <Dropdown.Item >test2</Dropdown.Item>
                        <Dropdown.Item >test3</Dropdown.Item>
                        <Dropdown.Item >test4</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <input
                    type="text"
                    placeholder="test"
                    className="form-control"
                    //onChange={}
                    //value={searchTerm}
                />
              
            </div>
      </div>
        <div className="col-md-8 d-flex justify-content-end align-items-center">
            <div className="dataTables_length" id="DataTables_Table_0_length">
                <label className="mr-2">
                {translate('Show')}
                <select
                    name="DataTables_Table_0_length"
                    aria-controls="DataTables_Table_0"
                    className="custom-select custom-select-sm form-control form-control-sm ml-2"
                    style={{ width: "66px" }}
                    //onChange={}
                >
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                    <option value="180">180</option>
                    <option value="300">300</option>
                    <option value="600">600</option>
                    <option value="900">900</option>
                </select>
                {translate('entries')}
                </label>
            </div>
            <div className="ml-3">
            <button className="btn btn-secondary">
                {translate('Filter')}
            </button>
    </div>

        </div>
        <div className="row m-2">
        <Table >
            <thead className="bg-white text-uppercase">
              <tr className="ligth ligth-data">
              <th>
                <div className="checkbox d-inline-block">
                <input
                className="form-check-input"
                    type="checkbox" 
                  />
                  <label className="mb-0"></label>
                </div>
              </th>
                <th>{translate('Creation date')}</th>
                <th>{translate('Auditor')}</th>
                <th>{translate('Name Outgoing Driver')}</th>
                <th>{translate('Name Incoming Driver')}</th>
                <th>{translate('Immatruculation')}</th>
                <th>{translate('Maintenance')}</th>
                <th>{translate('Actions')}</th>
              </tr>
            </thead>
            <tbody key="#">
                {currentItems.map((data) => (
                    <tr key={data.id}>
                        <td>
                            <div className="checkbox d-inline-block">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                />
                            </div>
                        </td>
                        <td>{data.creationDate}</td>
                        <td>{data.auditor}</td>
                        <td>{data.outgoingDriver}</td>
                        <td>{data.incomingDriver}</td>
                        <td>{data.immatriculation}</td>
                        <td>{data.maintenance}</td>
                        <td>
                            <div className="d-flex align-items-center list-action">
                            <Link
                                    to={`#`}
                                    className="badge badge-success mr-2"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Détail"
                                >
                            <i className="fa fa-eye" style={{ fontSize: '1.2em' }}></i>
                            </Link>
                            <a
                                className="badge bg-warning mr-2"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Delete"
                                data-original-title="Delete"
                            >
                            <i className="ri-delete-bin-line mr-0" style={{ fontSize: '1.2em' }}></i>
                            </a>
                            <a
                                className="badge bg-primary mr-2"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="download"
                                data-original-title="download"
                            >
                            <i className="las la-download" style={{ fontSize: '1.2em' }}></i>
                            </a>
                            </div>
                        </td>
                    </tr>
                ))}
             </tbody>
        </Table>       
        </div>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={2} // Ici, vous devez utiliser 2
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
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
        </>
    )
  
}