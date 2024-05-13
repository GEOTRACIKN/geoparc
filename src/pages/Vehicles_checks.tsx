import { Dropdown, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { useState } from "react";

export function Vehicleschecks() {
  const { translate } = useTranslate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const [visibleColumns, setVisibleColumns] = useState([
    "creationDate",
    "auditor",
    "outgoingDriver",
    "incomingDriver",
    "immatriculation",
    "maintenance",
    "actions",
  ]);

  const staticData = [
    { id: 1, creationDate: "2024-05-12", auditor: "John Doe", outgoingDriver: "Alice", incomingDriver: "Bob", immatriculation: "XYZ123", maintenance: "Scheduled", actions: "Edit/Delete" },
    // Ajoutez d'autres données ici...
  ];

  const handlePageClick = async (data: any) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
    window.scrollTo(0, 0);
  };

  const toggleColumnVisibility = (columnName: string) => {
    setVisibleColumns((prevColumns) => {
      if (prevColumns.includes(columnName)) {
        // Retirer la colonne si elle est déjà visible
        return prevColumns.filter((col) => col !== columnName);
      } else {
        // Ajouter la colonne si elle n'est pas visible
        return [...prevColumns, columnName];
      }
    });
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
        <div className="col-md-4" style={{ margin: "0px 0px 10px 0px", padding: "10px" }}>
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
              {Object.keys(staticData[0]).map((columnName) => (
                <Dropdown.Item key={columnName} onClick={() => toggleColumnVisibility(columnName)}>
                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(columnName)}
                      onChange={() => toggleColumnVisibility(columnName)}
                    />
                    {translate(columnName)}
                  </label>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="row m-2">
          <Table >
            <thead>
              <tr>
                {visibleColumns.map(column => (
                  <th key={column}>{translate(column)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map(data => (
                <tr key={data.id}>
                  {visibleColumns.map(column => (
                    <td key={column}>  {(data as any)[column]} </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={2} // Vous devez utiliser 2 ici
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
