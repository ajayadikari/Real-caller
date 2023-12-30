//Importing dependencies here
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import colors from 'colors'
import cors from 'cors'

// Importing methods here
import connectDb from './config/db.js';
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import createFakeData from './fakeData.js';


// Server initialization
const app = express();

// Configuring the dotenv file with enviroment variables
dotenv.config();

// ------------------Essential middlewares for app/server---------------

// Request body parser
app.use(express.json())
// Morgan is a third party middleware for logging in the server calls
app.use(morgan())
// For cross origin access
app.use(cors())


// Routing
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)


//fake data
//Calling this will register 50 random user and each user will add another 10 personal contacts
// createFakeData()



// Calling the mongodb connector
// Method exported from config/db.js file
connectDb();


//home page
// app.use('*', (req, res)=>{
//     res.send('<h1>home page</h1>')
// })


// Server is listening
// Initializing the port variable with the env PORT variable
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`server is listening at port number: ${port}`.bgGreen.black)
})