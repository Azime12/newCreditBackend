const { encryptData } = require("../utils/cryptoUtils");
const { hashPassword } = require("../utils/hashUtils");
const { LoanType } = require("../models/loan");
const SavingType = require("../models/SavingTypeModel");

const Branch = require("../models/branchModel");
const User = require("../models/userModel");

async function seedDatabase() {
  try {
    console.log("🔄 Starting database seeding...");

    // 1. ADMIN USERS
    console.log("🌱 Seeding admin users...");
    const adminUsers = [
      {
        firstName: "Admin",
        lastName: "System",
        email: "admin@ethiobank.com",
        phoneNumber: "0911223344",
        password: await hashPassword("Admin@1234"),
        role: "Admin",
        isActive: true,
        isVerified: true
      },
      {
        firstName: "Super",
        lastName: "Admin",
        email: "superadmin@ethiobank.com",
        phoneNumber: "0922334455",
        password: await hashPassword("Super@2023"),
        role: "Admin",
        isActive: true,
        isVerified: true
      }
    ];

    for (const userData of adminUsers) {
      const encryptedEmail = encryptData(userData.email);
      const exists = await User.findOne({ where: { email: encryptedEmail } });
      if (!exists) {
        await User.create(userData);
      }
    }

    // 2. BRANCHES
    console.log("🏦 Seeding branches...");
    const branches = [
      {
        branchName: "Addis Ababa Main Branch",
        address: "Bole Road, Near Friendship Center",
        city: "Addis Ababa",
        state: "Addis Ababa",
        postalCode: "1000",
        country: "Ethiopia",
        phone: "+251111223344",
        email: "main.addis@ethiobank.com",
        openingDate: "2010-01-15",
        status: "active"
      },
      {
        branchName: "Hawassa Regional Branch",
        address: "Piazza, Next to Hawassa University",
        city: "Hawassa",
        state: "Sidama",
        postalCode: "1400",
        country: "Ethiopia",
        phone: "+251462112233",
        email: "hawassa@ethiobank.com",
        openingDate: "2015-06-20",
        status: "active"
      },
      {
        branchName: "Mekelle Northern Branch",
        address: "Ayder Subcity, Near Mekelle University",
        city: "Mekelle",
        state: "Tigray",
        postalCode: "2310",
        country: "Ethiopia",
        phone: "+251344556677",
        email: "mekelle@ethiobank.com",
        openingDate: "2018-03-10",
        status: "active"
      },
      {
        branchName: "Bahir Dar Lakeside Branch",
        address: "Near Tana Hotel, Lakeside",
        city: "Bahir Dar",
        state: "Amhara",
        postalCode: "1800",
        country: "Ethiopia",
        phone: "+251581122334",
        email: "bahirdar@ethiobank.com",
        openingDate: "2012-11-05",
        status: "active"
      },
      {
        branchName: "Dire Dawa Eastern Branch",
        address: "Kezira, Near City Administration",
        city: "Dire Dawa",
        state: "Dire Dawa",
        postalCode: "3000",
        country: "Ethiopia",
        phone: "+251251112233",
        email: "diredawa@ethiobank.com",
        openingDate: "2017-09-18",
        status: "active"
      }
    ];

    for (const branchData of branches) {
      const encryptedEmail = encryptData(branchData.email);
      const exists = await Branch.findOne({ where: { email: encryptedEmail } });
      if (!exists) {
        await Branch.create(branchData);
      }
    }

    // 3. SAVING TYPES
    console.log("💰 Seeding saving types...");
    const savingTypes = [
      {
        name: "Regular Savings",
        description: "Basic savings account with minimum balance requirement",
        interestRate: 5.00,
        minBalance: 100.00,
        withdrawalLimit: 5
      },
      {
        name: "Fixed Deposit (12 Months)",
        description: "One year fixed deposit with higher interest",
        interestRate: 8.50,
        minBalance: 5000.00,
        tenureInMonths: 12,
        penaltyRate: 2.00
      },
      {
        name: "Youth Savings",
        description: "Special account for customers under 25 years",
        interestRate: 6.50,
        minBalance: 50.00,
        withdrawalLimit: 3
      },
      {
        name: "Women's Entrepreneur Savings",
        description: "For women-owned businesses with flexible terms",
        interestRate: 7.00,
        minBalance: 200.00
      },
      {
        name: "Retirement Savings",
        description: "Long-term savings for retirement planning",
        interestRate: 9.00,
        minBalance: 1000.00,
        tenureInMonths: 60,
        penaltyRate: 5.00
      }
    ];

    for (const savingTypeData of savingTypes) {
      const exists = await SavingType.findOne({ where: { name: savingTypeData.name } });
      if (!exists) {
        await SavingType.create(savingTypeData);
      }
    }

    // 4. LOAN TYPES
    console.log("🏦 Seeding loan types...");
    const loanTypes = [
      {
        name: "Agricultural Loan",
        description: "For farmers and agricultural businesses",
        interest_rate: 7.5,
        min_term: 6,
        max_term: 36,
        payment_frequency: "monthly",
        min_amount: 5000,
        max_amount: 500000,
        is_active: true
      },
      {
        name: "Micro Business Loan",
        description: "For small businesses and entrepreneurs",
        interest_rate: 10.0,
        min_term: 3,
        max_term: 24,
        payment_frequency: "monthly",
        min_amount: 1000,
        max_amount: 100000,
        is_active: true
      },
      {
        name: "Home Improvement Loan",
        description: "For residential property upgrades",
        interest_rate: 9.0,
        min_term: 12,
        max_term: 60,
        payment_frequency: "monthly",
        min_amount: 10000,
        max_amount: 300000,
        is_active: true
      },
      {
        name: "Education Loan",
        description: "For university and vocational training",
        interest_rate: 5.0,
        min_term: 12,
        max_term: 48,
        payment_frequency: "monthly",
        min_amount: 2000,
        max_amount: 200000,
        is_active: true
      },
      {
        name: "Emergency Loan",
        description: "Short-term loan for urgent needs",
        interest_rate: 12.0,
        min_term: 1,
        max_term: 12,
        payment_frequency: "monthly",
        min_amount: 500,
        max_amount: 50000,
        is_active: true
      }
    ];

    for (const loanTypeData of loanTypes) {
      const exists = await LoanType.findOne({ where: { name: loanTypeData.name } });
      if (!exists) {
        await LoanType.create(loanTypeData);
      }
    }

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
  } finally {
    process.exit();
  }
}

seedDatabase();
