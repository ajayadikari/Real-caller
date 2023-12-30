Please kindly go through the instructions and detailed APIs documentation to use them properly. Please scroll to read.

Instruction to run the assignment (Windows OS)
Please download the .zip file from the mail and extract the files
Open VScode in your computer
Press WINDOWS + SHIFT + ` to open terminal or open using GUI
Move to the root folder of the file
Run command "npm run dev" to run assignment (runs at port:- 8000, localhost)
APIs documentation below, I request you to go through them before using APIs
APIs Detailed Documentation

Collections used:-
GlobalDb - Consists registered and non - registered users data with spam report (Used for searching, etc)
User - Consists only registered users data
SpamReport - Data about the Spam reporters and list of numbers, each reporter(registered user) reported
Note:- DB already had 50 registers and 500+ non-registered users dummy data


APIs Info (All APIs are functioning properly)
Note:- To consume APIs user must register and login in, please register with register API with name, phoneNumber, password, email(optional)
Auth APIs
Register API - http://localhost:8000/api/v1/auth/register
Send name, phoneNumber, password, email (optional), in an object, keys should named as mentioned
Login Apis
Login API - http://localhost:8000/api/v1/auth/login
Send registered phoneNumber and password

User APIs
Search user Api by name -  http://localhost:8000/api/v1/user/search-by-name/:name - search user by the name, returns exact match or related user if exact match not found
Search user Api by phone number -  http://localhost:8000/api/v1/user/search-by-phone-number/:phoneNumber
 - search user by the phone number, returns exact match or related user if exact match not found
Search user Api by User id (When clicked on search result, client should pass search person's id) -  http://localhost:8000/api/v1/user/personalContacts/:userId
 - search user by the userId, returns exact match 
Send the user personal contact fetched from his phone -  http://localhost:8000/api/v1/user/personalContacts/:userId - Send an array of personal contacts object which have phoneNumber, (name and email id are optionals), This will store the personal contacts in users account and in globalDb as non registered user as well.
Report a user spam -  http://localhost:8000/api/v1/user/report-spam/:reporterId/:id - Report a user as spam by send reporterId(user who wants to report spam) and id(spammer id) in params, it will update the spam count and marks as spam
Access the list of contacts marked as spam by a user using his id -  http://localhost:8000/api/v1/user/reported-spam-list/:reporterId - Replace reporterId with any registered user id, to the list of spam number reported by that user
