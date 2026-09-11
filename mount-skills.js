/**
 * `customSkillDirs` is resolved against `process.cwd()`, not the package
 * directory, so the path is derived from `import.meta.url`.
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
