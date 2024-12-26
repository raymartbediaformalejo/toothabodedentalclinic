const Appointment = require("./appointment.services");

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

module.exports = {
  createAppointment,
};
