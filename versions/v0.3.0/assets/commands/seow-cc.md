---
description: schematize-seo-writing — context compact: grava o handoff no archive e roda /compact.
---
Antes de compactar, **grave o handoff** em `<projeto>/<projeto>_archive/context/` no par
**context + checklist** do padrão da `schematize-archive` (prefixo `AAAA-MM-DD-<slug>-`), com FEITO vs
ABERTO. Inclua: o tema e a keyword em andamento, a estrutura aprovada, quais seções já foram escritas,
a última saída do `checar-texto.mjs` (erros e avisos abertos) e os `[CONFIRMAR]` pendentes com o
usuário. Só então rode `/compact`.
