import { Dropdown, Button } from "react-bootstrap";
import { FaPlus, FaShieldAlt, FaStickyNote, FaWrench } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ButtonCustomHover } from "../ButtonHover"; 
import { useTranslate } from "../../hooks/LanguageProvider";


interface TableHeaderProps {
  title: string;
  totalCount?: number;
  onSearchChange?: (value: string) => void;
  onResetSearch?: () => void;
  searchOptions?: { label: string; value: string }[];
  onSearchTypeChange?: (value: string) => void;
  searchValue?: string;
}

export default function TableHeader({
  title,
  totalCount = 0,
  searchOptions = [],
  onSearchChange,
  onResetSearch,
  onSearchTypeChange,
  searchValue,
}: TableHeaderProps) {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState(
    searchOptions[0]?.value || ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    searchOptions[0]?.label || "Search"
  );


  const { translate } = useTranslate();
  
  return (
    <div
      id="DataTables_Table_0_wrapper"
      className="dataTables_wrapper dt-bootstrap4 no-footer mb-2"
    >
      {/* ===== ROW 1: TITLE ===== */}
      <div className="row mb-1">
        <div className="col-12">
          <h4 className="mb-0 text-nowrap" style={{ color: "#676E8A" }}>
            <i className="las la-car mr-2"></i>
            {translate(title)}{" "}
            {totalCount > 0 && (
              <span style={{ fontWeight: 400 }}>({totalCount})</span>
            )}
          </h4>
        </div>
      </div>

      {/* ===== ROW 2: SEARCH + ICONS SAME LINE ===== */}
      <div className="row align-items-center">
        {/* LEFT: SEARCH */}
        <div className="col-sm-12 col-md-6">
          <div className="input-group">

            {/* Search type dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-basic">
                <i className="fas fa-chevron-down" style={{ fontSize: "16px" }}></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {searchOptions.map((opt) => (
                  <Dropdown.Item
                    key={opt.value}
                    active={selectedType === opt.value}
                    onClick={() => {
                      setSelectedType(opt.value);
                      setSelectedLabel(opt.label);
                      onSearchTypeChange?.(opt.value);
                    }}
                  >
                    {translate(opt.label)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Search input */}
            <input
              type="text"
              placeholder={`${translate("Search by")} ${translate(selectedLabel)}`}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="form-control"
            />

            {/* Reset */}
            <Button variant="secondary" onClick={onResetSearch} className="btn-reset">
              <i className="las la-times" style={{ color: "#fff" }}></i>
            </Button>
          </div>
        </div>

        {/* RIGHT: ICONS MATCH VEHICLES PAGE PERFECTLY */}
        <div className="col-sm-12 col-md-6 d-flex justify-content-end">
          
          <ButtonCustomHover
            text={translate("Vehicles")}
            icon={<i className="las la-car"></i>}
            onClick={() => navigate("/vehicles")}
          />

          <ButtonCustomHover
            text={translate("Add Vehicle")}
            icon={<FaPlus />}
            ClasStyle="bg-success"
            onClick={() => navigate("/vehicle/add")}
          />

          <ButtonCustomHover
            text={translate("Insurance")}
            icon={<FaShieldAlt />}
            onClick={() => navigate("/administratif/insurance")}
          />

          <ButtonCustomHover
            text={translate("Vehicle Sticker")}
            icon={<FaStickyNote />}
            onClick={() => navigate("/administratif/vignette")}
          />

          <ButtonCustomHover
            text={translate("Technical Control")}
            icon={<FaWrench />}
            onClick={() => navigate("/administratif/technical-control")}
          />

        </div>
      </div>
    </div>
  );
}
