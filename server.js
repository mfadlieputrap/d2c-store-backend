import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routes from "./routes/index.js";
import logger from "./utils/logger.js";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8080

app.use(cors());
app.use(express.json());
app.use(morgan('combine', {stream: logger.stream}));
app.use('/api', routes);

app.listen(PORT, ()=>{
	console.log(`Server is running on port: ${PORT}`);
})
