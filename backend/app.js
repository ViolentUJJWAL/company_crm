const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Setup backend");
});

const authRoutes = require("./routes/auth.routes")
const superAdminRoutes = require("./routes/superAdmin.routes")
const companyRoutes = require("./routes/company.routes")
const todoRoutes = require("./routes/todo.routes")
const taskAssignedRoutes = require("./routes/taskAssigned.routes")
const meetingRoutes = require("./routes/meeting.routes")
const contactRoutes = require("./routes/contact.routes")
const leadRoutes = require("./routes/lead.routes")

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/super-admin", superAdminRoutes)
app.use("/api/v1/company", companyRoutes)
app.use("/api/v1/todo", todoRoutes)
app.use("/api/v1/task-assigned", taskAssignedRoutes)
app.use("/api/v1/meeting", meetingRoutes)
app.use("/api/v1/contact", contactRoutes)
app.use("/api/v1/lead", leadRoutes)

module.exports = app;
