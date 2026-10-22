export type NotificationTypeConfig = {
  group: string;
  label: string;
};

/* ============================================================
   TYPES DE NOTIFICATIONS
   ============================================================ */

export const notificationTypes = {
  /* ==========================================================
     ÉCHÉANCES / MAINTENANCE / HSE / ADMINISTRATIF
     ========================================================== */

  1: {
    group: "Échéances",
    label: "Permis conducteur",
  },

  2: {
    group: "Échéances",
    label: "Assurance véhicule",
  },

  3: {
    group: "Maintenance",
    label: "Entretien",
  },

  4: {
    group: "Échéances",
    label: "Formation",
  },

  5: {
    group: "HSE",
    label: "Extincteur",
  },

  6: {
    group: "Échéances",
    label: "Contrôle technique",
  },

  7: {
    group: "Administratif",
    label: "Vignette",
  },

  8: {
    group: "Maintenance",
    label: "Vidange",
  },

  /* ==========================================================
     VÉHICULE
     ========================================================== */

  9: {
    group: "Véhicules",
    label: "Sinistre",
  },

  /* ==========================================================
     HSE
     ========================================================== */

  10: {
    group: "HSE",
    label: "Accident",
  },

  11: {
    group: "HSE",
    label: "Infraction",
  },

  12: {
    group: "HSE",
    label: "Avertissement",
  },

  13: {
    group: "HSE",
    label: "Contrôle véhicule",
  },

  14: {
    group: "HSE",
    label: "Non-conformité",
  },

  /* ==========================================================
     MAINTENANCE / GMAO
     ========================================================== */

  15: {
    group: "Maintenance",
    label: "Intervention",
  },

  16: {
    group: "Maintenance",
    label: "Intervention terminée",
  },

  17: {
    group: "Maintenance",
    label: "Intervention en retard",
  },

  18: {
    group: "Maintenance",
    label: "Entretien planifié",
  },

  19: {
    group: "Maintenance",
    label: "Pneu",
  },

  20: {
    group: "Maintenance",
    label: "Batterie",
  },

  21: {
    group: "Maintenance",
    label: "Réparation",
  },

  /* ==========================================================
     MISSIONS
     ========================================================== */

  22: {
    group: "Missions",
    label: "Ordre de mission",
  },

  23: {
    group: "Missions",
    label: "Mission affectée",
  },

  24: {
    group: "Missions",
    label: "Mission modifiée",
  },

  25: {
    group: "Missions",
    label: "Mission annulée",
  },

  26: {
    group: "Missions",
    label: "Mission terminée",
  },

  /* ==========================================================
     REPORTING
     ========================================================== */

  27: {
    group: "Reporting",
    label: "Rapport de mission",
  },

  28: {
    group: "Reporting",
    label: "Rapport soumis",
  },

  29: {
    group: "Reporting",
    label: "Rapport validé",
  },

  30: {
    group: "Reporting",
    label: "Rapport refusé",
  },

  31: {
    group: "Reporting",
    label: "Rapport disponible",
  },

  /* ==========================================================
     DOCUMENTS
     ========================================================== */

  32: {
    group: "Documents",
    label: "Document ajouté",
  },

  33: {
    group: "Documents",
    label: "Document modifié",
  },

  34: {
    group: "Documents",
    label: "Document supprimé",
  },

  35: {
    group: "Documents",
    label: "Document à échéance",
  },

  36: {
    group: "Documents",
    label: "Document expiré",
  },

  /* ==========================================================
     CONDUCTEURS
     ========================================================== */

  37: {
    group: "Conducteurs",
    label: "Conducteur ajouté",
  },

  38: {
    group: "Conducteurs",
    label: "Conducteur modifié",
  },

  39: {
    group: "Conducteurs",
    label: "Affectation conducteur",
  },

  40: {
    group: "Conducteurs",
    label: "Désaffectation conducteur",
  },

  /* ==========================================================
     VÉHICULES
     ========================================================== */

  41: {
    group: "Véhicules",
    label: "Véhicule ajouté",
  },

  42: {
    group: "Véhicules",
    label: "Véhicule modifié",
  },

  43: {
    group: "Véhicules",
    label: "Véhicule supprimé",
  },

  44: {
    group: "Véhicules",
    label: "Mise hors service",
  },

  45: {
    group: "Véhicules",
    label: "Remise en service",
  },

  /* ==========================================================
     PARC
     ========================================================== */

  46: {
    group: "Parc",
    label: "Affectation parc",
  },

  47: {
    group: "Parc",
    label: "Changement groupe",
  },

  /* ==========================================================
     CARBURANT
     ========================================================== */

  48: {
    group: "Carburant",
    label: "Plein carburant",
  },

  49: {
    group: "Carburant",
    label: "Consommation anormale",
  },

  50: {
    group: "Carburant",
    label: "Niveau faible",
  },

  /* ==========================================================
     STOCK
     ========================================================== */

  51: {
    group: "Stock",
    label: "Stock faible",
  },

  52: {
    group: "Stock",
    label: "Rupture de stock",
  },

  53: {
    group: "Stock",
    label: "Entrée stock",
  },

  54: {
    group: "Stock",
    label: "Sortie stock",
  },

  /* ==========================================================
     ACHATS
     ========================================================== */

  55: {
    group: "Achats",
    label: "Demande de pièce",
  },

  56: {
    group: "Achats",
    label: "Demande acceptée",
  },

  57: {
    group: "Achats",
    label: "Demande refusée",
  },

  58: {
    group: "Achats",
    label: "Bon de réception",
  },

  59: {
    group: "Achats",
    label: "Avoir",
  },

  /* ==========================================================
     CONTRATS
     ========================================================== */

  60: {
    group: "Contrats",
    label: "Contrat à échéance",
  },

  61: {
    group: "Contrats",
    label: "Contrat expiré",
  },

  /* ==========================================================
     ADMINISTRATIF
     ========================================================== */

  62: {
    group: "Administratif",
    label: "Taxe",
  },

  63: {
    group: "Administratif",
    label: "Carte",
  },

  /* ==========================================================
     UTILISATEURS
     ========================================================== */

  64: {
    group: "Utilisateurs",
    label: "Utilisateur créé",
  },

  65: {
    group: "Utilisateurs",
    label: "Rôle modifié",
  },

  /* ==========================================================
     SÉCURITÉ
     ========================================================== */

  66: {
    group: "Sécurité",
    label: "Connexion",
  },

  67: {
    group: "Sécurité",
    label: "Tentative suspecte",
  },

  /* ==========================================================
     SYSTÈME
     ========================================================== */

  68: {
    group: "Système",
    label: "Import terminé",
  },

  69: {
    group: "Système",
    label: "Import échoué",
  },

  70: {
    group: "Système",
    label: "Synchronisation",
  },

  71: {
    group: "Système",
    label: "Erreur",
  },


  72: {
  group: "Système",
  label: "Mise à jour plateforme",
},


} as const;

/* ============================================================
   TYPE DES IDS DISPONIBLES
   ============================================================ */

export type NotificationTypeId =
  keyof typeof notificationTypes;

/* ============================================================
   RÉCUPÉRER LE TYPE
   ============================================================ */

export const getNotificationType = (
  idType?: number | null
): NotificationTypeConfig => {
  if (
    idType === undefined ||
    idType === null
  ) {
    return {
      group: "Autre",
      label: "Notification",
    };
  }

  const numericId =
    Number(idType);

  if (
    !Number.isFinite(numericId)
  ) {
    return {
      group: "Autre",
      label: "Notification",
    };
  }

  const config =
    notificationTypes[
      numericId as NotificationTypeId
    ];

  if (!config) {
    return {
      group: "Autre",
      label: "Notification",
    };
  }

  return {
    group: config.group,
    label: config.label,
  };
};

/* ============================================================
   RÉCUPÉRER SEULEMENT LE GROUPE
   ============================================================ */

export const getNotificationGroup = (
  idType?: number | null
): string => {
  return getNotificationType(
    idType
  ).group;
};

/* ============================================================
   RÉCUPÉRER SEULEMENT LE LABEL
   ============================================================ */

export const getNotificationLabel = (
  idType?: number | null
): string => {
  return getNotificationType(
    idType
  ).label;
};