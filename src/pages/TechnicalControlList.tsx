import { useEffect, useState } from "react";

export default function TechnicalControlList() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/geop/technical-control/list")
      .then(res => res.json())
      .then(data => setRows(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Technical Control List</h2>

      <pre>{JSON.stringify(rows, null, 2)}</pre> {/* temporary debug */}
    </div>
  );
}
