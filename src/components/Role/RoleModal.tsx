import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Bounce, toast } from 'react-toastify';
import { useTranslate } from "../../hooks/LanguageProvider";
import SelectUser from "./SelectUser";




const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface RoleModalProps {
  show: boolean;
  onHide: () => void;
  refreshRoles: () => void;
  idRole: number; // 0 for creation, >0 for update
}

interface UserInterface {
  id_user: number;
  nom_user: string;
  prenom_user: string;
}

interface RoleProps {
  id_role: number | null;
  id_user: number;
  description: string;
  nom_role: string;
}

const RoleModal: React.FC<RoleModalProps> = ({ show, onHide, refreshRoles, idRole }) => {

  const userID = parseInt(localStorage.getItem("GeopUserID") ?? "0");
  const [loading, setLoading] = useState<boolean>(false);
  const { translate } = useTranslate();

  let [Role, setRole] = useState<RoleProps>({
    id_role: idRole,
    id_user: 0,
    description: "",
    nom_role: "",
  });

  const [Users, setUsers] = useState<UserInterface[]>([]);
  const [usersOptions, setUsersOptions] = useState<any[]>([{ value: translate("None"), label: ("None") },]);
  const [error, setError] = useState<string>("");

  const getRole = async (idRole: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/role/find/${idRole}`);

      if (response.status === 200 && response.data.length > 0) {
        const fetchedRole = response.data[0];

        setRole({
          id_role: fetchedRole.id_role,
          id_user: fetchedRole.id_user,
          nom_role: fetchedRole.nom_role || "",
          description: fetchedRole.description || "",
        });
        console.log("Role data set:", fetchedRole);
      } else {
        setError("Failed to load role data");
      }
    } catch (error: any) {
      console.error("Error loading role data:", error.message);
      setError("An error occurred while loading the role data. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    console.log("idRole :" + idRole);
    if (show) {
      if (userID) {
        getUser(userID);
      }

      if (idRole > 0) {
        getRole(idRole);
      } else {
        resetForm();
      }
    }
  }, [show, idRole]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (idRole > 0) {
      resetForm();
      updateRole();
    } else {
      resetForm();
      await createRole(Role);
    }
  };

  const createRole = async (Role: RoleProps) => {
    try {
      const response = await fetch(`${backendUrl}/api/role/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_user: Role.id_user,
          nom_role: Role.nom_role || "",
          description: Role.description || "",
        }),
        mode: 'cors',
      });

      if (!response.ok) {

        toast.warn(translate("Can't create Role"), {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        throw new Error('Error creating group. Please try again.');

      }

      const groupResponse = await response.json();
      console.log(groupResponse);

      toast.success(translate("Role created successfully"), {
        position: "bottom-right",
        autoClose: 2400,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      onHide();
      resetForm();
      refreshRoles();
    } catch (error) {
      toast.error(translate("Can't create Role. Please try again."), {
        position: "bottom-right",
        autoClose: 2400,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error('Error Role group:', error);
    }
  };

  const resetForm = () => {
    setRole({
      id_user: 0,
      id_role: 0,
      description: "",
      nom_role: ""
    });
    setError("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;

    setRole((prevRole) => ({
      ...prevRole,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUserChange = (selectedOption: any) => {
    setRole((prevData: RoleProps | undefined) => {
      const newData: RoleProps = { ...prevData! };
      newData.id_user = selectedOption.value;
      return newData;
    });
  };

  const getUser = async (userId: any) => {
    try {
      const res = await fetch(`${backendUrl}/api/users/find/${userId}`, {
        mode: "cors",
      });

      if (!res.ok) {
        console.error("Error retrieving users");
        return;
      }

      const usersData = await res.json();
      setUsers(usersData);

      const usersOptionsData = usersData.map((user: any) => ({
        value: user.id_user,
        label: `${user.nom_user} ${user.prenom_user || ""}`,
      }));

      setUsersOptions(usersOptionsData);
    } catch (error) {
      console.error("Error retrieving users", error);
    }
  };


  const findUserById = (
    id: number
  ): { value: number; label: string } | undefined => {
    const foundUser = Users.find((user) => user.id_user === id);

    if (foundUser) {
      const { id_user, nom_user, prenom_user } = foundUser;
      return { value: id_user, label: `${nom_user} ${prenom_user || ""}` };
    }

    return undefined;
  };

  const updateRole = async () => {
    try {
      setLoading(true);

      const response = await axios.post(`${backendUrl}/api/role/update`, Role);

      if (response.status > 0) {

        toast.success(translate("Role updated successfully"), {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        resetForm();
        onHide();
        refreshRoles();
      } else {

        toast.error(translate("Can't update role. Please try again."), {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setError("Failed to update Role");
      }
    } catch (error: any) {

      if (error.response) {
        console.error("Error updating Role:", error.response.data);

        toast.error(translate("Error updating Role: ") + error.response.data.message || "Please try again.", {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setError("Error updating Role. Please try again.");
      } else if (error.request) {
        console.error("Request error updating Role:", error.request);

        toast.error(translate("No response from server. Please try again."), {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setError("No response from server. Please try again.");
      } else {
        console.error("Error updating Role:", error.message);

        toast.error(translate("An error occurred while updating the Role. Please try again."), {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setError("An error occurred while updating the Role. Please try again.");
      }
    } finally {

      setLoading(false);
    }
  };


  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
        resetForm();
      }} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="las la-check-circle" style={{ color: "orange" }}>{" "}</i>
          {idRole > 0 ? translate("Edit role") : translate("Add role")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="row" style={{ marginTop: 10 }}>
            <Form.Group className="col-md-2 col-sm-2">
              <Form.Label>{translate('Role name')}</Form.Label>
            </Form.Group>
            <Form.Group className="col-md-10 col-sm-10">
              <Form.Control
                type="text"
                id="nom_role"
                name="nom_role"
                placeholder={translate('Set name of this Role')}
                value={Role.nom_role}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <Form.Group className="col-md-2 col-sm-2">
              <Form.Label> {translate('Description')}</Form.Label>
            </Form.Group>
            <Form.Group className="col-md-10 col-sm-10">
              <Form.Control
                as="textarea"
                id="description"
                name="description"
                placeholder={translate('Note for role')}
                value={Role.description}
                onChange={handleChange}
                rows={3}
              />
            </Form.Group>
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <Form.Group className="col-md-2 col-sm-2">
              <Form.Label> {translate('User')}</Form.Label>
            </Form.Group>
            <Form.Group className="col-md-10 col-sm-10">
              <SelectUser
                controlId="user"
                name={"user"}
                id={"user"}
                label={translate("User Assignment")}
                icon="user"
                options={usersOptions}
                valueType={{
                  value: Role.id_user,
                  label: findUserById(Role.id_user || 0)?.label || translate("None"),
                }}
                onChange={handleUserChange}

              />
            </Form.Group>
          </div>

          {error && <div className="text-danger" style={{ textAlign: "center" }}>{error}</div>}
          <div className="text-center" style={{ marginTop: 20 }}>
            <Button variant="secondary" onClick={onHide} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : translate("Cancel")}
            </Button>
            <Button type="submit" variant="primary" style={{ marginLeft: 10, }} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : idRole > 0 ? translate("Edit") : translate("Add")}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RoleModal;
