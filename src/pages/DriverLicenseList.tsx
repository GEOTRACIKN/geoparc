import { useState, useEffect, useRef } from "react";
import DataTable from "../components/common/DataTable";
import TableHeader from "../components/common/TableHeader";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const userRole = localStorage.getItem("GeopUserRole") || "user";
const isAdmin = userRole === "admin";

export default function DriverLicenseList() {
  // UI / data state
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);

  // search / sort state
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState<string>(isAdmin ? "id" : "name");
  const [sortColumn, setSortColumn] = useState("id_conducteur");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // ===== Columns =====
  const columns = [
    ...(isAdmin ? [{ key: "id_conducteur", label: "ID" }] : []),
    { key: "conducteur", label: "Conducteur" },
    { key: "numero_permis_conducteur", label: "Numéro de permis" },
    { key: "premis_conducteur", label: "Type de permis" },
    { key: "lieu_delivrance_permis_conducteur", label: "Lieu de délivrance" },
    { key: "date_delivrance_permis_conducteur", label: "Date de délivrance" },
    { key: "date_expir_permis_conducteur", label: "Date d’expiration" },
  ];

  // ===== Search options =====
  const searchOptions = [
    ...(isAdmin
      ? [{ label: "Driver ID", value: "id", column: "id_conducteur" }]
      : []),
    { label: "Driver name", value: "name", column: "nom_conducteur" },
    { label: "License number", value: "license", column: "numero_permis_conducteur" },
    { label: "License type", value: "type", column: "premis_conducteur" },
  ];

  // ===== Fetch page =====
  const fetchDriverLicensePage = async (
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
      const res = await fetch(`${backendUrl}/api/geop/driverLicense/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch driver licenses");

      const data = await res.json();

      // combine nom + prenom into one column
      const formatted = Array.isArray(data)
        ? data.map((row: any) => ({
            ...row,
            conducteur: `${row.nom_conducteur ?? ""} ${row.prenom_conducteur ?? ""}`,
          }))
        : [];

      setRows(formatted);
    } catch (err) {
      console.error("Error fetching driver licenses:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== Fetch total =====
  const fetchDriverLicenseTotal = async (search = "", type = "", limitValue = limit) => {
    const id_user = localStorage.getItem("GeopUserID") || "1";
    const role = localStorage.getItem("GeopUserRole") || "user";

    try {
      const res = await fetch(`${backendUrl}/api/geop/driverLicense/totalpage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user, role, search, type }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch total");

      const json = await res.json();
      const totalCount =
        Array.isArray(json) && json[0]?.count ? json[0].count : json?.count ?? 0;

      setTotal(totalCount);
      setPageCount(Math.ceil(totalCount / limitValue));
    } catch (err) {
      console.error("Error fetching total:", err);
      setTotal(0);
      setPageCount(0);
    }
  };

  // ===== Initial load =====
  useEffect(() => {
    fetchDriverLicenseTotal("", "", limit);
    fetchDriverLicensePage(limit, 1, "", "", sortColumn, sortDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Search handlers =====
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      await fetchDriverLicenseTotal(value, searchType, limit);
      await fetchDriverLicensePage(limit, 1, value, searchType, sortColumn, sortDirection);
    }, 300);
  };

  const handleSearchTypeChange = async (typeVal: string) => {
    setSearchType(typeVal);
    setSearchValue("");
    setCurrentPage(1);
    await fetchDriverLicenseTotal("", typeVal, limit);
    await fetchDriverLicensePage(limit, 1, "", typeVal, sortColumn, sortDirection);
  };

  const handleResetSearch = async () => {
    setSearchValue("");
    setCurrentPage(1);
    await fetchDriverLicenseTotal("", "", limit);
    await fetchDriverLicensePage(limit, 1, "", "", sortColumn, sortDirection);
  };

  // ===== Pagination =====
  const handlePageClick = async (data: any) => {
    const newPage = data.selected + 1;
    setCurrentPage(newPage);
    await fetchDriverLicensePage(limit, newPage, searchValue, searchType, sortColumn, sortDirection);
    window.scrollTo(0, 0);
  };

  const handleLimitChange = async (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
    await fetchDriverLicenseTotal(searchValue, searchType, newLimit);
    await fetchDriverLicensePage(newLimit, 1, searchValue, searchType, sortColumn, sortDirection);
  };

  // ===== Sorting =====
  const handleSort = async (columnKey: string) => {
    const nextSort = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortColumn(columnKey);
    setSortDirection(nextSort);

    await fetchDriverLicenseTotal(searchValue, searchType);
    await fetchDriverLicensePage(limit, 1, searchValue, searchType, columnKey, nextSort);
    setCurrentPage(1);
  };

  return (
    <div className="p-3">
      <TableHeader
        title="Permis de conduire"
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
        onPageChange={(page) => handlePageClick({ selected: page - 1 })}
        onLimitChange={handleLimitChange}
        rowIdKey="id_conducteur"
      />
    </div>
  );
}
