--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE tweets (
    id INTEGER PRIMARY KEY,
    contents TEXT NOT NULL,
    hashtags TEXT,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_userid FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE tweets;