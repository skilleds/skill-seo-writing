# Formato dos arquivos, saída padronizada e modos

## O arquivo do artigo (entrada do checador)

Markdown com front matter. O checador lê **este** arquivo.

```markdown
---
title: "keyword principal no início, até 60 caracteres"
keyword: keyword principal
secundarias: sec um, sec dois, sec três, sec quatro, sec cinco, sec seis
---
# H1 único com keyword e benefício

Texto da introdução (150 a 220 palavras, 3 a 5 parágrafos).

## H2 principal

Texto (220 a 300 palavras).

### H3

Texto (180 a 250 palavras).

## Conclusão

Texto (150 a 220 palavras).
```

Convenções que o checador usa: o texto sob o H1 é a **introdução**; o H2 cujo título contém
"Conclusão" (ou "Considerações finais") é a **conclusão**; os demais H2 são **principais**. Blocos de
código e comentários HTML são ignorados. `secundarias:` aceita lista separada por vírgula ou itens
`- ...`.

## O arquivo de briefings (opcional, `--briefings`)

Um bloco `## Briefing N` por seção, na ordem do texto (introdução, depois cada H2 e H3 na sequência):

```markdown
## Briefing 1
- Objetivo: uma frase.
- Intenção: Informacional
- Ângulo único: o diferencial da seção.
- Pontos-chave: ponto um; ponto dois; ponto três
- Extensão alvo: 150 a 220 palavras
- Conexão: como continua a seção anterior.
- Keywords: sec um, sec dois
```

## Saída padronizada (5 blocos, nesta ordem exata)

1. **Estrutura completa:** title tag, H1, H2 e H3, e as keywords secundárias com os Hs onde entram.
2. **Briefings numerados.**
3. **Checklist de conexão** (com a evidência de cada item).
4. **Conteúdo de cada seção**, com contagem de palavras e número de parágrafos (copie do relatório do
   checador, não estime), mais a saída do `checar-texto.mjs` (exit code e avisos remanescentes).
5. **Sugestões extras:** meta description, slug, links internos, FAQs, alt text, CTA.

Termine oferecendo ajustes (estrutura, briefings, tom ou seção específica).

## Os 3 modos

| Modo | Comando | O que faz |
|---|---|---|
| Completo | `/seow-write` | passos 1 a 4, checador, 5 blocos |
| Só outline + briefings | `/seow-outline` | blocos 1 a 3, sem texto, para aprovar a estrutura. O checador exige o artigo, então aqui a verificação é o checklist de conexão; a forma dos briefings é checada depois, no `/seow-write` |
| Revisão | `/seow-revise` | recebe texto pronto, extrai a estrutura (Hs e keywords), deriva os briefings **do que o texto já diz** (sem acrescentar fato), reescreve nas regras de parágrafo e extensão, roda o checador e mostra antes/depois dos achados |

Na revisão, fato que o texto original afirma sem fonte é **mantido e marcado** `[CONFIRMAR]`, nunca
removido em silêncio nem reforçado com número novo.

## O que o checador cobre (e o que não)

Cobre: title (tamanho, keyword no início), H1 único, contagem de H2 e de H3 por H2, 6 a 10
secundárias, extensão por tipo de seção, parágrafos por seção, palavras por parágrafo, BLUF do
primeiro parágrafo, resposta curta em título-pergunta, travessão, dado sem fonte, secundária ausente;
nos briefings, os 7 campos, 150 palavras, intenção válida, 3 a 5 pontos-chave e M == N com as seções.

**Não cobre** (julgamento seu, por isso o passo 3 é mostrado): se o briefing deriva só dos Hs
anteriores, se há salto de assunto, se o ângulo único é de fato único, se o fato afirmado é verdadeiro,
se a promessa é genérica, se a intenção do texto bate com a da keyword.

Exit: `0` sem erro (aviso não reprova, salvo `--estrito`) · `1` erro · `2` nada para verificar (não é
aprovação).
