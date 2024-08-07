const Router = require('express');
const router = new Router();
const {body} = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/AuthMiddleware');


router.post('/registration',
            body('email').isEmail(),
            body('password').isLength({min: 6, max: 32}),
            userController.registration);
router.post('/login',
            body('email').isEmail(),
            body('password').isLength({min: 6, max: 32}),
            userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);

router.get('/profile/:ref', authMiddleware, userController.getProfile);
router.get('/profile/:ref/edit', authMiddleware, userController.getOneEdit);
router.patch('/profile/update', authMiddleware, userController.updateProile);

router.get('/all', authMiddleware, userController.getAll); 
router.get('/all-selected', authMiddleware, userController.getSelectedUsers);
router.post('/follow', authMiddleware, userController.subscribeUser);
router.post('/unfollow', authMiddleware, userController.unsubscribeUser);
router.get('/suggestions', authMiddleware, userController.getSuggestionsForUser);
router.get('/common', authMiddleware, userController.getMutualFriends);
router.get('/activities', authMiddleware, userController.getActivitiesUsers);
router.post('/activities', authMiddleware, userController.createActivityUser);
router.get('/followers', authMiddleware, userController.getFollowers);
router.get('/followers-page', authMiddleware, userController.getFollowersSelected);
router.get('/get-notifications', authMiddleware, userController.getAllNotifications);
router.patch('/update-notifications', authMiddleware, userController.updateNotifications);

module.exports = router;
