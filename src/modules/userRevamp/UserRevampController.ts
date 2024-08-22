import { Request, Response,  NextFunction } from "express";
import { httpResponse } from "../../helper/response";
import UserRevampUsecase from "./userRevampUsecase/UserRevampUsecase";

class UserRevampController{
    userRevampUsecase:any

    constructor(){
        this.userRevampUsecase = new UserRevampUsecase()
    }

    async login(req: Request, res: Response, next: NextFunction){
        httpResponse(await this.userRevampUsecase.login(req), res )
    }
}

export default UserRevampController;