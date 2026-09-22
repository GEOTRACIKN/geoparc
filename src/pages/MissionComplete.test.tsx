import { StrictMode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../hooks/LanguageProvider";
import MissionComplete from "./MissionComplete";

const originalFetch = global.fetch;
beforeEach(() => {
  localStorage.setItem("language", "fr");
  window.history.replaceState(null, "", "/mission/complete#t=test-mission-token");
  global.fetch = jest.fn();
});
afterEach(() => { global.fetch = originalFetch; });
function showPage(path = "/mission/complete") {
  return render(<StrictMode><MemoryRouter initialEntries={[path]}><LanguageProvider><MissionComplete /></LanguageProvider></MemoryRouter></StrictMode>);
}

test("opening the link never closes the mission; explicit confirmation sends one request", async () => {
  let resolveResponse!: (value: unknown) => void;
  (global.fetch as jest.Mock).mockReturnValue(new Promise(resolve => { resolveResponse = resolve; }));
  showPage();
  const button = await screen.findByRole("button", { name: "Clôturer la mission" });
  expect(global.fetch).not.toHaveBeenCalled();
  expect((button as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(button);
  expect(global.fetch).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(button);
  fireEvent.click(button);
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/geop/mission/close"), expect.objectContaining({ method: "POST", body: JSON.stringify({ t: "test-mission-token" }) }));
  resolveResponse({ ok: true, json: async () => ({ mission: { ref_mission: "TEST-1" } }) });
  await screen.findByText("Mission accomplie");
  expect(screen.queryByRole("button")).toBeNull();
});

test("missing token blocks confirmation without a request", async () => {
  window.history.replaceState(null, "", "/mission/complete");
  showPage();
  await screen.findByText("Le code de clôture est manquant.");
  expect(global.fetch).not.toHaveBeenCalled();
  expect(screen.queryByRole("button")).toBeNull();
});

test("expired links show an error, never success", async () => {
  (global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({ message: "Ce lien de mission a expiré." }) });
  showPage();
  fireEvent.click(await screen.findByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Clôturer la mission" }));
  await waitFor(() => expect(screen.getByText("Ce lien de mission a expiré.")).toBeTruthy());
  expect(screen.queryByText("Mission accomplie")).toBeNull();
});
