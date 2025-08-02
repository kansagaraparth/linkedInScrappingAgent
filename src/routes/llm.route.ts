import express from "express";
import { runAgentPrompt } from "../llm";
import { Request,Response } from "express";

const router=express.Router();

router.post('/',async function handleQuery(req:Request,res:Response){
    try
    {
       const {query}=req.body;
       let query2="You have access to 3 tools based on the user query use them and if user asks any question serach the vector store for relevant inforamtion and give response based on that. Here is the user query: "+query;
        const result=await runAgentPrompt(query2);
        res.status(200).json({success:true,message:"Got the results successfully",result:result});
        return; 
    }
    catch(error)
    {
        res.status(500).json({success:false,message:"Encountered an error in queryHandler function",error});
        return;
    }

})

export default router;