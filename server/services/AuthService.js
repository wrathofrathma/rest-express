const User = require("../../models").User;
import Exception from '../exceptions/GenericException';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

const AuthService = {
    async login({username, password}) {
        const user = await User.findOne({
            where: {username}
        });

        const correct_pwd = await argon2.verify(user.password, password);
        if(!correct_pwd){
            throw new Exception({
                message: "Invalid login details",
                status: 401
            })
        }
        
        return {
            user: {
                id: user.id,
                username: user.username
            },
            token: AuthService.generateJWT(user)
        }
    },

    async register({username, password}) {
        await User.create({
            username, 
            password: await argon2.hash(password)
        });
        return await AuthService.login(...arguments);
    },

    generateJWT(user) {
        const data = {
            id: user.id,
            username: user.username
        };

        const signature = "SomeRandomSekrit";
        const expiration = "6h";
        
        return jwt.sign({data, }, signature, { expiresIn: expiration});
    },

    async verifyPermission(user, resource) {
        if(!resource){
            throw new Exception({
                message: "Resource not exist",
                status: 404
            });
        }

        if(user.id !== resource.User.id) {
            throw new Exception({
                message: "Invalid access",
                status: 401
            });
        }
    }


}

export default AuthService;