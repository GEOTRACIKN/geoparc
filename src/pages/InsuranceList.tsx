import { Table, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { PropagateLoader } from "react-spinners";

export default function InsuranceList() {
  type InsuranceRow = {
    id_vehicule: number;
    immatriculation_vehicule: string;
    companie_assurance_vehicule: string;
    date_debut_assurance_vehicule: string;
    date_expir_assurance_vehicule: string;
    cout_assurance_vehicule: string;
  };

  const [rows, setRows] = useState<InsuranceRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [paginatedRows, setPaginatedRows] = useState<InsuranceRow[]>([]);
  const [loading, setLoading] = useState(true);

  type ColumnKeys = keyof typeof selectedColumns;
  const [selectedColumns, setSelectedColumns] = useState({
    immatriculation_vehicule: true,
    companie_assurance_vehicule: true,
    date_debut_assurance_vehicule: true,
    date_expir_assurance_vehicule: true,
    cout_assurance_vehicule: true,
  });

  const handleColumnChange = (column: ColumnKeys) => {
    setSelectedColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) setSelectedRows(paginatedRows.map((r) => r.id_vehicule));
    else setSelectedRows([]);
  };

  const handleRowSelect = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedRows, id];
      setSelectedRows(newSelected);
      if (newSelected.length === paginatedRows.length) setSelectAll(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/geop/insurance/list")
      .then((res) => res.json())
      .then((data: InsuranceRow[]) => {
        setRows(data);
        setPageCount(Math.ceil(data.length / limit));
        setLoading(false);
      });
  }, [limit]);

  useEffect(() => {
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    setPaginatedRows(rows.slice(start, end));
    setSelectedRows([]);
    setSelectAll(false);
  }, [rows, currentPage, limit]);

  const handlePageClick = (selected: { selected: number }) => {
    setCurrentPage(selected.selected + 1);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-3">
      <h2>Insurance List</h2>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>{/* Left empty for now */}</div>

        <div className="d-flex align-items-center">
          <label className="mr-2">Show</label>
          <select
            className="custom-select"
            value={limit}
            onChange={handleLimitChange}
            style={{ width: "80px", marginRight: "10px" }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
          </select>

          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-columns">
              <i className="las la-eye"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              {(Object.keys(selectedColumns) as ColumnKeys[]).map((col) => (
                <Dropdown.Item
                  key={col}
                  as="button"
                  className="d-flex align-items-center"
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedColumns[col]}
                    onChange={() => handleColumnChange(col)}
                  />
                  <span className="ml-2 text-capitalize">
                    {col.replace(/_/g, " ")}
                  </span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div className="table-responsive">
        <Table className="dataTable">
          <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
              <th>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </div>
              </th>
              {selectedColumns.immatriculation_vehicule && <th>Plate</th>}
              {selectedColumns.companie_assurance_vehicule && <th>Company</th>}
              {selectedColumns.date_debut_assurance_vehicule && <th>Start</th>}
              {selectedColumns.date_expir_assurance_vehicule && <th>End</th>}
              {selectedColumns.cout_assurance_vehicule && <th>Cost</th>}
            </tr>
          </thead>

          <tbody className="ligth-body">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center">
                  <PropagateLoader color={"#123abc"} loading={loading} size={15} />
                </td>
              </tr>
            ) : paginatedRows.length > 0 ? (
              paginatedRows.map((row) => (
                <tr key={row.id_vehicule}>
                  <td>
                    <div className="form-check form-check-inline">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedRows.includes(row.id_vehicule)}
                        onChange={() => handleRowSelect(row.id_vehicule)}
                      />
                    </div>
                  </td>
                  {selectedColumns.immatriculation_vehicule && <td>{row.immatriculation_vehicule}</td>}
                  {selectedColumns.companie_assurance_vehicule && <td>{row.companie_assurance_vehicule}</td>}
                  {selectedColumns.date_debut_assurance_vehicule && <td>{row.date_debut_assurance_vehicule}</td>}
                  {selectedColumns.date_expir_assurance_vehicule && <td>{row.date_expir_assurance_vehicule}</td>}
                  {selectedColumns.cout_assurance_vehicule && <td>{row.cout_assurance_vehicule}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No insurance records
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-end mt-2">
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
          forcePage={currentPage - 1}
        />
      </div>
    </div>
  );
}
