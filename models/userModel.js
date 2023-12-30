import mongoose from "mongoose";

const schema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required to register'],
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required to register'],
        unique: true
    },
    password:{
        type: String, 
    },
    emailAddress: {
        type: String,
        unique: true
    },
    personalContacts:[{
        type: String
    }]
})


export default mongoose.model('User', schema)