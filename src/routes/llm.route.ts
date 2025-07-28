import express from "express";
import { runAgentPrompt } from "../llm";
import { Request,Response } from "express";

const router=express.Router();

router.post('/',async function handleQuery(req:Request,res:Response){
    try
    {
       const {query}=req.body;
        const result=await runAgentPrompt(query);
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