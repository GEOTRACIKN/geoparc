import React, { useState, useEffect } from 'react';
import { useReferenceTablePreferences } from '../../hooks/useReferenceTablePreferences';
import { Table, Button, Modal, Form, Spinner, Alert, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { useTranslate } from '../../hooks/LanguageProvider';
import { Bounce, toast } from 'react-toastify';

interface Depot {
  id_depot: number;
  nom_depot: string;
  emplacement: string;
  id_user: number;
  date_creation?: string;
}

interface GeocodeSuggestion {
  place_id: number | string;
  display_name: string;
  lat?: string;
  lon?: string;
  type?: string;
  class?: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function DepotManagement() {
  const { translate } = useTranslate();
  const [depots, setDepots] = useState<Depot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentDepot, setCurrentDepot] = useState<Depot | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [locationSearchLoading, setLocationSearchLoading] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [formData, setFormData] = useState<Omit<Depot, 'id_depot' | 'date_creation'>>({ 
    nom_depot: '', 
    emplacement: '',
    id_user: 0
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
  } = useReferenceTablePreferences('warehouses', {
    sortColumn: 'date_creation',
    sortDirection: 'DESC',
  });
  
  // Search and sort state

  const geopuserID = localStorage.getItem("GeopUserID");

  const fetchDepots = async () => {
    try {
      setLoading(true);
      
      const depotsRes = await axios.get(`${backendUrl}/api/geop/depot/${geopuserID}/${currentPage}/${itemsPerPage}`, {
        params: {
          searchTerm,
          sortColumn,
          sortOrder
        }
      });
      
      setDepots(depotsRes.data);
      
      const countRes = await axios.get(`${backendUrl}/api/geop/depot/count/${geopuserID}`, {
        params: { searchTerm }
      });
      
      setTotalItems(countRes.data.count);
      setTotalPages(Math.ceil(countRes.data.count / itemsPerPage));
      
    } catch (err) {
      toast.error(translate('Error loading depots'), {
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
    if (geopuserID && preferencesLoaded) {
      fetchDepots();
    }
  }, [currentPage, itemsPerPage, searchTerm, sortColumn, sortOrder, translate, geopuserID, preferencesLoaded]);

  useEffect(() => {
    const query = formData.emplacement.trim();

    if (!showModal || query.length < 3) {
      setLocationSuggestions([]);
      setLocationSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setLocationSearchLoading(true);
        const response = await axios.get(`${backendUrl}/api/geocode/search`, {
          params: { q: query },
          signal: controller.signal,
        });

        setLocationSuggestions(Array.isArray(response.data) ? response.data : []);
        setShowLocationSuggestions(true);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setLocationSuggestions([]);
        }
      } finally {
        setLocationSearchLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [formData.emplacement, showModal]);

  const handleShowAdd = () => {
    setCurrentDepot(null);
    setFormData({ 
      nom_depot: '', 
      emplacement: '',
      id_user: parseInt(geopuserID || '0')
    });
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
    setShowModal(true);
  };

  const handleShowEdit = (depot: Depot) => {
    setCurrentDepot(depot);
    setFormData({ 
      nom_depot: depot.nom_depot, 
      emplacement: depot.emplacement || '',
      id_user: depot.id_user
    });
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.nom_depot.trim()) {
        toast.error(translate('Depot name is required'), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        return;
      }

      if (currentDepot) {
        // Update existing depot
        await axios.put(`${backendUrl}/api/geop/depot/${currentDepot.id_depot}`, {
          ...formData,
          id_user: geopuserID
        });
        toast.success(translate('Depot updated successfully'), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      } else {
        // Create new depot
        await axios.post(`${backendUrl}/api/geop/depot`, {
          ...formData,
          id_user: geopuserID
        });
        toast.success(translate('Depot added successfully'), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      }
      
      fetchDepots();
      setShowModal(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 
                          (currentDepot ? 'Error updating depot' : 'Error adding depot');
      toast.error(translate(errorMessage), {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
      console.error(err);
    }
  };

  const handleDelete = async (id_depot: number) => {
    if (window.confirm(translate('Are you sure you want to delete this depot?'))) {
      try {
        await axios.delete(`${backendUrl}/api/geop/depot/${id_depot}`);
        toast.success(translate('Depot deleted successfully'), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        fetchDepots();
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Error deleting depot';
        toast.error(translate(errorMessage), {
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
      <h2>{translate('Depot Management')}</h2>
      
      <div className="reference-table-toolbar">
        <Button variant="primary" onClick={handleShowAdd}>
          {translate('Add Depot')}
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
      ) : depots.length === 0 ? (
        <Alert variant="info">{translate('No depots found')}</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th onClick={() => handleSort('nom_depot')}>
                  {translate('Depot Name')} {sortColumn === 'nom_depot' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('emplacement')}>
                  {translate('Location')} {sortColumn === 'emplacement' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('date_creation')}>
                  {translate('Created At')} {sortColumn === 'date_creation' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th>{translate('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {depots.map((depot) => (
                <tr key={depot.id_depot}>
                  <td>{depot.nom_depot}</td>
                  <td>{depot.emplacement || '-'}</td>
                  <td>{depot.date_creation ? new Date(depot.date_creation).toLocaleDateString() : '-'}</td>
                  <td>
                    <Button 
                      variant="warning" 
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowEdit(depot)}
                    >
                      {translate('Edit')}
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(depot.id_depot)}
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
            {currentDepot ? translate('Edit Depot') : translate('Add Depot')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{translate('Depot Name')} *</Form.Label>
              <Form.Control
                type="text"
                value={formData.nom_depot}
                onChange={(e) => setFormData({...formData, nom_depot: e.target.value})}
                required
                placeholder={translate('Enter depot name')}
              />
            </Form.Group>
            <Form.Group className="reference-address-field">
              <Form.Label>{translate('Location')}</Form.Label>
              <Form.Control
                type="text"
                value={formData.emplacement}
                onChange={(e) => {
                  setFormData({...formData, emplacement: e.target.value});
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => setShowLocationSuggestions(true)}
                placeholder={translate('Enter location')}
                autoComplete="off"
              />
              {locationSearchLoading && (
                <div className="reference-address-loading">
                  <Spinner animation="border" size="sm" />
                  <span>{translate('Searching...')}</span>
                </div>
              )}
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="reference-address-suggestions">
                  {locationSuggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion.place_id}
                      onClick={() => {
                        setFormData({...formData, emplacement: suggestion.display_name});
                        setShowLocationSuggestions(false);
                      }}
                    >
                      <span>{suggestion.display_name}</span>
                      {(suggestion.lat || suggestion.lon) && (
                        <small>
                          {suggestion.lat}, {suggestion.lon}
                        </small>
                      )}
                    </button>
                  ))}
                </div>
              )}
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
