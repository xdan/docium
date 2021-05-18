# Docium

Documentation static generator for programmers

## Get started

```bash
touch README.md
echo "First documentation page" > README.md

touch _sidebar.md
echo "- Getting started
  - [Quick start](./README.md)" > _sidebar.md
```

```bash
npx docium ./ ./dist/
cd ./dist
ls ./
```

```bash
assets
 css
 js

media
 images

index.html
```

It generates static site with documentation mardown files + JSDoc API.

## Plugins

-   `docium-github-links`[ ] - insert link to `github` repository.
-   `docium-allow-react-in-ex`[ ] - allow use React in your examples.
-   `docium-disqus`[ ] - Add disqus comments at the end of the pages.
-   `docium-google-analytics`[ ] - Add Google Analytics counter in the page.
-   `docium-sitemap`[ ] - Generate `sitemap.xml`.

## License

MIT
