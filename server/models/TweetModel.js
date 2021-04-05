import { openDb } from '../database';
import Exception from '../exceptions/GenericException';

class TweetModel {
    constructor({id, user_id, contents}){
        this.id = id;
        this.contents = contents;
        this.user_id = user_id;
    }

   static async create({user_id, contents}) {
        if(!contents || !user_id) {
            throw new Exception({
                message: "Missing tweet contents or user_id",
                code: "E_NOT_PROCESSABLE",
                status: 422
            });
        }

        // Insert into the database
        const db = await openDb();
        return await db.run("INSERT INTO tweets (user_id, contents) VALUES (?,?);", user_id, contents)
        .then((res) => {
            // res will contain the row_id which is == our primary key id
            return new TweetModel({
                id: res.lastID,
                user_id: user_id,
                contents: contents
            });
        })
    }

    static async get({id}) {
        if(!id) {
            throw new Exception({
                message: "Missing tweet id parameter",
                code: "E_UNPROCESSABLE_PARAMS",
                status: 422
            })
        }

        const db = await openDb();
        const res = await db.get("SELECT * FROM tweets WHERE id = ?;", id);
        
        if(!res) {
            throw new Exception({
                message: "Tweet doesn't exist",
                code: "E_RESOURCE_DOES_NOT_EXIST",
                status: 404
            })
        }

        return new TweetModel({
            id: res.id,
            user_id: res.user_id,
            contents: res.contents
        });
    }

    async delete() {
        const db = await openDb();
        await db.run("DELETE FROM tweets WHERE id = ?", this.id);
    }

    async update({contents}) {
        if(!contents){
            throw new Exception({
                message: "Missing tweet contents",
                code: "E_UNPROCESSABLE_PARAMS",
                status: 422
            })
        }

        const db = await openDb();
        const self = this;
        await db.run("UPDATE tweets SET contents = ? WHERE id = ?", [contents, this.id])
        .then((res) => {
            self.contents = contents;
        })
    }
}

module.exports = TweetModel;