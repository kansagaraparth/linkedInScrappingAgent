import express from "express";
import  queryHandler from "./routes/llm.route";
import { ENV_VARS } from "./config/envVars";

const app=express();
app.use(express.json());
const PORT=ENV_VARS.PORT||5000;

app.use('/linkedinScrapper',queryHandler);
app.listen(PORT,()=>{
    console.log("server started running on http://localhost:"+PORT);
})