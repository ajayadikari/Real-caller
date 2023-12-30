//Importing dependies
import mongoose, { mongo } from "mongoose";

const schema = mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        unique: true
    },
    email: {
        type: String
    },
    registrationId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    isSpam: {
        type: Boolean,
        default: false
    },
    spamCount: {
        type: Number,
        default: 0,
    },

})


export default mongoose.model('GlobalDb', schema);