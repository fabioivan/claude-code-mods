# synapse-rate-limit: a Claude Code HUD with weather and context size in MB

[Português](README.pt-BR.md) · **English**

A Claude Code mod that gathers, in a bar above (or below) the prompt, what matters at a glance: model, project, git, context, usage, tools, subagents and todos. On top of that it adds alerts, a usage forecast, a daily budget, a one-line task summary, a detail pane and twelve themes you switch live.

It is based on the [`hud`](https://github.com/hoobnn/hoobnn-agent-mods/tree/main/claude-code/hud) mod (hoobnn), which rebuilds [claude-hud](https://github.com/jarrodwatts/claude-hud) 0.10.0 (Jarrod Watts) as a Claude Code mod. What this plugin adds is the **synapse line**.

![synapse-rate-limit, neon theme](assets/themes/neon.png)

> Do not use it together with the original `hud` plugin: both bars would show at once. Disable `hud`.

## The synapse line (what this plugin adds)

The last line of the bar shows the context's weather and the size in MB of what is sent to the model, and how the context has been evolving:

```
☂ Rain   12 MB  134k / 1m  ▁▂▂▃▃▄▅      (en)
☂ Chuva  12 MB  134k / 1m  ▁▂▂▃▃▄▅      (pt-BR)
```

| Part | Meaning |
| --- | --- |
| `☂ Rain` | Weather (the "forecast"): `☀ Clear` below 25%, `☁ Cloudy` from 25%, `☂ Rain` from 50%, `↯ Storm` from 75% and `! Compact soon` from 90% |
| `12 MB` | Size in MB of the context and attachments (the messages sent to the API), colored by the same weather. The reference is the 32 MB limit |
| `134k / 1m` | Tokens used / context window |
| `▁▂▃…` | Chart of the last 12 turns |

- The weather uses the larger of the token percentage and the MB percentage, so it can change because of attachments even with few tokens.
- The context percentage is not repeated here, as the HUD's context line already shows it. Neither is the last turn's growth, which the HUD's extras row shows (`turnGrowthTokens`).
- The size in MB is recomputed at the end of each turn.
- With the HUD above the prompt, a blank line separates the bar from the chat.
- The `enabled` option turns only this line on and off. It follows the HUD's language (see [Language](#language)): Portuguese for `pt-BR` and English otherwise.

## What comes from the HUD

- **Everything claude-hud shows**: model and effort, project and git branch with its changes, context and usage gauges, the running tools, subagents and todos.
- **Warnings before you hit a wall**: toasts at the context and quota levels you pick, when a limit runs out at the current pace, per-model weekly limits such as Fable's, the tokens left before auto-compaction, what the next message re-caches once the prompt cache has expired, a turn that grew the context a lot (by how much, beside the recent turns), and too many uncommitted changes or unpushed commits.
- **Spend**: today's spend against a daily budget, and the last 7 days as a sparkline.
- **A one-line task summary**, and `/synapse detail` for per-tool times, the last turns' cost and context growth, subagents and todos.
- **Twelve themes**: neon, rainbow, emoji, anime themes with a kaomoji mascot (sakura, kawaii, mecha, shonen), Tokyo Night, Matrix, Nerd Font and powerline.
- **Turn-done toast** (with an optional chime on macOS) for long turns, and the Remote Control state with the clients attached.

## Install

```
/plugin marketplace add fabioivan/claude-code-mods
/plugin install synapse-rate-limit@fabioivan-mods
/reload-plugins
```

Or from the command line:

```sh
claude plugin marketplace add fabioivan/claude-code-mods
claude plugin install synapse-rate-limit@fabioivan-mods
```

It reads claude-hud's own config files, so an existing claude-hud setup carries over. `/synapse` toggles the bar and `/synapse theme` picks a theme.

## Commands

| Command | Effect |
| --- | --- |
| `/synapse` | Shows or hides the bar |
| `/synapse on` / `/synapse off` | Shows / hides it explicitly |
| `/synapse detail` | Opens or closes the detail pane: each tool's calls, total and average time and failures; the last 8 turns with their time, cost and context growth; subagents; todos; today's and the week's spend |
| `/synapse theme` | Asks which theme |
| `/synapse theme <name>` / `next` / `reset` | Switches the theme, cycles to the next, or goes back to `classic` |

The command was `/hud` in the original plugin. `/synapse` runs mid-turn too, and the **HUD** button in the prompt footer does what `/synapse` alone does.

## Configuration

**claude-hud's files.** `~/.claude/plugins/claude-hud/config.json` and `~/.claude/claude-hud.json`.

**Mod options** (`/config`, or `pluginConfigs.synapse-rate-limit.options` in settings):

| Option | Default | Description |
| --- | --- | --- |
| `language` | `auto` | The HUD's language: `auto` (Claude Code's), `en` or `pt-BR` (see [Language](#language)) |
| `enabled` | `true` | The synapse line (weather, MB, tokens, chart) |
| `visible` | `true` | Show the HUD. `/synapse`, `/synapse on`, `/synapse off` and the footer button change the option, which is kept across sessions |
| `footerButton` | `true` | The **HUD** button in the prompt footer |
| `position` | `above` | `above` (a band above the prompt) or `below` (beside the hint line, where the statusline sat) |
| `theme` | `classic` | Theme (see below) |
| `showMascot` | `true` | The anime themes' mascot |
| `extraCmd` | empty | claude-hud's `--extra-cmd`: a shell command whose output becomes a label (needs `CLAUDE_HUD_ALLOW_EXTRA_CMD=1`) |
| `debug` | `false` | Registers the `mcp__synapse-rate-limit__synapse_debug` tool |
| `notifyAfterSeconds` | `0` | Toast when a turn runs at least this long; `0` turns it off |
| `notifySound` | `true` | A chime with the turn-done toast (macOS) |
| `contextAlerts` | empty | Context percentages that raise a toast, e.g. `80,90` |
| `usageAlerts` | empty | Percentages of the 5-hour, 7-day or model-scoped weekly limits that raise a toast |
| `showForecast` | `true` | Forecast of when a usage limit runs out |
| `dailyBudgetUsd` | `0` | Daily budget in USD; `0` turns it off |
| `showHistory` | `false` | The last 7 days' spend as a sparkline, with the streak of days in use |
| `summaryEveryTurns` | `5` | Summarize the task every N turns; `0` turns it off |
| `compactWarnPercent` | `60` | Show the tokens left before auto-compaction from this percent; `0` turns it off |
| `coldCacheTokens` | `20000` | Expired-cache warning from this context size; `0` turns it off |
| `turnGrowthTokens` | `20000` | Show the context growth when a turn grows it by at least this much; `0` turns it off |
| `gitDirtyWarn` | `20` | Warn on this many changed, uncommitted paths; `0` turns it off |
| `gitAheadWarn` | `5` | Warn on this many unpushed commits; `0` turns it off |
| `showAgents` | `false` | Subagent lines (Claude Code already lists running subagents, with their time and tokens; the detail pane still lists them) |

## Language

One language applies to the whole HUD: claude-hud's lines, what the mod adds (alerts, the extras row, the detail pane, `/synapse` messages, the task summary) and the synapse line. The `language` option picks it:

| Value | Effect |
| --- | --- |
| `auto` (default) | Follows Claude Code's own language (`language` in `settings.json`): `Portugues`, `português`, `pt-BR` or `Brazilian Portuguese` give Portuguese; `English` or `en` give English. Any other language, or none, falls back to claude-hud's `language` |
| `en` | English |
| `pt-BR` | Brazilian Portuguese |

- `settings.json` is read again on each refresh of the bar, so changing Claude Code's language changes the HUD without a restart.
- As the last resort under `auto`, claude-hud's `language` (`en`, `zh-Hans`, `zh-Hant`, `ja`, `ko`, `es`, `fr`, `de`, `pt-BR`, `ru`) still applies to the HUD. The synapse line only has Portuguese and English text, and uses English for the other languages.
- The options' names and descriptions (in `/config`) and the `/synapse` command's description stay fixed: a plugin's manifest is not translated.

## Themes

`theme` (in `/config`, default `classic`: claude-hud's own look) or `/synapse theme <name>` live. `/synapse theme` alone asks which in a dialog (the next four offered, any other typed under Other; dismissed, or under `-p`, it lists them with a sample), `/synapse theme next` cycles, `/synapse theme reset` goes back to `classic`. The command writes the `theme` option, so `/config` shows it and it is kept across sessions.

| Theme | Look |
| --- | --- |
| `classic` | claude-hud as it ships |
| `neon` | cyberpunk: neon truecolor, `⬢ ◆ ◈ ⚡`, `▰▱` bars, ` ❯ ` separators |
| `rainbow` | a hue per element, filled bar cells and the model name along a rainbow gradient |
| `emoji` | `🤖 📂 🌿 🧠 ⚡ 📅 ⏳ ✅` |
| `sakura` | pastel pink, `🌸 🎀 🍡 💗`, `✿` bars, a kaomoji mascot `(◕‿◕)♡` |
| `kawaii` | pastel, `「Opus」`, `●○` bars, a cat mascot `ฅ^•ω•^ฅ` |
| `mecha` | purple, green and orange, `UNIT·Opus◤`, `SYNC` / `PWR` gauges, a robot mascot `[•_•]` |
| `shonen` | red-orange-gold, `🔥 ⭐ 🍥 💥`, gradient bars, a mascot `(ง •̀_•́)ง` |
| `tokyo-night` | the Tokyo Night palette, quiet glyphs |
| `matrix` | green on black, `▮▯` bars, ` ┊ ` separators |
| `nerd` | Nerd Font symbols (needs a Nerd Font) |
| `powerline` | Nerd Font symbols on powerline segments (needs a Nerd Font) |

Every theme on the same sample session: [assets/themes/gallery.png](assets/themes/gallery.png); one still per theme in `assets/themes/<theme>.png`.

- **Palette**: the theme's colors go over claude-hud's `colors`; a color set in claude-hud's own config (off its default) stays.
- **Mascot** (`showMascot`, on): the anime themes put a face first in the extras row: calm, busy while a tool runs, worried from 70% context (or 90% quota), panicking from 85%, knocked out when a limit is reached.
- **Width**: glyphs are drawn by claude-hud, so its wrapping measures them; separators are no wider than ` │ `; powerline adds 2 cells to a row. Emoji are default-presentation ones only (no U+FE0F).
- **Known limit**: claude-hud keeps a `[Model | Provider]` badge (Bedrock, Vertex) whole by its leading `[`; themes that drop the brackets lose that, so at a narrow width such a badge can wrap at ` | `.

## Derived rather than reported

Claude Code's statusline stdin carries these; the mod API does not, so the mod works them out:

- `prompt_cache`: the clock restarts at the last main-thread request (from `turn.step`, else the last main-thread response in the transcript) and runs for the TTL the last cache write used (`1h` when it wrote the 1-hour tier, else `5m`). `hit_ratio` is cache-read input over all main-thread input, across the session.
- `model_scoped` (the model-scoped weekly limits, such as Fable's): they come from Claude Code's own cache of its usage endpoint, `cachedUsageUtilization` in `.claude.json` (read again only when the file changes, nothing once it is over an hour old, as Claude Code's own reader). No request is made.
- `session_name`: the transcript's `/rename` title, else its generated title, else its slug.
- `workspace.repo`: parsed from `$.session.repo()`'s remote URL.
- `output_style`: `outputStyle` from settings.
- Before the session's first model request, `current_usage` is the engine's context total, uncached, and the effort is `effortLevel` from settings; both arrive with the first `turn.step` and are kept in session state across reloads.
- `total_api_duration_ms` counts the requests seen since the mod was enabled in the session.

## Added by the HUD over claude-hud

- **Remote Control**: ` │ ⇄ Remote Control` at the end of the first line while the session's Remote Control is on, linked to the session on claude.ai, then the attached clients by surface (`connected: phone · web/desktop×2`). The Claude app and claude.ai raise no `session.attach`, so a prompt or command arriving over Remote Control marks `connected` until the bridge changes. The bridge is in `~/.claude/sessions/<pid>.json` and is read every 3 s; the bar is redrawn on a change.
- **An extras row**: appended to claude-hud's last line when both fit the width, else a line of its own under it; parts that do not fit leave it, a theme's mascot first, then the 7-day sparkline, and the `⚠` git warning last. Each part shows only when it has something to say:
  - `✎` the task in one line: a `$.model.fork` of the conversation (served from the prompt cache) after the first turn and every `summaryEveryTurns` turns (default 5; 0 off). Skipped while the transcript holds a task list with work left (the list already says what the model is doing), and an older line steps aside meanwhile.
  - **Usage forecast** (`showForecast`): when the 5-hour, 7-day or a model-scoped weekly limit runs out, if that comes before it resets: the 5-hour limit at the last hour's pace once the session has ten minutes of readings, the weekly ones at the rate since their window began.
  - **Tokens left before auto-compaction** (`42k to auto-compact`), once the context is `compactWarnPercent` of the way there (default 60; 0 off). The threshold is Claude Code's own (`$.session.usage({ breakdown: 'summary' })`), read again when the context window changes.
  - **Expired prompt cache** (`cache cold: next message re-caches 120k`): once a cache the session used has expired, the context the next message writes to it again, when that is at least `coldCacheTokens` (default 20000; 0 off).
  - **Context growth** (`last turn +98k ▂▁█`): when the last turn grew the context by at least `turnGrowthTokens` (default 20000; 0 off), by how much, then a sparkline of the last 8 turns' growth (a compaction counts as none), so the turn that filled the window stands out.
  - **Today's spend** across sessions against `dailyBudgetUsd` (0 off), from claude-hud's daily-cost ledger; yellow from 80%, red past it.
  - **The last 7 days' spend** as a sparkline and the streak of days in use (`showHistory`, off by default); the spend is kept in the mod's store for 60 days either way.
  - `⚠` uncommitted paths at or past `gitDirtyWarn` (default 20) and unpushed commits at or past `gitAheadWarn` (default 5); 0 turns either off.
- **Alerts** (off by default): a toast when context use reaches each of `contextAlerts` (e.g. `80,90`), and the 5-hour, 7-day or a model-scoped weekly limit each of `usageAlerts`; once per threshold, again only after the gauge drops 5 points below it (a `/compact`, a reset).
- **Turn done**: a turn of the main thread that ran `notifyAfterSeconds` or longer (default 0, off; e.g. 60) ends with a toast and, with `notifySound`, a short chime (macOS).
- **Subagent lines**: off by default (`showAgents`).
- **Prompt redraws**: right after a compaction, and after `/model` (showing the new model before its first step).
- **Display tweaks over claude-hud**: the ` │ ` and ` | ` separators are dimmed; a running tool's file shows relative to the session directory (`◐ Read src/a.ts`); the session duration is `⏱ 12m` and the prompt cache is shown without the emoji-width `⏱️`.

## Not carried over

- OSC 8 `file://` links (the project path): a `Link` takes https only, so the text is kept and the link dropped. https links (a GitHub branch) stay clickable.
- `worktree` (a `--worktree` session's name, path and branch): not in the mod API.

## Differences from the original `hud`

- The `/synapse` command instead of `/hud`; the debug tool is `synapse_debug`.
- State and config keys live under the `synapse-rate-limit` name, so they do not clash with `hud`.
- The extra synapse line (weather, MB, tokens and chart) and the `enabled` option.
- The `language` option (`auto`, `en`, `pt-BR`), which follows Claude Code's language.
- A blank line between the chat and the bar, when it sits above the prompt.
- Caches stay in `plugins/claude-hud-mod`, the same directory as the original `hud`, so the two share the daily-cost ledger.

## Development

```sh
claude plugin validate .
claude plugin test .
claude --plugin-dir /path/to/synapse-rate-limit
```

### Layout

- `hooks/register.tsx`: the hooks, and everything that calls `$` (the engine follows `$` only within this file): the session's start, the turn's events, `/synapse`, the refresh loop, alerts, spend and summary, and the render hooks. The other modules get closures over `$` (`Io`, `SessionApi`).
- `hooks/synapse-row.ts`: builds the synapse line.
- `hooks/synapse-format.ts`: the weather (with its English and Portuguese text), MB and token formatting, the chart.
- `hooks/language.ts`: resolves the HUD's language (the mod's option, Claude Code's language, or claude-hud's).
- `hooks/config.ts`: the mod's options, read once into a typed `Config`.
- `hooks/stdin.ts`: builds the statusline stdin claude-hud expects from the session (usage, settings, repo, turn steps) and the transcript; the host facts claude-hud reads (env, platform, memory).
- `hooks/render.ts`: one pass: claude-hud's lines, the Remote Control label, today's spend; the git counts for the warning.
- `hooks/remote.ts`: Remote Control's bridge (from `sessions/<pid>.json`) and its label.
- `hooks/summary.ts`: the task summary's reply, cleaned to one line.
- `hooks/draw.tsx`: the rows (above or below the prompt) and the `/synapse detail` pane, over the elements a render hook resolved.
- `hooks/live.ts`: what the module keeps between passes outside `$.state`, and the theme in use.
- `hooks/kit/`: option readers and `/config` writes.
- `hooks/transcript-feed.ts`: reads the transcript once and incrementally (only appended lines) for the whole mod.
- `hooks/hud/`: claude-hud's `src/` (MIT, see `LICENSE.claude-hud`), kept close to upstream, with local changes: `main(source)` takes the stdin from the mod; lines go to a sink instead of `console.log`; seven more locales (`ja`, `ko`, `es`, `fr`, `de`, `pt-BR`, `ru`); `setConfigPatch` lays the mod's options over the loaded config; git runs through `$.process.run`; and `render/theme.ts` carries the themes' glyphs.
- `hooks/shims/`: the Node APIs claude-hud imports, over `$`.
- `hooks/ansi.ts`, `hooks/i18n.ts`, `hooks/themes.ts`, `hooks/extras.ts`: SGR escapes to styled spans, the mod's own strings in every language, the themes, and the helpers for what the mod adds.

### Updating from upstream

Copy the new `src/` of claude-hud over `hooks/hud/` (minus `windows-git-worker.ts`), re-point `node:*` imports at `../shims/*.js` (`node:fs/promises` at `fs_promises.js`), re-apply the changes listed above (route any new hardcoded glyph through `render/theme.ts`), then run `claude plugin validate .` and `claude plugin test .`.

## License

MIT. The code in `hooks/hud/` comes from claude-hud (Jarrod Watts), also under MIT: see `LICENSE.claude-hud`. The conversion to a mod is by [`hud`](https://github.com/hoobnn/hoobnn-agent-mods/tree/main/claude-code/hud) (hoobnn).
