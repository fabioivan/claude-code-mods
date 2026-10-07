# synapse-rate-limit: um HUD para o Claude Code com clima e MB do contexto

Mod do Claude Code que reúne, em uma barra acima (ou abaixo) do prompt, o que importa de relance: modelo, projeto, git, contexto, uso, ferramentas, subagentes e todos. Além disso traz alertas, previsão de esgotamento do limite, orçamento diário, resumo da tarefa em uma linha, um painel de detalhes e doze temas que você troca ao vivo.

A base é o mod [`hud`](https://github.com/hoobnn/hoobnn-agent-mods/tree/main/claude-code/hud) (hoobnn), que por sua vez reconstrói o [claude-hud](https://github.com/jarrodwatts/claude-hud) 0.10.0 (Jarrod Watts) como mod do Claude Code. O que este plugin acrescenta é a **linha do synapse**.

![synapse-rate-limit, tema neon](assets/themes/neon.png)

> Não use junto com o plugin `hud` original: as duas barras apareceriam ao mesmo tempo. Desabilite o `hud`.

## Linha do synapse (o que este plugin acrescenta)

A última linha da barra mostra o clima do contexto, o tamanho em MB do que é enviado ao modelo e como o contexto vem crescendo:

```
☂ Chuva  12 MB  134k / 1m  ▁▂▂▃▃▄▅  +98k no último turno
```

| Trecho | Significado |
| --- | --- |
| `☂ Chuva` | Clima (a "previsão"): `☀ Limpo` abaixo de 25%, `☁ Nublado` a partir de 25%, `☂ Chuva` a partir de 50%, `↯ Tempestade` a partir de 75% e `! Compacta logo` a partir de 90% |
| `12 MB` | Tamanho em MB do contexto e dos anexos (as mensagens enviadas à API), colorido pelo mesmo clima. A referência é o limite de 32 MB |
| `134k / 1m` | Tokens usados / janela de contexto |
| `▁▂▃…` | Gráfico dos últimos 12 turnos |
| `+98k no último turno` | Quanto o contexto cresceu no último turno |

- O clima usa o maior valor entre a porcentagem de tokens e a porcentagem de MB, então pode mudar por causa dos anexos mesmo com poucos tokens.
- A porcentagem do contexto não se repete aqui, pois a linha de contexto do HUD já a mostra.
- O tamanho em MB é recalculado ao fim de cada turno.
- Quando o HUD está acima do prompt, uma linha em branco separa a barra do chat.
- A opção `enabled` liga e desliga só esta linha. Os textos dela são sempre em português; o resto do HUD segue o idioma configurado (veja [Configuração](#configuração)).

## O que vem do HUD

- **Tudo o que o claude-hud mostra**: modelo e esforço, projeto e branch do git com as alterações, medidores de contexto e de uso, ferramentas em execução, subagentes e todos.
- **Avisos antes de bater na parede**: toasts nos níveis de contexto e de cota que você escolher; quando um limite esgota no ritmo atual; limites semanais por modelo, como o do Fable; os tokens restantes até a compactação automática; o que a próxima mensagem recacheia quando o cache do prompt expirou; um turno que fez o contexto crescer muito (e quanto, ao lado dos turnos recentes); e muitas alterações sem commit ou commits sem push.
- **Gasto**: o gasto de hoje contra um orçamento diário e os últimos 7 dias em sparkline.
- **Resumo da tarefa em uma linha** e `/synapse detail`, com tempo por ferramenta, custo e crescimento de contexto dos últimos turnos, subagentes e todos.
- **Doze temas**: neon, rainbow, emoji, temas anime com mascote kaomoji (sakura, kawaii, mecha, shonen), Tokyo Night, Matrix, Nerd Font e powerline.
- **Toast de fim de turno** (com som opcional no macOS) para turnos longos, e o estado do Remote Control com os clientes conectados.

## Instalação

```
/plugin marketplace add fabioivan/claude-code-mods
/plugin install synapse-rate-limit@fabioivan-mods
/reload-plugins
```

Ou, pela linha de comando:

```sh
claude plugin marketplace add fabioivan/claude-code-mods
claude plugin install synapse-rate-limit@fabioivan-mods
```

O plugin lê os arquivos de configuração do próprio claude-hud, então uma configuração existente dele continua valendo. `/synapse` mostra ou esconde a barra e `/synapse theme` escolhe o tema.

## Comandos

| Comando | Efeito |
| --- | --- |
| `/synapse` | Mostra ou esconde a barra |
| `/synapse on` / `/synapse off` | Mostra / esconde explicitamente |
| `/synapse detail` | Abre ou fecha o painel de detalhes: chamadas, tempo total e médio e falhas de cada ferramenta; os últimos 8 turnos com tempo, custo e crescimento de contexto; subagentes; todos; gasto de hoje e da semana |
| `/synapse theme` | Pergunta o tema |
| `/synapse theme <nome>` / `next` / `reset` | Troca o tema, passa ao próximo ou volta ao `classic` |

O comando era `/hud` no plugin original. `/synapse` também funciona no meio de um turno, e o botão **HUD** no rodapé do prompt faz o mesmo que `/synapse` sozinho.

## Configuração

**Idioma.** O `language` do próprio claude-hud (`en`, `zh-Hans`, `zh-Hant`, `ja`, `ko`, `es`, `fr`, `de`, `pt-BR`, `ru`) define o idioma de todo o HUD, inclusive do que o mod acrescenta (alertas, linha de extras, painel de detalhes, `/synapse`, resumo da tarefa). O padrão é `en`; para português, use `pt-BR`. A linha do synapse não depende disso.

**Arquivos do claude-hud.** `~/.claude/plugins/claude-hud/config.json` e `~/.claude/claude-hud.json`.

**Opções do mod** (`/config`, ou `pluginConfigs.synapse-rate-limit.options` no settings):

| Opção | Padrão | Descrição |
| --- | --- | --- |
| `enabled` | `true` | Linha do synapse (clima, MB, tokens, gráfico, variação) |
| `visible` | `true` | Mostra o HUD. `/synapse`, `/synapse on`, `/synapse off` e o botão do rodapé alteram a opção, que é mantida entre sessões |
| `footerButton` | `true` | Botão **HUD** no rodapé do prompt |
| `position` | `above` | `above` (faixa acima do prompt) ou `below` (abaixo, ao lado da linha de dicas, onde ficava a statusline) |
| `theme` | `classic` | Tema (veja abaixo) |
| `showMascot` | `true` | Mascote dos temas anime |
| `extraCmd` | vazio | `--extra-cmd` do claude-hud: comando de shell cuja saída vira um rótulo (exige `CLAUDE_HUD_ALLOW_EXTRA_CMD=1`) |
| `debug` | `false` | Registra a ferramenta `mcp__synapse-rate-limit__synapse_debug` |
| `notifyAfterSeconds` | `0` | Toast quando um turno dura pelo menos isso; `0` desliga |
| `notifySound` | `true` | Som junto com o toast de fim de turno (macOS) |
| `contextAlerts` | vazio | Percentuais de contexto que disparam toast, ex.: `80,90` |
| `usageAlerts` | vazio | Percentuais dos limites de 5h, 7d ou semanal por modelo que disparam toast |
| `showForecast` | `true` | Previsão de esgotamento do limite de uso |
| `dailyBudgetUsd` | `0` | Orçamento diário em USD; `0` desliga |
| `showHistory` | `false` | Sparkline do gasto dos últimos 7 dias e sequência de dias de uso |
| `summaryEveryTurns` | `5` | Resumo da tarefa a cada N turnos; `0` desliga |
| `compactWarnPercent` | `60` | Mostra os tokens restantes até a compactação a partir deste percentual; `0` desliga |
| `coldCacheTokens` | `20000` | Aviso de cache expirado a partir deste tamanho de contexto; `0` desliga |
| `turnGrowthTokens` | `20000` | Mostra o crescimento do contexto quando um turno passa deste valor; `0` desliga |
| `gitDirtyWarn` | `20` | Aviso de arquivos alterados e não commitados; `0` desliga |
| `gitAheadWarn` | `5` | Aviso de commits não enviados; `0` desliga |
| `showAgents` | `false` | Linhas de subagentes (o Claude Code já lista os em execução, com tempo e tokens; o painel de detalhes continua listando) |

## Temas

`theme` (em `/config`, padrão `classic`: o visual original do claude-hud) ou `/synapse theme <nome>` ao vivo. Sem argumento, `/synapse theme` pergunta em um diálogo (oferece os quatro seguintes; qualquer outro vai em Other; se for dispensado, ou sob `-p`, lista todos com uma amostra). `next` percorre os temas e `reset` volta ao `classic`. O comando grava a opção `theme`, então `/config` a mostra e ela vale nas próximas sessões.

| Tema | Visual |
| --- | --- |
| `classic` | claude-hud como vem de fábrica |
| `neon` | cyberpunk: truecolor neon, `⬢ ◆ ◈ ⚡`, barras `▰▱`, separadores ` ❯ ` |
| `rainbow` | um matiz por elemento, células de barra preenchidas e o nome do modelo em degradê |
| `emoji` | `🤖 📂 🌿 🧠 ⚡ 📅 ⏳ ✅` |
| `sakura` | rosa pastel, `🌸 🎀 🍡 💗`, barras `✿`, mascote kaomoji `(◕‿◕)♡` |
| `kawaii` | pastel, `「Opus」`, barras `●○`, mascote gato `ฅ^•ω•^ฅ` |
| `mecha` | roxo, verde e laranja, `UNIT·Opus◤`, medidores `SYNC` / `PWR`, mascote robô `[•_•]` |
| `shonen` | vermelho, laranja e dourado, `🔥 ⭐ 🍥 💥`, barras em degradê, mascote `(ง •̀_•́)ง` |
| `tokyo-night` | a paleta Tokyo Night, glifos discretos |
| `matrix` | verde sobre preto, barras `▮▯`, separadores ` ┊ ` |
| `nerd` | símbolos Nerd Font (exige uma Nerd Font) |
| `powerline` | símbolos Nerd Font em segmentos powerline (exige uma Nerd Font) |

Todos os temas na mesma sessão de exemplo: [assets/themes/gallery.png](assets/themes/gallery.png); uma imagem por tema em `assets/themes/<tema>.png`.

- **Paleta**: as cores do tema entram por cima das `colors` do claude-hud; uma cor definida na configuração do próprio claude-hud (diferente do padrão) é mantida.
- **Mascote** (`showMascot`, ligado): os temas anime põem um rosto no início da linha de extras: calmo, ocupado enquanto uma ferramenta roda, preocupado a partir de 70% de contexto (ou 90% de cota), em pânico a partir de 85% e nocauteado quando um limite é atingido.
- **Largura**: os glifos são desenhados pelo claude-hud, que mede a largura deles ao quebrar linhas; os separadores não são mais largos que ` │ `; o powerline soma 2 células a cada linha. Os emojis usados são só os de apresentação padrão (sem U+FE0F).
- **Limite conhecido**: o claude-hud mantém um selo `[Modelo | Provedor]` (Bedrock, Vertex) inteiro pelo `[` inicial; os temas que tiram os colchetes perdem isso, então em largura estreita esse selo pode quebrar em ` | `.

## Valores derivados em vez de informados

A stdin da statusline do Claude Code traz estes campos; a API de mods não, então o mod os calcula:

- `prompt_cache`: o relógio recomeça na última requisição da thread principal (de `turn.step`, ou da última resposta da thread principal no transcript) e corre pelo TTL que a última escrita no cache usou (`1h` se escreveu no nível de 1 hora, senão `5m`). O `hit_ratio` é a entrada lida do cache sobre toda a entrada da thread principal, na sessão.
- `model_scoped` (limites semanais por modelo, como o do Fable): vêm do cache do próprio Claude Code para o endpoint de uso, `cachedUsageUtilization` em `.claude.json` (relido só quando o arquivo muda, e ignorado depois de uma hora, como o leitor do Claude Code). Nenhuma requisição é feita.
- `session_name`: o título de `/rename` do transcript, senão o título gerado, senão o slug.
- `workspace.repo`: extraído da URL do remote em `$.session.repo()`.
- `output_style`: `outputStyle` das configurações.
- Antes da primeira requisição ao modelo na sessão, `current_usage` é o total de contexto do engine, sem cache, e o esforço é o `effortLevel` das configurações; ambos chegam com o primeiro `turn.step` e ficam no estado da sessão entre recargas.
- `total_api_duration_ms` conta as requisições vistas desde que o mod foi habilitado na sessão.

## Acréscimos do HUD sobre o claude-hud

- **Remote Control**: ` │ ⇄ Controle remoto` ao fim da primeira linha enquanto o Remote Control da sessão está ligado, com link para a sessão no claude.ai, seguido dos clientes conectados por superfície (`conectado: celular · web/desktop×2`). O app do Claude e o claude.ai não disparam `session.attach`, então um prompt ou comando que chega pelo Remote Control marca `conectado` até a ponte mudar. A ponte fica em `~/.claude/sessions/<pid>.json` e é lida a cada 3 s; a barra é redesenhada quando muda.
- **Linha de extras**: anexada à última linha do claude-hud quando cabe na largura, senão em uma linha própria abaixo. Partes que não cabem saem: primeiro o mascote do tema, depois o sparkline de 7 dias e por último o aviso `⚠` do git. Cada parte só aparece quando tem algo a dizer:
  - `✎` a tarefa em uma linha: um `$.model.fork` da conversa (servido do cache do prompt) após o primeiro turno e a cada `summaryEveryTurns` turnos (padrão 5; 0 desliga). É pulado enquanto o transcript tiver uma lista de tarefas com trabalho pendente (a lista já diz o que o modelo faz), e uma linha antiga sai de cena nesse meio-tempo.
  - **Previsão de uso** (`showForecast`): quando o limite de 5 horas, de 7 dias ou semanal por modelo esgota, se isso acontecer antes do reset. O de 5 horas segue o ritmo da última hora, depois que a sessão tem dez minutos de leituras; os semanais seguem o ritmo desde o início da janela.
  - **Tokens até a compactação** (`42k até a compactação`), quando o contexto chega a `compactWarnPercent` do caminho (padrão 60; 0 desliga). O limite é o do próprio Claude Code (`$.session.usage({ breakdown: 'summary' })`), relido quando a janela de contexto muda.
  - **Cache expirado** (`cache frio: a próxima mensagem recacheia 120k`): quando um cache que a sessão usou expirou, o contexto que a próxima mensagem escreve de novo, se for pelo menos `coldCacheTokens` (padrão 20000; 0 desliga).
  - **Crescimento do contexto** (`último turno +98k ▂▁█`): quando o último turno aumentou o contexto em pelo menos `turnGrowthTokens` (padrão 20000; 0 desliga), de quanto, e um sparkline do crescimento dos últimos 8 turnos (uma compactação conta como nenhum), para destacar o turno que encheu a janela.
  - **Gasto de hoje** entre sessões contra `dailyBudgetUsd` (0 desliga), a partir do livro de custos diários do claude-hud; amarelo a partir de 80%, vermelho acima.
  - **Gasto dos últimos 7 dias** em sparkline e a sequência de dias de uso (`showHistory`, desligado por padrão); o gasto fica no armazenamento do mod por 60 dias de qualquer forma.
  - `⚠` caminhos não commitados a partir de `gitDirtyWarn` (padrão 20) e commits não enviados a partir de `gitAheadWarn` (padrão 5); 0 desliga cada um.
- **Alertas** (desligados por padrão): um toast quando o contexto atinge cada valor de `contextAlerts` (ex.: `80,90`) e quando o limite de 5 horas, de 7 dias ou semanal por modelo atinge cada valor de `usageAlerts`. Vale uma vez por limiar, e só dispara de novo depois que o medidor cai 5 pontos abaixo dele (um `/compact`, um reset).
- **Fim de turno**: um turno da thread principal que durou `notifyAfterSeconds` ou mais (padrão 0, desligado; ex.: 60) termina com um toast e, com `notifySound`, um som curto (macOS).
- **Linhas de subagentes**: desligadas por padrão (`showAgents`).
- **Redesenho do prompt**: logo após uma compactação e após `/model` (mostrando o novo modelo antes do primeiro passo).
- **Ajustes visuais sobre o claude-hud**: os separadores ` │ ` e ` | ` ficam esmaecidos; o arquivo de uma ferramenta em execução aparece relativo ao diretório da sessão (`◐ Read src/a.ts`); a duração da sessão é `⏱ 12m` e o cache do prompt é mostrado sem o `⏱️` de largura de emoji.

## Não trazido do claude-hud

- Links OSC 8 `file://` (o caminho do projeto): um `Link` só aceita https, então o texto fica e o link some. Links https (a branch no GitHub) continuam clicáveis.
- `worktree` (nome, caminho e branch de uma sessão `--worktree`): não existe na API de mods.

## Diferenças em relação ao `hud` original

- Comando `/synapse` no lugar de `/hud`; ferramenta de debug `synapse_debug`.
- Estado e chaves de configuração sob o nome `synapse-rate-limit`, sem conflito com o `hud`.
- Linha extra do synapse (clima, MB, tokens, gráfico e variação) e a opção `enabled`.
- Espaço em branco entre o chat e a barra, quando ela fica acima do prompt.
- Os caches continuam em `plugins/claude-hud-mod`, o mesmo diretório do `hud` original, então os dois compartilham o livro de custos diários.

## Desenvolvimento

```sh
claude plugin validate .
claude plugin test .
claude --plugin-dir /caminho/para/synapse-rate-limit
```

### Estrutura

- `hooks/register.tsx`: os hooks e tudo o que chama `$` (o engine só segue `$` dentro deste arquivo): o início da sessão, os eventos do turno, `/synapse`, o laço de atualização, alertas, gasto, resumo e os hooks de renderização. Os outros módulos recebem closures sobre `$` (`Io`, `SessionApi`).
- `hooks/synapse-row.ts`: monta a linha do synapse.
- `hooks/synapse-format.ts`: clima, formatação de MB e tokens, gráfico.
- `hooks/config.ts`: as opções do mod, lidas uma vez em um `Config` tipado.
- `hooks/stdin.ts`: monta a stdin da statusline que o claude-hud espera a partir da sessão (uso, configurações, repositório, passos do turno) e do transcript; os fatos do host que o claude-hud lê (env, plataforma, memória).
- `hooks/render.ts`: uma passada: as linhas do claude-hud, o rótulo do Remote Control, o gasto de hoje; as contagens do git para o aviso.
- `hooks/remote.ts`: a ponte do Remote Control (de `sessions/<pid>.json`) e seu rótulo.
- `hooks/summary.ts`: a resposta do resumo da tarefa, reduzida a uma linha.
- `hooks/draw.tsx`: as linhas (acima ou abaixo do prompt) e o painel `/synapse detail`, sobre os elementos que um hook de renderização resolveu.
- `hooks/live.ts`: o que o módulo guarda entre passadas fora de `$.state` e o tema em uso.
- `hooks/kit/`: leitores de opções e escritas em `/config`.
- `hooks/transcript-feed.ts`: lê o transcript uma vez e de forma incremental (só as linhas novas) para o mod todo.
- `hooks/hud/`: o `src/` do claude-hud (MIT, ver `LICENSE.claude-hud`), mantido perto do original, com alterações locais: `main(source)` recebe a stdin do mod; as linhas vão para um sink em vez de `console.log`; sete locales extras (`ja`, `ko`, `es`, `fr`, `de`, `pt-BR`, `ru`); `setConfigPatch` aplica as opções do mod por cima da configuração; o git roda por `$.process.run`; e `render/theme.ts` leva os glifos dos temas.
- `hooks/shims/`: as APIs do Node que o claude-hud importa, sobre `$`.
- `hooks/ansi.ts`, `hooks/i18n.ts`, `hooks/themes.ts`, `hooks/extras.ts`: escapes SGR em spans estilizados, as strings do mod em todos os idiomas, os temas e os auxiliares do que o mod acrescenta.

### Atualizando a partir do original

Copie o novo `src/` do claude-hud sobre `hooks/hud/` (sem `windows-git-worker.ts`), reaponte os imports `node:*` para `../shims/*.js` (`node:fs/promises` em `fs_promises.js`), reaplique as alterações listadas acima (passe qualquer glifo novo por `render/theme.ts`) e rode `claude plugin validate .` e `claude plugin test .`.

## Licença

MIT. O código em `hooks/hud/` vem do claude-hud (Jarrod Watts), também sob MIT: ver `LICENSE.claude-hud`. A conversão para mod é do [`hud`](https://github.com/hoobnn/hoobnn-agent-mods/tree/main/claude-code/hud) (hoobnn).
