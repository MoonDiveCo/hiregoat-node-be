import express from 'express';
import controller from './controller';
import auth from "../../../../helper/auth";

const router = express.Router();

router.post("/register", controller.registerUser)
router.post("/login", controller.loginUser)
router.post("/reset-password", controller.resetPassword)
router.put("/forgot-password", controller.forgotPassword)

router.use(auth.verifyToken);
router.get("/get-profile", controller.getProfile);
router.patch("/edit-profile", controller.editProfile);

export default router;

