const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const pool = require("../../config/conn.js");

class Dentist {
  static getDentists = async () => {
    const client = await pool.connect();

    try {
      const client = await pool.connect();

      try {
        const queryGetDentists = `
       SELECT 
        u.id,
        u.first_name AS "firstName",
        u.middle_name AS "middleName",
        u.last_name AS "lastName",
        u.email,
        -- Aggregate availability for each day of the week
        jsonb_build_object(
          'sunday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Sunday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Sunday'), '{"startTime": null, "endTime": null}'),
          'monday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Monday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Monday'), '{"startTime": null, "endTime": null}'),
          'tuesday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Tuesday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Tuesday'), '{"startTime": null, "endTime": null}'),
          'wednesday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Wednesday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Wednesday'), '{"startTime": null, "endTime": null}'),
          'thursday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Thursday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Thursday'), '{"startTime": null, "endTime": null}'),
          'friday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Friday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Friday'), '{"startTime": null, "endTime": null}'),
          'saturday', COALESCE(jsonb_agg(CASE WHEN a.day_of_week = 'Saturday' THEN jsonb_build_object('startTime', a.start_time, 'endTime', a.end_time) END) FILTER (WHERE a.day_of_week = 'Saturday'), '{"startTime": null, "endTime": null}')
        ) AS availability
      FROM tbl_user u
      INNER JOIN tbl_user_role ur ON u.id = ur.user_id
      INNER JOIN tbl_role r ON r.id = ur.role_id
      LEFT JOIN tbl_availability a ON u.id = a.dentist_id
      WHERE r.name = 'Dentist' AND u.deleted = false
      GROUP BY u.id, u.first_name, u.middle_name, u.last_name, u.email;
      `;

        const result = await client.query(queryGetDentists);

        const formattedResult = result.rows.map((dentist) => ({
          id: dentist.id,
          firstName: dentist.firstName,
          middleName: dentist.middleName,
          lastName: dentist.lastName,
          email: dentist.email,
          ...dentist.availability,
        }));

        return formattedResult;
      } catch (error) {
        throw error;
      } finally {
        client.release();
      }
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
          u.profile_pic_url AS profilePicUrl,
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
          -- Aggregate role IDs as an array of strings
          COALESCE(
            json_agg(DISTINCT r.id::text) FILTER (WHERE r.id IS NOT NULL),
            '{}'
          ) AS "roleIds"
        FROM tbl_user u
        LEFT JOIN tbl_availability a ON u.id = a.dentist_id
        LEFT JOIN tbl_user_role ur ON u.id = ur.user_id
        LEFT JOIN tbl_role r ON ur.role_id = r.id
        WHERE u.id = $1 AND u.deleted = false
        GROUP BY u.id, u.last_name, u.first_name, u.middle_name, u.suffix, u.email, u.profile_pic_url, u.updated_at, u.updated_by;
      `;

      const result = await client.query(queryGetDentist, [dentistId]);

      if (result.rows.length === 0) {
        throw new Error("Dentist not found");
      }

      const dentist = result.rows[0];

      console.log("DENTIST: ", dentist);
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
    const dentistId = values.id;
    const hashPassword = await bcrypt.hash(values.password, 10);
    // console.log("========================");
    // console.log("values: ", values);
    // console.log("========================");

    try {
      const queryDentist = `SELECT * FROM "tbl_user" WHERE email = $1`;
      const dentistResult = await client.query(queryDentist, [values.email]);
      if (dentistResult.rows.length === 0) {
        throw new Error("No user found");
      }
      const foundDentist = dentistResult.rows[0];

      if (values.password) {
        const match = await bcrypt.compare(
          values.password,
          foundDentist.password
        );
        if (!match) {
          throw new Error("Incorrect password");
        }
        if (!values.newPassword) {
          throw new Error("New password required.");
        }
      }
      if (!values.firstName || !values.lastName || !values.email) {
        await client.query("ROLLBACK");
        throw new Error(
          `First name, last name, email and password is required`
        );
      }

      const updateDentistQuery = `
      UPDATE tbl_user
      SET 
        first_name = $1, 
        middle_name = $2, 
        last_name = $3, 
        suffix = $4, 
        email = $5, 
        password = $6,
        profile_pic_url = $7,
        updated_at = $8,
        updated_by = $9
      WHERE id = $10
      `;

      await client.query(updateDentistQuery, [
        values.firstName,
        values.middleName,
        values.lastName,
        values.suffix,
        values.email,
        hashPassword,
        values.profilePicUrl,
        updatedAt,
        values.updatedBy,
        dentistId,
      ]);

      await client.query("COMMIT");

      return {
        status: 200,
        message: `Successfully updated dentist.`,
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
        throw new Error("Dentist not found or already move to trash.");
      }

      return {
        status: 200,
        message: `Dentist has been move to trash.`,
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
        message: `Successfully moved ${result.rowCount} dentist(s) to trash.`,
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
}

module.exports = Dentist;
