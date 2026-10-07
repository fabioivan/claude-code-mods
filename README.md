# claude-code-mods

Marketplace de mods para o Claude Code.

## Instalação

```
/plugin marketplace add fabioivan/claude-code-mods
/plugin install synapse-rate-limit@fabioivan-mods
/reload-plugins
```

## Plugins

| Plugin | Descrição |
| --- | --- |
| [`synapse-rate-limit`](./synapse-rate-limit) | HUD completo (baseado no claude-hud) mais a linha do synapse: clima, MB do contexto/anexos, tokens, gráfico dos últimos turnos e variação. |

Desabilite o plugin `hud` original ao usar o `synapse-rate-limit`, para a barra não aparecer duas vezes.

## Licença

O `synapse-rate-limit` inclui código do claude-hud, sob MIT (ver `synapse-rate-limit/LICENSE.claude-hud`).
