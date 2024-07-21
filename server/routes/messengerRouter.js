const Router = require('express');
const router = new Router();

const messengerController = require('../controllers/messengerController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.get('/members', authMiddleware, messengerController.findMembers); 
router.post('/conversation', authMiddleware, messengerController.openConversation); 
router.get('/conversations', authMiddleware, messengerController.getConversations);
router.get('/messages', authMiddleware, messengerController.getMessages); 
router.post('/send-message', authMiddleware, messengerController.sendMessage);

router.get('/unread-messages', authMiddleware, messengerController.getUnreadMessages); 


module.exports = router;