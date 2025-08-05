import { useState } from 'react';
import { Table, Button, Form, InputGroup, Badge, Card } from 'react-bootstrap';

export default function Warehouse() {
  // Données initiales
  const initialWarehouses = [
    { id: 1, name: 'MAGASIN CENTRAL', location: 'Siège principal' },
    { id: 2, name: 'depot1', location: 'Zone industrielle Nord' }
  ];

  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [newWarehouse, setNewWarehouse] = useState({
    name: '',
    location: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les dépôts
  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ajouter un nouveau dépôt
  const addWarehouse = () => {
    if (newWarehouse.name.trim()) {
      setWarehouses([
        ...warehouses,
        {
          id: Math.max(...warehouses.map(w => w.id), 0) + 1,
          name: newWarehouse.name.trim(),
          location: newWarehouse.location.trim()
        }
      ]);
      setNewWarehouse({ name: '', location: '' });
    }
  };

  // Supprimer un dépôt
  const removeWarehouse = (id: number) => {
    setWarehouses(warehouses.filter(warehouse => warehouse.id !== id));
  };

  return (
    <div className="p-3">
      <h4 className="mb-4">Gestion des Dépôts</h4>

      {/* Barre de recherche */}
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher par nom ou emplacement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline-secondary">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>

      {/* Formulaire d'ajout */}
      <Card className="mb-4">
        <Card.Header>Ajouter un nouveau dépôt</Card.Header>
        <Card.Body>
          <Form>
            <div className="row g-3">
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Nom du dépôt</Form.Label>
                  <Form.Control
                    type="text"
                    value={newWarehouse.name}
                    onChange={(e) => setNewWarehouse({...newWarehouse, name: e.target.value})}
                    placeholder="ex: depot2"
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Emplacement</Form.Label>
                  <Form.Control
                    type="text"
                    value={newWarehouse.location}
                    onChange={(e) => setNewWarehouse({...newWarehouse, location: e.target.value})}
                    placeholder="ex: Zone Sud"
                  />
                </Form.Group>
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <Button variant="primary" onClick={addWarehouse}>
                  Ajouter
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Tableau des dépôts */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom du dépôt</th>
            <th>Emplacement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredWarehouses.map((warehouse) => (
            <tr key={warehouse.id}>
              <td>{warehouse.id}</td>
              <td>
                <Badge bg="primary" className="fs-6">
                  {warehouse.name}
                </Badge>
              </td>
              <td>{warehouse.location}</td>
              <td className="text-center">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeWarehouse(warehouse.id)}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Statistiques */}
      <div className="mt-3">
        <Badge bg="secondary" className="me-2">
          Total dépôts: {warehouses.length}
        </Badge>
        <Badge bg="success" className="me-2">
          Actifs: {warehouses.length}
        </Badge>
      </div>
    </div>
  );
}