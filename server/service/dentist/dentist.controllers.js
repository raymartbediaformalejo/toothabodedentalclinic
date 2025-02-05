const Dentist = require("./dentist.services");

const getDentists = async (_, res) => {
  try {
    const data = await Dentist.getDentists();
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res.status(500).send({
      message: `${error}`,
      ok: false,
    });
  }
};

const getDentist = async (req, res) => {
  try {
    const { dentistId } = req.params;
    const data = await Dentist.getDentist(dentistId);
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res.status(500).send({
      message: `${error}`,
      ok: false,
    });
  }
};

const createDentist = async (req, res) => {
  try {
    const dentistData = req.body;
    const data = await Dentist.createDentist(dentistData);
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

const updateDentist = async (req, res) => {
  try {
    const { dentistId } = req.params;

    const {
      firstName,
      middleName,
      lastName,
      suffix,
      email,
      profilePicUrl,
      services,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      updatedBy,
    } = req.body;

    const data = await Dentist.updateDentist({
      dentistId,
      firstName,
      middleName,
      lastName,
      suffix,
      email,
      services,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
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

const deleteDentist = async (req, res) => {
  try {
    const { dentistId } = req.params;
    const data = await Dentist.deleteDentist(dentistId);
    return res.status(data.status).send({
      message: data.message,
      ok: data.status === 200 || data.status === 201,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error}`,
      ok: false,
    });
  }
};

const deleteAllDentists = async (req, res) => {
  const { ids } = req.body.data;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Invalid or missing dentist IDs");
  }
  try {
    const data = await Dentist.deleteAllDentist(ids);

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

const saveSortedDentist = async (req, res) => {
  try {
    const sortedDentists = req.body;
    if (!Array.isArray(sortedDentists) || sortedDentists.length === 0) {
      throw new Error("Invalid or missing sortedDentists array");
    }

    const data = await Dentist.saveSortedDentist(sortedDentists);

    return res.status(200).send({
      data,
      ok: data.status === 200 || data.status === 201,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error.message}`,
      ok: false,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const data = await Dentist.changePassword({
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
  getDentist,
  getDentists,
  createDentist,
  updateDentist,
  deleteDentist,
  deleteAllDentists,
  saveSortedDentist,
  changePassword,
};
