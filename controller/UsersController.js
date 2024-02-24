const sqliteConnection = require("../database/sqlite")
const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body

        const database = await sqliteConnection()

        const userExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        // Valida se o usuário já existe
        if(userExists) {
            throw new AppError("Este email já está em uso.")
        }

        const encryptedPass = await hash(password, 8)
        
        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, encryptedPass])
        return response.status(201).json()
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body
        const { id } = request.params

        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        // Valida se o user existe
        if(!user) {
            throw new AppError("Usuário não encontrado.")
        }

        const usersWithEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        // Valida se já possue outro usuário com o email digitado
        if(usersWithEmail && usersWithEmail.id !== user.id) {
            throw new AppError("Já existe um usuário cadastrado com este email.")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        // Valida se existe uma senha antiga
        if(password && !old_password) {
            throw new AppError("É preciso informar a senha antiga para alterar a senha.")
        }

        if(password) {
            const comparePass = await compare(old_password, user.password)

            if(!comparePass) {
                throw new AppError("A senha antiga não está correta.")
            }

            user.password = await hash(password, 8)
        }

        await database.run(`UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, id])

        return response.status(204).json()
    }
}

module.exports = UsersController