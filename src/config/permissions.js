module.exports = {
  // Account Numbers
  ACCOUNT_NUMBER: {
    CREATE: 'account_number.create',
    VIEW: 'account_number.view',
    DELETE: 'account_number.delete'
  },

  // Admin Management
  ADMIN: {
    REGISTER: 'admin.register',
    ASSIGN_ROLE: 'admin.assign_role'
  },

  // Auth
  AUTH: {
    VERIFY_EMAIL: 'auth.verify_email',
    RESEND_VERIFICATION: 'auth.resend_verification',
    REQUEST_RESET: 'auth.request_reset',
    RESET_PASSWORD: 'auth.reset_password',
    REQUEST_OTP: 'auth.request_otp',
    VERIFY_OTP: 'auth.verify_otp'
  },

  // Branches
  BRANCH: {
    CREATE: 'branch.create',
    VIEW: 'branch.view',
    UPDATE: 'branch.update',
    DELETE: 'branch.delete'
  },

  // Loan Applications
  LOAN_APPLICATION: {
    CREATE: 'loan_application.create',
    VIEW: 'loan_application.view',
    UPDATE: 'loan_application.update',
    APPROVE: 'loan_application.approve',
    DELETE: 'loan_application.delete',
    RESTORE: 'loan_application.restore',
    VIEW_STATS: 'loan_application.view_stats'
  },

  // Loan Payments
  LOAN_PAYMENT: {
    CREATE: 'loan_payment.create',
    VIEW: 'loan_payment.view',
    UPDATE: 'loan_payment.update',
    REVERSE: 'loan_payment.reverse',
    VERIFY: 'loan_payment.verify'
  },

  // Loans
  LOAN: {
    CREATE: 'loan.create',
    VIEW: 'loan.view',
    UPDATE: 'loan.update',
    APPROVE: 'loan.approve',
    DELETE: 'loan.delete',
    RESTORE: 'loan.restore',
    CALCULATE_BALANCE: 'loan.calculate_balance'
  },

  // Loan Types
  LOAN_TYPE: {
    CREATE: 'loan_type.create',
    VIEW: 'loan_type.view',
    UPDATE: 'loan_type.update',
    DELETE: 'loan_type.delete',
    RESTORE: 'loan_type.restore',
    VIEW_STATS: 'loan_type.view_stats'
  },

  // Logs
  LOG: {
    VIEW: 'log.view'
  },

  // Roles
  ROLE: {
    CREATE: 'role.create',
    VIEW: 'role.view',
    UPDATE: 'role.update',
    DELETE: 'role.delete'
  },

  // Permissions
  PERMISSION: {
    CREATE: 'permission.create',
    VIEW: 'permission.view',
    UPDATE: 'permission.update',
    DELETE: 'permission.delete'
  },

  // Role Permissions
  ROLE_PERMISSION: {
    ASSIGN: 'role_permission.assign',
    REMOVE: 'role_permission.remove',
    VIEW: 'role_permission.view'
  },

  // Saving Accounts
  SAVING_ACCOUNT: {
    CREATE: 'saving_account.create',
    VIEW: 'saving_account.view',
    UPDATE_STATUS: 'saving_account.update_status',
    DEPOSIT: 'saving_account.deposit',
    WITHDRAW: 'saving_account.withdraw',
    TRANSFER: 'saving_account.transfer',
    VIEW_BALANCE: 'saving_account.view_balance',
    VIEW_TRANSACTIONS: 'saving_account.view_transactions',
    CALCULATE_INTEREST: 'saving_account.calculate_interest'
  },

  // Saving Interest
  SAVING_INTEREST: {
    ADD: 'saving_interest.add',
    VIEW: 'saving_interest.view'
  },

  // Saving Types
  SAVING_TYPE: {
    CREATE: 'saving_type.create',
    VIEW: 'saving_type.view',
    UPDATE: 'saving_type.update',
    DELETE: 'saving_type.delete'
  },

  // System Settings
  SYSTEM_SETTING: {
    VIEW: 'system_setting.view',
    UPDATE: 'system_setting.update'
  },

  // Transactions
  TRANSACTION: {
    CREATE: 'transaction.create',
    VIEW: 'transaction.view',
    UPDATE_STATUS: 'transaction.update_status'
  },

  // Users
  USER: {
    VIEW: 'user.view',
    UPDATE: 'user.update',
    DELETE: 'user.delete',
    CHANGE_STATUS: 'user.change_status',
    SEARCH: 'user.search'
  },

  // User Profiles
  USER_PROFILE: {
    CREATE_UPDATE: 'user_profile.create_update',
    VIEW: 'user_profile.view',
    UPDATE: 'user_profile.update',
    VIEW_COMPLETION: 'user_profile.view_completion'
  }
};