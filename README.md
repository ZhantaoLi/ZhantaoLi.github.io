# create-valaxy

Example: [valaxy.site](https://valaxy.site)

## Info

![Repo Size](https://img.shields.io/github/repo-size/ZhantaoLi/ZhantaoLi.github.io?style=flat-square&color=blue)
![Last Commit](https://img.shields.io/github/last-commit/ZhantaoLi/ZhantaoLi.github.io?style=flat-square&color=blue)

## Usage

```bash
# install
npm i
# or  pnpm i

# start
npm run dev
# or  pnpm dev

# build
npm run build
# or  pnpm build

# update
pnpm update valaxy valaxy-theme-yun --latest
```

See `http://localhost:4859/`, have fun!

### Config

Modify `valaxy.config.ts` to custom your blog.

English & Chinese Docs is coming!

> Wait a minute.

### Docker

```bash
docker build . -t your-valaxy-blog-name:latest
```

## Structure

In most cases, you only need to work in the `pages` folder.

### Main folders

- `pages`: your all pages
  - `posts`: write your posts here, will be counted as posts
- `styles`: override theme styles, `index.scss`/`vars.csss`/`index.css` will be loaded automatically
- `components`: custom your vue components (will be loaded automatically)
- `layouts`: custom layouts (use it by `layout: xxx` in md)
- `locales`: custom i18n

### Other

- `.vscode`: recommend some useful plugins & settings, you can preview icon/i18n/class...
- `.github`: GitHub Actions to auto build & deploy to GitHub Pages
- `netlify.toml`: for [netlify](https://www.netlify.com/)
- `vercel.json`: for [vercel](https://vercel.com/)

### Project Tree
```
valaxy-blog/
├─ .github/               # GitHub Actions workflows and CI config
├─ .valaxy/               # Valaxy local cache and temporary files
├─ .vscode/               # Workspace settings and extension recommendations
├─ components/            # Auto-registered custom Vue components
├─ layouts/               # Custom layout components
├─ locales/               # i18n locale resources
├─ pages/                 # Main content pages
│  ├─ about/              # About page
│  ├─ categories/         # Category index page
│  ├─ demos/              # Demo pages
│  ├─ links/              # Friends/links page
│  ├─ posts/              # Blog posts written in Markdown
│  ├─ tags/               # Tag index page
│  └─ websites/           # Website showcase pages
├─ public/                # Static assets copied directly to the output
├─ styles/                # Global style overrides and variables
├─ netlify.toml           # Netlify build and deploy settings
├─ package.json           # Project scripts and dependencies
├─ README.md              # Project documentation
├─ site.config.ts         # Site metadata (title, links, and profile info)
├─ valaxy.config.ts       # Valaxy framework configuration
└─ vercel.json            # Vercel build and deploy settings
```
