import UserService from '../services/UserService';

const UserController = {
    async delete(req, res, next) {
        await UserService.delete(req)
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            next(err);
        })
    },
    async update(req, res, next) {
        await UserService.update({
            user: req.user,
            username: req.body.username,
            password: req.body.password
        })
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            next(err)
        })
    },
    async tweets(req, res, next) {
        await UserService.tweets(req)
        .then((user_tweets) => {
            res.send(user_tweets);
        })
        .catch((err) => {
            next(err)
        })
    }
}

export default UserController;