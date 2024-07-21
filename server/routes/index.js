const Router = require('express');
const router = new Router();

const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../swagger/openapi.json');

const userRouter = require('./userRouter');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');
const storyRouter = require('./storyRouter');
const messengerRouter = require('./messengerRouter');

router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/comment', commentRouter);
router.use('/story', storyRouter);
router.use('/messenger', messengerRouter);

router.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

module.exports = router;