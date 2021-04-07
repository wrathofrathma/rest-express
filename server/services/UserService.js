import Exception from '../exceptions/GenericException';
import TweetService from './TweetService';

const UserService = {
    async delete({user}) {
        return await user.destroy()
        .then(() => {
            return UserService.jsonify(user);
        })
    },

    async update({user, username, password}) {
        return await user.update({username, password})
        .then(() => {
            return UserService.jsonify(user);
        })
        .catch((err) => {
            throw new Exception({
                message: err.message,
                status: 422,
            })
        })
    },

    async tweets({user}) {
        return await user.getTweets()
        .then((ts) => {
            return ts.map(t => {
                t.User = user;
                return TweetService.jsonify(t);
            })
        })
    },

    jsonify(user) {
        return {
            id: user.id,
            username: user.username
        }
    }
}

export default UserService;