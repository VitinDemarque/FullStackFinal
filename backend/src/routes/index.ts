import { Router } from 'express';

import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import authGoogle from './authGoogle';
import exercisesRoutes from './exercises.routes';
import forumRoutes from './forum.routes';
import submissionsRoutes from './submissions.routes';
import leaderboardsRoutes from './leaderboards.routes';
import groupsRoutes from './groups.routes';
import languagesRoutes from './languages.routes';
import seasonsRoutes from './seasons.routes';
import collegesRoutes from './colleges.routes';
import statsRoutes from './stats.routes';
import forumTopicRoutes from './forumTopic.routes';
import forumCommentRoutes from './forumComment.routes';
import badgesRoutes from './badges.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/auth', authGoogle);
router.use('/exercises', exercisesRoutes);
router.use('/forum', forumRoutes);
router.use('/submissions', submissionsRoutes);
router.use('/leaderboards', leaderboardsRoutes);
router.use('/groups', groupsRoutes);
router.use('/languages', languagesRoutes);
router.use('/seasons', seasonsRoutes);
router.use('/colleges', collegesRoutes);
router.use('/stats', statsRoutes);
router.use('/forum-topics', forumTopicRoutes);
router.use('/forum-comments', forumCommentRoutes);
router.use('/badges', badgesRoutes);

export default router;