const Router = require('express');
const router = new Router();
const {body} = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/AuthMiddleware');


router.post('/registration',
            // body('email').isEmail(),
            // body('password').isLength({min: 6, max: 32}),
            userController.registration);
router.post('/login',
            body('email').isEmail(),
            body('password').isLength({min: 6, max: 32}),
            userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);

router.get('/all', authMiddleware, userController.getAll); 
router.get('/profile/:id', authMiddleware, userController.getOne);
router.post('/follow', authMiddleware, userController.followUser);
router.post('/unfollow', authMiddleware, userController.unsubscribeUser);
router.get('/followers', authMiddleware, userController.getFollowers);



module.exports = router;