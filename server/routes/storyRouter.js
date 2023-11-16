const Router = require('express');
const router = new Router();
const storyController = require('../controllers/storyController');
const authMiddleware = require('../middleware/AuthMiddleware');


router.post('/create', authMiddleware, storyController.createStory);
router.get('/one', authMiddleware, storyController.getUserStory);
router.get('/all', authMiddleware, storyController.getAllStories);


module.exports = router;