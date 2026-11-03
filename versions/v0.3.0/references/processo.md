# O processo: 4 passos obrigatórios

Origem: o documento "Skill SEO-Redação v1.1" do usuário, adaptado ao Claude Code e feito verificável.
O processo é uma **cascata**: cada passo só usa o que o anterior produziu. Pular passo não economiza
tempo; troca a revisão barata (de uma estrutura) pela cara (de um texto inteiro).

## Passo 0 — Insumos (antes do passo 1)

Sem estes, pare e pergunte: tema, **keyword principal**, intenção de busca dominante, público, idioma
(o do prompt do usuário; pt-BR por padrão) e os **fatos permitidos** (o que o texto pode afirmar).
Keywords e intenção vêm de `schematize-seo → /seo-keywords` ou do usuário; esta skill não pesquisa
keyword. As 6 a 10 secundárias também vêm de lá (ou o usuário aprova uma lista proposta por você,
marcada como proposta).

## Passo 1 — Estrutura hierárquica

Gere, nesta ordem:

1. **Title tag** — até 60 caracteres, keyword principal no início.
2. **H1 único** — keyword + benefício claro e verdadeiro (`schematize-seo → references/on-page.md`).
3. **4 a 8 H2** que cobrem a intenção de busca e os gaps. A conclusão é um H2 e conta nesse total.
4. **1 a 3 H3** por H2 que precisar de detalhe (H2 sem H3 é normal).
5. **6 a 10 keywords secundárias/LSI**, cada uma mapeada ao(s) H em que aparece. Sem a mesma
   secundária disputando duas seções (canibalização interna).

Regra de lógica: **quem lê só os títulos entende o fluxo**. Se o encadeamento de Hs não conta uma
história sozinho, refaça a estrutura antes de seguir.

## Passo 2 — Briefings

Um briefing por seção (introdução sob o H1, cada H2, cada H3), **derivado exclusivamente dos Hs que o
precedem**:

- Briefing de H2: usa o H1 e os H2 anteriores.
- Briefing de H3: usa só o H2 pai e os H3 irmãos anteriores.
- Nunca traz informação nova. Fato que precisa entrar vem do insumo do passo 0, marcado.

Campos fixos, **máximo 150 palavras no total** (o limite impede que o briefing vire o próprio texto):

| Campo | Conteúdo |
|---|---|
| Objetivo | 1 frase: o que a seção entrega ao leitor |
| Intenção | Informacional, Comercial, Transacional ou Navegacional |
| Ângulo único | o diferencial desta seção frente às demais |
| Pontos-chave | 3 a 5 itens (separados por `;` na mesma linha) |
| Extensão alvo | da tabela de extensão em `references/regras-texto.md` |
| Conexão | como esta seção continua a anterior |
| Keywords | secundárias a usar com naturalidade |

## Passo 3 — Checklist de conexão (ANTES de escrever)

Mostre ao usuário, marcado item a item, com a evidência de cada um:

- [ ] Cada briefing deriva apenas dos Hs anteriores
- [ ] Não há salto de assunto entre seções vizinhas
- [ ] A sequência forma uma jornada lógica do leitor
- [ ] As secundárias estão distribuídas sem canibalização
- [ ] Os ângulos únicos não se sobrepõem

Item que não fecha: volte ao passo 1 ou 2 e corrija. **Não escreva texto com checklist aberto.** O
checador (`--briefings`) só prova a forma dos briefings (campos, 150 palavras, M == N com as seções);
a derivação e a ausência de salto são julgamento seu, e por isso o checklist é mostrado.

## Passo 4 — Geração do conteúdo

Antes de escrever: leia a SERP do top-10 para ver o gap real e traga experiência de primeira mão, autor/data e fonte primária; volume sem isso cai no `scaled content abuse` (`schematize-seo` → `references/anti-padroes.md`).

Escreva **uma seção por vez** (cada seção só vê o próprio briefing; por isso, com ≥3 seções, despache cada uma a um subagent `sonnet` em paralelo, em partições distintas, e o principal monta, roda o checador e revisa), com **somente o briefing daquela seção** como contexto (não releia o
rascunho das outras para "ajustar o tom": é assim que a seção 5 repete a 2). Regras de extensão e de
parágrafo em `references/regras-texto.md`.

Depois de escrever tudo:

1. Salve o artigo em `seow-<slug>.md` e os briefings em `seow-<slug>-briefings.md` (formato em
   `references/formato-saida.md`).
2. Rode `node scripts/checar-texto.mjs seow-<slug>.md --briefings seow-<slug>-briefings.md`.
3. **Corrija até exit 0** (um erro nunca é "provavelmente aceitável"). Aviso que ficar: explique na
   entrega. Exit `2`: nada foi verificado, conserte o caminho do arquivo e rode de novo.
4. Só então monte os 5 blocos de entrega.

## Fechamento

Ao terminar qualquer execução, **ofereça** ajustes na estrutura, nos briefings, no tom ou em alguma seção, sem bloquear. Em overdev perguntar é vetado: parkeie a dúvida como `[~]`.
