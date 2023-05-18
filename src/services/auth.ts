import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface JwtToken {
  sub: string;
}

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt: 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public static generateToken(sub: string): string {
    return jwt.sign({ sub }, process.env.AUTH_KEY as string);
  }

  public static decodeToken(token: string): JwtToken {
    return jwt.verify(token, process.env.AUTH_KEY as string) as JwtToken;
  }
}
