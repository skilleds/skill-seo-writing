#!/usr/bin/env bash
# Vermelho primeiro do checador de texto SEO. Cada caso muta UM defeito sobre um artigo verde.
#
# EXCEÇÃO DECLARADA (piso de shell §1): harness de teste roda `set -u` sem `-e` — precisa continuar
# depois de um caso vermelho para reportar todos, em vez de parar no primeiro.
set -u
AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
C="$AQUI/checar-texto.mjs"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT INT TERM
ok=0; fail=0

# p N  -> parágrafo de N palavras (palavra0..palavra6 em rodízio; as secundárias aparecem no texto)
p() { local n=$1 i out=""; for ((i = 0; i < n; i++)); do out+="palavra$((i % 7)) "; done; printf '%s.\n\n' "${out% }"; }
corpo() { local n; for n in "$@"; do p "$n"; done; }

# gen: monta o artigo a partir de knobs (variáveis de ambiente), todas com default verde.
gen() {
  printf -- '---\ntitle: "%s"\nkeyword: palavra1\nsecundarias: %s\n---\n' "${TITULO:-palavra1 completo para iniciantes}" "${SECUND:-palavra0, palavra2, palavra3, palavra4, palavra5, palavra6}"
  printf '# palavra1 completo e simples\n\n'
  [ "${H1DUPLO:-0}" = 1 ] && printf '# segundo h1\n\n'
  corpo ${INTRO:-40 40 40 40}
  printf '## %s\n\n' "${TH2:-Primeira seção}"
  if [ -n "${PRIM:-}" ]; then printf '%s\n\n' "$PRIM"; corpo ${S1R:-70 70 70}; else corpo ${S1:-40 70 70 70}; fi
  printf '### Subseção\n\n'; corpo ${H3A:-40 50 50 50}
  [ "${H3MAIS:-0}" = 1 ] && for x in b c d; do printf '### Sub %s\n\n' "$x"; corpo 40 50 50 50; done
  printf '## Segunda seção\n\n'; corpo ${S2:-40 70 70 70}
  if [ "${N2:-3}" -ge 3 ]; then printf '## Terceira seção\n\n'; corpo 40 70 70 70; fi
  local i; for ((i = 4; i <= ${N2:-3}; i++)); do printf '## Seção extra %s\n\n' "$i"; corpo 40 70 70 70; done
  printf '## Conclusão\n\n'; corpo ${CONC:-40 40 40 40}
  [ -n "${EXTRA:-}" ] && printf '%s\n' "$EXTRA"
}

BRIEF_OK() { # um briefing válido por seção (8 seções: intro, 4 H2, 1 H3... contamos dinamicamente)
  local n=$1 i; for ((i = 1; i <= n; i++)); do
    printf '## Briefing %s\n- Objetivo: explicar o ponto.\n- Intenção: Informacional\n- Ângulo único: exemplo prático.\n- Pontos-chave: a; b; c\n- Extensão alvo: 220 a 300 palavras\n- Conexão: segue a seção anterior.\n- Keywords: palavra0, palavra2\n\n' "$i"
  done
}

# caso <nome> <exit-esperado> <agulha> [args extras do checador]   (artigo no stdin)
caso() {
  local nome="$1" esp="$2" agulha="$3"; shift 3
  local f="$TMP/$nome.md"; cat > "$f"
  local saida; saida="$(node "$C" "$f" "$@" 2>&1)"; local rc=$?
  if [ "$rc" != "$esp" ]; then echo "  ✖ $nome: exit $rc, esperado $esp"; sed 's/^/      /' <<<"$saida"; fail=$((fail + 1)); return; fi
  if [ -n "$agulha" ] && ! grep -qF -- "$agulha" <<<"$saida"; then echo "  ✖ $nome: exit certo, saída sem \"$agulha\""; sed 's/^/      /' <<<"$saida"; fail=$((fail + 1)); return; fi
  echo "  ✔ $nome"; ok=$((ok + 1))
}

echo "== verde de partida =="
caso verde 0 "0 erro(s), 0 aviso(s)" < <(gen)

echo "== title / H1 =="
caso title-longo 1 "máximo 60" < <(TITULO="palavra1 $(printf 'x%.0s' $(seq 1 60))" gen)
caso keyword-fora-do-inicio 1 "não está no início" < <(TITULO="outra coisa palavra1" gen)
caso h1-duplo 1 "2 H1" < <(H1DUPLO=1 gen)
caso sem-h1 1 "nenhum H1" < <(gen | sed '/^# palavra1/d')
caso sem-front-matter 1 "title ausente" < <(gen | sed '1,6d')

echo "== contagem de Hs =="
caso poucos-h2 1 "H2 (esperado 4 a 8)" < <(N2=2 gen)
caso muitos-h2 1 "H2 (esperado 4 a 8)" < <(N2=9 gen)
caso h3-demais 1 "máximo 3" < <(H3MAIS=1 gen)
caso poucas-secundarias 1 "keywords secundárias" < <(SECUND="a, b" gen)

echo "== parágrafos =="
caso poucos-paragrafos 1 "mínimo 3" < <(S1="40 70" gen)
caso muitos-paragrafos 0 "ideal 4 a 5" < <(S1="40 40 40 40 40 40" gen)
caso paragrafo-curto 1 "esperado 30 a 90" < <(S1="40 70 20 70" gen)
caso paragrafo-longo 1 "esperado 30 a 90" < <(S1="40 70 120 70" gen)
caso bluf-estourado 1 "BLUF" < <(S1="60 70 70 70" gen)
caso bluf-no-limite-aviso 0 "alvo BLUF" < <(S1="50 70 70 70" gen)

echo "== extensão por tipo de seção =="
caso intro-curta 0 "introdução: 150 a 220" < <(INTRO="30 30 30 30" gen)
caso conclusao-longa 0 "conclusão: 150 a 220" < <(CONC="40 70 70 70" gen)
caso h2-curto 0 "H2 principal: 220 a 300" < <(S2="35 35 35 35" gen)
caso h3-curto 0 "H3: 180 a 250" < <(H3A="30 30 30 30" gen)

echo "== pergunta no título =="
caso pergunta-3-frases 1 "responder em 1 a 2" < <(TH2="O que é palavra1?" PRIM="palavra1 e isto. Segundo ponto aqui. Terceiro ponto aqui mais palavras para completar trinta palavras ao todo, sim, é isso mesmo aqui no fim." gen)
caso pergunta-1-frase 0 "" < <(TH2="O que é palavra1?" PRIM="palavra1 é a prática de escrever para ser encontrado e compreendido ao mesmo tempo, com resposta direta logo na primeira frase do texto inteiro, sem rodeios e sem enrolação para o leitor." S1R="70 70 70" gen)

echo "== copy e fatos =="
caso travessao 1 "travessão" < <(EXTRA=$'\n## Seção com travessão — proibida\n' gen)
caso estatistica-sem-fonte 1 "sem fonte" < <(gen | sed '0,/^palavra0 palavra1/s//palavra0 37% palavra1/')
caso extensao-estrito 1 "H3: 180 a 250" --estrito < <(H3A="30 30 30 30" gen)
caso estatistica-marcada 0 "residual" < <(INTRO="37 40 40 40" gen | sed '0,/^palavra0 palavra1/s//palavra0 37% [CONFIRMAR fonte] palavra1/')

caso fato-multiplicador 1 "sem fonte" < <(gen | sed '0,/^palavra0 palavra1/s//palavra0 3x palavra1/')
caso fato-n-em-cada-m 1 "sem fonte" < <(gen | sed '0,/^palavra0 palavra1/s//palavra0 2 em cada 5 palavra1/')
caso fato-ano 1 "sem fonte" < <(gen | sed '0,/^palavra0 palavra1/s//palavra0 em 2023 palavra1/')
caso fato-milhoes 1 "sem fonte" < <(gen | sed '0,/^palavra0 palavra1/s//palavra0 250 milhões palavra1/')
caso fato-gartner 1 "sem fonte" < <(gen | sed '0,/^palavra0 palavra1/s//palavra0 segundo a Gartner palavra1/')
caso fato-com-link 0 "0 erro(s)" < <(gen | sed '0,/^palavra0 palavra1/s//palavra0 3x ([fonte](https:\/\/exemplo.org\/x)) palavra1/')
caso confirmar-residual-final 1 "residual" --final < <(INTRO="37 40 40 40" gen | sed '0,/^palavra0 palavra1/s//palavra0 37% [CONFIRMAR fonte] palavra1/')
caso h1-sem-keyword 1 "ausente do H1" < <(gen | sed 's/^# palavra1 completo e simples/# outro assunto/')
caso secundarias-inline 0 "0 erro(s)" < <(SECUND="[palavra0, palavra2, palavra3, palavra4, palavra5, palavra6]" gen)

echo "== briefings =="
n_sec=$(gen | grep -c '^#\{1,3\} ')
gen > "$TMP/art.md"
BRIEF_OK "$n_sec" > "$TMP/b-ok.md"
node "$C" "$TMP/art.md" --briefings "$TMP/b-ok.md" >/dev/null 2>&1; rc=$?
if [ "$rc" = 0 ]; then echo "  ✔ briefings-verde"; ok=$((ok + 1)); else echo "  ✖ briefings-verde: exit $rc"; node "$C" "$TMP/art.md" --briefings "$TMP/b-ok.md" | sed 's/^/      /'; fail=$((fail + 1)); fi
red_brief() { # nome agulha  (briefing mutado no stdin)
  cat > "$TMP/b-$1.md"; local s; s="$(node "$C" "$TMP/art.md" --briefings "$TMP/b-$1.md" 2>&1)"; local r=$?
  if [ "$r" = 1 ] && grep -qF -- "$2" <<<"$s"; then echo "  ✔ $1"; ok=$((ok + 1)); else echo "  ✖ $1: exit $r"; sed 's/^/      /' <<<"$s"; fail=$((fail + 1)); fi
}
BRIEF_OK "$((n_sec - 1))" | red_brief briefing-faltando "briefings para"
BRIEF_OK "$n_sec" | sed '0,/^- Conexão:.*/{/^- Conexão:.*/d}' | red_brief briefing-sem-campo "campo ausente: Conexão"
BRIEF_OK "$n_sec" | sed "0,/^- Objetivo:.*/s//- Objetivo: $(printf 'muito %.0s' $(seq 1 160))/" | red_brief briefing-longo "máximo 150"
BRIEF_OK "$n_sec" | sed '0,/Intenção: Informacional/s//Intenção: Generica/' | red_brief briefing-intencao-invalida "intenção fora de"
BRIEF_OK "$n_sec" | sed '0,/Pontos-chave: a; b; c/s//Pontos-chave: a; b/' | red_brief briefing-pontos "pontos-chave"

echo "== uso =="
node "$C" "$TMP/nao-existe.md" >/dev/null 2>&1; rc=$?
if [ "$rc" = 2 ]; then echo "  ✔ arquivo-ausente-exit-2"; ok=$((ok + 1)); else echo "  ✖ arquivo-ausente: exit $rc"; fail=$((fail + 1)); fi
: > "$TMP/vazio.md"; node "$C" "$TMP/vazio.md" >/dev/null 2>&1; rc=$?
if [ "$rc" = 2 ]; then echo "  ✔ arquivo-vazio-exit-2"; ok=$((ok + 1)); else echo "  ✖ arquivo-vazio: exit $rc"; fail=$((fail + 1)); fi

echo; echo "checar-texto.test: $ok ok, $fail falha(s)"
[ "$fail" -eq 0 ]
