import { useState, useEffect } from 'react';
import {Container,Card, Form, Row, Col,NavDropdown  } from 'react-bootstrap';
import '../assets/css/toggleMode.css';
import { useTranslate } from "../components/LanguageProvider";
import TimezoneSelect, { ITimezone } from 'react-timezone-select';
import { PropagateLoader } from 'react-spinners';
import { Bounce, toast } from 'react-toastify';


const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface userInfo {
  name: string;
  email: string;
  img: string;
  img_exists: boolean;
  timezone?: string;
  language?: string;
}

function Profile() {
  const id_user = localStorage.getItem("userID");
  const [pathImg, setPathImg] = useState('');
  const [emailValue, setEmailValue] = useState<string>('');
  const [usernameValue, setUsernameValue] = useState<string>('');
  const [userInfo, setUserInfo] = useState<userInfo>();
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(false);
  const { translate } = useTranslate();
  const [darkMode, setDarkMode] = useState(false);
  // Déclarer un état local pour contrôler la visibilité du label
  const [labelVisible, setLabelVisible] = useState(true);
  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const { lang, setLang } = useTranslate();
  const strLang: { [key: string]: string } = {
    en: 'English',
    fr: 'French',
    ar: 'Arabic',
    es: 'Spanish',
  };
  // Chemin vers le dossier des assets contenant les photos utilisateur
  const baseImagePath = `asset/images/user/`;
  
  const fetchInfo = async () => {
    setLoading(true);
    // Call API to fetch user info
    try {
      const response = await fetch(`${backendUrl}/api/profile/${id_user}`);
      const data = await response.json();
        try {
          if (data[0].img_exists) {
            setPathImg(`${baseImagePath}${id_user}/${data[0].img}`);
          } else {
            // Si la photo n'existe pas, retourner l'URL de la photo par défaut
            setPathImg(`${baseImagePath}1.png`); 
          }
        } catch (error) {
          console.error('Une erreur s\'est produite lors de l\'obtention de l\'URL de la photo :', error);
          setPathImg(`${baseImagePath}1.png`);
        }
        // Set state with fetched user info
      setEmailValue(data[0].email_user.toString());
      setUsernameValue(data[0].username_user.toString());
      setSelectedTimezone(data[0].timezone.toString())
      setDarkMode(data[0].dark_mode?true:false);
      setLang(data[0].language.toString());

      setUserInfo(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };
  // Récupérer les informations de l'utilisateur
  useEffect(() => {
    fetchInfo();
    const timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(timeZone);

  }, []);
  // Récupérer les informations de l'utilisateur à chaque fois que le state refreshData change
  useEffect(() => {
    if (refreshData) {
      fetchInfo();
      setRefreshData(false);
    }
  }, [refreshData]);
  // Fonction pour rafraîchir les données
  const refreshDataFunc = () => {
    setRefreshData(true);
  };

  const handleLanguageChange = async (newLang: any) => {
    try {
      const response = await fetch(`${backendUrl}/api/profile/${id_user}/update-language`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: newLang,
          })
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setLang(newLang);
        toast.success(translate("Language changed successfully"), {
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
    } catch (error) {
      toast.warn(translate("Error changing language"), {
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
    }
  };

  const handleThemeChange = async (dark_mode: any ) => {
    try {
      const response = await fetch(`${backendUrl}/api/profile/${id_user}/update-dark-mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dark_mode: dark_mode ? '1' : '0',
          })
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setDarkMode(dark_mode);
        toast.success(translate("Theme changed successfully"), {
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
      } catch (error) {
        toast.warn(translate("Error changing theme"), {
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
      }
  };


  const handelTimeZone = async (timezone: any) => {
    try {
      const response = await fetch(`${backendUrl}/api/profile/${id_user}/update-timezone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timezone: timezone.value
        })
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP! Status: ${response.status}`);
      }
      const data = await response.json();
      setSelectedTimezone(timezone)
      console.log(data);
      toast.success(translate("Timezone changed successfully"), {
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
    } catch (error) {
      toast.warn(translate("Error changing timezone"), {
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
    }
    };

  // Utilisez cette fonction pour gérer la sélection de fichier
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        saveImage(id_user, dataURL);
         // Désactiver le label après le premier chargement d'image
         setLabelVisible(false);
      };
      reader.readAsDataURL(file);
      // setPathImg(''); 
      toast.success(translate("Image updated successfully"), { 
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
    }
  };

  // Fonction pour envoyer l'image au serveur
  const saveImage = async (id_user:any, dataURL:any) => {
    try {
      console.log('fetch called');
      const response = await fetch(`${backendUrl}/api/profile/${id_user}/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataURL }),
      });
      const data = await response.json();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    refreshDataFunc();
  };

  const deleteImage = async (id_user: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/profile/${id_user}/delete-image`, {
        method: 'POST'
      });
      
      if(response.ok) {
        // Réinitialiser l'état de l'image
        setPathImg(''); 
        // Activer à nouveau le label après la suppression de l'image
        setLabelVisible(true);
        toast.success(translate("Image deleted successfully"), { 
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

      } else {
        
        toast.warn(translate("Error deleting image"), {
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
        // throw new Error('Error deleting image'); 
      }
      
    } catch (error) {
      
      console.error('Error deleting image', error);
    }
    refreshDataFunc();
  }

  return (
    <Container fluid style={{ height: '100%', backgroundColor: '#f1f7f7' }}>
    <div className="h-100 d-flex flex-column justify-justify-content-start" style={{ backgroundColor: '#f1f7f7',height: '90vh' }}>
        <h1 style={{ color: "gray", marginTop: "10px" }}>
          {translate("Profile Settings")}
        </h1>

      
      {loading && (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
          <PropagateLoader color={"#123abc"} loading={loading} size={20} />
        </div>
        )}

      {userInfo && !loading && (
        <div className='mx-5 mb-5 w-80  d-flex flex-column justify-content-between rounded-lg' style={{ border: '0.5px solid #a3f2f2', padding: '20px', backgroundColor: 'white' }}>
          <Row>
            <Col>
                <h3>{translate("Profile picture")}</h3>
                <p style={{ color: "gray" }}>
                  {translate("Formats png, jpg. Maximum size: 2 MB.")}
                </p>
              <Row className="align-items-center">
                <Col xs={10} lg={2}>
                  {pathImg && (
                    // En ajoutant ?${new Date().getTime()} à la fin de l'URL de l'image, je forcez le navigateur à récupérer une nouvelle version de l'image
                    <img className="img-thumbnail" src={`${pathImg}?${new Date().getTime()}`} alt="user" style={{ width: '250px' }} />
                  )}
                </Col>
                <Col xs={10} lg={10} className="d-flex flex-column flex-lg-row align-items-center">
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/png, image/jpeg"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="fileInput" className={`btn btn-primary mr-2 ${!labelVisible && 'd-none'}`}>
                      {translate("Choose a photo")}
                  </label>
                    <label
                      className="btn btn-outline-danger"
                      onClick={() => id_user && deleteImage(id_user)}
                    >
                      {translate("Delete photo")}
                    </label>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr className="w-100" style={{ borderTop: '2px solid gray' }} />
          <Row className="mb-3">
            <Col>
                <h3 className="font-weight-normal">
                  {translate("Personal info")}
                </h3>

              <Row style={{ display: 'flex' }}>
              <Card body style={{ color: "gray", border: "0" }}>
                    {translate(
                      'When a user wants to change their username or email address, they must send a confirmation email to validate the change.'
                    )}
            </Card>
                <form className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center my-auto" style={{ flex: '1 0 0%', marginLeft: '10px', alignItems: 'center', justifyItems: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
                  <Form.Group className='mr-3'>
                    <Form.Label>{translate('Username')}</Form.Label>
                        <Form.Control type="text"  placeholder="Username"  value={usernameValue}  onChange={(e) => setUsernameValue(e.target.value)}  disabled  />
                  </Form.Group>
                  <Form.Group className=''>
                      <Form.Label>{translate("Email address")}</Form.Label>
                    <div className="input-group  ">
                      <Form.Control type="email" placeholder='e-mail.geoparc.com' value={emailValue} onChange={(e) => setEmailValue(e.target.value)}   disabled  />
                    </div>
                  </Form.Group>
                </form>
              </Row>
            </Col>
          </Row>
          <hr className="w-100" style={{ borderTop: '2px solid gray' }} />
          <Row className='mb-3'  xs={12} >
            <Col xs={12} lg={10} className="d-flex flex-column flex-lg-row align-items-center">
            <h3 className='font-weight-normal '>{translate('Time Zone')}</h3>
              <div className="my-4 mx-2 select-wrapper">
                <TimezoneSelect labelStyle="abbrev" value={selectedTimezone} onChange={(e)=>handelTimeZone(e)} />
              </div>
              <button  className="btn btn-outline-info"  onClick={()=>handelTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)} >{translate('Reset')}</button>
            </Col>
          </Row>
          <hr className="w-100" style={{ borderTop: '2px solid gray' }} />
          <Row className='mb-3'   xs={12}>
            <Col xs={12} md={4} >
              <div style={{ marginBottom: '10px' }}>
                  <h3 className="font-weight-normal">
                    {translate("Language")}
                  </h3>
                <NavDropdown
                  title={
                    <span>
                      <img src={`asset/images/small/flag-${lang}.png`} alt={lang} />
                      <span> {strLang[lang]}</span>
                    </span>
                  }
                  id="navbarScrollingDropdown"
                  style={{ width: '180px', border: '1px solid #ccc', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}
                >
                  {Object.keys(strLang).map((key) => (
                    <NavDropdown.Item key={key} onClick={() => handleLanguageChange(key)}>
                      <img src={`asset/images/small/flag-${key}.png`} alt={`img-flag-${key}`} className="img-fluid image-flag mr-2" />
                      {strLang[key]}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              </div>
            </Col>
            <Col xs={12} md={6} className='mb-3 '>
              <div>
                  <h3 className="font-weight-normal">
                    {darkMode
                      ? translate("Dark theme")
                      : translate("Light theme")}
                  </h3>

                <div className='mt-3'>
                  <Form.Switch
                    id="darkmode-toggle"
                    checked={darkMode}
                    onChange={(e) => handleThemeChange(e.target.checked)}
                  />
                  <Form.Label htmlFor="darkmode-toggle" className="ml-3 fw-bolder">
                  </Form.Label>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
    </Container>
  
  );
  }

export default Profile