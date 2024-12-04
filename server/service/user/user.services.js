const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const pool = require("../../config/conn");

class User {
  static getUsers = async () => {
    const client = await pool.connect();

    try {
      const queryGetUsers = `
      SELECT * FROM tbl_user`;

      const result = await client.query(queryGetUsers);
      return result.rows;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };

  static getUser = async (userId) => {
    const client = await pool.connect();

    try {
      const queryGetUser = `
      SELECT 
        u.id,
        u.last_name "lastName",
        u.first_name "firstName",
        u.middle_name "middleName",
        u.suffix,
        u.birth_day "birthDay",
        u.age,
        u.sex,
        u.email,
        u.mobile_no "mobileNo",
        u.profile_pic_url "profilePicUrl",
        u.account_status "accountStatus",
        u.nationality,
        u.religion,
        u.deleted,
        u.created_at "createdAt",
        u.created_by "createdBy",
        u.updated_at "updatedAt",
        u.updated_by "updatedBy"
      FROM tbl_user u
      WHERE u.id = $1
      `;

      const result = await client.query(queryGetUser, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  };

  static createUser = async (values) => {
    if (
      !values.email ||
      !values.password ||
      !values.firstName ||
      !values.lastName
    ) {
      throw new Error(
        "First name, last name, email, and password are required!"
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const queryEmailAlreadyExisted = `
      SELECT * FROM "tbl_user" WHERE email = $1
      `;

      const resultEmailAlreadyExisted = await client.query(
        queryEmailAlreadyExisted,
        [values.email]
      );

      if (resultEmailAlreadyExisted.rows.length > 0) {
        await client.query("ROLLBACK");
        return {
          status: 409,
          message: "An account with this email already exists.",
        };
      }

      const userId = uuidv4();
      const hashPassword = await bcrypt.hash(values.password, 10);

      const queryInsertUser = `
      INSERT INTO tbl_user (
      id,
      last_name,
      first_name,
      middle_name,
      suffix,
      birth_day,
      age,
      sex,
      email,
      mobile_no,
      password,
      profile_pic_url,
      account_status,
      nationality,
      religion
      ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15 
      ) RETURNING id
      `;

      const userResult = await client.query(queryInsertUser, [
        userId,
        values.lastName,
        values.firstName,
        values.middleName,
        values.suffix,
        values.birthDay,
        values.age,
        values.sex,
        values.email,
        values.mobileNo,
        hashPassword,
        values.profilePicUrl,
        values.accountStatus,
        values.nationality,
        values.religion,
      ]);

      const hasPatientRole = values.roleIds.includes(
        "92b73582-0dc5-4b3d-a17d-20523d7e0a82"
      );

      if (hasPatientRole) {
        const queryInsertPatient = `
          INSERT INTO tbl_patient (
            patient_id,
            nickname,
            occupation,
            address,
            barangay,
            city,
            region,
            zip_code
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8
          )`;

        await client.query(queryInsertPatient, [
          userId,
          values.nickname,
          values.occupation,
          values.address,
          values.barangay,
          values.city,
          values.region,
          values.zipCode,
        ]);
      }

      const queryInsertUserRole = `
        INSERT INTO tbl_user_role (user_id, role_id)
        VALUES ($1, $2)`;

      const roleInsertPromises = values.roleIds.map(async (roleId) => {
        await client.query(queryInsertUserRole, [userId, roleId]);
      });

      await Promise.all(roleInsertPromises);

      await client.query("COMMIT");

      if (userResult.rowCount > 0) {
        return {
          status: 201,
          message: `New user ${values.firstName} ${values.lastName} is created.`,
        };
      } else {
        throw new Error("Invalid user data received!");
      }
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(
        `Internal Server Error (Creating user): ${error.message}`
      );
    } finally {
      client.release();
    }
  };
}

module.exports = User;
