import React, { useState, useEffect } from "react";
import { Table, Dropdown } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { PropagateLoader } from "react-spinners";
import { useTranslate } from "../../hooks/LanguageProvider";
import {useClipboard} from "../../utilities/functions";

// render ASC/DESC arrows
const SortIcon = ({ active, direction }: { active: boolean; direction: string }) => {
  if (!active) return <i className="las la-sort"></i>;
  return direction === "ASC"
    ? <i className="las la-sort-up"></i>
    : <i className="las la-sort-down"></i>;
};

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  title?: string;
  iconClass?: string;
  data?: any[];
  loading?: boolean;
  sortColumn?: string;
  sortDirection?: "ASC" | "DESC";
  onSortChange?: (columnKey: string) => void;

  // allow parent to tell the table which field is the ID
  rowIdKey?: string; // example: "id_vehicule"
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pageCount?: number;
  currentPage?: number;
  limit?: number;
  totalCount?: number;
}

export default function DataTable({
  columns,
  title,
  iconClass,
  data,
  loading: loadingProp,
  sortColumn,
  sortDirection,
  onSortChange,

  // default: id_vehicule
  rowIdKey = "id_vehicule",
  onPageChange,
  onLimitChange,
  pageCount,
  currentPage,
  limit,
  totalCount,
}: DataTableProps) {
  const [rows, setRows] = useState<any[]>([]);

  const { translate } = useTranslate();
  const { copyToClipboard, copiedId } = useClipboard(translate("Matriculation Copied"));


  const effectiveLoading = loadingProp ?? false;


  //const [selectedRows, setSelectedRows] = useState<any[]>([]);
  //const [selectAll, setSelectAll] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(
    () => columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {} as Record<string, boolean>)
  );

  // If parent provides data, update rows when it changes
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setRows(data);
    }
  }, [data]);

  // selection uses row[rowIdKey]
  const getRowId = (row: any) => row[rowIdKey];

  // Select all
  /*const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(rows.map((r) => getRowId(r)));
    } else {
      setSelectedRows([]);
    }
  };*/

  // Toggle row selection
  /*const handleRowSelect = (id: any) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
      setSelectAll(false);
    } else {
      const updated = [...selectedRows, id];
      setSelectedRows(updated);
      if (updated.length === rows.length) setSelectAll(true);
    }
  };*/

  const handleColumnChange = (key: string) => {
    setSelectedColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">

      {/* ---------- HEADER / TOOLBAR ---------- */}
      <div className="row mb-1">
        <div className="col-sm-12 col-md-6 dataTables_length">
          {title && (
            <h4 className="mb-3 text-nowrap">
              {iconClass && <i className={`${iconClass} mr-2`}></i>}
              {title} ({rows.length})
            </h4>
          )}
        </div>

        <div className="col-sm-12 col-md-6 d-flex justify-content-end align-items-center">
          <span className="mr-2">{translate("Show")}</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange?.(parseInt(e.target.value))}
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
            <Dropdown.Toggle variant="" id="dropdown-basic" title={translate("Display columns")}>
              <i className="las la-eye"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
              {columns.map((col) => (
                <Dropdown.Item key={col.key} as="button" style={{ display: "flex", alignItems: "center" }}>
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

              {/* Checkbox column */}
              <th>
                {/*<div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </div>*/}
              </th>

              {/* Data columns */}
              {columns.map(
                (col) =>
                  selectedColumns[col.key] && (
                    <th
                      key={col.key}
                      style={{ cursor: "pointer"}}
                      onClick={() => onSortChange?.(col.key)}
                    >
                      <span className="mr-1" style={{ color: "#110a57" }}>{translate(col.label)}</span>

                      <SortIcon
                        active={sortColumn === col.key}
                        direction={sortDirection || "ASC"}
                      />
                    </th>
                  )
              )}
            </tr>
          </thead>

          <tbody className="ligth-body">
            {/* Loading */}
            {effectiveLoading ? (
              <tr style={{ textAlign: "center" }}>
                <td className="text-center" colSpan={10} >
                  <p>  
                   <PropagateLoader color={"#123abc"} loading={true} size={15} />
                  </p>
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row: any) => (
                <tr key={getRowId(row) ?? JSON.stringify(row)}>
                  <td>
                    <div className="form-check form-check-inline">
                      {/*<input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedRows.includes(getRowId(row))}
                        onChange={() => handleRowSelect(getRowId(row))}
                      />*/}
                    </div>
                  </td>

                  {columns.map(
                    (col) =>
                      selectedColumns[col.key] && (col.key === "immatriculation_vehicule" ? (
                      // COPY TO CLIPBOARD LOGIC
                      <td
                        key={col.key}
                        id={`plate-${getRowId(row)}`}
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          color: copiedId === getRowId(row)?.toString() ? "#28a745" : "#007bff"
                        }}
                        title={translate("Click to copy the plate number")}
                        onClick={() => {
                          if (row[col.key] && getRowId(row)) {
                            copyToClipboard(row[col.key], getRowId(row).toString());
                          }
                        }}
                      >
                        <>
                          <span
                            style={{
                              color:
                                copiedId === getRowId(row)?.toString()
                                  ? "#28a745"
                                  : "#007bff"
                            }}
                          >
                            {row[col.key]}
                          </span>

                          {copiedId === getRowId(row)?.toString() && (
                            <span
                              style={{
                                position: "absolute",
                                top: "-20px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                backgroundColor: "#28a745",
                                color: "#fff",
                                padding: "2px 5px",
                                borderRadius: "4px",
                                fontSize: "12px"
                              }}
                            >
                              {translate("Plate Number Copied")}
                            </span>
                          )}
                        </>
                      </td>
                    ) : (
                      <td key={col.key}>{row[col.key] ?? ""}</td>
                    )
                  )
                )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center">
                  {translate("No records found")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* ---------- FOOTER / PAGINATION ---------- */}
      <div className="row mt-2">
        <div className="col-md-6 d-flex align-items-center">
          <span>{translate("Displaying")} {rows.length} {translate("of")} {totalCount ?? rows.length}</span>
        </div>

        <div className="col-md-6 d-flex justify-content-end">
          <ReactPaginate
            previousLabel={translate("previous")}
            nextLabel={translate("next")}
            breakLabel={"..."}
            pageCount={pageCount ?? 0}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={(data) => onPageChange?.(data.selected + 1)}
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
            forcePage={(currentPage ?? 1) - 1}
          />
        </div>
      </div>
    </div>
  );
}
