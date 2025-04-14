import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routes from "./routes/index.js";
import logger from "./utils/logger.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080

app.use(cors());
app.use(express.json());
app.use(morgan('combine', {stream: logger.stream}));
app.use('/api', routes);


export default app;