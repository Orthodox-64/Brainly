"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = exports.Tag = exports.Content = exports.User = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
mongoose_2.default.connect("mongodb+srv://sachinprogramming62:H3lEBoO8FArmabQs@cluster0.rpgov.mongodb.net/Brainly");
const userSchema = new mongoose_1.Schema({
    // email:{type:String,unique:true},
    // userId:{type:ObjectId},
    username: { type: String, require: true, unique: true },
    password: { type: String },
});
exports.User = (0, mongoose_1.model)('User', userSchema);
// const contentTypes=['image','video','article','audio'];
const contentSchema = new mongoose_1.Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose_2.default.Types.ObjectId, ref: 'Tag' }],
    type: String,
    userId: { type: mongoose_2.default.Types.ObjectId, ref: 'User', required: true },
});
exports.Content = (0, mongoose_1.model)('Content', contentSchema);
const tagSchema = new mongoose_1.Schema({
    id: { type: mongoose_2.default.Types.ObjectId },
    title: { type: String, required: true, unique: true }
});
exports.Tag = (0, mongoose_1.model)('Tag', tagSchema);
const linkSchema = new mongoose_1.Schema({
    hash: String,
    userId: { type: mongoose_2.default.Types.ObjectId, ref: 'User', required: true, unique: true },
});
exports.Link = (0, mongoose_1.model)('Link', linkSchema);
// module.exports={
//     User,
//     Content,
//     Link,
// }
