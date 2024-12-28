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
}

module.exports = Appointment;
