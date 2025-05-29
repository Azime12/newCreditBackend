const Branch = require("../models/branchModel");
const User = require("../models/userModel");
const { encryptData,decryptData } = require("../utils/cryptoUtils");
const { Op } = require("sequelize");

const isFieldTaken = async (field, value, excludeId = null) => {
  const encryptedValue = encryptData(
    field === "email" ? value.toLowerCase() : value
  );

  const whereClause = { 
    [field]: encryptedValue,
    ...(excludeId && { id: { [Op.ne]: excludeId } })
  };

  return await Branch.findOne({ where: whereClause });
};

const createBranch = async (data) => {
  // Check all unique fields in parallel for better performance
  const [nameTaken, phoneTaken, emailTaken] = await Promise.all([
    isFieldTaken('branchName', data.branchName),
    isFieldTaken('phone', data.phone),
    isFieldTaken('email', data.email)
  ]);

  if (nameTaken) throw { 
    code: 'DUPLICATE_NAME', 
    message: 'Branch name already exists',
    field: 'branchName'
  };
  if (phoneTaken) throw { 
    code: 'DUPLICATE_PHONE', 
    message: 'Phone number already exists',
    field: 'phone'
  };
  if (emailTaken) throw { 
    code: 'DUPLICATE_EMAIL', 
    message: 'Email address already exists',
    field: 'email'
  };

  // Encrypt sensitive data before creation
  const encryptedData = {
    ...data,
    email: encryptData(data.email.toLowerCase()),
    phone: encryptData(data.phone)
  };

  return await Branch.create(encryptedData);
};

const getAllBranches = async () => {
  try {
    const branches = await Branch.findAll({
      include: [{
        model: User,
        as: "manager",
        attributes: { exclude: ["password"] }
      }],
      order: [['createdAt', 'DESC']]
    });

    // Helper function to safely decrypt values
    const safeDecrypt = (value) => {
      if (!value) return value;
      try {
        // Check if value looks encrypted (contains special characters)
        if (value.match(/[^a-zA-Z0-9@._+-]/)) {
          return decryptData(value);
        }
        return value; // Return as-is if doesn't appear encrypted
      } catch (error) {
        console.error('Decryption error for value:', value);
        return value; // Return original value if decryption fails
      }
    };

    const decryptedBranches = branches.map(branch => {
      const plainBranch = branch.get({ plain: true });
      
      return {
        ...plainBranch,
        phone: safeDecrypt(plainBranch.phone),
        email: safeDecrypt(plainBranch.email),
        manager: plainBranch.manager ? {
          ...plainBranch.manager,
          phoneNumber: safeDecrypt(plainBranch.manager.phoneNumber),
          email: safeDecrypt(plainBranch.manager.email)
        } : null
      };
    });

    return {
      success: true,
      data: decryptedBranches,
      count: decryptedBranches.length
    };

  } catch (error) {
    console.error("Error fetching branches:", error);
    throw new Error("Failed to fetch branches");
  }
};

  

const getBranchById = async (id) => {
  const safeDecrypt = (value) => {
    if (!value) return value;
    try {
      // Check if value looks encrypted (contains special characters)
      if (value.match(/[^a-zA-Z0-9@._+-]/)) {
        return decryptData(value);
      }
      return value; // Return as-is if doesn't appear encrypted
    } catch (error) {
      console.error('Decryption error for value:', value);
      return value; // Return original value if decryption fails
    }
  };
  const branch = await Branch.findByPk(id, {
    include: [{
      model: User,
      as: "manager",
      attributes: { exclude: ["password"] }
    }]
  });
  
  if (!branch) throw { code: 'NOT_FOUND', message: 'Branch not found' };
const plainText=branch.get({plain:true});
console.log("plain text:",plainText)
return({
  ...plainText,
  phone: safeDecrypt(plainText.phone),
  email: safeDecrypt(plainText.email),
})
};


const updateBranch = async (id, data) => {
  // Fetch the branch from the database by ID
  const branch = await Branch.findByPk(id);
  if (!branch) throw { code: 'NOT_FOUND', message: 'Branch not found' };

  // Check if the branchName has been changed before checking for duplicates
  if (data.branchName && data.branchName !== branch.branchName) {
    const nameTaken = await isFieldTaken('branchName', data.branchName, id);
    if (nameTaken) throw {
      code: 'DUPLICATE_NAME',
      message: 'Branch name already exists',
      field: 'branchName'
    };
  }

  // Check if the phone number has been changed before checking for duplicates
  if (data.phone && data.phone !== branch.phone) {
    const phoneTaken = await isFieldTaken('phone', data.phone, id);
    if (phoneTaken) throw {
      code: 'DUPLICATE_PHONE',
      message: 'Phone number already exists',
      field: 'phone'
    };
  }

  // Check if the email has been changed before checking for duplicates
  if (data.email && data.email !== branch.email) {
    const emailTaken = await isFieldTaken('email', data.email, id);
    if (emailTaken) throw {
      code: 'DUPLICATE_EMAIL',
      message: 'Email address already exists',
      field: 'email'
    };
  }

  // Encrypt sensitive data before updating
  const encryptedData = {
    ...data,
    ...(data.email && { email: encryptData(data.email.toLowerCase()) }),
    ...(data.phone && { phone: encryptData(data.phone) })
  };

  // Update the branch data in the database
  await branch.update(encryptedData);
  
  return branch;
};


const deleteBranch = async (id) => {
  const branch = await Branch.findByPk(id);
  if (!branch) throw { code: 'NOT_FOUND', message: 'Branch not found' };
  
  await branch.destroy();
  return { success: true, message: 'Branch deleted successfully' };
};

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};