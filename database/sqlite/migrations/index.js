const sqliteConnection = require("../../sqlite")
const createUsers = require("./createUsers")
const createNotes = require("./createNotes")
const createTags = require("./createTags")

async function migrationsRun() {
    const schemas = [ createUsers, createNotes, createTags ].join('')

    sqliteConnection().then(db => db.exec(schemas)).catch(error => console.log(error))
}

module.exports = migrationsRun