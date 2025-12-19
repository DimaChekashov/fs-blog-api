import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const createToken = () => {
  const token = jwt.sign({ foo: "bar" }, "shhhh");

  return token;
};

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
