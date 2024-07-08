import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Container, Card, Col, FloatingLabel } from 'react-bootstrap';
import { InvalidInputFloating, SelectorFloating } from './InvalidInput';
import { 
  AcquisitionOption, 
  CategorieOption, 
  EtatOption, 
  TypeCarburantOption, 
  TypeOption,
  AffectationVehicleOption,
} from '../../utilities/selectOptions';
import { 
  VehicleFormProps, 
  VehicleFormState, 
  VehicleSelectOption, 
  VehicleValidateFormsStep1,
} from '../../utilities/interfaces';
import { Bounce, toast } from 'react-toastify';
import { useTranslate } from '../LanguageProvider';



const backendUrl = 'http://localhost:5000/api/geop';
const Step1: React.FC<VehicleFormProps> = ({
  nextStep,
  userCallback,
}) => {

  const [error, setError] = useState<string>("");
  // const id_user = localStorage.getItem("GeopUserID");
  const id_user = 8
  const { translate } = useTranslate();
  const [formState, setFormState] = useState<VehicleFormState>(VehicleValidateFormsStep1);
  const [selectBrand, setSelectBrand] = useState<VehicleSelectOption[]>([]);
  const [selectParc, setSelectParc] = useState<VehicleSelectOption[]>([]);
  const [selectDriver, setSelectDriver] = useState<VehicleSelectOption[]>([])

  
  useEffect(() => {
    const fetchBrandData = async (): Promise<VehicleSelectOption[]> => {
      const response = await fetch(`${backendUrl}/vehicles/brand`);
      return await response.json()
    }

    const fetchParcData = async (): Promise<VehicleSelectOption[]> => {
      const response = await fetch(`${backendUrl}/vehicles/parc`);
      return await response.json()
    }
    const fetchDriverData = async (): Promise<VehicleSelectOption[]> => {
      const response = await fetch(`${backendUrl}/Conducteur_contrat/${id_user}`);
      return await response.json()
    }
    
    
    const fetchData = async () => {
      try {
        const brandData = await fetchBrandData();
        const parcData = await fetchParcData();
        const driverData = await fetchDriverData();
        
        setSelectBrand(brandData.map((brand: VehicleSelectOption) => ({
          value: brand.value,
          label: brand.label
        })))
        setSelectParc(parcData.map((parc: VehicleSelectOption) => ({
          value: parc.value,
          label: parc.label
        })))
        
        setSelectDriver(driverData.map((drivers:any) => ({
          value: drivers.id_conducteur,
          label: `${drivers.nom_conducteur} - ${drivers.prenom_conducteur}`
        })))
        // setSelectBrand(combineData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }
    fetchData();
  }, [])  



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      values: {
        ...prevState.values,
        [name]: value,
      },
      validations: {
        ...prevState.validations,
        [name]: value.trim() !== "",
      },
    }));
  };

  const validate = () => {
    if (!formState.validations.Immatriculation) {
      setError("Valide l'Immatriculation");
    // } else if (!formState.validations.Acquisition ) {
    //   setError("Valide l'Acquisition ");
    // } else if (!formState.validations.Categorie) {
    //   setError("Valide la Catégorie");
    // } else if (!formState.validations.Etat ) {
    //   setError("Valide l'Etat ");
    } else {
      setError("");
      nextStep();
      userCallback(formState.values);
    }
  };

  const validInput = (e: any) => {
    console.log(e);
  };

  return (
    <div className='w-100'>
      <span style={{ color: "red" }}>{error}</span>
      <h2 className="text-3xl font-bold underline">Informations Générales</h2>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Row className='w-full'>
          <InvalidInputFloating
            className='col-md-6'
            label="Immatriculation :"
            name="Immatriculation"
            placeholder=" "
            value={formState.values.Immatriculation}
            onChange={handleChange}
            isValid={formState.validations.Immatriculation}
            errorMessage="Ce champ est obligatoire."
            showValid={true}
          />
          <SelectorFloating
            className='col-md-6'
            label="Acquisition"
            name="Acquisition"
            value={formState.values.Acquisition}
            onChange={handleChange}
            isValid={formState.validations.Acquisition}
            errorMessage="Ce champ est obligatoire."
            options={AcquisitionOption}
            showValid={true}
          />
        </Row>
        <Row className='w-full'>
          <SelectorFloating
            className='col-md-6'
            label="Catégorie"
            name="Categorie"
            value={formState.values.Categorie}
            onChange={handleChange}
            isValid={formState.validations.Categorie}
            errorMessage="Ce champ est obligatoire."
            options={CategorieOption}
            showValid={true}
          />
          <SelectorFloating
            className='col-md-6'
            label="Etat"
            name="Etat"
            value={formState.values.Etat}
            onChange={handleChange}
            isValid={formState.validations.Etat}
            errorMessage="Ce champ est obligatoire."
            options={EtatOption}
            showValid={true}
          />
        </Row>
        <Row className='w-full'>
          <SelectorFloating
            className='col-md-6'
            label="Type"
            name="Type"
            value={formState.values.Type}
            onChange={handleChange}
            isValid={formState.validations.Type}
            errorMessage="Ce champ est obligatoire."
            options={TypeOption}
            showValid={true}
          />
          <SelectorFloating
            className='col-md-6'
            label="Type carburant"
            name="TypeCarburant"
            value={formState.values.TypeCarburant}
            onChange={handleChange}
            isValid={formState.validations.TypeCarburant}
            errorMessage="Ce champ est obligatoire."
            options={TypeCarburantOption}
            showValid={true}
          />
        </Row>
        <Row className='w-full'>
          <SelectorFloating
            className='col-md-6'
            label="Marque"
            name="Marque"
            value={formState.values.Marque}
            onChange={handleChange}
            isValid={formState.validations.Marque}
            errorMessage="Ce champ est obligatoire."
            options={selectBrand}
            showValid={true}
          />
          <InvalidInputFloating
            className='col-md-6'
            label="Modèle :"
            name="Modele"
            placeholder=" "
            value={formState.values.Modele}
            onChange={handleChange}
            isValid={formState.validations.Modele}
            errorMessage="Ce champ est obligatoire."
            showValid={true}
          />
        </Row>
        <Row className='w-full'>
          <Form.Group controlId='formBasicSelect-Parc' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Parc'>
            <Form.Select
              as="select"
              name='Parc'
              value={formState.values.Parc}
              onChange={(e) => handleChange(e)}
              className={formState.validations.Parc ? 'is-valid' : ''}
              >
              <option value="">Sélectionnez une option</option>
              {selectParc.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            </FloatingLabel>
          </Form.Group>
          <Form.Group controlId='formBasicSelect-driver' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Conducteur'>
            <Form.Select
              as="select"
              name='Driver'
              value={formState.values.Driver}
              onChange={(e) => handleChange(e)}
              className={formState.validations.Driver ? 'is-valid' : ''}
              >
              <option value="">Sélectionnez une option</option>
              {selectDriver.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            </FloatingLabel>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group controlId='formBasicSelect-AffectationVehicl' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Affectation Vehicule'>
            <Form.Select
              as="select"
              name='AffectationVehicl'
              value={formState.values.AffectationVehicl}
              onChange={(e) => handleChange(e)}
              className={formState.validations.AffectationVehicl ? 'is-valid' : ''}
              >
              <option value="">Sélectionnez une option</option>
              {AffectationVehicleOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            </FloatingLabel>
          </Form.Group>
          <Form.Group controlId='formBasicInput-Gamme' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Gamme'>
            <Form.Control
            placeholder=' '
            type="text"
            name='Gamme'
            value={formState.values.Gamme}
            onChange={(e:any) => handleChange(e)}
            className={formState.validations.Gamme ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group controlId='formBasicInput-Gamme' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Capacité réservoir (L)'>
            <Form.Control
            placeholder=' '
            type="text"
            name='Capacite_res'
            value={formState.values.Capacite_res}
            onChange={(e:any) => handleChange(e)}
            className={formState.validations.Capacite_res ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
          <Form.Group controlId='formBasicInput-consom_moy' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Consommation moyenne (l/100km)s'>
            <Form.Control
            placeholder=' '
            type="text"
            name='Consom_moy'
            value={formState.values.Consom_moy}
            onChange={(e:any) => handleChange(e)}
            className={formState.validations.Consom_moy ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
        </Row>
        <Row>
          <InvalidInputFloating
            className='col-md-6'
            label="Codification véhicule :"
            name="Codification"
            placeholder=" "
            value={formState.values.Codification}
            onChange={handleChange}
            isValid={formState.validations.Codification}
            errorMessage="Ce champ est obligatoire."
            showValid={true}
          />
          <Form.Group controlId='formBasicInput-Mileage' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Kilométrage (Km)'>
            <Form.Control
            placeholder=' '
            type="text"
            name='Mileage'
            value={formState.values.Mileage}
            onChange={(e:any) => handleChange(e)}
            className={formState.validations.Mileage ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
        </Row>
        <Row>
          <InvalidInputFloating
            className='col-md-6'
            label="Durée d'amortissement (jours) :"
            name="Payback_Period"
            placeholder=" "
            value={formState.values.Payback_Period}
            onChange={handleChange}
            isValid={formState.validations.Payback_Period}
            errorMessage="Ce champ est obligatoire."
            showValid={true}
          />
          
        </Row>
  
        <div className='d-flex align-items-end flex-column'>
          <Button variant="primary" onClick={validate}>
            Suivent
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Step1;
