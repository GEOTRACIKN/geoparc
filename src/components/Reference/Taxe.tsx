import React, { useState, useEffect } from 'react';
import { useReferenceTablePreferences } from '../../hooks/useReferenceTablePreferences';
import { Table, Button, Modal, Form, Spinner, Alert, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { useTranslate } from '../../hooks/LanguageProvider';
import { Bounce, toast } from 'react-toastify';

interface Taxe {
  id_taxe: number;
  name_taxe: string;
  rate_taxe: number;
  created_at_taxe?: string;
  updated_at_taxe?: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Taxe() {
  const { translate } = useTranslate();
  const [taxes, setTaxes] = useState<Taxe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentTaxe, setCurrentTaxe] = useState<Taxe | null>(null);
  const [formData, setFormData] = useState<Omit<Taxe, 'id_taxe'>>({ 
    name_taxe: '', 
    rate_taxe: 0 
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const {
    currentPageSize: itemsPerPage,
    setCurrentPageSize: setItemsPerPage,
    currentSearchText: searchTerm,
    setCurrentSearchText: setSearchTerm,
    currentSortColumn: sortColumn,
    setCurrentSortColumn: setSortColumn,
    currentSortDirection: sortOrder,
    setCurrentSortDirection: setSortOrder,
    loaded: preferencesLoaded,
  } = useReferenceTablePreferences('taxes', {
    sortColumn: 'created_at_taxe',
    sortDirection: 'DESC',
  });
  
  // Search and sort state

  const geopuserID = localStorage.getItem("GeopUserID");

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      
      const taxesRes = await axios.get(`${backendUrl}/api/geop/taxe/${geopuserID}/${currentPage}/${itemsPerPage}`, {
        params: {
          searchTerm,
          sortColumn,
          sortOrder
        }
      });
      
      setTaxes(taxesRes.data);
      
      const countRes = await axios.get(`${backendUrl}/api/geop/taxe/count/${geopuserID}`, {
        params: { searchTerm }
      });
      
      setTotalItems(countRes.data.count);
      setTotalPages(Math.ceil(countRes.data.count / itemsPerPage));
      
    } catch (err) {
      toast.error(translate('Error loading taxes'), {
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
    if (!preferencesLoaded) return;
    fetchTaxes();
  }, [currentPage, itemsPerPage, preferencesLoaded, searchTerm, sortColumn, sortOrder, translate]);

  const handleShowAdd = () => {
    setCurrentTaxe(null);
    setFormData({ name_taxe: '', rate_taxe: 0 });
    setShowModal(true);
  };

  const handleShowEdit = (taxe: Taxe) => {
    setCurrentTaxe(taxe);
    setFormData({ 
      name_taxe: taxe.name_taxe, 
      rate_taxe: taxe.rate_taxe 
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (currentTaxe) {
        // Update existing tax
        await axios.put(`${backendUrl}/api/geop/taxe/${currentTaxe.id_taxe}`, {
          ...formData,
          id_user: geopuserID
        });
        toast.success(translate('Tax updated successfully'), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      } else {
        // Create new tax
        await axios.post(`${backendUrl}/api/geop/taxe`, {
          ...formData,
          id_user: geopuserID
        });
        toast.success(translate('Tax added successfully'), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      }
      
      fetchTaxes();
      setShowModal(false);
    } catch (err) {
      toast.error(translate(currentTaxe ? 'Error updating tax' : 'Error adding tax'), {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
      console.error(err);
    }
  };

  const handleDelete = async (id_taxe: number) => {
    if (window.confirm(translate('Are you sure you want to delete this tax?'))) {
      try {
        await axios.delete(`${backendUrl}/api/geop/taxe/${id_taxe}/${geopuserID}`);
        toast.success(translate('Tax deleted successfully'), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        fetchTaxes();
      } catch (err) {
        toast.error(translate('Error deleting tax'), {
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
      <h2>{translate('Tax Management')}</h2>
      
      <div className="reference-table-toolbar">
        <Button variant="primary" onClick={handleShowAdd}>
          {translate('Add Tax')}
        </Button>
        
        <div className="reference-table-controls">
          <span className="reference-total-items">{totalItems} {translate('items')}</span>
          <Form.Select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            aria-label={translate('Items per page')}
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </Form.Select>
          <Form.Control
            type="text"
            placeholder={translate('Search...')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : taxes.length === 0 ? (
        <Alert variant="info">{translate('No taxes found')}</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th onClick={() => handleSort('name_taxe')}>
                  {translate('Name')} {sortColumn === 'name_taxe' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('rate_taxe')}>
                  {translate('Rate')} (%) {sortColumn === 'rate_taxe' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th>{translate('Created At')}</th>
                <th>{translate('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {taxes.map((taxe) => (
                <tr key={taxe.id_taxe}>
                  <td>{taxe.name_taxe}</td>
                  <td>{taxe.rate_taxe}</td>
                  <td>{new Date(taxe.created_at_taxe || '').toLocaleDateString()}</td>
                  <td>
                    <Button 
                      variant="warning" 
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowEdit(taxe)}
                    >
                      {translate('Edit')}
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(taxe.id_taxe)}
                    >
                      {translate('Delete')}
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

      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" className="reference-drawer-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentTaxe ? translate('Edit Tax') : translate('Add Tax')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{translate('Tax Name')}</Form.Label>
              <Form.Control
                type="text"
                value={formData.name_taxe}
                onChange={(e) => setFormData({...formData, name_taxe: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{translate('Rate')} (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={formData.rate_taxe}
                onChange={(e) => setFormData({...formData, rate_taxe: Number(e.target.value)})}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {translate('Cancel')}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {translate('Save')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
