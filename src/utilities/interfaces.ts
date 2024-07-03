export interface VehicleFormProps {
  nextStep: () => void;
  userCallback: (info: any) => void;
  actionButtons: React.ReactNode;
}

export interface VehicleFormState {
  values: { [key: string]: string };
  validations: { [key: string]: boolean };
}

export interface VehicleSelectOption{ 
  value: string; 
  label: string; 
}




export const VehicleValidateFormsStep1 = {
  values: {
    Immatriculation: "",
    Acquisition : "",
    Categorie: "",
    Etat: "",
    Type: "",
    TypeCarburant: "",
    Marque: "",
    Modele: "",
    Parc: "",
    Driver: "",
    AffectationVehicl: "",
    Gamme: "",
    Capacite_res: "",
    Consom_moy: "",
    Codification: "",
    Mileage: "",
    Payback_Period: "",
  },
  validations: {
    Immatriculation: false,
    Acquisition : false,
    Categorie: false,
    Etat: false,
    Type: false,
    TypeCarburant: false,
    Marque: false,
    Modele: false,
    Parc: false,
    Driver: false,
    AffectationVehicl: false,
    Gamme: false,
    Capacite_res: false,
    Consom_moy: false,
    Codification: false,
    Mileage: false,
    Payback_Period: false,
  },
}

export const VehicleValidateFormsStep2 = {
  values: {
    Psn: "",
    Year: "",
    Power: "",
    MaximumAllowedTotal: "",
    CreateDate: '',

  },
  validations: {
    Psn: false,
    Year: false,
    Power: false,
    MaximumAllowedTotal: false,
    CreateDate: false,

  },
}
