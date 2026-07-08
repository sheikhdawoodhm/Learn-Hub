import {Router} from "express";
import { signup } from "../controllers/authController";
import { login, oauthLogin, logout } from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";
import { validatePayload} from "../middleware/payloadValidation";
import {refreshSession} from "../controllers/refreshController";
import { signupRules, loginRules, oauthRules } from "../validationRules/authValidationRule";


const router = Router();

router.post("/signup", validatePayload(signupRules), signup);
router.post("/login", validatePayload(loginRules), login);
router.post("/oauth", validatePayload(oauthRules), oauthLogin);
router.post("/refresh",refreshSession);
router.post("/logout", authenticateToken, logout);

export default router;
