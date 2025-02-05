const Appointment = require("./appointment.services");

const getAllApprovedAppointmentsPerDay = async (_, res) => {
  try {
    const data = await Appointment.getAllApprovedAppointmentsPerDay();

    if (!data || data.length === 0) {
      return res.status(404).send({
        message: "No approved appointments found",
        ok: false,
      });
    }

    return res.status(200).send({
      data,
      message: "Approved appointments retrieved successfully",
      ok: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error.message}`,
      ok: false,
    });
  }
};

const markAsCanceled = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const data = await Appointment.markAsCanceled(appointmentId);

    return res.status(data.status).send({
      message: data.message,
      data: data.data,
      ok: true,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
      ok: false,
    });
  }
};

const markAsNoShow = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const data = await Appointment.markAsNoShow(appointmentId);

    return res.status(data.status).send({
      message: data.message,
      ok: true,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
      ok: false,
    });
  }
};

const markAsCompleted = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const data = await Appointment.markAsCompleted(appointmentId);

    return res.status(data.status).send({
      message: data.message,
      data: data.data,
      ok: true,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
      ok: false,
    });
  }
};

const rejectRequestRescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const data = await Appointment.rejectRequestReschedAppointment(
      appointmentId
    );

    return res.status(data.status).send({
      message: data.message,
      data: data.data,
      ok: true,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
      ok: false,
    });
  }
};

const approveRequestRescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const data = await Appointment.approveRequestRescheduleAppointment(
      appointmentId
    );

    return res.status(data.status).send({
      message: data.message,
      data: data.data,
      ok: true,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
      ok: false,
    });
  }
};
const requestRescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId, date, time } = req.body;
    const requestedReschedule = `${date} ${time}`;
    const data = await Appointment.requestRescheduleAppointment({
      appointmentId,
      requestedReschedule,
    });

    return res.status(data.status).send({
      message: data.message,
      data: data.data,
      ok: true,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
      ok: false,
    });
  }
};

const approveAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const data = await Appointment.approveAppointment({
      appointmentId,
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
const rejectAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const data = await Appointment.rejectAppointment(appointmentId);

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
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Appointment.cancelAppointment(id);

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

const getDentistReScheduleAppointments = async (req, res) => {
  try {
    const { dentistId } = req.params;

    const data = await Appointment.getDentistReScheduleAppointments(dentistId);

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
const getAllPedingAppointments = async (_, res) => {
  try {
    const data = await Appointment.getAllPendingAppointments();

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
const getAllRequestingReschedAppointments = async (_, res) => {
  try {
    const data = await Appointment.getAllRequestingReschedAppointments();

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
const getDentistPedingAppointments = async (req, res) => {
  try {
    const { dentistId } = req.params;

    const data = await Appointment.getDentistPendingAppointments(dentistId);

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
const getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;

    const data = await Appointment.getPatientAppointments(patientId);

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
const getDentistAppointments = async (req, res) => {
  try {
    const { dentistId } = req.params;

    const data = await Appointment.getDentistAppointments(dentistId);

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
const getAllAppointments = async (req, res) => {
  try {
    const data = await Appointment.getAllAppointments();

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
const getAppointments = async (req, res) => {
  try {
    const { dentistId } = req.query;
    console.log("dentistId: ", dentistId);

    const data = await Appointment.getDentistAppointments(dentistId);

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

const getSchedule = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const data = await Appointment.getSchedule(appointmentId);

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
const getAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    console.log("appointmentId: ", appointmentId);

    const data = await Appointment.getAppointment(appointmentId);

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
  getAllApprovedAppointmentsPerDay,
  markAsCanceled,
  markAsCompleted,
  markAsNoShow,
  getSchedule,
  rejectRequestRescheduleAppointment,
  approveRequestRescheduleAppointment,
  getAllAppointments,
  getAllPedingAppointments,
  getAllRequestingReschedAppointments,
  requestRescheduleAppointment,
  approveAppointment,
  rejectAppointment,
  cancelAppointment,
  getAppointments,
  getPatientAppointments,
  getDentistAppointments,
  getDentistPedingAppointments,
  getDentistReScheduleAppointments,
  getAppointment,
  createAppointment,
  editAppointment,
};
