import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { createCourseSchema, getCoursesQuerySchema, saveModulesSchema } from "../validationRules/courseValidationRule";
import { initCourseShell, compileCourseModules, getCoursesOverview} from "../controllers/courseControllers";
import { validatePayload } from "../middleware/payloadValidation";
const router = Router();


router.post("/",authenticateToken, validatePayload(createCourseSchema), initCourseShell);
router.post("/:courseId/modules",authenticateToken, validatePayload(saveModulesSchema), compileCourseModules);
router.get("/",authenticateToken, validatePayload(getCoursesQuerySchema), getCoursesOverview);

export default router;
