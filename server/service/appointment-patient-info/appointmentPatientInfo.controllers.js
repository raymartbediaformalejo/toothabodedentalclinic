const AppointmentPatientInfo = require("./appointmentPatientInfo.services");

const getAppointmentPatientInfo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id: ", id);
    const data = await AppointmentPatientInfo.getAppointmentPatientInfo(id);
    if (!data) {
      return res.status(404).send({
        message: "Appointment Patient Info not found",
        ok: false,
      });
    }

    return res.status(200).send({
      data,
      message: "Appointment Patient Info retrieved successfully",
      ok: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error.message}`,
      ok: false,
    });
  }
};

const getAppointmentPatientInfos = async (req, res) => {
  try {
    const data = await AppointmentPatientInfo.getAppointmentPatientInfos();

    if (!data || data.length === 0) {
      return res.status(404).send({
        message: "No Appointment Patient Info found",
        ok: false,
      });
    }

    return res.status(200).send({
      data,
      message: "Appointment Patient Infos retrieved successfully",
      ok: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error.message}`,
      ok: false,
    });
  }
};

const updatePatientInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await AppointmentPatientInfo.updatePatientInfo({
      id,
      ...req.body,
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

const deletePatientInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await AppointmentPatientInfo.deletePatientInfo(id);

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

const deleteAllPatientInfo = async (req, res) => {
  try {
    const { ids } = req.body.data;
    console.log("deleteAllPatientInfo ids: ", req.body);
    console.log("deleteAllPatientInfo ids: ", ids);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Invalid or missing patient IDs.",
        ok: false,
      });
    }

    const data = await AppointmentPatientInfo.deleteAllPatientInfo(ids);

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
  getAppointmentPatientInfo,
  getAppointmentPatientInfos,
  updatePatientInfo,
  deletePatientInfo,
  deleteAllPatientInfo,
};
