import JWT, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { UnAuthorizedException } from '../../../shared/errors/error.core';
import { JwtPayload } from '../../../shared/types/auth.types.js';

const jwtSecretKey = process.env.JWT_SECRET;
const rtSecretKey = process.env.RT_SECRET;

class jwtProviders {
  public generateToken(payload: JwtPayload): string {
    if (!jwtSecretKey) {
      throw new Error("JWT_SECRET is not defined");
    }
    return JWT.sign(payload, jwtSecretKey, { expiresIn: '10s' });
  }

  public verifyToken(token: string): JwtPayload {
    if (!jwtSecretKey) {
      throw new Error("JWT_SECRET is not defined");
    }
    return JWT.verify(token, jwtSecretKey) as JwtPayload;
  }

  public verifyRefreshToken(token: string): JwtPayload {
    if (!rtSecretKey) {
      throw new Error("RT_SECRET is not defined");
    }
    try {
      return JWT.verify(token, rtSecretKey) as JwtPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnAuthorizedException("Refresh token has expired!");
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnAuthorizedException("Invalid refresh token!");
      }
      throw new UnAuthorizedException("The refresh token is invalid!");
    }
  }

  public generateRefreshToken(payload: JwtPayload): string {
    if (!rtSecretKey) {
      throw new Error("RT_SECRET is not defined");
    }
    return JWT.sign(payload, rtSecretKey, { expiresIn: '7d' });
  }
}

export const jwtproviders: jwtProviders = new jwtProviders();
