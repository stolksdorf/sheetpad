/*
<script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.3/codemirror.min.js'></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.3/codemirror.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.3/theme/zenburn.min.css">
<script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.3/mode/javascript/javascript.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.3/keymap/sublime.min.js'></script>
*/


css`
	.CodeMirror{
		height: 100%;
	}
`

const Editor = comp(function(initVal='', onChange=()=>{}, opts={}){
	this.useEffect(()=>{
		this.refs.editor = CodeMirror.fromTextArea(this.el, {
			lineNumbers    : true,
			theme          : 'zenburn',
			indentWithTabs : true,
			mode           : "javascript",
			keyMap         : "sublime",
			...opts
		});
	}, []);
	this.useEffect(()=>{
		if(this.refs.editor.getValue() !== initVal){
			this.refs.editor.setValue(initVal);
		}
	},[initVal]);
	this.useEffect(()=>{
		this.refs.editor.on("change", ()=>{
			onChange(this.refs.editor.getValue())
		});
	},[])

	return x`<textarea></textarea>`
})

module.exports = Editor;