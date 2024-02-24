const { Router } = require("express")
const NotesController = require("../controller/NotesController")

const notesController = new NotesController()

const notesRoutes = Router()

notesRoutes.get("/", notesController.index)
notesRoutes.post("/:user_id", notesController.create)
notesRoutes.put("/:id", notesController.update)
notesRoutes.get("/:id", notesController.show)
notesRoutes.delete("/:id", notesController.delete)


module.exports = notesRoutes