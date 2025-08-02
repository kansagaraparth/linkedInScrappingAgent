import express from "express";
import  queryHandler from "./routes/llm.route";
import { ENV_VARS } from "./config/envVars";

const app=express();

// Add CORS middleware to allow frontend requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
const PORT=ENV_VARS.PORT||5050;

app.use('/linkedinScrapper',queryHandler);
app.listen(PORT,()=>{
    console.log("server started running on http://localhost:"+PORT);
})