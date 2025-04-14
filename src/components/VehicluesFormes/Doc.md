Le composant `Vehicles_forms.tsx` est le composant principal qui gère un formulaire multi-étapes pour l'ajout d'un véhicule. Il utilise une structure de wizard (assistant) pour guider l'utilisateur à travers différentes étapes du formulaire.

**Structure générale :**

- `Step1.tsx` à `Step4.tsx` : Ces composants représentent les différentes étapes du formulaire. Chaque étape collecte des informations spécifiques sur le véhicule.

- `Step5.tsx` : Ce composant est utilisé pour visualiser toutes les données collectées dans les étapes précédentes. Il offre un récapitulatif complet avant la soumission finale.

- `ActionButtons.tsx` : Ce composant gère les boutons de navigation entre les étapes et contient la logique pour l'envoi des données à l'API. C'est ici que la soumission finale du formulaire devrait être implémentée.

- `MultiStepProgressBar` : Ce composant affiche une barre de progression visuelle pour indiquer à l'utilisateur sa progression dans le formulaire.

**Flux de données :**

- Chaque étape (`Step1` à `Step4`) collecte des données spécifiques.
- Les données sont passées entre les étapes via le state du composant parent (`Vehicles_forms.tsx`).
- Le `Step5.tsx` reçoit toutes les données collectées pour affichage.
- `ActionButtons.tsx` gère la navigation et la soumission finale des données.

**Gestion de l'état :**

- Le state principal est géré dans `Vehicles_forms.tsx`.
- Les données du formulaire sont mises à jour à chaque étape.
- L'état de progression (`activeStep`) est également géré dans le composant principal.

**Navigation :**

- Les fonctions `nextStep`, `previousStep`, et `lastStep` gèrent la navigation entre les étapes.
- Ces fonctions sont passées aux composants enfants via les props.

**Validation des données :**

- Chaque étape (`Step1` à `Step4`) contient une fonction `validate()` qui vérifie la validité des données saisies avant de passer à l'étape suivante.
  
- La fonction `validate()` dans `Step1.tsx` (lignes 174-200) sert d'exemple pour les autres étapes :
  - Elle vérifie si chaque champ requis est rempli correctement.
  - Si un champ n'est pas valide, elle définit un message d'erreur spécifique.
  - Si tous les champs sont valides, elle efface le message d'erreur, met à jour les données de l'utilisateur via le callback, et passe à l'étape suivante.

- Cette approche de validation par étape garantit que toutes les données nécessaires sont collectées et valides avant de progresser dans le formulaire.

- La validation spécifique à chaque étape permet une gestion fine des erreurs et une meilleure expérience utilisateur en fournissant des retours immédiats sur les données saisies.

- Cette méthode de validation renforce la fiabilité des données collectées tout au long du processus de formulaire multi-étapes.


**Soumission des données :**

- La soumission finale des données à l'API devrait être implémentée dans `ActionButtons.tsx`.
- Cette approche centralise la logique de soumission et permet une gestion plus facile des erreurs et des réponses de l'API.

Cette structure permet une séparation claire des responsabilités entre la collecte des données, la visualisation, et la soumission, tout en maintenant un flux de données cohérent à travers l'application.


-----

### Route: `/insertVehicule`

**Méthode:** `POST`

**Description:**  
Cette route permet d'insérer un nouveau véhicule et ses coûts associés dans la base de données. Le processus se déroule en deux étapes :
1. **Insertion du véhicule** : Les données du véhicule sont insérées dans la table `vehicule`.
2. **Insertion des coûts** : Après avoir récupéré l'ID du véhicule nouvellement inséré, cet ID est utilisé pour insérer les données de coût dans la table `gp_vehicle_cost`.

**Corps de la requête :**  
- `Immatriculation` : Immatriculation du véhicule.
- `Acquisition` : Type d'acquisition du véhicule.
- `Categorie` : Catégorie du véhicule.
- `Etat` : État du véhicule.
- `Type` : Type du véhicule.
- `TypeCarburant` : Type de carburant du véhicule.
- `Marque` : Marque du véhicule.
- `Modele` : Modèle du véhicule.
- `NameParc` : Nom du parc où le véhicule est enregistré.
- `Driver` : ID du conducteur du véhicule.
- `AffectationVehicl` : Statut du véhicule (en service ou non).
- `Moteur` : Type de moteur du véhicule.
- `Capacite_res` : Capacité de réservoir du véhicule.
- `Consom_moyenne` : Consommation moyenne du véhicule.
- `Codification` : Code de codification du véhicule.
- `Kilom` : Kilométrage du véhicule.
- `Payback_Period` : Période de remboursement (utilisé pour la couleur du véhicule).
- `Psn` : Numéro PSN du véhicule.
- `Year` : Année du véhicule.
- `Power` : Puissance du véhicule.
- `MaximumAllowedTotal` : Poids total autorisé du véhicule.
- `CirculationDate` : Date de circulation du véhicule.
- `Longueur` : Longueur du véhicule.
- `NumChassis` : Numéro de châssis du véhicule.
- `Largeur` : Largeur du véhicule.
- `Hauteur` : Hauteur du véhicule.
- `NbrePorte` : Nombre de portes du véhicule.
- `NbrePlace` : Nombre de places du véhicule.
- `Weight` : Poids du véhicule.
- `co2` : Émission de CO2 du véhicule.
- `AgenceAssurance` : Agence d'assurance du véhicule.
- `CoutAss` : Coût de l'assurance du véhicule.
- `TypeAssurance` : Type d'assurance du véhicule.
- `DelaiAssurance` : Délai de l'assurance du véhicule.
- `DateDebutAssurance` : Date de début de l'assurance.
- `ReferenceAssurance` : Référence de l'assurance.
- `DateExpAssurance` : Date d'expiration de l'assurance.
- `EtabControle` : État du contrôle technique.
- `CoutControle` : Coût du contrôle technique.
- `ReferenceControle` : Référence du contrôle technique.
- `DateControle` : Date du contrôle technique.
- `DateFinControle` : Date de fin du contrôle technique.
- `NumVignette` : Numéro de vignette du véhicule.
- `DateVignette` : Date de la vignette du véhicule.
- `CoutVignette` : Coût de la vignette.
- `id_user` : ID de l'utilisateur.

**Flux :**
1. **Insertion du véhicule :** Les données du véhicule sont insérées dans la table `vehicule`. L'ID du véhicule nouvellement inséré est récupéré.
2. **Insertion des coûts :** L'ID du véhicule est utilisé pour insérer les données de coût dans la table `gp_vehicle_cost`.

**Réponses :**
- `201` : Création réussie du véhicule et des coûts.
- `500` : Erreur lors de l'insertion.

---

### Modèle: `insertVehicule` et `insertGpVehicleCost`

**`insertVehicule`**

- **Description :**  
  Insère un nouveau véhicule dans la base de données.

- **Paramètre :**
  - `vehiculeData` : Objet contenant les données du véhicule.

- **Retour :**  
  `Promise` résolvant les résultats de l'insertion, y compris l'ID du véhicule inséré.

**`insertGpVehicleCost`**

- **Description :**  
  Insère les coûts associés au véhicule dans la base de données, en utilisant l'ID du véhicule obtenu lors de l'insertion précédente.

- **Paramètre :**
  - `costData` : Objet contenant les données de coût du véhicule.

- **Retour :**  
  `Promise` résolvant l'ID du coût inséré.

- **Conditions :**  
  La requête SQL et les paramètres varient selon le type de coût (Leasing, Location, Achat).

