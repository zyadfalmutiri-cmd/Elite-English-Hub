import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import levelsRouter from "./levels";
import topicsRouter from "./topics";
import lessonsRouter from "./lessons";
import progressRouter from "./progress";
import statsRouter from "./stats";
import quizRouter from "./quiz";
import placementRouter from "./placement";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(levelsRouter);
router.use(topicsRouter);
router.use(lessonsRouter);
router.use(progressRouter);
router.use(statsRouter);
router.use(quizRouter);
router.use(placementRouter);

export default router;
