import * as dotenv from 'dotenv';
dotenv.config();

import { NivelPermissao, TipoAeronave, TipoPeca, StatusPeca, StatusEtapa } from '@prisma/client';
import { hashPassword } from './utils/auth';
import FuncionarioRepository from './repositories/FuncionarioRepository';
import AeronaveRepository from './repositories/AeronaveRepository';
import PecaRepository from './repositories/PecaRepository';
import EtapaRepository from './repositories/EtapaRepository';
import Logger from './utils/Logger';

const TEST_USER_DATA = {
  usuario: 'admin',
  senhaPlana: '123',
  nome: 'Admin de Testes',
  telefone: '999999999',
  endereco: 'Rua de Teste, 100',
  nivelPermissao: NivelPermissao.ADMINISTRADOR,
};

const AERONAVE_TESTE = {
  codigo: 'PT-LOAD-TEST',
  modelo: 'Boeing 737 Max',
  tipo: TipoAeronave.COMERCIAL,
  capacidade: 180,
  alcance: 6000
};

async function main() {
  Logger.info('🌱 Iniciando o script de Seed...');
  
  try {
    const existingUser = await FuncionarioRepository.findByUsuario(TEST_USER_DATA.usuario);
    if (!existingUser) {
      const hashedPassword = await hashPassword(TEST_USER_DATA.senhaPlana);
      const { senhaPlana, ...dataToCreate } = TEST_USER_DATA; 
      await FuncionarioRepository.create({
        ...dataToCreate,
        senha: hashedPassword, 
      });
      Logger.info(`✅ Usuário '${TEST_USER_DATA.usuario}' criado.`);
    } else {
      Logger.info(`ℹ️ Usuário '${TEST_USER_DATA.usuario}' já existe.`);
    }

    let aeronave = await AeronaveRepository.findByCodigo(AERONAVE_TESTE.codigo);
    if (!aeronave) {
      aeronave = await AeronaveRepository.create(AERONAVE_TESTE);
      Logger.info(`✅ Aeronave '${AERONAVE_TESTE.codigo}' criada.`);
    } else {
      Logger.info(`ℹ️ Aeronave '${AERONAVE_TESTE.codigo}' já existe.`);
    }

    if (!aeronave) return; 

    const pecasExistentes = await PecaRepository.findByAeronaveId(aeronave.id);
    if (pecasExistentes.length === 0) {
      await PecaRepository.create({
        nome: 'Turbina Esquerda',
        tipo: TipoPeca.IMPORTADA,
        fornecedor: 'Rolls-Royce',
        statusPeca: StatusPeca.EM_PRODUCAO,
        aeronave: { connect: { id: aeronave.id } }
      });
      
      await PecaRepository.create({
        nome: 'Trem de Pouso',
        tipo: TipoPeca.NACIONAL,
        fornecedor: 'Embraer',
        statusPeca: StatusPeca.EM_PRODUCAO,
        aeronave: { connect: { id: aeronave.id } }
      });
      Logger.info(`✅ Peças criadas para a aeronave.`);
    }

    const etapasExistentes = await EtapaRepository.findByAeronaveId(aeronave.id);
    if (etapasExistentes.length === 0) {
      await EtapaRepository.create({
        nome: 'Montagem Inicial',
        prazo: '2025-12-01',
        status: StatusEtapa.PENDENTE,
        aeronave: { connect: { id: aeronave.id } }
      });
      Logger.info(`✅ Etapa criada.`);
    }

  } catch (error) {
    Logger.error('❌ Falha ao executar o seed.', error);
  } finally {
    process.exit(0); 
  }
}

main();