import { openDb } from '../database';

class TweetModel {
    constructor({id, user_id, contents}){
        this.id = id;
        this.contents = contents;
        this.user_id = user_id;
    }

   static async create({user_id, contents}) {
        if(!contents || !user_id) {
            throw new Error("Missing tweet contents or user_id");
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
            throw new Error("Missing tweet id")
        }

        const db = await openDb();
        const res = await db.get("SELECT * FROM tweets WHERE id = ?;", id);
        
        if(!res) {
            throw new Error("Tweet not found")
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
            throw new Error("Missing tweet contents");
        }

        const db = await openDb();
        const self = this;
        await db.run("UPDATE tweets SET contents = ? WHERE id = ?", [contents, this.id])
        .then((res) => {
            self.contents = contents;
        })
    }

    json() {
        return {
            id: this.id,
            user_id: this.user_id,
            contents: this.contents
        }
    }
}

module.exports = TweetModel;