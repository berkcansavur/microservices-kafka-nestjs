import { Inject, Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { USER_TYPES } from "src/constants/banks.constants";
import { IUserProfileFactory } from "src/interfaces/user-profiles/user-profile-factory.interace";
import { IUserProfile } from "src/interfaces/user-profiles/user-profile.interface";
import { UserProfileMap } from "src/profiles/user-profile.map";

@Injectable()
export class UserProfileFactory implements IUserProfileFactory {
  constructor(
    private readonly moduleReference: ModuleRef,
    @Inject("USER_PROFILE")
    private readonly userProfileMap = UserProfileMap,
  ) {}
  async getUserProfile(profile: USER_TYPES) {
    const { userProfileMap } = this;
    const UserProfileClass = userProfileMap[profile];
    if (!UserProfileClass) {
      throw new Error("User Type is not valid.");
    }
    return this.moduleReference.create<IUserProfile>(UserProfileClass);
  }
}
