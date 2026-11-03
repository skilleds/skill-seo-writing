# schematize-seo-writing

> **Texto que ranqueia nasce de processo.** Estrutura primeiro, briefing por seção, conexão checada
> antes de escrever, e só então o texto, em parágrafos curtos com a resposta no início. Um checador
> executável mede o resultado antes da entrega.

Pacote de **skill normativa para [Claude Code](https://claude.com/claude-code)**.
Parte do catálogo **schematize skills**. Adaptada do documento "Skill SEO-Redação v1.1".

## Por que ela existe

Regra de redação escrita em prosa vira "lembre-se de". Aqui os limites (title até 60, H1 único, 4 a 8
H2, extensão por tipo de seção, 30 a 90 palavras por parágrafo, BLUF) viram `scripts/checar-texto.mjs`,
com casos vermelhos plantados em `scripts/checar-texto.test.sh`.

## Instalar

### Pelo app schematize (recomendado)

```bash
schematize install seo-writing    # requer o CLI schematize instalado
```

### Manual

```bash
git clone https://github.com/schematizeme/skill-seo-writing.git $HOME/.cache/skill-seo-writing
bash $HOME/.cache/skill-seo-writing/install.sh .        # instala em .claude/ do projeto atual
bash $HOME/.cache/skill-seo-writing/install.sh "$HOME"  # ou globalmente
```

## Comandos

`/seow-write` (completo) · `/seow-outline` (estrutura + briefings) · `/seow-revise` (revisão) ·
`/seow-check` (checador) · `/seow-help` · `/seow-load` · `/seow-claude` · `/seow-cc` · `/seow-handoff`.

## Fronteira

`schematize-seo` cuida de estratégia, técnico, pesquisa de keywords, dados estruturados, multi-domínio
e AIO. Esta skill escreve o texto. Pesquisa de keyword: `schematize-seo → /seo-keywords`.

## Requisitos

`node` (checador) e `bash` (teste). Sem dependências de pacote.
