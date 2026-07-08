import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { createCourseSchema, getCoursesQuerySchema, saveModulesSchema, updateCourseSchema } from "../validationRules/courseValidationRule";
import { initCourseShell, compileCourseModules, getCoursesOverview, updateCourseDetails, deleteCourse, handleGetDrafts, handleGetCourseById} from "../controllers/courseControllers";
import { validatePayload } from "../middleware/payloadValidation";
const router = Router();


router.post("/", authenticateToken, authorizeRoles("admin", "instructor"), validatePayload(createCourseSchema), initCourseShell);
router.get("/drafts", authenticateToken, authorizeRoles("admin", "instructor"), handleGetDrafts);
router.post("/:courseId/modules", authenticateToken, authorizeRoles("admin", "instructor"), validatePayload(saveModulesSchema), compileCourseModules);
router.put("/:courseId", authenticateToken, authorizeRoles("admin", "instructor"), validatePayload(updateCourseSchema), updateCourseDetails);
router.delete("/:courseId", authenticateToken, authorizeRoles("admin", "instructor"), deleteCourse);
router.get("/:courseId", authenticateToken, handleGetCourseById);
router.get("/", authenticateToken, validatePayload(getCoursesQuerySchema), getCoursesOverview);

export default router;
