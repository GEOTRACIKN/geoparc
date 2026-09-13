import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/css/privacy-policy.css";

export function isPrivacyPolicyPath(pathname: string) {
  return ["/privacy-policy", "/privacy-policy.html"].includes(
    pathname.replace(/\/$/, "")
  );
}

export default function PrivacyPolicy() {
  useEffect(() => {
    const previousTitle = document.title;
    const previousLanguage = document.documentElement.lang;
    document.title = "Privacy Policy — GeoParc";
    document.documentElement.lang = "en";
    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLanguage;
    };
  }, []);

  return (
    <main className="gp-privacy" lang="en">
      <article className="gp-privacy-card" aria-labelledby="privacy-title">
        <header>
          <p className="gp-privacy-brand">GeoParc</p>
          <h1 id="privacy-title">Privacy Policy</h1>
          <p className="gp-privacy-date">Last updated: September 13, 2026</p>
          <p>This policy covers the GeoParc platform and its mobile fleet management application.</p>
        </header>

        <section>
          <h2>1. Introduction</h2>
          <p>GeoParc helps organizations and their authorized users manage vehicles, drivers, missions and maintenance operations. This policy explains the categories of data used in this context and how to contact us about privacy.</p>
        </section>
        <section>
          <h2>2. Data processed</h2>
          <p>Depending on the features used and the information provided by your organization, GeoParc processes the following categories of data:</p>
          <ul>
            <li>User account information, profile details and access permissions.</li>
            <li>Information about vehicles, drivers, missions, maintenance operations and associated documents.</li>
            <li>Data entered or submitted through forms, reports and transport requests.</li>
            <li>Display preferences and information required to maintain your session.</li>
          </ul>
        </section>
        <section>
          <h2>3. How data is used</h2>
          <p>This information is used to provide GeoParc features, manage access, display lists and reports, organize fleet operations and restore each user's preferences. Information submitted to support is used to handle your request.</p>
        </section>
        <section>
          <h2>4. Location and device permissions</h2>
          <p>Places and routes entered in GeoParc are used to organize missions and transport requests. This information is distinct from the location of your phone.</p>
          <p>When a mobile feature requires a system permission, you can manage that permission in your device settings. Contact support for information about the permissions and related processing applicable to your version of the application.</p>
        </section>
        <section>
          <h2>5. Access and confidentiality</h2>
          <p>Business data is accessible to authorized users within your organization according to their permissions. Do not share your credentials and only provide information necessary for your operations. Contact us with questions about technical recipients, hosting or service providers involved in the service.</p>
        </section>
        <section>
          <h2>6. Sessions and preferences</h2>
          <p>The web platform uses session cookies and browser local storage for authentication and preferences, including language, theme and visible columns. You can clear this data in your browser; doing so may sign you out or reset your preferences.</p>
        </section>
        <section>
          <h2>7. Retention and deletion</h2>
          <p>Business data relates to your organization's fleet management activities. Contact your administrator or our support team to ask about retention periods or request deletion of an account or associated data. Requests are assessed taking into account applicable retention obligations and your organization's rights over its business records.</p>
        </section>
        <section>
          <h2>8. Requests about your data</h2>
          <p>You can contact your administrator or our support team to request access to, correction of or deletion of your personal information. We may ask for information necessary to verify your identity and understand your request.</p>
        </section>
        <section>
          <h2>9. Intended audience</h2>
          <p>GeoParc is a professional service for fleet management by organizations and their authorized users. It is not designed as a service for children.</p>
        </section>
        <section>
          <h2>10. Contact and updates</h2>
          <p>For questions or requests about privacy in GeoParc, contact: <a href="mailto:privacy@geotrackin.com">privacy@geotrackin.com</a>.</p>
          <p>This policy may be updated to reflect changes to the service. The date of the latest update appears at the top of this page.</p>
        </section>
        <footer><Link to="/login-geoparc">Go to GeoParc</Link></footer>
      </article>
    </main>
  );
}
