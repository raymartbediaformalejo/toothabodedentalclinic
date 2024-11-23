const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/corsOptions");

const userRoutes = require("./service/user/user.routes.js");
const serviceRoutes = require("./service/service/service.routes.js");
const regionRoutes = require("./service/region/region.routes.js");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`Server is now running at http://localhost:${PORT}`)
);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoutes);
app.use("/api", serviceRoutes);
app.use("/api", regionRoutes);
