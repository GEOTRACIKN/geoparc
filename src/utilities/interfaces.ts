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

export interface ContentTabProps {
  formState: VehicleFormState
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
  user?: any;
  currentStep: number;
  totalSteps: number;
  previousStep: () => void;
  lastStep: () => void;
}

/* 
`vehicule`(`id_vehicule`, `vehicule_type`, `category_vehicule`, `id_dispositif`, `propriete_vehicule`, `id_marque`, `modele_vehicule`, `date_aquisition_vehicule`, `type_carburant_vehicule`, `immatriculation_vehicule`, `annee_vehicule`, `couleur_vehicule`, `date_circulation_vehicule`, `num_chassis_vehicule`, `nbre_place_vehicule`, `puissance_vehicule`, `etat_vehicule`, `kilometrage_vehicule`, `commentaire_vehicule`, `companie_assurance_vehicule`, `type_assurance_vehicule`, `date_debut_assurance_vehicule`, `date_expir_assurance_vehicule`, `cout_assurance_vehicule`, `delai_assurance_vehicule`, `reference_assurance_vehicule`, `note_assurance_vehicule`, `etat_ctr_tech_vehicule`, `date_debut_ctr_tech_vehicule`, `date_fin_ctr_tech_vehicule`, `station_ctr_vehicule`, `cout_ctr_tech_vehicule`, `note_ctr_tech_vehicule`, `date_vignette_vehicule`, `cout_vignette_vehicule`, `id_gps`, `id_conducteur_vehicule`, `longueur_vehicule`, `largeur_vehicule`, `hauteur_vehicule`, `poid_vehicule`, `nbre_porte_vehicule`, `icon_vehicule`, `detail_vehicule`, `num_porte_vehicule`, `ptac_vehicule`, `kilometrage_reel_vehicule`, `image_vehicule`, `consomatio_gasoil_reel_vehicule`, `latitude_vehicule`, `longitude_vehicule`, `date_heure_position_vehicule`, `id_sousParc_vehicule`, `num_vignette_vehicule`, `famille_vehicule`, `gamme_vehicule`, `id_groupe`, `fuel_level_vehicule`, `co2_vehicule`, `capacite_res_vehicule`, `prochain_vidange_vehicule`, `info_vehicule`, `id_user`, `draft`, `inService_vehicule`, `date_creation_vehicule`, `date_modification_vehicule`, `date_suppression_vehicule`, `PSN`, `LAST_IB_CODE`, `fuel_type`) 

*/



/* 
CREATE TABLE gp_vehicle_cost (
    cost_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identifiant unique pour l'enregistrement des coûts du véhicule',
    IDvehicule INT NOT NULL COMMENT 'Identifiant du véhicule',
    * fournisseur_vh VARCHAR(50) NOT NULL COMMENT 'Fournisseur du véhicule',
    * date_versement DATE NOT NULL COMMENT 'Date du versement',
    * num_contrat_aquis VARCHAR(50) NOT NULL COMMENT 'Numéro de contrat pour l'acquisition',
    * duree_leasing INT NOT NULL COMMENT 'Durée du leasing (pour Leasing)',
    * echeance_leasing DECIMAL(10, 2) NOT NULL COMMENT 'Montant de l'échéance du leasing (pour Leasing)',
    * echeance_restante_leasing INT NOT NULL COMMENT 'Nombre d'échéances restantes du leasing (pour Leasing)',
    * payer_a_ce_jour_leasing DECIMAL(10, 2) NOT NULL COMMENT 'Montant payé à ce jour pour le leasing (pour Leasing)',
    * prochaine_echeance_leasing DATE NOT NULL COMMENT 'Date de la prochaine échéance du leasing (pour Leasing)',
    * cout_tot_vh DECIMAL(10, 2) NOT NULL COMMENT 'Coût total du véhicule (pour Leasing)',
    * premier_appor_leas DECIMAL(10, 2) NOT NULL COMMENT 'Premier apport pour le leasing (pour Leasing)',
    * date_prem_echeance_leas DATE NOT NULL COMMENT 'Date de la première échéance du leasing (pour Leasing)',
    IDSousParc INT NOT NULL COMMENT 'Identifiant du sous-parc (pour Leasing)',
    temps_amort VARCHAR(50) NOT NULL COMMENT 'Période d'amortissement (pour Leasing)',
    * num_contrat_location VARCHAR(50) NOT NULL COMMENT 'Numéro de contrat pour la location (pour Location)',
    * fournisseur_location VARCHAR(50) NOT NULL COMMENT 'Fournisseur pour la location (pour Location)',
    * cout_location DECIMAL(10, 2) NOT NULL COMMENT 'Coût de la location (pour Location)',
    * date_debut_locati DATE NOT NULL COMMENT 'Date de début de la location (pour Location)',
    * locati_mensuel INT NOT NULL COMMENT 'Durée de la location en mois (pour Location)',
    date_dernier_versement DATE NOT NULL COMMENT 'Date du dernier versement (pour Location)',
    * cout_tot_location DECIMAL(10, 2) NOT NULL COMMENT 'Coût total de la location (pour Location)',
    * date_achat DATE NOT NULL COMMENT 'Date d'achat (pour Achat)',
    * taxe_veh_neuf DECIMAL(10, 2) NOT NULL COMMENT 'Taxe associée à l'achat (pour Achat)',
    * cout_tot_achat DECIMAL(10, 2) NOT NULL COMMENT 'Coût total de l'achat (pour Achat)',
    IDSousParc_achat INT NOT NULL COMMENT 'Identifiant du sous-parc (pour Achat)',
    temps_amort_achat VARCHAR(50) NOT NULL COMMENT 'Période d'amortissement pour l'achat (pour Achat)'
) COMMENT='Table contenant les coûts associés aux véhicules en fonction du type d'acquisition';

*/

/* 
CREATE TABLE gp_vehicle_cost (
    cost_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identifiant unique pour l'enregistrement des coûts du véhicule',
    IDvehicule INT NOT NULL COMMENT 'Identifiant du véhicule',
    fournisseur_vh VARCHAR(50) NOT NULL COMMENT 'Fournisseur du véhicule',
    date_versement DATE NOT NULL COMMENT 'Date du versement',
    num_contrat_aquis VARCHAR(50) NOT NULL COMMENT 'Numéro de contrat pour l'acquisition',
    duree_leasing INT NOT NULL COMMENT 'Durée du leasing (pour Leasing)',
    echeance_leasing DECIMAL(10, 2) NOT NULL COMMENT 'Montant de l'échéance du leasing (pour Leasing)',
    echeance_restante_leasing INT NOT NULL COMMENT 'Nombre d'échéances restantes du leasing (pour Leasing)',
    payer_a_ce_jour_leasing DECIMAL(10, 2) NOT NULL COMMENT 'Montant payé à ce jour pour le leasing (pour Leasing)',
    prochaine_echeance_leasing DATE NOT NULL COMMENT 'Date de la prochaine échéance du leasing (pour Leasing)',
    cout_tot_vh DECIMAL(10, 2) NOT NULL COMMENT 'Coût total du véhicule (pour Leasing)',
    premier_appor_leas DECIMAL(10, 2) NOT NULL COMMENT 'Premier apport pour le leasing (pour Leasing)',
    date_prem_echeance_leas DATE NOT NULL COMMENT 'Date de la première échéance du leasing (pour Leasing)',
    IDSousParc INT NOT NULL COMMENT 'Identifiant du sous-parc (pour Leasing)',
    temps_amort VARCHAR(50) NOT NULL COMMENT 'Période d'amortissement (pour Leasing)',
    num_contrat_location VARCHAR(50) NOT NULL COMMENT 'Numéro de contrat pour la location (pour Location)',
    fournisseur_location VARCHAR(50) NOT NULL COMMENT 'Fournisseur pour la location (pour Location)',
    cout_location DECIMAL(10, 2) NOT NULL COMMENT 'Coût de la location (pour Location)',
    date_debut_locati DATE NOT NULL COMMENT 'Date de début de la location (pour Location)',
    locati_mensuel INT NOT NULL COMMENT 'Durée de la location en mois (pour Location)',
    date_dernier_versement DATE NOT NULL COMMENT 'Date du dernier versement (pour Location)',
    cout_tot_location DECIMAL(10, 2) NOT NULL COMMENT 'Coût total de la location (pour Location)',
    date_achat DATE NOT NULL COMMENT 'Date d'achat (pour Achat)',
    taxe_veh_neuf DECIMAL(10, 2) NOT NULL COMMENT 'Taxe associée à l'achat (pour Achat)',
    cout_tot_achat DECIMAL(10, 2) NOT NULL COMMENT 'Coût total de l'achat (pour Achat)',
    IDSousParc_achat INT NOT NULL COMMENT 'Identifiant du sous-parc (pour Achat)',
    temps_amort_achat VARCHAR(50) NOT NULL COMMENT 'Période d'amortissement pour l'achat (pour Achat)'
) COMMENT='Table contenant les coûts associés aux véhicules en fonction du type d'acquisition';

*/

// ? Informations Générales
export const VehicleValidateFormsStep1 = {
  values: {
    Immatriculation: "",  // immatriculation_vehicule
    Acquisition : "", //! propriete_vehicule  {table vehicule_cout : Acquisition}
    Categorie: "", // category_vehicule
    Etat: "", // etat_vehicule
    Type: "", // vehicule_type
    TypeCarburant: "", // type_carburant_vehicule
    Marque: "", // id_marque table --> vahicule_marque 
    Modele: "", // modele_vehicule
    NameParc: "", //  id_parc
    Driver: "", // id_conducteur_vehicule
    AffectationVehicl: "", //  inService_vehicule -- service 
    Moteur: "", // gamme_vehicule
    Capacite_res: "", // capacite_res_vehicule 
    Consom_moyenne: "", // consommation_moyenne_vehicule
    Codification: "", // LAST_IB_CODE
    Kilom: "", // kilometrage_vehicule
    Payback_Period: "", // couleur_vehicule -- couleur
    Step3: "", 
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
    Step3: false,
  },
}



// ? Informations complémentaires
export const VehicleValidateFormsStep2 = {
  values: {
    Psn: "", // PSN
    Year: "", // annee_vehicule
    Power: "", // puissance_vehicule
    MaximumAllowedTotal: "", // capacite_totale_vehicule
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
export const VehicleValidateFormsStep4 = {
  values: {
    // Leasing
    Fournisseur: "", //  fournisseur_vh  : Leasing
    Echeance: "", // echeance_leasing : Leasing
    NumContrat: "", // num_contrat_aquis !! location - leasing
    EcheanceRestante: "", // echeance_restante_leasing :: leqsing
    Duree: "", // duree_leasing :: leasing
    PayeAcejour: "", // payer_a_ce_jour_leasing :: leasing
    Apport: "", // premier_appor_leas :: leasing
    DernierPaiment: "",  // date_versement :: leasing
    DatePremiereEcheance: "",// date_prem_echeance_leas :: leasing
    ProchaineEcheance: "", // prochaine_echeance_leasing :: leasing
    TotalLeasing: "", // cout_tot_vh :: leasing

    // Location RentCar
    NumContratL: "", // num_contrat_location :: location
    TotalLocation: "", // cout_tot_location :: location
    FournisseurL: "", // fournisseur_location :: location
    DernierVersement: "", // date_versement :: location
    CoutLocation: "", // cout_location :: location
    DateDebutLocation: "", // date_debut_locati :: location
    NbreMoisLocation: "", // locati_mensuel :: location
    
    // Purchase achat
    DateAcquis: "", // date_achat :: achat
    Taxe: "", // taxe_veh_neuf :: achat
    TotalAchat: "", // cout_tot_achat :: achat
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
export const VehicleValidateFormsStep3 = {
  values: {
    AgenceAssurance: "", // companie_assurance_vehicule
    CoutAss: "", // cout_assurance_vehicule
    TypeAssurance: "", // type_assurance_vehicule
    DelaiAssurance: "", // delai_assurance_vehicule
    DateDebutAssurance: "", // date_debut_assurance_vehicule
    ReferenceAssurance: "", // reference_assurance_vehicule
    DateExpAssurance: "", // date_expir_assurance_vehicule


    // ? Contrôle technique
    EtabControle: "", // etat_ctr_tech_vehicule
    CoutControle: "", // cout_ctr_tech_vehicule
    ReferenceControle: "", // note_ctr_tech_vehicule
    DateControle: "", // date_debut_ctr_tech_vehicule
    DateFinControle: "", // date_fin_ctr_tech_vehicule
    
    // ? Vignette
    NumVignette: "", // num_vignette_vehicule
    DateVignette: "", // date_vignette_vehicule
    CoutVignette: "", // cout_vignette_vehicule
  },
  validations: {
    AgenceAssurance: false,
    CoutAss: false,
    TypeAssurance: false,
    DelaiAssurance: false,
    DateDebutAssurance: false,
    ReferenceAssurance: false,
    DateExpAssurance: false,

    // ? Contrôle technique
    EtabControle: false,
    CoutControle: false,
    ReferenceControle: false,
    DateControle: false,
    DateFinControle: false,
    
    // ? Vignette
    NumVignette: false,
    DateVignette: false,
    CoutVignette: false,
  },
}




export const VehicleValidateFormsStep5 = {
  values: {

  },
  validations: {
    

  },
}


export const VehicleValidateFormsStep6 = {
  values: {
    
  },
  validations: {
    

  },
}
