const { logActivity } = require("../services/logService");

const logUserActivity = async (req, res, next) => {
  try {
    const { method, originalUrl, headers } = req;
    const action = `${method} ${originalUrl}`;
    const userAgent = headers["user-agent"] || "Unknown Device";

    // ✅ Get the real client IP
    let ip =
      req.headers["x-forwarded-for"] || // Works if behind a proxy (e.g., Render, Nginx)
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;

    // If multiple IPs, take the first one
    if (ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    // Fix localhost issue: Use a default public IP when testing locally
    if (ip === "::1" || ip === "127.0.0.1") {
      console.warn("⚠️ Detected localhost IP. Using a default public IP for testing.");
      ip = "8.8.8.8"; // Google's public IP (used only for testing geolocation)
    }

    const userId = "fc2cff88-a569-446e-a241-6a56be51081e"; // Replace when auth is ready

    // Define category
    let category = "SYSTEM";
    if (originalUrl.includes("/auth")) category = "AUTHENTICATION";
    if (originalUrl.includes("/loan")) category = "TRANSACTION";
    if (originalUrl.includes("/savings")) category = "TRANSACTION";
    if (originalUrl.includes("/security")) category = "SECURITY";
    if (originalUrl.includes("/error")) category = "ERROR";

    console.log("🚀 Logging Activity:", { userId, action, category, ip, userAgent });

    await logActivity(userId, action, category, ip, userAgent);

    next();
  } catch (error) {
    console.error("❌ Logging Middleware Error:", error);
    next();
  }
};

module.exports = logUserActivity;
