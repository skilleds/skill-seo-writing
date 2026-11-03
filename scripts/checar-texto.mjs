#!/usr/bin/env node
/**
 * schematize-seo-writing — checador do texto SEO gerado (passo 4 da skill).
 *
 * Motivo: as regras de redação (title, estrutura de Hs, extensão por seção, parágrafos, BLUF) eram
 * texto para o modelo "lembrar". Aqui viram medição: o texto só é entregue depois que isto sai limpo.
 * Entrada: arquivo markdown do artigo (front matter com title/keyword/secundarias + corpo)
 *   e, opcional, `--briefings <arquivo>` com os briefings (formato em references/formato-saida.md).
 * Saída: uma linha por achado (ERRO ou AVISO) e um resumo.
 * Exit: 0 sem erros (avisos passam, salvo --estrito) · 1 há erro · 2 nada para verificar / uso errado.
 */
import { readFileSync, existsSync } from "node:fs";

const args = process.argv.slice(2);
let arquivo = null, briefArq = null, estrito = false, final = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--briefings") briefArq = args[++i];
  else if (args[i] === "--estrito") estrito = true;
  else if (args[i] === "--final") final = true;
  else if (args[i] === "-h" || args[i] === "--help") {
    console.log("uso: checar-texto.mjs <artigo.md> [--briefings <briefings.md>] [--estrito] [--final]\n--final: [CONFIRMAR] residual vira ERRO (entrega)\n0 passa · 1 reprova · 2 nada para verificar");
    process.exit(0);
  } else if (!arquivo) arquivo = args[i];
}
if (!arquivo || !existsSync(arquivo)) {
  console.error(`nada para verificar: arquivo ausente (${arquivo ?? "sem argumento"}). Ausência de material não é aprovação.`);
  process.exit(2);
}

const achados = [];
const erro = (onde, msg) => achados.push({ nivel: "ERRO", onde, msg });
const aviso = (onde, msg) => achados.push({ nivel: "AVISO", onde, msg });

const texto = readFileSync(arquivo, "utf8").replace(/\r\n/g, "\n");
if (!texto.trim()) { console.error("nada para verificar: arquivo vazio."); process.exit(2); }

const contar = (s) => s
  .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
  .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
  .replace(/[*_`>#|]/g, " ")
  .split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const frases = (s) => s.split(/[.!?]+(?:\s|$)/).filter((x) => x.trim()).length;

// ---- front matter
let corpo = texto, fm = {};
const m = texto.match(/^---\n([\s\S]*?)\n---\n?/);
if (m) {
  corpo = texto.slice(m[0].length);
  let chave = null;
  for (const l of m[1].split("\n")) {
    const kv = l.match(/^([\w-]+):\s*(.*)$/);
    if (kv) { chave = kv[1]; fm[chave] = kv[2].replace(/^["']|["']$/g, ""); if (fm[chave] === "") fm[chave] = []; }
    else if (chave && /^\s*-\s+/.test(l)) { if (!Array.isArray(fm[chave])) fm[chave] = []; fm[chave].push(l.replace(/^\s*-\s+/, "").trim()); }
  }
}
const title = typeof fm.title === "string" ? fm.title : "";
if (!title) erro("title", "title ausente no front matter (title: ...).");
else {
  const n = [...title].length;
  if (n > 60) erro("title", `title com ${n} caracteres (máximo 60).`);
  const kw = typeof fm.keyword === "string" ? fm.keyword : "";
  if (!kw) aviso("title", "front matter sem `keyword:` (principal); não dá para checar keyword no início do title.");
  else if (!title.toLowerCase().startsWith(kw.toLowerCase())) erro("title", `keyword "${kw}" não está no início do title.`);
}
let sec = fm.secundarias ?? fm.secundarias_lsi ?? [];
if (typeof sec === "string") sec = sec.replace(/^\[|\]$/g, "").split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
if (sec.length < 6 || sec.length > 10) erro("keywords", `${sec.length} keywords secundárias (esperado 6 a 10).`);

// ---- parse de seções (fora de fences e comentários HTML)
const secoes = []; // {nivel, titulo, pars[], tipo}
let atual = { nivel: 0, titulo: "(antes do H1)", pars: [] }, buf = [], fence = false, coment = false;
const fluxo = () => { if (buf.length) { atual.pars.push(buf.join(" ")); buf = []; } };
const abre = (s) => { fluxo(); secoes.push(s); atual = s; };
let h1 = 0, h4 = 0;
secoes.push(atual);
for (const l of corpo.split("\n")) {
  if (/^```/.test(l)) { fence = !fence; continue; }
  if (fence) continue;
  if (coment) { if (l.includes("-->")) coment = false; continue; }
  if (/^\s*<!--/.test(l)) { if (!l.includes("-->")) coment = true; continue; }
  const h = l.match(/^(#{1,6})\s+(.*\S)\s*$/);
  if (h) {
    const nv = h[1].length;
    if (nv === 1) { h1++; abre({ nivel: 1, titulo: h[2], pars: [], intro: true }); }
    else { if (nv >= 4) h4++; abre({ nivel: nv, titulo: h[2], pars: [] }); }
    continue;
  }
  if (!l.trim()) { fluxo(); continue; }
  buf.push(l.trim());
}
fluxo();

if (h1 === 0) erro("H1", "nenhum H1 (`# ...`).");
{
  const kw = typeof fm.keyword === "string" ? fm.keyword.toLowerCase() : "";
  const h1s = secoes.find((x) => x.nivel === 1);
  if (kw && h1s && !h1s.titulo.toLowerCase().includes(kw)) erro("H1", `keyword "${fm.keyword}" ausente do H1.`);
  if (kw && h1s && h1s.pars[0] && !h1s.pars[0].toLowerCase().includes(kw)) aviso("keywords", "keyword principal ausente do 1º parágrafo.");
}
if (h1 > 1) erro("H1", `${h1} H1 (deve ser único).`);
if (secoes[0].pars.length) aviso("estrutura", "texto antes do H1 (fora do front matter) não é checado.");
if (h4) aviso("estrutura", `${h4} heading(s) H4+ (a estrutura prevê só H1/H2/H3).`);

const h2s = secoes.filter((s) => s.nivel === 2);
if (h2s.length < 4 || h2s.length > 8) erro("H2", `${h2s.length} H2 (esperado 4 a 8).`);
let pai = null;
for (const s of secoes) {
  if (s.nivel === 2) { pai = s; pai.filhos = 0; }
  else if (s.nivel === 3) {
    if (!pai) erro(`H3 "${s.titulo}"`, "H3 sem H2 pai."); else pai.filhos++;
  } else if (s.nivel === 1) pai = null;
}
for (const s of h2s) if (s.filhos > 3) erro(`H2 "${s.titulo}"`, `${s.filhos} H3 sob este H2 (máximo 3).`);

const CONCL = /conclus|considera[çc][õo]es finais|conclusion|em resumo|para fechar/i;
const faixa = { intro: [150, 220, "introdução"], concl: [150, 220, "conclusão"], h2: [220, 300, "H2 principal"], h3: [180, 250, "H3"] };

const checaveis = [];
for (const s of secoes) {
  if (s.nivel === 1) { s.tipo = "intro"; s.rotulo = "Introdução (sob o H1)"; checaveis.push(s); }
  else if (s.nivel === 2) { s.tipo = CONCL.test(s.titulo) ? "concl" : "h2"; s.rotulo = `H2 "${s.titulo}"`; checaveis.push(s); }
  else if (s.nivel === 3) { s.tipo = "h3"; s.rotulo = `H3 "${s.titulo}"`; checaveis.push(s); }
}
if (!h2s.some((s) => s.tipo === "concl")) aviso("estrutura", "nenhum H2 de conclusão identificado (título com 'Conclusão'/'Considerações finais').");

const corpoTodo = [];
for (const s of checaveis) {
  const w = s.pars.map(contar);
  const total = w.reduce((a, b) => a + b, 0);
  corpoTodo.push(...s.pars);
  const [min, max, nome] = faixa[s.tipo];
  if (!s.pars.length) { erro(s.rotulo, "seção sem texto."); continue; }
  if (total < min || total > max) aviso(s.rotulo, `${total} palavras (${nome}: ${min} a ${max}).`);
  if (s.pars.length < 3) erro(s.rotulo, `${s.pars.length} parágrafo(s) (mínimo 3).`);
  else if (s.pars.length > 5) aviso(s.rotulo, `${s.pars.length} parágrafos (ideal 4 a 5).`);
  w.forEach((n, i) => {
    if (i === 0) {
      if (n > 50) erro(s.rotulo, `1º parágrafo com ${n} palavras (BLUF: máximo 40 a 50).`);
      else if (n > 40) aviso(s.rotulo, `1º parágrafo com ${n} palavras (alvo BLUF até 40).`);
      if (n < 30) erro(s.rotulo, `1º parágrafo com ${n} palavras (mínimo 30).`);
    } else if (n < 30 || n > 90) erro(s.rotulo, `parágrafo ${i + 1} com ${n} palavras (esperado 30 a 90).`);
  });
  if (/\?\s*$/.test(s.titulo) && s.pars.length && frases(s.pars[0]) > 2)
    erro(s.rotulo, `título é pergunta e o 1º parágrafo tem ${frases(s.pars[0])} frases (responder em 1 a 2).`);
}

// ---- copy da casa e fatos
const plano = corpoTodo.join("\n");
if (/—|\s–\s/.test(plano) || /—|\s–\s/.test(title)) erro("copy", "travessão (— ou –) em texto de usuário final (regra da casa).");
// fato: número com unidade, ano, múltiplo, "N em cada M", valor/escala, ou atribuição a instituição.
// Cada FRASE com fato precisa de [CONFIRMAR] ou link na própria frase; senão ERRO (anti-alucinação).
const FATO = new RegExp([
  String.raw`\d+(?:[.,]\d+)?\s?(?:%|por cento|x\b|×)`,
  String.raw`\b(?:19|20)\d{2}\b`,
  String.raw`\b\d+\s+em\s+cada\s+\d+`,
  String.raw`(?:R\$|US\$|€)\s?\d`,
  String.raw`\d+(?:[.,]\d+)?\s+(?:mil|milh(?:ão|ões)|bilh(?:ão|ões)|trilh(?:ão|ões))\b`,
  String.raw`\b(?:segundo|de acordo com|conforme|according to)\s+(?:um\s+|o\s+|a\s+)?(?:estudo|pesquisa|levantamento|relat[óo]rio|dados|[A-ZÀ-Ý][\wÀ-ÿ]+)`,
].join("|"), "u");
const SEM_I = /\b(?:segundo|de acordo com|conforme)\s+(?:um\s+)?(?:estudo|pesquisa|levantamento|relat[óo]rio)/i;
corpoTodo.forEach((p) => {
  for (const f of p.split(/(?<=[.!?])\s+/)) {
    if ((FATO.test(f) || SEM_I.test(f)) && !/\[(?:CONFIRMAR|confirmar)[^\]]*\]/.test(f) && !/\]\(https?:/.test(f))
      erro("fatos", `frase com dado/estatística/atribuição sem fonte (link) nem marca [CONFIRMAR]: "${f.slice(0, 70)}..."`);
  }
});
const resid = (plano.match(/\[(?:CONFIRMAR|confirmar)[^\]]*\]/g) || []).length;
if (resid) (final ? erro : aviso)("fatos", `${resid} marca(s) [CONFIRMAR] residual(is): resolva com fonte primária antes de entregar${final ? "" : " (--final reprova)"}.`);
const minusc = plano.toLowerCase();
for (const k of sec) if (!minusc.includes(k.toLowerCase())) aviso("keywords", `secundária "${k}" não aparece no texto.`);

// ---- briefings (opcional)
if (briefArq) {
  if (!existsSync(briefArq)) { console.error(`nada para verificar: briefings ausentes (${briefArq}).`); process.exit(2); }
  const blocos = readFileSync(briefArq, "utf8").replace(/\r\n/g, "\n").split(/^##\s+Briefing\b/m).slice(1);
  if (!blocos.length) erro("briefings", "nenhum bloco `## Briefing N` no arquivo.");
  if (blocos.length !== checaveis.length) erro("briefings", `${blocos.length} briefings para ${checaveis.length} seções do texto (um por seção, M == N).`);
  const campos = [["Objetivo", /^-\s*Objetivo\s*:/im], ["Intenção", /^-\s*Inten[çc][ãa]o(?:\s+prim[áa]ria)?\s*:/im], ["Ângulo único", /^-\s*[ÂA]ngulo(?:\s+[úu]nico)?\s*:/im],
    ["Pontos-chave", /^-\s*Pontos-chave\s*:/im], ["Extensão alvo", /^-\s*Extens[ãa]o(?:\s+alvo)?\s*:/im], ["Conexão", /^-\s*Conex[ãa]o\s*:/im], ["Keywords", /^-\s*Keywords?(?:\s+secund[áa]rias)?\s*:/im]];
  blocos.forEach((b, i) => {
    const id = `briefing ${i + 1}`;
    const linhas = b.split("\n").slice(1).join("\n");
    const n = contar(linhas);
    if (n > 150) erro(id, `${n} palavras (máximo 150).`);
    for (const [nome, re] of campos) if (!re.test(linhas)) erro(id, `campo ausente: ${nome}.`);
    const it = linhas.match(/^-\s*Inten[çc][ãa]o[^:]*:\s*(.+)$/im);
    if (it && !/(informacional|comercial|transacional|navegacional)/i.test(it[1])) erro(id, `intenção fora de Informacional/Comercial/Transacional/Navegacional: "${it[1].trim()}".`);
    const pk = linhas.match(/^-\s*Pontos-chave\s*:\s*(.+)$/im);
    if (pk) {
      const itens = pk[1].split(";").map((x) => x.trim()).filter(Boolean);
      if (itens.length < 3 || itens.length > 5) erro(id, `${itens.length} pontos-chave (esperado 3 a 5, separados por ';' na mesma linha).`);
    }
  });
}

// ---- saída
const e = achados.filter((a) => a.nivel === "ERRO").length, a = achados.length - e;
for (const x of achados) console.log(`${x.nivel}  ${x.onde}: ${x.msg}`);
console.log(`\nchecar-texto: ${checaveis.length} seção(ões), ${e} erro(s), ${a} aviso(s).`);
process.exit(e > 0 || (estrito && a > 0) ? 1 : 0);
