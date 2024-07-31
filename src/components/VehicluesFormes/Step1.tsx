import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Container,
  Card,
  Col,
  FloatingLabel,
} from "react-bootstrap";

/**
 * Imports the `InvalidInputFloating` and `SelectorFloating` components from the `./InvalidInput` module.
 */
import { InvalidInputFloating, SelectorFloating } from "./InvalidInput";

/**
 * Imports various option types used for selecting vehicle-related data.
 * These options are likely used throughout the application to provide
 * consistent and structured data selection experiences.
 */
import {
  AcquisitionOption,
  CategorieOption,
  EtatOption,
  TypeCarburantOption,
  TypeOption,
  AffectationVehicleOption,
} from "../../utilities/selectOptions";

/**
 * Imports various TypeScript interface types used in the VehicluesFormes/Step1.tsx component.
 * These interfaces define the shape of the component's props, state, and validation logic.
 */
import {
  VehicleFormProps,
  VehicleFormState,
  VehicleSelectOption,
  VehicleValidateFormsStep1,
} from "../../utilities/interfaces";

import { Bounce, toast } from "react-toastify";
import { useTranslate } from "../LanguageProvider";

const backendUrl = "http://localhost:5000/api/geop";

/**
 * Renders the first step of the vehicle form, which includes general information about the vehicle.
 *
 * This component is responsible for rendering the form fields for the vehicle's immatriculation, acquisition, category, state, type, fuel type, brand, model, parc, driver, affectation, gamme, capacity, average consumption, vehicle codification, mileage, and payback period.
 *
 * The component fetches the necessary data for the select options (brand, parc, and driver) from the backend and updates the form state accordingly. It also handles form validation and triggers the next step of the form when the user submits the form.
 *
 * @param nextStep - A callback function to trigger the next step of the form.
 * @param userCallback - A callback function to pass the form state to the parent component.
 * @returns The rendered Step1 component.
 */
/**
 * Renders the first step of the vehicle form, which includes fields for general vehicle information such as registration, acquisition, category, state, type, fuel type, brand, model, parc, driver, and other details.
 *
 * @param {VehicleFormProps} props - The props passed to the component, including `nextStep` and `userCallback` functions.
 * @returns {React.ReactElement} The rendered Step1 component.
 */
const Step1: React.FC<VehicleFormProps> = ({ nextStep, userCallback }) => {
  const [error, setError] = useState<string>("");
  // const id_user = localStorage.getItem("GeopUserID");
  const id_user = 8;
  const { translate } = useTranslate();
  const [formState, setFormState] = useState<VehicleFormState>(
    VehicleValidateFormsStep1
  );
  const [selectedOption, setSelectedOption] = useState('');
  const handleChangeChuck = (
    e: React.ChangeEvent<HTMLInputElement>  ) => {
    const { checked, value } = e.target;
    setSelectedOption(value);
    setFormState((prevState) => ({
      values: {
        ...prevState.values,
        Step3: value,
      },
      validations: {
        ...prevState.validations,
        Step3: checked,
      },
    }));
  };
  const [selectBrand, setSelectBrand] = useState<VehicleSelectOption[]>([]);
  const [selectParc, setSelectParc] = useState<VehicleSelectOption[]>([]);
  const [selectDriver, setSelectDriver] = useState<VehicleSelectOption[]>([]);

  useEffect(() => {
    const fetchBrandData = async (): Promise<VehicleSelectOption[]> => {
      const response = await fetch(`${backendUrl}/vehicles/brand`);
      return await response.json();
    };

    const fetchParcData = async (): Promise<VehicleSelectOption[]> => {
      const response = await fetch(`${backendUrl}/vehicles/parc`); // change l'api en name-parc
      return await response.json();
    };
    const fetchDriverData = async (): Promise<VehicleSelectOption[]> => {
      const response = await fetch(
        `${backendUrl}/Conducteur_contrat/${id_user}`
      );
      return await response.json();
    };

    /**
     * Fetches and sets the data for the brand, parc, and driver select options.
     *
     * This function is responsible for fetching the necessary data from the backend
     * and mapping it to the appropriate select options for the brand, parc, and
     * driver fields in the form.
     */
    const fetchData = async () => {
      try {
        const brandData = await fetchBrandData();
        const parcData = await fetchParcData();
        const driverData = await fetchDriverData();

        setSelectBrand(
          brandData.map((brand: VehicleSelectOption) => ({
            value: brand.value,
            label: brand.label,
          }))
        );
        setSelectParc(
          parcData.map((parc: VehicleSelectOption) => ({
            value: parc.value,
            label: parc.label,
          }))
        );

        setSelectDriver(
          driverData.map((drivers: any) => ({
            value: drivers.id_conducteur,
            label: `${drivers.nom_conducteur} - ${drivers.prenom_conducteur}`,
          }))
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, []);

  /**
   * Handles changes to form input fields and updates the form state accordingly.
   *
   * @param e - The change event object containing the input field name and value.
   */
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

  /**
   * Validates the form state and performs the next step if all validations pass.
   * If any validation fails, sets an error message.
   */
  const validate = () => {
    /**
     * Validates the form state and sets an error message if any of the required fields are not valid.
     * This code block is part of the `Step1` component in the `VehicluesFormes` module.
     *
     * @returns {void} This function does not return a value, it only sets the error state.
     */
    if (!formState.validations.Immatriculation) {
      setError("Valide l'Immatriculation");
      // } else if (!formState.validations.Acquisition) {
      //   setError("Valide l'Acquisition ");
      // } else if (!formState.validations.Categorie) {
      //   setError("Valide la Catégorie");
      // } else if (!formState.validations.Etat) {
      //   setError("Valide l'Etat ");
      } else if (!formState.validations.Step3) {
        setError("Valide l'Etat ");
    } else {
      /**
       * Clears any existing error, moves to the next step in the form flow, and calls the provided user callback with the current form state values.
       */
      setError("");
      nextStep();
      userCallback(formState.values);
    }
  };

  return (
    <div className="w-100">
      <span style={{ color: "red" }}>{error}</span> {/* Return Erreur */}
      <h2 className="text-3xl font-bold underline">Informations Générales</h2>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Row className="">
          {/* Immatriculation */}
          <InvalidInputFloating
            className="col-md-6 col-xl-3"
            label="Immatriculation :"
            name="Immatriculation"
            placeholder=" "
            value={formState.values.Immatriculation}
            onChange={handleChange}
            isValid={formState.validations.Immatriculation}
            errorMessage="Ce champ est obligatoire."
            showValid={true}
            type="text"
          />
          {/* Acquisition  -acqui- */}
          <SelectorFloating
            className="col-md-6 col-xl-3"
            label="Acquisition"
            name="Acquisition"
            value={formState.values.Acquisition}
            onChange={handleChange}
            isValid={formState.validations.Acquisition}
            errorMessage="Ce champ est obligatoire."
            options={AcquisitionOption}
            showValid={true}
          />

          {/* Catégorie */}
          <SelectorFloating
            className="col-md-6 col-xl-3"
            label="Catégorie"
            name="Categorie"
            value={formState.values.Categorie}
            onChange={handleChange}
            isValid={formState.validations.Categorie}
            errorMessage="Ce champ est obligatoire."
            options={CategorieOption}
            showValid={true}
          />
          {/* Etat */}
          <SelectorFloating
            className="col-md-6 col-xl-3"
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

        <Row className="">
          {/* Type */}
          <SelectorFloating
            className="col-md-6 col-xl-3"
            label="Type"
            name="Type"
            value={formState.values.Type}
            onChange={handleChange}
            isValid={formState.validations.Type}
            errorMessage="Ce champ est obligatoire."
            options={TypeOption}
            showValid={true}
          />

          {/* Type carburant  -typeCarb-*/}
          <SelectorFloating
            className="col-md-6 col-xl-3"
            label="Type carburant"
            name="TypeCarburant"
            value={formState.values.TypeCarburant}
            onChange={handleChange}
            isValid={formState.validations.TypeCarburant}
            errorMessage="Ce champ est obligatoire."
            options={TypeCarburantOption}
            showValid={true}
          />

          {/* Marque */}
          <SelectorFloating
            className="col-md-6 col-xl-3"
            label="Marque"
            name="Marque"
            value={formState.values.Marque}
            onChange={handleChange}
            isValid={formState.validations.Marque}
            errorMessage="Ce champ est obligatoire."
            options={selectBrand}
            showValid={true}
          />

          {/* Modèle  --*/}
          <InvalidInputFloating
            className="col-md-6 col-xl-3"
            label="Modèle :"
            name="Modele"
            placeholder=" "
            value={formState.values.Modele}
            onChange={handleChange}
            isValid={formState.validations.Modele}
            errorMessage="Ce champ est obligatoire."
            showValid={true}
            type="text"
          />
        </Row>

        <Row className="w-full">
          {/* NameParc -nameParc- */}
          <Form.Group
            controlId="formBasicSelect-NameParc"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Parc">
              <Form.Select
                as="select"
                name="NameParc"
                value={formState.values.NameParc}
                onChange={(e) => handleChange(e)}
                className={formState.validations.NameParc ? "is-valid" : ""}
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

          {/* Driver -conducteur- */}
          <Form.Group
            controlId="formBasicSelect-driver"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Conducteur">
              <Form.Select
                as="select"
                name="Driver"
                value={formState.values.Driver}
                onChange={(e) => handleChange(e)}
                className={formState.validations.Driver ? "is-valid" : ""}
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

          {/* AffectationVehicl -service- */}
          <Form.Group
            controlId="formBasicSelect-AffectationVehicl"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              controlId="floatingSelect"
              label="Affectation Vehicule"
            >
              <Form.Select
                as="select"
                name="AffectationVehicl"
                value={formState.values.AffectationVehicl}
                onChange={(e) => handleChange(e)}
                className={
                  formState.validations.AffectationVehicl ? "is-valid" : ""
                }
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

          {/*  Moteur */}
          <Form.Group
            controlId="formBasicInput-Gamme"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Gamme">
              <Form.Control
                placeholder=" "
                type="text"
                name="Moteur"
                value={formState.values.Moteur}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Moteur ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>

        <Row>
          {/* Capacite_res */}
          <Form.Group
            controlId="formBasicInput-Capacite_res"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              controlId="floatingSelect"
              label="Capacité réservoir (L)"
            >
              <Form.Control
                placeholder=" "
                type="text"
                name="Capacite_res"
                value={formState.values.Capacite_res}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Capacite_res ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* Consom_moyenne */}
          <Form.Group
            controlId="formBasicInput-Consom_moyenne"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              controlId="floatingSelect"
              label="Consommation moyenne (l/100km)s"
            >
              <Form.Control
                placeholder=" "
                type="text"
                name="Consom_moyenne"
                value={formState.values.Consom_moyenne}
                onChange={(e: any) => handleChange(e)}
                className={
                  formState.validations.Consom_moyenne ? "is-valid" : ""
                }
              />
            </FloatingLabel>
          </Form.Group>

          {/* Codification */}
          <InvalidInputFloating
            className="col-md-6 col-xl-3"
            label="Codification véhicule :"
            name="Codification"
            placeholder=" "
            value={formState.values.Codification}
            onChange={handleChange}
            isValid={formState.validations.Codification}
            errorMessage="Ce champ est obligatoire."
            showValid={true}
            type="text"
          />

          {/* Kilom */}
          <Form.Group
            controlId="formBasicInput-Kilom"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Kilométrage (Km)">
              <Form.Control
                placeholder=" "
                type="text"
                name="Kilom"
                value={formState.values.Kilom}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Kilom ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>

        <Row>
          {/*  Payback_Period -couleur- */}
          <InvalidInputFloating
            className="col-md-6 col-xl-3"
            label="Durée d'amortissement (jours) :"
            name="Payback_Period"
            placeholder=" "
            value={formState.values.Payback_Period}
            onChange={handleChange}
            isValid={formState.validations.Payback_Period}
            errorMessage="Ce champ est obligatoire."
            showValid={true}
            type="text"
          />
          {/* Leasing Location Achat */}
          <Form.Group  className="col d-flex mt-4">
                <Form.Check
                    className="me-4"
                    name="Leasing"
                    type="radio"
                    label="Leasing"
                    value="Leasing"
                    checked={selectedOption === 'Leasing'}
                    onChange={handleChangeChuck}
                />
                <Form.Check
                    className="me-4"
                    name="Location"
                    type="radio"
                    label="Location"
                    value="Location"
                    checked={selectedOption === 'Location'}
                    onChange={handleChangeChuck}
                />
                <Form.Check
                    className="me-4"
                    name="Achat"
                    type="radio"
                    label="Achat"
                    value="Achat"
                    checked={selectedOption === 'Achat'}
                    onChange={handleChangeChuck}
                />
            </Form.Group>
        </Row>

        <div className="d-flex align-items-end flex-column">
          {/*  Renders a primary button that, when clicked, calls the
          `validate` function.  */}
          <Button className="mr-5" variant="primary" onClick={validate}>
            Suivent
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Step1;
