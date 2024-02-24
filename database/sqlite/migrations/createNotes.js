const createNotes = `
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR,
        description VARCHAR,
        rating INTEGER,
        user_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fkUser_id FOREIGN KEY (user_id) REFERENCES users (id)
    );
`

module.exports = createNotes