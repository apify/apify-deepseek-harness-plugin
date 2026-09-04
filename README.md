# Apify plugin for DeepSeek Harness

Search, run, and build [Apify Actors](https://apify.com/store), ready-made scrapers and automations for social media, e-commerce, search engines, maps, and more, directly from [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

Verified against `@deepseek-ai/dsh@0.1.1-rc.2`. DeepSeek Harness is a developer preview, so later versions may need a plugin update.

## Before you start

- **Node.js `^22.19.0 || >=24.0.0`.** Older versions fail with a `node:sqlite` error that never mentions Node.
- **pnpm on PATH.** `dsh plugin` forwards to it.
- **An Apify API token** to run Actors, from [Apify Console](https://console.apify.com/settings/integrations?utm_source=deepseek-harness&utm_medium=integrations). Free accounts work. Optional, see below.

## Install

```bash
export APIFY_TOKEN=<your-apify-token>
dsh plugin --profile web add dsh-apify-plugin
```

Restart the profile after installing. `APIFY_TOKEN` is read once at startup; put it in `~/.zshrc` or `~/.bashrc` to make it stick.

### Without a token

Without `APIFY_TOKEN` the Apify MCP server starts in **discovery-only mode**: you can search and inspect Actors, but nothing that requires authentication is loaded. No running Actors, no reading results, no web tools. Set `APIFY_TOKEN`, restart the profile, and the full tool set appears.

Alternatively, the [Apify CLI](https://docs.apify.com/cli) can run Actors without `APIFY_TOKEN` (`npm install -g apify-cli && apify login`). The CLI stores credentials in `~/.apify/`, which is outside the workspace, so it fails under dsh's default **Workspace Write** sandbox. Switch to **Full access** mode for the CLI route to work.

## Try it

> Use Apify to find a good Actor for scraping Google Maps reviews. Show me its input schema and pricing. Don't run it.

> Use Apify to scrape the top 10 Google search results for "web scraping best practices" and summarize what they have in common.

For skills, invoke one directly with `/apify-actor-development` or ask the agent to list them.

## What's inside

| Skill | Use it for |
|---|---|
| `apify` | Router: picks the right skill or MCP tool for a request |
| `apify-ultimate-scraper` | Running existing Actors across 15+ platforms |
| `apify-actor-development` | Building, debugging, and deploying new Actors |
| `apify-actorization` | Converting an existing project into an Actor |
| `apify-generate-output-schema` | Generating an Actor's output schemas |
| `apify-sdk-integration` | Calling Actors from an app via `apify-client` |

## Configuration

Override either bundle row by `id` from your profile's `cordis.patch.yml`. A patch replaces a row's entire `config`, so restate every key you want to keep. See `cordis.patch.yml` in this repo for the full default.

To change which Apify tools load, edit the `tools=` query parameter in the MCP URL. Full list in the [Apify MCP docs](https://docs.apify.com/platform/integrations/mcp); pick them visually at [mcp.apify.com](https://mcp.apify.com).

## Troubleshooting

**`invalid_token` on startup.** `APIFY_TOKEN` is set but wrong. An *unset* token is not an error; it starts in discovery-only mode. Set the correct token and restart.

**The agent says it cannot run an Actor.** You are in discovery-only mode. Set `APIFY_TOKEN` and restart, or use the [CLI route](#without-a-token) in Full access mode.

**Only one plugin row appears.** The profile was already running when you installed. Restart it.

**`serverName "apify" is already in use`.** Another Apify MCP entry exists in `~/.dsh/cordis.patch.yml` or the profile's own patch. Remove one.

## Remove

```bash
dsh plugin --profile web remove dsh-apify-plugin
```

## Notes

- **Token auth only.** No OAuth flow; the dsh MCP client sends static headers.
- **Tools only.** dsh does not bridge MCP Resources or Prompts.
- **Actor runs consume Apify usage** on top of model provider costs. See [Apify billing](https://docs.apify.com/platform/console/billing).

## Links

- [Apify Store](https://apify.com/store) · [Apify MCP server](https://docs.apify.com/platform/integrations/mcp) · [Apify docs](https://docs.apify.com)
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) · [Plugin packaging docs](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)
