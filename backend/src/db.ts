import { model,Schema} from "mongoose";
import mongoose from "mongoose";
mongoose.connect("mongodb+srv://sachinprogramming62:H3lEBoO8FArmabQs@cluster0.rpgov.mongodb.net/Brainly")

const userSchema = new Schema({
    // email:{type:String,unique:true},
    // userId:{type:ObjectId},
    username:{type:String,require:true,unique:true},
    password:{type:String},
})

export const User= model('User',userSchema);

// const contentTypes=['image','video','article','audio'];

const contentSchema=new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

export const Content=model('Content',contentSchema);

const tagSchema=new Schema({
    id:{type:mongoose.Types.ObjectId},
    title:{type:String,required:true,unique:true}
});

export const Tag=model('Tag',tagSchema);

const linkSchema=new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})

export const Link=model('Link',linkSchema);

// module.exports={
//     User,
//     Content,
//     Link,
// }