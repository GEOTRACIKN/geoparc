import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Form, Spinner, Alert, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useTranslate } from '../../hooks/LanguageProvider';
import { Bounce, toast } from 'react-toastify';

interface DataItem {
  id: number;
  name: string;
  created_at?: string;
}

interface ApiError extends Error {
  response?: {
    data?: any;
    status?: number;
    headers?: any;
  };
  config?: any;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Data() {
  const { translate } = useTranslate();
  const geopuserID = localStorage.getItem("GeopUserID");
  
  // États pour chaque type de données (initialisés à null pour détecter le premier chargement)
  const [services, setServices] = useState<DataItem[] | null>(null);
  const [customers, setCustomers] = useState<DataItem[] | null>(null);
  const [goods, setGoods] = useState<DataItem[] | null>(null);
  const [locations, setLocations] = useState<DataItem[] | null>(null);
  const [units, setUnits] = useState<DataItem[] | null>(null);
  
  const [loading, setLoading] = useState({
    services: true,
    customers: true,
    goods: true,
    locations: true,
    units: true
  });
  
  const [showModal, setShowModal] = useState({
    services: false,
    customers: false,
    goods: false,
    locations: false,
    units: false
  });
  
  const [newItem, setNewItem] = useState({
    services: '',
    customers: '',
    goods: '',
    locations: '',
    units: ''
  });
  const [sectionSearch, setSectionSearch] = useState({
    services: '',
    customers: '',
    goods: '',
    locations: '',
    units: ''
  });

  // Fonction générique pour charger les données avec gestion d'erreur améliorée
  const fetchData = useCallback(async (endpoint: string, setData: React.Dispatch<React.SetStateAction<DataItem[] | null>>) => {
    try {
      console.log(`Starting to fetch ${endpoint} for user ${geopuserID}`);
      const response = await axios.get(`${backendUrl}/api/geop/data/${endpoint}/${geopuserID}`, {
        timeout: 10000 // 10 secondes timeout
      });
      
      console.log(`Received data for ${endpoint}:`, response.data);
      
      // Vérification que la réponse est bien un tableau
      const data = Array.isArray(response.data) ? response.data : [];
      setData(data);
      
      // Mise à jour du statut de chargement
      setLoading(prev => ({...prev, [endpoint]: false}));
      
    } catch (error) {
      const err = error as ApiError;
      console.error(`Error fetching ${endpoint}:`, {
        error: err,
        response: err.response,
        config: err.config
      });
      
      setData([]); // Définir un tableau vide en cas d'erreur
      setLoading(prev => ({...prev, [endpoint]: false}));
      
      toast.error(translate(`Error loading ${endpoint}`), {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
    }
  }, [geopuserID, translate]);

  // Fonction générique pour ajouter un élément
  const handleAdd = async (endpoint: string, name: string, setData: React.Dispatch<React.SetStateAction<DataItem[] | null>>) => {
    if (!name.trim()) return;
    
    try {
      const response = await axios.post(`${backendUrl}/api/geop/data/${endpoint}`, {
        id_user: geopuserID,
        name: name.trim()
      }, {
        timeout: 10000
      });
      
      setData(prev => {
        const newItem = { 
          id: response.data.id, 
          name: name.trim() 
        };
        return prev ? [...prev, newItem] : [newItem];
      });
      
      setNewItem(prev => ({...prev, [endpoint]: ''}));
      setShowModal(prev => ({...prev, [endpoint]: false}));
      
      toast.success(translate(`${endpoint.slice(0, -1)} added successfully`), {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
    } catch (error) {
      console.error(`Error adding to ${endpoint}:`, error);
      toast.error(translate(`Error adding ${endpoint.slice(0, -1)}`), {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
    }
  };

  // Fonction générique pour supprimer un élément
  const handleDelete = async (endpoint: string, id: number, setData: React.Dispatch<React.SetStateAction<DataItem[] | null>>) => {
    if (window.confirm(translate(`Are you sure you want to delete this ${endpoint.slice(0, -1)}?`))) {
      try {
        await axios.delete(`${backendUrl}/api/geop/data/${endpoint}/${id}`, {
          timeout: 10000
        });
        
        setData(prev => prev ? prev.filter(item => item.id !== id) : null);
        
        toast.success(translate(`${endpoint.slice(0, -1)} deleted successfully`), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      } catch (error) {
        console.error(`Error deleting from ${endpoint}:`, error);
        toast.error(translate(`Error deleting ${endpoint.slice(0, -1)}`), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      }
    }
  };

  // Chargement initial des données
  useEffect(() => {
    console.log("Initializing data fetching...");
    fetchData('services', setServices);
    fetchData('customers', setCustomers);
    fetchData('goods', setGoods);
    fetchData('locations', setLocations);
    fetchData('units', setUnits);
  }, [fetchData]);

  // Composant de section réutilisable avec gestion améliorée des états
  const DataSection = ({
    title,
    endpoint,
    items,
    loading,
    onAdd,
    onDelete,
    showModal,
    setShowModal,
    newItem,
    setNewItem,
    searchTerm,
    setSearchTerm
  }: {
    title: string;
    endpoint: string;
    items: DataItem[] | null;
    loading: boolean;
    onAdd: (name: string) => void;
    onDelete: (id: number) => void;
    showModal: boolean;
    setShowModal: (val: boolean) => void;
    newItem: string;
    setNewItem: (val: string) => void;
    searchTerm: string;
    setSearchTerm: (val: string) => void;
  }) => {
    const visibleItems = items?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>{translate(title)}</h5>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => setShowModal(true)}
        >
          {translate(`Add ${title}`)}
        </Button>
      </Card.Header>
      <Card.Body>
        <Form.Control
          className="mb-3"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={translate('Search...')}
        />

        {items === null ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p className="mt-2">{translate('Loading...')}</p>
          </div>
        ) : visibleItems?.length === 0 ? (
          <Alert variant="info">
            {translate(`No ${title.toLowerCase()} found`)}
            <Button 
              variant="link" 
              onClick={() => fetchData(endpoint, endpoint === 'services' ? setServices : 
                endpoint === 'customers' ? setCustomers : 
                endpoint === 'goods' ? setGoods :
                endpoint === 'units' ? setUnits : setLocations)}
            >
              {translate('Retry')}
            </Button>
          </Alert>
        ) : (
          <ListGroup>
            {visibleItems?.map((item) => (
              <ListGroup.Item 
                key={item.id}
                className="d-flex justify-content-between align-items-center"
              >
                {item.name}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                >
                  {translate('Delete')}
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>

      <Modal show={showModal} onHide={() => setShowModal(false)} className="reference-drawer-modal">
        <Modal.Header closeButton>
          <Modal.Title>{translate(`Add ${title}`)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{translate('Name')}</Form.Label>
              <Form.Control
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={translate(`Enter ${title.toLowerCase()} name`)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {translate('Cancel')}
          </Button>
          <Button 
            variant="primary" 
            onClick={() => onAdd(newItem)}
            disabled={!newItem.trim()}
          >
            {translate('Save')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
  };

  return (
    <div className="container mt-4">
      <h2>{translate('Data Management')}</h2>
      
      <DataSection
        title="Services"
        endpoint="services"
        items={services}
        loading={loading.services}
        onAdd={(name) => handleAdd('services', name, setServices)}
        onDelete={(id) => handleDelete('services', id, setServices)}
        showModal={showModal.services}
        setShowModal={(val) => setShowModal({...showModal, services: val})}
        newItem={newItem.services}
        setNewItem={(val) => setNewItem({...newItem, services: val})}
        searchTerm={sectionSearch.services}
        setSearchTerm={(val) => setSectionSearch({...sectionSearch, services: val})}
      />
      
      <DataSection
        title="Customers"
        endpoint="customers"
        items={customers}
        loading={loading.customers}
        onAdd={(name) => handleAdd('customers', name, setCustomers)}
        onDelete={(id) => handleDelete('customers', id, setCustomers)}
        showModal={showModal.customers}
        setShowModal={(val) => setShowModal({...showModal, customers: val})}
        newItem={newItem.customers}
        setNewItem={(val) => setNewItem({...newItem, customers: val})}
        searchTerm={sectionSearch.customers}
        setSearchTerm={(val) => setSectionSearch({...sectionSearch, customers: val})}
      />
      
      <DataSection
        title="Goods"
        endpoint="goods"
        items={goods}
        loading={loading.goods}
        onAdd={(name) => handleAdd('goods', name, setGoods)}
        onDelete={(id) => handleDelete('goods', id, setGoods)}
        showModal={showModal.goods}
        setShowModal={(val) => setShowModal({...showModal, goods: val})}
        newItem={newItem.goods}
        setNewItem={(val) => setNewItem({...newItem, goods: val})}
        searchTerm={sectionSearch.goods}
        setSearchTerm={(val) => setSectionSearch({...sectionSearch, goods: val})}
      />
      
      <DataSection
        title="Locations"
        endpoint="locations"
        items={locations}
        loading={loading.locations}
        onAdd={(name) => handleAdd('locations', name, setLocations)}
        onDelete={(id) => handleDelete('locations', id, setLocations)}
        showModal={showModal.locations}
        setShowModal={(val) => setShowModal({...showModal, locations: val})}
        newItem={newItem.locations}
        setNewItem={(val) => setNewItem({...newItem, locations: val})}
        searchTerm={sectionSearch.locations}
        setSearchTerm={(val) => setSectionSearch({...sectionSearch, locations: val})}
      />

      <DataSection
        title="Units"
        endpoint="units"
        items={units}
        loading={loading.units}
        onAdd={(name) => handleAdd('units', name, setUnits)}
        onDelete={(id) => handleDelete('units', id, setUnits)}
        showModal={showModal.units}
        setShowModal={(val) => setShowModal({...showModal, units: val})}
        newItem={newItem.units}
        setNewItem={(val) => setNewItem({...newItem, units: val})}
        searchTerm={sectionSearch.units}
        setSearchTerm={(val) => setSectionSearch({...sectionSearch, units: val})}
      />
    </div>
  );
}
