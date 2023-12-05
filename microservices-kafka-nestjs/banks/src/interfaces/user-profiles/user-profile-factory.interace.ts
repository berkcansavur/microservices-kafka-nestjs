import { USER_TYPES } from "src/constants/banks.constants";

export interface IUserProfileFactory {
  getUserProfile(profile: USER_TYPES);
}
