# Getting Started with Create React App

## Retour Geoparc → Geotracking

Le bouton GEOTRACKING de la barre supérieure vérifie les deux sessions auprès
de l'API commune avant le retour. Elles doivent être valides et appartenir au
même utilisateur actif. Il ne crée pas de droits Geotracking à partir d'un
compte Geoparc et ne transmet aucune clé dans l'URL. Si la session Geotracking
est expirée ou correspond à un autre compte, reconnectez-vous à ce compte dans
Geotracking puis utilisez à nouveau le bouton GEOPARC.

La route `POST /api/returnGeoTrackingFromSession` du dépôt Geotracking doit être
disponible pour utiliser le bouton.

`REACT_APP_GEOTRACKING_URL` est lu par le frontend à la compilation : il désigne
l'adresse du frontend Geotracking, pas celle de l'API. Sans cette variable, la
destination est `https://geotrackin.com` en hébergement distant. Sur localhost,
elle est obligatoire pour éviter d'envoyer les essais locaux en production.
Une adresse invalide ou celle de Geoparc lui-même bloque le retour avec un message.

Exemple local : Geotracking sur `http://localhost:3000`, Geoparc sur
`http://localhost:3001`, et la même API locale pour les deux applications.
Configurer `REACT_APP_GEOTRACKING_URL=http://localhost:3000` pour Geoparc et
`REACT_APP_BACKEND_URL_GEO_PARC=http://localhost:3001` pour Geotracking avant
leur démarrage. Utiliser le même hôte (`localhost`) pour les deux, puis tester
Geotracking → GEOPARC → GEOTRACKING avec un compte de test. Un changement de
compte dans un autre onglet ou une session expirée doit empêcher le retour.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
