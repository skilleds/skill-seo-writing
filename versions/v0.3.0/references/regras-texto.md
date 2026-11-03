# Regras do texto

## Extensão por tipo de seção

| Tipo de seção | Palavras |
|---|---|
| Introdução (texto sob o H1) e Conclusão | 150 a 220 |
| H2 principal | 220 a 300 |
| H3 | 180 a 250 |

A extensão é da **seção** (corpo até o próximo título de qualquer nível). H2 com H3 filhos: o texto
próprio do H2, antes do primeiro H3, também cumpre a faixa de H2.

## Parágrafos (obrigatórias)

- **3 parágrafos no mínimo**, ideal 4 a 5. Mais de 5, o checador avisa.
- Cada parágrafo entre **30 e 90 palavras** (alvo cerca de 60).
- **Primeiro parágrafo da seção: até 40 a 50 palavras (BLUF, a resposta primeiro).** O checador avisa
  acima de 40 e reprova acima de 50. É o trecho que busca e IA mais extraem: nele está a resposta, não
  o aquecimento.
- **Título em forma de pergunta:** responda em 1 a 2 frases no primeiro parágrafo; o resto desenvolve.
- Uma ideia por parágrafo. Lista ou tabela dentro da seção conta como um bloco de texto na contagem.

## Fatos, números e fontes (não inventar)

- Só afirme o que está no briefing, no insumo do usuário ou numa fonte citada.
- Estatística, preço, prazo, data, nome próprio, citação sem fonte: marque `[CONFIRMAR: o que falta]`
  no parágrafo. O checador avisa dado percentual/monetário/"segundo estudo" sem link nem marca.
- Fato volátil (produto, preço, regra de plataforma) leva a data em que foi verificado, ou a marca.
- Sem fonte, escreva o que é verdade por definição ou por raciocínio, nunca "estudos mostram".

## Copy da casa

- **Sem travessão** (— ou –) em texto de usuário final. Use vírgula, dois-pontos, ponto ou parênteses.
  O checador reprova.
- **Sem promessa genérica:** "a melhor solução", "resultados incríveis", "revolucione", "transforme
  seu negócio", "o guia definitivo". Troque por algo verificável: o que o leitor consegue fazer, em
  quanto tempo, com que condição (e fonte, se for número).
- Voz direta, frase curta, sem encher linguiça para bater contagem. Se a seção só fecha o mínimo de
  palavras com enrolação, o briefing estava fraco: volte ao passo 2.
- **Idioma:** o do prompt do usuário. pt-BR com acentuação correta.

## Keywords no texto

- A principal aparece no title, no H1 e no primeiro parágrafo da introdução, sem forçar.
- Cada secundária entra onde o passo 1 a mapeou, de forma natural. Repetição mecânica é keyword
  stuffing e `schematize-seo` veta (`schematize-seo → references/anti-padroes.md`).
- O checador avisa secundária que não aparece em lugar nenhum do texto.

## Sugestões extras (bloco 5 da entrega)

Meta description (até cerca de 155 caracteres, verdadeira, com a keyword), slug, links internos
sugeridos (âncora descritiva, destino existente), FAQs, alt text e CTA.

- **FAQ:** pergunta e resposta **visíveis** na página (formato de conteúdo). **Nunca** JSON-LD
  `FAQPage` (`schematize-seo → references/dados-estruturados.md`).
- **Alt text:** descreve o que o visual mostra, em frase curta. É texto. Gerar a imagem em si segue a
  regra de mídia da casa (pergunte Codex/Gemini; nunca modelo Claude).
- Dados estruturados do artigo (`Article`, `BreadcrumbList`) são da `schematize-seo`; aponte, não gere.
