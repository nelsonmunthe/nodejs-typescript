import express, { Request, Response, NextFunction } from "express";
import UserRevampController from "../modules/userRevamp/UserRevampController";

const router =  express.Router();

router.post('/login', async (req: Request, res: Response, next : NextFunction) => {
    try {
        await new UserRevampController().login(req, res, next)
    } catch (error) {
        next(error)
    }
})


export default router;
