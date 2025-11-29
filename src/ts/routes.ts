import { Router } from 'express';
import AuthController from './controllers/AuthController';
import PecaController from './controllers/PecaController';
import EtapaController from './controllers/EtapaController';
import AeronaveController from './controllers/AeronaveController';
import { authMiddleware } from './middlewares/auth';

const router = Router();

router.post('/login', AuthController.login);
router.use(authMiddleware);
router.get('/aeronaves', AeronaveController.index);
router.post('/aeronaves', AeronaveController.create);
router.get('/aeronaves/:id/relatorio', AeronaveController.relatorio);
router.get('/pecas', PecaController.index);
router.patch('/pecas/:id/status', PecaController.updateStatus);
router.post('/etapas/:id/pecas', EtapaController.addPeca);

export { router };