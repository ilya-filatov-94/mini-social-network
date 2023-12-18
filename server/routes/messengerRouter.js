const Router = require('express');
const router = new Router();

const messengerController = require('../controllers/messengerController');
const authMiddleware = require('../middleware/AuthMiddleware');


router.post('/conversations', authMiddleware, messengerController.createConversation); 
router.get('/conversations', authMiddleware, messengerController.getConversations);
router.get('/messages', authMiddleware, messengerController.getMessages); 


module.exports = router;