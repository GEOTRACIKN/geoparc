import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MissionOrderManage } from "./MissionOrderManage";

jest.mock("./MissionOrder", () => ({}));
jest.mock("../hooks/LanguageProvider", () => ({ useTranslate: () => ({ translate: (text: string) => text }) }));
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { id_user: 1 }, loading: false }) }));
jest.mock("../components/TransportRequest/AddressAutocompleteInput", () => () => null);

const originalFetch = global.fetch;
beforeEach(() => {
  global.fetch = jest.fn().mockImplementation(async (url) => ({
    ok: true,
    json: async () => String(url).includes("/vehicule/") ? { vehicles: [] } : [],
  }));
});
afterEach(() => { global.fetch = originalFetch; });

test("missing dates prevent a create request", async () => {
  const { container } = render(<MemoryRouter><MissionOrderManage /></MemoryRouter>);
  await waitFor(() => expect(container.querySelector('[name="dep_date_mission"]')).not.toBeNull());
  fireEvent.click(await screen.findByRole("button", { name: /Add$/ }));
  await waitFor(() => expect(screen.getByText("Veuillez renseigner les dates de départ et de retour.")).toBeTruthy());
  expect((global.fetch as jest.Mock).mock.calls.some(([url]) => String(url).endsWith("/create"))).toBe(false);
});

test("dates survive tab changes and empty itinerary is transmitted", async () => {
  const { container } = render(<MemoryRouter><MissionOrderManage /></MemoryRouter>);
  await screen.findByRole("button", { name: /Add$/ });
  await waitFor(() => expect(container.querySelector('[name="dep_date_mission"]')).not.toBeNull());
  fireEvent.change(container.querySelector('[name="dep_date_mission"]')!, { target: { value: "2026-10-29T09:00" } });
  fireEvent.change(container.querySelector('[name="return_date_mission"]')!, { target: { value: "2026-10-29T12:00" } });
  fireEvent.click(screen.getByRole("button", { name: "Assignment" }));
  fireEvent.click(screen.getByRole("button", { name: /Add$/ }));
  await waitFor(() => expect((global.fetch as jest.Mock).mock.calls.some(([url]) => String(url).endsWith("/create"))).toBe(true));
  const [, options] = (global.fetch as jest.Mock).mock.calls.find(([url]) => String(url).endsWith("/create"))!;
  expect(JSON.parse(options.body)).toMatchObject({
    dep_date_mission: "2026-10-29 09:00:00",
    return_date_mission: "2026-10-29 12:00:00",
    itinerary_mission: "",
  });
});
