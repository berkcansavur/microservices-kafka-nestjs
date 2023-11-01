export enum CURRENCY_TYPES {
  EURO = "EURO",
  POUND_STERLING = "POUND_STERLING",
  SWISS_FRANC = "SWISS_FRANC",
  DOLLAR = "DOLLAR",
  CANADIAN_DOLLAR = "CANADIAN_DOLLAR",
  AUSTRALIAN_DOLLAR = "AUSTRALIAN_DOLLAR",
  YEN = "YEN",
  YUAN = "YUAN",
  WON = "WON",
  RENMINBI = "RENMINBI",
  RUSSIAN_RUBLE = "RUSSIAN_RUBLE",
  INDIAN_RUPEE = "INDIAN_RUPEE",
  BRAZILIAN_REAL = "BRAZILIAN_REAL",
  TURKISH_LIRA = "TURKISH_LIRA",
  SOUTH_AFRICAN_RAND = "SOUTH_AFRICAN_RAND",
  NEW_ZEALAND_DOLLAR = "NEW_ZEALAND_DOLLAR",
  SINGAPORE_DOLLAR = "SINGAPORE_DOLLAR",
  MALAYSIAN_RINGGIT = "MALAYSIAN_RINGGIT",
  HONG_KONG_DOLLAR = "HONG_KONG_DOLLAR",
  INDONESIAN_RUPIAH = "INDONESIAN_RUPIAH",
  PHILIPPINE_PESO = "PHILIPPINE_PESO",
  THAI_BAHT = "THAI_BAHT",
  VIETNAMESE_DONG = "VIETNAMESE_DONG",
  KUWAITI_DINAR = "KUWAITI_DINAR",
  SAUDI_RIYAL = "SAUDI_RIYAL",
  UAE_DIRHAM = "UAE_DIRHAM",
  ISRAELI_NEW_SHEKEL = "ISRAELI_NEW_SHEKEL",
  NORWEGIAN_KRONE = "NORWEGIAN_KRONE",
  SWEDISH_KRONA = "SWEDISH_KRONA",
  DANISH_KRONE = "DANISH_KRONE",
  POLISH_ZLOTY = "POLISH_ZLOTY",
  HUNGARIAN_FORINT = "HUNGARIAN_FORINT",
  CZECH_KORUNA = "CZECH_KORUNA",
}

export enum CUSTOMER_TRANSFER_STATUSES {
  CREATED = 100,
  APPROVE_PENDING = 110,
  APPROVED = 200,
  TRANSFER_STARTED = 320,
  COMPLETED = 600,
  CANCEL_PENDING = 690,
  CANCELLED = 700,
}
export enum CUSTOMER_ACTIONS {
  CREATED = 1000,
  APPROVE_PENDING = 1900,
  APPROVED = 2000,
  TRANSFER_STARTED = 3200,
  COMPLETED = 6000,
  CANCEL_PENDING = 6900,
  CANCELLED = 7000,
}
export enum EVENT_RESULTS {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}
export enum BANK_ACTIONS {
  CREATED = "CREATED",
  APPROVE_PENDING = "APPROVE_PENDING",
  APPROVED = "APPROVED",
  TRANSFER_STARTED = "TRANSFER_STARTED",
  MONEY_TRANSFERRED_TO_ACCOUNT = "MONEY_TRANSFERRED_TO_ACCOUNT",
  MONEY_TRANSFERRED_FROM_ACCOUNT = "MONEY_TRANSFERRED_FROM_ACCOUNT",
  TRANSFER_COMPLETED = "TRANSFER_COMPLETED",
  TRANSFER_FAILED = "TRANSFER_FAILED",
  CANCEL_PENDING = "CANCEL_PENDING",
  CANCELLED = "CANCELLED",
  EMPLOYEE_REGISTRATION = "EMPLOYEE_REGISTRATION",
}
export enum BANK_BRANCH_CODE {
  SUADIYE_BRANCH = 34009800,
  CANAKKALE_BRANCH = 17006713,
  BORNOVA_BRANCH = 35004039,
  BESIKTAS_BRANCH = 34001670,
  BALMUMCU_BRANCH = 34001680,
  KOSUYOLU_BRANCH = 34003210,
}
export enum ACCOUNT_TYPES {
  INVESTMENT_ACCOUNT = "Investment Account",
  DEPOSIT_ACCOUNT = "Deposit Account",
  INTEREST_ACCOUNT = "Interest Account",
  EXCHANGE_ACCOUNT = "Exchange Account",
  BANK_ACCOUNT = "Bank Account",
}
export enum ACCOUNT_ACTIONS {
  CREATED = 1000,
  APPROVE_PENDING = 1900,
  APPROVED = 2000,
  TRANSFER_STARTED = 3200,
  MONEY_TRANSFERRED_TO_ACCOUNT = 3300,
  MONEY_TRANSFERRED_FROM_ACCOUNT = 3400,
  TRANSFER_COMPLETED = 3500,
  TRANSFER_FAILED = 3600,
  CANCEL_PENDING = 6900,
  CANCELLED = 7000,
}
export enum TRANSACTION_TYPES {
  ATM = "ATM",
  CASH = "CASH",
  CHEQUE = "CHEQUE",
  CARD = "CARD",
  ELECTRONIC_CHEQUE = "ELECTRONIC_CHEQUE",
  INTER_BANK_TRANSFER = "INTER_BANK_TRANSFER",
  SAME_BANK_TRANSFER = "SAME_BANK_TRANSFER",
  OTHERS = "OTHERS",
}
export enum TRANSACTION_RESULTS {
  SUCCESS = "SUCCESS",
  AWAITING_EVALUATION = "AWAITING_EVALUATION",
  FAILED = "FAILED",
}
export enum TRANSFER_STATUSES {
  CREATED = 100,
  APPROVE_PENDING = 110,
  APPROVED = 200,
  TRANSFER_STARTED = 320,
  COMPLETED = 600,
  CANCEL_PENDING = 690,
  CANCELLED = 700,
  FAILED = 800,
}
