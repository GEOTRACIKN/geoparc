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

export interface StepsProps {
  nextStep: () => void;
  userCallback: (info: any) => void;
  user: any;
  currentStep: number;
  totalSteps: number;
  previousStep: () => void;
  lastStep: () => void;
}

export const VehicleValidateFormsStep2 = {
  values: {
    Psn: "",
    Year: "",
    Power: "",
    MaximumAllowedTotal: "",
    CirculationDate: '',
    Longueur: '',
    NumChassis: '',
    Largeur: '',
    NbrePorte: '',
    Hauteur: '',
    NbrePlace: '',
    Weight: '',
    co2: '',

  },
  validations: {
    Psn: false,
    Year: false,
    Power: false,
    MaximumAllowedTotal: false,
    CirculationDate: false,
    Longueur: false,
    NumChassis: false,
    Largeur: false,
    NbrePorte: false,
    Hauteur: false,
    NbrePlace: false,
    Weight: false,
    co2: false,

  },
}

export const VehicleValidateFormsStep3 = {
  values: {
    Fournisseur: "",
    Echeance: "",
    NumContrat: "",
    EcheanceRestante: "",
    Duree: "",
    PayeAcejour: "",
    Apport: "",
    DernierPaiment: "",
    DatePremiereEcheance: "",
    ProchaineEcheance: "",
    TotalLeasing: "",
    NumContratL: "",
    TotalLocation: "",
    FournisseurL: "",
    DernierVersement: "",
    CoutLocation: "",
    DateDebutLocation: "",
    NbreMoisLocation: "",
    DateAcquis: "",
    Taxe: "",
    TotalAchat: "",
    

  },
  validations: {
    Fournisseur: false,
    Echeance: false,
    NumContrat: false,
    EcheanceRestante: false,
    Duree: false,
    PayeAcejour: false,
    Apport: false,
    DernierPaiment: false,
    DatePremiereEcheance: false,
    ProchaineEcheance: false,
    TotalLeasing: false,
    NumContratL: false,
    TotalLocation: false,
    FournisseurL: false,
    DernierVersement: false,
    CoutLocation: false,
    DateDebutLocation: false,
    NbreMoisLocation: false,
    DateAcquis: false,
    Taxe: false,
    TotalAchat: false,

  },
}
