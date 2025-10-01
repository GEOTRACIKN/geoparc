import { useState, useEffect } from 'react';
import { Table, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

type FuelType = {
  id: number;
  name: string;
  fieldName: string;
  currentPrice: number | string;
};

type FuelProps = {
  geopuserID?: number; // Make it optional since we'll fall back to localStorage
};
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Fuel({ geopuserID }: FuelProps) {
  const [fuels, setFuels] = useState<FuelType[]>([
    { id: 1, name: 'Normal Essence', fieldName: 'ess_norm', currentPrice: '' },
    { id: 2, name: 'Unleaded petrol', fieldName: 'ess_sp', currentPrice: '' },
    { id: 3, name: 'Super Gasoline', fieldName: 'ess_sup', currentPrice: '' },
    { id: 4, name: 'Gas Oil', fieldName: 'gasoil', currentPrice: '' },
    { id: 5, name: 'LPG', fieldName: 'gpl', currentPrice: '' },
    { id: 6, name: 'Electric Charging (KW/H)', fieldName: 'elec_kwh', currentPrice: '' }
  ]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get user ID from props or localStorage
  const userId = geopuserID || Number(localStorage.getItem("GeopUserID"));

 useEffect(() => {
  const fetchFuelPrices = async () => {
    try {
      console.log('Fetching fuel prices for user:', userId); // Debug log
      const response = await axios.get(`${backendUrl}/api/geop/fuel/${userId}`);
      console.log('API response:', response); // Debug log
      
      if (response.data) {
        setFuels(prevFuels => 
          prevFuels.map(fuel => ({
            ...fuel,
            currentPrice: response.data[fuel.fieldName] || ''
          }))
        );
      }
    } catch (err) {
      console.error('Full error:', err); // More detailed error logging
      if (axios.isAxiosError(err)) {
        console.error('Error response:', err.response); // Axios-specific logging
        if (err.response?.data?.code === 'PRICES_NOT_FOUND') {
          // No prices exist yet - this is okay
        } else {
          setError(err.response?.data?.message || 'Failed to load fuel prices');
        }
      } else {
        setError('Failed to load fuel prices');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchFuelPrices();
}, [userId]);

  const handlePriceChange = (id: number, value: string) => {
    setFuels(fuels.map(fuel => 
      fuel.id === id ? { ...fuel, currentPrice: value } : fuel
    ));
  };

 const handleSubmit = async () => {
  try {
    if (!userId) {
      setError('User ID not found');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    const fuelData = fuels.reduce((acc, fuel) => {
      acc[fuel.fieldName] = fuel.currentPrice === '' ? 0 : Number(fuel.currentPrice);
      return acc;
    }, {} as Record<string, number>);

    const response = await axios.put(`${backendUrl}/api/geop/fuel/${userId}`, fuelData);
    
    if (response.status === 200) {
      setSuccess('Prices updated successfully!');
    } else {
      throw new Error(response.data.message || 'Failed to update prices');
    }
  } catch (err: any) {
    setError(err.response?.data?.message || err.message || 'Failed to update prices');
    console.error('Error updating fuel prices:', err);
  } finally {
    setLoading(false);
  }
};

  if (!userId) {
    return <Alert variant="danger">User ID not found. Please log in.</Alert>;
  }

  if (loading && fuels.every(f => f.currentPrice === '')) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <h4 className="mb-4">Fuel Price Reference Baseline</h4>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

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
                  min="0"
                  value={fuel.currentPrice}
                  onChange={(e) => handlePriceChange(fuel.id, e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-3 text-end">
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Save Prices'}
        </Button>
      </div>
    </div>
  );
}