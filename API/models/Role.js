
const db = require("../database");
const Role = {

  getRole: ( callback) => {
    const sql = `
      SELECT *
      FROM role
    `;

    db.query(sql, callback);
  },

  // Start Get Count
  getPermission: (id_user,id_role, callback) => {
    
    const  sql = `SELECT
    p.id_permission AS 'id',
    p.nom_permision AS 'permission',
    rrp.can_create AS 'create',
    rrp.can_read AS 'read',
    rrp.can_update AS 'update',
    rrp.can_delete AS 'delete'
      FROM
          user u
      JOIN
          role r ON u.id_role = r.id_role
      JOIN
          rel_role_permissions rrp ON r.id_role = rrp.id_role
      JOIN
          permission p ON rrp.id_permission = p.id_permission
      WHERE
          u.id_user = ${id_user}
          AND r.id_role = ${id_role}`;
  

    db.query(sql, [id_user,id_role],callback);
},

// Le id_user n'est pas dans la table role ni dans la table Permission ni dans la table rel_rol_permission
updatePermissions: (id_user, id_permission, newPermissions, callback) => {
    const { can_create, can_read, can_update, can_delete } = newPermissions;
  
    const sqlUpdatePermissions = `
      UPDATE rel_role_permissions
      SET
        can_create = ?,
        can_read = ?,
        can_update = ?,
        can_delete = ?
      WHERE
        id_role = (SELECT id_role FROM user WHERE id_user = ?)
        AND id_permission = ?`;
  
    db.query(
      sqlUpdatePermissions,
      [can_create, can_read, can_update, can_delete, id_user, id_permission],
      (error, results) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, results);
        }
      }
    );
  },
  
  
  


}

module.exports =Role