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
  title?: string; // optional title like "Insurance List"
  iconClass?: string; // optional icon like "las la-car"
}

export default function DataTable({ fetchUrl, columns, title, iconClass }: DataTableProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(
    () => columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {} as Record<string, boolean>)
  );

  useEffect(() => {
    setLoading(true);
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        const validData = Array.isArray(data) ? data : [];
        setRows(validData);
        setPageCount(Math.ceil(validData.length / limit));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setRows([]);
        setLoading(false);
      });
  }, [fetchUrl, limit]);

  const paginatedRows = rows.slice((currentPage - 1) * limit, currentPage * limit);

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
      const updated = [...selectedRows, id];
      setSelectedRows(updated);
      if (updated.length === paginatedRows.length) setSelectAll(true);
    }
  };

  const handleColumnChange = (key: string) => {
    setSelectedColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
      {/* ---------- HEADER / TOOLBAR ---------- */}
      <div className="row mb-2">
        <div className="col-sm-12 col-md-6 dataTables_length">
          {title && (
            <h4 className="mb-3 text-nowrap">
              {iconClass && <i className={`${iconClass} mr-2`}></i>}
              {title} ({rows.length})
            </h4>
          )}
        </div>

        <div className="col-sm-12 col-md-6 d-flex justify-content-end align-items-center">

            <label className="mr-2"></label>
              Show
              <select
                value={limit}
                onChange={handleLimitChange}
                className="custom-select custom-select-sm form-control form-control-sm ml-2"
                style={{ width: "66px" }}
              >
                {[10, 20, 50, 100, 200, 500].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            
  

          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-basic" title="Display columns">
              <i className="las la-eye"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              {columns.map((col) => (
                <Dropdown.Item
                  as="button"
                  key={col.key}
                  style={{ display: "flex", alignItems: "center" }}
                >
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

      {/* ---------- TABLE ---------- */}
      <div className="row m-1 table-responsive">
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
                <tr key={row.id_vehicule || JSON.stringify(row)}>
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

      {/* ---------- FOOTER / PAGINATION ---------- */}
      <div className="row mt-2">
        <div className="col-md-6 d-flex align-items-center">
          <span>
            Displaying {paginatedRows.length} on {rows.length}
          </span>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
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
            forcePage={currentPage - 1}
          />
        </div>
      </div>
    </div>
  );
}
