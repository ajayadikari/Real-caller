//Importing dependencies
import mongoose from "mongoose";


const schema = mongoose.Schema({
    reporterId:{
        type: mongoose.Types.ObjectId, 
        ref: 'GlobalDb'
    }, 
    spamList: [{
        type: String,
    }]
})

export default mongoose.model('SpamData', schema)