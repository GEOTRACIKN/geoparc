import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx'; // Importer XLSX pour la génération de fichiers
import { translate } from 'pdf-lib';
import { useTranslate } from "../../hooks/LanguageProvider";
import { toast, Bounce } from 'react-toastify';
import { ProgressBar, Alert } from 'react-bootstrap';

interface FileUploadDragDropProps {
  onFileSelect: (file: File | null) => void;
  maxSize?: number;
  allowedExtensions?: string[];
}

interface POI {
  codegeof: string;
  namegeof: string;
  descriptiongeof: string;
  username_user: string;
  etatgeof: string;
  areageof: string;
  datecreategeof: string;
  tolerance: number;
}

const expectedHeaders = [
  "codegeof", "namegeof", "descriptiongeof", "areageof",
];

const FileUploadPoiDragDrop: React.FC<FileUploadDragDropProps> = ({
  onFileSelect,
  maxSize = 5 * 1024 * 1024,
  allowedExtensions = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [list_POI, setPOI] = useState<POI[]>([]);
  const [invalid_POI, setInvalidPOI] = useState<POI[]>([]); // Pour les POI invalides
  const { translate } = useTranslate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const id_user = localStorage.getItem("userID");
  const [importComplete, setImportComplete] = useState(false); 
  const [progress, setProgress] = useState(0);
  const [failedPOIs, setFailedPOIs] = useState<POI[]>([]);



  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      setErrorMessage(`The file exceeds the maximum size of ${maxSize / 1024 / 1024} MB.`);
      return false;
    }
    if (!allowedExtensions.includes(file.type)) {
      setErrorMessage(`Unsupported file type. Only ${allowedExtensions.join(', ')} files are allowed.`);
      return false;
    }
    setErrorMessage(null); // No error
    return true;
  };

  // Fonction pour vérifier si les en-têtes sont valides
  const validateHeaders = (headers: string[]): boolean => {
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      setErrorMessage(`Invalid file format. Missing headers: ${missingHeaders.join(', ')}`);
      return false;
    }
    return true;
  };

  // Fonction pour lire et analyser le CSV
  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (text) {
        Papa.parse(text as string, {
          header: true,
          skipEmptyLines: true, // Ignorer les lignes vides
          complete: (results:any) => {
            const headers = results.meta.fields || [];
            if (!validateHeaders(headers)) {
              return;
            }

            // Si les en-têtes sont valides, extraire les données
            const parsedData: POI[] = [];
            const invalidData: POI[] = [];

            results.data.forEach((row: any) => {
              const poi = {
                codegeof: row.codegeof,
                namegeof: row.namegeof,
                descriptiongeof: row.descriptiongeof,
                username_user: row.username_user,
                etatgeof: row.etatgeof,
                areageof: row.areageof,
                datecreategeof: row.datecreategeof,
                tolerance: row.tolerance,
                userid: id_user,
              };

              // Vérifier si tous les champs requis sont remplis
              if (poi.codegeof && poi.namegeof && poi.descriptiongeof && poi.areageof) {
                parsedData.push(poi); // POI valide
              } else {
                invalidData.push(poi); // POI avec attributs vides
              }
            });

            setPOI(parsedData);  // Mettre à jour list_POI
            setInvalidPOI(invalidData); // Mettre à jour invalid_POI
          },
          error: (error: any) => {
            setErrorMessage(`Error parsing file: ${error.message}`);
          },
        });
      }
    };

    reader.readAsText(file);
  };

  // Fonction pour générer le fichier CSV du rapport des POI invalides
  const generateCSVReport = () => {
    // Créer une feuille de calcul à partir des POI invalides
    const ws = XLSX.utils.json_to_sheet(invalid_POI);

    // Créer un nouveau classeur
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invalid POIs');

    // Générer et déclencher le téléchargement du fichier Excel
    XLSX.writeFile(wb, 'invalid_poi_report.xlsx');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        onFileSelect(droppedFile);
        handleFileRead(droppedFile); // Lire et analyser le fichier
      } else {
        setFile(null);
        onFileSelect(null);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileSelect(selectedFile);
        handleFileRead(selectedFile); // Lire et analyser le fichier
      } else {
        setFile(null);
        onFileSelect(null);
      }
    }
  };


  const upLoadMultiplePOIs = async (pois: POI[]) => {
    const totalPOIs = pois.length;

    // Réinitialiser les états avant de commencer l'importation
    setProgress(0);
    setFailedPOIs([]);
    setImportComplete(false);

    for (let index = 0; index < totalPOIs; index++) {
      const poi = pois[index];

      try {
        const resCreate = await fetch(`${backendUrl}/api/poi/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify({
            codegeof: poi.codegeof,
            namegeof: poi.namegeof,
            descriptiongeof: poi.descriptiongeof,
            etatgeof: "Inactive",
            areageof: poi.areageof,
            tolerance: poi.tolerance,
            userid: id_user,
          }),
        });

        if (!resCreate.ok) {
          console.warn(`Error creating POI with code ${poi.codegeof}`);
          setFailedPOIs(prev => [...prev, poi]); // Ajouter le POI échoué à la liste
          continue; // Passer au POI suivant en cas d'erreur
        }

        console.log(`POI created successfully: ${poi.codegeof}`);
      } catch (error) {
        console.error(`Error processing POI with code ${poi.codegeof}:`, error);
        setFailedPOIs(prev => [...prev, poi]); // Ajouter le POI échoué à la liste
      }

      // Mettre à jour la barre de progression
      setProgress(((index + 1) / totalPOIs) * 100);
    }

    // Mettre à jour l'état d'importation complète
    setImportComplete(true);
    // Optionnel: Réinitialiser la progression après un court délai
    setTimeout(() => {
      setProgress(0);
    }, 3000); // Réinitialiser après 3 secondes
  };

  const upLoadPOIs = (list_POI: POI[]) => {
    upLoadMultiplePOIs(list_POI)
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px dashed #00f' : '2px dashed #ccc',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          backgroundColor: dragActive ? '#f0f8ff' : '#f9f9f9',
          transition: 'background-color 0.3s',
          cursor: 'pointer',
        }}
      >
        <p>{file ? `Selected file: ${file.name}` : 'Drop a file here or click to select one'}</p>

        <input
          type="file"
          onChange={handleFileChange}
          style={{
            display: 'none',
          }}
          id="fileInput"
        />
        <label htmlFor="fileInput" style={{ cursor: 'pointer', color: '#00f' }}>
          {file ? 'Change file' : 'Select a file'}
        </label>
      </div>

      {/* Affichage du message d'erreur si nécessaire */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <div className='row mt-2'>

        {/* Affichage des POI invalides et bouton pour générer le rapport CSV */}
        {invalid_POI.length > 0 && (
          <div className="col-md-6 col-sm-12">

            <button
              className="mr-1 btn btn-outline-secondary"
              onClick={generateCSVReport}>{translate("Download Invalid POI")} ({invalid_POI.length})
            </button>
          </div>
        )}

        {/* Affichage des données POI extraites */}
        {list_POI.length > 0 && (
          <div className="col-md-6 col-sm-12">
            <button
              className='btn btn-primary  mr-1 float-right'
              onClick={() => upLoadPOIs(list_POI)}>{translate("Upload POI")} ({list_POI.length})
            </button>
          </div>

        )}
        {progress > 0 && <ProgressBar now={progress} label={`${progress.toFixed(2)}%`} className="mt-3" />}
      
        {failedPOIs.length > 0 && (
          <Alert variant="danger" className="mt-3">
            <Alert.Heading>Failed POIs:</Alert.Heading>
            <ul>
              {failedPOIs.map((failedPOI, index) => (
                <li key={index}>{failedPOI.codegeof}</li>
              ))}
            </ul>
          </Alert>
        )}
          {importComplete && (
          <Alert variant="success"  className="mt-3" style={{textAlign:"center",}}>
            Importation terminée avec succès !
          </Alert>
        )}
      </div>

    </div>
  );
};

export default FileUploadPoiDragDrop;
