import { Request, Response, } from "express";
import GenericResponseEntity from "../../../entities/GenericResponseEntity";
import Validator from "validatorjs";
import UserHeaderModel from "../../../models/UserHeaderModel";
import RoleHeaderModel from "../../../models/RoleHeader";
import bcrypt from "bcryptjs";

class UserRevampUsecase {
    constructor(){

    }

    async login(req: Request){
        const response = new GenericResponseEntity();
        try {
            const { username, password} = req.body;

            const rules = {
                username: 'required|string',
                password: 'required|string',
            };

            const validator = new Validator(req.body, rules);

            if (!validator.check()) {
                response.message = 'Form invalid.';
                response.data = validator.errors.all();
                return response;
            };

            const user =  await UserHeaderModel.findOne({
                where: {
                    username
                },
                include: [
                    {
                        model: RoleHeaderModel,
                        as: 'role',
                        attributes: ['id', 'name'],
                    }
                ]
            })
            
            if(!user) return  response.errorResponse('Invalid Username, Please Contact your administrator.', 404, null);
            if(!user?.dataValues?.status) return  response.errorResponse(`User Inactive, Please Contact your administrator.`, 404, null);
            
            const isPasswordValid = await bcrypt.compare(password, user.dataValues.password);
           
            if(!isPasswordValid) return response.errorResponse(`Invalid Password, Please Contact your administrator.`, 404, null);
            return response.successResponse('login succeeded', 200, username)

        } catch (error:any) {
            return response.errorResponse(error.message, 404, null)
        }
    }
}

export default UserRevampUsecase;