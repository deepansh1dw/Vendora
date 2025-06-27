import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import {sql} from "./config/db.js";
import { aj } from "./Library/arcjet.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();


app.use(express.json());
app.use(cors());
app.use(helmet()); 
app.use(morgan("dev")); 

app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
        requested:1
    })

    if(decision.isDenied()){
        if(decision.reason.isRateLimit()){
            res.status(429).json({
                error : "Rate limit exceeded. Please try again later."
            });
            }else if(decision.reason.isBot()){
                res.status(403).json({ error: "Access denied for bots." });       
            }else{
                res.status(403).json({ error: "forbidden" });
            }
        } 
        
        next();
    
    }catch (error) {
    
        console.error("Arcjet protection error:", error);
        next(error);
    }
 })

app.use("/api/products" , productRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    })
} 

async function initDB() {
    try {
      await sql`
       CREATE TABLE IF NOT EXISTS prducts (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       image VARCHAR(255) NOT NULL,
       price DECIMAL(10,2) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       )
      `; 
    } catch (error) {
        console.log("error initializing DB" , error);
    }
    
}

initDB().then(() =>{
    app.listen(PORT , () =>{
        console.log("server is running on port " + PORT);
    });
});