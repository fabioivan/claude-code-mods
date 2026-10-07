# synapse-rate-limit

HUD completo para o Claude Code, baseado no plugin `hud` (claude-hud 0.11.1, MIT, ver `LICENSE.claude-hud`), mais uma linha própria com a "previsão do tempo" do contexto e o tamanho em MB do que está sendo enviado.

> Não use junto com o plugin `hud` original: as duas barras apareceriam ao mesmo tempo. Desabilite o `hud`.

## O que aparece

### Linha do synapse (última linha da barra)

```
☂ Chuva  12 MB  134k / 1m  ▁▂▂▃▃▄▅  +98k no último turno
```

| Trecho | Significado |
| --- | --- |
| `☂ Chuva` | Clima (a "previsão"): `☀ Limpo` < 25%, `☁ Nublado` ≥ 25%, `☂ Chuva` ≥ 50%, `↯ Tempestade` ≥ 75%, `! Compacta logo` ≥ 90% |
| `12 MB` | Tamanho em MB do contexto/anexos (mensagens enviadas à API), colorido pelo mesmo clima. O limite de referência é 32 MB |
| `134k / 1m` | Tokens usados / janela de contexto |
| `▁▂▃…` | Gráfico dos últimos 12 turnos |
| `+98k no último turno` | Quanto o contexto cresceu no último turno |

O clima usa o maior valor entre a porcentagem de tokens e a porcentagem de MB. A porcentagem do contexto não é repetida nesta linha, pois já aparece na linha de contexto do HUD.

O tamanho em MB é recalculado ao fim de cada turno.

### Linhas do HUD

- Modelo, projeto, git (ou jj), contexto, uso (5 horas e 7 dias) e duração.
- Ferramentas em execução, agentes e todos.
- Previsão de quando o limite de uso esgota, se isso ocorrer antes do reset.
- Gasto do dia contra o orçamento, histórico de 7 dias e sequência de dias de uso.
- Resumo da tarefa em uma linha (a cada N turnos).
- Contagem regressiva para o auto-compact, aviso de cache expirado e crescimento de contexto por turno.
- Avisos de git: muitos arquivos alterados ou commits sem push.
- Alertas por toast: contexto, uso, e fim de turno longo (com som opcional).
- Temas: `classic`, `neon`, `rainbow`, `emoji`, `sakura`, `kawaii`, `mecha`, `shonen`, `tokyo-night`, `matrix`, `nerd` e `powerline` (os dois últimos precisam de Nerd Font), com mascote nos temas anime.
- Botão **HUD** no rodapé do prompt.

## Comandos

| Comando | Efeito |
| --- | --- |
| `/synapse` | Mostra ou esconde a barra |
| `/synapse on` / `/synapse off` | Mostra / esconde explicitamente |
| `/synapse detail` | Abre ou fecha o painel de detalhes (tempo por ferramenta, últimos turnos, agentes, todos, gasto) |
| `/synapse theme` | Pergunta o tema |
| `/synapse theme <nome>` / `next` / `reset` | Troca o tema, passa ao próximo ou volta ao padrão |

O comando era `/hud` no plugin original.

## Configuração (`userConfig`)

| Opção | Padrão | Descrição |
| --- | --- | --- |
| `enabled` | `true` | Linha do synapse (clima, MB, tokens, gráfico, variação) |
| `visible` | `true` | Mostra o HUD |
| `footerButton` | `true` | Botão HUD no rodapé |
| `position` | `above` | `above` (acima do prompt) ou `below` (abaixo) |
| `theme` | `classic` | Tema |
| `showMascot` | `true` | Mascote dos temas anime |
| `extraCmd` | vazio | Comando de shell cuja saída vira um rótulo (exige `CLAUDE_HUD_ALLOW_EXTRA_CMD=1`) |
| `debug` | `false` | Registra a ferramenta `mcp__synapse-rate-limit__synapse_debug` |
| `notifyAfterSeconds` | `0` | Toast quando um turno dura pelo menos isso; `0` desliga |
| `notifySound` | `true` | Som junto com o toast de fim de turno (macOS) |
| `contextAlerts` | vazio | Percentuais de contexto que disparam toast, ex.: `80,90` |
| `usageAlerts` | vazio | Percentuais dos limites de 5h/7d que disparam toast |
| `showForecast` | `true` | Previsão de esgotamento do limite de uso |
| `dailyBudgetUsd` | `0` | Orçamento diário em USD; `0` desliga |
| `showHistory` | `false` | Sparkline do gasto dos últimos 7 dias |
| `summaryEveryTurns` | `5` | Resumo da tarefa a cada N turnos; `0` desliga |
| `compactWarnPercent` | `60` | Mostra os tokens restantes até o auto-compact a partir deste percentual; `0` desliga |
| `coldCacheTokens` | `20000` | Aviso de cache expirado a partir deste tamanho de contexto; `0` desliga |
| `turnGrowthTokens` | `20000` | Mostra o crescimento do contexto quando um turno passa deste valor; `0` desliga |
| `gitDirtyWarn` | `20` | Aviso de arquivos alterados e não commitados; `0` desliga |
| `gitAheadWarn` | `5` | Aviso de commits não enviados; `0` desliga |
| `showAgents` | `false` | Linhas de subagentes (o Claude Code já lista os em execução) |

## Estrutura

```
.claude-plugin/plugin.json      manifesto e userConfig
hooks/register.tsx              liga os eventos do Claude Code ao HUD
hooks/synapse-row.ts            monta a linha do synapse
hooks/synapse-format.ts         clima, formatação de MB/tokens, gráfico
hooks/hud/                      código do claude-hud (renderização das linhas)
types/index.d.ts                contrato do estado (`$.state`)
tests/synapse.test.tsx          testes do HUD adaptado
hooks/synapse-format.test.ts    testes da formatação
```

## Desenvolvimento

```bash
claude plugin validate .
claude plugin test .
claude --plugin-dir /caminho/para/synapse-rate-limit
```

## Diferenças em relação ao `hud` original

- Comando `/synapse` no lugar de `/hud`; ferramenta de debug `synapse_debug`.
- Estado e chaves de configuração sob o nome `synapse-rate-limit`, sem conflito com o `hud`.
- Linha extra do synapse e opção `enabled`.

## Licença

O código em `hooks/hud/` e a base do HUD vêm do claude-hud, sob MIT (ver `LICENSE.claude-hud`).
