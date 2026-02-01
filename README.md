# create-valaxy

Example: [valaxy.site](https://valaxy.site)

## Info

![Repo Size](https://img.shields.io/github/repo-size/ZhantaoLi/ZhantaoLi.github.io?style=flat-square&color=blue)
![Last Commit](https://img.shields.io/github/last-commit/ZhantaoLi/ZhantaoLi.github.io?style=flat-square&color=blue)

## Project Tree
valaxy-blog/
  ├── pages/              # 页面和博客文章
  │   ├── posts/          # 博客文章 (Markdown)
  │   ├── about/          # 关于页面
  │   ├── categories/     # 分类页
  │   ├── tags/           # 标签页
  │   ├── links/          # 友链页
  │   ├── demos/          # 演示页
  │   └── websites/       # 网站收藏页
  ├── components/         # 自定义 Vue 组件
  ├── styles/             # 自定义样式
  ├── public/             # 静态资源
  ├── dist/               # 构建输出 (gitignore)
  ├── valaxy.config.ts    # Valaxy 主配置
  └── site.config.ts      # 站点配置

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
