import bcrypt from 'bcryptjs'
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken'

export const adminlogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.isAdmin) {
            return res.status(403).json({ message: "Access denied: Not an admin" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const accessToken = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(200).json({
            message: "Login successful",
            token: accessToken,
            user: { id: user._id, email: user.email, isAdmin: user.isAdmin },
        });

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUserDetails = async (req, res) => {

    try {
        const users = await User.find({}, 'name email profileImage')
        console.log(users);

        res.status(200).json({ users })
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const deleteUser = await User.findByIdAndDelete(id)
        if (!deleteUser) {
            return res.status(404).json({ success: false, message: "user not found" })
        }

        res.status(200).json({ success: true, message: 'user deleted' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'server error' })
    }
}

export const updataUserName = async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    try {
        const updateUser = await User.findByIdAndUpdate(id, { name }, { new: true })
        if (!updateUser) {
            res.status(404).json({ success: false, message: 'user not found' })
        }
        res.status(200).json({ success: true, message: 'user name updated' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'server error' })
    }
}

export const addUser = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'user is alredy exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()
        res.status(201).json({ success: true, message: 'user added', user: newUser })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'server error' })
    }
}

export const searchUsers = async (req, res) => {
    const { search } = req.query
    const query = {}
    if (search) {
        const regex = new RegExp(search, 'i');
        query.$or = [
            { name: { $regex: regex } },
            { email: { $regex: regex } },
        ]
    }
    try {
        const users = await User.find(query)
        res.status(200).json({success:true, users})
    } catch (error) {
        res.status(500).json({success:false, message:'server false'})
    }
}
