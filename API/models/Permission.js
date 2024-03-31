const db = require("../database"); 
const Permission = {
  // Récupérer tous les permissions
  getAll: (id_user,callback) => { 

    const sql = 'SELECT rel_role_permissions.id_rel, rel_role_permissions.id_role, permission.id_permission, permission.nom_permision, rel_role_permissions.can_create, rel_role_permissions.can_read, rel_role_permissions.can_update, rel_role_permissions.can_delete FROM rel_role_permissions INNER JOIN user ON user.id_role = rel_role_permissions.id_role INNER JOIN permission ON permission.id_permission = rel_role_permissions.id_permission WHERE user.id_user = ?;';
    db.query(sql, [id_user], callback);
    // db.query(sql,callback);
  },

  // Récupérer une permission par son ID
  getById: (id_user,id_permission, callback) => {
    const sql = 'SELECT rel_role_permissions.id_rel FROM rel_role_permissions INNER JOIN user ON user.id_role = rel_role_permissions.id_role WHERE user.id_user=? AND rel_role_permissions.id_permission=?';
    db.query(sql, [id_user,id_permission], callback); 
  }, 
  
  getByUserId: (page, limit, id_user, callback) => {
    const params = [limit, page];
    const sql =  `SELECT * FROM vehicule WHERE id_user = ? LIMIT ${limit} OFFSET ${page} `;
    db.query(sql, [id_user], callback);
  },

  // Ajouter un nouveau permission
  add: (permissionData, callback) => {
    const { name, brand, year, type } = permissionData;
    const sql = 'INSERT INTO vehicule (name, brand, year, type) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, brand, year, type], callback);
  },

  // Mettre à jour un permission
  update: (id, permissionData, callback) => {
    const { name, brand, year, type } = permissionData;
    const sql = 'UPDATE vehicule SET name = ?, brand = ?, year = ?, type = ? WHERE id = ?';
    db.query(sql, [name, brand, year, type, id], callback);
  },

  // Supprimer un permission
  delete: (id, callback) => { 
    const sql = 'DELETE FROM vehicule WHERE id = ?';
    db.query(sql, [id], callback);
  },
};

module.exports = Permission;
