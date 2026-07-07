import Cookies from "universal-cookie";
import { addHiddenColumn, getHiddenColumns, removeHiddenColumn } from "./functions";

const cookies = new Cookies();

export const SIDEBAR_PINNED_CHANGE_EVENT = "sidebar-pinned-change";
export const SIDEBAR_APPEARANCE_CHANGE_EVENT = "sidebar-appearance-change";
export const SIDEBAR_COOKIE_NAME = "geop_sidebar_pinned";
export const SIDEBAR_STORAGE_KEY = "geop_sidebar_pinned";
export const SIDEBAR_PREFERENCE_PAGE_ID = 0;
export const SIDEBAR_PINNED_KEY = "__geop_layout_sidebar_pinned";
export const SIDEBAR_COLOR_PREFIX = "__geop_layout_sidebar_color:";
export const SIDEBAR_ICON_PREFIX = "__geop_layout_sidebar_icon:";

export type SidebarColorMode = "light" | "dark" | "navy" | "soft";
export type SidebarIconMode = "line" | "soft" | "boxed";

export interface SidebarAppearancePreference {
  colorMode: SidebarColorMode;
  iconMode: SidebarIconMode;
}

const sidebarColorModes: SidebarColorMode[] = ["light", "dark", "navy", "soft"];
const sidebarIconModes: SidebarIconMode[] = ["line", "soft", "boxed"];

const SIDEBAR_COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365,
};

export const readStoredSidebarPinned = () => {
  const cookieValue = cookies.get(SIDEBAR_COOKIE_NAME);

  if (cookieValue === "1" || cookieValue === true) return true;
  if (cookieValue === "0" || cookieValue === false) return false;

  return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
};

export const persistSidebarPinnedLocally = (pinned: boolean) => {
  const value = pinned ? "1" : "0";

  cookies.set(SIDEBAR_COOKIE_NAME, value, SIDEBAR_COOKIE_OPTIONS);
  localStorage.setItem(SIDEBAR_STORAGE_KEY, value);
};

export const dispatchSidebarPinnedChange = (pinned: boolean) => {
  window.dispatchEvent(
    new CustomEvent(SIDEBAR_PINNED_CHANGE_EVENT, {
      detail: { pinned },
    })
  );
};

export const loadSidebarPinnedPreference = async (idUser: number) => {
  const preferences = await getHiddenColumns(idUser, SIDEBAR_PREFERENCE_PAGE_ID);
  return preferences.includes(SIDEBAR_PINNED_KEY);
};

export const saveSidebarPinnedPreference = async (idUser: number, pinned: boolean) => {
  if (!idUser) return;

  const payload = {
    id_user: idUser,
    id_page: SIDEBAR_PREFERENCE_PAGE_ID,
    column_name: SIDEBAR_PINNED_KEY,
  };

  if (pinned) {
    await addHiddenColumn(payload);
  } else {
    await removeHiddenColumn(payload);
  }
};

const isSidebarColorMode = (value: string | null): value is SidebarColorMode =>
  !!value && sidebarColorModes.includes(value as SidebarColorMode);

const isSidebarIconMode = (value: string | null): value is SidebarIconMode =>
  !!value && sidebarIconModes.includes(value as SidebarIconMode);

export const readStoredSidebarAppearance = (): SidebarAppearancePreference => {
  const colorMode = localStorage.getItem("geop_sidebar_color_mode");
  const iconMode = localStorage.getItem("geop_sidebar_icon_mode");

  return {
    colorMode: isSidebarColorMode(colorMode) ? colorMode : "light",
    iconMode: isSidebarIconMode(iconMode) ? iconMode : "line",
  };
};

export const persistSidebarAppearanceLocally = (
  appearance: SidebarAppearancePreference
) => {
  localStorage.setItem("geop_sidebar_color_mode", appearance.colorMode);
  localStorage.setItem("geop_sidebar_icon_mode", appearance.iconMode);
};

export const dispatchSidebarAppearanceChange = (
  appearance: SidebarAppearancePreference
) => {
  window.dispatchEvent(
    new CustomEvent(SIDEBAR_APPEARANCE_CHANGE_EVENT, {
      detail: appearance,
    })
  );
};

export const loadSidebarAppearancePreference = async (idUser: number) => {
  const preferences = await getHiddenColumns(idUser, SIDEBAR_PREFERENCE_PAGE_ID);
  const savedColor = preferences
    .find((preference) => preference.startsWith(SIDEBAR_COLOR_PREFIX))
    ?.replace(SIDEBAR_COLOR_PREFIX, "");
  const savedIcon = preferences
    .find((preference) => preference.startsWith(SIDEBAR_ICON_PREFIX))
    ?.replace(SIDEBAR_ICON_PREFIX, "");
  const storedAppearance = readStoredSidebarAppearance();

  return {
    colorMode:
      savedColor && isSidebarColorMode(savedColor)
        ? savedColor
        : storedAppearance.colorMode,
    iconMode:
      savedIcon && isSidebarIconMode(savedIcon)
        ? savedIcon
        : storedAppearance.iconMode,
  };
};

export const saveSidebarAppearancePreference = async (
  idUser: number,
  appearance: SidebarAppearancePreference
) => {
  if (!idUser) return;

  const preferences = await getHiddenColumns(idUser, SIDEBAR_PREFERENCE_PAGE_ID);
  const stalePreferences = preferences.filter(
    (preference) =>
      preference.startsWith(SIDEBAR_COLOR_PREFIX) ||
      preference.startsWith(SIDEBAR_ICON_PREFIX)
  );

  await Promise.all(
    stalePreferences.map((columnName) =>
      removeHiddenColumn({
        id_user: idUser,
        id_page: SIDEBAR_PREFERENCE_PAGE_ID,
        column_name: columnName,
      }).catch(() => undefined)
    )
  );

  await Promise.all([
    addHiddenColumn({
      id_user: idUser,
      id_page: SIDEBAR_PREFERENCE_PAGE_ID,
      column_name: `${SIDEBAR_COLOR_PREFIX}${appearance.colorMode}`,
    }),
    addHiddenColumn({
      id_user: idUser,
      id_page: SIDEBAR_PREFERENCE_PAGE_ID,
      column_name: `${SIDEBAR_ICON_PREFIX}${appearance.iconMode}`,
    }),
  ]);
};
