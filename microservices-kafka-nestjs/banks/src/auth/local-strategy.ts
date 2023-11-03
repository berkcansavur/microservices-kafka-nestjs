import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { LoginUserDTO } from "src/dtos/auth.dto";
import { AuthService } from "src/services/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
    });
  }
  async validate(email: string, password: string): Promise<any> {
    const userToLogin = new LoginUserDTO();
    userToLogin.email = email;
    userToLogin.password = password;
    const user = await this.authService.validateUser({
      loginUserDto: userToLogin,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
