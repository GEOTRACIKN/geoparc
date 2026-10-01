import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";

interface ClosedMission {
  id_mission?: number;
  ref_mission?: string | number;
  object_mission?: string;
}

type CloseState =
  | { kind: "ready" }
  | { kind: "loading" }
  | { kind: "success"; mission: ClosedMission }
  | { kind: "error"; message: string };

const apiUrl = String(
  process.env.REACT_APP_BACKEND_URL || "https://geotrackin.com",
).replace(/\/$/, "");

function errorFromCode(code: string | null) {
  if (code === "MISSION_TOKEN_EXPIRED") return "Ce lien de mission a expiré.";
  if (code === "MISSION_TOKEN_USED") return "Ce lien de mission a déjà été utilisé.";
  if (code === "missing_token") return "Le code de clôture est manquant.";
  return "Ce lien de mission est invalide.";
}

export default function MissionComplete() {
  const [searchParams] = useSearchParams();
  const { translate: tr } = useTranslate();
  const initialized = useRef(false);
  const requestStarted = useRef(false);
  const tokenRef = useRef("");
  const [confirmed, setConfirmed] = useState(false);
  const [state, setState] = useState<CloseState>({ kind: "loading" });

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const fragmentParams = new URLSearchParams(window.location.hash.slice(1));
    const token = (fragmentParams.get("t") || searchParams.get("t"))?.trim();
    const queryError = searchParams.get("error");
    if (queryError || !token) {
      setState({
        kind: "error",
        message: errorFromCode(queryError || "missing_token"),
      });
      return;
    }

    tokenRef.current = token;
    window.history.replaceState(null, "", window.location.pathname);
    setState({ kind: "ready" });
  }, [searchParams]);

  function closeMission() {
    if (!confirmed || state.kind !== "ready" || requestStarted.current) return;
    requestStarted.current = true;
    setState({ kind: "loading" });

    void fetch(`${apiUrl}/api/geop/mission/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ t: tokenRef.current }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message || "Impossible de clôturer cette mission.");
        }
        setState({ kind: "success", mission: data.mission || {} });
      })
      .catch((error: unknown) => {
        setState({
          kind: "error",
          message:
            error instanceof Error
              ? error.message
              : "Impossible de clôturer cette mission.",
        });
      });
  }

  const success = state.kind === "success";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "linear-gradient(145deg, #f4f7fb 0%, #e8f5ee 100%)",
      }}
    >
      <section
        style={{
          width: "min(100%, 520px)",
          padding: "42px 28px",
          borderRadius: 18,
          background: "#fff",
          boxShadow: "0 18px 55px rgba(22, 34, 51, 0.12)",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 72,
            height: 72,
            margin: "0 auto 22px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            background:
              state.kind === "ready" || state.kind === "loading" ? "#d97706" : success ? "#16a34a" : "#dc2626",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          {state.kind === "loading" ? "…" : state.kind === "ready" ? "?" : success ? "✓" : "!"}
        </div>

        {state.kind === "ready" && (
          <>
            <h1 style={{ color: "#162233" }}>{tr("missionClose.title")}</h1>
            <p style={{ color: "#64748b" }}>{tr("missionClose.explanation")}</p>
            <label style={{ display: "flex", gap: 12, textAlign: "start", margin: "24px 0" }}>
              <input type="checkbox" checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)} />
              {tr("missionClose.confirm")}
            </label>
            <button type="button" disabled={!confirmed} onClick={closeMission}
              style={{ background: confirmed ? "#d97706" : "#e2e8f0", color: confirmed ? "white" : "#475569",
                border: 0, borderRadius: 8, padding: "14px 24px", fontWeight: 600,
                cursor: confirmed ? "pointer" : "not-allowed", width: "100%" }}>
              {tr("missionClose.button")}
            </button>
          </>
        )}

        {state.kind === "loading" && (
          <>
            <h1 style={{ color: "#162233" }}>Clôture de la mission</h1>
            <p style={{ color: "#64748b" }}>Validation de votre mission en cours…</p>
          </>
        )}

        {state.kind === "success" && (
          <>
            <h1 style={{ color: "#162233" }}>Mission accomplie</h1>
            <p style={{ color: "#64748b" }}>
              La mission {state.mission.ref_mission || state.mission.id_mission || ""} a été clôturée avec succès.
            </p>
            {state.mission.object_mission && (
              <div
                style={{
                  marginTop: 18,
                  padding: "14px 16px",
                  borderRadius: 10,
                  background: "#f0fdf4",
                  color: "#166534",
                  fontWeight: 600,
                }}
              >
                Objectif : {state.mission.object_mission}
              </div>
            )}
          </>
        )}

        {state.kind === "error" && (
          <>
            <h1 style={{ color: "#162233" }}>Clôture impossible</h1>
            <p style={{ color: "#64748b" }}>{state.message}</p>
          </>
        )}
      </section>
    </main>
  );
}
