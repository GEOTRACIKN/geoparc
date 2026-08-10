import { useState, useEffect } from "react";
import DataTable from "../components/common/DataTable";
import TableHeader from "../components/common/TableHeader";
import {toTimestamp} from '../functions';
import { useListPagePreferences } from "../hooks/useListPagePreferences";


//TEMPORARY Geoparc has no authentication yet.
//role & user ID come from localStorage (not secure).
//replace with real session based auth when implemented.

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const userRole = localStorage.getItem("GeopUserRole") || "user";
const isAdmin = userRole === "admin";

export default function InsuranceList() {
  //UI/data state
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);

  //search/sort state
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState<string>(isAdmin ? "id" : "plate");
  const [sortColumn, setSortColumn] = useState("id_vehicule");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const { ready: listPreferencesReady } = useListPagePreferences({
    pageKey: "administrative-insurance",
    pageSize: limit, setPageSize: setLimit,
    searchType, setSearchType,
    searchText: searchValue, setSearchText: setSearchValue,
    sortColumn, setSortColumn,
    sortDirection, setSortDirection,
  });
  const columns = [
    ...(isAdmin ? [{ key: "id_vehicule", label: "ID" }] : []),
    { key: "immatriculation_vehicule", label: "Plate" },
    { key: "companie_assurance_vehicule", label: "Company" },
    { key: "date_debut_assurance_vehicule", label: "Start" },
    { key: "date_expir_assurance_vehicule", label: "End" },
    { key: "cout_assurance_vehicule", label: "Cost" },
  ];

  const searchOptions = [
    ...(isAdmin ? [{ label: "Vehicle ID", value: "id", column: "id_vehicule" }] : []),
    { label: "Plate", value: "plate", column: "immatriculation_vehicule" },
    { label: "Company", value: "company", column: "companie_assurance_vehicule" },
    { label: "Start Date", value: "start", column: "date_debut_assurance_vehicule" },
    { label: "End Date", value: "end", column: "date_expir_assurance_vehicule" },
    { label: "Cost", value: "cost", column: "cout_assurance_vehicule" }, 
  ];

// ===== Fetch page rows (server-side) =====
  const fetchInsurancePage = async (
    limitValue = limit,
    page = currentPage,
    search = searchValue,
    type = searchType,
    column = sortColumn,
    sort = sortDirection,
  ) => {
    const id_user = localStorage.getItem("GeopUserID") || "";
    const role = localStorage.getItem("GeopUserRole") || "user";
    setLoading(true);
    try {
      const bodyObj: any = {
        limitValue,
        currentPage: page,
        search,
        type,
        column,
        sort,
        role,
      };
      if (id_user) bodyObj.id_user = id_user;
      const res = await fetch(`${backendUrl}/api/geop/insurance/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify(bodyObj),
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch insurance page");
      }

      const data = await res.json();
      const formatted =Array.isArray(data)
      ? data.map((row: any) => {
            const safeDate = (d: any) => {
              if (d === null || d === undefined || d === "") return "-";
              const s = String(d);
              if (/^0{4}-0{2}-0{2}/.test(s)) return "-"; // MySQL zero-date (0000-00-00)
              if (isNaN(new Date(s).getTime())) return "-";
              return toTimestamp(s);
            };

            return {
              ...row,
              date_debut_assurance_vehicule: safeDate(row.date_debut_assurance_vehicule),
              date_expir_assurance_vehicule: safeDate(row.date_expir_assurance_vehicule),
            };
          })
        : [];
      setRows(formatted);
    } catch (err) {
      console.error("Error fetching insurance page:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== Fetch total count so FE can compute pages =====
  const fetchInsuranceTotal = async (search = "", type = "", limitValue = limit) => {
    const id_user = localStorage.getItem("GeopUserID") || "";
    const role = localStorage.getItem("GeopUserRole") || "user";
    try {
      const body: any = { role, search, type };// id_user from auth when available
      if (id_user) body.id_user = id_user;

      const res = await fetch(`${backendUrl}/api/geop/insurance/totalpage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body), 
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch total");
      const json = await res.json();
      const totalCount = (json && Array.isArray(json) && json[0] && json[0].count) ? json[0].count : (json?.count ?? 0);
      setTotal(totalCount);
      setPageCount(Math.ceil(totalCount / limitValue));
    } catch (err) {
      console.error("Error fetching total:", err);
      setTotal(0);
      setPageCount(0);
    }
  };

  // initial load
  useEffect(() => {
    if (!listPreferencesReady) return;
    const timeout = window.setTimeout(() => {
      void fetchInsuranceTotal(searchValue, searchType, limit);
      void fetchInsurancePage(limit, currentPage, searchValue, searchType, sortColumn, sortDirection);
    }, 300);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, searchValue, searchType, sortColumn, sortDirection, listPreferencesReady]);

  // handle typing (debounced)
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
};


  const handleSearchTypeChange = (typeVal: string) => {
    setSearchType(typeVal);
    setSearchValue("");
    setCurrentPage(1);
  };

  // Reset search
  const handleResetSearch = () => {
    setSearchValue("");
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageClick = (data: any) => {
    const newPage = data.selected + 1;
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  // Sorting  when column header clicked
  const handleSort = (columnKey: string) => {
    // FE column -> DB column mapping (if needed)
    const columnMap: Record<string, string> = {
      immatriculation_vehicule: "immatriculation_vehicule",
      companie_assurance_vehicule: "companie_assurance_vehicule",
      date_debut_assurance_vehicule: "date_debut_assurance_vehicule",
      date_expir_assurance_vehicule: "date_expir_assurance_vehicule",
      cout_assurance_vehicule: "cout_assurance_vehicule",
      id_vehicule: "id_vehicule",
    };
    const backendColumn = columnMap[columnKey] || columnKey;

    const nextSort = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortColumn(backendColumn);
    setSortDirection(nextSort);
    setCurrentPage(1);
  };

  return (
    <div className="p-3">
      <TableHeader
        title="Insurance List"
        totalCount={total}
        searchValue={searchValue}
        searchOptions={searchOptions}
        onSearchChange={(v) => handleSearchChange(v)}
        onSearchTypeChange={(t) => handleSearchTypeChange(t)}
        onResetSearch={handleResetSearch}
      />

      <DataTable
        data={rows}
        columns={columns}
        loading={loading}
        totalCount={total}

        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={(colKey) => handleSort(colKey)}

        pageCount={pageCount}
        currentPage={currentPage}
        limit={limit}
        onPageChange={(page) => handlePageClick({ selected: page - 1 })}
        onLimitChange={(newLimit) => handleLimitChange(newLimit)}

        rowIdKey="id_vehicule"
      />
    </div>
  );
}
