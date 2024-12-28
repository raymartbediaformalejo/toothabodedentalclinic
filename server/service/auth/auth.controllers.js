const pool = require("../../config/conn");
const Cookies = require("./../../utils/cookies.js");
const Tokens = require("./../../utils/tokens.js");
const { compare_password } = require("./../../utils/password_helper.js");

const loginUser = async (request, response) => {
  const { email, password: UserPassword } = request.body;

  // Check if email and password are provided
  if (!email || !UserPassword) {
    return response
      .status(400)
      .send({ message: "Email and Password are required", ok: false });
  }

  const client = await pool.connect(); // Connect to the database pool

  try {
    // Query to find the user based on the provided email
    const queryLogin = `SELECT * FROM "tbl_user" WHERE email = $1`;
    const result = await client.query(queryLogin, [email]);

    // Check if user is found
    if (result.rows.length === 0) {
      return response
        .status(400)
        .send({ message: "Wrong Credentials", ok: false });
    }

    const foundUser = result.rows[0];

    console.log("loginUser: ", foundUser);

    // Compare the provided password with the stored hashed password
    const isCorrect = compare_password(UserPassword, foundUser.password);
    if (!isCorrect) {
      return response
        .status(400)
        .send({ message: "Wrong Credentials", ok: false });
    }
    const queryRoleIds = `
    SELECT r.name
    FROM "tbl_role" r
    INNER JOIN "tbl_user_role" ur ON r.id = ur.role_id
    WHERE ur.user_id = $1`;

    const roleResult = await client.query(queryRoleIds, [foundUser.id]);
    const roles = roleResult.rows.map((row) => row.name);

    // Generate JWT tokens
    const user = {
      id: foundUser.id,
      email: foundUser.email,
      isVerified: foundUser.is_verified,
      accountStatus: foundUser.account_status,
      roles,
    };
    const ts = Tokens.gT(user); // Generate access and refresh tokens using the Tokens utility

    // Set cookies with the generated tokens
    Cookies.sC({
      rs: response,
      ts: {
        aT: ts?.aT || "", // Access token
        rT: ts?.rT || "", // Refresh token
      },
    });

    // Send success response with the access token
    return response.status(200).send({
      message: "Logged In Successfully",
      ok: true,
      accessToken: ts?.aT,
    });
  } catch (error) {
    console.log("Error in loginUser:", error);
    return response
      .status(500)
      .send({ message: "Internal Server Error", ok: false });
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

const logout = (req, res) => {
  const cookies = req.cookies;
  const isProduction = process.env.NODE_ENV === "production";
  if (
    !cookies?.tooth_abode_refresh_token ||
    !cookies?.tooth_abode_access_token
  ) {
    return res.sendStatus(204); // No content if no token is present
  }

  // Clear the refresh token and access token cookies
  res.clearCookie("tooth_abode_refresh_token", {
    httpOnly: true,
    sameSite: "None",
    secure: isProduction, // Only set secure if you are in production
    path: "/",
  });

  res.clearCookie("tooth_abode_access_token", {
    httpOnly: true,
    sameSite: "None",
    secure: isProduction, // Only set secure if you are in production
    path: "/",
  });

  res.json({ message: "Logout successful, cookies cleared" });
};

module.exports = {
  loginUser,
  logout,
};
