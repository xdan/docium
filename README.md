# Docium - Documentation static generator

[Demo](https://xdsoft.net/jodit/doc/)

Documentation static generator for programmers

## Get started

```bash
touch README.md
echo "First documentation page" > README.md
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

## Options

### --config `(default: "./docium.js" || "./docium.json" || "./.docium")`

Configuration file. Instead, this you can create `docium` section in `package.json`.

### --watch `(default: false)`

Enable watching on file changing and rebuild by this.

### --theme `(default: "light")`

Theme. Possible values: `dark`, `light`.

### --template `(default: "standard")`

Template for documentation. You can create yourself template and set it as path.

```bash
npx docium --template ./src/docium-template
```

[More about template](docs/template.md)

### --colors

Dictionary for theme.

```js
{
  "colors": {
    "body-background": "#fff",
    "text-color": "#000",
    "link-color": "#555 #66f #111" // Default Hover Visited
  }
}
```

### --code-highlighter `(default: "prism")`

Syntax highlighter for `code` sections.

### --code-highlighter-options

Syntax highlighter options

### --base-url

By default `docuim` generates relative paths for all `html` files. You can change this behaviour.

```bash
npx docium ./ --base-url https://xdsoft.net/jodit/doc/
```

### --examples `(default: "./examples")`

Folder for examples. You can put it inside your markdown file.

```bash
touch ./example/1.js
echo "alert('Hello!')" > ./example/1.js
```

In your markdown you can use this example by name

```md
{example 1}
```

You can use `jsx`,`html`, `js` files.

Or you can create folder for example item:

```bash
mkdir ./example/my-ex/
touch ./example/my-ex/some-name.js
touch ./example/my-ex/some-name.html
echo "alert(document.getElementById('example').innerHTML)" > ./example/1/some-name.js
echo "<div id='example'>Test</div>" > ./example/1/some-name.html
```

```md
{example my-ex}
```

### --show-source-for-example `(default: true)`

Show tabs with HTML/JS/CSS sections. In `{example 1}` place

### --generate-api `(default: true)`

Generate API by `jsdoc` & `typescript`.

### --api-section `(default: "api")`

Path in documentation for `API` section.

### --excludes `(default: ['node_modules'])`

Exclude directories from generation.

### --plugins

List of plugins.

```json
{
	"plugins": [
		[
			"docium-github-links",
			{
				"stars": true,
				"source": true
			}
		],
		[
			"google-analytics",
			{
				"id": "UA-634584-2"
			}
		],
		"docium-allow-react-in-ex"
	]
}
```

## Plugins

-   `docium-github-links` - insert link to `github` repository.
-   `docium-allow-react-in-ex` - allow use React in your examples.

## License

MIT