---
name: schematize-seo-writing
metadata:
  version: 0.2.0
description: >-
  Redação SEO em 4 passos: outline, briefing, checklist de conexão e texto validado por checador. Use ao pedir artigo para ranquear ou content brief. Estratégia: schematize-seo.
---
<!-- cross-skill: keywords-conteudo.md, dados-estruturados.md, on-page.md -> schematize-seo -->

# Redação SEO da casa (schematize-seo-writing)

Processo **rígido e hierárquico** para escrever texto que rankeia e se lê: estrutura primeiro, briefing
por seção depois, conexão checada antes de escrever, e só então o texto — em parágrafos curtos, com a
resposta no início. A tese: o texto ruim de SEO nasce de pular etapa (escrever sem estrutura, inventar
fato para preencher seção). Aqui nenhuma etapa se pula, e **a máquina mede o resultado** antes da entrega.

**Versão:** skill `schematize-seo-writing` v0.2.0. Changelog em `CHANGELOG.md`.

## Precedência e herança (leia antes de divergir)

<!-- herdado:engineering/precedencia:dominio intro="Esta skill é **ferramenta de conteúdo**, não de linguagem: cuida da **redação** de texto SEO. Estratégia, técnico, pesquisa de keywords, dados estruturados, multi-domínio e descoberta por IA são da `schematize-seo`; esta skill só escreve o texto, dentro do que a `schematize-seo` decidiu." cmd="seow" -->Esta skill é **ferramenta de conteúdo**, não de linguagem: cuida da **redação** de texto SEO. Estratégia, técnico, pesquisa de keywords, dados estruturados, multi-domínio e descoberta por IA são da `schematize-seo`; esta skill só escreve o texto, dentro do que a `schematize-seo` decidiu.

1. **Onde esta skill divergir da base, a BASE MANDA.** Aqui mora a especialização do domínio ou da
   ferramenta — o como, o padrão, o gate. Divergência de *piso* é defeito desta skill, não variante local.
2. **O que não está repetido aqui é HERDADO, não dispensado.** Esta skill herda os pisos da base e
   os comandos dela cobrem o **domínio**, não o piso geral. Valem integralmente, sem cópia local:
   - **§28 Archive** — `<projeto>/<projeto>_archive/` é **repositório git próprio, PRIVADO e
     obrigatório**, criticidade 0 (`schematize-archive`).
   - **§35 Definition of Done** e a lista de anti-padrões (citada por **título**, nunca por número).
   - **§39 Índice/MAPA** — enumeração exaustiva (uma entrada por unidade chamável, `M == N`) e grafo
     com arestas em ASCII (`A -> B`), nunca a seta unicode.
   - **IAM** (`schematize-engineering` → `references/iam.md`): identidade ≠ email, ≥2 fatores, ReBAC
     multi-tenant, argon2id-only para senha nova, sessão longa e logout irreversível.
   - **Efeito externo** nunca sai de não-produção (`schematize-engineering` →
     `references/efeitos-externos.md`).
   - **Orquestração** (`schematize-engineering` → `references/orquestracao.md` §9): o principal não
     desenvolve (é Claude Opus); executor mais barato que resolve — `haiku`/`sonnet` → Codex Terra → Cursor → `opus` só após falha; visual direto ao Codex; imagem nunca pelo Claude: detecta Codex/Gemini e pergunta ao usuário qual usar (Codex é a sugestão, não automática), nunca API paga.
3. **QA, ops, IAM e índice não têm comando próprio aqui:** vêm da base `/eng-*`. Para trabalho
   contínuo use `/eng-overdev`; para planejar `/eng-plan`; para varrer a base `/eng-scan`; para
   revisão geral `/eng-review` (e `/eng-ops`, `/eng-iam`, `/eng-index`). Os comandos
   `/seow-*` cobrem o domínio desta skill; o piso geral é o da base.<!-- /herdado -->

## Fronteira com a `schematize-seo` (leia antes de usar)

| É da `schematize-seo` | É desta skill |
|---|---|
| Estratégia, intenção, clusters, arquitetura de URL, multi-domínio, canibalização | **Escrever** o texto de uma URL cuja intenção já foi decidida |
| Pesquisa e mapa de keywords: `schematize-seo → /seo-keywords` | Usar a keyword principal e as 6 a 10 secundárias **que vieram de lá** (ou do usuário) |
| Dados estruturados (JSON-LD), canonical, hreflang, sitemap, CWV, `llms.txt`, AIO | Nada disso. Só aponta: `schematize-seo → references/dados-estruturados.md` |
| FAQ como formato de conteúdo (`schematize-seo → references/dados-estruturados.md`: `FAQPage` **não é marcado**) | Redigir Q&A **visível** no texto; nunca gerar JSON-LD `FAQPage` |
| Title/meta/H1 únicos e verdadeiros por página (`schematize-seo → references/on-page.md`) | Produzir title/H1/meta que cumprem o piso, sem prometer o que a página não entrega |
| Briefs de conteúdo no nível de cluster (`schematize-seo → references/keywords-conteudo.md`) | Briefing **por seção** de um texto, derivado dos Hs (passo 2) |

**Sem keyword definida, pare e pergunte** (ou mande rodar `schematize-seo → /seo-keywords`). Escrever
sem keyword nem intenção é chute com aparência de método.

## Comandos (Claude Code)

| Comando | O que faz |
|---|---|
| `/seow-write` | **modo completo**: os 4 passos, roda o checador, entrega os 5 blocos |
| `/seow-outline` | **só estrutura + briefings + checklist**, para aprovar antes de escrever |
| `/seow-revise` | **modo revisão**: recebe texto pronto, extrai a estrutura, deriva briefings e reescreve nas regras |
| `/seow-check` | roda `scripts/checar-texto.mjs` num arquivo e lista os achados |
| `/seow-help` | lista os comandos |
| `/seow-load` | carrega à força o corpo normativo (processo, formato, regras do texto) |
| `/seow-claude` | cria/mescla o `CLAUDE.md` sempre-on de redação SEO na raiz do repo |
| `/seow-cc` · `/seow-handoff` | context compact / handoff arquivado |

## Como usar

1. **Confirme insumos:** tema, keyword principal, intenção, público e idioma (o do prompt; pt-BR por
   padrão). Falta keyword → fronteira acima. Fatos que o texto pode afirmar vêm do usuário ou de fonte
   citada; **nada fora do briefing**.
2. **Siga os 4 passos** de `references/processo.md`, sem pular. O passo 4 termina rodando
   `node scripts/checar-texto.mjs artigo.md --briefings briefings.md` e **corrigindo até exit 0** (`--final` na entrega: `[CONFIRMAR]` residual reprova; fato sem fonte na frase é ERRO; faixas de palavras são AVISO, a régua é a intenção).
3. **Entregue nos 5 blocos** de `references/formato-saida.md` e **feche oferecendo** ajustes (sem bloquear; em overdev nunca pergunte, parkeie) 
    na estrutura, nos briefings, no tom ou em alguma seção específica.

Mapa de references:

| Tarefa | Reference |
|---|---|
| Os 4 passos obrigatórios, campos do briefing, derivação, checklist de conexão, geração | `references/processo.md` |
| Regras do texto: extensão por tipo de seção, parágrafos, BLUF, pergunta no título, copy da casa, fatos e fontes | `references/regras-texto.md` |
| Formato dos arquivos (artigo e briefings), os 5 blocos de saída, os 3 modos, o que o checador cobre e o que NÃO cobre | `references/formato-saida.md` |

## Pisos inegociáveis (vetam o atalho)

1. **Quatro passos, nesta ordem, sem pular:** estrutura, briefings, checklist de conexão, texto.
   "Escrevi direto porque o tema é simples" é a violação típica.
2. **Briefing deriva SÓ dos Hs que o precedem.** H2 usa o H1 e os H2 anteriores; H3 usa o H2 pai e os
   H3 irmãos. Máximo 150 palavras, sete campos fixos. Briefing que traz informação nova está errado.
3. **Geração com SOMENTE o briefing da seção** como contexto. É o que impede a seção de invadir a
   vizinha e de repetir o que já foi dito.
4. **Nunca inventar fato.** Número, estatística, nome, prazo, preço, citação: ou está no briefing/na
   fonte do usuário, ou fica marcado `[CONFIRMAR: ...]` para o usuário validar. Nada de "estudos mostram".
5. **Parágrafo curto é regra, não gosto.** 3 a 5 parágrafos por seção, 30 a 90 palavras cada, o primeiro
   com até 40 a 50 e a resposta já dentro (BLUF). Título em forma de pergunta: resposta em 1 a 2 frases.
6. **O checador decide, não a impressão.** Entrega só com `checar-texto.mjs` em exit 0 (avisos
   explicados na entrega). Exit `2` (nada verificado) **não é aprovação**.
7. **Copy da casa:** sem travessão (— ou –) em texto de usuário final; sem promessa genérica ("a
   melhor solução", "resultados incríveis", "transforme seu negócio"); frase que diga algo verificável.
8. **Uma intenção por URL.** O texto escreve para uma intenção; se o outline pede duas, são dois textos
   (`schematize-seo → references/keywords-conteudo.md`, canibalização).
9. **FAQ é Q&A visível, sem marcação.** `FAQPage` saiu da galeria de rich results; não gere JSON-LD
   (`schematize-seo → references/dados-estruturados.md`).
10. **Mídia nunca por modelo Claude.** Sugestão de imagem/alt text é texto (descrição do que o visual
    mostra). Gerar o visual: detecte Codex/Gemini e **pergunte ao usuário qual usar**. Nenhum disponível:
    diga sem rodeio que visual gerado pelo Claude sai ruim de verdade (a qualidade é inversamente
    proporcional à de código, onde o Claude é o melhor) e ofereça alternativas: instalar Codex/Gemini,
    imagem de banco com licença comercial, asset do cliente.
11. <!-- herdado:engineering/orquestracao:curto -->**Orquestrador não desenvolve; subagent barato executa.** O agent principal só planeja, despacha e revisa; ação onerosa vira micro-tasks para o executor mais barato que resolve: `haiku` (mecânico) / `sonnet` (código; falhou → mesmo subagent corrige, até 2 rodadas) → Codex `gpt-5.6-terra` → Cursor → subagent `opus` (motivo) → `park`; **visual vai direto ao Codex**; **imagem nunca pelo Claude: detectar Codex/Gemini e perguntar ao usuário qual usar (Codex é a sugestão), nunca API de imagem paga**; papéis em `agentes.toml`. No overdev, cada item do checklist vai a um subagent e o principal revisa antes do `- [x]`. **Sem frota ociosa:** idle com pendência volta ao trabalho; dependente de outro agent → mata e enfileira com gatilho; terminou → mata (§9.6). Detalhe: `schematize-engineering` → `references/orquestracao.md` §9.<!-- /herdado -->

## Relação com as outras skills

- **`schematize-seo`** — a dona da estratégia e do técnico (ver a fronteira acima). Esta skill consome o que ela decide.
- **`schematize-web`** — onde o texto vira página (rotas, `metadata`, i18n). Esta skill entrega markdown; o web publica.
- **`schematize-institutional`** — quais páginas existem num site de empresa; esta skill escreve o texto de uma delas quando pedido.
- **`schematize-docs`** — documentação técnica (README, ADR, runbook). Texto para ranquear é daqui; doc de engenharia é de lá.


**Herda os pisos 22–29** da `schematize-engineering` (git como trava de conclusão, deploy só do git, ops é o gate da IA, sem agents inúteis, relatório 30 min/handoff 6 h, CI remoto só antes do hml, microserviço autônomo, build em dev/hml + higiene).

<!-- herdado:engineering/pisos-22-29:bloco -->**Herda os pisos 22–29 da `schematize-engineering`** (texto completo em `assets/CLAUDE.md` dela): 22 tudo no git — sem remote, push falho ou HEAD≠origin a demanda NÃO se conclui; 23 deploy só do git (VETADO scp/rsync/tar|ssh/docker save|load/git bundle); 24 o ops é o gate da IA — a IA nunca muda a VPS direto nem escreve SQL, só operação nomeada (`ssh vps "ops <op>"`); 25 sem agents inúteis (entregou, morreu); 26 relatório a cada 30 min e handoff a cada 6 h; 27 CI remoto só antes do hml, a pedido ou em tag (`workflow_dispatch` + `hml-*`/`v*`; VETADO `pull_request`, `push` em branch, `workflow_run`, cron sem justificativa); 28 microserviço autônomo (fila durável + 7 testes de resiliência); 29 build/teste na máquina dev/hml quando existe (ponte só no workspace de build, nunca prd) + higiene (`scripts/higiene.sh`).<!-- /herdado -->
