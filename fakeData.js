import Chance from "chance";
import User from "./models/userModel.js";
import GlobalDb from "./models/globalDbModel.js";
import bcrypt from 'bcrypt'
const chance = Chance()

let phoneNumber = 9123456;



// Fake data generating script
const createFakeData = async () => {
    for (let i = 1; i <= 50; i++) {
        const name = chance.name();
        const emailAddress = chance.email();
        const password = '123456'
        const personalContacts = []
        for (let j = 1; j <= 10; j++) {
            ++phoneNumber;
            const obj = {}
            obj.name = chance.name()
            obj.phoneNumber = phoneNumber;
            personalContacts.push(obj);
        }
        const user = await User.findOne({ phoneNumber: phoneNumber });

        // If already a user, returning error response
        if (user) {
            return
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
            await GlobalDb.findOneAndUpdate({ phoneNumber: phoneNumber }, { registrationId: newUser._id })
        }
        else {
            await new GlobalDb({
                name,
                phoneNumber,
                emailAddress: emailAddress ? emailAddress : "",
                registrationId: newUser._id
            }).save();
        }



        const numbers = [];


        //Adding personal contacts to Global db
        //Every contact should have name and unique phone number
        await Promise.all(personalContacts.map(async (contact) => {
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
        await User.findByIdAndUpdate(newUser._id, { $push: { personalContacts: { $each: numbers } } }, { new: true });



        phoneNumber++;
    }
}

export default createFakeData