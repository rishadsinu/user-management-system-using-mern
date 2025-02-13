
import express from 'express'
import { adminlogin, deleteUser, getUserDetails } from '../controllers/adminController.js'

const router = express.Router()


router.post("/adminlogin", adminlogin);
router.get("/users", getUserDetails)
router.delete("/users/:id", deleteUser)


export default router