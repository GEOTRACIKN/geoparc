import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Form, Nav, Spinner } from "react-bootstrap";
import {
  BadgePercent,
  Boxes,
  Building2,
  Database,
  FileCog,
  Fuel as FuelIcon,
  LucideIcon,
  MapPinned,
  Medal,
  RefreshCcw,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import Taxe from "../components/Reference/Taxe";
import Fuel from "../components/Reference/Fuel";
import Data from "../components/Reference/Data";
import Driver from "../components/Reference/Driver";
import Mission from "../components/Reference/Mission";
import Supplier from "../components/Reference/Supplier";
import Warehouse from "../components/Reference/Warehouse";
import Administration from "../components/Reference/Administration";
import "./Reference.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

type ReferenceTabKey =
  | "taxe"
  | "fuel"
  | "data"
  | "driver"
  | "mission"
  | "supplier"
  | "warehouse"
  | "administration";

type MetricStatus = "loading" | "ready" | "error";

type ReferenceMetric = {
  key: ReferenceTabKey;
  label: string;
  caption: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  status: MetricStatus;
};

const emptyMetrics: Record<ReferenceTabKey, ReferenceMetric> = {
  taxe: {
    key: "taxe",
    label: "Taxes",
    caption: "Regles fiscales configurees",
    value: "0",
    unit: "lignes",
    icon: BadgePercent,
    status: "loading",
  },
  fuel: {
    key: "fuel",
    label: "Carburants",
    caption: "Prix de reference renseignes",
    value: "0",
    unit: "prix",
    icon: FuelIcon,
    status: "loading",
  },
  data: {
    key: "data",
    label: "Data",
    caption: "Services, clients, biens et lieux",
    value: "0",
    unit: "entrees",
    icon: Database,
    status: "loading",
  },
  driver: {
    key: "driver",
    label: "Driver",
    caption: "Categories et couts chauffeurs",
    value: "0",
    unit: "categories",
    icon: Users,
    status: "loading",
  },
  mission: {
    key: "mission",
    label: "Mission",
    caption: "Primes et baremes mission",
    value: "0",
    unit: "baremes",
    icon: Medal,
    status: "loading",
  },
  supplier: {
    key: "supplier",
    label: "Supplier",
    caption: "Fournisseurs actifs",
    value: "0",
    unit: "fournisseurs",
    icon: Building2,
    status: "loading",
  },
  warehouse: {
    key: "warehouse",
    label: "Warehouse",
    caption: "Depots et emplacements",
    value: "0",
    unit: "depots",
    icon: Boxes,
    status: "loading",
  },
  administration: {
    key: "administration",
    label: "Administration",
    caption: "Logo, documents et devise",
    value: "0",
    unit: "parametres",
    icon: FileCog,
    status: "loading",
  },
};

const tabOrder: ReferenceTabKey[] = [
  "taxe",
  "fuel",
  "data",
  "driver",
  "mission",
  "supplier",
  "warehouse",
  "administration",
];

const tabComponents: Record<ReferenceTabKey, JSX.Element> = {
  taxe: <Taxe />,
  fuel: <Fuel />,
  data: <Data />,
  driver: <Driver />,
  mission: <Mission />,
  supplier: <Supplier />,
  warehouse: <Warehouse />,
  administration: <Administration />,
};

const toDisplayNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value);

const getCount = async (url: string, params?: Record<string, string>) => {
  const response = await axios.get(url, { params });
  return Number(response.data?.count ?? 0);
};

export function Reference() {
  const [activeTab, setActiveTab] = useState<ReferenceTabKey>("taxe");
  const [metrics, setMetrics] =
    useState<Record<ReferenceTabKey, ReferenceMetric>>(emptyMetrics);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const geopuserID = localStorage.getItem("GeopUserID");

  useEffect(() => {
    let mounted = true;

    const loadMetric = async (
      key: ReferenceTabKey,
      loader: () => Promise<{ value: number; unit?: string }>
    ) => {
      try {
        const result = await loader();
        if (!mounted) return;

        setMetrics((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            value: toDisplayNumber(result.value),
            unit: result.unit || prev[key].unit,
            status: "ready",
          },
        }));
      } catch (error) {
        if (!mounted) return;

        setMetrics((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            value: "--",
            status: "error",
          },
        }));
      }
    };

    const loadMetrics = async () => {
      if (!backendUrl || !geopuserID) {
        setMetrics((prev) =>
          tabOrder.reduce((acc, key) => {
            acc[key] = { ...prev[key], value: "--", status: "error" };
            return acc;
          }, {} as Record<ReferenceTabKey, ReferenceMetric>)
        );
        return;
      }

      setMetrics((prev) =>
        tabOrder.reduce((acc, key) => {
          acc[key] = { ...prev[key], status: "loading" };
          return acc;
        }, {} as Record<ReferenceTabKey, ReferenceMetric>)
      );

      loadMetric("taxe", async () => ({
        value: await getCount(`${backendUrl}/api/geop/taxe/count/${geopuserID}`),
      }));

      loadMetric("driver", async () => ({
        value: await getCount(
          `${backendUrl}/api/geop/driverCategory/count/${geopuserID}`
        ),
      }));

      loadMetric("mission", async () => ({
        value: await getCount(
          `${backendUrl}/api/geop/mission-bonus/count/${geopuserID}`
        ),
      }));

      loadMetric("supplier", async () => ({
        value: await getCount(
          `${backendUrl}/api/geop/supplier/count/${geopuserID}`
        ),
      }));

      loadMetric("warehouse", async () => ({
        value: await getCount(`${backendUrl}/api/geop/depot/count/${geopuserID}`),
      }));

      loadMetric("fuel", async () => {
        const response = await axios.get(`${backendUrl}/api/geop/fuel/${geopuserID}`);
        const fuelValues = [
          "ess_norm",
          "ess_sp",
          "ess_sup",
          "gasoil",
          "gpl",
          "elec_kwh",
        ].map((field) => Number(response.data?.[field] ?? 0));

        return {
          value: fuelValues.filter((price) => price > 0).length,
          unit: "prix actifs",
        };
      });

      loadMetric("data", async () => {
        const endpoints = ["services", "customers", "goods", "locations", "units"];
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            axios.get(`${backendUrl}/api/geop/data/${endpoint}/${geopuserID}`)
          )
        );

        return {
          value: responses.reduce(
            (total, response) =>
              total + (Array.isArray(response.data) ? response.data.length : 0),
            0
          ),
        };
      });

      loadMetric("administration", async () => {
        const response = await axios.get(
          `${backendUrl}/api/geop/administration/${geopuserID}`
        );
        const data = response.data || {};
        const completed = [
          data.logo_image,
          data.header_image,
          data.footer_image,
          data.currency_symbol,
        ].filter(Boolean).length;

        return {
          value: completed,
          unit: "sur 4",
        };
      });
    };

    loadMetrics();

    return () => {
      mounted = false;
    };
  }, [geopuserID, refreshIndex]);

  const activeMetric = metrics[activeTab];
  const readyMetrics = useMemo(
    () => tabOrder.filter((key) => metrics[key].status === "ready").length,
    [metrics]
  );

  return (
    <main className="reference-page">
      <section className="reference-hero">
        <div>
          <p className="reference-kicker">
            <ShieldCheck size={16} aria-hidden="true" />
            Base de reference GeoParc
          </p>
          <h1>References</h1>
          <p className="reference-subtitle">
            Centralisez les baremes, fournisseurs, depots et parametres utilises
            par les modules operationnels.
          </p>
        </div>

        <button
          type="button"
          className="reference-refresh"
          onClick={() => setRefreshIndex((index) => index + 1)}
        >
          <RefreshCcw size={16} aria-hidden="true" />
          Actualiser
        </button>
      </section>

      <section className="reference-metrics" aria-label="Metriques references">
        {tabOrder.map((key) => {
          const metric = metrics[key];
          const Icon = metric.icon;
          const isActive = activeTab === key;

          return (
            <button
              type="button"
              key={key}
              className={`reference-metric ${isActive ? "is-active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              <span className="reference-metric-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="reference-metric-content">
                <span className="reference-metric-label">{metric.label}</span>
                <span className="reference-metric-caption">{metric.caption}</span>
              </span>
              <span className="reference-metric-value">
                {metric.status === "loading" ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  metric.value
                )}
                <small>{metric.unit}</small>
              </span>
            </button>
          );
        })}
      </section>

      <section className="reference-mobile-picker" aria-label="Navigation mobile">
        <Form.Select
          className="reference-mobile-select"
          value={activeTab}
          onChange={(event) => setActiveTab(event.target.value as ReferenceTabKey)}
          aria-label="Choisir une rubrique reference"
        >
          {tabOrder.map((key) => (
            <option key={key} value={key}>
              {metrics[key].label} - {metrics[key].value} {metrics[key].unit}
            </option>
          ))}
        </Form.Select>
      </section>

      <section className="reference-workspace">
        <aside className="reference-sidebar">
          <div className="reference-sidebar-header">
            <span>Rubriques</span>
            <strong>{readyMetrics}/{tabOrder.length}</strong>
          </div>

          <Nav
            activeKey={activeTab}
            onSelect={(key) => setActiveTab((key as ReferenceTabKey) || "taxe")}
            className="reference-tabs"
          >
            {tabOrder.map((key) => {
              const metric = metrics[key];
              const Icon = metric.icon;

              return (
                <Nav.Item key={key}>
                  <Nav.Link eventKey={key}>
                    <Icon size={18} aria-hidden="true" />
                    <span>{metric.label}</span>
                    <small>{metric.value}</small>
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </aside>

        <section className="reference-panel">
          <header className="reference-panel-header">
            <div>
              <p className="reference-panel-eyebrow">
                <MapPinned size={15} aria-hidden="true" />
                {activeMetric.caption}
              </p>
              <h2>{activeMetric.label}</h2>
            </div>

            <div className="reference-panel-stat">
              <Truck size={18} aria-hidden="true" />
              <span>{activeMetric.value}</span>
              <small>{activeMetric.unit}</small>
            </div>
          </header>

          <div className="reference-panel-body">{tabComponents[activeTab]}</div>
        </section>
      </section>
    </main>
  );
}
