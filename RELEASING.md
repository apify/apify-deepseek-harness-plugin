# Releasing

Actions -> **Release** -> **Run workflow** on `main`, and set `version` to `patch`, `minor`, `major`, or
an exact version such as `0.2.0`. The bump starts from the version in `package.json`.

The run then:

1. Runs `npm run verify`.
2. Sets the version in `package.json` and publishes to npm through trusted publishing (OIDC), with
   provenance.
3. Commits `package.json` to `main` as `chore(release): vX.Y.Z [skip ci]`, signed.
4. Creates the `vX.Y.Z` tag and the GitHub release, with notes generated from the merged pull requests
   and the package tarball attached.

If a run fails, use **Re-run jobs** on that run rather than dispatching a new one. A re-run starts from
the same commit, so it computes the same version, skips the npm publish and the commit when they
already happened, and finishes the rest. A new dispatch after a partial run would bump again.

Skill updates from `apify-plugins-internal` land on `main` as sync commits and are not released until someone
dispatches a release.

## Repository configuration

- **npm trusted publisher** for `dsh-apify-plugin` must point at `publish.yml`, with no environment
  name. Moving the `npm publish` step into another workflow breaks the OIDC handshake until the npm
  configuration is updated to match.
- **`APIFY_SERVICE_ACCOUNT_GITHUB_TOKEN`** is required for the version commit, the tag and the GitHub
  release. Its account has to be allowed to push to `main`.
