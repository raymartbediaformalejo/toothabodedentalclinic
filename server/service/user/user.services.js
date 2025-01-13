const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const pool = require("../../config/conn");
const { sendVerificationEmail } = require("../../mailtrap/emails");
const { ACCOUNT_STATUS } = require("../../utils/variables");

class User {
  static async getPatients() {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const appointmentsQuery = `
        SELECT DISTINCT appointment_patient_info_id
        FROM tbl_appointment
      `;
      const appointmentsResult = await client.query(appointmentsQuery);

      if (appointmentsResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return [];
      }

      const patientIds = appointmentsResult.rows.map(
        (row) => row.appointment_patient_info_id
      );

      const usersQuery = `
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
        WHERE appointment_patient_info_id = ANY($1) AND deleted = false
      `;
      const usersResult = await client.query(usersQuery, [patientIds]);

      await client.query("COMMIT");
      return usersResult.rows;
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`Error fetching patients of doctor: ${error.message}`);
    } finally {
      client.release();
    }
  }
  static async getPatientOfDoctor(dentistId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Get unique patient IDs from appointments for the specified doctor
      const appointmentsQuery = `
        SELECT DISTINCT appointment_patient_info_id
        FROM tbl_appointment
        WHERE dentist_id = $1
      `;
      const appointmentsResult = await client.query(appointmentsQuery, [
        dentistId,
      ]);

      if (appointmentsResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return [];
      }

      const patientIds = appointmentsResult.rows.map(
        (row) => row.appointment_patient_info_id
      );

      const usersQuery = `
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
        WHERE appointment_patient_info_id = ANY($1) AND deleted = false
      `;
      const usersResult = await client.query(usersQuery, [patientIds]);

      await client.query("COMMIT");
      return usersResult.rows;
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`Error fetching patients of doctor: ${error.message}`);
    } finally {
      client.release();
    }
  }

  static getUserAppointmentNoShowSchedule = async (userId) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const userQuery = `
        SELECT 
          id, 
          last_name "lastName", 
          account_status "accountStatus"
        FROM tbl_user 
        WHERE id = $1 AND account_status = 'no_show_restricted'
      `;

      const userResult = await client.query(userQuery, [userId]);

      if (userResult.rowCount === 0) {
        await client.query("ROLLBACK");
        throw new Error(
          "User not found or not restricted with 'no-show-restricted' status."
        );
      }

      const user = userResult.rows[0];

      const appointmentsQuery = `
        SELECT 
          appointment_id AS "id",
          schedule
        FROM tbl_appointment 
        WHERE patient_id = $1 AND appointment_status = 'no_show'
      `;

      const appointmentsResult = await client.query(appointmentsQuery, [
        user.id,
      ]);

      await client.query("COMMIT");

      return {
        appointments: appointmentsResult.rows,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };

  static getUsers = async () => {
    const client = await pool.connect();

    try {
      const queryGetUsers = `
        SELECT 
          u.id,
          u.last_name AS "lastName",
          u.first_name AS "firstName",
          u.middle_name AS "middleName",
          u.suffix,
          u.birth_day AS "birthDay",
          u.age,
          u.sex,
          u.email,
          u.mobile_no AS "mobileNo",
          u.profile_pic_url AS "profilePicUrl",
          u.account_status AS "accountStatus",
          u.nationality,
          u.religion,
          u.is_verified AS "isVerified",
          u.nickname,
          u.occupation,
          u.address,
          u.barangay,
          u.city,
          u.region,
          u.zip_code AS "zipCode",
          u.civil_status AS "civilStatus",
          u.created_at AS "createdAt",
          u.created_by AS "createdBy",
          u.updated_at AS "updatedAt",
          u.updated_by AS "updatedBy",
          COALESCE(
            ARRAY_AGG(DISTINCT r.name) FILTER (WHERE r.name IS NOT NULL),
            '{}'
          ) AS roles
        FROM tbl_user u
        LEFT JOIN tbl_user_role ur ON u.id = ur.user_id
        LEFT JOIN tbl_role r ON ur.role_id = r.id
        WHERE u.deleted = false
        GROUP BY u.id, u.last_name, u.first_name, u.middle_name, u.suffix, u.birth_day, u.age, u.sex, u.email, u.mobile_no, u.profile_pic_url, u.account_status, u.nationality, u.religion, u.created_at, u.created_by, u.updated_at, u.updated_by
      `;

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
        u.created_at "createdAt",
        u.created_by "createdBy",
        u.updated_at "updatedAt",
        u.updated_by "updatedBy"
      FROM tbl_user u
      WHERE u.id = $1
      `;

      const result = await client.query(queryGetUser, [userId]);
      return result.rows[0];
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
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const verificationTokenExpiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );

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
      religion,
      verification_token,
      verification_token_expires_at,
      nickname,
      occupation,
      address,
      barangay,
      city,
      region,
      zip_code
      ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
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
        ACCOUNT_STATUS.PENDING_APPROVAL,
        values.nationality,
        values.religion,
        verificationToken,
        verificationTokenExpiresAt,
        values.nickname,
        values.occupation,
        values.address,
        values.barangay,
        values.city,
        values.region,
        values.zipCode,
      ]);

      const queryInsertUserRole = `
        INSERT INTO tbl_user_role (user_id, role_id)
        VALUES ($1, $2)`;

      const roleInsertPromises = values.roleIds.map(async (roleId) => {
        await client.query(queryInsertUserRole, [userId, roleId]);
      });

      await sendVerificationEmail(values.email, verificationToken);

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
      console.error("Error in createUser function:", error);
      await client.query("ROLLBACK");
      throw new Error(
        `Internal Server Error (Creating user): ${error.message}`
      );
    } finally {
      client.release();
    }
  };

  static verifyEmail = async (code) => {
    const client = await pool.connect();
    console.log("verifyEmail");
    try {
      const queryFindUser = `
        SELECT id, verification_token_expires_at, is_verified 
        FROM tbl_user 
        WHERE verification_token = $1 AND verification_token_expires_at > NOW()
      `;

      const result = await client.query(queryFindUser, [code]);

      if (result.rows.length === 0) {
        return {
          status: 400,
          success: false,
          message: "Invalid or expired verification code",
        };
      }

      const user = result.rows[0];

      if (user.is_verified) {
        return {
          status: 400,
          success: false,
          message: "Email is already verified",
        };
      }

      const queryUpdateUser = `
        UPDATE tbl_user
        SET is_verified = true,
            account_status = $1,
            verification_token = NULL, 
            verification_token_expires_at = NULL 
        WHERE id = $2
      `;

      await client.query(queryUpdateUser, [ACCOUNT_STATUS.ACTIVE, user.id]);

      return {
        status: 200,
        success: true,
        message: "Email verified successfully",
      };
    } catch (error) {
      throw new Error(
        `Internal Server Error (Verifying Email): ${error.message}`
      );
    } finally {
      client.release();
    }
  };

  static resendCode = async (email) => {
    const client = await pool.connect();

    try {
      const queryFindUser = `
        SELECT id, is_verified 
        FROM tbl_user 
        WHERE email = $1
      `;
      const result = await client.query(queryFindUser, [email]);

      if (result.rows.length === 0) {
        return {
          status: 404,
          message: "User not found with this email",
        };
      }

      const user = result.rows[0];

      if (user.is_verified) {
        return {
          status: 400,
          message: "Email is already verified",
        };
      }

      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const verificationTokenExpiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );

      const queryUpdateToken = `
        UPDATE tbl_user 
        SET verification_token = $1, 
            verification_token_expires_at = $2 
        WHERE id = $3
      `;
      await client.query(queryUpdateToken, [
        verificationToken,
        verificationTokenExpiresAt,
        user.id,
      ]);

      await sendVerificationEmail(email, verificationToken);

      return {
        status: 200,
        message: "Verification code resent successfully",
      };
    } catch (error) {
      throw new Error(
        `Internal Server Error (Resending Code): ${error.message}`
      );
    } finally {
      client.release();
    }
  };

  static getUserAccountStatus = async (id) => {
    const client = await pool.connect();

    try {
      const query = `
        SELECT 
          id,
          account_status AS "accountStatus",
          is_verified AS "isVerified"
        FROM tbl_user
        WHERE id = $1
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        return {
          status: 404,
          message: "User not found",
          accountStatus: null,
        };
      }

      return {
        status: 200,
        accountStatus: result.rows[0].accountStatus,
        isVerified: result.rows[0].isVerified,
      };
    } catch (error) {
      console.error("Error in getUserAccountStatus:", error.message);
      throw new Error(`Internal Server Error: ${error.message}`);
    } finally {
      client.release();
    }
  };

  static updateUser = async (values) => {
    const client = await pool.connect();
    const updatedAt = new Date();
    const id = values.id;
    try {
      await client.query("BEGIN");

      if (!values.firstName || !values.lastName) {
        throw new Error("First name and last name are required");
      }

      const updateUserQuery = `
      UPDATE tbl_user
      SET 
        first_name = $1, 
        middle_name = $2, 
        last_name = $3, 
        suffix = $4, 
        profile_pic_url = $5,
        password = $6,
        updated_at = $7,
        updated_by = $8
      WHERE id = $9
    `;

      await client.query(updateUserQuery, [
        values.firstName,
        values.middleName,
        values.lastName,
        values.suffix,
        values.profilePicUrl,
        values.password,
        updatedAt,
        values.updatedBy,
        id,
      ]);

      await client.query("COMMIT");
      return {
        status: 200,
        message: `Successfully updated user.`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };

  static async deleteUser(id) {
    const client = await pool.connect();
    try {
      const query = `
          UPDATE tbl_user
          SET deleted = true, updated_at = NOW()
          WHERE id = $1
        `;
      const result = await client.query(query, [id]);

      if (result.rowCount === 0) {
        throw new Error("User not found.");
      }

      return { status: 200, message: "User deleted successfully." };
    } catch (error) {
      console.error("Error deleting user: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async deleteAllUser(ids) {
    const client = await pool.connect();
    try {
      const query = `
          UPDATE tbl_user
          SET deleted = true, updated_at = NOW()
          WHERE id = ANY($1)
        `;
      const result = await client.query(query, [ids]);

      if (result.rowCount === 0) {
        throw new Error("No users found to delete.");
      }

      return {
        status: 200,
        message: `Deleted ${result.rowCount} user(s) successfully.`,
      };
    } catch (error) {
      console.error("Error deleting all users: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static changePassword = async (values) => {
    if (!values.id || !values.oldPassword || !values.newPassword) {
      throw new Error("Old password and new password are required.");
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const verifyUserQuery = `
        SELECT u.password 
        FROM tbl_user u
        WHERE u.id = $1 AND u.deleted = false
      `;
      const userResult = await client.query(verifyUserQuery, [values.id]);
      if (userResult.rows.length === 0) {
        throw new Error("User not found.");
      }

      const user = userResult.rows[0];
      const isMatchPassword = await bcrypt.compare(
        values.oldPassword,
        user.password
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

module.exports = User;
