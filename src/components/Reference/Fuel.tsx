import { useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';

type FuelType = {
  id: number;
  name: string;
  currentPrice: string;
};

export default function Fuel() {
  // Liste des types de carburants
  const fuelTypes: FuelType[] = [
    { id: 1, name: 'Normal Essence', currentPrice: ''},
    { id: 2, name: 'Unleaded petrol', currentPrice: ''},
    { id: 3, name: 'Super Gasoline', currentPrice: ''},
    { id: 4, name: 'Gas Oil', currentPrice: ''},
    { id: 5, name: 'LPG', currentPrice: ''},
    { id: 6, name: 'Electric Charging (KW/H)', currentPrice: ''}
  ];

  const [fuels, setFuels] = useState<FuelType[]>(fuelTypes);

  const handlePriceChange = (id: number, field: keyof FuelType, value: string) => {
    setFuels(fuels.map(fuel => 
      fuel.id === id ? { ...fuel, [field]: value } : fuel
    ));
  };

  const handleSubmit = () => {
    // Ici vous pouvez sauvegarder les données
    console.log('Prix enregistrés:', fuels);
    alert('Prix mis à jour avec succès!');
  };

  return (
    <div>
      <h4 className="mb-4">Fuel Price Reference Baseline</h4>
      
      <Table striped bordered>
        <thead>
          <tr>
            <th>Fuel Type</th>
            <th>Current Price (DZD)</th>
          </tr>
        </thead>
        <tbody>
          {fuels.map((fuel) => (
            <tr key={fuel.id}>
              <td>{fuel.name}</td>
              <td>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={fuel.currentPrice}
                  onChange={(e) => 
                    handlePriceChange(fuel.id, 'currentPrice', e.target.value)
                  }
                  placeholder="0.00"
                />
              </td>
              
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-3 text-end">
        <Button variant="primary" onClick={handleSubmit}>
          Save Prices
        </Button>
      </div>
    </div>
  );
}