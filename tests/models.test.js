import User from '../dist/models/UserModel';
import Tweet from '../dist/models/TweetModel';

describe('Models:User', () => {
    const username = 'models_u_rathma';
    const password = 'somepass';
    const newusername = 'models_u2_rathma';
    const newpassword = 'somepass2';

    var user;
    // Similar to our CRUD testing, we need to test the same functionality, just abstracted.
    // Create our user
    test('Models:User:Create', async () => {
        user = await User.create({
            username,
            password
        });
        // Check that it returned a user correctly.
        expect(user).toEqual(expect.any(User));
    })

    // Fetch our user by username. Redunant because we couldn't return our user if this didn't work, but still worth
    test('Models:User:Read', async () => {
        user = await User.get({username});
        expect(user).toEqual(expect.any(User));
    })

    test('Models:User:Update', async () => {
        // Separate updates first
        await user.update({username: newusername});
        await user.update({password: newpassword});
        //Check if they're changed in the local object.
        expect(user.username).toEqual(expect.stringMatching(newusername));
        expect(user.password).toEqual(expect.stringMatching(newpassword));
        // Now let's fetch the user again and check if it exists
        user = await User.get({username: newusername});
        expect(user).toEqual(expect.any(User));
        //Check variables set in properly.
        expect(user.username).toEqual(expect.stringMatching(newusername));
        expect(user.password).toEqual(expect.stringMatching(newpassword));
    })
    test('Models:User:Update2', async () => {
        // Set back to the original values using both at once
        await user.update({
            username,
            password
        });
        //Check if they're changed in the local object.
        expect(user.username).toEqual(expect.stringMatching(username));
        expect(user.password).toEqual(expect.stringMatching(password));
        // Now let's fetch the user again and check if it exists
        user = await User.get({username});
        expect(user).toEqual(expect.any(User));
        //Check variables set in properly.
        expect(user.username).toEqual(expect.stringMatching(username));
        expect(user.password).toEqual(expect.stringMatching(password));
    })

    test('Models:User:Delete', async () => {
        // Delete our user
        await user.delete();

        // Try to fetch deleted user, should throw a 404 exception
        const get_user = async () => {
            await User.get({username});
        }
        await expect(get_user()).rejects.toThrow("User not found");
    })
})



describe('Models:Tweets', () => {
    const username = 'models_t_rathma';
    const password = 'somepass';
    var user;
    var tweets;
    var tweet1, tweet2;

    test('Models:Tweets:NewUserTweets', async () => {
        user = await User.create({
            username,
            password
        });

        // Test empty tweets fetch
        tweets = await user.tweets();
        expect(tweets).toEqual([]);
    })

    

    // Insert a few tweets
    const t1_content = "Hello world";
    const t1_content2 = "Hello rathma";
    const t2_content = "Baibai world";

    test('Models:Tweets:Create', async () => {
        tweet1 = await Tweet.create({
            user_id: user.id,
            contents: t1_content 
        })

        tweet2 = await Tweet.create({
            user_id: user.id,
            contents: t2_content
        })

        //Check that we return the correct object
        expect(tweet1).toEqual(expect.any(Tweet));
        expect(tweet2).toEqual(expect.any(Tweet));

        // Check that the contents were transferred correctly
        expect(tweet1.contents).toEqual(expect.stringMatching(t1_content));
        expect(tweet2.contents).toEqual(expect.stringMatching(t2_content));

        // Check the user id matches
        expect(tweet1.user_id).toEqual(user.id);
        expect(tweet2.user_id).toEqual(user.id);
    })

    test('Models:Tweets:Read', async () => {
        // Now we should fetch fresh and see if they match
        tweet1 = await Tweet.get({id: tweet1.id});
        // Check all the contents match
        expect(tweet1).toEqual(expect.any(Tweet));
        expect(tweet1.contents).toEqual(expect.stringMatching(t1_content));
        expect(tweet1.user_id).toEqual(user.id);
    })

    test('Models:Tweets:Update', async () => {
        // Update our tweet
        await tweet1.update({contents: t1_content2});
        // Check local object properties
        expect(tweet1.contents).toEqual(expect.stringMatching(t1_content2));

        // Requery database and check that the values there updated also.
        tweet1 = await Tweet.get({id: tweet1.id});
        expect(tweet1).toEqual(expect.any(Tweet));
        expect(tweet1.contents).toEqual(expect.stringMatching(t1_content2));
    })

    test('Models:Tweets:Delete', async () => {
        // Let's delete tweet 2
        await tweet2.delete();
        const getTweet = async (id) => {
            return await Tweet.get({id});
        }
        // Should throw tweet not found exception
        expect(getTweet(tweet2.id)).rejects.toThrow("Tweet not found");
    })

    test('Models:Tweets:UserDelete', async () => {
        // Delete user and check for tweets by them
        await user.delete();
        // Since the delete method just deletes in the database, our local object still has the user id and its methods will still fire.
        //Check tweets by them have been deleted.
        tweets = await user.tweets();
        expect(tweets).toEqual([]);
    })
})