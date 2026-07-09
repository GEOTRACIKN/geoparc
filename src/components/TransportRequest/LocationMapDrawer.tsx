import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, ButtonGroup, Form, InputGroup, Offcanvas, Spinner } from "react-bootstrap";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  AddressSuggestion,
  RouteDirectionsResult,
  getRouteDirectionsApi,
  reverseAddressApi,
  searchAddressSuggestionsApi,
} from "../../services/transportRequest.service";

type LocationField = "departure_location" | "arrival_location";
type BaseMapValue =
  | "google_roadmap"
  | "osm"
  | "hot"
  | "dark"
  | "cycle"
  | "google_traffic"
  | "google_satellite"
  | "google_terrain";

type LocationValue = {
  address: string;
  lat: number;
  lon: number;
};

type LocationCoordinates = {
  lat: number;
  lon: number;
};

type Props = {
  translate: (key: string) => string;
  show: boolean;
  departureValue: string;
  arrivalValue: string;
  departureCoordinates?: LocationCoordinates | null;
  arrivalCoordinates?: LocationCoordinates | null;
  initialActiveField: LocationField;
  onHide: () => void;
  onApply: (values: {
    departure_location?: string;
    arrival_location?: string;
    departure_coordinates?: LocationCoordinates;
    arrival_coordinates?: LocationCoordinates;
  }) => void;
};

const DEFAULT_CENTER: [number, number] = [35.6971, -0.6308];
const DEFAULT_BASE_MAP: BaseMapValue = "google_roadmap";

const BASE_MAP_GROUPS: {
  label: string;
  options: { value: BaseMapValue; label: string; url: string }[];
}[] = [
  {
    label: "Google",
    options: [
      {
        value: "google_roadmap",
        label: "Google Roadmap",
        url: "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
      },
      {
        value: "google_traffic",
        label: "Google Traffic",
        url: "https://mt0.google.com/vt?lyrs=h@221097413,traffic&x={x}&y={y}&z={z}",
      },
      {
        value: "google_satellite",
        label: "Google Satellite",
        url: "https://www.google.com/maps/vt?lyrs=s@189&gl=us&x={x}&y={y}&z={z}",
      },
      {
        value: "google_terrain",
        label: "Google Terrain",
        url: "https://www.google.com/maps/vt?lyrs=p@189&gl=us&x={x}&y={y}&z={z}",
      },
    ],
  },
  {
    label: "OpenStreetMap",
    options: [
      {
        value: "osm",
        label: "OpenStreetMap",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      },
      {
        value: "hot",
        label: "Humanitarian",
        url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      },
      {
        value: "cycle",
        label: "Cycle",
        url: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
      },
    ],
  },
  {
    label: "Autres",
    options: [
      {
        value: "dark",
        label: "Dark",
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      },
    ],
  },
];

const BASE_MAP_URLS = BASE_MAP_GROUPS.flatMap((group) => group.options).reduce(
  (urls, option) => ({
    ...urls,
    [option.value]: option.url,
  }),
  {} as Record<BaseMapValue, string>
);

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
  return cleanAddress(value.address);
}

function cleanAddress(value: string) {
  return value
    .replace(/\s*\(-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\)\s*$/, "")
    .trim();
}

function shortAddress(value: string, maxLength = 48) {
  const cleanValue = cleanAddress(value);

  if (cleanValue.length <= maxLength) {
    return cleanValue;
  }

  return `${cleanValue.slice(0, maxLength).trim()}...`;
}

function buildLocationFromText(value: string): LocationValue | null {
  const coordinates = readCoordinates(value);
  if (!coordinates) return null;

  return {
    address: cleanAddress(value),
    lat: coordinates[0],
    lon: coordinates[1],
  };
}

function buildLocationFromValue(
  value: string,
  coordinates?: LocationCoordinates | null
): LocationValue | null {
  if (coordinates) {
    return {
      address: cleanAddress(value),
      lat: coordinates.lat,
      lon: coordinates.lon,
    };
  }

  return buildLocationFromText(value);
}

function MapClickHandler({
  onPick,
}: {
  onPick: (lat: number, lon: number) => void;
}) {
  useMapEvents({
    click: (event) => {
      const target = event.originalEvent.target as HTMLElement | null;

      if (
        target?.closest(".base-map-layer-control") ||
        target?.closest(".location-drawer-search")
      ) {
        return;
      }

      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapResize({
  show,
  center,
  followCenter,
}: {
  show: boolean;
  center: [number, number];
  followCenter: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!show) return;

    const timeoutId = window.setTimeout(() => {
      map.invalidateSize();
      if (followCenter) {
        map.setView(center, Math.max(map.getZoom(), 13));
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [center, followCenter, map, show]);

  return null;
}

function MapRouteBounds({
  show,
  departure,
  arrival,
  routePoints,
  followRoute,
}: {
  show: boolean;
  departure: LocationValue | null;
  arrival: LocationValue | null;
  routePoints: [number, number][];
  followRoute: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!show || !followRoute || !departure || !arrival) return;

    const bounds = L.latLngBounds(
      routePoints.length > 1
        ? routePoints
        : [
            [departure.lat, departure.lon],
            [arrival.lat, arrival.lon],
          ]
    );

    window.setTimeout(() => {
      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 15,
      });
    }, 100);
  }, [arrival, departure, followRoute, map, routePoints, show]);

  return null;
}

function formatDistance(distanceMeters: number) {
  if (!distanceMeters) return "-";

  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

function formatDuration(durationSeconds: number) {
  if (!durationSeconds) return "-";

  const minutes = Math.round(durationSeconds / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
}

function BaseMapLayerControl({
  value,
  onChange,
}: {
  value: BaseMapValue;
  onChange: (value: BaseMapValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const controlRef = useRef<HTMLDivElement | null>(null);

  const stopMapEvent = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    const nativeEvent = event.nativeEvent as Event & {
      stopImmediatePropagation?: () => void;
    };
    nativeEvent.stopImmediatePropagation?.();
  };

  useEffect(() => {
    if (!controlRef.current) return;

    L.DomEvent.disableClickPropagation(controlRef.current);
    L.DomEvent.disableScrollPropagation(controlRef.current);
  }, []);

  const handleChange = (nextValue: BaseMapValue) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div
      ref={controlRef}
      className="base-map-layer-control"
      onPointerDownCapture={stopMapEvent}
      onMouseDownCapture={stopMapEvent}
      onWheelCapture={stopMapEvent}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={BASE_MAP_URLS[value]}
      />

      <button
        type="button"
        className={`base-map-layer-control__button${open ? " base-map-layer-control__button--active" : ""}`}
        aria-label="Changer le fond de carte"
        title="Changer le fond de carte"
        onPointerDown={stopMapEvent}
        onMouseDown={stopMapEvent}
        onMouseUp={stopMapEvent}
        onDoubleClick={stopMapEvent}
        onClick={(event) => {
          stopMapEvent(event);
          setOpen((current) => !current);
        }}
      >
        <i className="fas fa-layer-group"></i>
      </button>

      {open && (
        <div
          className="base-map-layer-control__panel"
          onPointerDown={stopMapEvent}
          onMouseDown={stopMapEvent}
          onMouseUp={stopMapEvent}
          onDoubleClick={stopMapEvent}
          onWheel={stopMapEvent}
          onContextMenu={stopMapEvent}
          onClick={stopMapEvent}
        >
          <div className="base-map-layer-control__title">Fond de carte</div>
          {BASE_MAP_GROUPS.map((group) => (
            <div className="base-map-layer-control__group" key={group.label}>
              <div className="base-map-layer-control__group-title">{group.label}</div>
              {group.options.map((option) => (
                <label
                  key={option.value}
                  className={`base-map-layer-control__option${value === option.value ? " base-map-layer-control__option--active" : ""}`}
                  onPointerDown={stopMapEvent}
                  onMouseDown={stopMapEvent}
                  onClick={stopMapEvent}
                >
                  <input
                    type="radio"
                    name="transport-request-base-map"
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => handleChange(option.value)}
                  />
                  <span className="base-map-layer-control__radio" />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LocationMapDrawer({
  translate,
  show,
  departureValue,
  arrivalValue,
  departureCoordinates,
  arrivalCoordinates,
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
  const [route, setRoute] = useState<RouteDirectionsResult | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [followMap, setFollowMap] = useState(true);
  const [baseMap, setBaseMap] = useState<BaseMapValue>(() => {
    const storedValue = localStorage.getItem("preferred_base_map_transport_request");
    return storedValue && storedValue in BASE_MAP_URLS
      ? (storedValue as BaseMapValue)
      : DEFAULT_BASE_MAP;
  });

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
    setDeparture(buildLocationFromValue(departureValue, departureCoordinates));
    setArrival(buildLocationFromValue(arrivalValue, arrivalCoordinates));
    setRoute(null);
    setRouteError("");
    setFollowMap(true);
    setQuery("");
    setSuggestions([]);
  }, [
    arrivalCoordinates,
    arrivalValue,
    departureCoordinates,
    departureValue,
    initialActiveField,
    show,
  ]);

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

  useEffect(() => {
    if (!show || !departure || !arrival) {
      setRoute(null);
      setRouteError("");
      return;
    }

    const abortController = new AbortController();

    setIsRouting(true);
    setRouteError("");

    getRouteDirectionsApi(departure, arrival, abortController.signal)
      .then((routeResult) => {
        setRoute(routeResult);
      })
      .catch((error: any) => {
        if (error?.name === "AbortError") return;

        setRoute(null);
        setRouteError("Route unavailable");
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsRouting(false);
        }
      });

    return () => abortController.abort();
  }, [arrival, departure, show]);

  const setActiveLocation = (value: LocationValue) => {
    if (activeField === "departure_location") {
      setDeparture(value);
    } else {
      setArrival(value);
    }
  };

  const updateLocation = (
    field: LocationField,
    value: LocationValue,
    syncSearch = false
  ) => {
    if (field === "departure_location") {
      setDeparture(value);
    } else {
      setArrival(value);
    }

    if (syncSearch && field === activeField) {
      setQuery(value.address);
    }
  };

  const selectPoint = async (lat: number, lon: number, fallbackAddress?: string) => {
    setFollowMap(true);
    setIsResolving(true);

    try {
      const result = fallbackAddress
        ? { display_name: fallbackAddress, lat, lon }
        : await reverseAddressApi(lat, lon);

      const nextLocation = {
        address: cleanAddress(result.display_name),
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

  const moveMarker = async (field: LocationField, lat: number, lon: number) => {
    setFollowMap(false);
    setIsResolving(true);

    try {
      const result = await reverseAddressApi(lat, lon);

      updateLocation(
        field,
        {
          address: cleanAddress(result.display_name),
          lat,
          lon,
        },
        true
      );
    } finally {
      setIsResolving(false);
    }
  };

  const applySelection = () => {
    onApply({
      departure_location: departure ? formatLocation(departure) : undefined,
      arrival_location: arrival ? formatLocation(arrival) : undefined,
      departure_coordinates: departure
        ? { lat: departure.lat, lon: departure.lon }
        : undefined,
      arrival_coordinates: arrival ? { lat: arrival.lat, lon: arrival.lon } : undefined,
    });
    onHide();
  };

  const handleBaseMapChange = (nextBaseMap: BaseMapValue) => {
    setBaseMap(nextBaseMap);
    localStorage.setItem("preferred_base_map_transport_request", nextBaseMap);
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" className="location-map-drawer">
      <Offcanvas.Header closeButton className="drawer-header location-map-drawer-header" />
      <Offcanvas.Body className="drawer-body">
        <div className="location-drawer-map">
          <div className="location-drawer-search">
            <ButtonGroup className="location-mode-toggle">
              <Button
              type="button"
              size="sm"
              variant={activeField === "departure_location" ? "primary" : "outline-primary"}
              onClick={() => setActiveField("departure_location")}
            >
                <i className="fas fa-map-marker-alt"></i> {translate("Departure")}
              </Button>
              <Button
              type="button"
              size="sm"
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
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{suggestion.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
            <BaseMapLayerControl value={baseMap} onChange={handleBaseMapChange} />
            <MapResize show={show} center={mapCenter} followCenter={followMap} />
            <MapRouteBounds
              show={show}
              departure={departure}
              arrival={arrival}
              routePoints={route?.coordinates || []}
              followRoute={followMap}
            />
            <MapClickHandler onPick={selectPoint} />
            {route && (
              <Polyline
                positions={route.coordinates}
                pathOptions={{
                  color: "#ff6b35",
                  weight: 6,
                  opacity: 0.9,
                }}
              />
            )}
            {departure && (
              <Marker
                position={[departure.lat, departure.lon]}
                icon={departureIcon}
                draggable
                eventHandlers={{
                  dragend: (event) => {
                    const marker = event.target as L.Marker;
                    const position = marker.getLatLng();
                    moveMarker("departure_location", position.lat, position.lng);
                  },
                }}
              />
            )}
            {arrival && (
              <Marker
                position={[arrival.lat, arrival.lon]}
                icon={arrivalIcon}
                draggable
                eventHandlers={{
                  dragend: (event) => {
                    const marker = event.target as L.Marker;
                    const position = marker.getLatLng();
                    moveMarker("arrival_location", position.lat, position.lng);
                  },
                }}
              />
            )}
          </MapContainer>
        </div>

        <div className="location-drawer-selected route-selection-summary">
          <div>
            <strong>{translate("Departure")}</strong>
            <p title={departure?.address || translate("Click on the map")}>
              {departure ? shortAddress(departure.address) : translate("Click on the map")}
            </p>
            {departure && (
              <small>
                {departure.lat.toFixed(6)}, {departure.lon.toFixed(6)}
              </small>
            )}
          </div>
          <div>
            <strong>{translate("arrival")}</strong>
            <p title={arrival?.address || translate("Click on the map")}>
              {arrival ? shortAddress(arrival.address) : translate("Click on the map")}
            </p>
            {arrival && (
              <small>
                {arrival.lat.toFixed(6)}, {arrival.lon.toFixed(6)}
              </small>
            )}
          </div>
          <div className="route-path-summary">
            <strong>{translate("Shortest path")}</strong>
            {isRouting && (
              <p>
                <Spinner size="sm" /> {translate("loading")}...
              </p>
            )}
            {!isRouting && route && (
              <p>
                {formatDistance(route.distanceMeters)}
                <span>{formatDuration(route.durationSeconds)}</span>
              </p>
            )}
            {!isRouting && !route && (
              <p>{routeError ? translate(routeError) : translate("Select both points")}</p>
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
