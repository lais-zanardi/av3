const axios = require('axios'); 
const BASE_URL = 'http://localhost:3000';
const USER_CREDENTIALS = { usuario: 'admin', senha: '123' }; 

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const getRandomItem = (arr) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

const STATUS_PECA = ['EM_PRODUCAO', 'EM_TRANSPORTE', 'PRONTA'];

async function runLoadTest(concurrentUsers) {
  let token;
  let aeronavesIds = [];
  let pecasIds = [];

  try {
    const loginRes = await axios.post(`${BASE_URL}/login`, USER_CREDENTIALS);
    token = loginRes.data.token;
    
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const aeroRes = await axios.get(`${BASE_URL}/aeronaves`, config);
    aeronavesIds = aeroRes.data.map(a => a.id);

    const pecasRes = await axios.get(`${BASE_URL}/pecas`, config);
    pecasIds = pecasRes.data.map(p => p.id);

    if (aeronavesIds.length === 0 || pecasIds.length === 0) {
      console.error('⚠️ ALERTA: Banco de dados parece vazio. Rode "npm run seed" ou crie dados antes de testar.');
    }

  } catch (err) {
    console.error(`❌ Falha crítica no Setup: ${err.message}`);
    return;
  }

  const requests = [];
  const clientConfig = { headers: { Authorization: `Bearer ${token}` } };

  for (let i = 0; i < concurrentUsers; i++) {
    requests.push(async () => {
      const dice = Math.random();
      let targetUrl = '';
      let method = 'GET';
      let data = null;

      if (dice < 0.34) {
        targetUrl = `${BASE_URL}/aeronaves`;
      } 
      
      else if (dice < 0.67 && aeronavesIds.length > 0) {
        const id = getRandomItem(aeronavesIds);
        targetUrl = `${BASE_URL}/aeronaves/${id}/relatorio`;
      } 
      
      else if (pecasIds.length > 0) {
        const id = getRandomItem(pecasIds);
        targetUrl = `${BASE_URL}/pecas/${id}/status`;
        method = 'PATCH';
        data = { status: getRandomItem(STATUS_PECA) }; 
      } else {
        targetUrl = `${BASE_URL}/aeronaves`; 
      }

      const start = performance.now();
      
      try {
        const response = await axios({
          method: method,
          url: targetUrl,
          data: data,
          headers: clientConfig.headers,
          validateStatus: () => true 
        });
        
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
        console.error(`Erro de conexão: ${err.message}`);
        return null;
      }
    });
  }

  const results = await Promise.all(requests.map(fn => fn()));
  const validResults = results.filter(r => r !== null);
  
  if (validResults.length === 0) {
      console.log(`LOAD=${concurrentUsers}; TOTAL=0.00ms; PROCESSING=0.00ms; LATENCY=0.00ms;`);
      return;
  }
  
  const avgTotal = validResults.reduce((acc, r) => acc + r.total, 0) / validResults.length;
  const avgProc = validResults.reduce((acc, r) => acc + r.processing, 0) / validResults.length;
  const avgLat = validResults.reduce((acc, r) => acc + r.latency, 0) / validResults.length;

  
  console.log(`LOAD=${concurrentUsers}; TOTAL=${avgTotal.toFixed(2)}ms; PROCESSING=${avgProc.toFixed(2)}ms; LATENCY=${avgLat.toFixed(2)}ms;`);
}

async function main() {
  await runLoadTest(1);
  await sleep(1000); 
  await runLoadTest(5);
  await sleep(1000);
  await runLoadTest(10);
}

main();