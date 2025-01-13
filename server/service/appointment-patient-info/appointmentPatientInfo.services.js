const pool = require("../../config/conn.js");

class AppointmentPatientInfo {
  static async updatePatientInfo(values) {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE tbl_appointment_patient_info
        SET 
          last_name = $1,
          first_name = $2,
          middle_name = $3,
          email = $4,
          mobile_no = $5,
          address = $6,
          city = $7,
          barangay = $8,
          region = $9,
          zip_code = $10,
          updated_at = NOW(),
          updated_by = $11
        WHERE appointment_patient_info_id = $12
      `;
      const result = await client.query(query, [
        values.lastName,
        values.firstName,
        values.middleName,
        values.email,
        values.mobileNo,
        values.address,
        values.city,
        values.barangay,
        values.region,
        values.zipCode,
        values.updatedBy,
        values.id,
      ]);

      if (result.rowCount === 0) {
        throw new Error("Patient info not found.");
      }
      return { status: 200, message: "Patient info updated successfully." };
    } catch (error) {
      console.error("Error updating patient info: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async deletePatientInfo(id) {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE tbl_appointment_patient_info
        SET deleted = true, updated_at = NOW()
        WHERE appointment_patient_info_id = $1
      `;
      const result = await client.query(query, [id]);

      if (result.rowCount === 0) {
        throw new Error("Patient info not found.");
      }
      return { status: 200, message: "Patient info deleted successfully." };
    } catch (error) {
      console.error("Error deleting patient info: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async deleteAllPatientInfo(ids) {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE tbl_appointment_patient_info
        SET deleted = true, updated_at = NOW()
        WHERE appointment_patient_info_id = ANY($1)
      `;
      const result = await client.query(query, [ids]);

      if (result.rowCount === 0) {
        throw new Error("No patient info found to delete.");
      }
      return {
        status: 200,
        message: `Deleted ${result.rowCount} patient records.`,
      };
    } catch (error) {
      console.error("Error deleting all patient info: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAppointmentPatientInfo(id) {
    console.log("class getAppointmentPatientInfo id: ", id);
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          appointment_patient_info_id AS "id",
          medical_history_id AS "medicalHistoryId",
          last_name AS "lastName",
          first_name AS "firstName",
          middle_name AS "middleName",
          nickname,
          occupation,
          birth_day AS "birthDay",
          age,
          sex,
          email,
          mobile_no AS "mobileNo",
          address,
          city,
          barangay,
          region,
          zip_code AS "zipCode",
          religion,
          is_loved_ones AS "isLovedOnes",
          relationship,
          deleted,
          created_at AS "createdAt",
          created_by AS "createdBy",
          updated_at AS "updatedAt",
          updated_by AS "updatedBy"
        FROM tbl_appointment_patient_info
        WHERE appointment_patient_info_id = $1
      `;
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error in service query:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAppointmentPatientInfos() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          appointment_patient_info_id AS "id",
          medical_history_id AS "medicalHistoryId",
          last_name AS "lastName",
          first_name AS "firstName",
          middle_name AS "middleName",
          nickname,
          occupation,
          birth_day AS "birthDay",
          age,
          sex,
          email,
          mobile_no AS "mobileNo",
          address,
          city,
          barangay,
          region,
          zip_code AS "zipCode",
          religion,
          is_loved_ones AS "isLovedOnes",
          relationship,
          deleted,
          created_at AS "createdAt",
          created_by AS "createdBy",
          updated_at AS "updatedAt",
          updated_by AS "updatedBy"
        FROM tbl_appointment_patient_info
        WHERE deleted = false
        ORDER BY created_at DESC
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching appointment patient infos: ", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = AppointmentPatientInfo;
