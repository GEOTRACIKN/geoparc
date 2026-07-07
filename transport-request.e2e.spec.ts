import { expect, test } from "@playwright/test";

const requester = {
  id_demandeur: 1,
  mat: "DEM-001",
  first_name: "Samia",
  last_name: "Sebaa",
  email: "samia.sebaa@sorfert.com",
  phone: "0555000001",
};

const responsible = {
  id_demandeur: 1,
  id_responsable: 7,
  mat: "RESP-007",
  first_name: "Ali",
  last_name: "Responsable",
  email: requester.email,
  phone: requester.phone,
};

const transportRequest = {
  id_transport_request: 123,
  request_type: "Normal",
  object_request: "Transport client Oran",
  requester_phone: requester.phone,
  departure_datetime: "2026-07-08T09:00:00",
  departure_location: "Oran, Bir El Djir, Oran, Algeria",
  arrival_datetime: "2026-07-08T11:00:00",
  arrival_location: "Sorfert, Arzew, Oran, Algeria",
  status_request: "pending_fleet_processing",
  created_at: "2026-07-07T10:00:00",
};

const missionOrder = {
  id_mission: 98,
  ref_mission: transportRequest.id_transport_request,
  object_mission: transportRequest.object_request,
  fuel_loading_mission: 0,
  fuel_type_mission: "",
  expenses_mission: 0,
  tank_mission: 0,
  trailer_mission: "0",
  driver_mission: "",
  accomp_mission: "",
  dep_loc_mission: transportRequest.departure_location,
  dep_date_mission: transportRequest.departure_datetime,
  dep_dest_mission: transportRequest.arrival_location,
  return_date_mission: transportRequest.arrival_datetime,
  itinerary_mission: "",
  vehicle_km_mission: 0,
  new_km_mission: 0,
  fuel_cost_mission: 0,
  fuel_level_mission: 0,
  voucher_mission: "",
  id_vehicule: 0,
  immatriculation_vehicule: "",
};

test("complete transport request process creates mission and opens edit page", async ({
  page,
}) => {
  let transportRequestCreated = false;
  let responsibleDetected = false;
  let missionCreated = false;

  await page.route("**/api/logingeop**", (route) =>
    route.fulfill({
      json: {
        id_user: 1,
        username: "e2e",
        id_role: 1,
        api_key: "e2e-api-key",
      },
    })
  );

  await page.route("**/api/geop/permission/all/**", (route) =>
    route.fulfill({ json: [] })
  );

  await page.route(
    "**/api/geop/request-responsibilities/responsibles/search",
    (route) => {
      responsibleDetected = true;
      return route.fulfill({ json: { data: [responsible] } });
    }
  );

  await page.route("**/nominatim/search.php**", async (route) => {
    const url = new URL(route.request().url());
    const query = url.searchParams.get("q") || "";
    const displayName = query.toLowerCase().includes("sorfert")
      ? transportRequest.arrival_location
      : transportRequest.departure_location;

    await route.fulfill({
      json: [{ place_id: displayName, display_name: displayName }],
    });
  });

  await page.route("**/nominatim.openstreetmap.org/search**", (route) =>
    route.fulfill({ json: [] })
  );

  await page.route(
    "**/api/geop/transportRequestManage/create",
    async (route) => {
      const payload = route.request().postDataJSON();

      expect(payload.object_request).toBe(transportRequest.object_request);
      expect(payload.requester_email).toBe(requester.email);
      expect(payload.id_gp_demandeur).toBe(requester.id_demandeur);
      expect(payload.id_gp_responsable).toBe(responsible.id_responsable);
      expect(payload.departure_location).toBe(
        transportRequest.departure_location
      );
      expect(payload.arrival_location).toBe(transportRequest.arrival_location);

      transportRequestCreated = true;

      await route.fulfill({
        json: {
          message: "Transport request created successfully",
          id_transport_request: transportRequest.id_transport_request,
        },
      });
    }
  );

  await page.route(
    "**/api/geop/transportRequestManage/totalpage",
    (route) =>
      route.fulfill({ json: { count: transportRequestCreated ? 1 : 0 } })
  );

  await page.route("**/api/geop/transportRequestManage/search", (route) =>
    route.fulfill({ json: transportRequestCreated ? [transportRequest] : [] })
  );

  await page.route("**/api/geop/missionOrderManage/create", async (route) => {
    const payload = route.request().postDataJSON();

    expect(payload.ref_mission).toBe(transportRequest.id_transport_request);
    expect(payload.object_mission).toBe(transportRequest.object_request);
    expect(payload.dep_loc_mission).toBe(transportRequest.departure_location);
    expect(payload.dep_dest_mission).toBe(transportRequest.arrival_location);

    missionCreated = true;

    await route.fulfill({
      json: {
        message: "Mission created successfully",
        id_mission: missionOrder.id_mission,
      },
    });
  });

  await page.route("**/api/geop/transportRequestManage/update", async (route) => {
    const payload = route.request().postDataJSON();

    expect(payload.id_transport_request).toBe(transportRequest.id_transport_request);
    expect(payload.status_request).toBe("mission_created");

    await route.fulfill({
      json: {
        message: "Transport request updated successfully",
        success: true,
      },
    });
  });

  await page.route("**/api/geop/missionOrderManage/totalpage", (route) =>
    route.fulfill({ json: { count: missionCreated ? 1 : 0 } })
  );

  await page.route("**/api/geop/missionOrderManage/search", (route) =>
    route.fulfill({ json: missionCreated ? [missionOrder] : [] })
  );

  await page.route("**/api/geop/missionOrderManage/find/98", (route) =>
    route.fulfill({ json: missionOrder })
  );

  await page.route("**/api/geop/vehicule/1", (route) =>
    route.fulfill({ json: { vehicles: [] } })
  );

  await page.route("**/api/geop/driver/1", (route) =>
    route.fulfill({ json: [] })
  );

  await page.route("**/api/geop/trailer/1", (route) =>
    route.fulfill({ json: [] })
  );

  await page.addInitScript(() => {
    localStorage.setItem("api_key", "e2e-api-key");
    localStorage.setItem("theme_mode", "0");
    localStorage.setItem("GeopUserID", "1");
    localStorage.setItem("language", "en");
  });

  await page.goto("http://localhost:3001/transport-request");
  await page.waitForLoadState("networkidle");

  await page.locator('input[type="datetime-local"]').nth(0).fill("2026-07-08T09:00");
  await page.locator("#departure-location").fill("Oran");
  await page.getByText(transportRequest.departure_location).click();

  await page.locator('input[type="datetime-local"]').nth(1).fill("2026-07-08T11:00");
  await page.locator("#arrival-location").fill("Sorfert");
  await page.getByText(transportRequest.arrival_location).click();

  await page
    .getByPlaceholder(/object|objet/i)
    .fill(transportRequest.object_request);

  await page.locator("#responsible-select").fill("Ali");
  await page.getByText("Ali Responsable - samia.sebaa@sorfert.com").click();
  await expect(page.getByPlaceholder(/phone|telephone|téléphone/i)).toHaveValue(
    requester.phone
  );
  await expect
    .poll(() => responsibleDetected, {
      message: "responsible list should be loaded",
    })
    .toBe(true);
  await page.waitForTimeout(100);

  await page.getByRole("button", { name: /send|envoyer/i }).click();
  await expect
    .poll(() => transportRequestCreated, {
      message: "transport request should be created",
    })
    .toBe(true);

  await page.goto("http://localhost:3001/transport-request-list");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText(transportRequest.object_request)).toBeVisible();
  await expect(page.getByText(transportRequest.departure_location)).toBeVisible();

  await page.getByRole("button", { name: /approve|approuver/i }).click();
  await expect
    .poll(() => missionCreated, { message: "mission should be created" })
    .toBe(true);

  await page.goto("http://localhost:3001/mission-order");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("98")).toBeVisible();
  await expect(page.getByText(transportRequest.object_request)).toBeVisible();

  await page.locator('a[href="/mission-order-manage/edit/98"]').click();
  await expect(page).toHaveURL(/\/mission-order-manage\/edit\/98$/);
  await expect(page.locator('input[name="ref_mission"]')).toHaveValue("123");
  await expect(page.locator('input[name="object_mission"]')).toHaveValue(
    transportRequest.object_request
  );
  await expect(page.locator('input[name="dep_loc_mission"]')).toHaveValue(
    transportRequest.departure_location
  );
  await expect(page.locator('input[name="dep_dest_mission"]')).toHaveValue(
    transportRequest.arrival_location
  );
});
