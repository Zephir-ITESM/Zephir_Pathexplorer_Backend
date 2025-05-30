import { Router } from "express"
import { loginUser, logoutUser, refreshToken, getCurrentUser } from "../controllers/authController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Public routes
router.post("/login", loginUser)
router.post("/refresh-token", refreshToken)

// Protected routes
router.post("/logout", authenticateToken, logoutUser)
router.get("/me", authenticateToken, getCurrentUser)

export default router
