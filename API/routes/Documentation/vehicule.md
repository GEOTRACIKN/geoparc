# Documentation de l'API 
###  **Récupération de la liste des véhicules**

URL : /api/vehicules/:id_user/:page/:limit

**Méthode HTTP : POST**

**Description :** Cette route permet de récupérer une liste paginée des véhicules d'un utilisateur spécifique avec des options de tri et de recherche.

**Paramètres d'URL**

  -  **id_user (int)** : Identifiant de l'utilisateur.
  -  **page (int)** : Numéro de la page à récupérer.
  -  **limit (int)** : Nombre de résultats par page.


**Corps de la requête (JSON)**

```json
{
  "sortColumn": string, // Colonne par laquelle trier les résultats (par exemple, id_vhc, license_vhc)
  "sortOrder": string, // Ordre de tri (asc pour ascendant, desc pour descendant)
  "searchColumn": string, // Colonne à utiliser pour la recherche
  "searchValue": string // Valeur à rechercher dans la colonne spécifiée
}
```

**Exemple de requête**

```bash
// Exemple de requête pour obtenir la première page de 15 véhicules, triée par 'id_vhc' en ordre décroissant, où 'license_vhc' contient 'ABC123'.

POST http://localhost:5000/api/vehicules/1/1/15
{
  "sortColumn": "id_vhc",
  "sortOrder": "desc",
  "searchColumn": "license_vhc",
  "searchValue": "ABC123"
}
```

**Réponses :**

  - **Succès (200 OK) :** Retourne un objet JSON contenant les véhicules.

  ```json
   [
    {
        "id_vhc": 61,
        "type_vhc": "Car",
        "model_vhc": "Corolla",
        "license_vhc": "ABC123",
        "color_vhc": "Black",
        "cond_vhc": "New",
        "id_driver": null,
        "driver_first_name": null,
        "driver_last_name": null
    },
    {
        "id_vhc": 1,
        "type_vhc": "Voiture",
        "model_vhc": "Corolla",
        "license_vhc": "ABC123",
        "color_vhc": "Noir",
        "cond_vhc": "Neuf",
        "id_driver": 1,
        "driver_first_name": "Jean",
        "driver_last_name": "Dupont"
    }
]
  ```

  - **Erreur (500 Internal Server Error) :** Retourne un objet JSON avec un message d'erreur.
``` json
  {
  "error": "Erreur lors de la récupération des véhicules. Détails de l'erreur."
  }
```

**Notes**

  -  Les paramètres **\`sortColumn\`** et **\`searchColumn\`** doivent correspondre aux noms de colonnes valides dans la base de données.
  -  Les valeurs de **\`sortOrder\`** doivent être **\`asc\`** ou **\`desc\`**.
  -  Si **\`searchColumn\`** et searchValue ne sont pas spécifiés, tous les véhicules sont retournés sans filtrage par recherche.



* * * 




### **Récupération du nombre total de véhicules**

URL : /api/vehicules/count/:id_user

**Méthode HTTP : POST**

**Description :** Cette route permet de récupérer le nombre total de véhicules d'un utilisateur spécifique.

**Paramètres d'URL**

  -  **id_user (int)** : Identifiant de l'utilisateur.


**Corps de la requête (JSON)**

```json
{
  "searchTerm": string, // Terme de recherche (facultatif)
  "searchType": string // Type de recherche (facultatif)
}
```

**Exemple de requête**

```bash
// Exemple de requête pour obtenir le nombre total de véhicules pour l'utilisateur 1
POST http://localhost:5000/api/vehicules/count/1
{
  "searchTerm": "ABC123",
  "searchType": "license_vhc"
}
```

**Réponses :**

  - **Succès (200 OK) :** Retourne un objet JSON contenant le nombre total de véhicules.

  ```json
   {
  "count": 10
  }
  ```

  - **Erreur (500 Internal Server Error) :** Retourne un objet JSON avec un message d'erreur.
``` json
  {
  "error": "Erreur lors de la récupération du nombre total de véhicules. Détails de l'erreur."
  }
```

**Notes**

  -  Le paramètre **`searchTerm`** est facultatif et permet de filtrer les résultats en fonction d'une valeur spécifique.
  -  Le paramètre **`searchType`** est facultatif et permet de spécifier le type de recherche (par exemple, `license_vhc` pour rechercher par plaque d'immatriculation).
  -  Si **`searchTerm`** et **`searchType`** ne sont pas spécifiés, le nombre total de véhicules vérifiés est retourné sans filtrage.
