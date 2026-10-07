# claude-code-mods

[Português](README.pt-BR.md) · **English**

A marketplace of Claude Code mods.

## Install

```
/plugin marketplace add fabioivan/claude-code-mods
/plugin install synapse-rate-limit@fabioivan-mods
/reload-plugins
```

## Plugins

| Plugin | Description |
| --- | --- |
| [`synapse-rate-limit`](./synapse-rate-limit) | A full HUD (based on the `hud` mod and claude-hud) with alerts, a limit forecast, a budget, a detail pane and 12 themes, plus the synapse line: weather, context/attachments size in MB, tokens and a chart of the last turns. |

Disable the original `hud` plugin when using `synapse-rate-limit`, so the bar does not show twice.

## License

MIT (see [`LICENSE`](./LICENSE)).

`synapse-rate-limit` includes code from claude-hud, under MIT (see `synapse-rate-limit/LICENSE.claude-hud`).
