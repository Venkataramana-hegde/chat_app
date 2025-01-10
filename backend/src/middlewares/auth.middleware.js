import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async ( req, resizeBy, next) => {
    try {
        const token = req.cookies.jwt

        if(!token){
            return resizeBy.status(401).json({ message: "Unauthorised = No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return resizeBy.send(401).json({ message: "Unauthorised - invalid Token"} );
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return resizeBy.status(400).json({ message: "User not found"} );
        }

        req.user = user

        next()

    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        resizeBy.status(500).json({ message: "Internal server error"} );
    }
}