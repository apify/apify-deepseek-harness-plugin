# Apify plugin for DeepSeek Harness

Search, run, and build [Apify Actors](https://apify.com/store) directly from [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

Verified against `@deepseek-ai/dsh@0.1.1-rc.2`.

## Before you start

- **Node.js `^22.19.0 || >=24.0.0`.** Older versions fail with a `node:sqlite` error.
- **pnpm on PATH.** `dsh plugin` forwards to it.
- **An Apify API token** from [Apify Console](https://console.apify.com/settings/integrations?utm_source=deepseek-harness&utm_medium=integrations) (free accounts work). Without a token only search/inspect tools load. Alternatively, install the [Apify CLI](https://docs.apify.com/cli) (`npm i -g apify-cli && apify login`) to run Actors without a token (requires **Full access** sandbox mode).

## Install

```bash
dsh plugin --profile web add dsh-apify-plugin
```

Add your token to a `.env` file where you launch dsh:

```bash
# .env
APIFY_TOKEN=<your-apify-token>
```

Restart the profile to pick up the change.
## Try it

> Use Apify to find a good Actor for scraping Google Maps reviews. Show me its input schema and pricing. Don't run it.

> Use Apify to scrape the top 10 Google search results for "web scraping best practices" and summarize what they have in common.

## Configuration

Override either bundle row by `id` from your profile's `cordis.patch.yml`. See `cordis.patch.yml` in this repo for the full default. To change which tools load, edit the `tools=` query parameter in the MCP URL ([docs](https://docs.apify.com/platform/integrations/mcp), [visual picker](https://mcp.apify.com)).

## Troubleshooting

**`invalid_token` on startup.** Token is set but wrong. Fix it and restart.

**The agent says it cannot run an Actor.** You're in discovery-only mode. Set `APIFY_TOKEN` and restart.

## Remove

```bash
dsh plugin --profile web remove dsh-apify-plugin
```

**Note:** Actor runs consume [Apify usage](https://docs.apify.com/platform/console/billing) on top of model provider costs.

## Links

- [Apify Store](https://apify.com/store) · [Apify MCP server](https://docs.apify.com/platform/integrations/mcp) · [Apify docs](https://docs.apify.com)
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) · [Plugin packaging docs](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)
