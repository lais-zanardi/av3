import * as dotenv from 'dotenv';
dotenv.config();

import { NivelPermissao } from '@prisma/client';
import { hashPassword } from './utils/auth';
import FuncionarioRepository from './repositories/FuncionarioRepository';
import Logger from './utils/Logger';

const TEST_USER_DATA = {
  usuario: 'admin',
  senhaPlana: '123',
  nome: 'Admin de Testes',
  telefone: '999999999',
  endereco: 'Rua de Teste, 100',
  nivelPermissao: NivelPermissao.ADMINISTRADOR,
};

async function main() {
  Logger.info('Iniciando o script de Seed (criação de usuário de teste)...');
  
  try {
    const existingUser = await FuncionarioRepository.findByUsuario(TEST_USER_DATA.usuario);
    if (existingUser) {
      Logger.info(`Usuário '${TEST_USER_DATA.usuario}' já existe. Ignorando criação.`);
      return;
    }

    const hashedPassword = await hashPassword(TEST_USER_DATA.senhaPlana);
    const { senhaPlana, ...dataToCreate } = TEST_USER_DATA; 
    const funcionario = await FuncionarioRepository.create({
      ...dataToCreate,
      senha: hashedPassword, 
    });

    Logger.info(`✅ Usuário de teste '${funcionario.usuario}' criado com sucesso (ID: ${funcionario.id})`);
  } catch (error) {
    Logger.error('❌ Falha ao executar o seed. Verifique as dependências e o servidor MySQL.', error);
  } finally {
    process.exit(0); 
  }
}
main();