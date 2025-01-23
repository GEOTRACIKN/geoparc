import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, Form, Button } from "react-bootstrap";
import { useTranslate } from "../hooks/LanguageProvider";
import { toast, Bounce } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import FieldInput from "../components/Vehicle/FieldInput";
import SelectGroup from "../components/Vehicle/SelectGroup";

export interface VehicleInterface {
  id_vehicule: number;
  id_user?: number | null;
  vehicule_type?: string | null;
  category_vehicule?: string | null;
  propriete_vehicule?: string | null;
  id_marque?: number | null;
  modele_vehicule?: string | null;
  date_aquisition_vehicule?: Date | null;
  type_carburant_vehicule?: string | null;
  immatriculation_vehicule?: string | null;
  annee_vehicule?: string | null;
  couleur_vehicule?: string;
  date_circulation_vehicule?: Date | null;
  num_chassis_vehicule?: string | null;
  nbre_place_vehicule?: number | null;
  puissance_vehicule?: string | null;
  etat_vehicule?: string | null;
  kilometrage_vehicule?: string | null;
  commentaire_vehicule?: string | null;
  companie_assurance_vehicule?: string | null;
  type_assurance_vehicule?: string | null;
  date_debut_assurance_vehicule?: string | null;
  date_expir_assurance_vehicule?: string | null;
  cout_assurance_vehicule?: string | null;
  delai_assurance_vehicule?: string | null;
  reference_assurance_vehicule?: string | null;
  note_assurance_vehicule?: string | null;
  etat_ctr_tech_vehicule?: string | null;
  date_debut_ctr_tech_vehicule?: string | null;
  date_fin_ctr_tech_vehicule?: string | null;
  station_ctr_vehicule?: string | null;
  cout_ctr_tech_vehicule?: string | null;
  note_ctr_tech_vehicule?: string | null;
  date_vignette_vehicule?: string | null;
  cout_vignette_vehicule?: string | null;
  id_gps?: number | null;
  id_conducteur_vehicule?: number | null;
  longueur_vehicule?: string | null;
  largeur_vehicule?: string | null;
  hauteur_vehicule?: string | null;
  poid_vehicule?: string | null;
  nbre_porte_vehicule?: number | null;
  icon_vehicule?: string | null;
  detail_vehicule?: string | null;
  num_porte_vehicule?: string | null;
  ptac_vehicule?: string | null;
  kilometrage_reel_vehicule?: string | null;
  image_vehicule?: string | null;
  consomatio_gasoil_reel_vehicule?: string | null;
  latitude_vehicule?: string | null;
  longitude_vehicule?: string | null;
  date_heure_position_vehicule?: string | null;
  id_sousParc_vehicule?: number | null;
  num_vignette_vehicule?: string | null;
  famille_vehicule?: string | null;
  gamme_vehicule?: string | null;
  id_groupe?: number;
  fuel_level_vehicule?: string | null;
  co2_vehicule?: string | null;
  capacite_res_vehicule?: string | null;
  prochain_vidange_vehicule?: string | null;
  info_vehicule?: number | null;
  draft?: number;
  inService_vehicule?: string | null;
  date_creation_vehicule?: string | null;
  date_modification_vehicule?: string | null;
  date_suppression_vehicule?: string | null;
  PSN?: string | null;
  LAST_IB_CODE?: string | null;
  fuel_type?: string | null;
  maximum_allowed_total?: string | null;
  consommation_moyenne_vehicule?: string | null;
  id_parc?: number | null;
}

export function Vehicle() {

  const { id_vehicule } = useParams<{ id_vehicule?: string }>();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const isEditing = Boolean(id_vehicule);
  const navigate = useNavigate();
  const { translate } = useTranslate();
  const id_user = localStorage.getItem("GeopUserID");
  const [vehicleItem, setVehicle] = useState<VehicleInterface | null>({
    id_vehicule: 0,
    id_user: null,
    vehicule_type: null,
    category_vehicule: null,
    propriete_vehicule: null,
    id_marque: null,
    modele_vehicule: null,
    date_aquisition_vehicule: null,
    type_carburant_vehicule: null,
    immatriculation_vehicule: null,
    annee_vehicule: null,
    couleur_vehicule: "#F70000",
    date_circulation_vehicule: null,
    num_chassis_vehicule: null,
    nbre_place_vehicule: null,
    puissance_vehicule: null,
    etat_vehicule: null,
    kilometrage_vehicule: null,
    commentaire_vehicule: null,
    companie_assurance_vehicule: null,
    type_assurance_vehicule: null,
    date_debut_assurance_vehicule: null,
    date_expir_assurance_vehicule: null,
    cout_assurance_vehicule: null,
    delai_assurance_vehicule: null,
    reference_assurance_vehicule: null,
    note_assurance_vehicule: null,
    etat_ctr_tech_vehicule: null,
    date_debut_ctr_tech_vehicule: null,
    date_fin_ctr_tech_vehicule: null,
    station_ctr_vehicule: null,
    cout_ctr_tech_vehicule: null,
    note_ctr_tech_vehicule: null,
    date_vignette_vehicule: null,
    cout_vignette_vehicule: null,
    id_gps: null,
    id_conducteur_vehicule: null,
    longueur_vehicule: null,
    largeur_vehicule: null,
    hauteur_vehicule: null,
    poid_vehicule: null,
    nbre_porte_vehicule: null,
    icon_vehicule: null,
    detail_vehicule: null,
    num_porte_vehicule: null,
    ptac_vehicule: null,
    kilometrage_reel_vehicule: null,
    image_vehicule: null,
    consomatio_gasoil_reel_vehicule: null,
    latitude_vehicule: null,
    longitude_vehicule: null,
    date_heure_position_vehicule: null,
    id_sousParc_vehicule: null,
    num_vignette_vehicule: null,
    famille_vehicule: null,
    gamme_vehicule: null,
    id_groupe: 0,
    fuel_level_vehicule: null,
    co2_vehicule: null,
    capacite_res_vehicule: null,
    prochain_vidange_vehicule: null,
    info_vehicule: null,
    draft: 0,
    inService_vehicule: null,
    date_creation_vehicule: null,
    date_modification_vehicule: null,
    date_suppression_vehicule: null,
    PSN: null,
    LAST_IB_CODE: null,
    fuel_type: null,
    maximum_allowed_total: null,
    consommation_moyenne_vehicule: null,
    id_parc: null,
  });
  const [updateMatriculation, setUpdateMatriculation] = useState("");
  const [loading, setLoading] = useState<boolean | null>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedCodeConducteur, setUpdatedCodeConducteur] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);


  // Définition des types pour chaque champ
  interface Field {
    id: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'tel' | 'email' | 'file' | 'SelectGroup';
    placeholder?: string;
    options?: any[];
    icon: string;
    required?: boolean;
    tooltip?: string;
    onChange?: (value: any) => void;
  }




  const handleCategoryChange = async (selectedOption: any) => {

    setVehicle((prevData) => ({
      ...prevData!,
      category_vehicule: selectedOption.value,
    }));

    try {
      const res = await fetch(
        `${backendUrl}/api/vehicle/type-options/${selectedOption.value}`,
        { mode: "cors" }
      );

      if (!res.ok) {
        console.error("Error retrieving group");
        return;
      }

      const typesData = await res.json();
      const typesOptionsData = typesData.model.split(",").map((type: any) => ({
        value: type,
        label: `${type || ""}`,
      }));

      setTypesOptions(typesOptionsData);
    } catch (error) {
      console.error("Error while retrieving types", error);
    }
  };


  const handleTypeChange = async (selectedOption: any) => {
    setVehicle((prevData) => ({
      ...prevData!,
      vehicule_type: selectedOption.value,
    }));
  };


  const categoryOptions = [
    { value: "Aucun", label: "Aucun" },
    { value: "PL", label: "PL" },
    { value: "VL", label: "VL" },
    { value: "Engin", label: "Engin" },
    { value: "Outils", label: "Outils" },
    { value: "Utilitaires", label: "Utilitaires" },
    { value: "Autre", label: "Autre" },
  ];

  const [typesOptions, setTypesOptions] = useState<any[]>([{ value: "Aucun", label: "Aucun" }]);

  const tabTitles: { [key: string]: string } = {
    tab_1: translate("General information"),
    tab_2: translate("Technical characteristics"),
    tab_3: translate("Assurance"),
    tab_4: translate("Technical control"),
    tab_5: translate("")
  };

  const fieldsTab1: Field[] = [
    { id: "immatriculation_vehicule", label: "Immatriculation", type: "text", placeholder: "Immatriculation", icon: "fas fa-car", required: true },
     { id: "category_vehicule", label: "Catégorie", type: "SelectGroup", options: categoryOptions, onChange: handleCategoryChange, icon: "fas fa-list", required: true, },
     { id: "modele_vehicule", label: "Modèle", type: "text", placeholder: "Modèle", icon: "fas fa-cube", required: true },
     { id: "vehicule_type", label: "Type", type: "SelectGroup", options: typesOptions, onChange: handleTypeChange, icon: "fas fa-list", required: true, },
    { id: "id_marque", label: "Marque", type: "select", options: ["Marque", "Abarth", "AC", "Acrea", "Acura", "Aixam", "Aleko", "Alfa Romeo", "Allard", "Alpina", "Alpine", "Alta", "Alvis", "Amilcar", "Arista", "Arnolt", "Aro", "Asa", "Aston Martin", "Ats", "Auburn", "Audi", "Austin", "Austin Healey", "Auto Union", "Autobianchi", "Auverland", "Bajaj", "Bedford", "Bellier", "Bentley", "Benz", "Bertone", "Bizzarrini", "BMW", "Brabham", "Brabus", "Brasier", "Bristol", "Bugatti", "Buick", "Cadillac", "Carbodies", "Carlsson", "Caterham", "Caterpillar", "Chatenet", "Chevrolet US", "Chrysler", "Cisitalia", "Citroen", "Cobra", "Comet", "Connaught", "Cooper", "Corvette", "Dacia", "Daewoo", "Daf", "Daihatsu", "Daimler", "Datsun", "De Tomaso", "Delage", "Delahaye", "Deutz Fahr", "Dodge", "Donkervoort", "Doosan", "Duesenberg", "Edsel", "Facel Vega", "Ferrari", "Fiat", "Fisker", "Ford US", "Four Stroke", "Fournier-Marcadier", "Frazer Nash", "Fso-Polski", "General Motors", "Ghia", "Ginetta", "GMC", "Gme", "Gordini", "Grandin", "Grecav", "Gregoire", "Hinowa", "Hispano Suiza", "Hommell", "Honda", "Horch", "Howmet", "Hummer", "Hyundai", "Imperial", "Infiniti", "Innocenti", "Invicta", "Isuzu", "Ital Design", "Iveco", "Jaguar", "Jcb", "Jdm", "Jeep", "Jensen", "Jmc", "Kaiser", "Kenworth", "Kia", "Koenigsegg", "Ktm", "Kurtis", "Lada", "Lagonda", "Lamborghini", "Lancia", "Land Rover", "Laraki", "Lea-Francis", "Leopard", "Lexus", "Liebherr", "Ligier", "Lincoln", "Lister", "Lola", "Lotus", "Mahindra", "Man", "Mansory", "Marcos", "Marmon", "Maruti", "Maserati", "Matra", "Maybach", "Maz", "Mazda", "McLaren", "Mega", "Mercedes-Benz", "Mercury", "Mg", "Microcar", "Mini", "Mitsubishi", "Monica", "Monteverdi", "Morgan", "Morris", "Moskvitch", "Nash", "Nissan", "Novitec Rosso", "Oldsmobile", "Opel", "Osca", "Packard", "Pagani", "Panhard", "Peerless", "Pegaso", "Peugeot", "Pgo", "Pininfarina", "Plymouth", "Pontiac", "Porsche", "Proton", "Renault", "Riley", "Rinspeed", "Rolland Pilain", "Rolls Royce", "Rondeau Jean", "Rover", "Saab", "Sarl Toufik", "Saturn", "Sbarro", "Scania", "Schwing_Stetter", "Seat", "Secma", "Shacman", "Shelby", "Siata", "Simatra", "Simca", "Skoda", "Smart", "Snvi", "Socope", "Spyker", "SsangYong", "Stanguellini", "Stoewer", "Studbaker", "Subaru", "Sunbeam", "Suzuki", "Talbot", "Tata", "Tatra", "Tchaika", "Techart", "Tesla", "Tirsam", "Tojeiro", "Toyota", "Tramontana", "Trident", "Triumph", "Tunicom", "TVR", "Umm", "Vanwall", "Venturi", "Veritas", "Voisin", "Volkswagen", "Volvo", "Westfield", "Wiesmann", "Willys Overland", "Yamaha", "Zagato", "Zastava", "Zaz", "Zest"], icon: "fas fa-tag", required: true, },
     { id: "gamme_vehicule", label: "Gamme", type: "text", placeholder: "Moteur", icon: "fas fa-cogs", required: false },
   { id: "num_porte_vehicule", label: "Codification véhicule", type: "text", placeholder: "Numéro de porte", icon: "fas fa-hashtag", required: true },
    { id: "couleur_vehicule", label: "Durée d'amortissement (jours)", type: "text", placeholder: "Durée d'amortissement", icon: "fas fa-calendar", required: true },
    { id: "propriete_vehicule", label: "Acquisition", type: "select", options: ["Acquisition", "Achat", "Leasing", "Location"], icon: "fas fa-shopping-cart", required: true, },
    { id: "etat_vehicule", label: "État", type: "select", options: ["État", "Disponible", "Disponible-Hs", "Affecté", "En panne", "En réparation", "HS"], icon: "fas fa-info-circle", required: true, },
    { id: "type_carburant_vehicule", label: "Type carburant", type: "select", options: ["Type carburant", "Essence", "Gas oil", "GPL", "Électrique"], icon: "fas fa-gas-pump", required: true, },
    { id: "id_parc", label: "Nom du parc automobile", type: "select", options: ["Nom du Parc", "Metalsteeltest"], icon: "fas fa-warehouse", required: false, },
    { id: "id_conducteur_vehicule", label: "Nom du conducteur", type: "select", options: ["Conducteur", "Merzem Abdelatif", "Touil Mohamed", "HAMAL AMAR 16", "Lebgaa Rabah", "Messai Djemai", "MEZIANI DJAMEL",], icon: "fas fa-user", required: false, },
    { id: "inService_vehicule", label: "Service", type: "select", options: ["Service"], icon: "fas fa-tools", required: false, },
    { id: "capacite_res_vehicule", label: "Capacité réservoir (L)", type: "text", placeholder: "Capacité réservoir (L)", icon: "fas fa-tachometer-alt", required: false },
    { id: "consommation_moyenne_vehicule", label: "Consommation moyenne (l/100km)", type: "text", placeholder: "Consommation moyenne", icon: "fas fa-road", required: false },
    { id: "kilometrage_vehicule", label: "Kilométrage (Km)", type: "text", placeholder: "Kilométrage", icon: "fas fa-odometer", required: false },
    { id: "image_vehicule", label: "Photo Véhicule", type: "file", placeholder: "", icon: "fas fa-image", required: false },
  ];


  const fieldsTab2: Field[] = [
    { id: "psn", label: "PSN", type: "text", placeholder: "PSN", icon: "fas fa-barcode", tooltip: "N° série gps", required: false },
    { id: "dateCirculation", label: "Date de circulation", type: "date", placeholder: "", icon: "fas fa-calendar-day", tooltip: "Date circulation", required: false },
    { id: "anne", label: "Année", type: "text", placeholder: "Année", icon: "fas fa-calendar", tooltip: "Année", required: false },
    { id: "numChassis", label: "N° Châssis", type: "text", placeholder: "N° Châssis", icon: "fas fa-car", tooltip: "N° Châssis du véhicule", required: false },
    { id: "nbrePorte", label: "Nombre de Portes", type: "text", placeholder: "Nombre de Portes", icon: "fas fa-door-open", tooltip: "Nombre de portes", required: false },
    { id: "nbrePlace", label: "Nombre de Places", type: "text", placeholder: "Nombre de Places", icon: "fas fa-chair", tooltip: "Nombre de places", required: false },
    { id: "puissance", label: "Puissance", type: "text", placeholder: "Puissance", icon: "fas fa-bolt", tooltip: "Puissance", required: false },
    { id: "ptac", label: "PTAC", type: "text", placeholder: "Poids total autorisé en charge", icon: "fas fa-weight-hanging", tooltip: "Poids total autorisé en charge", required: false },
    { id: "longueur", label: "Longueur (m)", type: "text", placeholder: "Longueur (m)", icon: "fas fa-ruler-horizontal", tooltip: "Longueur en mètres", required: false },
    { id: "largeur", label: "Largeur (m)", type: "text", placeholder: "Largeur (m)", icon: "fas fa-ruler-combined", tooltip: "Largeur en mètres", required: false },
    { id: "hauteur", label: "Hauteur (m)", type: "text", placeholder: "Hauteur (m)", icon: "fas fa-ruler-vertical", tooltip: "Hauteur en mètres", required: false },
    { id: "poids", label: "Poids (Kg)", type: "text", placeholder: "Poids (Kg)", icon: "fas fa-dumbbell", tooltip: "Poids du véhicule en kg", required: false },
    { id: "co2", label: "Émission de CO2", type: "text", placeholder: "Émission de CO2", icon: "fas fa-cloud", tooltip: "Émission de CO2", required: false },
  ];
  const fieldsTab3: Field[] = [
    { id: "agenceAssurance", label: "Agence assurance", type: "text", placeholder: "Agence assurance", icon: "fas fa-building", tooltip: "Agence assurance", required: false },
    { id: "typeAssurance", label: "Type assurance", type: "text", placeholder: "Type assurance", icon: "fas fa-shield-alt", tooltip: "Type assurance", required: false },
    { id: "dateDebutAssurance", label: "Date début", type: "date", placeholder: "", icon: "fas fa-calendar-day", required: false },
    { id: "dateExpAssurance", label: "Date expiration", type: "date", placeholder: "", icon: "fas fa-calendar-day", required: false },
    { id: "coutAss", label: "Coût", type: "text", placeholder: "Coût", icon: "fas fa-money-bill-alt", tooltip: "Coût", required: false },
    { id: "delai", label: "Délai (Mois)", type: "text", placeholder: "Délai (Mois)", icon: "fas fa-clock", tooltip: "Délai (Mois)", required: false },
    { id: "referenceAssurance", label: "Référence", type: "text", placeholder: "Référence", icon: "fas fa-barcode", tooltip: "Référence", required: false },
  ];

  const fieldsTab4: Field[] = [
    { id: "etabControle", label: "Etablissement de contrôle", type: "text", placeholder: "Etablissement de contrôle", icon: "fas fa-building", tooltip: "Etablissement de contrôle", required: false },
    { id: "referenceControle", label: "Référence", type: "text", placeholder: "Référence", icon: "fas fa-barcode", tooltip: "Référence", required: false },
    { id: "dateControle", label: "Date du contrôle", type: "date", placeholder: "", icon: "fas fa-calendar-day", required: false },
    { id: "dateFinControle", label: "Date fin", type: "date", placeholder: "", icon: "fas fa-calendar-day", required: false },
    { id: "coutControle", label: "Coût", type: "text", placeholder: "Coût", icon: "fas fa-money-bill-alt", tooltip: "Coût", required: false },
  ];




  const fieldsTab5: Field[] = [
    { id: "numVignette", label: "N° Vignette", type: "text", placeholder: "N° Vignette", tooltip: "N° Vignette", icon: "fas fa-barcode", required: false },
    { id: "dateVignette", label: "Date vignette", type: "date", placeholder: "", tooltip: "Date vignette", icon: "fas fa-calendar", required: false },
    { id: "coutVignette", label: "Coût", type: "text", placeholder: "Coût", tooltip: "Coût", icon: "fas fa-money-bill", required: false },
  ];


  const tab1Fields: Field[] = [
    { id: "fournisseur", label: "Fournisseur", type: "text", placeholder: "Fournisseur", tooltip: "Nom du fournisseur", icon: "fas fa-building", required: false },
    { id: "numContrat", label: "N° du contrat", type: "text", placeholder: "N° du contrat", tooltip: "Numéro du contrat", icon: "fas fa-file-contract", required: false },
    { id: "duree", label: "Durée", type: "select", options: ["Durée", "6", "12", "36", "48", "60",], tooltip: "Durée", icon: "fas fa-clock", required: false, },
    { id: "apport", label: "Apport", type: "number", placeholder: "Apport", tooltip: "Apport", icon: "fas fa-wallet", required: false },
    { id: "datePremiereEcheance", label: "Date 1ère échéance", type: "date", placeholder: "", icon: "fas fa-calendar-day", required: false },
    { id: "echeance", label: "Échéance", type: "number", placeholder: "Échéance", tooltip: "Échéance", icon: "fas fa-calendar-check", required: false },
    { id: "echeanceRestante", label: "Échéance restante", type: "number", placeholder: "Échéance restantes (Mois)", tooltip: "Échéance restantes", icon: "fas fa-calendar-minus", required: false },
    { id: "payeAcejour", label: "Payé à ce jour", type: "text", placeholder: "Payé à ce jour", tooltip: "Payé à ce jour", icon: "fas fa-money-check", required: false },
    { id: "dernierPaiment", label: "Dernier paiement", type: "text", placeholder: "Dernier paiement", tooltip: "Dernier paiement", icon: "fas fa-money-bill", required: false },
    { id: "prochaineEcheance", label: "Prochaine échéance", type: "text", placeholder: "Prochaine échéance", tooltip: "Prochaine échéance", icon: "fas fa-calendar-plus", required: false },
    { id: "totalLeasing", label: "Total leasing H.T", type: "number", placeholder: "Total leasing H.T", tooltip: "Total leasing H.T", icon: "fas fa-calculator", required: false },
  ];

  const tab2Fields: Field[] = [
    { id: "numContratL", label: "N° Contrat (location)", type: "text", placeholder: "N° Contrat (location)", tooltip: "Numéro du contrat de location", icon: "fas fa-file-contract", required: false },
    { id: "fournisseurL", label: "Fournisseur location", type: "text", placeholder: "Fournisseur location", tooltip: "Fournisseur location", icon: "fas fa-building", required: false },
    { id: "coutLocation", label: "Coût location - mensuel", type: "text", placeholder: "Coût location - mensuel", tooltip: "Coût location", icon: "fas fa-euro-sign", required: false },
    { id: "dateDebutLocation", label: "Date début location", type: "date", placeholder: "", icon: "fas fa-calendar-day", required: false },
    { id: "nbreMoisLocation", label: "Nombre de mois", type: "number", placeholder: "Nombre de mois", tooltip: "Nombre de mois", icon: "fas fa-calendar-alt", required: false },
    { id: "totalLocation", label: "Total location", type: "number", placeholder: "Total location", tooltip: "Total location", icon: "fas fa-calculator", required: false },
    { id: "dernierVersement", label: "Dernier versement", type: "date", placeholder: "", icon: "fas fa-money-check", required: false },
  ];

  const tab3Fields: Field[] = [
    { id: "dateAcquis", label: "Date acquisition", type: "date", placeholder: "", icon: "fas fa-calendar-day", required: false },
    { id: "taxe", label: "Taxe véhicule neuf", type: "text", placeholder: "Taxe véhicule neuf", tooltip: "Taxe véhicule neuf", icon: "fas fa-file-invoice-dollar", required: false },
    { id: "totalAchat", label: "Total achat", type: "text", placeholder: "Total achat", tooltip: "Total achat", icon: "fas fa-calculator", required: false },
  ];




  const fieldsConfig: { [tabName: string]: Field[] } = {
    tab_1: fieldsTab1,
    // tab_2: fieldsTab2,
    // tab_3: fieldsTab3,
    // tab_4: fieldsTab4,
    // tab_5: fieldsTab5,
    // tab_6: fieldsTab5,
    //  tab_6: navTabsCustom
  };


  const cancelClicked = () => {
    navigate("/Vehicles");
  };


  // Fonction de validation des emails
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Fonction de validation des numéros de téléphone
  const validatePhone = (phone: string): boolean => {
    const re = /^[0-9]{10}$/; // Exemple pour des numéros de téléphone à 10 chiffres
    return re.test(phone);
  };


  const validateString = (str: string): boolean => {
    return str.trim().length > 0; // Example: checks if the string is not empty
  };

  useEffect(() => {

    const getVehicle = async () => {

      try {
        const res = await fetch(`${backendUrl}/api/vehicle/find/${id_vehicule}`, {
          mode: "cors",
        });

        if (!res.ok) {
          console.error("Error while retrieving vehicle");
          return;
        }

        const data = await res.json();
        setVehicle(data);

        setUpdateMatriculation(data.immatriculation_vehicule)

        try {
          const res = await fetch(
            `${backendUrl}/api/vehicle/type-options/${data.category_vehicule}`,
            { mode: "cors" }
          );

          if (!res.ok) {
            console.error("Error retrieving groups");
            return;
          }

          const typesData = await res.json();
          const typesOptionsData = typesData.model.split(",").map((type: any) => ({
            value: type,
            label: `${type || ""}`,
          }));

          setTypesOptions(typesOptionsData);
        } catch (error) {
          console.error("Error retrieving users", error);
        }
      } catch (error) {
        console.error("Error while retrieving vehicle", error);
      } finally {
        setLoading(false);
      }
    };

    if (isEditing) { getVehicle(); }
    else { setLoading(false); }

  }, [id_vehicule]);


  const updateVehicle = async (Vehicle: VehicleInterface) => {

    const isimmatriculationVehiculeValid = validateEmail(Vehicle.immatriculation_vehicule ?? "");
    const isPhoneValid = validatePhone(Vehicle.category_vehicule ?? "");
    const isNomConducteurValid = validateString(Vehicle.vehicule_type ?? "");
    const isPreNomConducteurValid = validateString(Vehicle.modele_vehicule ?? "");
    const PSN = validateString(Vehicle.PSN ?? "");

    // Validation échouée
    if (!isimmatriculationVehiculeValid || !isPhoneValid || !isNomConducteurValid || !isPreNomConducteurValid) {
      const emailElement = document.getElementById(
        "email_conducteur"
      ) as HTMLInputElement;
      if (emailElement) {
        emailElement.style.borderColor = isimmatriculationVehiculeValid ? "#ced4da" : "red";
      }

      const phoneElement = document.getElementById(
        "telephone_conducteur"
      ) as HTMLInputElement;
      if (phoneElement) {
        phoneElement.style.borderColor = isPhoneValid ? "#ced4da" : "red";
      }

      const nomElement = document.getElementById("nom_conducteur") as HTMLInputElement;
      if (nomElement) {
        nomElement.style.borderColor = isNomConducteurValid ? "#ced4da" : "red";
      }

      const prenomElement = document.getElementById("prenom_conducteur") as HTMLInputElement;
      if (prenomElement) {
        prenomElement.style.borderColor = isPreNomConducteurValid ? "#ced4da" : "red";
      }


      toast.warn("Please fill in all required fields", {
        position: "bottom-right",
        autoClose: 2400,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      setButtonClicked(false);
      return;
    }

    try {

      const rescheck = await fetch(`${backendUrl}/api/geop/Vehicle/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          /*code_conducteur: Vehicle.code_conducteur,
          updated_code_conducteur: Vehicle.code_conducteur,
          updated: Vehicle.code_conducteur === updatedCodeConducteur ? 0 : 1,*/
        }),
      });

      if (rescheck.ok) {
        const jsonResponse = await rescheck.json();

        if (jsonResponse.Vehicle_count !== 0) {
          toast.warn("Vehicle code already exists", {
            position: "bottom-right",
            autoClose: 2400,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });

          setButtonClicked(false);
          return;
        }


        let VehicleData = Object.fromEntries(
          Object.entries(Vehicle).filter(([_, value]) => value !== null)
        );

        const dateFields = [
          'date_naissance_conducteur',
          'date_delivrance_permis_conducteur',
          'date_delivrance_pi_conducteur',
          'date_expir_permis_conducteur'
        ];

        VehicleData = Object.fromEntries(
          Object.entries(Vehicle)
            .filter(([_, value]) => value !== null)
            .map(([key, value]) => {
              // Check if the key is one of the specific date fields
              if (dateFields.includes(key)) {
                let date: Date;

                // If the value is already a Date object
                if (value instanceof Date) {
                  date = value;
                } else if (typeof value === 'string' && value.includes('T')) {
                  // Convert ISO string to Date object
                  date = new Date(value);
                } else {
                  return [key, value];
                }

                // Format the date as "YYYY-MM-DD HH:mm:ss"
                const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                return [key, formattedDate];
              }
              return [key, value];
            })
        );

        // Si les validations passent, mettre à jour le conducteur
        const res = await fetch(`${backendUrl}/api/geop/Vehicle/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify(VehicleData),
        });

        if (!res.ok) {
          toast.warn("Can't update Vehicle", {
            position: "bottom-right",
            autoClose: 2400,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });

          console.error("Error updating Vehicle");
          setButtonClicked(false);
          return;
        }

        toast.success("Vehicle updated successfully", {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        setButtonClicked(false);
        navigate("/Vehicles");
      } else {
        toast.warn("Can't update Vehicle", {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        setButtonClicked(false);
      }
    } catch (error) {
      toast.warn("Can't update Vehicle", {
        position: "bottom-right",
        autoClose: 2400,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      setButtonClicked(false);
    }
  };

  const createVehicle = async (Vehicle: VehicleInterface) => {
    const isimmatriculationVehiculeValid = validateEmail(Vehicle.immatriculation_vehicule ?? "");
    const isPhoneValid = validatePhone(Vehicle.category_vehicule ?? "");
    const isNomConducteurValid = validateString(Vehicle.vehicule_type ?? "");
    const isPreNomConducteurValid = validateString(Vehicle.modele_vehicule ?? "");
    const PSN = validateString(Vehicle.PSN ?? "");




    // Validation échouée
    if (!isimmatriculationVehiculeValid || !isPhoneValid || !isNomConducteurValid || !isPreNomConducteurValid) {
      const emailElement = document.getElementById(
        "email_conducteur"
      ) as HTMLInputElement;
      if (emailElement) {
        emailElement.style.borderColor = isimmatriculationVehiculeValid ? "#ced4da" : "red";
      }

      const phoneElement = document.getElementById(
        "telephone_conducteur"
      ) as HTMLInputElement;
      if (phoneElement) {
        phoneElement.style.borderColor = isPhoneValid ? "#ced4da" : "red";
      }

      const nomElement = document.getElementById("nom_conducteur") as HTMLInputElement;
      if (nomElement) {
        nomElement.style.borderColor = isNomConducteurValid ? "#ced4da" : "red";
      }

      const prenomElement = document.getElementById("prenom_conducteur") as HTMLInputElement;
      if (prenomElement) {
        prenomElement.style.borderColor = isPreNomConducteurValid ? "#ced4da" : "red";
      }

      const codeElement = document.getElementById("code_conducteur") as HTMLInputElement;
      if (codeElement) {
        codeElement.style.borderColor = isimmatriculationVehiculeValid ? "#ced4da" : "red";
      }

      toast.warn("Please fill in all required fields", {
        position: "bottom-right",
        autoClose: 2400,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      setButtonClicked(false);
      return;
    } else {
      try {

        // Check if the Vehicle code already exists
        const rescheck = await fetch(`${backendUrl}/api/geop/Vehicle/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify({
            /* code_conducteur: Vehicle.code_conducteur,
             updated_code_conducteur: Vehicle.code_conducteur,
             update: 0, // For create operation*/
          }),
        });

        if (rescheck.ok) {
          const jsonResponse = await rescheck.json();

          if (jsonResponse.Vehicle_count != 0) {
            toast.warn("Vehicle code already exists", {
              position: "bottom-right",
              autoClose: 2400,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });

            setButtonClicked(false);
            return;
          }

          let VehicleData = Object.fromEntries(
            Object.entries(Vehicle).filter(([_, value]) => value !== null)
          );



          const dateFields = [
            'date_naissance_conducteur',
            'date_delivrance_permis_conducteur',
            'date_delivrance_pi_conducteur',
            'date_expir_permis_conducteur'
          ];

          VehicleData = Object.fromEntries(
            Object.entries(Vehicle)
              .filter(([_, value]) => value !== null)
              .map(([key, value]) => {
                // Check if the key is one of the specific date fields
                if (dateFields.includes(key)) {
                  let date: Date;

                  // If the value is already a Date object
                  if (value instanceof Date) {
                    date = value;
                  } else if (typeof value === 'string' && value.includes('T')) {
                    // Convert ISO string to Date object
                    date = new Date(value);
                  } else {
                    return [key, value];
                  }

                  // Format the date as "YYYY-MM-DD HH:mm:ss"
                  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                  return [key, formattedDate];
                }
                return [key, value];
              })
          );


          // If validations pass, create the Vehicle
          const res = await fetch(`${backendUrl}/api/geop/Vehicle/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify(VehicleData),
          });

          if (!res.ok) {
            toast.warn("Can't create Vehicle", {
              position: "bottom-right",
              autoClose: 2400,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });

            console.error("Error creating Vehicle");
            setButtonClicked(false);
            return;
          }

          toast.success("Vehicle created successfully", {
            position: "bottom-right",
            autoClose: 2400,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });

          setButtonClicked(false);
          navigate("/Vehicles");
        } else {
          toast.warn("Can't create Vehicle", {
            position: "bottom-right",
            autoClose: 2400,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });

          setButtonClicked(false);
        }
      } catch (error) {
        console.error("Can't create Vehicle", error);

        toast.warn("Can't create Vehicle", {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        setButtonClicked(false);
      }
    }
  };



  // Utilisez l'interface ChangeEvent pour le gestionnaire d'événements
  const handleChange = (name: any, value: any) => {
    console.log("name: " + name);
    console.log("value: " + value);

    if (vehicleItem) {
      setVehicle({
        ...vehicleItem,
        [name]: value,
      });
    }


    console.log(Vehicle)

  };

  return (
    <>
      <style>
        {`
          .form-group {
            margin-bottom: 1rem;
          }
          
          .form-group .form-control {
            width: 100%;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
          }
          
          .footer {
            margin-top: 1rem;
          }
        `}
      </style>

      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-user-nurse"></i>
            {isEditing ? "Edit vehicle" : "Add vehicle"}
          </h4>
        </div>

        <div className="col-md-12">
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <PropagateLoader color={"#123abc"} loading={loading} size={20} />
            </div>
          ) : (
            <Tabs defaultActiveKey="tab_1" id="vehicle-tabs" className="mb-3">
              {Object.entries(fieldsConfig).map(([tabKey, fields]) => (
                <Tab eventKey={tabKey} title={tabTitles[tabKey]} key={tabKey}>
                  <div className="row">
                    {fields.map((field) => (
                      <div className="col-md-6" key={field.id}>
                        {field.type === "SelectGroup" ? (
                          <SelectGroup
                            controlId={field.id}
                            name={field.id}
                            label={field.label}
                            icon={field.icon || "search"}
                            options={field.options || []}
                            valueType={{
                              value: vehicleItem ? vehicleItem[field.id as keyof VehicleInterface] : translate("none"),
                              label: vehicleItem ? vehicleItem[field.id as keyof VehicleInterface] : "",
                            }}
                            onChange={field.onChange}
                          />
                        ) : (
                          <FieldInput
                            field={field}
                            value={vehicleItem ? vehicleItem[field.id as keyof VehicleInterface] : ""}
                            onChange={handleChange}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Tab>
              ))}
            </Tabs>

          )}
        </div>

        <div className="col-md-12 footer">
          <button
            onClick={() => {
              cancelClicked();
            }}
            type="button"
            className="btn btn-default"
          >
            {translate("Cancel")}
          </button>
          <Button
            variant="primary"
            type="submit"

            onClick={() => {
              setButtonClicked(true);
              vehicleItem &&
                (isEditing
                  ? updateVehicle(vehicleItem)
                  : createVehicle(vehicleItem))
            }}

            disabled={buttonClicked}

          >
            {isEditing ? <i className="fas fa-edit"></i> : <i className="fas fa-plus"></i>}
            {isEditing ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </div>
    </>
  );
}

