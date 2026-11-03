---
description: schematize-seo-writing — modo completo: estrutura, briefings, conexão, texto, checador e 5 blocos de entrega.
argument-hint: "[tema, keyword principal, público]"
---
Escreva o texto SEO de $ARGUMENTS no **modo completo**. Leia antes `references/processo.md`,
`references/regras-texto.md` e `references/formato-saida.md` da skill `schematize-seo-writing`.

0. **Insumos:** tema, keyword principal, intenção, público, idioma, fatos permitidos. Sem keyword,
   pare e pergunte (ou `schematize-seo → /seo-keywords`). Não invente fato.
1. **Estrutura:** title (até 60), H1 único, 4 a 8 H2, 1 a 3 H3 onde precisar, 6 a 10 secundárias
   mapeadas aos Hs.
2. **Briefings:** um por seção, só dos Hs anteriores, até 150 palavras, 7 campos fixos.
3. **Checklist de conexão:** mostre-o marcado, com evidência. Aberto: corrija antes de seguir.
4. **Conteúdo:** uma seção por vez, só com o briefing dela (≥3 seções: um subagent `sonnet` por seção, em paralelo). Salve `seow-<slug>.md` e
   `seow-<slug>-briefings.md`; rode
   `node <skill>/scripts/checar-texto.mjs seow-<slug>.md --final --briefings seow-<slug>-briefings.md`
   (a skill instala em `.claude/skills/schematize-seo-writing/` ou `~/.claude/skills/...`) e
   **corrija até exit 0**.
5. **Entregue os 5 blocos** na ordem de `formato-saida.md` e ofereça ajustes (sem bloquear) na
   estrutura, nos briefings, no tom ou em alguma seção.

Sem travessão, sem promessa genérica, dado sem fonte marcado `[CONFIRMAR]`, FAQ só visível (sem
`FAQPage`).
