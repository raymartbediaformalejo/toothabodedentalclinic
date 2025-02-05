const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const pool = require("../../config/conn.js");

class Dentist {
  static getDentists = async () => {
    const client = await pool.connect();

    try {
      const queryGetDentists = `
      SELECT 
        u.id,
        u.last_name AS "lastName",
        u.first_name AS "firstName",
        u.middle_name AS "middleName",
        u.suffix,
        u.email,
        u.profile_pic_url AS "profilePicUrl",
        u.updated_at AS "updatedAt",
        u.updated_by AS "updatedBy",
        u.created_at AS "createdAt",
        u.created_by AS "createdBy",
        -- Aggregate availability for each day of the week
        jsonb_build_object(
          'sunday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Sunday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Sunday'), '{"startTime": null, "endTime": null}'),
          'monday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Monday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Monday'), '{"startTime": null, "endTime": null}'),
          'tuesday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Tuesday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Tuesday'), '{"startTime": null, "endTime": null}'),
          'wednesday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Wednesday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Wednesday'), '{"startTime": null, "endTime": null}'),
          'thursday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Thursday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Thursday'), '{"startTime": null, "endTime": null}'),
          'friday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Friday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Friday'), '{"startTime": null, "endTime": null}'),
          'saturday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Saturday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Saturday'), '{"startTime": null, "endTime": null}')
        ) AS availability,
        -- Aggregate associated service IDs as an array of strings
        COALESCE(json_agg(DISTINCT s.id::text) FILTER (WHERE s.id IS NOT NULL), '[]') AS "services",
        -- Aggregate roles as an array of strings
        COALESCE(json_agg(DISTINCT ur.role_id::text) FILTER (WHERE ur.role_id IS NOT NULL), '[]') AS "roleIds"
      FROM tbl_user u
      INNER JOIN tbl_user_role ur ON u.id = ur.user_id
      INNER JOIN tbl_role r ON r.id = ur.role_id
      LEFT JOIN tbl_availability a ON u.id = a.dentist_id
      LEFT JOIN tbl_dentist_service ds ON u.id = ds.dentist_id
      LEFT JOIN tbl_service s ON ds.service_id = s.id
      WHERE r.name = 'Dentist' AND u.deleted = false
      GROUP BY u.id, u.first_name, u.middle_name, u.last_name, u.email;
    `;

      const result = await client.query(queryGetDentists);

      const formattedResult = result.rows.map((dentist) => ({
        id: dentist.id,
        firstName: dentist.firstName,
        middleName: dentist.middleName,
        lastName: dentist.lastName,
        suffix: dentist.suffix,
        email: dentist.email,
        profilePicUrl: dentist.profilePicUrl,
        createdAt: dentist.createdAt,
        createdBy: dentist.createdBy,
        updatedAt: dentist.updatedAt,
        updatedBy: dentist.updatedBy,
        ...dentist.availability,
        services: dentist.services,
        roleIds: dentist.roleIds,
      }));

      return formattedResult;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  };

  static getDentist = async (dentistId) => {
    const client = await pool.connect();

    try {
      const queryGetDentist = `
        SELECT 
          u.id,
          u.last_name AS "lastName",
          u.first_name AS "firstName",
          u.middle_name AS "middleName",
          u.suffix,
          u.email,
          u.profile_pic_url AS "profilePicUrl",
          u.updated_at AS "updatedAt",
          u.updated_by AS "updatedBy",
          -- Aggregate availability for each day of the week
          jsonb_build_object(
            'sunday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Sunday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Sunday'), '{"startTime": null, "endTime": null}'),
            'monday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Monday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Monday'), '{"startTime": null, "endTime": null}'),
            'tuesday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Tuesday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Tuesday'), '{"startTime": null, "endTime": null}'),
            'wednesday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Wednesday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Wednesday'), '{"startTime": null, "endTime": null}'),
            'thursday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Thursday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Thursday'), '{"startTime": null, "endTime": null}'),
            'friday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Friday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Friday'), '{"startTime": null, "endTime": null}'),
            'saturday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Saturday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Saturday'), '{"startTime": null, "endTime": null}')
          ) AS availability,
          -- Aggregate associated service IDs as an array of strings
          COALESCE(json_agg(DISTINCT s.id::text) FILTER (WHERE s.id IS NOT NULL), '[]') AS "services",
          -- Aggregate roles as an array of strings
          COALESCE(json_agg(DISTINCT ur.role_id::text) FILTER (WHERE ur.role_id IS NOT NULL), '[]') AS "roleIds"
        FROM tbl_user u
        LEFT JOIN tbl_user_role ur ON u.id = ur.user_id
        LEFT JOIN tbl_role r ON r.id = ur.role_id
        LEFT JOIN tbl_availability a ON u.id = a.dentist_id
        LEFT JOIN tbl_dentist_service ds ON u.id = ds.dentist_id
        LEFT JOIN tbl_service s ON ds.service_id = s.id
        WHERE u.id = $1 AND u.deleted = false
        GROUP BY u.id, u.last_name, u.first_name, u.middle_name, u.suffix, u.email, u.profile_pic_url, u.updated_at, u.updated_by;
      `;

      const result = await client.query(queryGetDentist, [dentistId]);

      if (result.rows.length === 0) {
        throw new Error("Dentist not found");
      }

      const dentist = result.rows[0];

      return {
        id: dentist.id,
        firstName: dentist.firstName,
        middleName: dentist.middleName,
        lastName: dentist.lastName,
        suffix: dentist.suffix,
        email: dentist.email,
        profilePicUrl: dentist.profilePicUrl,
        updatedAt: dentist.updatedAt,
        updatedBy: dentist.updatedBy,
        ...dentist.availability,
        services: dentist.services,
        roleIds: dentist.roleIds,
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  };

  static createDentist = async (values) => {
    const dentistId = uuidv4();
    const hashPassword = await bcrypt.hash(values.password, 10);
    const availability = [
      {
        dayOfWeek: "Sunday",
        startTime: values?.sunday?.[0]?.startTime || "",
        endTime: values?.sunday?.[0]?.endTime || "",
      },
      {
        dayOfWeek: "Monday",
        startTime: values?.monday?.[0]?.startTime || "",
        endTime: values?.monday?.[0]?.endTime || "",
      },
      {
        dayOfWeek: "Tuesday",
        startTime: values?.tuesday?.[0]?.startTime || "",
        endTime: values?.tuesday?.[0]?.endTime || "",
      },
      {
        dayOfWeek: "Wednesday",
        startTime: values?.wednesday?.[0]?.startTime || "",
        endTime: values?.wednesday?.[0]?.endTime || "",
      },
      {
        dayOfWeek: "Thursday",
        startTime: values?.thursday?.[0]?.startTime || "",
        endTime: values?.thursday?.[0]?.endTime || "",
      },
      {
        dayOfWeek: "Friday",
        startTime: values?.friday?.[0]?.startTime || "",
        endTime: values?.friday?.[0]?.endTime || "",
      },
      {
        dayOfWeek: "Saturday",
        startTime: values?.saturday?.[0]?.startTime || "",
        endTime: values?.saturday?.[0]?.endTime || "",
      },
    ];

    if (!values.password || !values.firstName || !values.lastName) {
      throw new Error(
        "First name, last name, email and password are required!"
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const queryInsertUser = `
      INSERT INTO tbl_user (
      id,
      last_name,
      first_name,
      middle_name,
      suffix,
      email,
      password,
      profile_pic_url,
      created_by
      ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9
      ) RETURNING id
      `;

      const dentistResult = await client.query(queryInsertUser, [
        dentistId,
        values.lastName,
        values.firstName,
        values.middleName,
        values.suffix,
        values.email,
        hashPassword,
        values.profilePicUrl,
        values.createdBy,
      ]);

      const queryInsertUserRole = `
        INSERT INTO tbl_user_role (user_id, role_id)
        VALUES ($1, $2)`;

      const roleInsertPromises = values.roleIds?.map(async (roleId) => {
        await client.query(queryInsertUserRole, [dentistId, roleId]);
      });

      await Promise.all(roleInsertPromises);

      if (availability && availability?.length > 0) {
        const queryInsertAvailability = `
        INSERT INTO tbl_availability (
          dentist_id,
          day_of_week,
          start_time,
          end_time,
          created_by
        ) VALUES (
          $1, $2, $3, $4, $5
        )
        `;

        const availabilityInsertPromises = availability?.map(
          async ({ dayOfWeek, startTime, endTime }) => {
            await client.query(queryInsertAvailability, [
              dentistId,
              dayOfWeek,
              startTime,
              endTime,
              values.createdBy,
            ]);
          }
        );

        await Promise.all(availabilityInsertPromises);
      }

      if (values.services && values.services.length > 0) {
        const queryInsertDentistService = `
          INSERT INTO tbl_dentist_service (dentist_id, service_id)
          VALUES ($1, $2)
        `;

        const serviceInsertPromises = values.services.map(async (serviceId) => {
          await client.query(queryInsertDentistService, [dentistId, serviceId]);
        });

        await Promise.all(serviceInsertPromises);
      }

      await client.query("COMMIT");

      if (dentistResult.rowCount > 0) {
        return {
          status: 201,
          message: `New dentist ${values.firstName} ${values.lastName} is created.`,
        };
      } else {
        throw new Error("Invalid user data received!");
      }
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };

  static updateDentist = async (values) => {
    const client = await pool.connect();
    const updatedAt = new Date();
    const dentistId = values.dentistId;
    console.log("SERVICES: ", values);
    const availability = [
      { dayOfWeek: "Sunday", data: values.sunday },
      { dayOfWeek: "Monday", data: values.monday },
      { dayOfWeek: "Tuesday", data: values.tuesday },
      { dayOfWeek: "Wednesday", data: values.wednesday },
      { dayOfWeek: "Thursday", data: values.thursday },
      { dayOfWeek: "Friday", data: values.friday },
      { dayOfWeek: "Saturday", data: values.saturday },
    ];

    try {
      await client.query("BEGIN");

      if (!values.firstName || !values.lastName || !values.email) {
        throw new Error("First name, last name, and email are required");
      }

      const updateDentistQuery = `
        UPDATE tbl_user
        SET 
          first_name = $1, 
          middle_name = $2, 
          last_name = $3, 
          suffix = $4, 
          email = $5, 
          profile_pic_url = $6,
          updated_at = $7,
          updated_by = $8
        WHERE id = $9
      `;

      await client.query(updateDentistQuery, [
        values.firstName,
        values.middleName,
        values.lastName,
        values.suffix,
        values.email,
        values.profilePicUrl,
        updatedAt,
        values.updatedBy,
        dentistId,
      ]);

      const deleteAvailabilityQuery = `
        DELETE FROM tbl_availability WHERE dentist_id = $1
      `;
      await client.query(deleteAvailabilityQuery, [dentistId]);

      const insertAvailabilityQuery = `
        INSERT INTO tbl_availability (
          dentist_id, 
          day_of_week, 
          start_time, 
          end_time, 
          created_by
        ) VALUES ($1, $2, $3, $4, $5)
      `;

      const availabilityInsertPromises = availability.map(
        async ({ dayOfWeek, data }) => {
          if (data && data.length > 0) {
            const { startTime, endTime } = data[0];
            await client.query(insertAvailabilityQuery, [
              dentistId,
              dayOfWeek,
              startTime,
              endTime,
              values.updatedBy,
            ]);
          }
        }
      );

      await Promise.all(availabilityInsertPromises);

      if (values.services && values.services.length > 0) {
        const deleteServicesQuery = `
          DELETE FROM tbl_dentist_service WHERE dentist_id = $1
        `;
        await client.query(deleteServicesQuery, [dentistId]);

        const insertServicesQuery = `
          INSERT INTO tbl_dentist_service (dentist_id, service_id)
          VALUES ($1, $2)
        `;

        const serviceInsertPromises = values.services.map(async (serviceId) => {
          await client.query(insertServicesQuery, [dentistId, serviceId]);
        });

        await Promise.all(serviceInsertPromises);
      }

      await client.query("COMMIT");

      return {
        status: 200,
        message: `Successfully updated dentist, availability, and services.`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };

  static deleteDentist = async (dentistId) => {
    const updatedAt = new Date();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const deleteServicesQuery = `
        DELETE FROM tbl_dentist_service
        WHERE dentist_id = $1
      `;
      await client.query(deleteServicesQuery, [dentistId]);

      const deleteRolesQuery = `
        DELETE FROM tbl_user_role
        WHERE user_id = $1
      `;
      await client.query(deleteRolesQuery, [dentistId]);

      const deleteAvailabilityQuery = `
        DELETE FROM tbl_availability
        WHERE dentist_id = $1
      `;
      await client.query(deleteAvailabilityQuery, [dentistId]);

      const deleteDentistQuery = `
        UPDATE tbl_user
        SET deleted = true, updated_at = $1
        WHERE id = $2
      `;
      const result = await client.query(deleteDentistQuery, [
        updatedAt,
        dentistId,
      ]);

      await client.query("COMMIT");

      if (result.rowCount === 0) {
        throw new Error("Dentist not found or already moved to trash.");
      }

      return {
        status: 200,
        message:
          "Dentist has been moved to trash, services, roles, and availability deleted.",
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };

  static deleteAllDentist = async (ids) => {
    const updatedAt = new Date();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const deleteServicesQuery = `
        DELETE FROM tbl_dentist_service
        WHERE dentist_id = ANY($1)
      `;
      await client.query(deleteServicesQuery, [ids]);

      const deleteRolesQuery = `
        DELETE FROM tbl_user_role
        WHERE user_id = ANY($1)
      `;
      await client.query(deleteRolesQuery, [ids]);

      const deleteAvailabilityQuery = `
        DELETE FROM tbl_availability
        WHERE dentist_id = ANY($1)
      `;
      await client.query(deleteAvailabilityQuery, [ids]);

      const deleteAllDentistQuery = `
        UPDATE tbl_user
        SET deleted = true, updated_at = $1
        WHERE id = ANY($2)
      `;
      const result = await client.query(deleteAllDentistQuery, [
        updatedAt,
        ids,
      ]);

      await client.query("COMMIT");

      if (result.rowCount === 0) {
        throw new Error("No dentists found or already deleted.");
      }

      return {
        status: 200,
        message: `Successfully moved ${result.rowCount} dentist(s) to trash, deleted services, roles, and availability.`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };

  static saveSortedDentist = async (values) => {
    const client = await pool.connect();

    try {
      const querySaveSortedDentist = `
      UPDATE tbl_user
      SET order_no = $1
      WHERE id = $2
      `;

      for (let i = 0; i < values.length; i++) {
        const { id } = values[i];
        if (!id) {
          throw new Error("Invalid dentistId in dentists");
        }
        await client.query(querySaveSortedDentist, [i + 1, id]);
      }

      await client.query("COMMIT");

      return {
        status: 200,
        message: `Successfully sorted dentists`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };

  static changePassword = async (values) => {
    if (!values.id || !values.oldPassword || !values.newPassword) {
      throw new Error("Old password and new password are required.");
    }

    console.log("values change password: ", values);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const verifyDentistQuery = `
        SELECT u.password 
        FROM tbl_user u
        INNER JOIN tbl_user_role ur ON u.id = ur.user_id
        INNER JOIN tbl_role r ON ur.role_id = r.id
        WHERE u.id = $1 AND r.name = 'Dentist' AND u.deleted = false
      `;
      const dentistResult = await client.query(verifyDentistQuery, [values.id]);

      if (dentistResult.rows.length === 0) {
        throw new Error("Dentist not found or user is not a dentist.");
      }

      const dentist = dentistResult.rows[0];

      console.log("dentist password: ", dentist.password);

      const isMatchPassword = await bcrypt.compare(
        values.oldPassword,
        dentist.password
      );
      if (!isMatchPassword) {
        throw new Error("Current password is incorrect.");
      }

      const hashedNewPassword = await bcrypt.hash(values.newPassword, 10);

      const updatePasswordQuery = `
        UPDATE tbl_user
        SET password = $1, updated_at = NOW()
        WHERE id = $2
      `;
      await client.query(updatePasswordQuery, [hashedNewPassword, values.id]);

      await client.query("COMMIT");

      return {
        status: 200,
        message: "Password updated successfully.",
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };
}

module.exports = Dentist;
