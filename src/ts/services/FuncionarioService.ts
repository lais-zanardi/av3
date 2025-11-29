// src/ts/services/FuncionarioService.ts
import jwt from 'jsonwebtoken';
import { Funcionario, NivelPermissao } from '@prisma/client';
import FuncionarioRepository from '../repositories/FuncionarioRepository';
import { comparePassword } from '../utils/auth';
import Logger from '../utils/Logger';

class FuncionarioService {
  async autenticar(usuario: string, senhaPlana: string) {
    const funcionario = await FuncionarioRepository.findByUsuario(usuario);

    if (!funcionario) {
      Logger.security('Tentativa de login com usuário inexistente', { usuario, acao: 'LOGIN_FALHA' });
      throw new Error('Credenciais inválidas.');
    }

    const isSenhaValida = await comparePassword(senhaPlana, funcionario.senha);

    if (!isSenhaValida) {
      Logger.security('Tentativa de login com senha incorreta', { 
        usuario, 
        id: funcionario.id, 
        acao: 'LOGIN_FALHA' 
      });
      throw new Error('Credenciais inválidas.');
    }

    Logger.info(`Usuário ${usuario} autenticado com sucesso.`);

    const token = jwt.sign(
      {
        id: funcionario.id,
        usuario: funcionario.usuario,
        nivelPermissao: funcionario.nivelPermissao,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    );
    const { senha, ...dadosFuncionario } = funcionario;

    return {
      token,
      funcionario: dadosFuncionario,
    };
  }

  verificarPermissao(nivelAtual: NivelPermissao, niveisAceitos: NivelPermissao[]) {
    if (!niveisAceitos.includes(nivelAtual)) {
      throw new Error('Acesso negado: Nível de permissão insuficiente.');
    }
    return true;
  }
}

export default new FuncionarioService();