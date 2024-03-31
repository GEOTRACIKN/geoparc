import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import ReportSelection from '../components/Report/ReportSelection';
import DateSelection from '../components/Report/DateSelection';
import VehicleSelection from '../components/Report/VehicleSelection';
import { useTranslate } from '../components/LanguageProvider';
const backendUrl = process.env.REACT_APP_BACKEND_URL;


function CustomTab({ title, stepNumber, isActive, onSelect }: any) {
  const circleStyle = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: isActive ? 'green' : 'gray',
    display: 'inline-block',
    marginRight: '10px',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={onSelect}>
      <div style={circleStyle} />
      <span>{title}</span>
    </div>
  );
}

function NewReport() {
  const [activeTab, setActiveTab] = useState<string>('reportSelection');
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const { translate } = useTranslate();

  useEffect(() => {
    // Mise à jour de selectedReport lorsque selectedReports change
    setSelectedReport(selectedReports.length);
  }, [selectedReports]);

  const handleSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key);
    }
  };

  const handleNext = () => {
    if (activeTab === 'reportSelection') {
      // Logique pour valider l'étape 1 et passer à l'étape 2
      setActiveTab('vehicleSelection');
    } 
  };

  const handlePrev = () => { 
     if (activeTab === 'vehicleSelection') {
      // Revenir de l'étape 3 à l'étape 2
      setActiveTab('reportSelection'); 
    }
  };

  return (
    <div>
       <div className='row'> 
         <div className="col-sm-12 col-md-4">
          <h4 className="mb-3">
            <i className="las la-file-alt" data-rel="bootstrap-tooltip" title="Rapports" ></i>
            {translate("New report")} 
          </h4>
        </div>
      <ul className="steps col-sm-12 col-md-4">
        <li className="step step-success">
          <div className="step-content">
            <span className="step-circle">1</span>
            <span className="step-text">   {translate("Reports")}</span>
          </div>
        </li>
        <li className="step step-active">
          <div className="step-content">
            <span className="step-circle">2</span>
            <span className="step-text"> {translate("Setting")}</span>
          </div>
        </li>
        <li className="step">
          <div className="step-content">
            <span className="step-circle">3</span>
            <span className="step-text">{translate("Assignments")}</span>
          </div>
        </li>
      </ul>
      </div> 
      <Tabs activeKey={activeTab} onSelect={handleSelect} style={{border: "1px solid #ddd", padding: "15px"}} > 
        <Tab eventKey="reportSelection" title={<CustomTab title="Report Selection" stepNumber={1} isActive={activeTab === 'reportSelection'} onSelect={() => handleSelect('reportSelection')} />} >
          <ReportSelection
            selectedReports={selectedReports}
            onReportSelect={(reports) => setSelectedReports(reports)}
          />
        </Tab>
        <Tab eventKey="vehicleSelection" title={<CustomTab title="Vehicle Selection" stepNumber={3} isActive={activeTab === 'vehicleSelection'} onSelect={() => handleSelect('vehicleSelection')} />} >
          <VehicleSelection
            selectedVehicles={selectedVehicles}
            onVehicleSelect={(vehicles) => setSelectedVehicles(vehicles)}
          />
        </Tab>
      </Tabs>

      <div className="wizard-buttons">
        {activeTab !== 'reportSelection' && (
            <a className="btn btn-outline-info" onClick={handlePrev} style={{ textAlign: "center", marginRight:"5px"}}>
               <i className="las la-angle-double-left"></i>
            {translate('Previous')} 
            </a>

        )}
        {activeTab !== 'vehicleSelection' && (
            <a  className={`btn btn-outline-info ${selectedReport==0 ? 'disabled' : ''}`}  onClick={handleNext}  style={{ textAlign: "center"}}> 
              {translate('Next')} 
              <i className="las la-angle-double-right"></i>
            </a>
        )||(
          <a  className={`btn btn-outline-info ${selectedVehicle==0 ? 'disabled' : ''}`} onClick={handleNext}  style={{ textAlign: "center"}}>
            {translate('Create')} 
            <i className="las la-angle-double-right"></i>
          </a>
      )}
      </div>
    </div>
  );
}

export default NewReport;
