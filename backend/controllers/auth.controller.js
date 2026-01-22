import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookies from "../utils/generateTokens.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body

        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ error: "Passwords don't match" });
        }

        const alreadyUser = await User.find({
            username: req.body.username
        })

        if (alreadyUser.length !== 0) {
            return res.status(400).json({ error: "Username already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://robohash.org/${username}`

        const girlProfilePic = `https://robohash.org/${username}`

        const user = new User({
            fullname,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })

        generateTokenAndSetCookies(user._id, res);
        await user.save();

        const safeUser = {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            profilePic: user.profilePic
        };

        return res
            .status(200)
            .json({
                safeUser
            })

    } catch (error) {
        console.log("Error in signup controller", error);
        throw error;
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" })
        }

        generateTokenAndSetCookies(user._id, res);

        const safeUser = {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            profilePic: user.profilePic
        };

        return res.status(200).json({ user: safeUser });

    } catch (error) {
        console.log("Error in login controller", error);
        throw error;
    }
}

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        return res.status(200).json({
            message: "Logout successfully",
        })
    } catch (error) {
        console.log("Error in logout controller", error);
        throw error;
    }
}

const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};


const updateUserProfilePic = async (req, res) => {
    try {
        const id = req.user._id;

        const newProfilePic = req.file?.path
        const profilePic = await uploadOnCloudinary(newProfilePic);

        if (!profilePic) {
            return res.status(400).json("Please upload a right picture");
        };

        const user = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    profilePic: profilePic.url
                }
            },
            { new: true }
        )

        return res.status(200).json(user)
    } catch (error) {
        console.log("Error in edit controller", error);
        throw error;
    }
}

const updateUserName = async (req, res) => {
    try {
        const id = req.user._id;
        const { fullname } = req.body

        if (!fullname) {
            return res.status(400).json("Please enter correct name");
        };

        const user = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    fullname
                }
            },
            { new: true }
        )

        return res.status(200).json(user)
    } catch (error) {
        console.log("Error in edit controller", error);
        throw error;
    }
}

export {
    signup,
    login,
    logout,
    getMe,
    updateUserProfilePic,
    updateUserName
}