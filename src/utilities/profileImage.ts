import type { SyntheticEvent } from "react";

export const defaultProfileImage = "/asset/images/user/blank.png";

export function buildProfileImageUrl(imagePath?: string | null): string {
  const path = imagePath?.trim().replace(/^\/+/, "");
  // The API stores the logo path after a profile photo is deleted.
  if (!path || path === "asset/images/logo.png" || path === "asset/images/user/blank.png") {
    return "";
  }
  return `https://geotrackin.com/react/public/${path}?t=${Date.now()}`;
}

export function showDefaultProfileImage(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.getAttribute("src") !== defaultProfileImage) {
    image.src = defaultProfileImage;
  }
}
