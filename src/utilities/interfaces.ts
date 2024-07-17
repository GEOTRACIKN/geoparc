/**
 * Defines the props for the VehicleForm component.
 * @interface VehicleFormProps
 * @property {() => void} nextStep - A function to be called when the user wants to move to the next step.
 * @property {(info: any) => void} userCallback - A callback function to be called with user information.
 * @property {React.ReactNode} actionButtons - The action buttons to be displayed in the form.
 */
export interface VehicleFormProps {
  nextStep: () => void;
  userCallback: (info: any) => void;
  actionButtons: React.ReactNode;
}




/**
 * Represents the state of a vehicle form, including the form values and their validation status.
 */
export interface VehicleFormState {
  values: { [key: string]: string };
  validations: { [key: string]: boolean };
}



/**
 * Represents an option for selecting a vehicle.
 * @property {string} value - The unique identifier for the vehicle.
 * @property {string} label - The display label for the vehicle.
 */
export interface VehicleSelectOption {
  value: string;
  label: string;
}



/**
 * Defines the props for a steps component, which manages the state and behavior of a multi-step process.
 *
 * @property {() => void} nextStep - A function to advance to the next step in the process.
 * @property {(info: any) => void} userCallback - A callback function to handle user input or actions.
 * @property {any} user - The current user object.
 * @property {number} currentStep - The index of the current step in the process.
 * @property {number} totalSteps - The total number of steps in the process.
 * @property {() => void} previousStep - A function to go back to the previous step in the process.
 * @property {() => void} lastStep - A function to go to the last step in the process.
 */
export interface StepsProps {
  nextStep: () => void;
  userCallback: (info: any) => void;
  user: any;
  currentStep: number;
  totalSteps: number;
  previousStep: () => void;
  lastStep: () => void;
}



// ? Informations Générales
export const VehicleValidateFormsStep1 = {
  values: {
    Immatriculation: "",  // immatriculation_vehicule
    Acquisition : "", // propriete_vehicule
    Categorie: "", // category_vehicule
    Etat: "", // etat_vehicule
    Type: "", // vehicule_type
    TypeCarburant: "", // type_carburant_vehicule
    Marque: "", // id_marque table --> vahicule_marque 
    Modele: "", // modele_vehicule
    NameParc: "", // ! id_sousParc_vehicule
    Driver: "", //! id_conducteur_vehicule
    AffectationVehicl: "", // ? inService_vehicule -- service 
    Moteur: "", // gamme_vehicule
    Capacite_res: "", // capacite_res_vehicule 
    Consom_moyenne: "", /* Consommation moyenne (l/100km) */
    Codification: "", //! LAST_IB_CODE
    Kilom: "", // kilometrage_vehicule
    Payback_Period: "", // couleur_vehicule -- couleur
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
    Moteur: false,
    Capacite_res: false,
    Consom_moyenne: false,
    Codification: false,
    Kilom: false,
    Payback_Period: false,
  },
}



// ? Informations complémentaires
export const VehicleValidateFormsStep2 = {
  values: {
    Psn: "", // PSN
    Year: "", // annee_vehicule
    Power: "", // puissance_vehicule
    MaximumAllowedTotal: "", //!     -Poids total autorisé en charge-
    CirculationDate: '', // date_circulation_vehicule
    Longueur: '', // longueur_vehicule
    NumChassis: '', // num_chassis_vehicule
    Largeur: '', // largeur_vehicule
    NbrePorte: '', // nbre_place_vehicule
    Hauteur: '', // hauteur_vehicule
    NbrePlace: '', // nbre_porte_vehicule
    Weight: '', // poid_vehicule
    co2: '', // co2_vehicule

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




// ? Acquisition [Leasing - Location - Achat]
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




// ? Assurance
export const VehicleValidateFormsStep4 = {
  values: {
    AgenceAssurance: "", // companie_assurance_vehicule
    CoutAss: "", // cout_assurance_vehicule
    TypeAssurance: "", // type_assurance_vehicule
    DelaiAssurance: "", // delai_assurance_vehicule
    DateDebutAssurance: "", // date_debut_assurance_vehicule
    ReferenceAssurance: "", // reference_assurance_vehicule
    DateExpAssurance: "", // date_expir_assurance_vehicule

  },
  validations: {
    AgenceAssurance: false,
    CoutAss: false,
    TypeAssurance: false,
    DelaiAssurance: false,
    DateDebutAssurance: false,
    ReferenceAssurance: false,
    DateExpAssurance: false,
  },
}




// ? Contrôle technique
export const VehicleValidateFormsStep5 = {
  values: {
    EtabControle: "", // etat_ctr_tech_vehicule
    CoutControle: "", // cout_ctr_tech_vehicule
    ReferenceControle: "", // note_ctr_tech_vehicule
    DateControle: "", // date_debut_ctr_tech_vehicule
    DateFinControle: "", // date_fin_ctr_tech_vehicule

  },
  validations: {
    EtabControle: false,
    CoutControle: false,
    ReferenceControle: false,
    DateControle: false,
    DateFinControle: false,
    

  },
}


// ? Vignette
export const VehicleValidateFormsStep6 = {
  values: {
    NumVignette: "", // num_vignette_vehicule
    DateVignette: "", // date_vignette_vehicule
    CoutVignette: "", // cout_vignette_vehicule
    
  },
  validations: {
    NumVignette: false,
    DateVignette: false,
    CoutVignette: false,
    

  },
}
