import { useState } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import Taxe from '../components/Reference/Taxe';
import Fuel from '../components/Reference/Fuel';
import Data from '../components/Reference/Data';
import Driver from '../components/Reference/Driver';

export function Reference() {

  const [activeTab, setActiveTab] = useState('taxes');

  return (
    <div className="p-3">
      <h2 className="mb-4">Références</h2>
      
      {/* Barre d'onglets simple */}
      <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'taxes')}>
        <Nav.Item>
          <Nav.Link eventKey="taxe">Taxes</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="fuel">Carburants</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="data">Data</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="driver">Driver</Nav.Link>
        </Nav.Item>
        
        {/* Ajouter d'autres onglets ici */}
      </Nav>

      {/* Contenu des onglets */}
      <div className="mt-3 border border-top-0 p-3">
        {activeTab === 'taxe' && <Taxe />}
         {activeTab === 'fuel' && <Fuel />}
          {activeTab === 'data' && <Data />}
            {activeTab === 'driver' && <Driver />}
        {/* Ajouter d'autres onglets ici */}
      </div>
    </div>
  );
}