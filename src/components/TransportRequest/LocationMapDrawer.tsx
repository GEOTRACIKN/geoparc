import React, { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Form, InputGroup, Offcanvas, Spinner } from "react-bootstrap";
import {
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  AddressSuggestion,
  reverseAddressApi,
  searchAddressSuggestionsApi,
} from "../../services/transportRequest.service";

type LocationField = "departure_location" | "arrival_location";

type LocationValue = {
  address: string;
  lat: number;
  lon: number;
};

type Props = {
  translate: (key: string) => string;
  show: boolean;
  departureValue: string;
  arrivalValue: string;
  initialActiveField: LocationField;
  onHide: () => void;
  onApply: (values: {
    departure_location?: string;
    arrival_location?: string;
  }) => void;
};

const DEFAULT_CENTER: [number, number] = [35.6971, -0.6308];

const departureIcon = L.divIcon({
  className: "",
  html: '<div class="route-marker route-marker-departure">D</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const arrivalIcon = L.divIcon({
  className: "",
  html: '<div class="route-marker route-marker-arrival">A</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function readCoordinates(value: string): [number, number] | null {
  const match = value.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;

  const lat = Number(match[1]);
  const lon = Number(match[2]);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return [lat, lon];
}

function formatLocation(value: LocationValue) {
  return `${value.address} (${value.lat.toFixed(6)}, ${value.lon.toFixed(6)})`;
}

function buildLocationFromText(value: string): LocationValue | null {
  const coordinates = readCoordinates(value);
  if (!coordinates) return null;

  return {
    address: value,
    lat: coordinates[0],
    lon: coordinates[1],
  };
}

function MapClickHandler({
  onPick,
}: {
  onPick: (lat: number, lon: number) => void;
}) {
  useMapEvents({
    click: (event) => {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapResize({
  show,
  center,
}: {
  show: boolean;
  center: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (!show) return;

    const timeoutId = window.setTimeout(() => {
      map.invalidateSize();
      map.setView(center, Math.max(map.getZoom(), 13));
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [center, map, show]);

  return null;
}

export default function LocationMapDrawer({
  translate,
  show,
  departureValue,
  arrivalValue,
  initialActiveField,
  onHide,
  onApply,
}: Props) {
  const [activeField, setActiveField] =
    useState<LocationField>(initialActiveField);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [departure, setDeparture] = useState<LocationValue | null>(null);
  const [arrival, setArrival] = useState<LocationValue | null>(null);

  const activeLocation = activeField === "departure_location" ? departure : arrival;
  const mapCenter: [number, number] = useMemo(() => {
    if (activeLocation) return [activeLocation.lat, activeLocation.lon];
    if (departure) return [departure.lat, departure.lon];
    if (arrival) return [arrival.lat, arrival.lon];
    return DEFAULT_CENTER;
  }, [activeLocation, arrival, departure]);

  useEffect(() => {
    if (!show) return;

    setActiveField(initialActiveField);
    setDeparture(buildLocationFromText(departureValue));
    setArrival(buildLocationFromText(arrivalValue));
    setQuery("");
    setSuggestions([]);
  }, [arrivalValue, departureValue, initialActiveField, show]);

  useEffect(() => {
    const search = query.trim();

    if (!show || search.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);

      try {
        const data = await searchAddressSuggestionsApi(search);
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [query, show]);

  const setActiveLocation = (value: LocationValue) => {
    if (activeField === "departure_location") {
      setDeparture(value);
    } else {
      setArrival(value);
    }
  };

  const selectPoint = async (lat: number, lon: number, fallbackAddress?: string) => {
    setIsResolving(true);

    try {
      const result = fallbackAddress
        ? { display_name: fallbackAddress, lat, lon }
        : await reverseAddressApi(lat, lon);

      const nextLocation = {
        address: result.display_name,
        lat,
        lon,
      };

      setActiveLocation(nextLocation);
      setQuery(result.display_name);
      setSuggestions([]);
    } finally {
      setIsResolving(false);
    }
  };

  const applySelection = () => {
    onApply({
      departure_location: departure ? formatLocation(departure) : undefined,
      arrival_location: arrival ? formatLocation(arrival) : undefined,
    });
    onHide();
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" className="location-map-drawer">
      <Offcanvas.Header closeButton className="drawer-header">
        <Offcanvas.Title className="drawer-title">
          {translate("Select departure and arrival")}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="drawer-body">
        <div className="location-drawer-search">
          <ButtonGroup className="location-mode-toggle">
            <Button
              type="button"
              variant={activeField === "departure_location" ? "primary" : "outline-primary"}
              onClick={() => setActiveField("departure_location")}
            >
              <i className="fas fa-location-dot"></i> {translate("Departure")}
            </Button>
            <Button
              type="button"
              variant={activeField === "arrival_location" ? "primary" : "outline-primary"}
              onClick={() => setActiveField("arrival_location")}
            >
              <i className="fas fa-flag-checkered"></i> {translate("arrival")}
            </Button>
          </ButtonGroup>

          <InputGroup>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              value={query}
              placeholder={translate("Search address")}
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>

          {isSearching && (
            <div className="location-drawer-loading">
              <Spinner size="sm" /> {translate("loading")}...
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="location-drawer-results">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={() => {
                    const lat = Number(suggestion.lat);
                    const lon = Number(suggestion.lon);
                    if (Number.isFinite(lat) && Number.isFinite(lon)) {
                      selectPoint(lat, lon, suggestion.display_name);
                    }
                  }}
                >
                  <i className="fas fa-location-dot"></i>
                  <span>{suggestion.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="location-drawer-map">
          <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Humanitarian">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Topographic">
                <TileLayer
                  attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            <MapResize show={show} center={mapCenter} />
            <MapClickHandler onPick={selectPoint} />
            {departure && (
              <Marker position={[departure.lat, departure.lon]} icon={departureIcon} />
            )}
            {arrival && <Marker position={[arrival.lat, arrival.lon]} icon={arrivalIcon} />}
          </MapContainer>
        </div>

        <div className="location-drawer-selected route-selection-summary">
          <div>
            <strong>{translate("Departure")}</strong>
            <p>{departure?.address || translate("Click on the map")}</p>
            {departure && (
              <small>
                {departure.lat.toFixed(6)}, {departure.lon.toFixed(6)}
              </small>
            )}
          </div>
          <div>
            <strong>{translate("arrival")}</strong>
            <p>{arrival?.address || translate("Click on the map")}</p>
            {arrival && (
              <small>
                {arrival.lat.toFixed(6)}, {arrival.lon.toFixed(6)}
              </small>
            )}
          </div>
          <Button
            variant="primary"
            disabled={isResolving || (!departure && !arrival)}
            onClick={applySelection}
          >
            {isResolving ? translate("loading") : translate("Use selected points")}
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
