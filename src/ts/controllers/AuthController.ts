import { Request, Response, NextFunction } from 'express';
import FuncionarioService from '../services/FuncionarioService';

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { usuario, senha } = req.body;
      const result = await FuncionarioService.autenticar(usuario, senha);
      return res.json(result);
    } catch (error) {
      next(error); 
    }
  }
}

export default new AuthController();