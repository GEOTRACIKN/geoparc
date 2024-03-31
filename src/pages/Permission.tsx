import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";
import { Table, Button } from "react-bootstrap";
interface Permission {
  id: number;
  permission: string;
  create: number;
  read: number;
  update: number;
  delete: number;
}

const PermissionTable: React.FC = () => {
  const { id_user, id_role } = useParams<{ id_user?: string; id_role?: string }>();
  const { translate } = useTranslate();
  const [originalData, setOriginalData] = useState<Permission[]>([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectAll, setSelectAll] = useState<{
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  }>({
    create: false,
    read: false,
    update: false,
    delete: false,
  });

 useEffect(() => {
  const fetchPermissions = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/role/permission/${id_user}/${id_role}`);
      const data = await response.json();
      setPermissions(data);
      setOriginalData(data); // Sauvegarde des données d'origine
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  fetchPermissions();
}, [backendUrl, id_user, id_role]);

  const handlePermissionCheckboxChange = (
    column: "create" | "read" | "update" | "delete" | "all"
  ) => {
    if (column === "all") {
      setSelectAll((prevSelectAll) => ({
        create: !prevSelectAll.create,
        read: !prevSelectAll.read,
        update: !prevSelectAll.update,
        delete: !prevSelectAll.delete,
      }));
  
      setPermissions((prevPermissions) =>
        prevPermissions.map((item) => ({
          ...item,
          create: !selectAll.create ? 1 : 0,
          read: !selectAll.read ? 1 : 0,
          update: !selectAll.update ? 1 : 0,
          delete: !selectAll.delete ? 1 : 0,
        }))
      );
    } else {
      setSelectAll((prevSelectAll) => ({
        ...prevSelectAll,
        [column]: !prevSelectAll[column],
      }));
  
      setPermissions((prevPermissions) =>
        prevPermissions.map((item) => ({
          ...item,
          [column]: !selectAll[column] ? 1 : 0,
        }))
      );
    }
  };
  

const handleSaveChanges = async () => {
  try {
    // Créez un tableau pour stocker les promesses de chaque requête de mise à jour
    const updatePromises = permissions.map((item) => {
      const { id, create, read, update, delete: del } = item;
      return fetch(`${backendUrl}/api/updatePermissions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user,
          id_permission: id,
          newPermissions: { can_create: create, can_read: read, can_update: update, can_delete: del },
        }),
      });
    });

    // Attendez que toutes les requêtes de mise à jour soient terminées
    await Promise.all(updatePromises);

    console.log("Modifications sauvegardées avec succès");
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des modifications:", error);
  }
};

const handlePermissionRowCheckboxChange = (id: number, select: boolean) => {
  setPermissions((prevPermissions) =>
    prevPermissions.map((item) =>
      item.id === id
        ? {
            ...item,
            create: select ? 1 : item.create === 0 ? 1 : 0,
            read: select ? 1 : item.read === 0 ? 1 : 0,
            update: select ? 1 : item.update === 0 ? 1 : 0,
            delete: select ? 1 : item.delete === 0 ? 1 : 0,
          }
        : item
    )
  );
};


  const handleResetChanges = () => {
  setPermissions(originalData);
  setSelectAll({
    create: false,
    read: false,
    update: false,
    delete: false,
  });
};

const handleCreateDeleteCheckboxChange = (id: number) => {
  setPermissions((prevPermissions) =>
    prevPermissions.map((item) =>
      item.id === id
        ? {
            ...item,
            create: item.create === 1 ? 0 : 1,
            read: 1,
            update: item.create === 1 ? 0 : 1,
            delete: item.create === 1 ? 0 : 1,
          }
        : item
    )
  );
};

const handleReadCheckboxChange = (id: number) => {
  setPermissions((prevPermissions) =>
    prevPermissions.map((item) =>
      item.id === id ? { ...item, read: item.read === 1 ? 0 : 1 } : item
    )
  );
};

const handleUpdateCheckboxChange = (id: number) => {
  setPermissions((prevPermissions) =>
    prevPermissions.map((item) =>
      item.id === id
        ? {
            ...item,
            update: item.update === 1 ? 0 : 1,
            read: item.update === 1 ? 0 : 1,
          }
        : item
    )
  );
};


return (
  <div>
     <div className="d-flex justify-content-end m-4">
     <button type="button" className="btn btn-outline-primary mr-4" onClick={handleSaveChanges}>
        {translate('Save')}
      </button>
      <button type="button" className="btn btn-outline-danger" onClick={handleResetChanges}>
        {translate('Reset')}
      </button>
    </div>
    <Table bordered hover responsive>
      <thead className="bg-white text-uppercase" >
        <tr className="light light-data">
          <th style={{ cursor: "pointer", textAlign: "left" }}>
            <div className="checkbox d-inline-block">
            <input
              type="checkbox"
              checked={Object.values(selectAll).every((value) => value)}
              onChange={() => handlePermissionCheckboxChange("all")}
            />

              <label htmlFor="checkboxAll" className="ml-4" style={{ color: "#140A57" }}>
                {translate("Permission")}
              </label>
            </div>
          </th>
          <th style={{ cursor: "pointer" }}>
              <div className="checkbox d-inline-block">
              <input
                  type="checkbox"
                  checked={selectAll.create}
                  onChange={() => handlePermissionCheckboxChange("create")}
                />
                <label htmlFor="checkbox2" className="ml-4" style={{ color: "#140A57" }}>
                  {translate("Create")}
                </label>
              </div>
            </th>
            <th style={{ cursor: "pointer" }}>
              <div className="checkbox d-inline-block">
              <input
                  type="checkbox"
                  checked={selectAll.read}
                  onChange={() => handlePermissionCheckboxChange("read")}
                />
                <label htmlFor="checkbox3" className="ml-4" style={{ color: "#140A57" }}>
                  {translate("Read")}
                </label>
              </div>
            </th>
            <th style={{ cursor: "pointer" }}>
              <div className="checkbox d-inline-block">
              <input
                  type="checkbox"
                  checked={selectAll.update}
                  onChange={() => handlePermissionCheckboxChange("update")}
                />
                <label htmlFor="checkbox4" className="ml-4" style={{ color: "#140A57" }}>
                  {translate("Update")}
                </label>
              </div>
            </th>
            <th style={{ cursor: "pointer", textAlign: "left" }}>
              <div className="checkbox d-inline-block">
              <input
                  type="checkbox"
                  checked={selectAll.delete}
                  onChange={() => handlePermissionCheckboxChange("delete")}
                />
                <label htmlFor="checkbox5" className="ml-4" style={{ color: "#140A57" }}>
                  {translate("Delete")}
                </label>
              </div>
            </th>
          </tr>
      </thead>
      <tbody className="light-body">
            {permissions.map((item) => (
              <tr key={item.id}>
               <td>
                <label>
                  <input style={{ marginRight: "10px" }}
                    type="checkbox"
                    checked={item.create === 1 || item.read === 1 || item.update === 1 || item.delete === 1}
                    onChange={(e) => handlePermissionRowCheckboxChange(item.id, e.target.checked)}
                  />
                  {item.permission}
                </label>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={item.create === 1}
                  onChange={() => handleCreateDeleteCheckboxChange(item.id)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={item.read === 1}
                  onChange={() => handleReadCheckboxChange(item.id)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={item.update === 1}
                  onChange={() => handleUpdateCheckboxChange(item.id)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={item.delete === 1}
                  onChange={() => handleCreateDeleteCheckboxChange(item.id)}
                />
              </td>
              </tr>
            ))}
      </tbody>
    </Table>
   
  </div>
);
};

export default PermissionTable;
