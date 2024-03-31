import  { useState, useLayoutEffect,useEffect } from "react";
import { Table } from "react-bootstrap";
import { useTranslate } from "../../components/LanguageProvider";
import { PropagateLoader } from 'react-spinners';
import { format, parseISO } from "date-fns";
import * as XLSX from 'xlsx';
import { getAdressesFromData } from "../../utilities/functions";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
interface VehicleWidgetProps {
  type_report?: string;
  turn?: string;
  id_report?: string;
}
interface ReportData {
  eventKey: string;
  DriverTag: string;
  DriverName: string;
  EventLevel: string;
  max_speed: number;
  duration: number;
  start: string;
  LAT: number;
  LNG: number;
  address?: string;
}
interface ReportType {
  id: number;
  LAT: number;
  LNG: number;
}

interface Immatriculation {
    immatriculation_vehicule: string;
    nom_groupe: string;
}

interface ReportState {

  data: any[] | null;
  loading: boolean;
  error: string | null;
}

const initialReportState: ReportState = {

  data: null,
  loading: false,
  error: null,
};



const Report25: React.FC<VehicleWidgetProps> = ({ id_report,turn }) => {
  const { translate } = useTranslate();
  const [immatriculation, setImmatriculation] = useState<Immatriculation>();

  const [reportState, setReportState] = useState<ReportState>(initialReportState);
    // Organiser les données par date
  // const organizedDataByDate: { [date: string]: ReportData[] } = {};
  const [organizedDataByDate, setOrganizedDataByDate] = useState<{ [date: string]: ReportData[] }>({});

  let startDate: string | null = null;
  let endDate: string | null = null;

  // Get the first and last dates from the data
  if (reportState.data && reportState.data.length > 0) {
    startDate = new Date(reportState.data[0].start).toLocaleString();
    endDate = new Date(reportState.data[reportState.data.length - 1].start).toLocaleString();
  }

  // Organiset les données par tableux en fonction de la date
  useEffect(() => {
    if (reportState.data) {
      const organizedData: { [date: string]: ReportData[] } = {};
      reportState.data.forEach((report) => {
        const formattedDate = format(parseISO(report.start), 'yyyy-MM-dd');
        if (!organizedData[formattedDate]) {
          organizedData[formattedDate] = [];
        }
        organizedData[formattedDate].push(report);
      });
      setOrganizedDataByDate(organizedData);
    }
    // console.log("organizedDataByDate", organizedDataByDate);
    
  }, [reportState.data]);
  
  // console.log(organizedDataByDate);
  

  let nom_groupe = immatriculation?.nom_groupe;
  const getDatas = async () => {
    try {
      setReportState({ ...reportState, loading: true });
  
      const response = await fetch(
        `${backendUrl}/api/report25/${id_report}`,
        { mode: 'cors' }
      );
  
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des données de rapport. Statut : ${response.status}`
        );
      }
  
      const responseData = await response.json();
  
      const updateData = await getAdressesFromData(responseData.repportDatas);
      // Extract immatriculation from the response
      setImmatriculation(responseData.immatriculation);
  
      nom_groupe = responseData.immatriculation.nom_groupe; 
      
      setReportState({
        ...reportState,
        data: updateData,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error(error);
  
      setReportState({
        ...reportState,
        loading: false,
        error: 'Erreur lors de la récupération des données de rapport',
      });
    }
  };

  useLayoutEffect(() => {
    getDatas();
  }, []);

  const handleDownloadExcel = () => {
    /**
     * Génère un fichier Excel contenant les données du rapport de violation de vitesse,
     * séparées par date.
     *
     * Pour chaque date, crée une feuille Excel avec :
     * - Un en-tête contenant le titre du rapport et la période
     * - Un en-tête contenant les noms des colonnes
     * - Les données du rapport pour cette date
     *
     * Utilise la bibliothèque XLSX pour générer le fichier Excel.
     */
    // Crée un nouveau livre Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
    // Boucle sur les données organisées par date
    Object.keys(organizedDataByDate).forEach((date) => {
      // Récupère les données pour cette date
      const wsData = organizedDataByDate[date];
  
      // Ajoute la première ligne d'en-tête
      // Contient le titre du rapport et la période
      const firstHeaderRow = [
        [""],
        [`${translate("Speeding violation report")}`],
        [`${translate('From')} : ${startDate}`],
        [`${translate('To')} : ${endDate}`],
      ];
  
      // Ajoute la deuxième ligne d'en-tête
      // Contient les noms des colonnes
      const secondHeaderRow = [
        translate("Event Key"),
        translate("DriverTag"),
        translate("Driver Name"),
        translate("Event Level"),
        translate("Maximum Speed"),
        translate("Heure"),
        translate("Speeding violation duration"),
        `${translate("LAT")}`,
        `${translate("LNG")}`,
        translate("Places of effect"),
      ];
  
      // Ajoute une nouvelle ligne après les en-têtes
      const reportDateRow = [
        "",
        `${translate(`report ${id_report} for`)} : `,
        `${date}`,
        "",
      ];
      const newDataRow = [
        "",
      ];
      const newDataRow_START = [
        "",
        `${translate('Start')} :`,
        `${organizedDataByDate[date][0] && `${format(
          parseISO(organizedDataByDate[date][0].start),
          "yyyy-MM-dd HH:mm:ss"
        )}`}`,
        `${translate('Start of the day')}`,
        
      ];
      const newDataRow_END = [
        "",
        `${translate('End')} :`,
        `${organizedDataByDate[date][organizedDataByDate[date].length - 1] &&
          `${format(
            parseISO(organizedDataByDate[date][organizedDataByDate[date].length - 1].start),
            "yyyy-MM-dd HH:mm:ss"
            )}`}`,
            `${translate('End of the report')}`,
        
      ];
  
      // Construit les données avec les en-têtes et la nouvelle ligne
      const dataWithSecondHeaderAndNewRow = [
        firstHeaderRow,
        reportDateRow,
        newDataRow,
        secondHeaderRow,
        newDataRow,
        newDataRow_START, // Ajoute la nouvelle ligne ici
        ...wsData.map((item) => Object.values(item)),
        newDataRow_END,
      ];
  
      // Crée une feuille avec les données et en-têtes
      const ws = XLSX.utils.aoa_to_sheet(dataWithSecondHeaderAndNewRow);
  
      // Ajoute la feuille au livre
      XLSX.utils.book_append_sheet(wb, ws, date);
    });
  
    // Génère le fichier Excel
    XLSX.writeFile(
      wb,
      `Speeding violation report ${id_report} ${turn} ${new Date().toLocaleString()}.xlsx`
    );
  };

  return (
    <>
      {reportState.loading && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <div style={{ margin: "auto", padding: "10px" }}>
            <PropagateLoader
              color={"#123abc"}
              loading={reportState.loading}
              size={20}
            />
          </div>
        </div>
        )}
        {reportState.error && <p>Error: {reportState.error}</p>}
      <div className="d-flex justify-content-between align-items-center">
      <h6 className="col-sm-6 col-md-6">
        <i className="las la-chart-bar" data-rel="bootstrap-tooltip" title="Increased"></i> {translate("Speeding violation report")} {translate('From')} {' '}
        <span style={{ color: '#3468C0' }}>{startDate}</span> {translate('To')} {' '}
        <span style={{ color: '#3468C0' }}>{endDate}</span>
      </h6>
        

      <div className="col-sm-6 col-md-6 " style={{ padding: '10px' }} >
        <div id="DataTables_Table_0_filter" className="float-right dataTables_filter mr-3">
          <button className="btn btn-outline-info mt-2" onClick={handleDownloadExcel}>
            <i className="las la-file-excel"></i> 
            {translate('Download Excel')}
          </button> 
        </div>
      </div>
      </div>


      <div>
        {organizedDataByDate && Object.keys(organizedDataByDate).map((date, dateIndex) => (
          <div key={dateIndex} className="row m-2">
            <Table className="table table-bordered table-striped" style={{ width: "100%" }}>
              <thead className="bg-white text-uppercase">
                <tr className="ligth ligth-data">
                  <th colSpan={7} className="text-left">{translate('Tour Number')}: {turn} / {translate('Vehicle')}: {immatriculation?.immatriculation_vehicule}</th>
                  <th colSpan={3} className="mx-auto p-2 text-right"> {translate("Report for")} {" "} {date}</th>
                </tr>
        
                <tr className="ligth ligth-data">
                  <th className="text-center">{translate("Date & Heure")}</th>
                  <th>{translate("Event Key")}</th>
                  <th>{translate("DriverTag")}</th>
                  <th>{translate("Places of effect")}</th>
                  <th className="text-center">{translate("Driver Name")}</th>
                  <th>{translate("Event Level")}</th>
                  <th className="text-center">{translate("Maximum Speed")}</th>
                  <th className="text-center">{translate("Speeding violation duration")}</th>
                </tr>
                  <tr >
                    <th style={{fontSize:'14px',color:'#110a57'}}  colSpan={10} className="text-left">{organizedDataByDate[date][0] && `${translate('Start')}: ${format(
                          parseISO(organizedDataByDate[date][0].start),
                          "yyyy-MM-dd HH:mm:ss"
                        )} `} {'- '} {translate('Start of the day')}
                    </th>
                  </tr>
              </thead>
              <tbody className="ligth-body">
                {organizedDataByDate[date].map((report, index) => (
                  <tr key={index} className={`checkbox-${index}`}>
                    <td className="text-center">{report.duration}</td>
                    <td>{report.eventKey}</td>
                    <td>{report.DriverTag}</td>
                    <td>{report.address}</td>
                    <td className="text-center">{nom_groupe}</td>
                    <td>{report.EventLevel}</td>
                    <td className="text-center">{report.max_speed}</td>
                    <td className="text-center">{report.start}</td>
                  
                  </tr>
                ))}
                <tr className="ligth ligth-data">
                    <th colSpan={10} className="text-left" style={{fontSize:'14px',color:'#110a57'}}>
                      {organizedDataByDate[date][organizedDataByDate[date].length - 1] &&
                        `${translate('End')}: ${format(
                          parseISO(organizedDataByDate[date][organizedDataByDate[date].length - 1].start),
                          "yyyy-MM-dd HH:mm:ss"
                        )} ` 
                      } {'- '} {translate('End of the report')}
                    </th>
                  </tr>
              </tbody>
            </Table>
          </div>
        ))}
      </div>
    </>
  );

  }


  export default Report25;