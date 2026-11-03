---
description: schematize-seo-writing — roda o checador de texto SEO num artigo (e briefings) e lista os achados.
argument-hint: "<artigo.md> [--briefings <briefings.md>] [--estrito]"
---
Rode o checador da skill sobre $ARGUMENTS:

`node .claude/skills/schematize-seo-writing/scripts/checar-texto.mjs <artigo.md> [--briefings <b.md>] [--estrito]`
(ou o caminho em `~/.claude/skills/` se a skill estiver instalada globalmente).

Reporte o exit code e cada achado (`ERRO` reprova; `AVISO` precisa de explicação). Exit `2` = nada foi
verificado e **não é aprovação**. Não "conserte" o texto aqui sem o usuário pedir; para corrigir, use
`/seow-write` ou `/seow-revise`. Lembre o que o checador NÃO cobre: derivação dos briefings, salto de
assunto, veracidade, promessa genérica (`references/formato-saida.md`).
