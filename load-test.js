const axios = require('axios'); 
const BASE_URL = 'http://localhost:3000';
const USER_CREDENTIALS = { usuario: 'admin', senha: '123' }; 

async function runLoadTest(concurrentUsers) {
  console.log(`\n--- Iniciando teste com ${concurrentUsers} usuário(s) simultâneo(s) ---`);

  let token;
  try {
    const loginRes = await axios.post(`${BASE_URL}/login`, USER_CREDENTIALS);
    token = loginRes.data.token;
  } catch (err) {
    console.error('Falha no login. Verifique se o usuário existe no banco.');
    return;
  }

  const requests = [];
  const clientConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  for (let i = 0; i < concurrentUsers; i++) {
    requests.push(async () => {
      const start = performance.now();
      
      try {
        const response = await axios.get(`${BASE_URL}/aeronaves`, clientConfig);
        
        const end = performance.now();
        
        const totalResponseTime = end - start;
    
        const serverProcessingTime = parseFloat(response.headers['x-processing-time-ms'] || '0');
        
        const networkLatency = Math.max(0, totalResponseTime - serverProcessingTime);

        return {
          total: totalResponseTime,
          processing: serverProcessingTime,
          latency: networkLatency
        };
      } catch (err) {
        console.error('Erro na requisição:', err.message);
        return null;
      }
    });
  }

  const results = await Promise.all(requests.map(fn => fn()));
  const validResults = results.filter(r => r !== null);
  const avgTotal = validResults.reduce((acc, r) => acc + r.total, 0) / validResults.length;
  const avgProc = validResults.reduce((acc, r) => acc + r.processing, 0) / validResults.length;
  const avgLat = validResults.reduce((acc, r) => acc + r.latency, 0) / validResults.length;

  console.log(`📊 Resultados Médios para ${concurrentUsers} usuários:`);
  console.log(`   ➤ Tempo de Resposta Total: ${avgTotal.toFixed(2)} ms`);
  console.log(`   ➤ Tempo de Processamento (Servidor): ${avgProc.toFixed(2)} ms`);
  console.log(`   ➤ Latência de Rede (Estimada): ${avgLat.toFixed(2)} ms`);
}

async function main() {
  await runLoadTest(1);
  await new Promise(r => setTimeout(r, 1000)); 
  await runLoadTest(5);
  await new Promise(r => setTimeout(r, 1000));
  await runLoadTest(10);
}

main();