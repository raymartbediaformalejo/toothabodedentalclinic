const Service = require("./service.services.js");

const getService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const data = await Service.getService(serviceId);
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res.status(500).send({
      message: `Internal Server Error (Service): ${error}`,
      ok: false,
    });
  }
};

const getServices = async (req, res) => {
  try {
    const data = await Service.getServices();
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    console.log("Error Products Controller", error);
    return res.status(500).send({
      message: `Internal Server Error (All Service): ${error}`,
      ok: false,
    });
  }
};

const createService = async (req, res) => {
  try {
    const serviceData = req.body;
    const data = await Service.createService(serviceData);
    return res.status(201).send({ data, ok: true });
  } catch (error) {
    return res.status(500).send({
      message: `Internal Server Error(Create Service Controller): ${error}`,
      ok: false,
    });
  }
};

const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const { title, description, orderNo, visible, updatedBy } = req.body;

    const result = await Service.updateService({
      serviceId,
      title,
      description,
      orderNo,
      visible,
      updatedBy,
    });
    return res.status(result.status).send({
      message: result.message,
      ok: result.status === 200 || result.status === 201,
    });
  } catch (error) {
    return res.status(500).send({
      message: `Internal Server Error(Update Service Controller): ${error}`,
      ok: false,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const result = await Service.deleteService(serviceId);
    return res.status(result.status).send({
      message: result.message,
      ok: result.status === 200 || result.status === 201,
    });
  } catch (error) {
    return res.status(500).send({
      message: `Internal Server Error(Delete Service Controller): ${error}`,
      ok: false,
    });
  }
};

const deleteAllServices = async (req, res) => {
  const { serviceIds } = req.body;

  if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
    return res
      .status(400)
      .send({ message: "Invalid or missing serviceIds array", ok: false });
  }
  try {
    const result = await Service.deleteAllService(serviceIds);

    return res.status(result.status).send({
      message: result.message,
      ok: result.status === 200 || result.status === 201,
    });
  } catch (error) {
    return res.status(500).send({
      message: `Internal Server Error(Delete All Service Controller): ${error.message}`,
      ok: false,
    });
  }
};

const saveSortedService = async (req, res) => {
  try {
    const sortedServices = req.body;
    if (!Array.isArray(sortedServices) || sortedServices.length === 0) {
      return res.status(400).send({
        message: "Invalid or missing sortedServices array",
        ok: false,
      });
    }

    const data = await Service.saveSortedService(sortedServices);

    return res.status(data.status).send({
      message: data.message,
      ok: data.status === 200,
    });
  } catch (error) {
    return res.status(500).send({
      message: `Internal Server Error(Save Service Controller): ${error.message}`,
      ok: false,
    });
  }
};

module.exports = {
  getService,
  getServices,
  createService,
  updateService,
  deleteService,
  deleteAllServices,
  saveSortedService,
};
