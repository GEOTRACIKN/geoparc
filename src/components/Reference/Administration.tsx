import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Card, Button, Form, InputGroup, Modal, Spinner, Alert, Badge, Row, Col } from 'react-bootstrap';
import { toast, Bounce } from 'react-toastify';
import axios from 'axios';

// Types pour les données
interface AdministrationData {
  id_administration: number;
  id_user: number;
  logo_image: string | null;
  header_image: string | null;
  footer_image: string | null;
  currency_symbol: string;
  created_at: string;
  updated_at: string;
}

interface AdministrationItem {
  id: number;
  type: 'logo' | 'header' | 'footer';
  name: string;
  description: string;
  imageUrl: string | null;
}

// Options de devises
const currencyOptions = [
  { value: '€', label: 'Euro', symbol: '€' },
  { value: '$', label: 'Dollar américain', symbol: '$' },
  { value: '£', label: 'Livre sterling', symbol: '£' },
  { value: '¥', label: 'Yen japonais', symbol: '¥' },
  { value: 'CA$', label: 'Dollar canadien', symbol: 'CA$' },
  { value: 'A$', label: 'Dollar australien', symbol: 'A$' },
  { value: 'CHF', label: 'Franc suisse', symbol: 'CHF' },
  { value: 'CN¥', label: 'Yuan chinois', symbol: 'CN¥' }
];

// Données initiales
const initialAdministrationItems: AdministrationItem[] = [
  {
    id: 1,
    type: 'logo',
    name: 'Logo Société',
    description: 'Sélectionnez un symbole et téléchargez le logo principal de votre société',
    imageUrl: null
  },
  {
    id: 2,
    type: 'header',
    name: 'En-tête de Facture',
    description: 'Téléchargez l\'en-tête qui apparaîtra sur vos factures',
    imageUrl: null
  },
  {
    id: 3,
    type: 'footer',
    name: 'Bas de Facture',
    description: 'Téléchargez le pied de page qui apparaîtra sur vos factures',
    imageUrl: null
  }
];

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Administration: React.FC = () => {
  const [administrationData, setAdministrationData] = useState<AdministrationData | null>(null);
  const [administrationItems, setAdministrationItems] = useState<AdministrationItem[]>(initialAdministrationItems);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<AdministrationItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('€');
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const geopuserID = localStorage.getItem("GeopUserID");

  // Charger les données d'administration
  const fetchAdministrationData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${backendUrl}/api/geop/administration/${geopuserID}`);
      const data: AdministrationData = response.data;
      
      setAdministrationData(data);
      setSelectedCurrency(data.currency_symbol || '€');
      
      // Mettre à jour les URLs des images
      setAdministrationItems(prev => prev.map(item => ({
        ...item,
        imageUrl: item.type === 'logo' ? data.logo_image : 
                 item.type === 'header' ? data.header_image : 
                 data.footer_image
      })));
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données d\'administration', {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (geopuserID) {
      fetchAdministrationData();
    }
  }, [geopuserID]);

  // Gérer le changement de devise
  const handleCurrencyChange = async (currency: string) => {
    try {
      setSelectedCurrency(currency);
      
      await axios.put(`${backendUrl}/api/geop/administration/currency/${geopuserID}`, {
        currency_symbol: currency
      });
      
      toast.info(`Devise sélectionnée: ${currencyOptions.find(c => c.value === currency)?.label}`, {
        position: "bottom-right",
        autoClose: 2000,
        transition: Bounce,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la devise:', error);
      toast.error('Erreur lors de la mise à jour de la devise', {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
    }
  };

  // Gérer le téléchargement d'image
  const handleImageUpload = async (type: 'logo' | 'header' | 'footer', e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append(type, file);

      let endpoint = '';
      switch (type) {
        case 'logo':
          endpoint = 'logo';
          break;
        case 'header':
          endpoint = 'header';
          break;
        case 'footer':
          endpoint = 'footer';
          break;
      }

      const response = await axios.post(
        `${backendUrl}/api/geop/administration/${endpoint}/${geopuserID}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const imageUrl = response.data.imageUrl;

      // Mettre à jour l'état local
      setAdministrationItems(prev => 
        prev.map(item => 
          item.type === type ? { ...item, imageUrl } : item
        )
      );

      toast.success('Image téléchargée avec succès', {
        position: "bottom-right",
        autoClose: 2000,
        transition: Bounce,
      });

    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      toast.error('Erreur lors du téléchargement de l\'image', {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
    }
  };

  // Déclencher le sélecteur de fichier
  const triggerFileInput = (index: number) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click();
    }
  };

  // Afficher le modal de prévisualisation
  const handleShowPreview = (item: AdministrationItem) => {
    setCurrentItem(item);
    setShowModal(true);
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Mettre à jour tous les paramètres
      await axios.put(`${backendUrl}/api/geop/administration/${geopuserID}`, {
        logo_image: administrationItems.find(item => item.type === 'logo')?.imageUrl,
        header_image: administrationItems.find(item => item.type === 'header')?.imageUrl,
        footer_image: administrationItems.find(item => item.type === 'footer')?.imageUrl,
        currency_symbol: selectedCurrency
      });

      toast.success('Les modifications ont été enregistrées avec succès!', {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Une erreur est survenue lors de la sauvegarde.', {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Filtrer les éléments basés sur le terme de recherche
  const filteredItems = administrationItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="mb-4 p-4 bg-white rounded shadow-sm">
        <h4 className="mb-0 text-primary fw-bold">Administration des Logos</h4>
        <p className="text-muted mt-2">Gérez les logos, en-têtes et pieds de page de votre entreprise</p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-3 p-4 bg-white rounded shadow-sm">
        <InputGroup>
          <InputGroup.Text style={{ backgroundColor: '#e9ecef' }}>
            <i className="fas fa-search text-secondary"></i>
          </InputGroup.Text>
          <Form.Control
            placeholder="Rechercher par nom ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderLeft: 'none' }}
          />
          <Button variant="outline-primary">
            <i className="fas fa-filter me-1"></i> Filtrer
          </Button>
        </InputGroup>
      </div>

      {/* Sélecteur de devise */}
      <div className="mb-4 p-4 bg-white rounded shadow-sm">
        <Row className="align-items-center">
          <Col md={3}>
            <h6 className="mb-0 fw-semibold">Devise par défaut:</h6>
          </Col>
          <Col md={6}>
            <Form.Select 
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-100"
              style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
            >
              {currencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.symbol} - {option.label}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} className="text-end">
            <Badge bg="light" text="dark" className="py-2">
              <i className="fas fa-money-bill-wave me-1"></i>
              {selectedCurrency}
            </Badge>
          </Col>
        </Row>
      </div>

      {filteredItems.length === 0 ? (
        <div className="p-4 bg-white rounded shadow-sm">
          <Alert variant="info" className="mb-0 text-center">
            <i className="fas fa-info-circle me-2"></i>
            Aucun élément trouvé
          </Alert>
        </div>
      ) : (
        <div className="row g-4">
          {filteredItems.map((item, index) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <Card.Header 
                  className="d-flex justify-content-between align-items-center py-3"
                  style={{ 
                    backgroundColor: item.type === 'logo' ? '#e3f2fd' : 
                                    item.type === 'header' ? '#e8f5e9' : '#e0f7fa',
                    borderBottom: '2px solid #dee2e6'
                  }}
                >
                  <span className="fw-semibold">{item.name}</span>
                  <Badge 
                    bg=""
                    style={{ 
                      backgroundColor: item.type === 'logo' ? '#0d6efd' : 
                                      item.type === 'header' ? '#198754' : '#0dcaf0',
                      fontSize: '0.7rem',
                      padding: '0.35em 0.65em'
                    }}
                  >
                    {item.type === 'logo' ? 'Logo' : item.type === 'header' ? 'En-tête' : 'Pied de page'}
                  </Badge>
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                  <p className="text-muted mb-3">{item.description}</p>
                  
                  <div className="mb-3">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => triggerFileInput(index)}
                      className="w-100 py-2"
                      style={{ borderRadius: '8px' }}
                    >
                      <i className="fas fa-cloud-upload-alt me-2"></i>
                      Parcourir les photos
                    </Button>
                    <input 
                      type="file" 
                      className="d-none" 
                      accept="image/*"
                      ref={el => fileInputRefs.current[index] = el}
                      onChange={(e) => handleImageUpload(item.type, e)}
                    />
                  </div>
                  
                  {item.imageUrl && (
                    <div className="text-center mt-auto">
                      <div 
                        className="border rounded p-2 mb-2 bg-light"
                        style={{ 
                          cursor: 'pointer', 
                          borderRadius: '8px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={() => handleShowPreview(item)}
                      >
                        <img 
                          src={`${backendUrl}${item.imageUrl}`} 
                          alt="Preview" 
                          className="img-fluid"
                          style={{ 
                            maxHeight: '100px',
                            borderRadius: '6px'
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.png';
                          }}
                        />
                        <div className="small text-muted mt-2">
                          <i className="fas fa-search-plus me-1"></i>
                          Cliquer pour agrandir
                        </div>
                      </div>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer 
                  className="text-center py-2"
                  style={{ 
                    backgroundColor: item.imageUrl ? '#e8f5e9' : '#fff3cd',
                    borderTop: '1px solid #dee2e6'
                  }}
                >
                  <small className={item.imageUrl ? 'text-success' : 'text-warning'}>
                    <i className={item.imageUrl ? 'fas fa-check-circle me-1' : 'fas fa-exclamation-circle me-1'}></i>
                    {item.imageUrl ? 'Image téléchargée' : 'Aucune image'}
                  </small>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      )}
      
      <div className="d-flex justify-content-between mt-4 p-4 bg-white rounded shadow-sm">
        <div className="d-flex align-items-center">
          <Badge bg="light" text="dark" className="py-2 px-3">
            <i className="fas fa-list-alt me-2"></i>
            {filteredItems.length} élément(s)
          </Badge>
        </div>
        <Button 
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 fw-medium"
          style={{ borderRadius: '8px' }}
        >
          {isSaving ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Enregistrement...
            </>
          ) : (
            <>
              <i className="fas fa-save me-2"></i>
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>

      {/* Modal de prévisualisation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-primary">Prévisualisation de l'image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          {currentItem?.imageUrl && (
            <img 
              src={`${backendUrl}${currentItem.imageUrl}`} 
              alt="Preview" 
              className="img-fluid rounded shadow"
              style={{ maxHeight: '70vh' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-image.png';
              }}
            />
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowModal(false)}
            style={{ borderRadius: '8px' }}
          >
            <i className="fas fa-times me-2"></i>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Administration;