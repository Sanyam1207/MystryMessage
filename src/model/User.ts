import mongoose, { Schema, Document } from 'mongoose'

export interface Message extends Document {
    _id: string;
    content: string;
    createdAt: Date;
}

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];

}

const MessageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now }
})

const UserSchema: Schema<User> = new Schema({
    username : {
        type: String,
        required: [true, 'Please Provide Username'],
        unique: true,
        trim : true
    },

    email : {
        type : String,
        required : [true, 'Please Provide Email'],
        unique : true,
        match : [/.+\@.+\..+/, 'Please use a valid Email Address']
    },

    password : {
        type : String,
        required : [true, 'Please Provide Password'],
    },

    verifyCode : {
        type : String,
        required : [true, 'Verify Code is required']
    },

    verifyCodeExpiry : {
        type : Date,
        required : [true, 'Verify Code Expiry is required']
    },

    isVerified : {
        type : Boolean,
        default : false
    },

    isAcceptingMessage : {
        type : Boolean,
        default : true
    },
    
    messages : [MessageSchema]
})

const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)
export default userModel;
