import { defineConfig } from 'vite';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserOrOrganizationSite = repositoryName.endsWith('.github.io');
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  base:
    isGitHubActions && repositoryName && !isUserOrOrganizationSite ? `/${repositoryName}/` : '/',
});
