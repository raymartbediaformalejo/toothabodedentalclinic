const Service = require("./service.services.js");

const getService = async (req, res) => {
  console.log("controller getService");
  try {
    const { serviceId } = req.params;
    const data = await Service.getService(serviceId);
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res.status(500).send({
      message: `${error}`,
      ok: false,
    });
  }
};

const getServices = async (req, res) => {
  console.log("controller getServices");

  try {
    const data = await Service.getServices();
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    console.log("Error Products Controller", error);
    return res.status(500).send({
      message: `${error}`,
      ok: false,
    });
  }
};

const createService = async (req, res) => {
  console.log("controller createService");
  try {
    const serviceData = req.body;
    const data = await Service.createService(serviceData);
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

const updateService = async (req, res) => {
  console.log("controller updateService");
  try {
    const { serviceId } = req.params;

    const { title, description, orderNo, visible, updatedBy } = req.body;

    const data = await Service.updateService({
      serviceId,
      title,
      description,
      orderNo,
      visible,
      updatedBy,
    });
    return res.status(data.status).send({
      message: data.message,
      ok: data.status === 200 || data.status === 201,
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
    const data = await Service.deleteService(serviceId);
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

const deleteAllServices = async (req, res) => {
  const { ids } = req.body.data;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Invalid or missing serviceIds array");
  }
  try {
    const data = await Service.deleteAllService(ids);

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

const saveSortedService = async (req, res) => {
  console.log("controller saveSortedService: ", req.body);
  try {
    const sortedServices = req.body;
    if (!Array.isArray(sortedServices) || sortedServices.length === 0) {
      throw new Error("Invalid or missing sortedServices array");
    }

    const data = await Service.saveSortedService(sortedServices);

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

module.exports = {
  getService,
  getServices,
  createService,
  updateService,
  deleteService,
  deleteAllServices,
  saveSortedService,
};
