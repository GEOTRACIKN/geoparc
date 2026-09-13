import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivacyPolicy, { isPrivacyPolicyPath } from "./PrivacyPolicy";

test.each(["/privacy-policy", "/privacy-policy/", "/privacy-policy.html"])(
  "%s is a public privacy policy path",
  (path) => expect(isPrivacyPolicyPath(path)).toBe(true)
);

test.each(["/", "/vehicles", "/privacy-policy/other"])(
  "%s does not bypass authentication",
  (path) => expect(isPrivacyPolicyPath(path)).toBe(false)
);

test("renders the policy without session providers and restores page metadata", () => {
  const title = document.title;
  const { unmount } = render(<MemoryRouter><PrivacyPolicy /></MemoryRouter>);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Privacy Policy");
  expect(screen.getByRole("link", { name: "privacy@geotrackin.com" }).getAttribute("href")).toBe("mailto:privacy@geotrackin.com");
  expect(document.title).toContain("GeoParc");
  unmount();
  expect(document.title).toBe(title);
});
