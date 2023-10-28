const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
// const authMiddleware = require('../middleware/AuthMiddleware');



router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
// router.get('/auth', authMiddleware, userController.check);



module.exports = router;