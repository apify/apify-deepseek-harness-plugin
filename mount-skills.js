/**
 * The path is derived from `import.meta.url` because `customSkillDirs` is
 * resolved against `process.cwd()`, not the package directory.
 *
 * No startup notice here: cordis's default logger exporter is an in-memory
 * ring buffer, not stdout, so a `ctx.logger` line never reaches the terminal.
 * The discovery-only signal lives in the router skill's description instead,
 * where both the user and the model can see it.
 */
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import * as SkillFilesystem from '@deepseek-ai/dsh-skill-filesystem'

export const name = 'apify-skills'
export const inject = ['skills']

/**
 * @param {import('@deepseek-ai/cordis').Context} ctx - the plugin's cordis context.
 */
export function apply(ctx) {
  ctx.plugin(SkillFilesystem, {
    providerName: 'apify',
    includeDefaultRoots: false,
    customSkillDirs: [join(dirname(fileURLToPath(import.meta.url)), 'skills')],
  })
}
