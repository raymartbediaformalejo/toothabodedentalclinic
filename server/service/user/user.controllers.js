const User = require("./user.services");

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("getUser: ", userId);
    const data = await User.getUser(userId);
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${error}`, ok: false });
  }
};

const getUsers = async (req, res) => {
  try {
    const data = await User.getUsers();
    console.log("keme");

    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error (Users Controller)", ok: false });
  }
};

const createUser = async (req, res) => {
  try {
    const userData = req.body;
    console.log("data: ", userData);
    const data = await User.createUser(userData);
    return res.status(201).send({ data, ok: true });
  } catch (error) {
    return res.status(500).send({
      message: `Internal Server Error(User Controller): ${error}`,
      ok: false,
    });
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Verification code is required",
    });
  }

  try {
    const result = await User.verifyEmail(code);

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error("Error in verifyEmail: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const response = await User.resendCode(email);

    return res.status(response.status).json({
      success: response.status === 200,
      message: response.message,
    });
  } catch (error) {
    console.error("Error in resendVerificationCode controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await User.deleteUser(userId);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  verifyEmail,
  resendVerificationCode,
  deleteUser,
};
