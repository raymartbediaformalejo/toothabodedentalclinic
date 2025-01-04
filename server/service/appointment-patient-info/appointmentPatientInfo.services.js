const pool = require("../../config/conn.js");

class AppointmentPatientInfo {
  static async getAppointmentPatientInfo(id) {
    console.log("class getAppointmentPatientInfo id: ", id);
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          appointment_patient_info_id AS "id",
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
