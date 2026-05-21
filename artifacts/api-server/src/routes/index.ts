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
import aiChatRouter from "./ai-chat";
import subscriptionRouter from "./subscription";
import voiceChatRouter from "./voice-chat";
import pronunciationRouter from "./pronunciation-check";
import savedWordsRouter from "./saved-words";
import pushRouter from "./push";

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
router.use(aiChatRouter);
router.use(subscriptionRouter);
router.use(voiceChatRouter);
router.use(pronunciationRouter);
router.use(savedWordsRouter);
router.use(pushRouter);

export default router;
