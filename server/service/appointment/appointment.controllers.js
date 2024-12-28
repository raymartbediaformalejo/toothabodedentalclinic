const Appointment = require("./appointment.services");

const getAppointments = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("userId: ", userId);

    const data = await Appointment.getAppointments(userId);

    if (!data || data.length === 0) {
      return res.status(404).send({
        message: "No appointments found",
        ok: false,
      });
    }

    return res.status(200).send({
      data,
      message: "Appointments retrieved successfully",
      ok: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error.message}`,
      ok: false,
    });
  }
};

const getAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const { appointmentId } = req.params;

    const data = await Appointment.getAppointment(userId, appointmentId);

    if (!data) {
      return res.status(404).send({
        message: "Appointment not found",
        ok: false,
      });
    }

    return res.status(200).send({
      data,
      message: "Appointment retrieved successfully",
      ok: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error.message}`,
      ok: false,
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;

    if (!appointmentData || Object.keys(appointmentData).length === 0) {
      return res.status(400).send({
        message: "Invalid or missing appointment data",
        ok: false,
      });
    }

    const data = await Appointment.createAppointment(appointmentData);

    return res.status(201).send({
      data,
      message: "Appointment successfully created",
      ok: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error.message}`,
      ok: false,
    });
  }
};

const editAppointment = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in req.user
    const { appointmentId } = req.params;
    const updatedValues = req.body;

    if (!updatedValues || Object.keys(updatedValues).length === 0) {
      return res.status(400).send({
        message: "Invalid or missing appointment data",
        ok: false,
      });
    }

    const data = await Appointment.editAppointment(
      userId,
      appointmentId,
      updatedValues
    );

    return res.status(200).send({
      data,
      message: "Appointment successfully updated",
      ok: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error.message}`,
      ok: false,
    });
  }
};

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  editAppointment,
};
