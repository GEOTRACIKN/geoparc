import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';

interface MissionBonus {
  id_ref_mission: number;
  name: string;
  amount: number;
  unit?: string;
  id_user?: number;
  created_at?: string;
  updated_at?: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Mission() {
  const [bonuses, setBonuses] = useState<MissionBonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentBonus, setCurrentBonus] = useState<MissionBonus | null>(null);
  const [formData, setFormData] = useState<Omit<MissionBonus, 'id_ref_mission'>>({ 
    name: '', 
    amount: 0,
    unit: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  
  // Search and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  const geopuserID = localStorage.getItem("GeopUserID");

  const fetchBonuses = async () => {
    try {
      setLoading(true);
      
      const bonusesRes = await axios.get(`${backendUrl}/api/geop/mission-bonus/${geopuserID}/${currentPage}/${itemsPerPage}`, {
        params: {
          searchTerm,
          sortColumn,
          sortOrder
        }
      });
      
      setBonuses(bonusesRes.data.data || []);
      
      const countRes = await axios.get(`${backendUrl}/api/geop/mission-bonus/count/${geopuserID}`, {
        params: { searchTerm }
      });
      
      setTotalItems(countRes.data.count);
      setTotalPages(Math.ceil(countRes.data.count / itemsPerPage));
      
    } catch (err) {
      toast.error('Error loading mission bonuses', {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (geopuserID) {
      fetchBonuses();
    }
  }, [currentPage, searchTerm, sortColumn, sortOrder, geopuserID]);

  const handleShowAdd = () => {
    setCurrentBonus(null);
    setFormData({ name: '', amount: 0, unit: '' });
    setShowModal(true);
  };

  const handleShowEdit = (bonus: MissionBonus) => {
    setCurrentBonus(bonus);
    setFormData({ 
      name: bonus.name, 
      amount: bonus.amount,
      unit: bonus.unit || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!geopuserID) {
        throw new Error('User ID not found');
      }

      if (currentBonus) {
        // Update existing bonus
        await axios.put(`${backendUrl}/api/geop/mission-bonus/${currentBonus.id_ref_mission}`, {
          ...formData,
          id_user: geopuserID
        });
        toast.success('Bonus updated successfully', {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      } else {
        // Create new bonus
        await axios.post(`${backendUrl}/api/geop/mission-bonus`, {
          ...formData,
          id_user: geopuserID
        });
        toast.success('Bonus added successfully', {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      }
      
      fetchBonuses();
      setShowModal(false);
    } catch (err) {
      toast.error(currentBonus ? 'Error updating bonus' : 'Error adding bonus', {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
      console.error(err);
    }
  };

  const handleDelete = async (id_ref_mission: number) => {
    if (window.confirm('Are you sure you want to delete this bonus?')) {
      try {
        if (!geopuserID) {
          throw new Error('User ID not found');
        }

        await axios.delete(`${backendUrl}/api/geop/mission-bonus/${id_ref_mission}/${geopuserID}`);
        toast.success('Bonus deleted successfully', {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        fetchBonuses();
      } catch (err) {
        toast.error('Error deleting bonus', {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        console.error(err);
      }
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortColumn(column);
      setSortOrder('ASC');
    }
  };

  const generatePageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisiblePages; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="container mt-4">
      <h2>Mission Bonus Management</h2>
      
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleShowAdd}>
          Add Bonus
        </Button>
        
        <Form.Group className="w-25">
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </div>
      
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : bonuses.length === 0 ? (
        <Alert variant="info">No bonuses found</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>
                  Name {sortColumn === 'name' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('amount')}>
                  Amount {sortColumn === 'amount' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th>Unit</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bonuses.map((bonus) => (
                <tr key={bonus.id_ref_mission}>
                  <td>{bonus.name}</td>
                  <td>{bonus.amount}</td>
                  <td>{bonus.unit || '-'}</td>
                  <td>{new Date(bonus.created_at || '').toLocaleDateString()}</td>
                  <td>
                    <Button 
                      variant="warning" 
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowEdit(bonus)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(bonus.id_ref_mission)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.First 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1} 
              />
              <Pagination.Prev 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1} 
              />
              
              {generatePageNumbers().map((pageNum: number) => (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              ))}
              
              <Pagination.Next 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages} 
              />
              <Pagination.Last 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages} 
              />
            </Pagination>
          )}
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentBonus ? 'Edit Bonus' : 'Add Bonus'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Unit</Form.Label>
              <Form.Control
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                placeholder="e.g. DZD"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}