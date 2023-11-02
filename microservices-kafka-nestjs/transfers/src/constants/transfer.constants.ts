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

export enum TRANSFER_STATUSES {
  CREATED = 100,
  APPROVE_PENDING = 110,
  APPROVED = 200,
  TRANSFER_STARTED = 320,
  COMPLETED = 600,
  CANCEL_PENDING = 690,
  CANCELLED = 700,
  FAILED = 800,
  REJECTED = 900,
}
export enum TRANSFER_ACTIONS {
  CREATED = 1000,
  APPROVED = 2000,
  TRANSFER_STARTED = 3200,
  COMPLETED = 6000,
  CANCELLED = 7000,
  STATUS_UPDATED = 3000,
  FAILURE = 500,
  TRANSFER_AWAITS = 700,
}
export enum EVENT_RESULTS {
  SUCCESS = 1000,
  FAILED = 2000,
}
