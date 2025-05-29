const axios = require("axios");
const useragent = require("express-useragent");
const UserLog = require("../models/logModel");

// Function to store logs in the database
const logActivity = async (userId, action, category, ip, userAgent) => {
  try {
    const agent = useragent.parse(userAgent);
    const deviceInfo = `${agent.platform} | ${agent.browser} | ${agent.isMobile ? "Mobile" : "Desktop"}`;
    const location = await getUserLocation(ip);
    const locationDetails = location.city && location.country
      ? `${location.city}, ${location.region}, ${location.country}`
      : "Unknown Location";
    console.log("🚀 Saving log:", { userId, action, category, ip, deviceInzfo, locationDetails });
    await UserLog.create({
      userId,
      action,
      category,
      ipAddress: ip,
      userAgent,
      deviceInfo,
      location: locationDetails,
    });

    console.log("✅ User activity logged successfully.");
  } catch (error) {
    console.error("❌ Logging Error:", error.message);
  }
};

// Function to fetch user location based on IP
const getUserLocation = async (ip) => {
  try {
    if (!ip || ip === "127.0.0.1" || ip === "::1") {
      console.log("🚨 Localhost IP detected, skipping geolocation.");
      return { city: "Localhost", region: "", country: "" };
    }

    // First attempt: ipinfo.io
    try {
      const response = await axios.get(`https://ipinfo.io/${ip}/json`);
      return response.data;
    } catch (error) {
      console.warn("⚠️ ipinfo.io failed, trying ip-api.com...");
    }

    // Backup attempt: ip-api.com
    const backupResponse = await axios.get(`http://ip-api.com/json/${ip}`);
    return backupResponse.data;
  } catch (error) {
    console.error("❌ Location Fetch Error:", error.message);
    return {};
  }
};

module.exports = { logActivity };
