# claude-code-mods

[Português](README.pt-BR.md) · **English**

A marketplace of Claude Code mods.

## Install

```
/plugin marketplace add fabioivan/claude-code-mods
/plugin install synapse-rate-limit@fabioivan-mods
/plugin install ctx-bytes-guard@fabioivan-mods
/reload-plugins
```

## Plugins

| Plugin | Description |
| --- | --- |
| [`synapse-rate-limit`](./synapse-rate-limit) | A full HUD (based on the `hud` mod and claude-hud) with alerts, a limit forecast, a budget, a detail pane and 12 themes, plus the synapse line: weather, context/attachments size in MB, tokens and a chart of the last turns. |
| [`ctx-bytes-guard`](./ctx-bytes-guard) | Auto-compacts when the context passes 50% or the conversation payload passes 16 MB. With `synapse-rate-limit` installed, the context line shows the size and context against those limits. |

Disable the original `hud` plugin when using `synapse-rate-limit`, so the bar does not show twice.

## License

MIT (see [`LICENSE`](./LICENSE)).

`synapse-rate-limit` includes code from claude-hud, under MIT (see `synapse-rate-limit/LICENSE.claude-hud`).
