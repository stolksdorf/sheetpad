const isDev = process.argv.some(v=>v=='--dev');
const fs = require('fs');
const pack = require('../pico-pack');

const buildHTML = ({bundle, global})=>{
	fs.writeFileSync('./index.html', `<!DOCTYPE html>
<html>
<head>
	<title>sheetpad</title>

	<script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.3/codemirror.min.js'></script>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.3/codemirror.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.3/theme/zenburn.min.css">
	<script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.3/mode/javascript/javascript.min.js'></script>
	<script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.3/keymap/sublime.min.js'></script>
	<style>${Object.values(global.css).join('\n')}</style>
	<script>window.css={};</script>
</head>
<body><main></main></body>
<script>${bundle}</script>
<script>xo.render(document.body.children[0], window.main());</script>
</html>`)
	console.log('Bundled');

};

buildHTML(pack('./client/main.js', {
	global : { css : {}},
	watch : isDev && buildHTML
}));

