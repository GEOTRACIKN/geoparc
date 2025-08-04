import { useState } from 'react';
import { Button, Form, ListGroup, Card } from 'react-bootstrap';

export default function DataTab() {
  // États pour toutes les sections
  const [services, setServices] = useState<string[]>(['Logistics', 'Technical', 'Commercial', 'Computer science', 'Supply']);
  const [customers, setCustomers] = useState<string[]>(['Customer A', 'Customer B']);
  const [goods, setGoods] = useState<string[]>(['Goods X', 'Goods Y']);
  const [loadingLocations, setLoadingLocations] = useState<string[]>(['Warehouse 1', 'Warehouse 2']);
  const [unloadingLocations, setUnloadingLocations] = useState<string[]>(['Location Alpha', 'Location Beta']);

  // États pour les nouvelles entrées
  const [newService, setNewService] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newGood, setNewGood] = useState('');
  const [newLoadingLoc, setNewLoadingLoc] = useState('');
  const [newUnloadingLoc, setNewUnloadingLoc] = useState('');

  // Fonction générique pour ajouter un élément
  const addItem = (items: string[], setItems: Function, newItem: string, setNewItem: Function) => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  // Fonction générique pour supprimer un élément
  const removeItem = (items: string[], setItems: Function, item: string) => {
    setItems(items.filter(i => i !== item));
  };

  // Composant réutilisable pour chaque section
  const ListSection = ({
    title,
    items,
    setItems,
    newItem,
    setNewItem,
    placeholder
  }: {
    title: string;
    items: string[];
    setItems: (items: string[]) => void;
    newItem: string;
    setNewItem: (item: string) => void;
    placeholder: string;
  }) => (
    <Card className="mb-4">
      <Card.Header>
        <h5>{title}</h5>
      </Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <div className="d-flex">
            <Form.Control
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={placeholder}
            />
            <Button
              variant="primary"
              onClick={() => addItem(items, setItems, newItem, setNewItem)}
              className="ms-2"
            >
              Add
            </Button>
          </div>
        </Form.Group>

        <ListGroup>
          {items.map((item, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              {item}
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeItem(items, setItems, item)}
              >
                Remove
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );

  return (
    <div className="p-3">
      <ListSection
        title="List of Services"
        items={services}
        setItems={setServices}
        newItem={newService}
        setNewItem={setNewService}
        placeholder="Enter new service"
      />

      <ListSection
        title="Customer List"
        items={customers}
        setItems={setCustomers}
        newItem={newCustomer}
        setNewItem={setNewCustomer}
        placeholder="Enter new customer"
      />

      <ListSection
        title="Goods List"
        items={goods}
        setItems={setGoods}
        newItem={newGood}
        setNewItem={setNewGood}
        placeholder="Enter new goods item"
      />

      <ListSection
        title="List of Loading Locations"
        items={loadingLocations}
        setItems={setLoadingLocations}
        newItem={newLoadingLoc}
        setNewItem={setNewLoadingLoc}
        placeholder="Enter new loading location"
      />

      <ListSection
        title="List of Unloading Locations"
        items={unloadingLocations}
        setItems={setUnloadingLocations}
        newItem={newUnloadingLoc}
        setNewItem={setNewUnloadingLoc}
        placeholder="Enter new unloading location"
      />
    </div>
  );
}