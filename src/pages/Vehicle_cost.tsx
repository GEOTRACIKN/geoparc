import { Button, Dropdown, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export function VehicleCost() {

  const { translate } = useTranslate();
  const [selectedDates, setSelectedDates] = useState(Array(10).fill(null)); // Tableau d'états pour stocker les dates sélectionnées, initialisé à null pour chaque ligne

  const [currentPage, setCurrentPage] = useState(0); // État pour suivre la page actuelle
  const itemsPerPage = 5; // Nombre d'éléments par page


  const handleDateChange = (date:any, index:number) => {
    const newSelectedDates = [...selectedDates]; // Crée une copie du tableau d'états
    newSelectedDates[index] = date; // Met à jour la date sélectionnée pour la ligne spécifiée
    setSelectedDates(newSelectedDates); // Met à jour le tableau d'états
  };
  
	


  // Données statiques
  const staticData = [
    { id: 1, vehicule: "Ford US Fiesta 19953-114-31 / F500", Vérificateur: "John Doe", Nom_Chaffeur_Sortant: "Alice", Nom_Chaffeur_Entrant: "Bob", immatriculation: "XYZ123", maintenance: "Scheduled", actions: "Edit/Delete" },
    { id: 2, vehicule: "Nissan Micra 02891-117-31 /", Vérificateur: "Jane Smith", Nom_Chaffeur_Sortant: "Eve", Nom_Chaffeur_Entrant: "Charlie", immatriculation: "ABC456", maintenance: "Unscheduled", actions: "Edit/Delete" },
    { id: 3, vehicule: "Iveco Trakker AT400T46 04143-512-31 / 2909", Vérificateur: "Michael Johnson", Nom_Chaffeur_Sortant: "Grace", Nom_Chaffeur_Entrant: "David", immatriculation: "DEF789", maintenance: "Scheduled", actions: "Edit/Delete" },
    { id: 4, vehicule: "Iveco Daily 3200-314-31 / 4055", Vérificateur: "Sarah Williams", Nom_Chaffeur_Sortant: "Frank", Nom_Chaffeur_Entrant: "Emily", immatriculation: "GHI012", maintenance: "Unscheduled", actions: "Edit/Delete" },
    { id: 5, vehicule: "Liebherr Liebherr 974 Pelle hydraulique 1083-215-37 /", Vérificateur: "Chris Brown", Nom_Chaffeur_Sortant: "Hannah", Nom_Chaffeur_Entrant: "George", immatriculation: "JKL345", maintenance: "Scheduled", actions: "Edit/Delete" },
    { id: 6, vehicule: "Renault Symbole 1111-114-31 /", Vérificateur: "Amanda Davis", Nom_Chaffeur_Sortant: "Isaac", Nom_Chaffeur_Entrant: "Olivia", immatriculation: "MNO678", maintenance: "Unscheduled", actions: "Edit/Delete" },
    { id: 7, vehicule: "Peugeot 207 12345-112-16 / VP001", Vérificateur: "Jason Taylor", Nom_Chaffeur_Sortant: "Julia", Nom_Chaffeur_Entrant: "Kevin", immatriculation: "PQR901", maintenance: "Scheduled", actions: "Edit/Delete" },
    { id: 8, vehicule: "Opel Corsa 20119-116-31 / 12", Vérificateur: "Lisa Martinez", Nom_Chaffeur_Sortant: "Liam", Nom_Chaffeur_Entrant: "Natalie", immatriculation: "STU234", maintenance: "Unscheduled", actions: "Edit/Delete" },
    { id: 9, vehicule: "Nissan Micra 1111-111-11 /", Vérificateur: "Matthew Rodriguez", Nom_Chaffeur_Sortant: "Sophia", Nom_Chaffeur_Entrant: "Robert", immatriculation: "VWX567", maintenance: "Scheduled", actions: "Edit/Delete" },
    { id: 10, vehicule: "Man TGA410 06050-506-42 /", Vérificateur: "Jennifer Wilson", Nom_Chaffeur_Sortant: "Tom", Nom_Chaffeur_Entrant: "Victoria", immatriculation: "YZA890", maintenance: "Unscheduled", actions: "Edit/Delete" }
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
            <i className="las la-car" data-rel="bootstrap-tooltip" title="Increased"></i>{translate('Vehicle Cost')}
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
        <div className="col-md-4" style={{ margin: "0px 0px 10px 0px", padding: "10px" }}>
          <div className="input-group">
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-basic">
                <i className="fas fa-chevron-down" style={{ color: 'black' }}></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item >Vehicle</Dropdown.Item>
                <Dropdown.Item >Date</Dropdown.Item>
                <Dropdown.Item >Vehicle Cost</Dropdown.Item>
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
          <Dropdown>
            <Dropdown.Toggle variant="link" id="dropdown-basic">
              Filtre   
            </Dropdown.Toggle>
            <Dropdown.Menu>
            <Dropdown.Item >Vehicle</Dropdown.Item>
                <Dropdown.Item >Date</Dropdown.Item>
                <Dropdown.Item >Vehicle Cost</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="row m-2">
          <Table>
            <thead className="bg-white text-uppercase">
              <tr className="ligth ligth-data">
                {/* <th>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                    />
                    <label className="form-check-label"></label>
                  </div>
                </th> */}
                <th>Vehicle</th>
                <th>Date</th>
                <th>Vehicle Cost</th>
              </tr>
            </thead>
            <tbody key="#" className="ligth-body">
              {currentItems.map((data,index) => (
                <tr className={''} key={data.id}>
                  {/* <td>
                    <div className="form-check form-check-inline">
                      <input
                        type="checkbox"
                        className="form-check-input"
                      />
                    </div>
                  </td> */}
                  <td>{data.vehicule}</td>
                  <td>
              <DatePicker
                selected={selectedDates[index]} // Utilisez selectedDates[index] pour obtenir la date sélectionnée pour cette ligne
                onChange={(date) => handleDateChange(date, index)} // Passez l'index de la ligne à la fonction de gestion de changement de date
                dateFormat="yyyy-MM-dd HH:mm:ss"
                showTimeSelect
                timeFormat="HH:mm:ss"
                timeIntervals={1}
                timeCaption="Time"
                placeholderText="select a date "
              />
            </td>

                  <td>
                    <div className="d-flex align-items-center list-action">
                    
                      <a
                        className="badge bg-primary mr-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="cost"
                        data-original-title="cost"
                      >
                        <i className="las la-receipt" style={{ fontSize: '1.2em' }}></i>
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