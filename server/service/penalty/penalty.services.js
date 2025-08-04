const { v4: uuidv4 } = require("uuid");
const pool = require("../../config/conn.js");

class Penalty {
  static async updatePenaltyFee(newPenaltyFee) {
    console.log("updatePenaltyFee: ", newPenaltyFee);
    const client = await pool.connect();
    try {
      const query = `
        UPDATE tbl_penalty 
        SET penalty_fee = $1 
        RETURNING penalty_fee AS "penaltyFee"
      `;
      const result = await client.query(query, [newPenaltyFee]);

      if (result.rowCount === 0) {
        throw new Error("Penalty record not found.");
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Database Error: ${err.message}`);
    } finally {
      client.release();
    }
  }
  static async getPenalty() {
    const client = await pool.connect();
    try {
      const query = `
      SELECT 
        penalty_fee AS "penaltyFee", 
        gcash_qr_code_url AS "gcashQrCodeUrl" 
      FROM tbl_penalty
      `;
      const result = await client.query(query);
      if (result.rows.length === 0) return null;
      const data = result.rows[0];

      return data;
    } catch (err) {
      throw new Error(`Database Error: ${err.message}`);
    }
  }

  static createPenalty = async (values) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const id = uuidv4();
      const insertQuery = `
        INSERT INTO tbl_penalty (
          id,
          penalty_fee,
          gcash_qr_code_url,
          created_by,
          created_at
        ) VALUES (
         $1, $2, $3, $4, NOW()
        ) RETURNING *
      `;
      const result = await client.query(insertQuery, [
        id,
        values.penaltyFee,
        values.gcashQrCodeUrl,
        values.createdBy,
      ]);

      await client.query("COMMIT");

      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };
}

module.exports = Penalty;
