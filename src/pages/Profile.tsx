import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Modal, NavDropdown, Row, Spinner } from "react-bootstrap";
import TimezoneSelect, { ITimezone } from "react-timezone-select";
import { Bounce, toast } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import "../assets/css/profile.css";
import { useTranslate } from "../hooks/LanguageProvider";
import { useUser } from "../context/UserContext";
import { useTheme } from "../hooks/ThemeContext";
import {
  dispatchSidebarAppearanceChange,
  dispatchSidebarPinnedChange,
  loadSidebarAppearancePreference,
  loadSidebarPinnedPreference,
  persistSidebarAppearanceLocally,
  persistSidebarPinnedLocally,
  readStoredSidebarAppearance,
  readStoredSidebarPinned,
  saveSidebarAppearancePreference,
  saveSidebarPinnedPreference,
  SidebarColorMode,
  SidebarIconMode,
} from "../utilities/sidebarPreference";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const profileImageBaseUrl = "https://geotrackin.com/react/public";
const maxProfileImageSize = 2 * 1024 * 1024;

type Language = "en" | "fr" | "ar" | "es";

interface UserInfo {
  username_user?: string;
  username?: string;
  email_user?: string;
  email?: string;
  img: string;
  timezone?: string;
  language?: Language;
  theme_mode?: string | number | boolean;
}

function Profile() {
  const idUser = Number(localStorage.getItem("GeopUserID") ?? localStorage.getItem("userid") ?? 0);
  const { translate, lang, setLang } = useTranslate();
  const { refreshImage } = useUser();
  const { isDarkMode, setThemeMode } = useTheme();

  const [showModalImg, setShowModalImg] = useState(false);
  const [pathImg, setPathImg] = useState<string | null>(localStorage.getItem("GeopProfileImage"));
  const [emailValue, setEmailValue] = useState("");
  const [usernameValue, setUsernameValue] = useState(localStorage.getItem("Geopusername") || "");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageSaving, setImageSaving] = useState(false);
  const [timezoneSaving, setTimezoneSaving] = useState(false);
  const [languageSaving, setLanguageSaving] = useState(false);
  const [themeSaving, setThemeSaving] = useState(false);
  const [sidebarSaving, setSidebarSaving] = useState(false);
  const [appearanceSaving, setAppearanceSaving] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(readStoredSidebarPinned);
  const [sidebarAppearance, setSidebarAppearance] = useState(readStoredSidebarAppearance);
  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>(
    localStorage.getItem("timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const languages: Record<Language, string> = {
    en: "English",
    fr: "French",
    ar: "Arabic",
    es: "Spanish",
  };

  const sidebarColorOptions: Array<{ value: SidebarColorMode; label: string; swatch: string }> = [
    { value: "light", label: "Light", swatch: "#ffffff" },
    { value: "dark", label: "Dark", swatch: "#202123" },
    { value: "navy", label: "Navy", swatch: "#10194a" },
    { value: "soft", label: "Soft", swatch: "#f3f6fb" },
  ];

  const sidebarIconOptions: Array<{ value: SidebarIconMode; label: string; icon: string }> = [
    { value: "line", label: "Line", icon: "las la-home" },
    { value: "soft", label: "Soft", icon: "las la-map" },
    { value: "boxed", label: "Boxed", icon: "las la-chart-bar" },
  ];

  const showSuccess = (message: string) => {
    toast.success(translate(message), {
      position: "bottom-right",
      autoClose: 2400,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });
  };

  const showWarning = (message: string) => {
    toast.warn(translate(message), {
      position: "bottom-right",
      autoClose: 2400,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });
  };

  const buildProfileImageUrl = (imagePath: string) =>
    `${profileImageBaseUrl}/${imagePath}?t=${Date.now()}`;

  const fetchInfo = async () => {
    if (!idUser) return;

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/profile/${idUser}`, {
        credentials: "include",
      });
      const data = await response.json();
      const profile = data?.[0] as UserInfo | undefined;

      if (!response.ok || !profile) throw new Error("Profile not found");

      const imageUrl = buildProfileImageUrl(profile.img);
      const username = profile.username_user ?? profile.username ?? "";
      const email = profile.email_user ?? profile.email ?? "";
      const timezone = profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const profileDarkMode =
        profile.theme_mode === true ||
        profile.theme_mode === 1 ||
        profile.theme_mode === "1";

      setPathImg(imageUrl);
      setEmailValue(email);
      setUsernameValue(username);
      setSelectedTimezone(timezone);
      setUserInfo(profile);
      setThemeMode(profileDarkMode);

      localStorage.setItem("GeopProfileImage", imageUrl);
      localStorage.setItem("Geopusername", username);
      localStorage.setItem("timezone", timezone);

      if (profile.language) {
        setLang(profile.language);
      }
    } catch (error) {
      console.error(error);
      showWarning("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!idUser) return;

    Promise.all([
      loadSidebarPinnedPreference(idUser),
      loadSidebarAppearancePreference(idUser),
    ])
      .then(([pinned, appearance]) => {
        setSidebarPinned(pinned);
        persistSidebarPinnedLocally(pinned);
        dispatchSidebarPinnedChange(pinned);
        setSidebarAppearance(appearance);
        persistSidebarAppearanceLocally(appearance);
        dispatchSidebarAppearanceChange(appearance);
      })
      .catch((error) => {
        console.warn("Unable to load sidebar preferences:", error);
      });
  }, [idUser]);

  const handleLanguageChange = async (newLang: Language) => {
    if (!idUser) return;

    setLanguageSaving(true);

    try {
      const response = await fetch(`${backendUrl}/api/profile/${idUser}/update-language`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ language: newLang }),
      });

      if (!response.ok) throw new Error(`HTTP status: ${response.status}`);

      setLang(newLang);
      showSuccess("Language changed successfully");
    } catch (error) {
      showWarning("Error changing language");
    } finally {
      setLanguageSaving(false);
    }
  };

  const handleThemeChange = async (enabled: boolean) => {
    if (!idUser) return;

    setThemeSaving(true);
    setThemeMode(enabled);

    try {
      const response = await fetch(`${backendUrl}/api/profile/${idUser}/update-dark-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ theme_mode: enabled ? "1" : "0" }),
      });

      if (!response.ok) throw new Error(`HTTP status: ${response.status}`);

      localStorage.setItem("theme_mode", enabled ? "1" : "0");
      showSuccess("Theme changed successfully");
    } catch (error) {
      setThemeMode(!enabled);
      showWarning("Error changing theme");
    } finally {
      setThemeSaving(false);
    }
  };

  const handleSidebarPinnedChange = async (pinned: boolean) => {
    if (!idUser) return;

    setSidebarPinned(pinned);
    setSidebarSaving(true);
    persistSidebarPinnedLocally(pinned);
    dispatchSidebarPinnedChange(pinned);

    try {
      await saveSidebarPinnedPreference(idUser, pinned);
      showSuccess("Sidebar preference saved");
    } catch (error) {
      console.warn("Unable to save sidebar preference:", error);
      showWarning("Error saving sidebar preference");
    } finally {
      setSidebarSaving(false);
    }
  };

  const handleSidebarAppearanceChange = async (
    nextAppearance: Partial<typeof sidebarAppearance>
  ) => {
    if (!idUser) return;

    const updatedAppearance = {
      ...sidebarAppearance,
      ...nextAppearance,
    };

    setSidebarAppearance(updatedAppearance);
    setAppearanceSaving(true);
    persistSidebarAppearanceLocally(updatedAppearance);
    dispatchSidebarAppearanceChange(updatedAppearance);

    try {
      await saveSidebarAppearancePreference(idUser, updatedAppearance);
      showSuccess("Sidebar appearance saved");
    } catch (error) {
      console.warn("Unable to save sidebar appearance:", error);
      showWarning("Error saving sidebar appearance");
    } finally {
      setAppearanceSaving(false);
    }
  };

  const handleTimezoneChange = async (timezone: any) => {
    if (!idUser) return;

    const timezoneValue = typeof timezone === "string" ? timezone : timezone.value;
    setTimezoneSaving(true);

    try {
      const response = await fetch(`${backendUrl}/api/profile/${idUser}/update-timezone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ timezone: timezoneValue }),
      });

      if (!response.ok) throw new Error(`HTTP status: ${response.status}`);

      setSelectedTimezone(timezone);
      localStorage.setItem("timezone", timezoneValue);
      showSuccess("Timezone changed successfully");
    } catch (error) {
      showWarning("Error changing timezone");
    } finally {
      setTimezoneSaving(false);
    }
  };

  const saveImage = async (dataURL: string) => {
    if (!idUser) return;

    setImageSaving(true);

    try {
      const response = await fetch(`${backendUrl}/api/profile/${idUser}/upload-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dataURL }),
      });

      if (!response.ok) throw new Error("Upload failed");

      await refreshImage();
      await fetchInfo();
      showSuccess("Image updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      showWarning("Image update failed");
    } finally {
      setImageSaving(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (file.size > maxProfileImageSize) {
      showWarning("The file exceeds the maximum allowed size (2 MB). Please select a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => saveImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const deleteImage = async () => {
    if (!idUser) return;

    setImageSaving(true);

    try {
      const response = await fetch(`${backendUrl}/api/profile/${idUser}/delete-image`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Delete failed");

      const fallbackImage = `asset/images/user/blank.png?t=${Date.now()}`;
      setPathImg(fallbackImage);
      localStorage.setItem("GeopProfileImage", fallbackImage);
      await refreshImage();
      showSuccess("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      showWarning("Error deleting image");
    } finally {
      setImageSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-page-header">
        <div>
          <h1>{translate("Profile Settings")}</h1>
          <p>{translate("Manage your account preferences and display settings.")}</p>
        </div>
      </div>

      {loading && (
        <div className="profile-loading">
          <PropagateLoader color="#0d6efd" loading={loading} size={16} />
        </div>
      )}

      {userInfo && !loading && (
        <div className="profile-settings-shell">
          <Card className="profile-section">
            <Card.Body>
              <div className="profile-section-heading">
                <div>
                  <h2>{translate("Profile picture")}</h2>
                  <p>{translate("Formats png, jpg. Maximum size: 2 MB.")}</p>
                </div>
              </div>

              <div className="profile-photo-row">
                <button
                  className="profile-photo-preview"
                  type="button"
                  onClick={() => setShowModalImg(true)}
                  disabled={!pathImg}
                >
                  {pathImg && <img src={pathImg} alt={translate("Profile picture")} />}
                </button>

                <div className="profile-photo-actions">
                  <input
                    id="profileFileInput"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="d-none"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="profileFileInput" className="btn btn-primary mb-0">
                    {imageSaving && <Spinner animation="border" size="sm" className="mr-2" />}
                    {translate("Choose a photo")}
                  </label>
                  <Button variant="outline-danger" onClick={deleteImage} disabled={imageSaving}>
                    {translate("Delete photo")}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="profile-section">
            <Card.Body>
              <div className="profile-section-heading">
                <div>
                  <h2>{translate("Personal info")}</h2>
                  <p>{translate("Your account information is loaded from the database.")}</p>
                </div>
              </div>

              <Row>
                <Col xs={12} md={6} xl={3}>
                  <Form.Group>
                    <Form.Label>{translate("Username")}</Form.Label>
                    <Form.Control type="text" value={usernameValue} disabled />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} xl={3}>
                  <Form.Group>
                    <Form.Label>{translate("Email address")}</Form.Label>
                    <Form.Control type="email" value={emailValue} disabled />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="profile-section">
            <Card.Body>
              <div className="profile-section-heading">
                <div>
                  <h2>{translate("Appearance")}</h2>
                  <p>{translate("Customize the interface, sidebar and navigation style.")}</p>
                </div>
              </div>

              <div className="profile-appearance-grid">
                <div className="profile-setting-panel profile-timezone-panel">
                  <div className="profile-setting-header">
                    <div>
                      <h3>{translate("Time Zone")}</h3>
                      <p>{translate("Choose the timezone used for dates and reports.")}</p>
                    </div>
                    {timezoneSaving && <Spinner animation="border" size="sm" />}
                  </div>
                  <div className="profile-timezone-control">
                    <TimezoneSelect
                      labelStyle="abbrev"
                      value={selectedTimezone}
                      onChange={handleTimezoneChange}
                    />
                    <Button
                      variant="outline-info"
                      onClick={() =>
                        handleTimezoneChange(Intl.DateTimeFormat().resolvedOptions().timeZone)
                      }
                      disabled={timezoneSaving}
                    >
                      {translate("Reset")}
                    </Button>
                  </div>
                </div>

                <div className="profile-setting-panel profile-language-panel">
                  <div className="profile-setting-header">
                    <div>
                      <h3>{translate("Language")}</h3>
                      <p>{translate("Interface language")}</p>
                    </div>
                    {languageSaving && <Spinner animation="border" size="sm" />}
                  </div>
                  <NavDropdown
                    title={
                      <span>
                        <img src={`asset/images/small/flag-${lang}.png`} alt={lang} />
                        <span> {translate(languages[lang as Language])}</span>
                      </span>
                    }
                    id="profile-language-dropdown"
                    className="profile-language-dropdown"
                  >
                    {Object.keys(languages).map((key) => {
                      const languageKey = key as Language;

                      return (
                        <NavDropdown.Item
                          key={languageKey}
                          onClick={() => handleLanguageChange(languageKey)}
                          disabled={languageSaving}
                        >
                          <img
                            src={`asset/images/small/flag-${languageKey}.png`}
                            alt={`img-flag-${languageKey}`}
                            className="img-fluid image-flag mr-2"
                          />
                          {translate(languages[languageKey])}
                        </NavDropdown.Item>
                      );
                    })}
                  </NavDropdown>
                </div>

                <button
                  type="button"
                  className={`profile-toggle-card profile-theme-card ${isDarkMode ? "is-active" : ""}`}
                  onClick={() => handleThemeChange(!isDarkMode)}
                  disabled={themeSaving}
                >
                  <span className="profile-toggle-card-icon">
                    <i className={`las ${isDarkMode ? "la-moon" : "la-sun"}`} />
                  </span>
                  <span>
                    <strong>{isDarkMode ? translate("Dark theme") : translate("Light theme")}</strong>
                    <small>{translate("Adjust the interface appearance.")}</small>
                  </span>
                  <Form.Switch
                    id="darkmode-toggle"
                    className="profile-switch"
                    checked={isDarkMode}
                    disabled={themeSaving}
                    onChange={(event) => handleThemeChange(event.target.checked)}
                    onClick={(event) => event.stopPropagation()}
                  />
                </button>

                <div className="profile-setting-panel profile-sidebar-panel">
                  <div className="profile-setting-header">
                    <div>
                      <h3>{translate("Sidebar")}</h3>
                      <p>{translate("Keep the sidebar fixed when navigating.")}</p>
                    </div>
                    {sidebarSaving && <Spinner animation="border" size="sm" />}
                  </div>
                  <div className="profile-inline-setting">
                    <span>{translate("Keep sidebar pinned")}</span>
                    <Form.Switch
                      id="sidebar-pinned-toggle"
                      className="profile-switch profile-switch-inline"
                      checked={sidebarPinned}
                      disabled={sidebarSaving}
                      onChange={(event) => handleSidebarPinnedChange(event.target.checked)}
                    />
                  </div>
                </div>

                <div className="profile-setting-panel profile-sidebar-color-panel">
                  <div className="profile-setting-header">
                    <div>
                      <h3>{translate("Sidebar color")}</h3>
                      <p>{translate("Choose a sidebar color for light and dark mode.")}</p>
                    </div>
                    {appearanceSaving && <Spinner animation="border" size="sm" />}
                  </div>
                  <div className="profile-choice-row">
                    {sidebarColorOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={`profile-color-choice ${
                          sidebarAppearance.colorMode === option.value ? "is-active" : ""
                        }`}
                        onClick={() => handleSidebarAppearanceChange({ colorMode: option.value })}
                        disabled={appearanceSaving}
                      >
                        <span
                          className="profile-color-swatch"
                          style={{ background: option.swatch }}
                        />
                        <span>{translate(option.label)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="profile-setting-panel profile-sidebar-icon-panel">
                  <div className="profile-setting-header">
                    <div>
                      <h3>{translate("Icon model")}</h3>
                      <p>{translate("Choose how sidebar icons should appear.")}</p>
                    </div>
                    {appearanceSaving && <Spinner animation="border" size="sm" />}
                  </div>
                  <div className="profile-choice-row">
                    {sidebarIconOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={`profile-icon-choice ${
                          sidebarAppearance.iconMode === option.value ? "is-active" : ""
                        }`}
                        onClick={() => handleSidebarAppearanceChange({ iconMode: option.value })}
                        disabled={appearanceSaving}
                      >
                        <i className={option.icon} />
                        <span>{translate(option.label)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      <Modal show={showModalImg} onHide={() => setShowModalImg(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{translate("Preview Image")}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          {pathImg && (
            <img
              src={pathImg}
              alt={translate("Preview Image")}
              className="img-fluid"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;
