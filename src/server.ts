import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

const app = express();

dotenv.config();

app.get("/hello", (req: Request, res: Response) => {
  res.send("<h1>Hello World!</h1>");
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${process.env.SERVER_PORT}`);
});
