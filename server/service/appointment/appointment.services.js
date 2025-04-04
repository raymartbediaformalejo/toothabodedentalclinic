const { v4: uuidv4 } = require("uuid");
const {
  differenceInHours,
  isBefore,
  isAfter,
  startOfDay,
  addHours,
  format,
  parse,
  subDays,
  subHours,
} = require("date-fns");

const {
  sendAppointmentReminderEmail,
} = require("../../mailtrap/nodemailer.config.js");
const pool = require("../../config/conn.js");

class Appointment {
  static async getAllApprovedAppointmentsPerDay() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          appointment_id AS "appointmentId",
          schedule,
          start_time AS "startTime",
          end_time AS "endTime"
        FROM tbl_appointment
        WHERE appointment_status = 'approved'
        ORDER BY schedule ASC;
      `;

      const result = await client.query(query);
      const appointments = result.rows;

      const groupedAppointments = {};
      const availableSlots = 8;
      const today = startOfDay(new Date());

      appointments.forEach(
        ({ appointmentId, schedule, startTime, endTime }) => {
          const parsedDate = parse(schedule, "MMMM d, yyyy HH:mm", new Date());

          // Filter out past appointments
          if (isBefore(parsedDate, today)) return;

          const year = format(parsedDate, "yyyy");
          const month = format(parsedDate, "MMMM");
          const day = format(parsedDate, "d");

          const key = `${year}-${month}-${day}`;
          if (!groupedAppointments[key]) {
            groupedAppointments[key] = {
              year,
              month,
              day,
              availableSlot: availableSlots,
              bookedTime: [],
            };
          }

          // Calculate used slots based on appointment duration
          const start = parse(startTime, "HH:mm", new Date());
          const end = parse(endTime, "HH:mm", new Date());
          const hoursUsed = (end - start) / (1000 * 60 * 60);
          groupedAppointments[key].availableSlot -= Math.floor(hoursUsed);

          groupedAppointments[key].bookedTime.push({
            appointmentId,
            startTime,
            endTime,
          });
        }
      );

      return Object.values(groupedAppointments);
    } catch (error) {
      console.error("Error fetching approved appointments: ", error);
      throw new Error(`Internal Server Error: ${error.message}`);
    } finally {
      client.release();
    }
  }

  static async markAsCanceled(appointmentId) {
    const client = await pool.connect();
    try {
      // Update the appointment status to 'canceled'
      const updateQuery = `
        UPDATE tbl_appointment
        SET appointment_status = 'canceled', updated_at = NOW()
        WHERE appointment_id = $1
        RETURNING *;
      `;
      const { rows } = await client.query(updateQuery, [appointmentId]);

      if (rows.length === 0) {
        throw new Error(`Appointment with ID ${appointmentId} not found.`);
      }

      await client.query("COMMIT");

      return {
        status: 200,
        message: "Appointment has been marked as canceled successfully.",
        data: rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  }

  static async markAsNoShow(appointmentId) {
    const client = await pool.connect();
    try {
      // Update appointment status to 'no_show' and fetch the patient ID
      const updateQuery = `
        UPDATE tbl_appointment
        SET appointment_status = 'no_show', updated_at = NOW()
        WHERE appointment_id = $1
        RETURNING patient_id;
      `;
      const { rows } = await client.query(updateQuery, [appointmentId]);

      if (rows.length === 0) {
        throw new Error(`Appointment with ID ${appointmentId} not found.`);
      }

      const { patient_id } = rows[0];

      // Update user account status to 'no_show_restricted'
      const updateUserQuery = `
        UPDATE tbl_user
        SET account_status = 'no_show_restricted', updated_at = NOW()
        WHERE id = $1;
      `;
      await client.query(updateUserQuery, [patient_id]);

      await client.query("COMMIT");

      return {
        status: 200,
        message: "Appointment has been marked as no-show successfully.",
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  }

  static async markAsCompleted(appointmentId) {
    const client = await pool.connect();
    try {
      // Update the appointment status to 'completed'
      const updateQuery = `
        UPDATE tbl_appointment
        SET appointment_status = 'completed', updated_at = NOW()
        WHERE appointment_id = $1
        RETURNING *;
      `;
      const { rows } = await client.query(updateQuery, [appointmentId]);

      if (rows.length === 0) {
        throw new Error(`Appointment with ID ${appointmentId} not found.`);
      }

      await client.query("COMMIT");

      return {
        status: 200,
        message: "Appointment has been marked as completed successfully.",
        data: rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  }
  static async rejectRequestReschedAppointment(appointmentId) {
    const client = await pool.connect();
    try {
      // Fetch the current appointment details
      const query = `
        SELECT appointment_id, appointment_status
        FROM tbl_appointment
        WHERE appointment_id = $1
      `;
      const { rows } = await client.query(query, [appointmentId]);

      if (rows.length === 0) {
        throw new Error(`Appointment with ID ${appointmentId} not found.`);
      }

      if (rows[0].appointment_status !== "requesting_re_schedule") {
        throw new Error("Appointment is not in a reschedule request status.");
      }

      const updateQuery = `
        UPDATE tbl_appointment
        SET
          appointment_status = 'rejected_request_re_sched',
          updated_at = NOW()
        WHERE appointment_id = $1
        RETURNING *;
      `;

      const updateValues = [appointmentId];
      const updateResult = await client.query(updateQuery, updateValues);

      await client.query("COMMIT");

      return {
        status: 200,
        message: `Reschedule request for appointment has been rejected successfully.`,
        data: updateResult.rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  }

  static async approveRequestRescheduleAppointment(appointmentId) {
    const client = await pool.connect();
    try {
      // Fetch the current appointment details
      const query = `
        SELECT appointment_id, schedule, appointment_status, requested_re_schedule
        FROM tbl_appointment
        WHERE appointment_id = $1
      `;
      const { rows } = await client.query(query, [appointmentId]);

      if (rows.length === 0) {
        throw new Error(`Appointment with ID ${appointmentId} not found.`);
      }

      const { requested_re_schedule } = rows[0];

      // Check if the status is 'requesting_re_schedule'
      if (rows[0].appointment_status !== "requesting_re_schedule") {
        throw new Error("Appointment is not in a reschedule request status.");
      }

      // Update the appointment status and reschedule values
      const updateQuery = `
        UPDATE tbl_appointment
        SET
          appointment_status = 'approved',
          schedule = $2,
          requested_re_schedule = NULL,
          updated_at = NOW()
        WHERE appointment_id = $1
        RETURNING *;
      `;

      const updateValues = [appointmentId, requested_re_schedule];
      const updateResult = await client.query(updateQuery, updateValues);

      await client.query("COMMIT");

      return {
        status: 200,
        message: `Appointment reschedule request has been approved successfully.`,
        data: updateResult.rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  }
  static async requestRescheduleAppointment(values) {
    const client = await pool.connect();
    try {
      const { appointmentId, requestedReschedule } = values;

      // Fetch the current appointment details
      const query = `
            SELECT limit_re_schedule
            FROM tbl_appointment
            WHERE appointment_id = $1
        `;
      const { rows } = await client.query(query, [appointmentId]);

      if (rows.length === 0) {
        throw new Error(`Appointment with ID ${appointmentId} not found.`);
      }

      const { limit_re_schedule } = rows[0];

      if (limit_re_schedule >= 2) {
        throw new Error(
          "You have reached the maximum limit of 2 reschedules for this appointment. Please contact the clinic directly for further assistance."
        );
      }

      let updateQuery;
      let updateValues;

      if (limit_re_schedule === 0) {
        updateQuery = `
                UPDATE tbl_appointment
                SET 
                    appointment_status = 'requesting_re_schedule',
                    limit_re_schedule = limit_re_schedule + 1,
                    requested_re_schedule = $2,
                    updated_at = NOW()
                WHERE appointment_id = $1
                RETURNING *;
            `;
        updateValues = [appointmentId, requestedReschedule];
      } else {
        updateQuery = `
                UPDATE tbl_appointment
                SET 
                    appointment_status = 'requesting_re_schedule',
                    limit_re_schedule = limit_re_schedule + 1,
                    requested_re_schedule = $2,
                    updated_at = NOW()
                WHERE appointment_id = $1
                RETURNING *;
            `;
        updateValues = [appointmentId, requestedReschedule];
      }

      const updateResult = await client.query(updateQuery, updateValues);

      await client.query("COMMIT");

      return {
        status: 200,
        message: `Reschedule request has been submitted successfully.`,
        data: updateResult.rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  }

  static async getDentistReScheduleAppointments(dentistId) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          a.appointment_id AS "id", 
          a.patient_id AS "patientId",
          a.schedule,
          a.start_time AS "startTime",
          a.end_time AS "endTime",
          a.appointment_status AS "status", 
          array_agg(s.id) AS "services", 
          a.created_at AS "createdAt",
          a.created_by AS "createdBy"
        FROM tbl_appointment a
        LEFT JOIN tbl_appointment_service as asrv ON a.appointment_id = asrv.appointment_id
        LEFT JOIN tbl_service s ON asrv.service_id = s.id
        WHERE a.dentist_id = $1 AND a.appointment_status = 're_scheduled'
        GROUP BY a.appointment_id
        ORDER BY a.schedule DESC
      `;

      const result = await client.query(query, [dentistId]);

      return result.rows;
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      throw new Error(`Internal Server Error: ${error.message}`);
    } finally {
      client.release();
    }
  }
  static async getAllRequestingReschedAppointments() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          a.appointment_id AS "id",
          a.appointment_patient_info_id AS "patientInfoId",
          a.schedule,
          a.start_time AS "startTime",
          a.end_time AS "endTime",
          a.appointment_status AS "status",
          array_agg(s.id) AS "services",
          a.created_at AS "createdAt",
          a.created_by AS "createdBy",
          a.requested_re_schedule AS "requestedResched",
          api.first_name AS "patientFirstName",
          api.middle_name AS "patientMiddleName",
          api.last_name AS "patientLastName"
        FROM tbl_appointment a
        LEFT JOIN tbl_appointment_service as asrv ON a.appointment_id = asrv.appointment_id
        LEFT JOIN tbl_service s ON asrv.service_id = s.id
        LEFT JOIN tbl_appointment_patient_info api ON a.appointment_patient_info_id = api.appointment_patient_info_id
        WHERE a.appointment_status = 'requesting_re_schedule'
        GROUP BY a.appointment_id, api.first_name, api.middle_name, api.last_name
        ORDER BY a.schedule DESC
      `;

      const result = await client.query(query);

      if (result.rows.length === 0) {
        return {
          status: 404,
          message: "Something went wrong",
        };
      }

      return result.rows;
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      throw new Error(`Internal Server Error: ${error.message}`);
    } finally {
      client.release();
    }
  }
  static async getAllPendingAppointments() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          a.appointment_id AS "id",
          a.appointment_patient_info_id AS "patientInfoId",
          a.schedule,
          a.start_time AS "startTime",
          a.end_time AS "endTime",
          a.appointment_status AS "status",
          array_agg(s.id) AS "services",
          a.created_at AS "createdAt",
          a.created_by AS "createdBy",
          api.first_name AS "patientFirstName",
          api.middle_name AS "patientMiddleName",
          api.last_name AS "patientLastName"
        FROM tbl_appointment a
        LEFT JOIN tbl_appointment_service as asrv ON a.appointment_id = asrv.appointment_id
        LEFT JOIN tbl_service s ON asrv.service_id = s.id
        LEFT JOIN tbl_appointment_patient_info api ON a.appointment_patient_info_id = api.appointment_patient_info_id
        WHERE a.appointment_status = 'pending'
        GROUP BY a.appointment_id, api.first_name, api.middle_name, api.last_name
        ORDER BY a.schedule DESC
      `;

      const result = await client.query(query);

      if (result.rows.length === 0) {
        return {
          status: 404,
          message: "Something went wrong",
        };
      }

      return result.rows;
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      throw new Error(`Internal Server Error: ${error.message}`);
    } finally {
      client.release();
    }
  }
  static async getDentistPendingAppointments(dentistId) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          a.appointment_id AS "id", 
          a.patient_id AS "patientId",
          a.schedule,
          a.start_time AS "startTime",
          a.end_time AS "endTime",
          a.appointment_status AS "status", 
          array_agg(s.id) AS "services", 
          a.created_at AS "createdAt",
          a.created_by AS "createdBy"
        FROM tbl_appointment a
        LEFT JOIN tbl_appointment_service as asrv ON a.appointment_id = asrv.appointment_id
        LEFT JOIN tbl_service s ON asrv.service_id = s.id
        WHERE a.dentist_id = $1 AND a.appointment_status = 'pending'
        GROUP BY a.appointment_id
        ORDER BY a.schedule DESC
      `;

      const result = await client.query(query, [dentistId]);

      if (result.rows.length === 0) {
        return {
          status: 404,
          message: "Dentist not found",
        };
      }

      return result.rows;
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      throw new Error(`Internal Server Error: ${error.message}`);
    } finally {
      client.release();
    }
  }
  static async getPatientAppointments(patientId) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          a.appointment_id AS "id", 
          a.dentist_id AS "dentistId",
          a.schedule,
          a.start_time AS "startTime",
          a.end_time AS "endTime",
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

      const result = await client.query(query, [patientId]);

      if (result.rows.length === 0) {
        return {
          status: 404,
          message: "Patient not found",
          accountStatus: null,
        };
      }

      return result.rows;
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      throw new Error(`Internal Server Error: ${error.message}`);
    } finally {
      client.release();
    }
  }
  static async getDentistAppointments(dentistId) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          a.appointment_id AS "id",
          a.appointment_patient_info_id AS "patientInfoId",
          a.schedule,
          a.start_time AS "startTime",
          a.end_time AS "endTime",
          a.appointment_status AS "status",
          array_agg(s.id) AS "services",
          a.created_at AS "createdAt",
          a.created_by AS "createdBy",
          api.first_name AS "patientFirstName",
          api.middle_name AS "patientMiddleName",
          api.last_name AS "patientLastName"
        FROM tbl_appointment a
        LEFT JOIN tbl_appointment_service as asrv ON a.appointment_id = asrv.appointment_id
        LEFT JOIN tbl_service s ON asrv.service_id = s.id
        LEFT JOIN tbl_appointment_patient_info api ON a.appointment_patient_info_id = api.appointment_patient_info_id
        WHERE a.dentist_id = $1
        GROUP BY a.appointment_id, api.first_name, api.middle_name, api.last_name
        ORDER BY a.schedule DESC
      `;

      const result = await client.query(query, [dentistId]);

      if (result.rows.length === 0) {
        return {
          status: 404,
          message: "Dentist not found",
          accountStatus: null,
        };
      }

      return result.rows;
    } catch (error) {
      console.error("Error fetching dentist appointments: ", error);
      throw new Error(`Internal Server Error: ${error.message}`);
    } finally {
      client.release();
    }
  }
  static async getAllAppointments() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          a.appointment_id AS "id",
          a.appointment_patient_info_id AS "patientInfoId",
          a.schedule,
          a.start_time AS "startTime",
          a.end_time AS "endTime",
          a.appointment_status AS "status",
          array_agg(s.id) AS "services",
          a.created_at AS "createdAt",
          a.created_by AS "createdBy",
          api.first_name AS "patientFirstName",
          api.middle_name AS "patientMiddleName",
          api.last_name AS "patientLastName"
        FROM tbl_appointment a
        LEFT JOIN tbl_appointment_service as asrv ON a.appointment_id = asrv.appointment_id
        LEFT JOIN tbl_service s ON asrv.service_id = s.id
        LEFT JOIN tbl_appointment_patient_info api ON a.appointment_patient_info_id = api.appointment_patient_info_id
        GROUP BY a.appointment_id, api.first_name, api.middle_name, api.last_name
        ORDER BY a.schedule DESC
      `;

      const result = await client.query(query);

      if (result.rows.length === 0) {
        return {
          status: 404,
          message: "Something went wrong",
          accountStatus: null,
        };
      }

      return result.rows;
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      throw new Error(`Internal Server Error: ${error.message}`);
    } finally {
      client.release();
    }
  }

  static async approveAppointment({ appointmentId }) {
    const client = await pool.connect();
    try {
      const approveAppointmentQuery = `
        UPDATE tbl_appointment
        SET 
          appointment_status = 'approved',
          updated_at = NOW()
        WHERE appointment_id = $1 
        RETURNING *
      `;

      await client.query(approveAppointmentQuery, [appointmentId]);

      await client.query("COMMIT");

      return {
        status: 200,
        message: `Appointment has been approved.`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  }
  static async rejectAppointment(appointmentId) {
    const client = await pool.connect();
    try {
      const rejectAppointmentQuery = `
        UPDATE tbl_appointment
        SET 
          appointment_status = 'rejected',
          updated_at = NOW()
        WHERE appointment_id = $1
        RETURNING *
      `;

      await client.query(rejectAppointmentQuery, [appointmentId]);

      await client.query("COMMIT");

      return {
        status: 200,
        message: `Appointment has been rejected.`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  }
  static async cancelAppointment(id) {
    const client = await pool.connect();
    try {
      const cancelAppointmentQuery = `
        UPDATE tbl_appointment
        SET 
          appointment_status = 'canceled',
          updated_at = NOW()
        WHERE appointment_id = $1
        RETURNING *
      `;

      await client.query(cancelAppointmentQuery, [id]);

      await client.query("COMMIT");

      return {
        status: 200,
        message: `Canceled appointment successfully.`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  }

  static async getAppointments(dentistId) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          a.appointment_id AS "id", 
          a.dentist_id AS "dentistId",
          a.schedule, 
          a.appointment_status AS "status",
          a.start_time AS "startTime",
          a.end_time AS "endTime",
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

      const result = await client.query(query, [dentistId]);

      return result.rows;
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getSchedule(appointmentId) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          a.schedule
        FROM tbl_appointment
        WHERE appointment_id = $1`;

      const result = await client.query(query, [appointmentId]);

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

  static async getAppointment(appointmentId) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          a.appointment_id AS "id", 
          a.dentist_id AS "dentistId",
          a.patient_id AS "patientId",
          a.schedule, 
          a.appointment_status AS "status", 
          a.appointment_patient_info_id AS "appointmentPatientInfoId",
          apinfo.medical_history_id AS "medicalHistoryId",
          array_agg(s.title) AS "services",
          a.created_at AS "createdAt",
          a.created_by AS "createdBy",
          a.start_time AS "startTime",
          a.end_time AS "endTime",
          a.is_penalty_paid AS "isPenaltyPaid",
          dentist.first_name AS "dentistFirstName",
          dentist.middle_name AS "dentistMiddleName",
          dentist.last_name AS "dentistLastName",
          dentist.suffix AS "dentistSuffix",
          patient.first_name AS "patientFirstName",
          patient.middle_name AS "patientMiddleName",
          patient.last_name AS "patientLastName",
          patient.suffix AS "patientSuffix"
        FROM tbl_appointment a
        LEFT JOIN tbl_appointment_patient_info apinfo ON a.appointment_patient_info_id = apinfo.appointment_patient_info_id
        LEFT JOIN tbl_medical_history mh ON apinfo.medical_history_id = mh.medical_history_id
        LEFT JOIN tbl_appointment_service asrv ON a.appointment_id = asrv.appointment_id
        LEFT JOIN tbl_service s ON asrv.service_id = s.id
        LEFT JOIN tbl_user dentist ON a.dentist_id = dentist.id
        LEFT JOIN tbl_user patient ON a.patient_id = patient.id
        WHERE a.appointment_id = $1
        GROUP BY 
          a.appointment_id, 
          apinfo.medical_history_id, 
          dentist.first_name, dentist.middle_name, dentist.last_name, dentist.suffix,
          patient.first_name, patient.middle_name, patient.last_name, patient.suffix
      `;

      const result = await client.query(query, [appointmentId]);

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
      const formattedSchedule = `${values.date} / ${values.time}`;
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
        sendAppointmentReminderEmail(
          values.email,
          values.firstName,
          formattedSchedule
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
            sendAppointmentReminderEmail(
              values.email,
              values.firstName,
              formattedSchedule
            );
          }, threeHoursBefore - currentTime);
        } else {
          const sixHoursBefore = addHours(schedule, -6);
          console.log(
            "Scheduling reminder email to be sent 6 hours before appointment."
          );
          setTimeout(() => {
            sendAppointmentReminderEmail(
              values.email,
              values.firstName,
              formattedSchedule
            );
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
