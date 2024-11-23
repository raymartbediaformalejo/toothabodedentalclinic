const Service = require("./service.services.js");

const getServices = async (req, res) => {
  try {
    const data = await Service.getServices();
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    console.log("Error Products Controller", error);
    return res
      .status(500)
      .send({ message: "Internal Server Error", ok: false });
  }
};

module.exports = { getServices };
