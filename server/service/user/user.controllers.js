const User = require("./user.services");

const getUsers = async (request, response) => {
  try {
    const data = await User.getUsers();

    return response.status(200).send({ data, ok: true });
  } catch (error) {
    return response
      .status(500)
      .send({ message: "Internal Server Error (Users Controller)", ok: false });
  }
};

const createUser = async (request, response) => {
  try {
    const userData = request.body;
    console.log("data: ", userData);
    const data = await User.createUser(userData);
    return response.status(201).send({ data, ok: true });
  } catch (error) {
    return response
      .status(500)
      .send({
        message: `Internal Server Error(User Controller): ${error}`,
        ok: false,
      });
  }
};

module.exports = { getUsers, createUser };
