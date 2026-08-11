import { fireEvent, render, screen } from "@testing-library/react";
import TransportRequestTypeCard from "./TypeCard";

const translations: Record<string, string> = {
  trip_type: "Type de trajet",
  one_way: "Aller simple",
  round_trip: "Aller-retour",
  request_type: "Type de demande",
  Normal: "Normale",
  Urgent: "Urgent",
};

test("selects a round trip independently from the request urgency", () => {
  const onTripTypeChange = jest.fn();
  const onChange = jest.fn();

  render(
    <TransportRequestTypeCard
      translate={(key) => translations[key] || key}
      tripType="one_way"
      requestType="Normal"
      onTripTypeChange={onTripTypeChange}
      onChange={onChange}
    />,
  );

  expect(
    screen
      .getByRole("button", { name: /aller simple/i })
      .getAttribute("aria-pressed"),
  ).toBe("true");

  fireEvent.click(screen.getByRole("button", { name: /aller-retour/i }));

  expect(onTripTypeChange).toHaveBeenCalledWith("round_trip");
  expect(onChange).not.toHaveBeenCalled();
});
