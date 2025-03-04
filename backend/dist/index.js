"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import mongoose from "mongoose"
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = require("./db");
const db_2 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const middleware_1 = require("./middleware");
// import mongoose from "mongoose";
const app = (0, express_1.default)();
app.use(express_1.default.json());
const JWT_USER_PASS = "12345";
app.post("/api/v1/signup", async (req, res) => {
    const requireBody = zod_1.z.object({
        username: zod_1.z.string().min(4).max(8),
        password: zod_1.z.string().min(8),
    });
    const parseData = requireBody.safeParse(req.body);
    if (!parseData.success) {
        res.status(400).json({
            msg: "Invalid Credentials"
        });
    }
    const username = req.body.username;
    const password = req.body.password;
    const hashedPass = await bcrypt_1.default.hash(password, 5);
    try {
        await db_1.User.create({
            username: username,
            password: hashedPass
        });
        res.status(200).json({
            msg: "Signup Successfull"
        });
    }
    catch (e) {
        res.status(411).json({ msg: "Invalid Credentials" });
    }
});
app.post("/api/v1/signin", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: "Username and password are required" });
            return;
        }
        const user = await db_1.User.findOne({ username }).select("+password");
        if (!user) {
            res.status(400).json({ error: "User not found" });
        }
        if (!user?.password) {
            res.status(500).json({ error: "Password field is missing in the database" });
            return;
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(403).json({ msg: "Invalid Credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_USER_PASS, { expiresIn: "24h" });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await db_2.Content.create({
        link,
        type,
        title: req.body.title,
        // @ts-ignore
        userId: req.userId,
        tags: []
    });
    res.json({
        message: "Content added"
    });
});
app.get("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    //  @ts-ignore
    const userId = req.userId;
    const content = await db_2.Content.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content: content
    });
});
app.delete("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    await db_2.Content.deleteMany({
        contentId: contentId,
        //  @ts-ignore
        userId: req.userId
    });
    res.json({
        msg: "Deleted"
    });
});
// app.post("/api/v1/brain/share",(req,res)=>{
// })
// app.get("/api/v1/brain/:shareLink",(req,res)=>{
// })
app.listen(3000, () => {
    console.log("Server is Runinng");
});
