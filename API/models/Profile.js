const db = require("../database");
const Profile = {

  getInfoUser: (id_user, callback) => {
    
      const sql = `
      SELECT 
      u.username_user,
      u.email_user,
      u.img,
      COALESCE(ps.timezone, 'Europe/Paris') AS timezone,
      COALESCE(ps.language, 'en') AS language,
      COALESCE(ps.dark_mode, 0) AS dark_mode
      FROM 
          user u
      LEFT JOIN 
          ProfileSettings ps ON u.id_user = ps.user_id
      WHERE 
          u.id_user = ?
      `;
      db.query(sql,[id_user], callback);
    
  },

  updateImgUser : (id_user, img, callback) => {
    const sql = `
      UPDATE user
      SET img = ?
      WHERE id_user = ?
    `;
    db.query(sql, [img, id_user], callback);
  },

  deleteImgUser : (id_user, callback) => {
    const sql = `
      UPDATE user
      SET img = ?
      WHERE id_user = ?
    `;
    db.query(sql, ['blank.png', id_user], callback);
  },

  updateTimeZone : (id_user, timezone, callback) => {
    const sql = `
      UPDATE ProfileSettings
      SET timezone =?
      WHERE user_id =?
    `;
    db.query(sql, [timezone, id_user], callback);
  },

  updateLanguage : (id_user, language, callback) => {
    const sql = `
      UPDATE ProfileSettings
      SET language =?
      WHERE user_id =?
    `;
    db.query(sql, [language, id_user], callback);
  },

  updateDarkMode : (id_user, dark_mode, callback) => {
    const sql = `
      UPDATE ProfileSettings
      SET dark_mode =?
      WHERE user_id =?
    `;
    db.query(sql, [dark_mode, id_user], callback);
  }
}



module.exports = Profile;