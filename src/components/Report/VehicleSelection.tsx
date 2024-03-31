import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useTranslate } from '../LanguageProvider';
import SelectReport from '../Vehicle/SelectReport';
import DateSelection from './DateSelection';
const backendUrl = process.env.REACT_APP_BACKEND_URL;


interface VehicleSelectionProps {
  selectedVehicles: string[];
  onVehicleSelect: (vehicles: string[]) => void;
}

const VehicleSelection: React.FC<VehicleSelectionProps> = ({ selectedVehicles, onVehicleSelect }) => {

  const { translate } = useTranslate();
  const [inputTypeSearchValue, setTypeSearchValue] = useState<number>(11);
  const [inputTypeSearchLabel, setTypeSearchLabel] = useState<string>(translate("Matriculation"));
  const [inputAdvenceSearch, setinputAdvenceSearch] = useState<string>("Vehicle");
  const [loading, setLoading] = useState(true);
  const id_user = localStorage.getItem("userID");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [suggestions, setSuggestions] = useState([]);
  const [itemsReports, setItemsReports] = useState<{ immatriculation_vehicule: any; id_dispositif: any; }[]>([]);

  const [searchTypeOptions, setsearchTypeOptions] = useState([
    { value: "11", label: "Matriculation" },
    { value: "12", label: "PSN" },
    { value: "13", label: "Vehicle code" },
    { value: "14", label: "Vehicle group" },
    { value: "15", label: "User" },
  ]);




  const searchBy = async (option: any) => {

    console.log(option.value);
    console.log(option.label);

    setinputAdvenceSearch(translate(option.label))
    setTypeSearchLabel(translate(option.label))
    setTypeSearchValue(option.value)

  };
 
  const getAutocomplete = async (search: string) => {

    try {
      if (search.trim() !== "") {
        const res = await fetch(
          `${backendUrl}/api/search/${inputTypeSearchValue}/${search}/${id_user}`,
          { mode: 'cors' }
        );

        const data = await res.json();
        setSuggestions(data.data)
      } else {

        setSuggestions([])

      }

    } catch (error) {
      console.error(error);

    } finally {

    }

  };

  const setItems = async (item: any) => {
    console.log(item.immatriculation_vehicule); 
    console.log(item.id_dispositif);  
  
 
    const newItem = {
      immatriculation_vehicule: item.immatriculation_vehicule,
      id_dispositif: item.id_dispositif
    };
  
  
    const updatedItemsReports = [...itemsReports, newItem];

    setItemsReports(updatedItemsReports);
  };

  const addReportBy = async (type: string) => {

    console.log(type);

    try {
      setLoading(true);

      const res = await fetch(
        `${backendUrl}/api/search/report-for/${type}`,
        { mode: 'cors' }
      );

      const data = await res.json();
      console.log(data["data"][0]["searchfor"]);

      const optionsArray = data["data"][0]["searchfor"].split(',');
      console.log(optionsArray);
      setsearchTypeOptions(optionsArray.map((option: any, index: any) => ({
        value: (index + 11).toString(),
        label: translate(option.trim())
      })
      ));

      setTypeSearchLabel(translate(optionsArray[0]))
      setTypeSearchValue(optionsArray[0].value)
      setinputAdvenceSearch(translate(optionsArray[0]))

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  const checkrTypeSelection = () => {
    // Handle the radio button click event for gen_type_manual
  };

  return (
    <div style={{ background: "#fff" }}>
      <div className="row" style={{ marginBottom: "15px", background: "#fff" }}>
        <div className="col-md-3" style={{ paddingTop: "43px" }}>

          <div className="input-group-addon input-sm" style={{ paddingRight: "15px", paddingTop: "3px" }}>{translate("Add report for")}</div>
          <div>
            <select id="add_report_for" name="add_report_for" onChange={(e) => addReportBy(e.target.value)} className="form-control input-sm">
              <option value="1">{translate("Vehicles")}</option>
              <option value="2">{translate("Fleet")}</option>
              <option value="3">{translate("Drivers")}</option>
            </select>
          </div>

          <div className="input-group" style={{ margin: "20px 0" }}>
            <SelectReport
              controlId="category_vehicule"
              label={translate("Search by") + " type"}
              icon="search"
              options={searchTypeOptions}
              valueType={{
                value: inputTypeSearchValue,
                label: translate(inputTypeSearchLabel),
              }}
              onChange={searchBy}
            />
          </div>

          <div className="input-group-addon input-sm" style={{ paddingRight: "15px", paddingTop: "3px" }}>{translate("Search by")} </div>

          <div>

            <div style={{ position: 'relative' }}>
              <Form.Control
                type="text"
                placeholder={`${translate(inputAdvenceSearch)}`}
                className="me-2"
                aria-label={`${translate(inputAdvenceSearch)}`}
                onChange={(e) => getAutocomplete(e.target.value)}
              />

              <div className="autocomplete-items" style={{ listStyleType: 'none', padding: 0 }}>
                {suggestions && suggestions.map((suggestion: any, index: number) => (
                  <div key={index}   onClick={(e) => setItems(suggestion)}>
                    {suggestion.immatriculation_vehicule} - {suggestion.id_dispositif}
                  </div>
                ))
                }
              </div>

            </div>
          </div>

          <DateSelection
            startDate={startDate}
            onStartDateChange={(date) => setStartDate(date)}
            endDate={endDate}
            onEndDateChange={(date) => setEndDate(date)}
          />

        </div>

        <div className="col-md-9">
          <div className="col-md-12" style={{ margin: "15px 0" }}>
            <span>{translate("Type")}</span>
            <span className="checkbox" style={{ paddingLeft: '10px' }}>
              <input
                type="radio"
                id="gen_type_manual"
                name="gen_type"
                value="manual"
                onClick={(e) => checkrTypeSelection()}
              />
              <label htmlFor="gen_type_manual"></label>
              <span> {translate("Reports")}</span>
            </span>
            <span className="g4n-checkbox" style={{ paddingLeft: '10px' }}>
              <input
                type="radio"
                id="gen_type_auto"
                name="gen_type"
                value="auto"
                onClick={(e) => checkrTypeSelection()}
              />
              <label htmlFor="gen_type_auto"></label>
              <span>{translate("Planning")} </span> 
            </span>
          </div> 
          <div className="" style={{ padding: "5px 5px", border: "1px solid #ccc", borderBottom: "0px" }}>
            <input id="mf_cb" name="alldispositif" type="checkbox" />
            <span id="mf_title" style={{ fontWeight: "bold", }}> <span id="nbrofvehicule">(0)</span> {translate("Vehicles")}</span>
          </div>
          <div className="table-responsive" id="scroll" style={{ border: "1px solid #ccc", background: "#fff", padding: "5px 5px", marginBottom: "15px", overflow: "auto;", display: "block;", height: "333px" }}>
            <ul id="mf_list" style={{ width: "100%;", padding: "0px;", listStyleType: "none" }}>
              {itemsReports && itemsReports.map((itemsReport: any, index: number) => (
                <div key={index}>
                  {itemsReport.immatriculation_vehicule} - {itemsReport.id_dispositif} 
                </div>
              ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelection;


