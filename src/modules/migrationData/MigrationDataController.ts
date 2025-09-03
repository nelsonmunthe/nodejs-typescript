import { Request, Response,  NextFunction } from "express";
import { httpResponse } from "../../helper/response";
import MigrationDataUsecase from "./migrationDataUsecase/MigrationDataUsecase";

class MigrationDataController{
    migrationDataUsecase:any

    constructor(){
        this.migrationDataUsecase = new MigrationDataUsecase()
    }

    async customerVerification(req: Request, res: Response, next: NextFunction){
        httpResponse(await this.migrationDataUsecase.customerVerification(req), res )
    }

    async uploadDocument(req: Request, res: Response, next: NextFunction){
        httpResponse(await this.migrationDataUsecase.uploadDocument(req), res )
    }

    async customerVerificationDocument(req: Request, res: Response, next: NextFunction){
        httpResponse(await this.migrationDataUsecase.customerVerificationDocument(req), res )
    }
}

export default MigrationDataController;