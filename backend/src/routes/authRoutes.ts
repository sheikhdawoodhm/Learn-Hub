import {Router} from "express";
import { signup } from "../controllers/authController";
import { login } from "../controllers/authController";
import { validatePayload} from "../middleware/payloadValidation";
import {refreshSession} from "../controllers/refreshController";
import { signupRules, loginRules } from "../validationRules/authValidationRule";


const router = Router();

router.post("/signup", validatePayload(signupRules), signup);
router.post("/login", validatePayload(loginRules), login);
router.post("/refresh",refreshSession);

export default router;