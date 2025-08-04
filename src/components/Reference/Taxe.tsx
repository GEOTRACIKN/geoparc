import { useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

interface Taxe {
  id: number;
  name: string;
  rate: number;
}

export default function Taxe() {
  const [taxes, setTaxes] = useState<Taxe[]>([
    { id: 1, name: 'TVA', rate: 20 },
    { id: 2, name: 'Taxe spéciale', rate: 5 }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [currentTaxe, setCurrentTaxe] = useState<Taxe | null>(null);
  const [formData, setFormData] = useState<Omit<Taxe, 'id'>>({ name: '', rate: 0 });

  const handleShowAdd = () => {
    setCurrentTaxe(null);
    setFormData({ name: '', rate: 0 });
    setShowModal(true);
  };

  const handleShowEdit = (tax: Taxe) => {
    setCurrentTaxe(tax);
    setFormData({ name: tax.name, rate: tax.rate });
    setShowModal(true);
  };

  const handleSave = () => {
    if (currentTaxe) {
      // Modification
      setTaxes(taxes.map(t => 
        t.id === currentTaxe.id ? { ...t, ...formData } : t
      ));
    } else {
      // Ajout
      setTaxes([...taxes, { 
        ...formData, 
        id: Math.max(...taxes.map(t => t.id), 0) + 1 
      }]);
    }
    setShowModal(false);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShowAdd} className="mb-3">
        Ajouter une taxe
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Taux (%)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxes.map(tax => (
            <tr key={tax.id}>
              <td>{tax.name}</td>
              <td>{tax.rate}</td>
              <td>
                <Button 
                  variant="warning" 
                  size="sm"
                  onClick={() => handleShowEdit(tax)}
                >
                  Modifier
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentTaxe ? 'Modifier la taxe' : 'Ajouter une taxe'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom de la taxe</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Taux (%)</Form.Label>
              <Form.Control
                type="number"
                value={formData.rate}
                onChange={(e) => setFormData({...formData, rate: Number(e.target.value)})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}