import { openDb } from '../database';
import Exception from '../exceptions/GenericException';
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
        else {
            throw new Exception({
                message: "Missing user_id or username",
                code: "E_UNPROCESSABLE_PARAMS",
                status: 422
            })
        }

        if(!res) {
            throw new Exception({
                message: "User doesn't exist",
                code: "E_RESOURCE_DOES_NOT_EXIST",
                status: 404
            })
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
            throw new Exception({
                message: "Missing username or password",
                code: "E_NOT_PROCESSABLE",
                status: 422
            })
        }
        const db = await openDb();

        return await db.run("INSERT INTO users (username, password) VALUES (?, ?);", [username, password])
        .catch((err) => {
            if(err.message==='SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username'){
                throw new Exception({
                    message: 'User already exists',
                    code: 'E_DUPLICATE_RESOURCE',
                    status: 409
                });
            }
        })
        .then((res) => {
            //If we make it here, then we created a new user successfully.
            return new UserModel({
                username,
                password,
                id: res.lastID
            });
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
            throw new Exception({
                message: "Missing updated property.",
                code: "E_NOT_PROCESSABLE",
                status: 422
            });
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
        
        const user_tweets = res.map(({t}) => new Tweet({
            id: t.id,
            user_id: t.user_id,
            content: t.content
        }));

        return user_tweets;
    }
}

module.exports = UserModel;