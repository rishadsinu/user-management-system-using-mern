
import express from 'express'
import {
    addUser,
    adminlogin,
    deleteUser,
    getUserDetails,
    searchUsers,
    updataUserName
} from '../controllers/adminController.js'

const router = express.Router()


router.post("/adminlogin", adminlogin);
router.get("/users", getUserDetails)
router.delete("/users/:id", deleteUser)
router.put('/users/:id', updataUserName)
router.post('/add-user', addUser)
router.get('/search-users', searchUsers)



export default router