const { v4: uuidv4 } = require("uuid");
const pool = require("../../config/conn.js");

class PaymentVerification {
  static markAsVerified = async (id) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Update payment verification status
      const updateVerificationQuery = `
        UPDATE tbl_payment_verification 
        SET status = 'payment_verified' 
        WHERE id = $1 RETURNING appointment_ids
      `;
      const verificationResult = await client.query(updateVerificationQuery, [
        id,
      ]);

      if (verificationResult.rowCount === 0) {
        await client.query("ROLLBACK");
        throw new Error("Payment verification not found.");
      }

      // Extract appointment_ids
      const { appointment_ids } = verificationResult.rows[0];

      if (appointment_ids && appointment_ids.length > 0) {
        // Update appointments to mark penalty as paid
        const updateAppointmentQuery = `
          UPDATE tbl_appointment 
          SET is_penalty_paid = 'yes' 
          WHERE appointment_id = ANY($1)
        `;
        await client.query(updateAppointmentQuery, [appointment_ids]);
      }

      await client.query("COMMIT");
      return { message: "Payment marked as verified and penalties updated." };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };

  static markAsIncomplete = async (id) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const query = `
        UPDATE tbl_payment_verification 
        SET status = 'payment_incomplete' 
        WHERE id = $1 RETURNING appointment_ids
      `;
      const result = await client.query(query, [id]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        throw new Error("Payment verification not found.");
      }

      const { appointment_ids } = result.rows[0];

      if (appointment_ids && appointment_ids.length > 0) {
        // Update appointments to mark penalty as paid
        const updateAppointmentQuery = `
          UPDATE tbl_appointment 
          SET is_penalty_paid = 'no' 
          WHERE appointment_id = ANY($1)
        `;
        await client.query(updateAppointmentQuery, [appointment_ids]);
      }

      await client.query("COMMIT");

      return { message: "Payment marked as incomplete." };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };

  static markAsOverpaid = async (id) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const query = `
        UPDATE tbl_payment_verification 
        SET status = 'payment_overpaid' 
        WHERE id = $1 RETURNING appointment_ids
      `;
      const result = await client.query(query, [id]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        throw new Error("Payment verification not found.");
      }

      const { appointment_ids } = result.rows[0];

      if (appointment_ids && appointment_ids.length > 0) {
        // Update appointments to mark penalty as paid
        const updateAppointmentQuery = `
          UPDATE tbl_appointment 
          SET is_penalty_paid = 'yes' 
          WHERE appointment_id = ANY($1)
        `;
        await client.query(updateAppointmentQuery, [appointment_ids]);
      }

      await client.query("COMMIT");

      return { message: "Payment marked as overpaid." };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };
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
