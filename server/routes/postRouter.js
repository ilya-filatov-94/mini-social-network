const Router = require('express');
const router = new Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.post('/create', authMiddleware, postController.createPost);
router.patch('/update', authMiddleware, postController.updatePost);
router.delete('/delete', authMiddleware, postController.deletePost);
router.get('/all', authMiddleware, postController.getAllPosts);
router.get('/likes', authMiddleware, postController.getLikes);
router.patch('/add-like', authMiddleware, postController.addLike);
router.delete('/remove-like', authMiddleware, postController.removeLike); 
router.get('/one', authMiddleware, postController.getOnePost);

module.exports = router;