const Models = require('../models')
const User = Models.User;
const Tweet = Models.Tweet;

describe('sequelize:CRUD', () => {
    var user;
    const username = "rathma";
    const password = "somepass";
    const username2 = "rathma2";

    test('Create User', async () => {
        user = await User.create({
            username,
            password
        });
        expect(user).toEqual(expect.any(User));
    })
    
    test('Get User', async () => {
        user = await User.findOne({
            where: {
                username
            }
        });
        expect(user).toEqual(expect.any(User));
    })

    test('Update User', async () => {
        const res = await User.update({username: username2}, {
            where: {
                id: user.id
            }
        })
        expect(res).toEqual([1])
    })


    var tweet;
    test('Create tweet', async () => {
        tweet = await Tweet.create({
            UserId: user.id,
            contents: "Hello world!"
        })
        expect(tweet).toEqual(expect.any(Tweet))
    })
    test('Get user tweets', async () => {
        const tweets = await user.getTweets();
        expect(tweets).toEqual(expect.arrayContaining([expect.any(Tweet)]))
    })
    test('Delete tweet', async () => {
        await tweet.destroy();
    })
    test('Create tweet bad uid', async () => {
        const badtweet = async () => {
            tweet = await Tweet.create({
                UserId: 0,
                contents: "Hello world!"
            })
        }
        expect(badtweet).rejects
    })
    test('Delete User', async () => {
        const res = await User.destroy({
            where: {
                id: user.id
            }
        });
        expect(res).toEqual(1); // 1 = deleted, 0 = not
    })
})
