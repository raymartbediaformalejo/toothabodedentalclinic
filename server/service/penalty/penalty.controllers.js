const Penalty = require("./penalty.services");

const updatePenaltyFee = async (req, res) => {
  try {
    const { penaltyFee } = req.body;

    if (!penaltyFee || isNaN(penaltyFee)) {
      return res.status(400).json({ message: "Invalid penalty fee value" });
    }

    const updatedPenalty = await Penalty.updatePenaltyFee(penaltyFee);
    return res
      .status(200)
      .json({
        message: "Penalty fee updated successfully",
        data: updatedPenalty,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const getPenalty = async (req, res) => {
  console.log("getPenalty");
  try {
    const penalty = await Penalty.getPenalty();
    if (!penalty) {
      return res.status(404).json({ message: "Penalty information not found" });
    }
    res.status(200).json(penalty);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = { getPenalty, updatePenaltyFee };
