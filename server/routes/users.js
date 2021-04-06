import express from 'express';
import UserController from '../controllers/UserController';
import AuthMiddleware from '../middleware/AuthMiddleware';

var router = express.Router();

router.use(AuthMiddleware);
router.delete('/', UserController.delete);
router.patch('/', UserController.update);
router.get('/tweets', UserController.tweets);


export default router;