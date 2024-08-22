import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors  from "cors";
import router from "./routers/router";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors<Request>({
  credentials: true,
  origin: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/v1/api", router);


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});