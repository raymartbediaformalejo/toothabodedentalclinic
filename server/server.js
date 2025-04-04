const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/corsOptions");

const verifyRoutes = require("./service/verify/verify.routes");
const authRoutes = require("./service/auth/auth.routes");
const userRoutes = require("./service/user/user.routes.js");
const regionRoutes = require("./service/region/region.routes.js");
const serviceRoutes = require("./service/service/service.routes.js");
const dentistRoutes = require("./service/dentist/dentist.routes.js");
const appointmentRoutes = require("./service/appointment/appointment.routes.js");
const appointmentPatientInfo = require("./service/appointment-patient-info/appointmentPatientInfo.routes.js");
const medicalHistory = require("./service/medical-history/medicalHistory.routes.js");
const penaltyRoutes = require("./service/penalty/penalty.routes");
const paymentVerificationRoutes = require("./service/payment-verification/payment-verification.routes.js");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`Server is now running at http://localhost:${PORT}`)
);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api", verifyRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", regionRoutes);
app.use("/api", serviceRoutes);
app.use("/api", dentistRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", appointmentPatientInfo);
app.use("/api", medicalHistory);
app.use("/api", penaltyRoutes);
app.use("/api", paymentVerificationRoutes);
