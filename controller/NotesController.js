const sqliteConnection = require("../database/sqlite")
const AppError = require("../utils/AppError")

class NotesController {
    async create(request, response) {
        const { title, description, rating, tags } = request.body
        const { user_id } = request.params

        const database = await sqliteConnection()

        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])
        const noteExists = await database.get("SELECT title FROM notes WHERE title = (?)", [title])

        if(!user) {
            throw new AppError("Este usuário não existe.")
        }

        if(noteExists) {
            throw new AppError("Esta nota já existe.")
        }

        if(rating < 1 || rating > 5) {
            throw new AppError("Rating só pode variar de 1 até 5.")
        }
        
        const { lastID } = await database.run("INSERT INTO notes (title, description, rating, user_id) VALUES (?, ?, ?, ?)", [title, description, rating, user_id])

        tags.map(async tag => {
            await database.run("INSERT INTO tags (note_id, user_id, name) VALUES (?, ?, ?)", [lastID, user_id, tag])
        })

        return response.status(201).json()
    }

    async update(request, response) {
        const { id } = request.params
        const { title, description, rating } = request.body

        const database = await sqliteConnection()
        
        const note = await database.get("SELECT * FROM notes WHERE id = (?)", [id])
        const titleExists = await database.get("SELECT * FROM notes WHERE title = (?)", [title])

        if(!note) {
            throw new AppError("Esta nota não existe.")
        }

        if(titleExists) {
            throw new AppError("Esta nota já existe.")
        }

        if(rating < 1) {
            rating = 1
        }
        
        if(rating > 5) {
            rating = 5
        }

        await database.run(`UPDATE notes SET
            title = ?,
            description = ?,
            rating = ?,
            updated_at = DATETIME('now')
            WHERE id = ?
        `, [title, description, rating, id])

        return response.status(204).json()
    }

    async index(request, response) {
        const database = await sqliteConnection()
        const notes = await database.all("SELECT id, title, description, rating, user_id FROM notes")
        
        const tags = await database.all("SELECT * FROM tags")

        // Mapeia todas as notas
        const notesWithTags = notes.map(note => {
            // Filtra as que possuem mesmo id que a note atual
            const noteTags = tags.filter(tag => tag.note_id === note.id)
            
            // Retorna um object literals com as tags já nas notes
            return {
                ...note,
                tags: noteTags.map(tag => tag.name)
            }
        })

        return response.json(notesWithTags)
    }

    async show(request, response) {
        const { id } = request.params

        const database = await sqliteConnection()
       
        const note = await database.get("SELECT title, description, rating, user_id FROM notes WHERE id = (?)", [id])

        if(!note) {
            throw new AppError("Esta nota não existe.")
        }

        const tags = await database.all("SELECT name FROM tags WHERE note_id = (?)", [id]).then(tags => tags.map(tag => tag.name))

        return response.json({
            ...note,
            tags
        })
    }

    async delete(request, response) {
        const { id } = request.params

        const database = await sqliteConnection()
        await database.run("DELETE FROM notes WHERE id = ?", [id])
        await database.run("DELETE FROM tags WHERE note_id = ?", [id])

        return response.json()
    }
}

module.exports = NotesController