const createTags = `
    CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        note_id INTEGER,
        user_id INTEGER,
        name VARCHAR,
        CONSTRAINT note_id FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
        CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES users (id)
    );
`

module.exports = createTags