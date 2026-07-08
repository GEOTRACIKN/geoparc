import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, InputGroup, Offcanvas, Spinner } from "react-bootstrap";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  AddressSuggestion,
  reverseAddressApi,
  searchAddressSuggestionsApi,
} from "../../services/transportRequest.service";

type LocationValue = {
  address: string;
  lat: number;
  lon: number;
};

type Props = {
  translate: (key: string) => string;
  show: boolean;
  title: string;
  initialValue: string;
  onHide: () => void;
  onApply: (value: string) => void;
};

const markerIcon = new L.Icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER: [number, number] = [35.6971, -0.6308];

function readCoordinates(value: string): [number, number] | null {
  const match = value.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;

  const lat = Number(match[1]);
  const lon = Number(match[2]);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return [lat, lon];
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

function MapResize({ show, center }: { show: boolean; center: [number, number] }) {
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
  title,
  initialValue,
  onHide,
  onApply,
}: Props) {
  const initialCoordinates = useMemo(
    () => readCoordinates(initialValue),
    [initialValue]
  );
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [selected, setSelected] = useState<LocationValue | null>(null);

  const mapCenter: [number, number] = selected
    ? [selected.lat, selected.lon]
    : initialCoordinates || DEFAULT_CENTER;

  useEffect(() => {
    if (!show) return;

    setQuery(initialValue || "");
    setSelected(
      initialCoordinates
        ? {
            address: initialValue,
            lat: initialCoordinates[0],
            lon: initialCoordinates[1],
          }
        : null
    );
    setSuggestions([]);
  }, [initialCoordinates, initialValue, show]);

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

  const selectPoint = async (lat: number, lon: number, fallbackAddress?: string) => {
    setIsResolving(true);

    try {
      const result = fallbackAddress
        ? { display_name: fallbackAddress, lat, lon }
        : await reverseAddressApi(lat, lon);

      setSelected({
        address: result.display_name,
        lat,
        lon,
      });
      setQuery(result.display_name);
      setSuggestions([]);
    } finally {
      setIsResolving(false);
    }
  };

  const applySelection = () => {
    if (!selected) return;

    onApply(
      `${selected.address} (${selected.lat.toFixed(6)}, ${selected.lon.toFixed(6)})`
    );
    onHide();
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" className="location-map-drawer">
      <Offcanvas.Header closeButton className="drawer-header">
        <Offcanvas.Title className="drawer-title">{title}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="drawer-body">
        <div className="location-drawer-search">
          <InputGroup>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              value={query}
              placeholder={translate("Search address or POI")}
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
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapResize show={show} center={mapCenter} />
            <MapClickHandler onPick={selectPoint} />
            {selected && (
              <Marker position={[selected.lat, selected.lon]} icon={markerIcon} />
            )}
          </MapContainer>
        </div>

        <div className="location-drawer-selected">
          <div>
            <strong>{translate("Selected point")}</strong>
            <p>{selected?.address || translate("Click on the map or search a POI")}</p>
            {selected && (
              <small>
                {selected.lat.toFixed(6)}, {selected.lon.toFixed(6)}
              </small>
            )}
          </div>
          <Button
            variant="primary"
            disabled={!selected || isResolving}
            onClick={applySelection}
          >
            {isResolving ? translate("loading") : translate("Use this point")}
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
