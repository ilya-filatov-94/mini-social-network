const Router = require('express');
const router = new Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/AuthMiddleware');


router.get('/create', authMiddleware, postController.createPost);
router.get('/all', authMiddleware, postController.getAllPosts);
router.get('/latest', authMiddleware, postController.getLatestPosts); 


module.exports = router;