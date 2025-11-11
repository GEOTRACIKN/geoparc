import DataTable from "../components/common/DataTable";

export default function TechnicalControlList() {
  const columns = [
    { key: "immatriculation_vehicule", label: "Plate" },
    { key: "etat_ctr_tech_vehicule", label: "Status" },
    { key: "date_debut_ctr_tech_vehicule", label: "Start" },
    { key: "date_fin_ctr_tech_vehicule", label: "End" },
    { key: "cout_ctr_tech_vehicule", label: "Cost" },
  ];

  return (
    <div className="p-3">
      <h2>Technical Control List</h2>
      <DataTable fetchUrl="http://localhost:5000/api/geop/technical-control/list" columns={columns} />
    </div>
  );
}
