import { Router } from "express"
import {
  getUserProfile,
  updateUserProfile,
  getUserById,
  listUsers,
  changeUserType,
  deleteUser,
  createUser,
  getUserPathCarrera,
} from "../controllers/userControllers"
import { authenticateToken, requireAdmin } from "../middleware/auth"

const router = Router()

// User profile routes (authenticated)
router.get("/profile", authenticateToken, getUserProfile)
router.put("/profile", authenticateToken, updateUserProfile)
router.get("/path-carrera", authenticateToken, getUserPathCarrera)

// Admin routes (require admin role)
router.get("/list", authenticateToken, requireAdmin, listUsers)
router.get("/:id", authenticateToken, requireAdmin, getUserById)
router.put("/:id/type", authenticateToken, requireAdmin, changeUserType)
router.delete("/:id", authenticateToken, requireAdmin, deleteUser)
router.post("/", authenticateToken, requireAdmin, createUser)

export default router
