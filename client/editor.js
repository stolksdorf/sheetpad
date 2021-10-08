const {css,xo,x,cx,comp} = require('../crux.js');


global.css.editor = css`
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