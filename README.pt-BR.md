# claude-code-mods

**Português** · [English](README.md)

Marketplace de mods para o Claude Code.

## Instalação

```
/plugin marketplace add fabioivan/claude-code-mods
/plugin install synapse-rate-limit@fabioivan-mods
/plugin install ctx-bytes-guard@fabioivan-mods
/reload-plugins
```

## Plugins

| Plugin | Descrição |
| --- | --- |
| [`synapse-rate-limit`](./synapse-rate-limit) | HUD completo (baseado no mod `hud` e no claude-hud) com alertas, previsão de limite, orçamento, painel de detalhes e 12 temas, mais a linha do synapse: clima, MB do contexto/anexos, tokens e gráfico dos últimos turnos. |
| [`ctx-bytes-guard`](./ctx-bytes-guard) | Compacta sozinho quando o contexto passa de 50% ou o payload da conversa passa de 16 MB. Com o `synapse-rate-limit` instalado, a linha do contexto mostra o tamanho e o contexto contra esses limites. |

Desabilite o plugin `hud` original ao usar o `synapse-rate-limit`, para a barra não aparecer duas vezes.

## Licença

MIT (ver [`LICENSE`](./LICENSE)).

O `synapse-rate-limit` inclui código do claude-hud, sob MIT (ver `synapse-rate-limit/LICENSE.claude-hud`).
