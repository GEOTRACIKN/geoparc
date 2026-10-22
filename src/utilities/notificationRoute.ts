export interface NotificationRouteData {
  id_notification?: number | null;
  id_alarme?: number | null;
  id_alarm?: number | null;
  id_item?: number | null;
  id_type?: number | null;
}

export const getNotificationRoute = (
  notification: NotificationRouteData
): string => {
  const type = Number(
    notification.id_type || 0
  );

  const itemId = Number(
    notification.id_item || 0
  );

  const alarmId =
    notification.id_alarme ??
    notification.id_alarm ??
    null;

  /* ============================================================
     TYPES 1 → 8
     ÉCHÉANCES
     ============================================================ */

  if (
    type >= 1 &&
    type <= 8
  ) {
    if (alarmId) {
      return `/deadline/${alarmId}/${type}`;
    }

    return `/deadline/${type}`;
  }

  /* ============================================================
     TYPE 9
     SINISTRE VÉHICULE
     ============================================================ */

  if (type === 9) {
    return "/vehicle-sinister";
  }

  /* ============================================================
     TYPES 10 → 14
     HSE
     ============================================================ */

  if (type === 10) {
    return "/hse-dashboard";
  }

  if (type === 11) {
    return "/violation";
  }

  if (type === 12) {
    return "/warnings";
  }

  if (type === 13) {
    return "/vehicles-checks";
  }

  if (type === 14) {
    return "/hse-dashboard";
  }

  /* ============================================================
     TYPES 15 → 21
     MAINTENANCE / GMAO
     ============================================================ */

  if (type === 15) {
    return "/servicing";
  }

  if (type === 16) {
    return "/garage";
  }

  if (type === 17) {
    return "/servicing";
  }

  if (type === 18) {
    return "/planning-interviews";
  }

  if (type === 19) {
    return "/pneu";
  }

  if (type === 20) {
    return "/piece";
  }

  if (type === 21) {
    return "/garage";
  }

  /* ============================================================
     TYPES 22 → 26
     MISSIONS
     ============================================================ */

  if (
    type >= 22 &&
    type <= 26
  ) {
    if (itemId > 0) {
      return `/mission-order-manage/edit/${itemId}`;
    }

    return "/mission-order";
  }

  /* ============================================================
     TYPES 27 → 31
     REPORTING
     ============================================================ */

  if (
    type >= 27 &&
    type <= 31
  ) {
    if (itemId > 0) {
      return `/mission-report-manage/edit/${itemId}`;
    }

    return "/mission-report";
  }

  /* ============================================================
     TYPES 32 → 36
     DOCUMENTS
     ============================================================ */

  if (
    type >= 32 &&
    type <= 36
  ) {
    return "/notifications";
  }

  /* ============================================================
     TYPES 37 → 38
     CONDUCTEURS
     ============================================================ */

  if (
    type === 37 ||
    type === 38
  ) {
    if (itemId > 0) {
      return `/driver/edit/${itemId}`;
    }

    return "/drivers";
  }

  /* ============================================================
     TYPES 39 → 40
     AFFECTATION / DÉSAFFECTATION CONDUCTEUR
     ============================================================ */

  if (
    type === 39 ||
    type === 40
  ) {
    if (itemId > 0) {
      return `/vehicle/edit/${itemId}`;
    }

    return "/vehicles";
  }

  /* ============================================================
     TYPES 41 → 45
     VÉHICULES
     ============================================================ */

  if (
    type === 41 ||
    type === 42 ||
    type === 44 ||
    type === 45
  ) {
    if (itemId > 0) {
      return `/vehicle/edit/${itemId}`;
    }

    return "/vehicles";
  }

  if (type === 43) {
    return "/vehicles";
  }

  /* ============================================================
     TYPES 46 → 47
     PARC / GROUPE
     ============================================================ */

  if (
    type === 46 ||
    type === 47
  ) {
    if (itemId > 0) {
      return `/vehicle/edit/${itemId}`;
    }

    return "/vehicles";
  }

  /* ============================================================
     TYPES 48 → 50
     CARBURANT
     ============================================================ */

  if (
    type >= 48 &&
    type <= 50
  ) {
    return "/fuel_management";
  }

  /* ============================================================
     TYPES 51 → 54
     STOCK
     ============================================================ */

  if (
    type >= 51 &&
    type <= 54
  ) {
    return "/piece_stock";
  }

  /* ============================================================
     TYPES 55 → 59
     ACHATS
     ============================================================ */

  if (
    type >= 55 &&
    type <= 57
  ) {
    return "/Demandes_pieces";
  }

  if (type === 58) {
    return "/Bon_Reception";
  }

  if (type === 59) {
    return "/Avoir";
  }

  /* ============================================================
     TYPES 60 → 61
     CONTRATS
     ============================================================ */

  if (
    type >= 60 &&
    type <= 61
  ) {
    return "/contrat";
  }

  /* ============================================================
     TYPES 62 → 63
     ADMINISTRATIF
     ============================================================ */

  if (type === 62) {
    return "/administratif";
  }

  if (type === 63) {
    return "/card-management";
  }

  /* ============================================================
     TYPE 64
     UTILISATEUR
     ============================================================ */

  if (type === 64) {
    return "/notifications";
  }

  /* ============================================================
     TYPE 65
     RÔLE MODIFIÉ
     ============================================================ */

  if (type === 65) {
    return "/role";
  }

  /* ============================================================
     TYPES 66 → 67
     SÉCURITÉ
     ============================================================ */

  if (
    type >= 66 &&
    type <= 67
  ) {
    return "/notifications";
  }

  /* ============================================================
     TYPES 68 → 72
     SYSTÈME
     ============================================================ */

  if (
    type >= 68 &&
    type <= 72
  ) {
    return "/notifications";
  }

  /* ============================================================
     TYPE INCONNU
     ============================================================ */

  return "/notifications";
};