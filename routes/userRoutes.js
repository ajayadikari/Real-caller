import express from 'express'

//Importing auth middlewares
import { isUserLoggedIn } from '../middlewares/authMiddlewares.js';

//Importing controllers
import { userByName, userByNumber, userById, addPersonalContacts, spamReportUser, contactsListReportedByUser } from '../controllers/userControllers.js';

// Instance of express router method
const router = express.Router();

// Routes

router.route('/search-by-name/:name')
    .get(isUserLoggedIn, userByName)
router.route('/search-by-phone-number/:phoneNumber')
    .get(isUserLoggedIn, userByNumber)
router.route('/search-by-id/:userId/:searchUserId')
    .get(isUserLoggedIn, userById)
router.route('/personalContacts/:userId')
    .post(isUserLoggedIn, addPersonalContacts)
router.route('/report-spam/:reporterId/:id')
    .get(spamReportUser)
router.route('/reported-spam-list/:reporterId')
    .get(contactsListReportedByUser);


export default router