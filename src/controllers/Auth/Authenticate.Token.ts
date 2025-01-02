import { Response } from "express";
import { CustomRequest } from "../../middlewares/AuthenticateToken.middleware";


class AuthenticateToken{
   async giveNewAceessToken(req:CustomRequest,res:Response){
        
   }
}


export default new AuthenticateToken()