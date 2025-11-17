import { useState, useEffect } from "react";
import DataTable from "../components/common/DataTable";
import TableHeader from "../components/common/TableHeader";

export default function InsuranceList() {
  const [rows, setRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState<string | number>("");
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: "immatriculation_vehicule", label: "Plate" },
    { key: "companie_assurance_vehicule", label: "Company" },
    { key: "date_debut_assurance_vehicule", label: "Start" },
    { key: "date_expir_assurance_vehicule", label: "End" },
    { key: "cout_assurance_vehicule", label: "Cost" },
  ];

  const searchOptions = [
    { label: "Plate", value: "plate", column: "v.immatriculation_vehicule" },
    { label: "Company", value: "company", column: "i.companie_assurance_vehicule" },
    { label: "Start Date", value: "start", column: "i.date_debut_assurance_vehicule" },
    { label: "End Date", value: "end", column: "i.date_expir_assurance_vehicule" },
    { label: "Cost", value: "cost" }, 
  ];

  // ===== Fetch data once =====
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/geop/insurance/list")
      .then((res) => res.json())
      .then((data) => {
        setRows(Array.isArray(data) ? data : []);
        setFilteredRows(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching insurance data:", err);
        setRows([]);
        setFilteredRows([]);
        setLoading(false);
      });
  }, []);

  // ===== Search =====
const handleSearchChange = async (value: string) => {
    setSearchValue(value);
    setLoading(true); 
    if (!value.trim()) {
      setFilteredRows(rows);
      setLoading(false);
      return;
    }

  const res = await fetch("http://localhost:5000/api/geop/insurance/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      limitValue: 50,
      currentPage: 1,
      search: value,
      type: searchType,
      column: searchType || "immatriculation_vehicule",
      sort: "ASC",
    }),
  });

  if (res.ok) {
    const data = await res.json();
    setFilteredRows(data);
  }
  setLoading(false);
};


  const handleResetSearch = () => {
    setSearchValue("");
    setSearchType("");
    setFilteredRows(rows);
  };

  const handleSearchTypeChange = (type: string) => {
  setSearchType(type);
  setSearchValue(""); 
  setFilteredRows(rows);
};

  return (
    <div className="p-3">
      {/* Reusable Header */}
      <TableHeader
      title="Insurance List"
      totalCount={filteredRows.length}
      searchValue={searchValue}
      searchOptions={searchOptions}
      onSearchChange={handleSearchChange}
      onSearchTypeChange={handleSearchTypeChange}
      onResetSearch={handleResetSearch}
    />

      {/* Shared DataTable */}
      <DataTable
        data={filteredRows} 
        columns={columns}
        loading={loading}
      />
    </div>
  );
}
