//Importing middleware
import { isUserLoggedIn } from "../middlewares/authMiddlewares.js";

//Importing models
import User from "../models/userModel.js";
import GlobalDb from "../models/globalDbModel.js";
import SpamReport from "../models/spamReportModel.js";

//Importing modules
import mongoose from "mongoose";

// Controller to find user by name

const userByName = async (req, res) => {
    try {
        // Destructuring the user name from the params
        const { name } = req.params;

        //Query to match with start of the user name
        const exactNameQuery = new RegExp(`^${name}`, 'i');
        //Query to find users whose name includes the search query
        const partialNameQuery = new RegExp(name, 'i');

        const users = await GlobalDb.find({
            $or: [
                { name: { $regex: exactNameQuery } },
                { name: { $regex: partialNameQuery } }
            ]
        }).sort({ name: 1 }).select('name email phoneNumber spamCount isSpam').populate('registrationId')

        //Sending the users array in response

        return res.status(200).json({
            success: true,
            message: "Fetched Searched users",
            users
        })

    } catch (error) {
        console.log('error in userController: userByName')
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error in fetching searched user(s)",
            error
        })
    }
}

// Controller to find the exact user with the number
const userByNumber = async (req, res) => {
    try {

        //Destructuring the number the url params
        const { phoneNumber } = req.params;

        const exactUser = await GlobalDb.findOne({ phoneNumber: phoneNumber })

        // If the exact user is found, returning the user
        if (exactUser) {
            return res.status(200).json({
                success: true,
                message: "User  found",
                exactUser
            })
        }

        //Find search related users and populate registration details, if registered
        const relatedUsers = await GlobalDb.find({ phoneNumber: phoneNumber }).populate('registrationId');
        return res.status(200).json({
            success: true,
            message: "Users found with partially matches with number",
            relatedUsers
        })

    } catch (error) {
        console.log('error in userController: userByNumber')
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        })
    }
}


// Controller to find the user by the number
const userById = async (req, res) => {
    try {
        //Destructuring user id from request body
        const { searchUserId, userId } = req.params;

        // Finding the user in the db using _id
        const searchUser = await User.findById(searchUserId);
        const userNumber = await User.findById(userId).select('phoneNumber');

        //Checking whether the user searching person is registered
        //Checking whether the user and the searching person are in each other contact list or not
        //If is both conditions satisfied, then show the searching person email, else don't show

        if (searchUser && searchUser.personalContacts.includes(userNumber)) {
            return res.status(200).json({
                success: true,
                message: "user found",
                searchUser
            })
        }


        if (searchUser.emailAddress.length != 0) searchUser.emailAddress = null;

        return res.status(200).json({
            success: true,
            message: "user found",
            searchUser
        })
    } catch (error) {
        console.log("error in userController: userById")
        console.log(error)
        res.status(200).json({
            success: true,
            message: "Internal server error",
            error
        })
    }
}


// To add the personal contacts of the user

const addPersonalContacts = async (req, res) => {
    try {
        // Destructuring
        const { contactList } = req.body
        const { userId } = req.params

        //Collecting the phone numbers of personal contacts
        const numbers = [];


        //Adding personal contacts to Global db
        //Every contact should have name and unique phone number
        await Promise.all(contactList.map(async (contact) => {
            const { phoneNumber, name, emailAddress } = contact

            //Checking if user already registered or not
            const userExists = await User.findOne({ phoneNumber: phoneNumber })

            //Adding if not registered previously
            if (!userExists && name && phoneNumber) {
                numbers.push(phoneNumber)
                await GlobalDb.create({
                    name: name,
                    phoneNumber: phoneNumber,
                    emailAddress: emailAddress ? emailAddress : "",
                });
            }
        }))

        //Adding all the phone numbers of user person contact's into this account
        await User.findByIdAndUpdate(userId, { $push: { personalContacts: { $each: numbers } } }, { new: true });

        res.status(200).json({
            success: true,
            message: "Contacts added successfully",
        })
    } catch (error) {
        console.log("error in userController: addPersonalContacts")
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error in userController: addPersonalContacts"
        })
    }
}


//Controller for spam reporting
//Each user can report spam other users only once
const spamReportUser = async (req, res) => {
    try {
        //Destructuring variables from request body and params
        const { id, reporterId } = req.params;
        const user = await GlobalDb.findById(id);

        //Getting list of phone number that the user spammed before
        const reportedList = await SpamReport.findOne({ reporterId: reporterId })

        //Boolean to check already spammed
        let alreadyReadyReported = false;

        if (reportedList) {

            // Checking if this number is already spammed by the current user
            reportedList.spamList.map(contact => {
                if (contact == id) {
                    alreadyReadyReported = true;
                    return
                }
            })

            // If the user is trying to spam same number, send error response
            if (alreadyReadyReported) {
                return res.status(400).json({
                    success: false,
                    message: "You Already reported this number"
                })
            }
            else {
                //Create an account in spam db for the spam reporter
                //If not reported, report as spam and add the spam number to the user's spam list
                //To keep a track
                const updatedSpamCount = user.spamCount + 1;
                const updatedUser = await GlobalDb.findByIdAndUpdate(id, { spamCount: updatedSpamCount, isSpam: true }, { new: true })
                await SpamReport.findByIdAndUpdate(reportedList._id, { $push: { spamList: id } })

                res.status(200).json({
                    success: true,
                    message: "User reported as spam successfully",
                    updatedUser
                })
            }
        }
        else {

            //Update the spam count in the spam number
            //Mark as spam
            const updatedSpamCount = user.spamCount + 1;
            const updatedUser = await GlobalDb.findByIdAndUpdate(id, { spamCount: updatedSpamCount, isSpam: true }, { new: true })
            await new SpamReport({
                reporterId: reporterId,
                spamList: [id]
            }).save()
            console.log(updatedUser)
        }

        res.status(200).json({
            success: true,
            message: "User reported as spam successfully",
        })


    } catch (error) {
        console.log('error in userController: spamReportUser')
        console.log(error)
        res.status(500).json({
            success: true,
            message: "Internal server error",
            error
        })
    }
}

//Get list of number reported as spam by user
//Need user global id
const contactsListReportedByUser = async (req, res) => {
    try {
        const { reporterId } = req.body;

        //Fetching list
        const list = await SpamReport.findOne({ reporterId: reporterId })
        res.status(200).json({
            success: true,
            message: "Fetched the list of contacts reported as spam by the user",
            list
        })
    } catch (error) {
        console.log('error in userController: contactsListReportedByUser')
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        })
    }
}



export { userByName, userByNumber, userById, addPersonalContacts, spamReportUser, contactsListReportedByUser }