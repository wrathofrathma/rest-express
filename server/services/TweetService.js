import TweetModel from '../models/TweetModel';
import AuthService from './AuthService';

export default {
    async create({user, contents}) {
        const tweet = await TweetModel.create({
            user_id: user.id,
            contents
        });
        return tweet.json();
    },
    async update({user, id, contents}) {
        const tweet = await TweetModel.get({id});
        await AuthService.verifyPermission(user, tweet);
        await tweet.update({contents})
        return tweet.json();
    },
    async delete({user, id}) {
        const tweet = await TweetModel.get({id});
        await AuthService.verifyPermission(user, tweet);
        await tweet.delete();
        return tweet.json();
    },
    async get({id}) {
        return await TweetModel.get({id})
        .then((tweet) => {
            return tweet.json();
        })
    }
}