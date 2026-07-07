import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useTheme } from "../../hooks/ThemeContext";
import {
  AddressSuggestion,
  searchAddressSuggestionsApi,
} from "../../services/transportRequest.service";

type Props = {
  translate: (key: string) => string;
  controlId: string;
  label: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
};

type AddressOption = {
  label: string;
  value: string;
};

export default function AddressAutocompleteInput({
  translate,
  controlId,
  label,
  placeholder,
  required = false,
  value,
  onChange,
}: Props) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const search = inputValue.trim();

    if (search.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const results = await searchAddressSuggestionsApi(search);
        setSuggestions(results);
      } catch (error) {
        setSuggestions([]);
        console.error("Address autocomplete error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [inputValue]);

  const options: AddressOption[] = suggestions.map((suggestion) => ({
    label: suggestion.display_name,
    value: suggestion.display_name,
  }));

  const selectedOption = value
    ? {
        label: value,
        value,
      }
    : null;
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: 52,
      backgroundColor: isDarkMode ? "#34393b" : "#ffffff",
      borderColor: state.isFocused ? "#ff8a00" : isDarkMode ? "#5b6470" : "#d7dee8",
      boxShadow: "none",
      color: isDarkMode ? "#f8fafc" : "#1f2937",
    }),
    input: (base: any) => ({
      ...base,
      color: isDarkMode ? "#f8fafc" : "#1f2937",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDarkMode ? "#f8fafc" : "#1f2937",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: isDarkMode ? "#9aa4b2" : "#6b7280",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDarkMode ? "#2b3033" : "#ffffff",
      color: isDarkMode ? "#f8fafc" : "#1f2937",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused
        ? isDarkMode
          ? "#3f474d"
          : "#fff4e8"
        : isDarkMode
          ? "#2b3033"
          : "#ffffff",
      color: isDarkMode ? "#f8fafc" : "#1f2937",
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <Form.Group className="form-group mb-0" controlId={controlId}>
      <Form.Label>
        {label}
        {required ? " *" : ""}
      </Form.Label>
      <CreatableSelect<AddressOption, false>
        inputId={controlId}
        formatCreateLabel={(input) => input}
        inputValue={inputValue}
        isClearable
        isLoading={isLoading}
        isSearchable
        menuPortalTarget={document.body}
        noOptionsMessage={() => translate("No address found")}
        options={options}
        placeholder={placeholder}
        value={selectedOption}
        onChange={(option: SingleValue<AddressOption>) => {
          const nextValue = option?.value || "";
          setInputValue(nextValue);
          onChange(nextValue);
          setSuggestions([]);
        }}
        onInputChange={(inputValue, actionMeta) => {
          if (actionMeta.action === "input-change") {
            setInputValue(inputValue);
            onChange(inputValue);
          }

          return inputValue;
        }}
        styles={selectStyles}
      />
    </Form.Group>
  );
}
