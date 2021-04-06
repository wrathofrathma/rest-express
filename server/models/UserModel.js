import { openDb } from '../database';
import Tweet from './TweetModel';

class UserModel {
    constructor({username, password, id}) {
        this.username = username;
        this.password = password;
        this.id = id;
    }

    /**
     * Fetches a user from the database and returns a UserModel with the user's data.
     * @param {id, username} param0  id or username must be provided to specify which user's data to fetch.
     * @returns 
     */
    static async get({id, username}) {
        const db = await openDb();

        var res;
        if(id) { 
            res = await db.get("SELECT * FROM users where id = ?;", id);
        }
        else if(username) {
            res = await db.get("SELECT * FROM users where username = ?;", username);
        }

        if(!res) {
            throw new Error("User not found");
        }

        return new UserModel({
            username: res.username,
            password: res.password,
            id: res.id
         })
    }

    /**
     * 
     * @param {Object} params Contains username & password properties for user registration
     */
    static async create({username, password}) {
        // Check for username and password
        if(!username || !password) {
            throw new Error("Missing username or password");
        }
        const db = await openDb();

        return await db.run("INSERT INTO users (username, password) VALUES (?, ?);", [username, password])
        .then((res) => {
            //If we make it here, then we created a new user successfully.
            return new UserModel({
                username,
                password,
                id: res.lastID
            });
        })
        .catch((err) => {
            throw new Error("Duplicate user");
        })
    }

    /**
     * 
     * @param {Object} params Contains user_id or username properties for user deletion
     */
    async delete() {
        const db = await openDb();
        await db.run("DELETE FROM users WHERE id = ?;", this.id);
    }

    /**
     * 
     * @param {Object} params Contains a user_id and the updated username and/or password properties
     */
    async update({username, password}){
        var self = this;
        const db = await openDb();
        var stmt;
        var params;
        if(username && password) {
            stmt = "UPDATE users SET username = ?, password = ? WHERE id = ?;";
            params = [username, password, self.id];
        } 
        else if(username) {
            stmt = "UPDATE users SET username = ? WHERE id = ?;";
            params = [username, self.id];

        }
        else if (password) {
            stmt = "UPDATE users SET password = ? WHERE id = ?;";
            params = [password, self.id];
        }
        else{
            throw new Error("Missing updated property");
        }
        await db.run(stmt, params)
        .then(function () {
            // After it runs, we should update our local data. We can assume it updated successfully.
            if(username){
                self.username = username;
            }
            if(password) {
                self.password = password;
            }
        })
    }

    async tweets() {
        const db = await openDb();
        const res = await db.all("SELECT * FROM tweets WHERE user_id = ?", this.id);
        
        if(!res)
            return [];
        
        const user_tweets = res.map(t => new Tweet({
            id: t.id,
            user_id: t.user_id,
            contents: t.contents
        }));

        return user_tweets;
    }

    json() {
        return {
            id: this.id,
            username: this.username,
            password: this.password
        }
    }
}

module.exports = UserModel;