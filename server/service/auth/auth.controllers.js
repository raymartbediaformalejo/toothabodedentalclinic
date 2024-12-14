const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../config/conn");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const client = await pool.connect();

  try {
    const queryLogin = `SELECT * FROM  "tbl_user" WHERE email = $1`;
    const result = await client.query(queryLogin, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const foundUser = result.rows[0];
    const match = await bcrypt.compare(password, foundUser.password);

    if (!match)
      return res
        .status(401)
        .json({ message: "Unauthorized: Incorrect email or password" });

    const queryRoleIds = `
    SELECT r.name
    FROM "tbl_role" r
    INNER JOIN "tbl_user_role" ur ON r.id = ur.role_id
    WHERE ur.user_id = $1`;

    const roleResult = await client.query(queryRoleIds, [foundUser.id]);
    const roles = roleResult.rows.map((row) => row.name);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: foundUser.id,
          email: foundUser.email,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
      // { expiresIn: "35m" }
    );

    const refreshToken = jwt.sign(
      {
        email: foundUser.email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "20s" }
      // { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  } finally {
    client.release();
  }
};

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const client = await pool.connect();

      try {
        const queryRefresh = `SELECT * FROM "tbl_user" WHERE email = $1`;
        const result = await client.query(queryRefresh, [decoded.email]);

        if (result.rows.length === 0) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const foundUser = result.rows[0];

        const queryRoleIds = `
        SELECT r.name
        FROM "tbl_role" r
        INNER JOIN "tbl_user_role" ur ON r.id = ur.role_id
        WHERE ur.user_id = $1`;

        const roleResult = await client.query(queryRoleIds, [foundUser.id]);
        const roles = roleResult.rows.map((row) => row.name);

        const accessToken = jwt.sign(
          {
            UserInfo: {
              email: foundUser.email,
              roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "10s" }
          // { expiresIn: "35m" }
        );

        res.json({ accessToken });
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      } finally {
        client.release();
      }
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content if no token is present

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
