import { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

interface DriverCost {
  id: number;
  category: string;
  basicSalary: number;
  insuranceCost: number;
  irg: number;
  salaryBonus: number;
  flatRateBonus: number;
  training: number;
}

export default function DriversTab() {
  // État initial avec les 10 catégories vides
  const initialData: DriverCost[] = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    category: `Category ${i}`,
    basicSalary: 0,
    insuranceCost: 0,
    irg: 0,
    salaryBonus: 0,
    flatRateBonus: 0,
    training: 0
  }));

  const [driverCosts, setDriverCosts] = useState<DriverCost[]>(initialData);
  const [nextId, setNextId] = useState(10); // Pour les nouvelles catégories

  // Ajouter une nouvelle catégorie
  const addCategory = () => {
    const newCategory = {
      id: nextId,
      category: `Category ${nextId}`,
      basicSalary: 0,
      insuranceCost: 0,
      irg: 0,
      salaryBonus: 0,
      flatRateBonus: 0,
      training: 0
    };
    setDriverCosts([...driverCosts, newCategory]);
    setNextId(nextId + 1);
  };

  // Supprimer une catégorie
  const removeCategory = (id: number) => {
    setDriverCosts(driverCosts.filter(item => item.id !== id));
  };

  // Mettre à jour un champ
  const handleChange = (id: number, field: keyof DriverCost, value: string) => {
    setDriverCosts(driverCosts.map(item =>
      item.id === id ? { ...item, [field]: parseFloat(value) || 0 } : item
    ));
  };

  return (
    <div className="p-3">
      <h4 className="mb-4">Driver Costs and Bonuses</h4>
      
      <Button variant="primary" onClick={addCategory} className="mb-3">
        Add New Category
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Category</th>
            <th>Basic Salary</th>
            <th>Insurance Cost</th>
            <th>IRG</th>
            <th>Salary Bonus</th>
            <th>Flat Rate Bonus</th>
            <th>Training</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {driverCosts.map((item) => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>
                <Form.Control
                  type="number"
                  value={item.basicSalary}
                  onChange={(e) => handleChange(item.id, 'basicSalary', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={item.insuranceCost}
                  onChange={(e) => handleChange(item.id, 'insuranceCost', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={item.irg}
                  onChange={(e) => handleChange(item.id, 'irg', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={item.salaryBonus}
                  onChange={(e) => handleChange(item.id, 'salaryBonus', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={item.flatRateBonus}
                  onChange={(e) => handleChange(item.id, 'flatRateBonus', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={item.training}
                  onChange={(e) => handleChange(item.id, 'training', e.target.value)}
                />
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeCategory(item.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-3">
        <Button variant="success" onClick={() => console.log('Data to save:', driverCosts)}>
          Save All Changes
        </Button>
      </div>
    </div>
  );
}