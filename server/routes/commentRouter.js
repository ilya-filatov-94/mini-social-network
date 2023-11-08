const Router = require('express');
const router = new Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/AuthMiddleware');


router.post('/create', authMiddleware, commentController.createComment);
router.delete('/delete', authMiddleware, commentController.deleteComment);
router.get('/all', authMiddleware, commentController.getAllComments);


module.exports = router;