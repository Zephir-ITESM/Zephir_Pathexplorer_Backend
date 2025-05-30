import dotenv from "dotenv"
dotenv.config()

// Now import everything else
import express from "express"
import cors from "cors"
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health check available at http://localhost:${PORT}/health`)
})

export default app
