const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const { errorMiddleware } = require("./middlewares/errorMiddleware");
const logUserActivity = require("./middlewares/logUserActivity");
const { deleteUnverifiedUsers } = require("./services/cronService");
const { swaggerUi, swaggerSpec } = require("./config/swagger");

// Route imports
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const accountNumberRoutes = require("./routes/accountNumberRoutes");
const savingTypeRoutes = require("./routes/savingTypeRoutes");
const savingAccountRoutes = require("./routes/savingAccountRoutes");
const savingInterateRoutes = require("./routes/savingInterestRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const settingRoutes = require("./routes/settingRoutes");
const loanTypeRoutes = require("./routes/loanTypeRoutes");
const LoanApplicationRoutes = require("./routes/loanApplicationRoutes");
const LoanRepaymentRoutes = require("./routes/loanPaymentRoutes");
const loanRoutes = require("./routes/loanRoutes");
const branchRoutes = require("./routes/branchRoutes");

// Initialize Express app
const app = express();

// Delete unverified users
deleteUnverifiedUsers();

// CORS Setup
const allowedOrigins = [
  "http://localhost:3000",
  "https://createdi-and-saving-managmetn-front.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logUserActivity);

// Static Files
app.use("/id", express.static(path.join(__dirname, "../uploads/id")));
app.use("/profile", express.static(path.join(__dirname, "../uploads/profile")));

// Swagger Docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/account-numbers", accountNumberRoutes);
app.use("/api/saving-types", savingTypeRoutes);
app.use("/api/saving-accounts", savingAccountRoutes);
app.use("/api/saving-interest", savingInterateRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/system-settings", settingRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/loan-types", loanTypeRoutes);
app.use("/api/loan-applications", LoanApplicationRoutes);
app.use("/api/payments", LoanRepaymentRoutes);

// Error middleware
app.use(errorMiddleware);

// Connect to MongoDB
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop the server if DB connection fails
  });
