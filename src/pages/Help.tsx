// FleetManagementDocumentationWithForm.jsx
import FleetManagementDocumentation from '../components/Help/FleetManagementDocumentation ';
const backendUrl = process.env.REACT_APP_BACKEND_URL;



const Help = () => {
  return (
    <div>
      <FleetManagementDocumentation />
     
    </div>
  );
};

export default Help;
