require("express-async-errors") // Deve ser declarado acima das 
const express = require("express")
const routes = require("./routes")
const migrationsRun = require("./database/sqlite/migrations")
const AppError = require("./utils/AppError")

migrationsRun()

const app = express()
app.use(express.json()) // Habilita o retorno de JSON por meio dos middlewares

app.use(routes)

app.use(( error, request, response, next ) => {
    if(error instanceof AppError) {
        return response.status(400).json({
            status: "error",
            message: error.message
        })
    }

    console.error(error)

    return response.status(500).json({
        status: "error",
        message: "Internal server error."
    })
})

const PORT = 3333
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))