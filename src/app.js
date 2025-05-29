const express = require("express");
const { errorMiddleware } = require("./middlewares/errorMiddleware"); 
const cors = require("cors"); 
const { swaggerUi, swaggerSpec } = require("./config/swagger");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Ensure this file contains role & permission routes
const logUserActivity = require("./middlewares/logUserActivity");  
const { deleteUnverifiedUsers } = require("./services/cronService");
const notificationRoutes=require("./routes/notificationRoutes");
const accountNumberRoutes=require("./routes/accountNumberRoutes");
const savingTypeRoutes=require("./routes/savingTypeRoutes");
const savingAccountRoutes=require("./routes/savingAccountRoutes")
const savingInterateRoutes=require("./routes/savingInterestRoutes");
const transactionRoutes =require("./routes/transactionRoutes");
const settingRoutes=require("./routes/settingRoutes");
const loanTypeRoutes = require('./routes/loanTypeRoutes');
const LoanApplicationController =require("./routes/loanApplicationRoutes");
const LoanRepaymetRoutes=require("./routes/loanPaymentRoutes");
// In your main app.js or server.js
const loanRoutes = require('./routes/loanRoutes');
const app = express();
deleteUnverifiedUsers()
// app.use(cors()); 
const allowedOrigins = [
  "http://localhost:3000",
  "https://createdi-and-saving-managmetn-front.vercel.app", // <- replace with actual Vercel frontend URL
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

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(logUserActivity);  
const path = require('path');

// Serve static files from the "uploads" folder
app.use("/id", express.static(path.join(__dirname, "../uploads/id")));
app.use('/profile', express.static(path.join(__dirname, '../uploads/profile')));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/admin", adminRoutes); // Ensure role & permission routes are mounted correctly
app.use("/api/account-numbers",accountNumberRoutes);
app.use("/api/saving-types",savingTypeRoutes);
app.use("/api/saving-accounts",savingAccountRoutes);
app.use("/api/saving-interest",savingInterateRoutes);
app.use("/api/transactions",transactionRoutes);
app.use("/api/branches", require("./routes/branchRoutes"));
app.use('/api/system-settings',settingRoutes);
app.use('/api/loans', loanRoutes);



//loan
app.use('/api/loan-types', loanTypeRoutes);
app.use('/api/loan-applications',LoanApplicationController);
app.use('/api/payments',LoanRepaymetRoutes);



app.use(errorMiddleware); 

module.exports = app;
