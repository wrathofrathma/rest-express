import Exception from '../exceptions/GenericException';

const UserService = {
    async delete({user}) {
        return await user.delete()
        .then(() => {
            return {
                id: user.id,
                username: user.username
            }
        })
    },

    async update({user, username, password}) {
        return await user.update({username, password})
        .then(() => {
            return {
                id: user.id,
                username: user.username,
            }
        })
        .catch((err) => {
            throw new Exception({
                message: err.message,
                status: 422,
            })
        })
    },

    async tweets({user}) {
        return await user.tweets()
        .then((utweets) => {
            return utweets.map(t => t.json());
        })
    }
}

export default UserService;