const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const fs = require('fs');
const path = require('path');

router.get('/profile/:id_user', async (req, res) => {
  const { id_user } = req.params;

  Profile.getInfoUser(id_user, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    console.log(results);
    // Vérifier si le fichier image existe localement
    const imgPath = path.join(__dirname, '..', '..', 'public', 'asset', 'images', 'user', id_user, `${results[0].img}`);
    results[0].img_exists = fs.existsSync(imgPath);

    res.json(results);
  });
});

router.post('/profile/:id_user/upload-image', async (req, res) => {
  const { id_user } = req.params;
  const { dataURL } = req.body;

  // Décoder la dataURL en données binaires de l'image
  const base64Data = dataURL.replace(/^data:image\/\w+;base64,/, '');
  const imgBuffer = Buffer.from(base64Data, 'base64');

  // Chemin où vous souhaitez enregistrer l'image
  const userFolderPath = path.join(__dirname, '..', '..', 'public', 'asset', 'images', 'user', id_user);
  const imgPath = path.join(userFolderPath, `${id_user}.png`);

  try {
    // Vérifiez si le dossier de l'utilisateur existe, sinon, créez-le
    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    // Enregistrez l'image sur le serveur
    fs.writeFileSync(imgPath, imgBuffer);
    console.log('Image saved successfully:', imgPath);

    // Répondre avec le chemin de l'image enregistrée
    res.json({ success: true });

    Profile.updateImgUser(id_user, `${id_user}.png`, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur mise à jour image' });
      }
    });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


router.post('/profile/:id_user/delete-image', async (req, res) => {
  const { id_user } = req.params;

  // Chemin de l'image à supprimer
  const imgPath = path.join(__dirname, '..', '..', 'public', 'asset', 'images', 'user', id_user, `${id_user}.png`);

  try {
    // Vérifier si le fichier existe
    if (fs.existsSync(imgPath)) {
      // Supprimer le fichier
      fs.unlinkSync(imgPath);
      console.log('Image deleted successfully:', imgPath);

      // Mettre à jour la base de données pour supprimer le lien vers l'image
      Profile.deleteImgUser(id_user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur suppression image' });
        }
      });

      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'L\'image n\'existe pas' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
router.post('/profile/:id_user/update-timezone', async (req, res) => {
  const { id_user } = req.params;
  const { timezone } = req.body;
  Profile.updateTimeZone(id_user, timezone, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur mise à jour timezone' });
    }
    res.json({ success: true }); // Envoyer la réponse JSON après la mise à jour
  });
});

router.post('/profile/:id_user/update-language', async (req, res) => {
  const {id_user} = req.params;
  const {language} = req.body;
  Profile.updateLanguage(id_user,language, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur mise à jour language'})
    }
    res.json({success: true})
  })
});

router.post('/profile/:id_user/update-dark-mode',async (req, res) => {
  const {id_user} = req.params;
  const {dark_mode} = req.body;
  Profile.updateDarkMode(id_user,dark_mode, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur mise à jour language'})
    }
    res.json({success: true})
  })
})




module.exports = router;
