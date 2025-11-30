import matplotlib.pyplot as plt
import numpy as np
import re
import os

def extrair_dados_do_arquivo(caminho_arquivo):
    """Lê o arquivo de resultados, tentando múltiplas codificações para tratar o BOM."""
    if not os.path.exists(caminho_arquivo):
        print(f"Erro: Arquivo '{caminho_arquivo}' não encontrado.")
        return None, None, None

    conteudo = None
    
    # Lista de encodings para tentar, do mais específico (UTF-16) ao mais genérico
    encodings_to_try = ['utf-16', 'utf-8-sig', 'latin-1']
    
    for encoding in encodings_to_try:
        try:
            with open(caminho_arquivo, 'r', encoding=encoding) as f:
                conteudo = f.read()
            # Se a leitura for bem-sucedida, saímos do loop
            print(f"Sucesso ao ler arquivo com encoding: {encoding}")
            break
        except Exception:
            # Tenta o próximo encoding
            continue

    if conteudo is None:
        print(f"Erro crítico: Falha ao ler o arquivo '{caminho_arquivo}' com todas as codificações tentadas.")
        return None, None, None

    # --- REGEX FINAL E ROBUSTA ---
    # Captura os 3 números em sequência, ignorando o que houver no meio (.*?)
    padrao = re.compile(
        r'LOAD=\d+;.*?TOTAL=([\d\.]+?)ms;.*?PROCESSING=([\d\.]+?)ms;.*?LATENCY=([\d\.]+?)ms;', 
        re.DOTALL 
    )
    
    resultados_agrupados = padrao.findall(conteudo)
    
    if len(resultados_agrupados) != 3:
        print(f"Erro de extração: Esperava 3 conjuntos de resultados, mas encontrei {len(resultados_agrupados)}.")
        print("--- Conteúdo lido (para debug) ---")
        print(conteudo.strip())
        print("----------------------------------")
        return None, None, None

    # Converte os resultados para float
    dados_total = [float(r[0]) for r in resultados_agrupados]
    dados_processamento = [float(r[1]) for r in resultados_agrupados]
    dados_latencia = [float(r[2]) for r in resultados_agrupados]

    return dados_total, dados_processamento, dados_latencia

def gerar_grafico(dados, titulo, nome_arquivo, cor):
    """Função que gera e salva um gráfico de barras."""
    usuarios = ['1 Usuário', '5 Usuários', '10 Usuários']
    
    plt.figure(figsize=(8, 5))
    barras = plt.bar(usuarios, dados, color=cor, width=0.5)
    
    plt.ylabel('Tempo (milissegundos)')
    plt.title(titulo)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    
    for barra in barras:
        altura = barra.get_height()
        plt.text(barra.get_x() + barra.get_width()/2., altura,
                 f'{altura:.2f} ms',
                 ha='center', va='bottom')

    plt.tight_layout()
    plt.savefig(nome_arquivo)
    print(f"✅ Gráfico salvo: {nome_arquivo}")
    plt.close()

# --- Bloco Principal de Execução ---

NOME_ARQUIVO_RESULTADOS = 'resultados.txt'
print(f"Iniciando a análise do arquivo: {NOME_ARQUIVO_RESULTADOS}")

dados_total, dados_processamento, dados_latencia = extrair_dados_do_arquivo(NOME_ARQUIVO_RESULTADOS)

if dados_total:
    print("\nDados extraídos com sucesso. Gerando gráficos...")
    
    gerar_grafico(dados_total, 'Tempo Total de Resposta (Média)', 'grafico_total.png', '#3498db')
    gerar_grafico(dados_processamento, 'Tempo de Processamento do Servidor (Média)', 'grafico_processamento.png', '#2ecc71')
    gerar_grafico(dados_latencia, 'Latência de Rede Estimada (Média)', 'grafico_latencia.png', '#e74c3c')
    
    print("\nProcesso de automação concluído!")
else:
    print("\nNão foi possível gerar os gráficos devido a erros de extração.")