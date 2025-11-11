import DataTable from "../components/common/DataTable";

export default function VignetteList() {
  const columns = [
    { key: "immatriculation_vehicule", label: "Plate" },
    { key: "num_vignette_vehicule", label: "Number" },
    { key: "date_vignette_vehicule", label: "Date" },
    { key: "cout_vignette_vehicule", label: "Cost" },
  ];

  return (
    <div className="p-3">
      <h2>Vignette List</h2>
      <DataTable fetchUrl="http://localhost:5000/api/geop/vignette/list" columns={columns} />
    </div>
  );
}
