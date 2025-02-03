const { v4: uuidv4 } = require("uuid");
const pool = require("../../config/conn.js");

class PaymentVerification {
  static approvePaymentVerification = async (id) => {};
  static getPaymentVerification = async (id) => {
    const client = await pool.connect();
    try {
      const query = `
      SELECT 
      id,
        user_id AS "userId",
        gcash_receipt_url AS "gcashReceiptUrl",
        appointment_ids AS "appointmentIds",
        status,
        created_at AS "createdAt",
        created_by AS "createdBy"
      FROM tbl_payment_verification WHERE id = $1`;
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  };

  static getPaymentVerifications = async () => {
    const client = await pool.connect();
    try {
      const query = `
      SELECT
        id,
        user_id AS "userId",
        gcash_receipt_url AS "gcashReceiptUrl",
        appointment_ids AS "appointmentIds",
        status,
        created_at AS "createdAt",
        created_by AS "createdBy"
      FROM tbl_payment_verification`;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  };

  static createPaymentVerification = async (values) => {
    const client = await pool.connect();
    try {
      // Start a transaction
      await client.query("BEGIN");

      const id = uuidv4();
      const insertQuery = `
        INSERT INTO tbl_payment_verification (
          id,
          user_id,
          gcash_receipt_url,
          appointment_ids,
          created_at,
          created_by
        ) VALUES (
         $1, $2, $3, $4, NOW(), $5
        ) RETURNING *
      `;
      const result = await client.query(insertQuery, [
        id,
        values.userId,
        values.gcashReceiptUrl,
        values.appointmentIds,
        values.createdBy,
      ]);

      const updateUserStatusQuery = `
        UPDATE tbl_user
        SET account_status = 'payment_verification'
        WHERE id = $1
      `;
      await client.query(updateUserStatusQuery, [values.userId]);

      await client.query("COMMIT");

      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };

  static updatePaymentVerification = async (id, values) => {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE tbl_payment_verification
        SET 
          user_id = $2,
          gcash_receipt_url = $3,
          schedule = $4,
          updated_at = NOW(),
          updated_by = $5
        WHERE id = $1 RETURNING *
      `;
      const result = await client.query(query, [
        id,
        values.userId,
        values.gcashReceiptUrl,
        values.schedule,
        values.updatedBy,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  };

  static deletePaymentVerification = async (id) => {
    const client = await pool.connect();
    try {
      const query = `DELETE FROM tbl_payment_verification WHERE id = $1 RETURNING id`;
      const result = await client.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  };
}

module.exports = PaymentVerification;
