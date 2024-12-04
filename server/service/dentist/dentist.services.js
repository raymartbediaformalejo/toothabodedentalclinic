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
          u.first_name,
          u.last_name,
          u.middle_name
        FROM tbl_user u
        INNER JOIN tbl_user_role ur ON u.id = ur.user_id
        INNER JOIN tbl_role r ON r.id = ur.role_id
        WHERE r.name = 'Dentist';
      `;
      const result = await client.query(queryGetDentists);

      return result.rows;
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
        u.last_name "lastName",
        u.first_name "firstName",
        u.middle_name "middleName",
        u.suffix,
        u.created_at "createdAt",
        u.created_by "createdBy",
        u.updated_at "updatedAt",
        u.updated_by "updatedBy"
      FROM tbl_user u
      WHERE u.id = $1
      `;

      const result = await client.query(queryGetDentist, [dentistId]);
      return result.rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  };

  static createDentist = async (values) => {
    const dentistId = uuidv4();
    const hashPassword = await bcrypt.hash(values.password, 10);

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
        userId,
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

      const roleInsertPromises = values.roleIds.map(async (roleId) => {
        await client.query(queryInsertUserRole, [dentistId, roleId]);
      });

      await Promise.all(roleInsertPromises);

      await client.query("COMMIT");

      if (userResult.rowCount > 0) {
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

    try {
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
