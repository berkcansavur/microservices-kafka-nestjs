import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JWT_SECRET } from "src/constants/private-constants";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    this.logger.debug("[AuthGuard] Token:", token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });
      this.logger.debug("[AuthGuard] payload:", payload);
      request["user"] = payload;
      this.logger.debug("[AuthGuard] request.user:", request.user);
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    this.logger.debug(
      "[AuthGuard] Authorization:",
      request.headers.authorization,
    );
    this.logger.debug("[AuthGuard] type:", type);
    this.logger.debug("[AuthGuard] token:", token);
    return type.toString() === "Bearer" ? token.toString() : undefined;
  }
}
