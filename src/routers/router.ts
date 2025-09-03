import { Router } from "express";
import migrationDataRouter from "./migrationDataRouter";

const router = Router();

router.use('/migration', migrationDataRouter)

export default router