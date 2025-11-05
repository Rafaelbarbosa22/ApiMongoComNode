import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/config/routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API Node rodando 🚀"));
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
