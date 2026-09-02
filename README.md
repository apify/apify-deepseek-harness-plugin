# Apify plugin for DeepSeek Harness

Extract data from any website with thousands of trusted scrapers, crawlers, and automations from the [Apify Store](https://apify.com/store). Run ready-made **Actors** for social media, e-commerce, search engines, maps, and travel sites, or build, debug, and publish your own, directly from [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

One install adds both halves:

| Component | What it gives you |
|---|---|
| Apify MCP server | `mcp__apify__*` tools to search the Store, inspect Actors, run them, and read results |
| 6 Apify skills | Routing, plus Actor development, actorization, SDK integration, output schemas, and multi-platform scraping |

Verified against `@deepseek-ai/dsh@0.1.1-rc.2`. DeepSeek Harness is a developer preview, so later versions may need a plugin update.

## Before you start

- **Node.js `^22.19.0 || >=24.0.0`.** Older versions fail before dsh starts, with a `node:sqlite` error from pnpm that never mentions Node.
- **pnpm on PATH.** `dsh plugin` forwards to it.
- **An Apify API token** to run Actors, from [Apify Console](https://console.apify.com/settings/integrations?utm_source=deepseek-harness&utm_medium=integrations). Free accounts work. Optional — see below.

## Install

```bash
export APIFY_TOKEN=<your-apify-token>
dsh plugin --profile web add dsh-apify-plugin
```

Then **restart the profile**. Bundle membership is fixed when a profile boots, so a running session will not pick up the new plugin.

`APIFY_TOKEN` is read once at startup, so it has to be set before dsh launches. Put it in your `~/.zshrc` or `~/.bashrc` to make it stick.

### Without a token

The token is optional. Install it with `APIFY_TOKEN` unset and the plugin starts in **discovery-only mode** on Apify's anonymous tier:

| Works | Does not work |
|---|---|
| `search-actors` — find Actors in the Store | Running Actors (`call-actor`) |
| `fetch-actor-details` — input schema, pricing, README | Reading run results or datasets |
| `search-apify-docs` / `fetch-apify-docs` | `apify/rag-web-browser` |

So "find me a Google Maps scraper and show me its input schema and pricing" works before you sign up; only the run is gated. Set `APIFY_TOKEN`, restart the profile, and the full tool set appears.

To check which mode you are in, ask the agent whether it has a `call-actor` tool. It knows the difference and will tell you what to set.

Check the layer without booting:

```bash
dsh --profile web --dump-config
```

You should see a `# == dsh-apify-plugin` section. After booting, the Plugins UI should list two mounted rows: `include:apify-mcp` and `include:apify-skills`.

If dsh starts, Apify is connected. The bundle sets `failOnStartupError: true`, so a **rejected** token or an unreachable server stops startup with a clear message instead of leaving the Apify tools silently absent. A *missing* token is not an error — see below.

## Try it

The tools are named `mcp__apify__*`, but you do not need to name them. Start read-only:

> Use Apify to find a good Actor for scraping Google Maps reviews. Show me its input schema, pricing, and what the output looks like. Don't run it.

Then run one:

> Use Apify to scrape the top 10 Google search results for "web scraping best practices" and summarize what they have in common.

For the skills, ask the agent to list them, or invoke one directly with `/apify-actor-development`.

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

The bundle inserts two rows. To change either, override it by `id` from your profile's `cordis.patch.yml`. **A patch replaces a row's entire `config`**, so restate every key you want to keep:

```yaml
- id: apify-mcp
  name: '@deepseek-ai/dsh-mcp-client'
  config:
    serverName: apify
    transport: streamable-http
    url: !!js 'process.env.APIFY_TOKEN ? "https://mcp.apify.com/?client=deepseek-harness+plugin&tools=actors,docs,apify/rag-web-browser" : "https://mcp.apify.com/?client=deepseek-harness+plugin&tools=search-actors,fetch-actor-details,search-apify-docs,fetch-apify-docs"'
    headers: !!js 'process.env.APIFY_TOKEN ? { Authorization: "Bearer " + process.env.APIFY_TOKEN } : {}'
    toolCallTimeoutMs: 300000
    failOnStartupError: true
```

The `url` and `headers` expressions both branch on `APIFY_TOKEN`. Apify's anonymous tier is tool-gated as well as header-gated — requesting `tools=actors` without a token is rejected with 401 — so the tool set has to narrow alongside the header, not just the header. If you always run with a token, you can replace both with plain literals.

Two defaults are deliberately not dsh's:

- **`toolCallTimeoutMs: 300000`.** dsh defaults to 60s, which is below Apify's 300s synchronous run ceiling, so real Actor runs would time out on the dsh side.
- **`failOnStartupError: true`.** dsh defaults to `false`, which starts normally with zero Apify tools registered and no visible error when the token is missing or rejected. That reads as "the plugin does nothing."

To change which Apify tools load, edit the `tools=` query parameter. Full list in the [Apify MCP docs](https://docs.apify.com/platform/integrations/mcp); pick them visually at [mcp.apify.com](https://mcp.apify.com/).

## Troubleshooting

**`invalid_token` on startup.** `APIFY_TOKEN` is set but wrong in the environment that launched dsh. An *unset* token no longer fails — it starts in discovery-only mode instead. Exporting a token in another terminal afterwards has no effect; set it, then restart.

**The agent says it cannot run an Actor, or asks you for credentials.** You are in discovery-only mode: `APIFY_TOKEN` was unset when dsh launched, so `call-actor` was never registered. Set the token and restart the profile.

Expect the agent to explain this badly. Observed on DeepSeek's own model: it finds the Actor and reads its input schema correctly, then says the execution API is "currently unavailable to me", invents a tool name such as `mcp_apify_run_actor`, and asks you to check which tools exist. It is not broken and the Actor is fine - there is simply no run tool to call. Setting the token resolves it.

**Nothing is printed at startup.** By design: cordis's default logger exporter is an in-memory ring buffer, not stdout, so `dsh web` prints only its own two lines. Use `dsh --profile web --dump-config` to inspect the composed layer, or the web UI's session log.

**Only one plugin row appears.** The profile was already running when you installed. Restart it.

**`serverName "apify" is already in use`.** Another Apify MCP entry is loading, usually a leftover in `~/.dsh/cordis.patch.yml` or the profile's own patch. Remove one.

**A boot failure with several causes.** dsh reports an `AggregateError`; read the full `[errors]` array. A `tail` of the log shows only the last cause and hides the rest.

## Remove

```bash
dsh plugin --profile web remove dsh-apify-plugin
```

## Notes and limits

- **Token auth only.** The dsh MCP client sends static headers and has no OAuth flow, so the browser sign-in Apify offers other clients is not available here.
- **Tools only.** dsh does not bridge MCP Resources or Prompts.
- **Actor runs consume Apify usage** from your plan, on top of what your model provider charges. See [Apify billing](https://docs.apify.com/platform/console/billing).

## Links

- [Apify Store](https://apify.com/store) · [Apify MCP server](https://docs.apify.com/platform/integrations/mcp) · [Apify docs](https://docs.apify.com)
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) · [Package and install a plugin](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)
