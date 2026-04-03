import { eq } from "drizzle-orm";
import { db } from "../../../shared/database/connection";
import { BadRequestException, UnAuthorizedException } from "../../../shared/errors/error.core";
import { users } from "../models";
import bcrypt from "bcrypt";
import { UserPayload, SignInPayload } from "../schemas/user.schema";
import { assignRoleToUser } from "../utils/assignRole";
import { jwtproviders } from "../utils/jwt.provider";
import { getUserAccess } from "../utils/getUserAccess";
class AuthService {
  public async signUp(user: UserPayload) {
    const { name, email, password } = user;
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existingUser.length > 0) {
      throw new BadRequestException("User with this email already exists");
    }
    //hash the password
    const saltRound = 10;
    const hashPassword = await bcrypt.hash(password, saltRound);
    //create the new user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashPassword,
        isActive: true,
      })
      .returning();
    //assign a CUSTOMER role
    const role = await assignRoleToUser(newUser.id, "customer");
    //fetch roles + permissions
    const {roles, permissions} = await getUserAccess(newUser.id);
    //user payload
    const payload = {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roles,
      permissions
    };
    //generate access token
    const accessToken = await jwtproviders.generateToken(payload);
    //generate refresh token
    const refreshToken = await jwtproviders.generateRefreshToken(payload);
    //return
    return {accessToken, refreshToken, payload}
  }
  public async signIn(credentials: SignInPayload) {
    const { email, password } = credentials;
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (!existingUser) {
      throw new UnAuthorizedException("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      throw new UnAuthorizedException("Invalid email or password");
    }
    const { roles, permissions } = await getUserAccess(existingUser.id);
    const payload = {
      userId: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      roles,
      permissions,
    };
    const accessToken = await jwtproviders.generateToken(payload);
    const refreshToken = await jwtproviders.generateRefreshToken(payload);
    return { accessToken, refreshToken, payload };
  }

  public async refreshToken(token: string) {
    const payload = jwtproviders.verifyRefreshToken(token);
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId));
    if (!user) {
      throw new UnAuthorizedException("User not found");
    }
    const { roles, permissions } = await getUserAccess(user.id);
    const newPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      roles,
      permissions,
    };
    const accessToken = jwtproviders.generateToken(newPayload);
    const refreshToken = jwtproviders.generateRefreshToken(newPayload);
    return { accessToken, refreshToken, payload: newPayload };
  }
}

export const authService = new AuthService();
