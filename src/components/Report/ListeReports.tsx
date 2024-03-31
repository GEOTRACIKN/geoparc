// ListeReports.tsx

import React, { useState } from 'react';
import { Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useTranslate } from '../LanguageProvider';


interface ListProps {
  selectedReports: number[];
  onReportsChange: (selectedReports: number[]) => void;
}





function ListeReports({ selectedReports, onReportsChange }: ListProps) {

  const { translate } = useTranslate();

  const reportsData: { [key: number]: string } = {
    1: translate("Itinerary reconstitution"),
    2: translate("Proximity report"),
    3: translate("Alarms"),
    4: translate("Diagram of distance, speed and contact"),
    5: translate("Fuel Tank (IO) Diagram"),
    6: translate("Diagram of GSM and GPS signal"),
    7: translate("Engine diagram"),
    8: translate("CAN Distance and Consumption Diagram"),
    10: translate("Contact Report"),
    11: translate("[CAN] RPM statistics"),
    12: translate("[CAN] Speed statistics"),
    13: translate("Speed statistics"),
    14: translate("Gantt chart on proximity"),
    15: translate("Gantt chart on contact"),
    16: translate("System state diagram"),
    17: translate("Mobile traffic"),
    18: translate("Fuel tank diagram"),
    19: translate("[RHT] Temperature diagram"),
    20: translate("[FFS] Distance and consumption diagram"),
    21: translate("[TCO] Tachograph diagrams"),
    25: translate("Speeding violation report"),
    26: translate("[QHSE] QHSE"),
    27: translate("Driver behavior report"),
    29: translate("Work amplitude report"),
    30: translate("Fleet report"),
    31: translate("Fleet report [CAN]"),
    33: translate("HOS Hour of Service (PSN)"),
    34: translate("Trip report"),
    45: translate("Rapport CO2/Kg") 
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [isGridView, setIsGridView] = useState(true);

  const handleCheckboxChange = (reportNumber: number) => {
    const updatedSelection = selectedReports.includes(reportNumber)
      ? selectedReports.filter((selected) => selected !== reportNumber)
      : [...selectedReports, reportNumber];

    onReportsChange(updatedSelection);
  };

  const handleSelectAll = () => {
    const allReportNumbers = Object.keys(reportsData).map(Number);
    const updatedSelection = selectedReports.length === allReportNumbers.length
      ? []  // Désélectionner tous si tous sont déjà sélectionnés
      : allReportNumbers;

    onReportsChange(updatedSelection);
  };

  const reportsArray = Object.values(reportsData);
  const filteredReports = Object.keys(reportsData).filter((reportNumber) =>
    reportsData[Number(reportNumber)].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div style={{padding: "15px 15px", backgroundColor: "#fff"}} >
      <Row className="mt-3">
        <Col xs={4}>
        <InputGroup>   
          <FormControl
            type="text"
            placeholder={translate("Search for a report")} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="las la-search" style={{fontSize: "21px",padding: "7px 7px",border: "1px solid #ddd"}}  ></i>
        </InputGroup>
        </Col>
        <Col xs={8} className="text-right"> 
        <Button  onClick={() => setIsGridView(!isGridView)}  style={{background: "no-repeat", color: "#000", border: "1px solid #ddd"}}   className={` ${isGridView ? 'active' : ''}`} >
          {isGridView ? (
            <>
              <i className="las la-icons" style={{fontSize: "21px"}} ></i>
              <span>{translate("Grid View")}</span>
            </>
          ) : ( 
            <>
              <i className="las la-list" style={{fontSize: "21px"}} ></i>
              <span> {translate("List view")}</span> 
            </>
          )}
        </Button>

        </Col>
      </Row>

      <div style={{padding: "5px 0px", borderBottom: "0px"}}>
        <input
          id="reports_cb"
          name="allRep"
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedReports.length === Object.keys(reportsData).length}
        />
        <label htmlFor="reports_cb"></label>
        <strong> {translate("Reports")} </strong> 
      </div>

      {isGridView ? (
        <Row style={{padding: "15px 0" , overflowY: "scroll", height: "61vh"}}>
          {filteredReports
            .filter((reportNumber) =>
              reportsData[Number(reportNumber)]
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((reportNumber) => (
              <Col style={{padding: "15px 15px 15px 0px"}}   key={reportNumber}   xs={12} sm={6} md={3} lg={3} >
                <div  className={`grid-item${   selectedReports.includes(Number(reportNumber)) ? ' selected-grid-item' : '' }`}   onClick={() => handleCheckboxChange(Number(reportNumber))}
                  style={{
                    border: '1px solid #DDD',
                    borderRadius: '5px',
                    padding: '10px',
                    cursor: 'pointer',
                  }}
                >
                      
                  <i className={`las la-${reportsData[Number(reportNumber)]}`} style={{fontSize: "28px"}}></i>
                  <img src={`asset/images/icon-report/${reportNumber}.png`} style={{width: "32px", marginRight: "5px"}}/>
                  {reportsData[Number(reportNumber)]}
                </div>
              </Col>
            ))}
        </Row>
      ) : (
        <div className="list-container">
          {filteredReports
            .filter((reportNumber) =>
              reportsData[Number(reportNumber)]
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((reportNumber) => (
              <div
                key={reportNumber}
                className={`list-item${
                  selectedReports.includes(Number(reportNumber)) ? ' selected' : ''
                }`}
                onClick={() => handleCheckboxChange(Number(reportNumber))}
                style={{ cursor: 'pointer', paddingBottom: "5px" }}
              >
                <input
                  type="checkbox"
                  value={reportNumber}
                  checked={selectedReports.includes(Number(reportNumber))}
                  onChange={() => handleCheckboxChange(Number(reportNumber))}
                  style={{marginRight: "5px"}}
                />
                { reportsData[Number(reportNumber)]}
              </div>
            ))}
        </div>
      )}
    </div>

  );
}

export default ListeReports;

export {};
