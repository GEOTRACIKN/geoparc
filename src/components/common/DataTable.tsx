import { useState, useEffect } from "react";
import { Table, Dropdown } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { PropagateLoader } from "react-spinners";

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  fetchUrl: string;
  columns: Column[];
}

export default function DataTable({ fetchUrl, columns }: DataTableProps) {
  const [rows, setRows] = useState<any[]>([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(
    () =>
      columns.reduce(
        (acc, col) => ({ ...acc, [col.key]: true }),
        {} as Record<string, boolean>
      )
  );


  useEffect(() => {
    setLoading(true);
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log("DataTable fetched:", data);
        // 👇 Ensure we always store an array
        setRows(Array.isArray(data) ? data : []);
        setPageCount(Math.ceil((Array.isArray(data) ? data.length : 0) / limit));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setRows([]);
        setLoading(false);
      });
  }, [fetchUrl, limit]);

  //Pagination logic
  const paginatedRows = rows.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handlePageClick = (selected: { selected: number }) =>
    setCurrentPage(selected.selected + 1);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) setSelectedRows(paginatedRows.map((r: any) => r.id_vehicule));
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

  const handleColumnChange = (key: string) => {
    setSelectedColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };


  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div></div>

        <div className="d-flex align-items-center">
          <label className="mr-2">Show</label>
          <select
            className="custom-select"
            value={limit}
            onChange={handleLimitChange}
            style={{ width: "80px", marginRight: "10px" }}
          >
            {[10, 20, 50, 100, 200, 500].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-columns">
              <i className="las la-eye"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              {columns.map((col) => (
                <Dropdown.Item key={col.key} as="button">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedColumns[col.key]}
                    onChange={() => handleColumnChange(col.key)}
                  />
                  <span className="ml-2">{col.label}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div className="table-responsive">
        <Table className="dataTable">
          <thead className="bg-white text-uppercase">
            <tr>
              <th>
                <div className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </div>
              </th>
              {columns.map(
                (col) =>
                  selectedColumns[col.key] && <th key={col.key}>{col.label}</th>
              )}
            </tr>
          </thead>

          <tbody className="ligth-body">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center">
                  <PropagateLoader color={"#123abc"} loading={loading} size={15} />
                </td>
              </tr>
            ) : paginatedRows.length > 0 ? (
              paginatedRows.map((row: any) => (
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
                  {columns.map(
                    (col) =>
                      selectedColumns[col.key] && (
                        <td key={col.key}>{row[col.key] ?? ""}</td>
                      )
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center">
                  No records found
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
