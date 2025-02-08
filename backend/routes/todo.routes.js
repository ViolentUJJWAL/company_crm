const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const checkActiveStatus = require("../middleware/checkActiveStatus");
const { createTodo, updateTodo, getAllTodos, getTodos } = require("../controllers/todo.controller");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.post("/", authMiddleware, checkActiveStatus, createTodo )
router.put("/:todoId", authMiddleware, checkActiveStatus, updateTodo )
router.get("/all", authMiddleware, checkActiveStatus, checkRole("SuperAdmin", "CompanyAdmin") , getAllTodos )
router.get("/", authMiddleware, checkActiveStatus, getTodos )

module.exports = router;
