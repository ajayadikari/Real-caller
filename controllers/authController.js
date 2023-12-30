//Import dependencies
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Importing Models
import User from '../models/userModel.js'
import GlobalDb from '../models/globalDbModel.js'



// Controller for register users
// User can register by providing name, unique phone number and password atleast, email is optional
const register = async (req, res) => {
    try {

        // Destructuring the name, phone number, password, email address from request body
        const { name, phoneNumber, password, emailAddress } = req.body;
        console.log(name, phoneNumber, password, emailAddress)

        // Performing verifications, if failed returing error response
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            })
        }

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            })
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            })
        }

        // Checking if user already exists in db using phone number
        const user = await User.findOne({ phoneNumber: phoneNumber });

        // If already a user, returning error response
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        // Hashing the password of new user, and storing it in the db
        const hashedPassword = await bcrypt.hash(password, 10)

        // Storing the new user with hashed password in the db
        const newUser = await new User({
            name,
            phoneNumber,
            password: hashedPassword,
            emailAddress: emailAddress ? emailAddress : ""
        }).save();

        //Checking user if already present in Global db
        //Users might also got into db from the other users personal contacts
        const isUserInGdb = await GlobalDb.findOne({ phoneNumber: phoneNumber });

        if (isUserInGdb) {
            await GlobalDb.findOneAndUpdate({ phoneNumber: phoneNumber }, {registrationId: newUser._id})
        }
        else {
            await new GlobalDb({
                name,
                phoneNumber,
                emailAddress: emailAddress ? emailAddress : "",
                registrationId: newUser._id
            }).save();
        }


        // Returing success response with new user details, password as null
        newUser.password = null,

            res.status(200).json({
                success: true,
                message: 'User creation successful',
                newUser
            })

    } catch (error) {
        console.log('error occured in authController at register method')
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        })
    }
}



// Login controller

const login = async (req, res) => {
    try {


        // Destructuring number and password from request body
        // User should provide the number and password for logging in
        const { phoneNumber, password } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            })
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            })
        }

        // Checking if user exists with phone number or not
        const user = await User.findOne({ phoneNumber: phoneNumber });

        // If user doesnt exists, returing a response
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesnt exists with provided phone number"
            })
        }

        // Checking if password matches with actual password or not
        console.log(password, user.password)
        const PasswordMatched = await bcrypt.compare(password, user.password)
        if (!PasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Wrong password"
            })
        }

        // Creating and send jwt token to client, to keep the user logged in
        // Sending neccesary info as payload, helpful in creating token and for futher use
        const payload = {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber
        }

        // Creating the jwt token, expires in 7days from the time of creation
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })

        //Assigning null value for safey purpose
        user.password = null

        // Returing Token to client
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user,
            token
        })

    } catch (error) {
        console.log('error in auth controller: login')
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        })
    }
}

//Controller for incrementing spam reporting on a user
const incrementSpamCount = (req, res) => {
    try {
        // Destructuring the user's phone number
        const { phoneNumber } = req.params

        // if()
    } catch (error) {

    }
}


// Named exporting the controller methods
export { register, login, incrementSpamCount }