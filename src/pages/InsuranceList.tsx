import { useState, useEffect } from "react";
import DataTable from "../components/common/DataTable";
import TableHeader from "../components/common/TableHeader";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

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
  const [searchType, setSearchType] = useState<string>("");
  const [sortColumn, setSortColumn] = useState("id_vehicule");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");

  const columns = [
    { key: "immatriculation_vehicule", label: "Plate" },
    { key: "companie_assurance_vehicule", label: "Company" },
    { key: "date_debut_assurance_vehicule", label: "Start" },
    { key: "date_expir_assurance_vehicule", label: "End" },
    { key: "cout_assurance_vehicule", label: "Cost" },
  ];

  const searchOptions = [
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
    const id_user = localStorage.getItem("userid") || "1";
    setLoading(true);
    try {
      const body = JSON.stringify({
        limitValue,
        currentPage: page,
        search,
        type,
        column,
        sort,
        id_user,
      });

      const res = await fetch(`${backendUrl}/api/geop/insurance/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch insurance page");
      }

      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching insurance page:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== Fetch total count so FE can compute pages =====
  const fetchInsuranceTotal = async (search = "", type = "", limitValue = limit) => {
    const id_user = localStorage.getItem("userid") || "1";
    try {
      const res = await fetch(`${backendUrl}/api/geop/insurance/totalpage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user,
          search,
          type,
         }), // id_user from auth if available
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
    // initial total + first page
    fetchInsuranceTotal("", "", limit); // pass id_user from auth if we have it
    fetchInsurancePage(limit, 1, "", "", sortColumn, sortDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle typing (debounced)
  const handleSearchChange =  async (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);

    // small debounce
    setTimeout(async() => {
      await fetchInsuranceTotal(value, searchType, limit);
      await fetchInsurancePage(limit, 1, value, searchType, sortColumn, sortDirection);
    }, 300);
  };

  const handleSearchTypeChange = async (typeVal: string) => {
    setSearchType(typeVal);
    setSearchValue("");
    setCurrentPage(1);
    // refresh
    await fetchInsuranceTotal("", typeVal, limit);
    await fetchInsurancePage(limit, 1, "", typeVal, sortColumn, sortDirection);
  };

  // Reset search
  const handleResetSearch = async() => {
    setSearchValue("");
    setSearchType("");
    setCurrentPage(1);
    await fetchInsuranceTotal( "", "", limit);
    await fetchInsurancePage(limit, 1, "", "", sortColumn, sortDirection);
  };

  // Pagination handlers
  const handlePageClick = async (data: any) => {
    const newPage = data.selected + 1;
    setCurrentPage(newPage);
    await fetchInsurancePage(limit, newPage, searchValue, searchType, sortColumn, sortDirection);
    window.scrollTo(0, 0);
  };

  const handleLimitChange = async (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
    await fetchInsuranceTotal(searchValue, searchType,newLimit);
    await fetchInsurancePage(newLimit, 1, searchValue, searchType, sortColumn, sortDirection);
  };

  // Sorting  when column header clicked
  const handleSort = async (columnKey: string) => {
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
    setSortColumn(columnKey);
    setSortDirection(nextSort);
    setLoading(true);

    // refetch total + page 1
    await fetchInsuranceTotal(searchValue, searchType);
    await fetchInsurancePage(limit, 1, searchValue, searchType, backendColumn, nextSort);
    setCurrentPage(1);
    setLoading(false);
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
