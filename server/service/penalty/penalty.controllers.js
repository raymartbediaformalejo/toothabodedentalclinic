const Penalty = require("./penalty.services");

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

module.exports = { getPenalty };
