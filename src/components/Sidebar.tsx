import React, { useEffect, useState } from "react";
import { useTranslate } from "./LanguageProvider";
;
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface SidebarProps {
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggleSidebar }) => {
  const { translate } = useTranslate();


  return (
  <div></div>
  );
};
export default Sidebar;
