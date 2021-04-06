import * as jwt from 'jsonwebtoken';
import User from '../models/UserModel';

function parseAuthToken(req) {
    if(req.headers.authorization  && req.headers.authorization.split(' ')[0] === "Bearer")
        return req.headers.authorization.split(' ')[1];
}

export default async function (req, res, next) {
    const token = parseAuthToken(req);
    return await jwt.verify(token, "SomeRandomSekrit", async (err, decoded) => {
        if(err) 
            next(new Error("Invalid token"));
        req.user = await User.get({id: decoded.data.id});
        return next();
    })
    .catch((err) => {
        next(err);
    })
}