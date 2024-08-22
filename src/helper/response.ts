import { Response } from "express";
import GenericResponseEntity from "../entities/GenericResponseEntity";

export const httpResponse = (entity: GenericResponseEntity, res: Response) => {
    if(entity instanceof GenericResponseEntity){
        const response = entity.toResponse();

        res.status(response.statusCode).send({
            success: response.success,
            message: response.message,
            messageTitle: response.messageTitle,
            data: response.data,
            responseTime: response.responseTime,
        });

        return;
    }

    res.status(500);
};
