import { Button, Dropdown } from "react-bootstrap";
import { FaPlus, FaShieldAlt, FaStickyNote, FaWrench } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface SearchOption {
  label: string;
  value: string | number;
}

interface TableHeaderProps {
  title: string;
  totalCount?: number;
  searchPlaceholder?: string;
  searchOptions?: SearchOption[]; // e.g. [{ label: "Plate", value: 1 }]
  onSearchChange?: (value: string, searchType: string | number) => void;
  onResetSearch?: () => void;
}

export default function TableHeader({
  title,
  totalCount = 0,
  searchPlaceholder = "Search...",
  searchOptions = [],
  onSearchChange,
  onResetSearch,
}: TableHeaderProps) {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<SearchOption>(
    searchOptions[0] || { label: "All", value: "" }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onSearchChange) onSearchChange(val, selectedOption.value);
  };

  const handleSearchOptionSelect = (option: SearchOption) => {
    setSelectedOption(option);
  };

  return (
    <div
      id="DataTables_Table_0_wrapper"
      className="dataTables_wrapper dt-bootstrap4 no-footer mb-3"
    >
      {/* ===== Top row: title + icons ===== */}
      <div className="row align-items-center">
        <div className="col-sm-12 col-md-6">
          <h4 className="mb-3 text-nowrap">
            <i className="las la-car mr-2"></i>
            {title}{" "}
            {totalCount > 0 && (
              <span style={{ fontWeight: 400 }}>({totalCount})</span>
            )}
          </h4>
        </div>

        <div className="col-sm-12 col-md-6 text-right">
          {/* Buttons: same look/behavior as Vehicles.tsx */}
          <button
            className="btn btn-outline-secondary mt-2 mr-1"
            title="Add Vehicle"
            onClick={() => navigate("/vehicle/add")}
          >
            <FaPlus />
          </button>

          <button
            className="btn btn-outline-secondary mt-2 mr-1"
            title="Insurance"
            onClick={() => navigate("/administratif/insurance")}
          >
            <FaShieldAlt />
          </button>

          <button
            className="btn btn-outline-secondary mt-2 mr-1"
            title="Vignette"
            onClick={() => navigate("/administratif/vignette")}
          >
            <FaStickyNote />
          </button>

          <button
            className="btn btn-outline-secondary mt-2 mr-1"
            title="Technical Control"
            onClick={() => navigate("/administratif/technical-control")}
          >
            <FaWrench />
          </button>
        </div>
      </div>

      {/* ===== Search bar row ===== */}
      <div className="row mt-2">
        <div className="col-sm-12 col-md-6">
          <div className="input-group">
            {/* Dropdown for search type */}
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-basic">
                <i className="fas fa-chevron-down" style={{ fontSize: "20" }}></i>
                <span className="ml-2">{selectedOption.label}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {searchOptions.map((option) => (
                  <Dropdown.Item
                    as="button"
                    key={option.value}
                    active={selectedOption.value === option.value}
                    onClick={() => handleSearchOptionSelect(option)}
                  >
                    {option.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Input field */}
            <input
              type="text"
              placeholder={` ${searchPlaceholder}`}
              onChange={handleSearchChange}
              className="form-control"
            />

            {/* Reset button */}
            <Button
              variant="secondary"
              onClick={onResetSearch}
              className="btn-reset"
              title="Reset Search"
            >
              <i className="las la-times" style={{ color: "#fff" }}></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
