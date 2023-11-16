const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');
const storyRouter = require('./storyRouter');


router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/comment', commentRouter);
router.use('/story', storyRouter);


module.exports = router;