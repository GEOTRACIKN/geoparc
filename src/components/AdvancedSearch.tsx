import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaTimes } from "react-icons/fa"; // Import de l'icône X

interface Props {
    searchOptions: string[];
    onSearch: (term: string, type: string) => void;
    clearSearchTerm: () => void;
    placeholderText: string;
}

const AdvancedSearch: React.FC<Props> = ({ searchOptions, onSearch, clearSearchTerm, placeholderText }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState(searchOptions[0]);

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        onSearch(term, searchType);
    };

    const handleSearchTypeChange = (type: string) => {
        setSearchType(type);
        onSearch(searchTerm, type);
    };

    const handleClearSearchTerm = () => {
        setSearchTerm("");
        clearSearchTerm();
    };

    return (
        <div>
            <div className="input-group">
                <Dropdown onSelect={(e) => handleSearchTypeChange(e as string)}>
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {searchOptions.map((option) => (
                            <Dropdown.Item key={option} eventKey={option}>
                                {option}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder={placeholderText}
                    className="form-control"
                />
                {searchTerm && (
                    <button className="btn btn-light" onClick={handleClearSearchTerm}>
                        <FaTimes />
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdvancedSearch;
