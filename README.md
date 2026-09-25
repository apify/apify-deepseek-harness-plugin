# Apify plugin for DeepSeek Harness

Search, run, and build [Apify Actors](https://apify.com/store) directly from [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

## What you get

| Component | What it does | Needs |
|---|---|---|
| MCP server `apify` | Searches Apify Store, fetches Actor details and docs. With a token it also runs Actors and reads their results. | `APIFY_TOKEN` to run Actors |
| Skill `apify` | Entry point: routes each Apify request to the right skill or tool. | - |
| Skill `apify-ultimate-scraper` | Multi-step scraping workflows across 15+ platforms. | Apify CLI |
| Skill `apify-actor-development` | Creates, tests, and deploys a new Actor. | Apify CLI |
| Skill `apify-actorization` | Turns an existing project into an Actor. | Apify CLI |
| Skill `apify-generate-output-schema` | Generates output schemas for an existing Actor from its source code. | - |
| Skill `apify-sdk-integration` | Adds Actor runs to your own app with the `apify-client` package. | `APIFY_TOKEN` in your app |

Skills load when a request matches them, or run one directly as `/<skill-name>`. Skills marked "Apify CLI" need the [Apify CLI](https://docs.apify.com/cli) installed and logged in.

## Before you start

- **Node.js `^22.19.0 || >=24.0.0`.** Older versions fail with a `node:sqlite` error.
- **pnpm on PATH.** `dsh plugin` forwards to it.
- **An Apify API token** from [Apify Console](https://console.apify.com/settings/integrations?utm_source=deepseek-harness&utm_medium=integrations) (free accounts work). Without a token only search/inspect tools load. If you already use the logged-in [Apify CLI](https://docs.apify.com/cli), the agent can run Actors through it instead (requires **Full access** sandbox mode).

## Install

Plugins are installed per `dsh` profile. Use the profile you run:

```bash
dsh plugin --profile web add dsh-apify-plugin
```

Add your token to a `.env` file where you launch dsh:

```bash
# .env
APIFY_TOKEN=<your-apify-token>
```

Restart `dsh`. It reads the token once at startup, so a token set during a session has no effect.

## Verify

Start a new session and ask:

> List the Apify skills and the `mcp__apify__` tools you can use.

You should see the six skills above. With a token, the tools include `mcp__apify__call-actor`. Without one, you get only `search-actors`, `fetch-actor-details`, `search-apify-docs`, and `fetch-apify-docs`.

## Try it

> Use Apify to find a good Actor for scraping Google Maps reviews. Show me its input schema and pricing. Don't run it.

> Use Apify to scrape the top 10 Google search results for "web scraping best practices" and summarize what they have in common.

## Configuration

Override either bundle row by `id` from your profile's `cordis.patch.yml`. See `cordis.patch.yml` in this repo for the full default. To change which tools load, edit the `tools=` query parameter in the MCP URL ([docs](https://docs.apify.com/platform/integrations/mcp), [visual picker](https://mcp.apify.com)).

## Troubleshooting

**`invalid_token` on startup.** Token is set but wrong. Fix it and restart.

**The agent says it cannot run an Actor.** You're in discovery-only mode. Set `APIFY_TOKEN` and restart.

**npm reports root-owned files and suggests `sudo chown`.** The default **Workspace Write** sandbox blocks writes outside your workspace, including the npm cache in `~/.npm`, and npm reports that as an ownership problem. `sudo chown` doesn't help, so reject any prompt to run it. To get past the error, run the command that failed (such as `apify create` or `npm install`) yourself in the workspace directory and let the agent continue. Approving the agent's escalation or switching to **Full access** also works, but it gives the agent unrestricted access to your whole system, so do that only if you trust the model, or run `dsh` in a container or VM.

**The plugin seems out of date or missing.** Check that you installed it into the profile you're running. Each profile has its own copy.

## Remove

```bash
dsh plugin --profile web remove dsh-apify-plugin
```

**Note:** Actor runs consume [Apify usage](https://docs.apify.com/platform/console/billing) on top of model provider costs.

## Links

- [Apify Store](https://apify.com/store) · [Apify MCP server](https://docs.apify.com/platform/integrations/mcp) · [Apify docs](https://docs.apify.com)
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) · [Plugin packaging docs](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)
- [Issues and feedback](https://github.com/apify/apify-deepseek-harness-plugin/issues)

## License

Apache-2.0. See [LICENSE](./LICENSE).
