# Changelog — schematize-seo-writing

Todas as mudanças relevantes deste pacote, no formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
com versionamento [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]
### Corrigido
- `checar-texto.mjs`: fato inventado vira ERRO por frase (número com unidade, ano, múltiplo, "N em cada M", moedas, milhões/bilhões, "segundo <Instituição>") sem link nem `[CONFIRMAR]`; `--final` reprova `[CONFIRMAR]` residual; keyword obrigatória no H1; `secundarias: [a, b]` em linha. Faixas de palavras por seção viram AVISO. Testes 29 → 38.
- Paralelismo por seção (subagent `sonnet`), fechamento sem bloquear overdev, passo de SERP/experiência, README sem `/tmp`; título sem travessão alinhado com a `schematize-seo`.
- Herda os pisos 22–29 da engineering (bloco curto).

## [0.2.0] — 2026-10-14
Description reduzida para o orçamento de listagem do catálogo; sem mudança de piso.

### Alterado
- Description encurtada para ≤190 caracteres (catálogo estourou o orçamento de 9000 com 45 skills), mantendo O QUE + gatilho concreto + divisa com as irmãs.

## [0.1.1] — 2026-10-14
Integração ao catálogo (grafo, skills.json, herdados) e correção do texto de precedência herdado.

### Alterado
- Description reduzida (≤235 chars) para caber no orçamento de listagem de skills (soma ≤8300); mesmo território, fronteiras com as irmãs preservadas.
- Blocos herdados ressincronizados com a `schematize-engineering` v0.27.0 (`tools/sync-herdados.mjs`): orquestração com a regra de imagem (nunca pelo Claude; detecta Codex/Gemini e pergunta ao usuário qual usar, Codex como sugestão) e `schematize overdev delegar` (comando do app) no lugar do falso nome de skill `schematize-overdev`.
- Bloco "Precedência e herança" passa à variante `dominio`: o texto antigo dizia que os comandos `/seow-*` "cobrem só o piso da linguagem", o que é falso para skill de domínio/ferramenta.
- `skill.toml`: `order` 33 -> 36 (colidia com a `design`; a ordem no catálogo é única).

## [0.1.0] — 2026-10-14
Primeira versão. Nasce do documento "Skill SEO-Redação v1.1" do usuário, escrito para outro modelo e agora adaptado ao Claude Code, porque a `schematize-seo` governa estratégia e técnico mas não tinha quem cuidasse da **redação** do texto, e regra de redação só em prosa não se verifica.

### Adicionado
- Processo de 4 passos obrigatórios (estrutura hierárquica, briefings derivados só dos Hs anteriores, checklist de conexão, geração só com o briefing da seção), regras de extensão por tipo de seção, de parágrafo e BLUF, saída em 5 blocos e 3 modos (completo, outline + briefings, revisão).
- `scripts/checar-texto.mjs`: mede title, H1, H2/H3, secundárias, parágrafos, palavras, BLUF, extensão por seção, travessão, dado sem fonte e a forma dos briefings; exit 0/1/2. `scripts/checar-texto.test.sh` com casos vermelhos plantados.
- Comandos `/seow-write`, `/seow-outline`, `/seow-revise`, `/seow-check`, `/seow-help`, `/seow-load`, `/seow-claude`, `/seow-handoff`, `/seow-cc`.
- Fronteira escrita com a `schematize-seo`; FAQ só como Q&A visível; copy sem travessão e sem promessa genérica; regra de mídia da casa.
