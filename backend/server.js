import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import apiRouter from "./routes/api.js"

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontend = path.join(__dirname, "../frontend/barbars/dist")
app.use(express.static(frontend))
const port = 3000
app.use(cors())
app.use(express.json())
app.use("/api", apiRouter)


// app.get("/api/message" , (req, res) => {
//     res.json({
//        message:"Hello World!"
//     })
// })

// app.post("/api/message", (req, res) => {
//     const { message } = req.body
//     res.json({
//         message: `You sent: ${message}`
//     })
// })

// app.get("/{*splat}", (req, res) => {
//     res.sendFile(path.join(frontend, "index.html"))
// })
app.listen(port, () => console.log(`Example app listening on port  https://locahost::${port}  !`)) 