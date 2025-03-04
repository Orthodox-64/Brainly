import express from "express";
// import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import {z} from "zod";
import { User } from "./db";
import { Request,Response } from "express";
import {Content} from "./db";
import bcrypt from "bcrypt"
import { userMiddleware } from "./middleware";
// import mongoose from "mongoose";

const app=express();
app.use(express.json());
const JWT_USER_PASS="12345"

app.post("/api/v1/signup",async(req,res)=>{
     const requireBody=z.object({
       username:z.string().min(4).max(8),
       password:z.string().min(8),
     })
     const parseData=requireBody.safeParse(req.body);
     if(!parseData.success){
      res.status(400).json({
        msg:"Invalid Credentials"
      })
     }
     const username=req.body.username;
     const password=req.body.password;
     const hashedPass=await bcrypt.hash(password,5);
     try{
     await User.create({
       username:username,
       password:hashedPass
     })
     res.status(200).json({
      msg:"Signup Successfull"
    })
    }
     catch(e){
      res.status(411).json({msg:"Invalid Credentials"});
     }
})

app.post("/api/v1/signin", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
       res.status(400).json({ error: "Username and password are required" });
       return;
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
       res.status(400).json({ error: "User not found" });
    }

    if (!user?.password) {
       res.status(500).json({ error: "Password field is missing in the database" });
       return
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
       res.status(403).json({ msg: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_USER_PASS, { expiresIn: "24h" });

     res.status(200).json({ token }); 
  } catch (error) {
    console.error("Signin error:", error);
     res.status(500).json({ error: "Internal Server Error" }); 
  }
});

app.post("/api/v1/content",userMiddleware,async(req,res)=>{
  const link = req.body.link;
  const type = req.body.type;
  await Content.create({
      link,
      type,
      title: req.body.title,
      // @ts-ignore
      userId: req.userId,
      tags: []
  })

  res.json({
      message: "Content added"
  })
})

app.get("/api/v1/content",userMiddleware,async(req,res)=>{
  //  @ts-ignore
   const userId=req.userId;
   const content=await Content.find({
     userId:userId
   }).populate("userId","username");
   res.json({
    content:content
   })
})

app.delete("/api/v1/content",userMiddleware,async(req,res)=>{
    const contentId=req.body.contentId;
    await Content.deleteMany({
       contentId,
      //  @ts-ignore
       userId:req.userId
    })
    res.json({
      msg:"Deleted"
    })
})

// app.post("/api/v1/brain/share",(req,res)=>{

// })

// app.get("/api/v1/brain/:shareLink",(req,res)=>{

// })


app.listen(3000,()=>{
  console.log("Server is Runinng");
});