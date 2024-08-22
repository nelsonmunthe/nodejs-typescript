import { Router } from "express";
import userHeaderRoute from "./userHeaderRoute";

const router = Router();

router.use('/user-header', userHeaderRoute)

export default router