import { useState } from 'react';
import { Table, Button, Form, Badge, InputGroup, Card } from 'react-bootstrap';

interface Supplier {
  id: number;
  name: string;
  phone: string;
  address: string;
  activity: string;
}

const activityTypes = [
  'Fournisseur carburant',
  'Fournisseur pneumatique',
  'Fournisseur pièces détachées',
  'Fournisseur véhicule',
  'Fournisseur carrosserie'
];

export default function Supplier() {
  // Données initiales
  const initialSuppliers: Supplier[] = [
    {
      id: 1,
      name: 'Total Energies',
      phone: '01 23 45 67 89',
      address: '123 Rue du Pétrole, Paris',
      activity: 'Fournisseur carburant'
    },
    {
      id: 2,
      name: 'Michelin',
      phone: '02 34 56 78 90',
      address: '456 Avenue des Pneus, Lyon',
      activity: 'Fournisseur pneumatique'
    }
  ];

  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, 'id'>>({ 
    name: '', 
    phone: '',
    address: '',
    activity: activityTypes[0]
  });

  // Filtrer les fournisseurs
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm) ||
    supplier.activity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ajouter un nouveau fournisseur
  const addSupplier = () => {
    if (newSupplier.name.trim()) {
      setSuppliers([
        ...suppliers,
        {
          id: Math.max(...suppliers.map(s => s.id), 0) + 1,
          ...newSupplier
        }
      ]);
      setNewSupplier({ name: '', phone: '', address: '', activity: activityTypes[0] });
    }
  };

  // Supprimer un fournisseur
  const removeSupplier = (id: number) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
  };

  return (
    <div className="p-3">
      <h4 className="mb-4">Gestion des Fournisseurs</h4>

      {/* Barre de recherche */}
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher par nom, téléphone ou activité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline-secondary">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>

      {/* Formulaire d'ajout */}
      <Card className="mb-4">
        <Card.Header>Ajouter un nouveau fournisseur</Card.Header>
        <Card.Body>
          <Form>
            <div className="row g-3">
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  />
                </Form.Group>
              </div>
              <div className="col-md-2">
                <Form.Group>
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control
                    type="text"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                  />
                </Form.Group>
              </div>
              <div className="col-md-2">
                <Form.Group>
                  <Form.Label>Activité</Form.Label>
                  <Form.Select
                    value={newSupplier.activity}
                    onChange={(e) => setNewSupplier({...newSupplier, activity: e.target.value})}
                  >
                    {activityTypes.map(activity => (
                      <option key={activity} value={activity}>{activity}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <Button variant="primary" onClick={addSupplier}>
                  Ajouter
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Tableau des fournisseurs */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nom fournisseur</th>
            <th>N° Téléphone</th>
            <th>Adresse</th>
            <th>Activité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.address}</td>
              <td>
                <Badge bg="info">
                  {supplier.activity}
                </Badge>
              </td>
              <td className="text-center">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeSupplier(supplier.id)}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}