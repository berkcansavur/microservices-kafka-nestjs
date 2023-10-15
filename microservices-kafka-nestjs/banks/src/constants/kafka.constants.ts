export const kafkaTopics = [
  "account_availability_result",
  "handle_create_account",
  "handle_create_transfer_across_accounts",
  "money_transfer_across_accounts_result",
  "handle_create_transfer_to_account",
  "handle_failure_transfer",
  "handle_complete_transfer",
  "handle_start_transfer",
  "handle_approve_transfer",
  "handle_approve_pending_transfer",
];
export enum TRANSFER_TOPICS {
  ACCOUNT_AVAILABILITY_RESULT = "account_availability_result",
  HANDLE_CREATE_ACCOUNT = "handle_create_account",
  HANDLE_CREATE_TRANSFER_ACROSS_ACCOUNTS = "handle_create_transfer_across_accounts",
  HANDLE_CREATE_TRANSFER_TO_ACCOUNT = "handle_create_transfer_to_account",
  HANDLE_FAILURE_TRANSFER = "handle_failure_transfer",
  HANDLE_COMPLETE_TRANSFER = "handle_complete_transfer",
  HANDLE_START_TRANSFER = "handle_start_transfer",
  HANDLE_APPROVE_TRANSFER = "handle_approve_transfer",
  HANDLE_APPROVE_PENDING_TRANSFER = "handle_approve_pending_transfer",
}
export enum ACCOUNT_TOPICS {
  MONEY_TRANSFER_ACROSS_ACCOUNTS_RESULT = "money_transfer_across_accounts_result",
  HANDLE_CREATE_ACCOUNT = "handle_create_account",
  ACCOUNT_AVAILABILITY_RESULT = "account_availability_result",
}
