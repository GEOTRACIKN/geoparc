import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Bounce, toast } from "react-toastify";
import { useTranslate } from "../../hooks/LanguageProvider";
import FileUploadPoiDragDrop from "./FileUploadPoiDragDrop";

const backendUrl = process.env.REACT_APP_BACKEND_URL;


interface POI {
    idgeof: number;
    codegeof: string;
    namegeof: string;
    descriptiongeof: string;
    username_user: string;
    etatgeof: string;
    areageof: string;
    datecreategeof: string;
  }

interface GeoFenceUploadModalProps {
  show: boolean;
  onHide: () => void;
  refreshGeofences: () => void;
}

const GeoFenceUploadModal: React.FC<GeoFenceUploadModalProps> = ({
  show,
  onHide,
  refreshGeofences,
}) => {
  const userID = localStorage.getItem("GeopUserID");
  const [loading, setLoading] = useState<boolean>(false);
  const { translate } = useTranslate();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");


  const [list_POI, setPOI] = useState<POI[]>([]);

  // Gestion de l'upload de fichier
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      // Validation du fichier (par exemple, vérifier l'extension .geojson ou .csv)
      const validExtensions = ["geojson", "csv"];
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      if (fileExtension && validExtensions.includes(fileExtension)) {
        setFile(selectedFile);
      } else {
        toast.error(translate("Invalid file format. Please upload a .geojson or .csv file."));
        setFile(null);
      }
    }
  };

  // Gestion de l'envoi du formulaire
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast.error(translate("Please upload a geofence file."));
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userID", String(userID));

      const res = await fetch(`${backendUrl}/api/geofence/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload geofence.");
      }

      toast.success(translate("Geofence uploaded successfully!"), {
        transition: Bounce,
      });
      refreshGeofences();
      onHide();
    } catch (error) {
      console.error("Error uploading geofence:", error);
      toast.error(translate("Failed to upload geofence."));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file: File | null) => {
    setPOI((prevState) => ({
      ...prevState,
    }));
  };


  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {translate("Upload Geofence File")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <FileUploadPoiDragDrop
            onFileSelect={handleFileUpload}
            maxSize={2 * 1024 * 1024} // Limit à 2MB
          />
      </Modal.Body>
    </Modal>
  );
};

export default GeoFenceUploadModal;
