import { useState } from 'react';
import { Table, Button, Form, Card } from 'react-bootstrap';

interface BonusReference {
  id: number;
  name: string;
  amount: number;
  unit?: string;
}

export default function MissionTab() {
  // Données initiales
  const initialBonuses: BonusReference[] = [
    { id: 1, name: 'Immobilization bonus', amount: 0, unit: 'DZD/jour' },
    { id: 2, name: 'Overnight bonus', amount: 0, unit: 'DZD/nuit' },
    { id: 3, name: 'Bonus per km', amount: 0, unit: 'DZD/km' }
  ];

  const [bonuses, setBonuses] = useState<BonusReference[]>(initialBonuses);
  const [newBonus, setNewBonus] = useState<Omit<BonusReference, 'id'>>({ 
    name: '', 
    amount: 0,
    unit: ''
  });

  const handleChange = (id: number, field: keyof BonusReference, value: string | number) => {
    setBonuses(bonuses.map(bonus =>
      bonus.id === id ? { ...bonus, [field]: value } : bonus
    ));
  };

  const addBonus = () => {
    if (newBonus.name.trim()) {
      setBonuses([
        ...bonuses,
        {
          id: Math.max(...bonuses.map(b => b.id), 0) + 1,
          ...newBonus
        }
      ]);
      setNewBonus({ name: '', amount: 0, unit: '' });
    }
  };

  const removeBonus = (id: number) => {
    setBonuses(bonuses.filter(bonus => bonus.id !== id));
  };

  return (
    <div className="p-3">
      <h4 className="mb-4">Mission Bonus Reference</h4>

      {/* Formulaire d'ajout */}
      <Card className="mb-4">
        <Card.Header>Add New Bonus</Card.Header>
        <Card.Body>
          <Form>
            <div className="row g-3">
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Bonus Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={newBonus.name}
                    onChange={(e) => setNewBonus({...newBonus, name: e.target.value})}
                    placeholder="e.g. Weekend bonus"
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={newBonus.amount}
                    onChange={(e) => setNewBonus({...newBonus, amount: parseFloat(e.target.value) || 0})}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    type="text"
                    value={newBonus.unit}
                    onChange={(e) => setNewBonus({...newBonus, unit: e.target.value})}
                    placeholder="DZD/unit"
                  />
                </Form.Group>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <Button variant="primary" onClick={addBonus}>
                  Add
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Tableau des bonus */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Bonus Type</th>
            <th>Amount</th>
            <th>Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bonuses.map((bonus) => (
            <tr key={bonus.id}>
              <td>{bonus.name}</td>
              <td>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={bonus.amount}
                  onChange={(e) => handleChange(bonus.id, 'amount', parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={bonus.unit || ''}
                  onChange={(e) => handleChange(bonus.id, 'unit', e.target.value)}
                />
              </td>
              <td className="text-center">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeBonus(bonus.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-3">
        <Button 
          variant="success"
          onClick={() => console.log('Bonus references saved:', bonuses)}
        >
          Save All Changes
        </Button>
      </div>
    </div>
  );
}