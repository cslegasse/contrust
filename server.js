import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import 'express-async-errors'; 
import aiRoute from './routes/aiRoute.js';
import campaignRoute from './routes/campaignRoute.js';
import donationRoute from './routes/donationRoute.js';
import spendingRoute from './routes/spendingRoute.js';
import supplierRoute from './routes/supplierRoute.js';
import contractRoute from './routes/contractRoute.js';

dotenv.config();
const app = express();

app.use(cors()); 
app.use(express.json()); 


app.use('/api/v1/ai', aiRoute);
app.use('/api/v1/campaign', campaignRoute);
app.use('/api/v1/donation', donationRoute);
app.use('/api/v1/spending', spendingRoute);
app.use('/api/v1/supplier', supplierRoute);
app.use('/api/v1/contract', contractRoute);


const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();