import React, { useState } from "react";
import FurtherInformation from "./FurtherInformation";

import { Tab, TabPanel, Tabs } from "./Tabs";
import Assurance from "./Assurance";
import Vignette from "./Vignette";
import VehicleInspection from "./VehicleInspection";
import RentCar from "./RentCar";
import Leasing from "./Leasing";
import Purchase from "./Purchase";
import GeneralInformations from "./GeneralInformations";

const ProfileVehicles: React.FC<{ formState: any }> = ({ formState }) => {
  // Création d'un objet de données
  const userData = {
    nom: "Ethan Leo",
    poste: "Chef de Projet",
    followers: 7854,
    following: 5987,
    amis: 4620,
    imageProfil: "./assets/img/profile-img-1.jpg",
  };
  const [activeTab, setActiveTab] = useState<string>("FurtherInformation");

  const handleChange = (e:any) => {
    const name = e.target.name;
    const value = formState.values[name];
    e.target.value = value;
  }

  return (
    <div className="container">
      <div className="row gy-4 gy-lg-0">
        <div className="col-12 col-lg-4 col-xl-3">
          <div className="row gy-4">
            <div className="col-12">
              <div className="card widget-card border-light shadow-sm">
                <div className="card-header text-bg-primary">
                  Bienvenue, {userData.nom}
                </div>
                <div className="card-body">
                  <div className="text-center mb-3">
                    <img
                      src={userData.imageProfil}
                      className="img-fluid rounded-circle"
                      alt={userData.nom}
                    />
                  </div>
                  <h5 className="text-center mb-1">{userData.nom}</h5>
                  <p className="text-center text-secondary mb-4">
                    {userData.poste}
                  </p>
                  <ul className="list-group list-group-flush mb-4">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <h6 className="m-0">Abonnés</h6>
                      <span>{userData.followers}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <h6 className="m-0">Abonnements</h6>
                      <span>{userData.following}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <h6 className="m-0">Amis</h6>
                      <span>{userData.amis}</span>
                    </li>
                  </ul>
                  <div className="d-grid m-0">
                    <button className="btn btn-outline-primary" type="button">
                      S'abonner
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8 col-xl-9">
          <div className="card widget-card border-light shadow-sm">
            <div className="card-body p-4">
              {formState && (
                <>
                  <Tabs>
                    <Tab
                      label="Informations Générales"
                      isActive={activeTab === "GeneralInformations"}
                      onClick={() => setActiveTab("GeneralInformations")}
                    />
                    <Tab
                      label="Informations complémentaires"
                      isActive={activeTab === "FurtherInformation"}
                      onClick={() => setActiveTab("FurtherInformation")}
                    />
                    <Tab
                      label="Assurance"
                      isActive={activeTab === "Assurance"}
                      onClick={() => setActiveTab("Assurance")}
                    />
                    <Tab
                      label="Vignette"
                      isActive={activeTab === "Vignette"}
                      onClick={() => setActiveTab("Vignette")}
                    />
                    <Tab
                      label="Contrôle Technique"
                      isActive={activeTab === "VehicleInspection"}
                      onClick={() => setActiveTab("VehicleInspection")}
                    />

                    {/* -- */}
                    {formState.values.Step3 === "Leasing" && (
                      <Tab
                        label="Leasing"
                        isActive={activeTab === "Leasing"}
                        onClick={() => setActiveTab("Leasing")}
                      />
                    )}
                    {formState.values.Step3 === "Location" && (
                      <Tab
                        label="Location"
                        isActive={activeTab === "RentCar"}
                        onClick={() => setActiveTab("RentCar")}
                      />
                    )}
                    {formState.values.Step3 === "Achat" && (
                      <Tab
                        label="Achat"
                        isActive={activeTab === "Purchase"}
                        onClick={() => setActiveTab("Purchase")}
                      />
                    )}                  
                    </Tabs>

      {/* ---------------------- Conetent Tabs ----------------------------------- */}

                  <TabPanel activeTab={activeTab}
                  id="GeneralInformations"
                  >
                    <GeneralInformations
                      formState={formState}
                      handleChange={handleChange}
                    />
                  </TabPanel>
                  <TabPanel activeTab={activeTab}
                  id="FurtherInformation"
                  >
                    <FurtherInformation
                      formState={formState}
                      handleChange={handleChange}
                    />
                  </TabPanel>
                  <TabPanel activeTab={activeTab}
                  id="Assurance"
                  >
                    <Assurance
                      formState={formState}
                      handleChange={handleChange}
                    />
                  </TabPanel>
                  <TabPanel activeTab={activeTab}
                  id="Vignette"
                  >
                    <Vignette
                      formState={formState}
                      handleChange={handleChange}
                    />
                  </TabPanel>
                  <TabPanel activeTab={activeTab}
                  id="VehicleInspection"
                  >
                    <VehicleInspection
                      formState={formState}
                      handleChange={handleChange}
                    />
                  </TabPanel>

                  {/* ---- */}
                  { formState.values.Step3 === "Leasing" && ( 
                  <TabPanel activeTab={activeTab}
                  id="Leasing"
                  >
                    <Leasing
                      formState={formState}
                      handleChange={handleChange}
                    />
                  </TabPanel>
                  )}

                  {formState.values.Step3 === "Location" &&(
                    <TabPanel activeTab={activeTab}
                    id="RentCar"
                    >
                      <RentCar
                        formState={formState}
                        handleChange={handleChange}
                      />
                    </TabPanel>
                    )}

                  {formState.values.Step3 === "Achat" &&(
                  <TabPanel activeTab={activeTab}
                  id="Purchase"
                  >
                    <Purchase
                      formState={formState}
                      handleChange={handleChange}
                    />
                  </TabPanel>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVehicles;
