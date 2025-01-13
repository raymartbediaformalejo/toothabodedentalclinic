const User = require("./user.services");

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await User.getUser(userId);
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    console.log("Error: ", error);
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${error}`, ok: false });
  }
};

const getUsers = async (_, res) => {
  try {
    const data = await User.getUsers();

    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error (Users Controller)", ok: false });
  }
};

const getPatients = async (_, res) => {
  try {
    const data = await User.getPatients();

    return res.status(200).send({ data, ok: true });
  } catch (error) {
    console.error("Error in getPatients controller:", error.message);
    return res.status(500).send({
      message: `Internal Server Error: ${error.message}`,
      ok: false,
    });
  }
};
const getPatientsOfDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res
        .status(400)
        .send({ message: "Doctor ID is required", ok: false });
    }

    const data = await User.getPatientOfDoctor(doctorId);

    return res.status(200).send({ data, ok: true });
  } catch (error) {
    console.error("Error in getPatientsOfDoctor controller:", error.message);
    return res.status(500).send({
      message: `Internal Server Error: ${error.message}`,
      ok: false,
    });
  }
};

const getUserAppointmentNoShowSchedule = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .send({ message: "User ID is required", ok: false });
    }

    const data = await User.getUserAppointmentNoShowSchedule(userId);

    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${error.message}`, ok: false });
  }
};

const createUser = async (req, res) => {
  try {
    const userData = req.body;
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

const getUserAccountStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await User.getUserAccountStatus(userId);

    return res.status(result.status).json({
      success: result.status === 200,
      message: result.message || "Account status retrieved successfully",
      accountStatus: result.accountStatus,
      isVerified: result.isVerified,
    });
  } catch (error) {
    console.error("Error in getUserAccountStatus controller:", error.message);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

const updateUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      middleName,
      lastName,
      suffix,
      email,
      profilePicUrl,
      password,
      updatedBy,
    } = req.body;

    const data = await User.updateUser({
      id,
      firstName,
      middleName,
      lastName,
      suffix,
      email,
      password,
      profilePicUrl,
      updatedBy,
    });
    return res
      .status(data.status)
      .send({ data, ok: data.status === 200 || data.status === 201 });
  } catch (error) {
    return res.status(500).send({
      message: `${error}`,
      ok: false,
    });
  }
};

const deleteUser = async (req, res) => {
  console.log("deleteUser controller");
  try {
    const { userId } = req.params;

    const result = await User.deleteUser(userId);
    return res.status(200).send({ message: result.message, ok: true });
  } catch (error) {
    console.error("Error in deleteUser controller:", error.message);
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${error.message}`, ok: false });
  }
};

const deleteAllUsers = async (req, res) => {
  console.log("deleteAllUsers controller");
  try {
    const { userIds } = req.body;
    console.log("body: ", req.body);
    console.log("userIds: ", userIds);

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res
        .status(400)
        .send({ message: "User IDs must be provided as an array.", ok: false });
    }

    const result = await User.deleteAllUser(userIds);
    return res.status(200).send({ message: result.message, ok: true });
  } catch (error) {
    console.error("Error in deleteAllUsers controller:", error.message);
    return res
      .status(500)
      .send({ message: `Internal Server Error: ${error.message}`, ok: false });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const data = await User.changePassword({
      id,
      oldPassword,
      newPassword,
    });

    return res.status(data.status).send({
      message: data.message,
      ok: data.status === 200 || data.status === 201,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error.message}`,
      ok: false,
    });
  }
};

module.exports = {
  getUser,
  getUsers,
  getPatients,
  getPatientsOfDoctor,
  getUserAccountStatus,
  getUserAppointmentNoShowSchedule,
  createUser,
  verifyEmail,
  resendVerificationCode,
  updateUserData,
  deleteUser,
  deleteAllUsers,
  changePassword,
};
