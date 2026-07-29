import React, { useState, useEffect } from 'react';
import { useReferenceTablePreferences } from '../../hooks/useReferenceTablePreferences';
import { Table, Button, Form, Badge, InputGroup, Card, Modal, Spinner, Alert, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';

interface Supplier {
  id_supplier: number;
  name_supplier: string;
  phone_supplier: string;
  address_supplier: string;
  type_supplier: string;
  created_at_supplier?: string;
  updated_at_supplier?: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const activityTypes = [
  'Fournisseur carburant',
  'Fournisseur pneumatique',
  'Fournisseur pièces détachées',
  'Fournisseur véhicule',
  'Fournisseur carrosserie'
];

export default function Supplier() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const {
    currentPageSize: itemsPerPage,
    setCurrentPageSize: setItemsPerPage,
    currentSearchText: searchTerm,
    setCurrentSearchText: setSearchTerm,
    loaded: preferencesLoaded,
  } = useReferenceTablePreferences('suppliers');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Supplier, 'id_supplier'>>({ 
    name_supplier: '', 
    phone_supplier: '',
    address_supplier: '',
    type_supplier: activityTypes[0]
  });

  const geopuserID = localStorage.getItem("GeopUserID");

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      
      const suppliersRes = await axios.get(`${backendUrl}/api/geop/supplier/${geopuserID}/${currentPage}/${itemsPerPage}`, {
        params: { searchTerm }
      });
      
      setSuppliers(suppliersRes.data);
      
      const countRes = await axios.get(`${backendUrl}/api/geop/supplier/count/${geopuserID}`, {
        params: { searchTerm }
      });
      
      setTotalItems(countRes.data.count);
      setTotalPages(Math.ceil(countRes.data.count / itemsPerPage));
      
    } catch (err) {
      toast.error('Erreur lors du chargement des fournisseurs', {
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
    fetchSuppliers();
  }, [currentPage, itemsPerPage, preferencesLoaded, searchTerm]);

  const handleShowAdd = () => {
    setCurrentSupplier(null);
    setFormData({ 
      name_supplier: '', 
      phone_supplier: '', 
      address_supplier: '', 
      type_supplier: activityTypes[0] 
    });
    setShowModal(true);
  };

  const handleShowEdit = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setFormData({ 
      name_supplier: supplier.name_supplier, 
      phone_supplier: supplier.phone_supplier,
      address_supplier: supplier.address_supplier,
      type_supplier: supplier.type_supplier
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (currentSupplier) {
        // Update existing supplier
        await axios.put(`${backendUrl}/api/geop/supplier/${currentSupplier.id_supplier}`, {
          ...formData,
          id_user: geopuserID
        });
        toast.success('Fournisseur modifié avec succès', {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      } else {
        // Create new supplier
        await axios.post(`${backendUrl}/api/geop/supplier`, {
          ...formData,
          id_user: geopuserID
        });
        toast.success('Fournisseur ajouté avec succès', {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      }
      
      fetchSuppliers();
      setShowModal(false);
    } catch (err) {
      toast.error(currentSupplier ? 'Erreur lors de la modification' : 'Erreur lors de l\'ajout', {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
      console.error(err);
    }
  };

  const handleDelete = async (id_supplier: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      try {
        await axios.delete(`${backendUrl}/api/geop/supplier/${id_supplier}`);
        toast.success('Fournisseur supprimé avec succès', {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        fetchSuppliers();
      } catch (err) {
        toast.error('Erreur lors de la suppression', {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        console.error(err);
      }
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

      {/* Bouton d'ajout */}
      <div className="mb-4">
        <Button variant="primary" onClick={handleShowAdd}>
          <i className="fas fa-plus me-2"></i>
          Ajouter un fournisseur
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : suppliers.length === 0 ? (
        <Alert variant="info">Aucun fournisseur trouvé</Alert>
      ) : (
        <>
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
              {suppliers.map((supplier) => (
                <tr key={supplier.id_supplier}>
                  <td>{supplier.name_supplier}</td>
                  <td>{supplier.phone_supplier}</td>
                  <td>{supplier.address_supplier}</td>
                  <td>
                    <Badge bg="info">
                      {supplier.type_supplier}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowEdit(supplier)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(supplier.id_supplier)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
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

      {/* Modal pour ajouter/modifier */}
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentSupplier ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Nom *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name_supplier}
                    onChange={(e) => setFormData({...formData, name_supplier: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.phone_supplier}
                    onChange={(e) => setFormData({...formData, phone_supplier: e.target.value})}
                  />
                </Form.Group>
              </div>
              <div className="col-12">
                <Form.Group>
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.address_supplier}
                    onChange={(e) => setFormData({...formData, address_supplier: e.target.value})}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Activité *</Form.Label>
                  <Form.Select
                    value={formData.type_supplier}
                    onChange={(e) => setFormData({...formData, type_supplier: e.target.value})}
                    required
                  >
                    {activityTypes.map(activity => (
                      <option key={activity} value={activity}>{activity}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {currentSupplier ? 'Modifier' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
