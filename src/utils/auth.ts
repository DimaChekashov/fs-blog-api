import jwt from "jsonwebtoken";

export const createToken = () => {
  const token = jwt.sign({ foo: "bar" }, "shhhh");

  console.log(token);
};
