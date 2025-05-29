const dotenv = require("dotenv");
dotenv.config({ path: "./src/config/.env" });
const app = require("./src/app");
const sequelize = require("./src/config/database");

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Dynamically import 'open' to avoid the ESM error
    // const { default: open } = await import("open");
    // open(`http://localhost:${PORT}/api/docs`);
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
