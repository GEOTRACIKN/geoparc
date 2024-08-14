interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

interface TabPanelProps {
  activeTab: string;
  children: React.ReactNode;
  id: string;
}



export const Tabs: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="tabs">{children}</div>;
};

export const Tab: React.FC<TabProps> = ({ label, isActive, onClick, disabled }) => {
  return (
    <button
      className={`tab ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={!disabled ? onClick : undefined} // Désactiver le clic si l'onglet est désactivé
      disabled={disabled} // Attribut HTML pour désactiver le bouton
    >
      {label}
    </button>
  );
};

export const TabContent: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  return (
    <div className="tab-content">
      {activeTab === 'Tab1' && <div>Content for Tab 1</div>}
      {activeTab === 'Tab2' && <div>Content for Tab 2</div>}
      {activeTab === 'Tab3' && <div>Content for Tab 3</div>}
    </div>
  );
};

export const TabPanel: React.FC<TabPanelProps> = ({ activeTab, children, id }) => {
  return activeTab === id ? <div className="tab-content">{children}</div> : null;
};
