# Redação SEO (schematize-seo-writing) — sempre-on

Texto para ranquear segue um processo, não uma inspiração. Estratégia, keywords e técnico são da
`schematize-seo`; aqui só a **redação**.

1. **Quatro passos, sem pular:** (1) estrutura: title até 60, H1 único, 4 a 8 H2, 1 a 3 H3, 6 a 10
   secundárias mapeadas; (2) briefings por seção, **só dos Hs anteriores**, até 150 palavras, 7
   campos; (3) checklist de conexão mostrado antes de escrever; (4) texto, **uma seção por vez, só com
   o briefing dela** (com ≥3 seções, cada uma vai a um subagent `sonnet` em paralelo; o principal roda o checador e revisa).
2. **Sem keyword/intenção, pare e pergunte** (`schematize-seo → /seo-keywords`). Uma intenção por URL.
3. **Nunca invente fato.** Dado sem fonte vira `[CONFIRMAR: ...]`; o checador reprova (ERRO) frase com número/ano/multiplicador/atribuição sem link nem marca, e `--final` reprova `[CONFIRMAR]` residual. Extensão por seção é aviso, não ERRO.
4. **Parágrafo:** 3 a 5 por seção, 30 a 90 palavras, o primeiro com até 40 a 50 e a resposta dentro
   (BLUF); título-pergunta responde em 1 a 2 frases. Extensão: intro/conclusão 150-220, H2 220-300,
   H3 180-250.
5. **Copy:** sem travessão (— ou –), sem promessa genérica ("a melhor solução", "resultados
   incríveis"). FAQ só visível; **nunca** JSON-LD `FAQPage`.
6. **O checador decide:** `node .claude/skills/schematize-seo-writing/scripts/checar-texto.mjs
   artigo.md --briefings briefings.md` em exit 0 antes de entregar. Exit 2 não é aprovação.
7. **Mídia:** imagem nunca por modelo Claude; pergunte Codex/Gemini ao usuário (nenhum disponível:
   avise que sai ruim e ofereça banco com licença ou asset do cliente).
8. Feche a entrega oferecendo ajustes (estrutura, briefings, tom, seção), sem bloquear; em overdev não pergunte, parkeie `[~]`.
9. <!-- herdado:engineering/orquestracao:curto -->**Orquestrador não desenvolve; subagent barato executa.** O agent principal só planeja, despacha e revisa; ação onerosa vira micro-tasks para o executor mais barato que resolve: `haiku` (mecânico) / `sonnet` (código; falhou → mesmo subagent corrige, até 2 rodadas) → Codex `gpt-5.6-terra` → Cursor → subagent `opus` (motivo) → `park`; **visual vai direto ao Codex**; **imagem nunca pelo Claude: detectar Codex/Gemini e perguntar ao usuário qual usar (Codex é a sugestão), nunca API de imagem paga**; papéis em `agentes.toml`. No overdev, cada item do checklist vai a um subagent e o principal revisa antes do `- [x]`. **Sem frota ociosa:** idle com pendência volta ao trabalho; dependente de outro agent → mata e enfileira com gatilho; terminou → mata (§9.6). Detalhe: `schematize-engineering` → `references/orquestracao.md` §9.<!-- /herdado -->


**Herda os pisos 22–29** da `schematize-engineering` (git como trava de conclusão, deploy só do git, ops é o gate da IA, sem agents inúteis, relatório 30 min/handoff 6 h, CI remoto só antes do hml, microserviço autônomo, build em dev/hml + higiene).
