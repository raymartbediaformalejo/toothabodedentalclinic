const PaymentVerification = require("./payment-verification.services");

const markAsVerified = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PaymentVerification.markAsVerified(id);
    return res.status(200).send({ message: result.message, ok: true });
  } catch (error) {
    return res.status(500).send({ message: error.message, ok: false });
  }
};

const markAsIncomplete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PaymentVerification.markAsIncomplete(id);
    return res.status(200).send({ message: result.message, ok: true });
  } catch (error) {
    return res.status(500).send({ message: error.message, ok: false });
  }
};

const markAsOverpaid = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PaymentVerification.markAsOverpaid(id);
    return res.status(200).send({ message: result.message, ok: true });
  } catch (error) {
    return res.status(500).send({ message: error.message, ok: false });
  }
};

const getPaymentVerification = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("getPaymentVerification id: ", id);
    const data = await PaymentVerification.getPaymentVerification(id);
    if (!data) {
      return res
        .status(404)
        .send({ message: "Payment verification not found", ok: false });
    }
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res.status(500).send({ message: error.message, ok: false });
  }
};

const getPaymentVerifications = async (_, res) => {
  try {
    const data = await PaymentVerification.getPaymentVerifications();
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res.status(500).send({ message: error.message, ok: false });
  }
};

const createPaymentVerification = async (req, res) => {
  try {
    const paymentVerificationData = req.body;
    const data = await PaymentVerification.createPaymentVerification(
      paymentVerificationData
    );
    return res.status(201).send({ data, ok: true });
  } catch (error) {
    return res.status(500).send({ message: error.message, ok: false });
  }
};

const updatePaymentVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await PaymentVerification.updatePaymentVerification(
      id,
      req.body
    );
    if (!data) {
      return res
        .status(404)
        .send({ message: "Payment verification not found", ok: false });
    }
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res.status(500).send({ message: error.message, ok: false });
  }
};

const deletePaymentVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await PaymentVerification.deletePaymentVerification(id);
    if (!success) {
      return res
        .status(404)
        .send({ message: "Payment verification not found", ok: false });
    }
    return res
      .status(200)
      .send({ message: "Payment verification deleted", ok: true });
  } catch (error) {
    return res.status(500).send({ message: error.message, ok: false });
  }
};

module.exports = {
  markAsVerified,
  markAsIncomplete,
  markAsOverpaid,
  getPaymentVerification,
  getPaymentVerifications,
  createPaymentVerification,
  updatePaymentVerification,
  deletePaymentVerification,
};
