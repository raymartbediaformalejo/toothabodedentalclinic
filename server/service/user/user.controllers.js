const User = require("./user.services");

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await User.getUser(userId);
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", ok: false });
  }
};

const getUsers = async (req, res) => {
  try {
    const data = await User.getUsers();
    console.log("keme");

    return res.status(200).send({ data, ok: true });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error (Users Controller)", ok: false });
  }
};

const createUser = async (req, res) => {
  try {
    const userData = req.body;
    console.log("data: ", userData);
    const data = await User.createUser(userData);
    return res.status(201).send({ data, ok: true });
  } catch (error) {
    return res.status(500).send({
      message: `Internal Server Error(User Controller): ${error}`,
      ok: false,
    });
  }
};

module.exports = { getUser, getUsers, createUser };
