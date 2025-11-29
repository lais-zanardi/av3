import { Request, Response } from 'express';
import FuncionarioService from '../services/FuncionarioService';

class AuthController {
  async login(req: Request, res: Response) {
    const { usuario, senha } = req.body;

    const result = await FuncionarioService.autenticar(usuario, senha);

    return res.json(result);
  }
}

export default new AuthController();