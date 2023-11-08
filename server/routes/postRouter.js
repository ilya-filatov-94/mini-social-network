const Router = require('express');
const router = new Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/AuthMiddleware');


router.post('/create', authMiddleware, postController.createPost);
router.patch('/update', authMiddleware, postController.updatePost);
router.delete('/delete', authMiddleware, postController.deletePost);
router.get('/all', authMiddleware, postController.getAllPosts);
router.get('/latest', authMiddleware, postController.getLatestPosts); 

router.get('/auth', authMiddleware, postController.check);



module.exports = router;