import express from 'express';
import TweetController from '../controllers/TweetController';
import AuthMiddleware from '../middleware/AuthMiddleware';

var router = express.Router();

router.get('/:id', TweetController.get);
router.use(AuthMiddleware);

router.post('/', TweetController.create);
router.delete('/:id', TweetController.delete);
router.patch('/:id', TweetController.update);

export default router;
