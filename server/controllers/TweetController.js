import TweetService from '../services/TweetService';

export default {
    async create(req, res, next) {
        await TweetService.create({
            user: req.user,
            contents: req.body.contents
        })
        .then((tweet) => {
            res.send(tweet);
        })
        .catch((err) => {
            next(err);
        })
    },
    async delete(req, res, next) {
        await TweetService.delete({
            id: req.params.id,
            user: req.user
        })
        .then((tweet) => {
            res.send(tweet);
        })
        .catch((err) => {
            next(err);
        })
    },
    async update(req, res, next) {
        await TweetService.update({
            user: req.user,
            id: req.params.id,
            contents: req.body.contents
        })
        .then((tweet) => {
            res.send(tweet);
        })
        .catch((err) => {
            next(err);
        })
    },
    async get(req, res, next) {
        await TweetService.get({
            id: req.params.id
        })
        .then((tweet) => {
            res.send(tweet);
        })
        .catch((err) => {
            next(err);
        })
    }
}