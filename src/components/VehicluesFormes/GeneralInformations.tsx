import React from "react";
import { ContentTabProps} from '../../utilities/interfaces';
import { Form, Row } from "react-bootstrap";
import InputFloating from "./InputFloating";

const GeneralInformations = ({
  formState,
  handleChange
}: ContentTabProps) => {
  console.debug(formState)

  return (
    <>
      <Form>
        <Row>
        <InputFloating
            label='Immatriculation'
            name='Immatriculation'
            value={formState.values.Immatriculation}
            onChangeFunction={handleChange}
          />
        <InputFloating
            label='Acquisition'
            name='Acquisition'
            value={formState.values.Acquisition}
            onChangeFunction={handleChange}
          />
        <InputFloating
            label='Catégorie'
            name='Categorie'
            value={formState.values.Categorie}
            onChangeFunction={handleChange}
          />
        <InputFloating
            label='Etat'
            name='Etat'
            value={formState.values.Etat}
            onChangeFunction={handleChange}
          />
        </Row>
        <Row>
        <InputFloating
            label='Type'
            name='Type'
            value={formState.values.Type}
            onChangeFunction={handleChange}
          />
        <InputFloating
            label='Type carburant'
            name='TypeCarburant'
            value={formState.values.TypeCarburant}
            onChangeFunction={handleChange}
          />
        <InputFloating
            label='Marque'
            name='Marque'
            value={formState.values.Marque}
            onChangeFunction={handleChange}
          />
        <InputFloating
            label='Modèle'
            name='Modele'
            value={formState.values.Modele}
            onChangeFunction={handleChange}
          />
        </Row>
        <Row>
        <InputFloating
            label='Parc'
            name='NameParc'
            value={formState.values.NameParc}
            onChangeFunction={handleChange}
          />
        <InputFloating
            label='Conducteur'
            name='Driver'
            value={formState.values.Driver}
            onChangeFunction={handleChange}
          />
        <InputFloating
            label='Affectation Vehicule'
            name='AffectationVehicl'
            value={formState.values.AffectationVehicl}
            onChangeFunction={handleChange}
          />

        </Row>
        <Row></Row>
      </Form>
    </>
  );
};

export default GeneralInformations;
