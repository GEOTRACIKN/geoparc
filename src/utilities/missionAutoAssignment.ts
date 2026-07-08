export const DEFAULT_MAX_DEPARTURE_DISTANCE_KM = 20;

export interface AutoAssignmentVehicle {
  id_vehicule: number | string;
  immatriculation_vehicule?: string | null;
  id_conducteur_vehicule?: number | string | null;
  driver_first_name?: string | null;
  driver_last_name?: string | null;
  nom_conducteur?: string | null;
  prenom_conducteur?: string | null;
  LAT?: string | number | null;
  LON?: string | number | null;
  lat?: string | number | null;
  lon?: string | number | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  latitude_vehicule?: string | number | null;
  longitude_vehicule?: string | number | null;
}

export interface AutoAssignmentVehiclePosition {
  id_vehicule: number | string;
  LAT?: string | number | null;
  LON?: string | number | null;
  lat?: string | number | null;
  lon?: string | number | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
}

export interface AutoAssignmentDriver {
  id_conducteur?: number | string | null;
  nom_conducteur?: string | null;
  prenom_conducteur?: string | null;
  telephone_conducteur?: string | null;
  driver_mission?: string | null;
}

export interface AutoAssignmentResult {
  vehicle: AutoAssignmentVehicle;
  driverName: string;
  driverPhone: string;
  distanceKm: number | null;
  isNearby: boolean;
}

interface AutoAssignmentInput {
  backendUrl?: string;
  idUser?: string | number | null;
  departureLocation: string;
  vehicles?: AutoAssignmentVehicle[];
  vehiclePositions?: AutoAssignmentVehiclePosition[];
  drivers?: AutoAssignmentDriver[];
  maxDistanceKm?: number;
}

const readCoordinate = (...values: Array<string | number | null | undefined>) => {
  for (const value of values) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    const coordinate = Number(value);
    if (Number.isFinite(coordinate)) {
      return coordinate;
    }
  }

  return null;
};

const getDistanceKm = (
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
) => {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latDelta = toRadians(toLat - fromLat);
  const lonDelta = toRadians(toLon - fromLon);
  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const getDriverName = (driver?: AutoAssignmentDriver | null) => {
  if (!driver) return "";

  const fullName = [driver.nom_conducteur, driver.prenom_conducteur]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || driver.driver_mission || "";
};

const getVehicleDriverName = (vehicle: AutoAssignmentVehicle) =>
  [vehicle.driver_first_name || vehicle.nom_conducteur, vehicle.driver_last_name || vehicle.prenom_conducteur]
    .filter(Boolean)
    .join(" ")
    .trim();

export const formatMissionAssignmentDistance = (distanceKm: number) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
};

export const geocodeMissionDeparture = async (location: string) => {
  const urls = [
    `https://geotrackin.xyz/nominatim/search.php?format=jsonv2&limit=1&q=${encodeURIComponent(location)}`,
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(location)}`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const firstResult = Array.isArray(data) ? data[0] : null;
      const latitude = Number(firstResult?.lat);
      const longitude = Number(firstResult?.lon);

      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        return { latitude, longitude };
      }
    } catch (error) {
      console.warn("Geocoding provider failed:", error);
    }
  }

  return null;
};

const normalizeArrayResponse = async <T,>(response: Response | null) => {
  if (!response || !response.ok) return [];

  const data = await response.json();
  if (Array.isArray(data)) return data as T[];
  if (Array.isArray(data?.vehicles)) return data.vehicles as T[];
  if (Array.isArray(data?.value)) return data.value as T[];

  return [];
};

export const loadMissionAssignmentData = async (
  backendUrl: string | undefined,
  idUser: string | number | null | undefined
) => {
  if (!backendUrl || !idUser) {
    return {
      vehicles: [] as AutoAssignmentVehicle[],
      vehiclePositions: [] as AutoAssignmentVehiclePosition[],
      drivers: [] as AutoAssignmentDriver[],
    };
  }

  const [vehiclesRes, positionsRes, driversRes] = await Promise.all([
    fetch(`${backendUrl}/api/geop/vehicule/${idUser}`).catch(() => null),
    fetch(`${backendUrl}/api/map/find/${idUser}`).catch(() => null),
    fetch(`${backendUrl}/api/geop/driver/${idUser}`).catch(() => null),
  ]);

  const [vehicles, vehiclePositions, drivers] = await Promise.all([
    normalizeArrayResponse<AutoAssignmentVehicle>(vehiclesRes),
    normalizeArrayResponse<AutoAssignmentVehiclePosition>(positionsRes),
    normalizeArrayResponse<AutoAssignmentDriver>(driversRes),
  ]);

  return { vehicles, vehiclePositions, drivers };
};

export const resolveMissionAutoAssignment = async ({
  departureLocation,
  vehicles = [],
  vehiclePositions = [],
  drivers = [],
  maxDistanceKm = DEFAULT_MAX_DEPARTURE_DISTANCE_KM,
}: AutoAssignmentInput): Promise<AutoAssignmentResult | null> => {
  if (!departureLocation.trim() || vehicles.length === 0) {
    return null;
  }

  const departureCoordinates = await geocodeMissionDeparture(departureLocation);
  const positionByVehicleId = new Map<number, AutoAssignmentVehiclePosition>();

  vehiclePositions.forEach((position) => {
    positionByVehicleId.set(Number(position.id_vehicule), position);
  });

  const candidates = vehicles
    .map((vehicle) => {
      const lastPosition = positionByVehicleId.get(Number(vehicle.id_vehicule));
      const latitude = readCoordinate(
        lastPosition?.LAT,
        lastPosition?.lat,
        lastPosition?.latitude,
        vehicle.LAT,
        vehicle.lat,
        vehicle.latitude,
        vehicle.latitude_vehicule
      );
      const longitude = readCoordinate(
        lastPosition?.LON,
        lastPosition?.lon,
        lastPosition?.longitude,
        vehicle.LON,
        vehicle.lon,
        vehicle.longitude,
        vehicle.longitude_vehicule
      );
      const distanceKm =
        departureCoordinates && latitude !== null && longitude !== null
          ? getDistanceKm(
              departureCoordinates.latitude,
              departureCoordinates.longitude,
              latitude,
              longitude
            )
          : null;

      return {
        vehicle,
        distanceKm,
        isNearby: distanceKm !== null && distanceKm <= maxDistanceKm,
      };
    })
    .sort((first, second) => {
      if (first.isNearby !== second.isNearby) {
        return first.isNearby ? -1 : 1;
      }

      if (first.distanceKm !== null && second.distanceKm !== null) {
        return first.distanceKm - second.distanceKm;
      }

      if (first.distanceKm !== null) return -1;
      if (second.distanceKm !== null) return 1;

      return (first.vehicle.immatriculation_vehicule || "").localeCompare(
        second.vehicle.immatriculation_vehicule || ""
      );
    });

  const bestCandidate = candidates[0];
  if (!bestCandidate) return null;

  const vehicleDriver = drivers.find(
    (driver) =>
      driver.id_conducteur !== undefined &&
      driver.id_conducteur !== null &&
      String(driver.id_conducteur) ===
        String(bestCandidate.vehicle.id_conducteur_vehicule)
  );

  return {
    ...bestCandidate,
    driverName: getDriverName(vehicleDriver) || getVehicleDriverName(bestCandidate.vehicle),
    driverPhone: vehicleDriver?.telephone_conducteur || "",
  };
};

export const autoAssignMissionVehicle = async (input: AutoAssignmentInput) => {
  const data =
    input.vehicles && input.vehiclePositions && input.drivers
      ? {
          vehicles: input.vehicles,
          vehiclePositions: input.vehiclePositions,
          drivers: input.drivers,
        }
      : await loadMissionAssignmentData(input.backendUrl, input.idUser);

  return resolveMissionAutoAssignment({
    ...input,
    vehicles: data.vehicles,
    vehiclePositions: data.vehiclePositions,
    drivers: data.drivers,
  });
};
