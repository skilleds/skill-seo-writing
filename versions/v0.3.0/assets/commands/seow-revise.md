---
description: schematize-seo-writing — modo revisão: extrai a estrutura de um texto pronto, deriva briefings e reescreve nas regras.
argument-hint: "[arquivo ou texto a revisar]"
---
Revise $ARGUMENTS no **modo revisão** (`references/formato-saida.md`).

1. **Rode o checador no texto original** (adapte ao formato do artigo se faltar front matter, sem
   alterar o conteúdo) e guarde os achados como "antes".
2. **Extraia a estrutura:** Hs existentes, keyword principal e secundárias presentes. Aponte furo de
   estrutura (H1 duplo, H2 fora da faixa, salto de assunto).
3. **Derive os briefings do que o texto JÁ diz**, só dos Hs anteriores, sem acrescentar fato.
4. **Mostre o checklist de conexão** e corrija a estrutura se ele não fechar.
5. **Reescreva** nas regras de extensão e de parágrafo (BLUF, 30 a 90 palavras, 3 a 5 parágrafos).
   Afirmação sem fonte do original fica e leva `[CONFIRMAR]`; não remova nem reforce com número novo.
6. **Rode o checador no resultado até exit 0** e mostre antes/depois dos achados.
7. Entregue nos 5 blocos e pergunte por ajustes.
