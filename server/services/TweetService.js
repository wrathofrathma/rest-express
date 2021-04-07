const Models = require("../../models")

import AuthService from './AuthService';

export default {
    async create({user, contents}) {
        const tweet = await Models.Tweet.create({
            UserId: user.id,
            contents
        });
        tweet.User = user;
        return this.jsonify(tweet);
    },
    async update({user, id, contents}) {
        const tweet = await Models.Tweet.findOne({
            where: {
                id: id
            },
            include: Models.User
        })

        await AuthService.verifyPermission(user, tweet);
        await tweet.update({contents})
        return this.jsonify(tweet);
    },
    async delete({user, id}) {
        const tweet = await Models.Tweet.findOne({
            where: {
                id: id
            },
            include: Models.User
        })
        await AuthService.verifyPermission(user, tweet);
        await tweet.destroy();
        return this.jsonify(tweet);
    },
    async get({id}) {
        return await Models.Tweet.findOne({
            where: {
                id: id
            },
            include: Models.User
        })
        .then((tweet) => {
            return this.jsonify(tweet)
        })
    },
    jsonify(tweet) {
        return {
            id: tweet.id,
            contents: tweet.contents,
            createdAt: tweet.createdAt,
            updatedAt: tweet.updatedAt,
            user: {
                username: tweet.User.username,
                id: tweet.User.id
            }
        }
    }
}