const MedicalHistory = require("./medicalHistory.services");

const getMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await MedicalHistory.getMedicalHistory(id);

    if (!data) {
      return res.status(404).send({
        message: "Medical History not found",
        ok: false,
      });
    }

    return res.status(200).send({
      data,
      message: "Medical History retrieved successfully",
      ok: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error.message}`,
      ok: false,
    });
  }
};

const getAllMedicalHistory = async (req, res) => {
  try {
    const data = await MedicalHistory.getAllMedicalHistory();

    if (!data || data.length === 0) {
      return res.status(404).send({
        message: "No Medical Histories found",
        ok: false,
      });
    }

    return res.status(200).send({
      data,
      message: "Medical Histories retrieved successfully",
      ok: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error.message}`,
      ok: false,
    });
  }
};

module.exports = { getMedicalHistory, getAllMedicalHistory };
