import jwt from 'jsonwebtoken'


const isUserLoggedIn = async (req, res, next) => {
    try {

        // Extracting the token from the request headers
        const bearerToken = req.headers["authorization"];
        const token = bearerToken

        if(bearerToken.charAt(0) == 'B') token = bearerToken.split(" ")[1]

        // Only logged in user will have token
        if (!token) {
            return res.status(500).json({
                success: false,
                message: "Login to access"
            })
        }

        // Verifying the token
        const user = await jwt.verify(token, process.env.JWT_SECRET);

        // If user details are not equipped
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "Error while verifying the token"
            })
        }

        // Attaching the equipped user details to request body
        req.user = user;

        // Allowing next middleware
        next();

    } catch (error) {
        console.log("error in authmiddleware: isUserLoggedIn")
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        })
    }
}


export { isUserLoggedIn }