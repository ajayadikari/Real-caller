//Importing dependencies here
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Configuring the dotenv file with enviroment variables
dotenv.config();

// Getting and storing the db url from the env file
const url = process.env.DB_URL;


// This function will connect the server to db when called
const connectDb = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`db connection is successful`.bgGreen.black);
    } catch (error) {
        console.log('error occured while connecting to db'.bgRed.white);
        console.log(error);
    }
}

// Default exporting connectDb function for importing in other modules
export default connectDb;