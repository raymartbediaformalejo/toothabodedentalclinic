const { v4: uuidv4 } = require("uuid");
const {
  differenceInHours,
  isBefore,
  isAfter,
  addHours,
  subDays,
  subHours,
} = require("date-fns");

const { sendAppointmentReminderEmail } = require("../../mailtrap/emails.js");
const pool = require("../../config/conn.js");

class Appointment {
  static async getAppointments(userId) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          a.appointment_id AS "id", 
          a.dentist_id AS "dentistId",
          a.schedule, 
          a.appointment_status AS "status", 
          array_agg(s.id) AS "services", 
          a.created_at AS "createdAt",
          a.created_by AS "createdBy"
        FROM tbl_appointment a
        LEFT JOIN tbl_appointment_service as asrv ON a.appointment_id = asrv.appointment_id
        LEFT JOIN tbl_service s ON asrv.service_id = s.id
        WHERE a.patient_id = $1
        GROUP BY a.appointment_id
        ORDER BY a.schedule DESC
      `;

      const result = await client.query(query, [userId]);

      return result.rows;
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAppointment(userId, appointmentId) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          a.appointment_id AS "id", 
          a.dentist_id AS "dentistId",
          a.schedule, 
          a.appointment_status AS "status", 
          array_agg(s.id) AS "services", 
          a.created_at AS "createAt",
          a.created_by AS "createdBy"
        FROM tbl_appointment a
        LEFT JOIN tbl_appointment_service as asrv ON a.appointment_id = asrv.appointment_id
        LEFT JOIN tbl_service s ON asrv.service_id = s.id
        WHERE a.patient_id = $1 AND a.appointment_id = $2
        GROUP BY a.appointment_id
      `;

      const result = await client.query(query, [userId, appointmentId]);

      if (result.rows.length === 0) {
        throw new Error("Appointment not found");
      }

      const row = result.rows[0];
      return row;
    } catch (error) {
      console.error("Error fetching appointment: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static createAppointment = async (values) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const medicalHistoryId = uuidv4();
      const insertMedicalHistoryQuery = `
        INSERT INTO tbl_medical_history (
          medical_history_id,
          physician_name,
          physician_no,
          question_one,
          question_two,
          question_three,
          question_four,
          question_five,
          question_six,
          question_seven,
          question_eight,
          question_nine,
          created_by,
          created_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW()
        )
        RETURNING medical_history_id
      `;
      await client.query(insertMedicalHistoryQuery, [
        medicalHistoryId,
        values.physicianName,
        values.physicianMobileNo,
        values.question1,
        JSON.stringify(values.question2),
        JSON.stringify(values.question3),
        JSON.stringify(values.question4),
        JSON.stringify(values.question5),
        values.question6,
        values.question7,
        JSON.stringify(values.question8),
        JSON.stringify(values.question9),
        values.patientId,
      ]);

      const appointmentPatientInfoId = uuidv4();
      const insertPatientInfoQuery = `
        INSERT INTO tbl_appointment_patient_info (
          appointment_patient_info_id,
          medical_history_id,
          last_name,
          first_name,
          middle_name,
          nickname,
          occupation,
          birth_day,
          age,
          sex,
          email,
          mobile_no,
          address,
          city,
          barangay,
          region,
          zip_code,
          religion,
          is_loved_ones,
          relationship,
          created_at,
          created_by
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), $21
        )
        RETURNING appointment_patient_info_id
      `;
      await client.query(insertPatientInfoQuery, [
        appointmentPatientInfoId,
        medicalHistoryId,
        values.lastName,
        values.firstName,
        values.middleName,
        values.nickname,
        values.occupation,
        new Date(values.birthDay),
        values.age,
        values.sex,
        values.email,
        values.mobileNo,
        values.address,
        values.city,
        values.barangay,
        values.region,
        parseInt(values.zipCode),
        values.religion,
        values.isLoveOne,
        values.relationship,
        values.patientId,
      ]);

      const appointmentId = uuidv4();
      const schedule = `${values.date} ${values.time}`;
      const insertAppointmentQuery = `
        INSERT INTO tbl_appointment (
          appointment_id,
          patient_id,
          appointment_patient_info_id,
          dentist_id,
          schedule,
          appointment_status,
          created_at,
          created_by
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, NOW(), $7
        )
        RETURNING appointment_id, created_at
      `;
      const resultAppointmentRaw = await client.query(insertAppointmentQuery, [
        appointmentId,
        values.patientId,
        appointmentPatientInfoId,
        values.dentistId,
        schedule,
        "pending",
        values.patientId,
      ]);

      const insertAppointmentServiceQuery = `
        INSERT INTO tbl_appointment_service (appointment_id, service_id)
        VALUES ($1, unnest($2::uuid[]))
      `;
      await client.query(insertAppointmentServiceQuery, [
        appointmentId,
        values.serviceIds,
      ]);

      const resultAppointment = resultAppointmentRaw.rows[0];
      const currentTime = new Date();
      const timeDifferenceInHours = differenceInHours(schedule, currentTime);
      const createdAt = new Date(resultAppointment.created_at);

      if (timeDifferenceInHours <= 2) {
        console.log(
          "Appointment created less than 2 hours before scheduled time, no reminder sent."
        );
      } else {
        const timeDifferenceSinceCreation = differenceInHours(
          schedule,
          createdAt
        );

        if (timeDifferenceSinceCreation <= 8) {
          const threeHoursBefore = addHours(schedule, -3);
          console.log(
            "Scheduling reminder email to be sent 3 hours before appointment."
          );
          setTimeout(() => {
            sendAppointmentReminderEmail(values.email, schedule);
          }, threeHoursBefore - currentTime);
        } else {
          const sixHoursBefore = addHours(schedule, -6);
          console.log(
            "Scheduling reminder email to be sent 6 hours before appointment."
          );
          setTimeout(() => {
            sendAppointmentReminderEmail(values.email, schedule);
          }, sixHoursBefore - currentTime);
        }
      }

      await client.query("COMMIT");

      return {
        appointmentId,
        appointmentPatientInfoId,
        medicalHistoryId,
      };
    } catch (error) {
      console.log("Error creating appointment: ", error);
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };

  static async editAppointment(userId, appointmentId, updatedValues) {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE tbl_appointment
        SET schedule = $1, dentist_id = $2, appointment_status = $3, updated_at = NOW()
        WHERE patient_id = $4 AND appointment_id = $5
        RETURNING *
      `;
      const { schedule, dentistId, appointmentStatus } = updatedValues;
      const result = await client.query(query, [
        schedule,
        dentistId,
        appointmentStatus,
        userId,
        appointmentId,
      ]);
      if (result.rows.length === 0) {
        throw new Error("Appointment not found or no changes made");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error editing appointment: ", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Appointment;
