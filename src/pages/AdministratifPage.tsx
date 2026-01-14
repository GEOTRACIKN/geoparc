import { useState } from "react";
import { Nav } from "react-bootstrap";

import InsuranceList from "./InsuranceList";
import TechnicalControlList from "./TechnicalControlList";
import VignetteList from "./VehicleStickerList";

type Tab = "insurance" | "technical" | "vignette";

export default function AdministratifPage() {
  const [activeTab, setActiveTab] = useState<Tab>("insurance");

  return (
    <div className="p-3">

      {/* Tabs */}
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab((k as Tab) || "insurance")}
        className="mt-3"
      >
        <Nav.Item>
          <Nav.Link eventKey="insurance">Insurance</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="technical">Technical Control</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="vignette">Vignette</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Tab content */}
      <div >
        {activeTab === "insurance" && <InsuranceList />}
        {activeTab === "technical" && <TechnicalControlList />}
        {activeTab === "vignette" && <VignetteList />}
      </div>
    </div>
  );
}