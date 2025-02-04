import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, Form, Button, Row } from "react-bootstrap";
import { useTranslate } from "../hooks/LanguageProvider";
import { toast, Bounce } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import FieldInput from "../components/Vehicle/FieldInput";
import SelectGroup from "../components/Vehicle/SelectGroup";

export interface VehicleInterface {
  id_vehicule?: number | null;
  id_user?: number;
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
  nom_user?: string | null;
  prenom_user?: string | null;
  nom_conducteur?: string | null;
  prenom_conducteur?: string | null;
  nom_parc?: string | null;
}

interface UserInterface {
  id_user: number;
  nom_user: string;
  prenom_user: string;
}

export function Vehicle() {

  const { id_vehicule } = useParams<{ id_vehicule?: string }>();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const isEditing = Boolean(id_vehicule);
  const navigate = useNavigate();
  const { translate } = useTranslate();
  const id_user = localStorage.getItem("GeopUserID");
  const [Users, setUsers] = useState<UserInterface[]>([]);
  const [usersOptions, setUsersOptions] = useState<any[]>([{ value: "Aucun", label: "Aucun" },]);
  const [drivesrOptions, setDriverOptions] = useState<{ value: string; label: string }[]>([]);
  const [parksOptions, setParkOptions] = useState<{ value: string; label: string }[]>([]);
  const [vehicleItem, setVehicle] = useState<VehicleInterface | null>({
    id_vehicule: isEditing && id_vehicule ? Number(id_vehicule) : null,
    id_user: Number(id_user),
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


  interface Driver {
    nom_conducteur: string,
    prenom_conducteur: string,
    id_conducteur: string,
  }


  interface Parc {
    nom_parc: string,
    id_parc: string,
  }

  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const toggleMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

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
    mode?: boolean;
  }

  const getDrivers = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/options-drivers/${id_user}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setDriverOptions(data.map((driver: Driver) => ({
          label: `${driver.nom_conducteur} ${driver.prenom_conducteur}`,
          value: driver.id_conducteur,
        })));

      }
    } catch (error) {
      console.error("Error retrieving most recent assignment ID selector options", error);
    }
  };


  const getParks = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/geop/park/options/${id_user}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setParkOptions(data.map((parc: Parc) => ({
          label: `${parc.nom_parc}`,
          value: parc.id_parc,
        })));

      }
    } catch (error) {
      console.error("Error retrieving most recent assignment ID selector options", error);
    }
  };

  const getUser = async (userId: any) => {
    try {
      const res = await fetch(`${backendUrl}/api/users/find/${userId}`, {
        mode: "cors",
      });

      if (!res.ok) {
        console.error("Erreur lors de la récupération des utilisateurs");
        return;
      }

      const usersData = await res.json();
      setUsers(usersData);

      const usersOptionsData = usersData.map((user: any) => ({
        value: user.id_user,
        label: `${user.nom_user} ${user.prenom_user || ""}`,
      }));

      setUsersOptions(usersOptionsData);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    }
  };

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


  const handleStateVehiculeChange = async (selectedOption: any) => {
    setVehicle((prevData) => ({
      ...prevData!,
      etat_vehicule: selectedOption.value,
    }));
  };



  const handleBrandChange = async (selectedOption: any) => {
    setVehicle((prevData) => ({
      ...prevData!,
      id_marque: selectedOption.value,
    }));
  };




  const handleUserChange = (selectedOption: any) => {
    setVehicle((prevData) => {
      const newData: VehicleInterface = { ...prevData! };
      newData.id_user = selectedOption.value;
      //    getGroup(selectedOption.value);
      return newData;
    });
  };


  const handleDriverChange = (selectedOption: any) => {
    setVehicle((prevData) => {
      const newData: VehicleInterface = { ...prevData! };
      newData.id_conducteur_vehicule = selectedOption.value;
      //    getGroup(selectedOption.value);
      return newData;
    });
  };


  const handleParkChange = (selectedOption: any) => {
    setVehicle((prevData) => {
      const newData: VehicleInterface = { ...prevData! };
      newData.id_parc = selectedOption.value;
      //    getGroup(selectedOption.value);
      return newData;
    });
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



  

  const brandOptions = [
    { value: 1, label: "Marque" },
    { value: 2, label: "Abarth" },
    { value: 3, label: "AC" },
    { value: 4, label: "Acrea" },
    { value: 5, label: "Acura" },
    { value: 6, label: "Aixam" },
    { value: 7, label: "Aleko" },
    { value: 8, label: "Alfa Romeo" },
    { value: 9, label: "Allard" },
    { value: 10, label: "Alpina" },
    { value: 11, label: "Alpine" },
    { value: 12, label: "Alta" },
    { value: 13, label: "Alvis" },
    { value: 14, label: "Amilcar" },
    { value: 15, label: "Arista" },
    { value: 16, label: "Arnolt" },
    { value: 17, label: "Aro" },
    { value: 18, label: "Asa" },
    { value: 19, label: "Aston Martin" },
    { value: 20, label: "Ats" },
    { value: 21, label: "Auburn" },
    { value: 22, label: "Audi" },
    { value: 23, label: "Austin" },
    { value: 24, label: "Austin Healey" },
    { value: 25, label: "Auto Union" },
    { value: 26, label: "Autobianchi" },
    { value: 27, label: "Auverland" },
    { value: 28, label: "Bajaj" },
    { value: 29, label: "Bedford" },
    { value: 30, label: "Bellier" },
    { value: 31, label: "Bentley" },
    { value: 32, label: "Benz" },
    { value: 33, label: "Bertone" },
    { value: 34, label: "Bizzarrini" },
    { value: 35, label: "BMW" },
    { value: 36, label: "Brabham" },
    { value: 37, label: "Brabus" },
    { value: 38, label: "Brasier" },
    { value: 39, label: "Bristol" },
    { value: 40, label: "Bugatti" },
    { value: 41, label: "Buick" },
    { value: 42, label: "Cadillac" },
    { value: 43, label: "Carbodies" },
    { value: 44, label: "Carlsson" },
    { value: 45, label: "Caterham" },
    { value: 46, label: "Caterpillar" },
    { value: 47, label: "Chatenet" },
    { value: 48, label: "Chevrolet US" },
    { value: 49, label: "Chrysler" },
    { value: 50, label: "Cisitalia" },
    { value: 51, label: "Citroen" },
    { value: 52, label: "Cobra" },
    { value: 53, label: "Comet" },
    { value: 54, label: "Connaught" },
    { value: 55, label: "Cooper" },
    { value: 56, label: "Corvette" },
    { value: 57, label: "Dacia" },
    { value: 58, label: "Daewoo" },
    { value: 59, label: "Daf" },
    { value: 60, label: "Daihatsu" },
    { value: 61, label: "Daimler" },
    { value: 62, label: "Datsun" },
    { value: 63, label: "De Tomaso" },
    { value: 64, label: "Delage" },
    { value: 65, label: "Delahaye" },
    { value: 66, label: "Deutz Fahr" },
    { value: 67, label: "Dodge" },
    { value: 68, label: "Donkervoort" },
    { value: 69, label: "Doosan" },
    { value: 70, label: "Duesenberg" },
    { value: 71, label: "Edsel" },
    { value: 72, label: "Facel Vega" },
    { value: 73, label: "Ferrari" },
    { value: 74, label: "Fiat" },
    { value: 75, label: "Fisker" },
    { value: 76, label: "Ford US" },
    { value: 77, label: "Four Stroke" },
    { value: 78, label: "Fournier-Marcadier" },
    { value: 79, label: "Frazer Nash" },
    { value: 80, label: "Fso-Polski" },
    { value: 81, label: "General Motors" },
    { value: 82, label: "Ghia" },
    { value: 83, label: "Ginetta" },
    { value: 84, label: "GMC" },
    { value: 85, label: "Gme" },
    { value: 86, label: "Gordini" },
    { value: 87, label: "Grandin" },
    { value: 88, label: "Grecav" },
    { value: 89, label: "Gregoire" },
    { value: 90, label: "Hinowa" },
    { value: 91, label: "Hispano Suiza" },
    { value: 92, label: "Hommell" },
    { value: 93, label: "Honda" },
    { value: 94, label: "Horch" },
    { value: 95, label: "Howmet" },
    { value: 96, label: "Hummer" },
    { value: 97, label: "Hyundai" },
    { value: 98, label: "Imperial" },
    { value: 99, label: "Infiniti" },
    { value: 100, label: "Innocenti" },
    { value: 101, label: "Invicta" },
    { value: 102, label: "Isuzu" },
    { value: 103, label: "Ital Design" },
    { value: 104, label: "Iveco" },
    { value: 105, label: "Jaguar" },
    { value: 106, label: "Jcb" },
    { value: 107, label: "Jdm" },
    { value: 108, label: "Jeep" },
    { value: 109, label: "Jensen" },
    { value: 110, label: "Jmc" },
    { value: 111, label: "Kaiser" },
    { value: 112, label: "Kenworth" },
    { value: 113, label: "Kia" },
    { value: 114, label: "Koenigsegg" },
    { value: 115, label: "Ktm" },
    { value: 116, label: "Kurtis" },
    { value: 117, label: "Lada" },
    { value: 118, label: "Lagonda" },
    { value: 119, label: "Lamborghini" },
    { value: 120, label: "Lancia" },
    { value: 121, label: "Land Rover" },
    { value: 122, label: "Laraki" },
    { value: 123, label: "Lea-Francis" },
    { value: 124, label: "Leopard" },
    { value: 125, label: "Lexus" },
    { value: 126, label: "Liebherr" },
    { value: 127, label: "Ligier" },
    { value: 128, label: "Lincoln" },
    { value: 129, label: "Lister" },
    { value: 130, label: "Lola" },
    { value: 131, label: "Lotus" },
    { value: 132, label: "Mahindra" },
    { value: 133, label: "Man" },
    { value: 134, label: "Mansory" },
    { value: 135, label: "Marcos" },
    { value: 136, label: "Marmon" },
    { value: 137, label: "Maruti" },
    { value: 138, label: "Maserati" },
    { value: 139, label: "Matra" },
    { value: 140, label: "Maybach" },
    { value: 141, label: "Mazda" },
    { value: 142, label: "McLaren" },
    { value: 143, label: "Mercedes" },
    { value: 144, label: "Mercury" },
    { value: 145, label: "Messerschmitt" },
    { value: 146, label: "Metrocab" },
    { value: 147, label: "MG" },
    { value: 148, label: "Mitsubishi" },
    { value: 149, label: "Morgen" },
    { value: 150, label: "Morris" },
    { value: 151, label: "Moulton" },
    { value: 152, label: "Nash" },
    { value: 153, label: "Nissan" },
    { value: 154, label: "Noble" },
    { value: 155, label: "Packard" },
    { value: 156, label: "Pagani" },
    { value: 157, label: "Panhard" },
    { value: 158, label: "Peugeot" },
    { value: 159, label: "Pininfarina" },
    { value: 160, label: "Plymouth" },
    { value: 161, label: "Polaris" },
    { value: 162, label: "Pontiac" },
    { value: 163, label: "Porsche" },
    { value: 164, label: "Qoros" },
    { value: 165, label: "Ram" },
    { value: 166, label: "Renault" },
    { value: 167, label: "Riley" },
    { value: 168, label: "Rolls-Royce" },
    { value: 169, label: "Rover" },
    { value: 170, label: "Saab" },
    { value: 171, label: "Saleen" },
    { value: 172, label: "Saturn" },
    { value: 173, label: "Scion" },
    { value: 174, label: "Shelby" },
    { value: 175, label: "Simca" },
    { value: 176, label: "Smart" },
    { value: 177, label: "Spyker" },
    { value: 178, label: "Ssangyong" },
    { value: 179, label: "Studebaker" },
    { value: 180, label: "Subaru" },
    { value: 181, label: "Sunbeam" },
    { value: 182, label: "Suzuki" },
    { value: 183, label: "Talbot" },
    { value: 184, label: "Tesla" },
    { value: 185, label: "Toyota" },
    { value: 186, label: "Trabant" },
    { value: 187, label: "Trident" },
    { value: 188, label: "Triumph" },
    { value: 189, label: "TVR" },
    { value: 190, label: "Vauxhall" },
    { value: 191, label: "Volkswagen" },
    { value: 192, label: "Volvo" },
    { value: 193, label: "Westfield" },
    { value: 194, label: "Wiesmann" },
    { value: 195, label: "Willys Overland" },
    { value: 196, label: "Yamaha" },
    { value: 197, label: "Zagato" },
    { value: 198 ,label: "Zastava" },
    { value: 199, label: "Zaz" },
    { value: 200, label: "Zest" },
  ];
  


  const [typesOptions, setTypesOptions] = useState<any[]>([{ value: "Aucun", label: "Aucun" }]);

  const tabTitles: { [key: string]: string } = {
    tab_1: translate("General information"),
    tab_2: translate("Technical characteristics"),
    tab_3: translate("Insurance"),
    tab_4: translate("Technical control"),
    tab_5: translate("Vehicle sticker")
  };

  const fieldsTab1: Field[] = [
    { id: "immatriculation_vehicule", label: translate("Immatriculation") + " *", type: "text", placeholder: "Immatriculation", icon: "fas fa-barcode", required: true },
    //   { id: "id_user", label: "User", type: "SelectGroup", options: usersOptions, onChange: handleUserChange, icon: "fas fa-user", required: false },
    { id: "id_parc", label: "Parc", type: "SelectGroup", options: parksOptions, onChange: handleParkChange, icon: "fas fa-warehouse", required: false, mode: true },
    { id: "id_conducteur_vehicule", label: "Conducteur", placeholder: "Select conducteur", type: "SelectGroup", options: drivesrOptions, onChange: handleDriverChange, icon: "fas fa-user", required: false, },
    { id: "category_vehicule", label: "Catégorie", type: "SelectGroup", options: categoryOptions, onChange: handleCategoryChange, icon: "fas fa-list", required: true, },
    { id: "modele_vehicule", label: "Modèle", type: "text", placeholder: "Modèle", icon: "fas fa-cube", required: true },
    { id: "vehicule_type", label: "Type", type: "SelectGroup", options: typesOptions, onChange: handleTypeChange, icon: "fas fa-list", required: true, },
    { id: "id_marque", label: "Marque", type: "SelectGroup", options: brandOptions, onChange: handleBrandChange, icon: "fas fa-tag", required: true, },
    { id: "etat_vehicule", label: "État", type: "select", options: ["État", "Disponible", "Disponible-Hs", "Affecté", "En panne", "En réparation", "HS"], onChange: handleStateVehiculeChange, icon: "fas fa-info-circle", required: true, },
    { id: "type_carburant_vehicule", label: "Type carburant", type: "select", options: ["Type carburant", "Essence", "Gas oil", "GPL", "Électrique"], icon: "fas fa-gas-pump", required: true, },
    { id: "inService_vehicule", label: "Service", type: "select", options: ["Service"], icon: "fas fa-tools", required: false, mode: true },
    { id: "capacite_res_vehicule", label: "Capacité réservoir (L)", type: "text", placeholder: "Capacité réservoir (L)", icon: "fas fa-tachometer-alt", required: false, mode: true },
    { id: "consommation_moyenne_vehicule", label: "Consommation moyenne (l/100km)", type: "text", placeholder: "Consommation moyenne", icon: "fas fa-road", required: false, mode: true },
    { id: "kilometrage_vehicule", label: "Kilométrage (Km)", type: "text", placeholder: "Kilométrage", icon: "fas fa-road", required: false },
    { id: "image_vehicule", label: "Photo Véhicule", type: "file", placeholder: "", icon: "fas fa-image", required: false, mode: true },
    { id: "propriete_vehicule", label: "Acquisition", type: "select", options: ["Acquisition", "Achat", "Leasing", "Location"], icon: "fas fa-shopping-cart", required: true, mode: true },
    { id: "couleur_vehicule", label: "Couleur vehicule", type: "text", placeholder: "Couleur vehicule", icon: "fas fa-paint-brush", required: true, mode: true },
    { id: "num_porte_vehicule", label: "Codification véhicule", type: "text", placeholder: "Numéro de porte", icon: "fas fa-hashtag", required: true, mode: true },
    { id: "gamme_vehicule", label: "Gamme", type: "text", placeholder: "Moteur", icon: "fas fa-cogs", required: false, mode: true },
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
    tab_2: fieldsTab2,
    tab_3: fieldsTab3,
    tab_4: fieldsTab4,
    tab_5: fieldsTab5,
    tab_6: fieldsTab5,
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
    getUser(id_user);
    getDrivers();
    getParks()
    const getVehicle = async () => {

      try {
        const res = await fetch(`${backendUrl}/api/geop/vehicle/find/${id_vehicule}`, {
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


    // Validation échouée
    if (!isimmatriculationVehiculeValid) {
      const emailElement = document.getElementById(
        "immatriculation_vehicule"
      ) as HTMLInputElement;
      if (emailElement) {
        emailElement.style.borderColor = isimmatriculationVehiculeValid ? "#ced4da" : "red";
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
          immatriculation_vehicule: Vehicle.immatriculation_vehicule,
          updated_immatriculation_vehicule: updateMatriculation,
          updated: Vehicle.immatriculation_vehicule === updateMatriculation ? 0 : 1,
        }),
      });



   
      if (rescheck.ok) {
        const jsonResponse = await rescheck.json();

        if (jsonResponse.Vehicle_count !== 0) {
          toast.warn("Vehicle matriculation already exists", {
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
          'date_aquisition_vehicule',
          'date_circulation_vehicule',
          'date_debut_ctr_tech_vehicule',
          'date_fin_ctr_tech_vehicule',
          'date_vignette_vehicule',
          'date_heure_position_vehicule',
          'date_creation_vehicule',
          'date_modification_vehicule',
          'date_suppression_vehicule'
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
    const isimmatriculationVehiculeValid = validateString(Vehicle.immatriculation_vehicule ?? "");



    // Validation échouée
    if (!isimmatriculationVehiculeValid) {
      const emailElement = document.getElementById(
        "immatriculation_vehicule"
      ) as HTMLInputElement;
      if (emailElement) {
        emailElement.style.borderColor = isimmatriculationVehiculeValid ? "#ced4da" : "red";
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
            immatriculation_vehicule: Vehicle.immatriculation_vehicule,
            updated_immatriculation_vehicule: Vehicle.immatriculation_vehicule,
            update: 0,
          }),
        });

        if (rescheck.ok) {
          const jsonResponse = await rescheck.json();

          if (jsonResponse.vehicle_count != 0) {
            toast.warn("Vehicle matriculation already exists", {
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
            'date_aquisition_vehicule',
            'date_circulation_vehicule',
            'date_debut_ctr_tech_vehicule',
            'date_fin_ctr_tech_vehicule',
            'date_vignette_vehicule',
            'date_heure_position_vehicule',
            'date_creation_vehicule',
            'date_modification_vehicule',
            'date_suppression_vehicule'
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
        <div className="col-md-6 col-sm-12 text-right">

          <Button
            variant="outline-secondary"
            className="btn mt-2 mr-1"
            onClick={toggleMode}
          >
            <i className={`las ${isAdvancedMode ? 'la-cogs' : 'la-cubes'} mr-3`}></i>
            {isAdvancedMode ? translate('Advanced Mode') : translate(' Simple Mode')}
          </Button>
          <button
            className="btn btn-outline-secondary  mt-2 mr-1"
          //     onClick={() => setShowDownloadModal(true)}
          >
            <i className="las la-download"></i>
            {translate("Export")} {translate("Vehicle")}
          </button>
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
                  <Row className="form">
                    {fields
                      .filter((field) => isAdvancedMode || field.mode !== true) // Afficher uniquement si mode avancé ou toujours visible
                      .map((field) => (
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
                  </Row>
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

