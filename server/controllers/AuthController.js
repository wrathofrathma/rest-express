import AuthService from '../services/AuthService';

const AuthController = {
    async login(req, res, next) {
        await AuthService.login({
            username: req.body.username, 
            password: req.body.password
        })
        .then((login_data) => {
            res.send(login_data);
        })
        .catch((err) => {
            next(err);
        })
    },

    async register(req, res, next) {
        await AuthService.register({
            username: req.body.username, 
            password: req.body.password
        })
        .then((login_data) => {
            res.send(login_data);
        })
        .catch((err) => {
            next(err);
        })
    }
}

export default AuthController;