import DataTable from "../components/common/DataTable";

export default function InsuranceList() {
  const columns = [
    { key: "immatriculation_vehicule", label: "Plate" },
    { key: "companie_assurance_vehicule", label: "Company" },
    { key: "date_debut_assurance_vehicule", label: "Start" },
    { key: "date_expir_assurance_vehicule", label: "End" },
    { key: "cout_assurance_vehicule", label: "Cost" },
  ];

  return (
    <div className="p-3">
      <h2>Insurance List</h2>
      <DataTable fetchUrl="http://localhost:5000/api/geop/insurance/list" columns={columns} />
    </div>
  );
}
