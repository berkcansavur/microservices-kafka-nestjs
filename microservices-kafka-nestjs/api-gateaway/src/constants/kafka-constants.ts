export enum BANK_TOPICS {
  CREATE_TRANSFER_ACROSS_ACCOUNTS_EVENT = "create-transfer-across-accounts-event",
  APPROVE_TRANSFER_EVENT = "approve-transfer-event",
  REJECT_TRANSFER_EVENT = "reject-transfer-event",
  CREATE_ACCOUNT_EVENT = "create-account-event",
  TRANSFER_MONEY_TO_ACCOUNT_EVENT = "transfer-money-to-account-event",
  CREATE_BANK_EVENT = "create-bank-event",
  CREATE_BANK_DIRECTOR_EVENT = "create-bank-director-event",
  CREATE_BANK_DEPARTMENT_DIRECTOR_EVENT = "create-bank-department-director-event",
  CREATE_BANK_CUSTOMER_REPRESENTATIVE_EVENT = "create-bank-customer-representative-event",
  CREATE_CUSTOMER_EVENT = "create-customer-event",
  ADD_CUSTOMER_TO_BANKS_CUSTOMER_REPRESENTATIVE_EVENT = "add-customer-to-banks-customer-representative-event",
  CREATE_EMPLOYEE_REGISTRATION_TO_BANK_EVENT = "create-employee-registration-to-bank-event",
  GET_CUSTOMER_ACCOUNTS_EVENT = "get-customer-accounts-event",
  GET_EMPLOYEES_CUSTOMER_RELATED_TRANSACTIONS = "get-employees-customer-related-transactions",
}
export enum ACCOUNT_TOPICS {
  GET_ACCOUNT = "get_account",
  GET_ACCOUNTS_LAST_ACTIONS = "get_accounts_last_actions",
  GET_ACCOUNTS_BALANCE = "get_accounts_balance",
  GET_ACCOUNTS_CURRENCY_BALANCE = "get_accounts_currency_balance",
}
