const { UserNotificationPreference } = require("../models");

// Default preferences for testing
const defaultPreferences = [
  {
    userId: "dc2b4694-2452-4bcd-9025-7a63453e9575", // Replace with a valid user ID
    type: "payment_reminder",
    channel: "email",
    enabled: true,
  },
  {
    userId: "dc2b4694-2452-4bcd-9025-7a63453e9575", // Replace with a valid user ID
    type: "payment_reminder",
    channel: "sms",
    enabled: false,
  },
  {
    userId: "dc2b4694-2452-4bcd-9025-7a63453e9575", // Replace with a valid user ID
    type: "low_balance_alert",
    channel: "email",
    enabled: true,
  },
  {
    userId: "dc2b4694-2452-4bcd-9025-7a63453e9575", // Replace with a valid user ID
    type: "low_balance_alert",
    channel: "sms",
    enabled: true,
  },
];

const setDefaultPreferences = async () => {
  try {
    for (const preference of defaultPreferences) {
      await UserNotificationPreference.findOrCreate({
        where: {
          userId: preference.userId,
          type: preference.type,
          channel: preference.channel,
        },
        defaults: {
          enabled: preference.enabled,
        },
      });
      console.log(`Inserted preference: ${preference.type} - ${preference.channel}`);
    }
    console.log("Default preferences inserted successfully!");
  } catch (error) {
    console.error("Error inserting default preferences:", error);
  }
};

// Run the script
setDefaultPreferences();