import { useState, useEffect, ChangeEvent } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { PropagateLoader } from "react-spinners";
import { renderStateCell, getReportName } from "../utilities/functions";
import Select from 'react-select';
import AsyncSelect from "react-select/async";

const userID = localStorage.getItem("userID");

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface ReportData {
  TIMESTAMP: string;
  GUS: string;
  SOG: number;
  LAT: number;
  LON: number;
  ENGINESTAT: number;
  GSMLVL: number;
  RELAYSTAT: number;
  address?: string; // Optional property to store address
}

export interface SelectOption {
  label: string; // Label affiché
  value: string; // Valeur sélectionnée
}

export function LogPositions() {
// State for pagination
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10); // Assuming 10 items per page, adjust as needed
const [pageCount, setPageCount] = useState(0); // Total pages
const [isLoading, setIsLoading] = useState(false);

// State for total items fetched, to calculate total pages
const [totalItems, setTotalItems] = useState(0);

// State for sorting
const [sortType, setSortType] = useState('defaultSortColumn'); // Adjust default sort column as needed
const [sortDirection, setSortDirection] = useState('asc'); // or 'desc'

   const [inputValue, setInputValue] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  let [pageValue, setSelectedpageValue] = useState(1);
  let [limitValue, setSelectedlimitValue] = useState(15);
  const [list_reports, setListReports] = useState<ReportData[]>([]);

  // ... vos fonctions existantes
 const loadOptions = async (inputValue: any) => {
    if (inputValue.length >= 2) {
      try {
        const res = await fetch(`${backendUrl}/api/LogPositions/${userID}/search/${inputValue}`);
        const data = await res.json();
        return data.map((vehicle: { immatriculation_vehicule: any, PSN: any }) => ({
          label: vehicle.immatriculation_vehicule, // Label à afficher
          value: vehicle.PSN, // Valeur à utiliser
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des immatriculations:", error);
        return [];
      }
    }
  };
  // Fonction pour filtrer les rapports
// Assuming the rest of your component setup remains the same

const filterReports = async () => {

  setIsLoading(true); // Activez l'indicateur de chargement
  setListReports([]); // Réinitialisez la liste des rapports pour vider le tableau avant de charger les nouveaux résultats



  
  try {
    const cleanedVehicleFilter = vehicleFilter.trim();

    const url = `${backendUrl}/api/LogPositions/filter/${cleanedVehicleFilter}/${startDate}/${endDate}/${pageValue}/${limitValue}`;
    const res = await fetch(url, { mode: "cors" });
    const data: ReportData[] = await res.json();

    // Collect Coordinates with an ID
    const locations = data.map((report, index) => ({
      id: index, // Use the index as ID or replace with your unique identifier
      lat: report.LAT,
      lon: report.LON
    }));

    // Batch Reverse Geocode Request with id, lat, and lon
    const geoResponse = await fetch('https://geotrackin.xyz/reverse_geocode.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locations),
    });

    if (!geoResponse.ok) {
      throw new Error(`HTTP error! Status: ${geoResponse.status}`);
    }

    const addresses = await geoResponse.json(); // Assuming the response includes ids

    // Update Reports with Addresses, matching by id
    const updatedReports = data.map((report, index) => {
      const addressInfo = addresses.find((addr: any) => addr.id === index);
      return {
        ...report,
        address: addressInfo?.address || 'Address not found'
      };
    });
    
    if (updatedReports.length === 0) {
      // Aucun rapport trouvé
      setListReports([]);
      alert('Aucun rapport trouvé pour les critères fournis.');
    } else {
      setListReports(updatedReports);

    }  } catch (error) {
    console.error('Error:', error);
    alert('Erreur lors du chargement des positions. Veuillez réessayer.');
  }
  finally {
    setIsLoading(false); // Désactivez l'indicateur de chargement une fois le processus terminé
  }
};



  return (
    <>
      <h4 className="mb-3">{/* ... */}</h4>

      <div>
        {/* Filtres */}
        <div className="row m-2">
          <div className="col">
          <Form.Group controlId="vehicleFilter">
              <Form.Label>Immatriculation du véhicule</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                onInputChange={setInputValue}
                onChange={(selectedOption) => {
                  const option = selectedOption as { label: string; value: string };
                  setVehicleFilter(option.value);
                }}
              />
            </Form.Group>
          </div>
          <div className="col">
            <Form.Group controlId="startDate">
              <Form.Label>Date de début</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="col">
            <Form.Group controlId="endDate">
              <Form.Label>Date de fin</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="col d-flex align-items-end">
            <Button onClick={filterReports}>Filtrer</Button>
          </div>
        </div>
        {isLoading ? (
  <div>Loading...</div> // Remplacez ceci par votre composant de chargement préféré
) : (
  <Table striped bordered hover>
  <thead>
    <tr>
      <th>Date</th>
      <th>GUS</th>
      <th>SOG</th>
      <th>Address</th>

      <th>ENGINESTAT</th>
      <th>GSMLVL</th>
      <th>RELAYSTAT</th>
    </tr>
  </thead>
  <tbody>
{list_reports.map((report, index) => (
<tr key={index}>
<td>{report.TIMESTAMP}</td>
<td>{report.GUS}</td>
<td>{report.SOG}</td>
<td>{report.address}</td>
<td>{report.ENGINESTAT}</td>
<td>{report.GSMLVL}</td>
<td>{report.RELAYSTAT}</td>
</tr>
))}
</tbody>

</Table>)}           


     
      </div>
      <ReactPaginate
  previousLabel={'previous'}
  nextLabel={'next'}
  breakLabel={'...'}
  pageCount={pageCount}
  marginPagesDisplayed={2}
  pageRangeDisplayed={5}
  onPageChange={(event) => setCurrentPage(event.selected + 1)} // ReactPaginate uses 0-indexing for pages
  containerClassName={'pagination'}
  activeClassName={'active'}
/>


    </>
  );
}
