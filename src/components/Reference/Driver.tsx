import React, { useState, useEffect } from 'react';
import { useReferenceTablePreferences } from '../../hooks/useReferenceTablePreferences';
import { Table, Button, Form, Modal, Spinner, Alert, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { useTranslate } from '../../hooks/LanguageProvider';
import { Bounce, toast } from 'react-toastify';

interface DriverCost {
  id_category: number;
  cat_name: string;
  base_salary: number;
  insurance: number;
  irg: number;
  bonus: number;
  flat_bonus: number;
  training: number;
  created_at?: string;
  updated_at?: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function DriversTab() {
  const { translate } = useTranslate();
  const [driverCosts, setDriverCosts] = useState<DriverCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<DriverCost | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<DriverCost, 'id_category'>>({ 
    cat_name: '',
    base_salary: 0,
    insurance: 0,
    irg: 0,
    bonus: 0,
    flat_bonus: 0,
    training: 0
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
  } = useReferenceTablePreferences('driver-categories', {
    sortColumn: 'id_category',
    sortDirection: 'DESC',
  });
  
  // Search and sort state

  const geopuserID = localStorage.getItem("GeopUserID");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${backendUrl}/api/geop/driverCategory/${geopuserID}/${currentPage}/${itemsPerPage}`, {
        params: {
          searchTerm,
          sortColumn,
          sortOrder
        }
      });
      
      setDriverCosts(response.data);
      
      const countRes = await axios.get(`${backendUrl}/api/geop/driverCategory/count/${geopuserID}`, {
        params: { searchTerm }
      });
      
      setTotalItems(countRes.data.count);
      setTotalPages(Math.ceil(countRes.data.count / itemsPerPage));
      
    } catch (err) {
      toast.error(translate('Error loading driver categories'), {
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
    fetchCategories();
  }, [currentPage, itemsPerPage, preferencesLoaded, searchTerm, sortColumn, sortOrder, translate]);

  const handleShowAdd = () => {
    setCurrentCategory(null);
    setFormData({ 
      cat_name: '',
      base_salary: 0,
      insurance: 0,
      irg: 0,
      bonus: 0,
      flat_bonus: 0,
      training: 0
    });
    setShowModal(true);
  };

  const handleShowEdit = (category: DriverCost) => {
    setCurrentCategory(category);
    setFormData({ 
      cat_name: category.cat_name,
      base_salary: category.base_salary,
      insurance: category.insurance,
      irg: category.irg,
      bonus: category.bonus,
      flat_bonus: category.flat_bonus,
      training: category.training
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (currentCategory) {
        // Update existing category
        await axios.put(`${backendUrl}/api/geop/driverCategory/${currentCategory.id_category}`, {
          ...formData,
          id_user: geopuserID
        });
        toast.success(translate('Driver category updated successfully'), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      } else {
        // Create new category
        await axios.post(`${backendUrl}/api/geop/driverCategory`, {
          ...formData,
          id_user: geopuserID
        });
        toast.success(translate('Driver category added successfully'), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      }
      
      fetchCategories();
      setShowModal(false);
    } catch (err) {
      toast.error(translate(currentCategory ? 'Error updating driver category' : 'Error adding driver category'), {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
      console.error(err);
    }
  };

  const handleDeleteClick = (id_category: number) => {
    setCategoryToDelete(id_category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await axios.delete(`${backendUrl}/api/geop/driverCategory/${categoryToDelete}/${geopuserID}`);
      toast.success(translate('Driver category deleted successfully'), {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
      fetchCategories();
    } catch (err) {
      toast.error(translate('Error deleting driver category'), {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
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
      <h2>{translate('Driver Categories Management')}</h2>
      
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleShowAdd}>
          {translate('Add Driver Category')}
        </Button>
        
        <Form.Group className="w-25">
          <Form.Control
            type="text"
            placeholder={translate('Search...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </div>
      
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : driverCosts.length === 0 ? (
        <Alert variant="info">{translate('No driver categories found')}</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th onClick={() => handleSort('cat_name')}>
                  {translate('Category Name')} {sortColumn === 'cat_name' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('base_salary')}>
                  {translate('Base Salary')} {sortColumn === 'base_salary' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('insurance')}>
                  {translate('Insurance')} {sortColumn === 'insurance' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('irg')}>
                  {translate('IRG')} {sortColumn === 'irg' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('bonus')}>
                  {translate('Bonus')} {sortColumn === 'bonus' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('flat_bonus')}>
                  {translate('Flat Bonus')} {sortColumn === 'flat_bonus' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('training')}>
                  {translate('Training')} {sortColumn === 'training' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th>{translate('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {driverCosts.map((category) => (
                <tr key={category.id_category}>
                  <td>{category.cat_name}</td>
                  <td>{category.base_salary}</td>
                  <td>{category.insurance}</td>
                  <td>{category.irg}</td>
                  <td>{category.bonus}</td>
                  <td>{category.flat_bonus}</td>
                  <td>{category.training}</td>
                  <td>
                    <Button 
                      variant="warning" 
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowEdit(category)}
                    >
                      {translate('Edit')}
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteClick(category.id_category)}
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

      {/* Modal pour ajouter/modifier une catégorie */}
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentCategory ? translate('Edit Driver Category') : translate('Add Driver Category')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{translate('Category Name')}</Form.Label>
              <Form.Control
                type="text"
                value={formData.cat_name}
                onChange={(e) => setFormData({...formData, cat_name: e.target.value})}
                required
              />
            </Form.Group>

            <div className="row">
              <Form.Group className="col-md-6 mb-3">
                <Form.Label>{translate('Base Salary')}</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.base_salary}
                  onChange={(e) => setFormData({...formData, base_salary: Number(e.target.value)})}
                  required
                />
              </Form.Group>

              <Form.Group className="col-md-6 mb-3">
                <Form.Label>{translate('Insurance')}</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.insurance}
                  onChange={(e) => setFormData({...formData, insurance: Number(e.target.value)})}
                  required
                />
              </Form.Group>

              <Form.Group className="col-md-6 mb-3">
                <Form.Label>{translate('IRG')}</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.irg}
                  onChange={(e) => setFormData({...formData, irg: Number(e.target.value)})}
                  required
                />
              </Form.Group>

              <Form.Group className="col-md-6 mb-3">
                <Form.Label>{translate('Bonus')}</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.bonus}
                  onChange={(e) => setFormData({...formData, bonus: Number(e.target.value)})}
                  required
                />
              </Form.Group>

              <Form.Group className="col-md-6 mb-3">
                <Form.Label>{translate('Flat Bonus')}</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.flat_bonus}
                  onChange={(e) => setFormData({...formData, flat_bonus: Number(e.target.value)})}
                  required
                />
              </Form.Group>

              <Form.Group className="col-md-6 mb-3">
                <Form.Label>{translate('Training')}</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.training}
                  onChange={(e) => setFormData({...formData, training: Number(e.target.value)})}
                  required
                />
              </Form.Group>
            </div>
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

      {/* Modal de confirmation pour la suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{translate('Confirm Deletion')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {translate('Are you sure you want to delete this driver category?')}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {translate('Cancel')}
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            {translate('Delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
