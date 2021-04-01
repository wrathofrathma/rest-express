import { openDb } from '../server/database';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/* Honestly I probably don't need to make a unit test for database functionality
 I'm just stretching my mental legs and learning*/

async function test_open() {
    const db = await openDb();
    expect(db).toEqual(
        expect.objectContaining({
            config: expect.anything(),
            db: expect.any(sqlite3.Database)
        })
    ); 
}

async function test_create_table() {
    const db = await openDb();
    // Create a testing table
    await db.exec("CREATE TABLE TESTING (SOMEKEY NUMBER PRIMARY KEY, SOMECOL TEXT);");
    // This query queries the table name to show it exists
    const res = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='TESTING';");
    // Expecting our result to be the object
    // { name: 'TESTING' }
    expect(res).toEqual(expect.objectContaining({
        name: expect.stringMatching('TESTING')
    }));
    await db.exec("DROP TABLE TESTING;");
}


async function test_crud_users() {
    const db = await openDb();
    // User data
    const username = 'rathma';
    const password = 'somepass';
    const new_password = 'newpassword';

    // Create/insert
    await db.exec(`INSERT INTO users (username, password) VALUES ('${username}','${password}');`)

    //read/fetch
    var res = await db.get('SELECT * FROM users;');
    expect(res).toEqual(expect.objectContaining({
        username: expect.stringMatching(username),
        password: expect.stringMatching(password)
    }));

    //Update
    await db.run(`UPDATE users SET password = '${new_password}' WHERE username = '${username}';`);
    res = await db.get(`SELECT password FROM users WHERE username = '${username}';`);
    expect(res).toEqual(expect.objectContaining({
        password: expect.stringMatching(new_password)
    }));

    //Delete
    await db.exec(`DELETE FROM users WHERE username = '${username}';`);
    res = await db.get(`SELECT * FROM users WHERE username = '${username}';`)
    expect(res).toBeUndefined();
}

async function test_tweets() {
    const db = await openDb();
    // Tweet contents
    var user_id;
    const content = 'hello world';
    const updated_content = 'Bai bai world';
    const username = 'rathma';
    const password = 'somepass';

    // Create User
    await db.exec(`INSERT INTO users (username, password) VALUES ('${username}', '${password}');`);
    
    // Get user id
    const user_data = await db.get("SELECT * FROM users WHERE username = 'rathma';");
    user_id = user_data.id;

    // Create tweet
    await db.exec(`INSERT INTO tweets (user_id,contents) VALUES (${user_id}, '${content}');`);

    // Read tweet
    var res = await db.get(`SELECT * FROM tweets WHERE user_id = ${user_id};`);
    expect(res).toEqual(expect.objectContaining({
        id: expect.anything(),
        contents: expect.stringMatching(content)
    }));

    const tweet_id = res.id;

    // Update tweet
    db.exec(`UPDATE tweets SET contents = '${updated_content}' WHERE id = ${tweet_id};`);
    res = await db.get(`SELECT * FROM tweets WHERE id = ${tweet_id};`);
    expect(res).toEqual(expect.objectContaining({
        id: expect.any(Number),
        contents: expect.stringMatching(updated_content),
        user_id: expect.any(Number)
    }));

    // Delete
    await db.exec(`DELETE FROM tweets WHERE id = ${tweet_id};`);
    res = await db.get(`SELECT * FROM tweets WHERE id = ${tweet_id};`);
    expect(res).toBeUndefined();

    // Test for tweet constraints
    // We'll insert a few tweets real quick
    await db.exec(`INSERT INTO tweets (user_id,contents) VALUES (${user_id}, '${content}'), (${user_id}, '${content}'), (${user_id}, '${content}');`);
    // MAke sure they exist and we can get at least one
    res = await db.get(`SELECT * FROM tweets WHERE user_id = ${user_id};`);
    expect(res).toEqual(expect.objectContaining({
        id: expect.anything(),
        contents: expect.anything(),
        user_id: expect.anything()
    }));
    // Delete our user
    await db.exec(`DELETE FROM users WHERE username = '${username}';`);
    // Try to fetch a tweet, should all be deleted
    res = await db.get(`SELECT * FROM tweets WHERE user_id = ${user_id};`);
    expect(res).toBeUndefined();
}

test('Database:Open', test_open);
test('Database:CreateTable', test_create_table);
test('Database:UsersCRUD', test_crud_users);
test('Database:Tweets', test_tweets);