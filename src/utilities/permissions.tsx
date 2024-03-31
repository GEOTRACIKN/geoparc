export enum PagePermission {
    Dashboard = 'Dashboard',
    RolesAndPermissions = 'Roles et permissions',
    FlottesIButton = 'Flottes iButton',
    Agences = 'Agences',
    Conducteurs = 'Conducteurs',
    Utilisateurs = 'Utilisateurs',
    Planification = 'Planification',
    Rapports = 'Rapports',
    CartesSIM = 'Cartes SIM',
    Vehicles = 'Vehicles',
    Archive = 'Archive',
    VueFlotte = 'Vue flotte',
    Carte = 'Carte',
    DispositifsGPS = 'Dispositifs GPS',
    Carburant = 'Carburant',
    PointsInterets = 'Points intérêts',
    ConfigurationAlarmes = 'Configuration Alarmes',
    Alarmes = 'Alarmes',
    Messages = 'Messages',
    Logusers = 'Logusers',
    Affectations = 'Affectations',
    Mission = 'Mission',
    Devices = 'Devices',
  }
  

  export function getPagePermissionNumber(permission: PagePermission): number {
    switch (permission) {
      case PagePermission.Dashboard:
        return 1;
      case PagePermission.RolesAndPermissions:
        return 2;
      case PagePermission.FlottesIButton:
        return 3;
      case PagePermission.Agences:
        return 4;
      case PagePermission.Conducteurs:
        return 5;
      case PagePermission.Utilisateurs:
        return 6;
      case PagePermission.Planification:
        return 7;
      case PagePermission.Rapports:
        return 8;
      case PagePermission.CartesSIM:
        return 9;
      case PagePermission.Vehicles:
        return 10;
      case PagePermission.Archive:
        return 11;
      case PagePermission.VueFlotte:
        return 12;
      case PagePermission.Carte:
        return 13;
      case PagePermission.DispositifsGPS:
        return 14;
      case PagePermission.Carburant:
        return 15;
      case PagePermission.PointsInterets:
        return 16;
      case PagePermission.ConfigurationAlarmes:
        return 17;
      case PagePermission.Alarmes:
        return 18;
      case PagePermission.Messages:
        return 19;
      case PagePermission.Logusers:
        return 20;
      case PagePermission.Affectations:
        return 21;
      case PagePermission.Mission:
        return 22;
      default:
        return -1; // Handle the default case or invalid permissions as needed
    }
  }
  