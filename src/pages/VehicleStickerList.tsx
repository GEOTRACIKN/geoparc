import { useState, useEffect, useRef } from "react";
import DataTable from "../components/common/DataTable";
import TableHeader from "../components/common/TableHeader";

// temp: Geoparc uses no real auth.
// localStorage id/role is only a placeholder.
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const userRole = localStorage.getItem("GeopUserRole") || "user";
const isAdmin = userRole === "admin";

export default function VignetteList() {
  // ===== STATE =====
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState(isAdmin ? "id" : "plate");
  const [sortColumn, setSortColumn] = useState("id_vehicule");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // ===== COLUMNS =====
  const columns = [
    ...(isAdmin ? [{ key: "id_vehicule", label: "ID" }] : []),
    { key: "immatriculation_vehicule", label: "Plate" },
    { key: "num_vignette_vehicule", label: "Number" },
    { key: "date_vignette_vehicule", label: "Date" },
    { key: "cout_vignette_vehicule", label: "Cost" },
  ];

  // ===== SEARCH OPTIONS =====
  const searchOptions = [
    ...(isAdmin ? [{ label: "Vehicle ID", value: "id", column: "id_vehicule" }] : []),
    { label: "Plate", value: "plate", column: "immatriculation_vehicule" },
    { label: "Number", value: "number", column: "num_vignette_vehicule" },
    { label: "Date", value: "date", column: "date_vignette_vehicule" },
    { label: "Cost", value: "cost", column: "cout_vignette_vehicule" },
  ];

  // ====================================================
  // FETCH PAGE
  // ====================================================
  const fetchPage = async (
    limitValue = limit,
    page = currentPage,
    search = searchValue,
    type = searchType,
    column = sortColumn,
    sort = sortDirection
  ) => {
    const id_user = localStorage.getItem("GeopUserID") || "1";
    const role = localStorage.getItem("GeopUserRole") || "user";

    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/geop/vignette/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          limitValue,
          currentPage: page,
          search,
          type,
          column,
          sort,
          id_user,
          role,
        }),
      });

      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // FETCH TOTAL
  // ====================================================
  const fetchTotal = async (search = "", type = "", limitValue = limit) => {
    const id_user = localStorage.getItem("GeopUserID") || "1";
    const role = localStorage.getItem("GeopUserRole") || "user";

    try {
      const res = await fetch(`${backendUrl}/api/geop/vignette/totalpage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_user, role, search, type }),
      });

      const json = await res.json();
      const totalCount =
        (Array.isArray(json) && json[0]?.count) ? json[0].count : json?.count ?? 0;

      setTotal(totalCount);
      setPageCount(Math.ceil(totalCount / limitValue));
    } catch {
      setTotal(0);
      setPageCount(0);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchTotal("", "", limit);
    fetchPage(limit, 1, "", "", sortColumn, sortDirection);
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====================================================
  // SEARCH LOGIC
  // ====================================================
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      await fetchTotal(value, searchType);
      await fetchPage(limit, 1, value, searchType, sortColumn, sortDirection);
    }, 300);
  };

  const handleSearchTypeChange = async (t: string) => {
    setSearchType(t);
    setSearchValue("");
    setCurrentPage(1);

    await fetchTotal("", t, limit);
    await fetchPage(limit, 1, "", t, sortColumn, sortDirection);
  };

  const handleResetSearch = async () => {
    setSearchValue("");
    setCurrentPage(1);

    await fetchTotal("", searchType);
    await fetchPage(limit, 1, "", searchType, sortColumn, sortDirection);
  };

  // ====================================================
  // PAGINATION
  // ====================================================
  const handlePageClick = async (data: any) => {
    const newPage = data.selected + 1;
    setCurrentPage(newPage);
    await fetchPage(limit, newPage, searchValue, searchType, sortColumn, sortDirection);
  };

  const handleLimitChange = async (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);

    await fetchTotal(searchValue, searchType, newLimit);
    await fetchPage(newLimit, 1, searchValue, searchType, sortColumn, sortDirection);
  };

  // ====================================================
  // SORTING
  // ====================================================
  const handleSort = async (columnKey: string) => {
    const map: Record<string, string> = {
      id_vehicule: "id_vehicule",
      immatriculation_vehicule: "immatriculation_vehicule",
      num_vignette_vehicule: "num_vignette_vehicule",
      date_vignette_vehicule: "date_vignette_vehicule",
      cout_vignette_vehicule: "cout_vignette_vehicule",
    };

    const backendColumn = map[columnKey] || columnKey;
    const nextSort = sortDirection === "ASC" ? "DESC" : "ASC";

    setSortColumn(columnKey);
    setSortDirection(nextSort);
    setCurrentPage(1);

    await fetchTotal(searchValue, searchType);
    await fetchPage(limit, 1, searchValue, searchType, backendColumn, nextSort);
  };

  // ====================================================
  // RENDER
  // ====================================================
  return (
    <div className="p-3">
      <TableHeader
        title="Vehicle Sticker List"
        totalCount={total}
        searchValue={searchValue}
        searchOptions={searchOptions}
        onSearchChange={handleSearchChange}
        onSearchTypeChange={handleSearchTypeChange}
        onResetSearch={handleResetSearch}
      />

      <DataTable
        data={rows}
        columns={columns}
        loading={loading}
        totalCount={total}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSort}
        pageCount={pageCount}
        currentPage={currentPage}
        limit={limit}
        onPageChange={(p) => handlePageClick({ selected: p - 1 })}
        onLimitChange={handleLimitChange}
        rowIdKey="id_vehicule"
      />
    </div>
  );
}
