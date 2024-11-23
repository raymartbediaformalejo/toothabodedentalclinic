const pool = require("../../config/conn.js");

class Service {
  static getServices = async () => {
    const client = await pool.connect();

    try {
      const queryGetServices = `
      SELECT * FROM tbl_service
      `;
      const result = await client.query(queryGetServices);

      return result.rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  };
}

module.exports = Service;
