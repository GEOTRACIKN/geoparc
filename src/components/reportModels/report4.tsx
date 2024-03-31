import Linecharts, { ChartData } from "../Charts/Linecharts";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getReportName } from "../../utilities/functions";
import { useTranslate } from "../../components/LanguageProvider";
import ExcelJS, { Style } from "exceljs";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface Report4Props {
  type_report?: string;
  turn?: string;
  id_report?: string;
}

const Report4: React.FC<Report4Props> = ({ type_report, turn, id_report }) => {
  const [reportData, setReportData] = useState<any>({});
  const { translate } = useTranslate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/Rapport4/${id_report}`);
        const data = await response.json();

        console.log("Données récupérées de l'API :", data);

        setReportData(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données API :",
          error
        );
        setReportData({
          success: false,
          message: "Erreur lors de la récupération des données API.",
        });
      }
    };

    fetchData();
  }, [type_report, turn, id_report]);

  const apiData = reportData.data || [];

  let prevCumulativeDistance: number | null = null; // spécifier le type comme number | null
  let cumulativeSum = 0;

  // calcule distance

  const lineChartResult = apiData.map((item: any) => {
    if (prevCumulativeDistance === null) {
      prevCumulativeDistance = item.distance; // Convertir en kilomètres
    }

    const difference = item.distance - (prevCumulativeDistance || 0);
    cumulativeSum += difference;
    prevCumulativeDistance = item.distance;

    return {
      ...item,
      cumulativeDifference: cumulativeSum,
    };
  });

  const transformedSOGData = apiData.map((item: any) => [
    new Date(item.datetime).getTime(),
    item.SOG,
  ]);

  const transformedEngineStatData = apiData.map((item: any) => [
    new Date(item.datetime).getTime(),
    item.ENGINESTAT,
  ]);

  const sampleData: ChartData = {
    chartTitle: translate("Diagramme de distance, vitesse et contact"),
    chartTitleAlign: "center",
    enabledLegend: true,
    height: 800,
    series: [
      {
        name: translate("Vitesse"),
        unit: " km/h",
        description: translate("Vitesse"),
        data: transformedSOGData,
        color: "#41b346",
        type: "spline",
        yAxisState: true,
        labels: {
          format: "{value}",
          style: {
            color: "#41b346",
          },
        },
      },
      {
        name: translate("Engine Stat"),
        unit: "",
        description: translate("Engine Stat"),
        data: transformedEngineStatData,
        color: "#EB1D36",
        type: "spline",
        yAxis: 1,
        yAxisState: true,
        labels: {
          format: "{value}",
          style: {
            color: "#EB1D36",
          },
        },
      },

      {
        name: translate("Distance"),
        unit: " km",
        description: translate("Distance"),
        data: lineChartResult.map((item: any) => [
          new Date(item.datetime).getTime(),
          item.cumulativeDifference,
        ]),
        color: "#0080FF",
        type: "spline",
        yAxisState: true,
        labels: {
          format: "{value}",
          style: {
            color: "#0080FF",
          },
        },
      },
    ],
  };

  

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      "Diagramme de distance, vitesse et contact"
    );

    // Add the title row with uppercase and bold style, spanning three columns
    const titleRow = worksheet.addRow([
      "",
      "Diagramme de distance, vitesse et contact:",
      "",
    ]);
    titleRow.getCell(2).font = { bold: true, size: 14, name: "Arial" }; // Set font to bold for the middle cell (B1)
    titleRow.getCell(2).alignment = {
      vertical: "middle",
      horizontal: "center",
    }; // Align text in the middle for the middle cell (B1)
    titleRow.eachCell((cell) => {
      cell.font = { bold: true, size: 14, name: "Arial" }; // Set font to bold for all cells
      cell.alignment = { vertical: "middle", horizontal: "center" }; // Align text in the middle for all cells
      if (typeof cell.value === "string") {
        cell.value = cell.value.toUpperCase(); // Convert text to uppercase if it's a string
      }
    });

    // Add the "Creation Date" row
    const creationDateRow = worksheet.addRow([
      "Creation Date:",
      new Date(reportData.moreInfo?.date_creation).toLocaleString(),
    ]);
    creationDateRow.eachCell((cell) => {
      cell.font = { color: { argb: "0000FF" } }; // Set font color to blue
    });

    // Add the "Immatriculation Véhicule" and "Turn Report" row
    const vehicleImmatriculationRow = worksheet.addRow([
      "Immatriculation Véhicule:",
      reportData.moreInfo?.immatriculation_vehicule || "N/A",
      "Turn Report:",
      reportData.moreInfo?.turn_report || "N/A",
    ]);
    vehicleImmatriculationRow.eachCell((cell) => {
      cell.font = { color: { argb: "0000FF" } }; // Set font color to blue
    });
    // Merge cells for the title
    worksheet.mergeCells("A5:H5");

    const headerStyle: Partial<Style> = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCCCCCC" },
      },
      font: {
        bold: true,
        size: 10, // Adjust font size as needed
        name: "Arial", // Specify the font family
        underline: false,
        italic: false,
        vertAlign: undefined, // or remove this line if you don't need it
        outline: false,
        strike: false,
        color: { argb: "FFFFFFFF" }, // remove one of the duplicate properties
      },
    };

    worksheet.addRow([
      "Date/Time Start",
      "Date/Time End",
      "Start Distance",
      "End Distance",
      "Difference",
      "Average Speed (km/h)",
      "Max Speed (km/h)",
      "Speed Status",
    ]);
    worksheet.getRow(6).eachCell({ includeEmpty: true }, (cell) => {
      cell.style = headerStyle;
    });
    // Add data row from reportData to worksheet
    const row = worksheet.addRow([
      new Date(reportData.moreInfo?.date_debut).toLocaleString(),
      new Date(reportData.moreInfo?.date_fin).toLocaleString(),
      apiData.length > 0 ? `${apiData[0].distance} KM ` : "No Data",
      apiData.length > 0
        ? `${apiData[apiData.length - 1].distance} KM `
        : "No Data",
      apiData.length > 0
        ? `${apiData[apiData.length - 1].distance - apiData[0].distance} KM`
        : "No Data",
      reportData.additionalData?.average_speed.toFixed(2),
      reportData.additionalData?.max_speed.toFixed(2),
      reportData.additionalData?.max_speed > 90
        ? "Excess Speed"
        : "No Excess Speed",
    ]);

    // Set text color based on condition (red for "Excess Speed", green otherwise)
    const speedStatusCell = row.getCell(8); // Assuming "Speed Status" is the 8th column
    speedStatusCell.font = {
      color: {
        argb:
          reportData.additionalData?.max_speed > 90 ? "FFFF0000" : "FF00FF00",
      },
    };

    // Auto adjust column widths to fit the content
    worksheet.columns.forEach((column) => {
      column.width = Math.max(column.width ?? 0, 30); // Use 0 as the default width if column.width is undefined
    });



    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    // Get the current date for the filename
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split("T")[0]; // Get the date part of the ISO string

    // Update the filename to include the creation date
    const fileName = `Diagramme de distance, vitesse et contact_${dateString}.xlsx`;
    // Create download link and click it to trigger download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const renderMaxSpeedStatus = () => {
    if (reportData.additionalData?.max_speed > 90) {
      return (
        <>
          <i className="las la-tachometer-alt" style={{ color: "red" }}></i>
          <span style={{ color: "red" }}> {translate("Excès de vitesse")}</span>
        </>
      );
    } else {
      return (
        <>
          <i className="las la-tachometer-alt" style={{ color: "green" }}></i>
          <span style={{ color: "green" }}>
            {" "}
            {translate("Pas d'excès de vitesse")}
          </span>
        </>
      );
    }
  };

  return (
    <>
      <h5>
        <p>
          {" "}
          {translate("Date de création")}:
          <br />
          {new Date(reportData.moreInfo?.date_creation).toLocaleString()}
        </p>
        <i
          className="las la-chart-bar"
          data-rel="bootstrap-tooltip"
          title="Increased"
        ></i>{" "}
        {translate("Rapport Du")}:{" "}
        {new Date(reportData.moreInfo?.date_debut).toLocaleString()}{" "}
        {translate("Au")}:{" "}
        {new Date(reportData.moreInfo?.date_fin).toLocaleString()}
      </h5>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h5>
          {[
            `[${reportData.moreInfo?.type_report}] ${getReportName(
              reportData.moreInfo?.type_report,
              translate
            )}`,
          ]}
        </h5>
        <button className="btn btn-outline-info" onClick={exportToExcel}>
          <i className="las la-file-alt mr-3"></i>
          {translate("Generate rapport CSV")}
        </button>
      </div>

      <Table>
        <thead className="bg-white text-uppercase">
          <tr className="ligth ligth-data">
            <th
              colSpan={8}
              style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}
            >
              {translate("Immatriculation du véhicule")} :{" "}
              {reportData.moreInfo?.immatriculation_vehicule || "N/A"},{" "}
              {translate("Turn Report")}:{" "}
              {reportData.moreInfo?.turn_report || "N/A"}
            </th>
          </tr>
          <tr className="ligth">
            <th>{translate("Date/Heure")}</th>
            <th>{translate("Distance")}</th>
            <th>{translate("Vitesse")}</th>
          </tr>
        </thead>

        <tbody key="Report" className="ligth">
          <tr>
            <td>
              {translate("Dete debut")}:{" "}
              {new Date(reportData.moreInfo?.date_debut).toLocaleString()}
              <br />
              {translate("Date fin")}:{" "}
              {new Date(reportData.moreInfo?.date_fin).toLocaleString()}
            </td>
            <td>
              {apiData.length > 0 ? `${apiData[0].distance} KM ` : "No Data"}
              <br />
              {apiData.length > 0
                ? `${apiData[apiData.length - 1].distance} KM `
                : "No Data"}
              <br />
              {translate("Différence")}:{" "}
              {apiData.length > 0
                ? `${
                    apiData[apiData.length - 1].distance - apiData[0].distance
                  } KM `
                : "No Data"}
            </td>
            <td>
              {translate("Avg")}:{" "}
              {reportData.additionalData?.average_speed.toFixed(2)} km/h
              <br />
              {translate("Max")}:{" "}
              {reportData.additionalData?.max_speed.toFixed(2)} km/h
              <br />
              {renderMaxSpeedStatus()}
            </td>
          </tr>
        </tbody>
      </Table>

      {/* Ajoutez le reste de votre code, comme le graphique */}
      <div style={{ minHeight: "300px", border: "1px solid #000" }}>
        <Linecharts {...sampleData} />
      </div>
    </>
  );
};

export default Report4;
