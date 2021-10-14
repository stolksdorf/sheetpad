const {css,xo,x,cx,comp} = require('../crux.js');

const useLocalState = (scope, key, init)=>{
	const [val, setVal] = scope.useState(()=>{
		try{ return JSON.parse(window.localStorage.getItem(key)) ?? init;
		}catch(err){ return init; }
	});
	return [val, (newVal)=>{
		try{ window.localStorage.setItem(key, JSON.stringify(newVal)); } catch (err){}
		setVal(newVal);
	}];
};

global.css.main = css`
	html,body,.root{
		padding: 0px;
		margin:0px;
		height:100vh;
	}
	body{
		nav{

		}
		main{
			height : calc(100% - 30px);
		}
	}
	nav{
		border-bottom: 1px solid var(--yellow);
	}

	table{
		border: 1px solid black;
		width: 100%;
		th, td {
			border: 1px solid black;
		}
	}

	.CollapseGroup{
		display        : flex;
		flex-direction : column;
		height         : 100%;
	}

	.Block{
		border         : 1px solid var(--green);
		flex-grow      : 0;
		flex-basis: 0;
		display: flex;
		flex-direction: column;
		h4{
			flex-grow        : 0;
			cursor           : pointer;
			background-color : var(--grey);
			display          : flex;
			justify-content  : space-between;
			border-bottom    : 1px solid var(--blue);
			.controls{
				i{
					&.highlight{
						color: var(--blue);
					}
					&:hover{
						color: var(--green);
					}
				}
			}
		}
		.content{
			display: none;
			flex-grow: 1;
			textarea{
				height: 100%;
				width:100%;
			}
		}
		&.expanded{
			flex-grow : 1;
			.content{
				display : block;
			}
		}
	}

	main{
		display: flex;

		.InputPanel{
			width : 25%;
		}
		.editor{
			flex-grow : 1;
			height: 100%;
		}
		.OutputPanel{
			width : 25%;

			display        : flex;
			flex-direction : column;
			height         : 100%;
			border : 1px solid var(--blue);
		}

		.log{
			border-bottom: 1px solid var(--green);
			margin: 0px;
			padding: 5px 0px;
			font-size: 0.6em;
		}


	}

`;

const json2csv = (data=[])=>{
	let headers = Object.keys(data[0]);
	return `${headers.join(',')}\n${data.map(row=>{
		return headers.map(h=>row[h]).join(',')
	}).join('\n')}`
};

const renderTable = (json)=>{
	if(!Array.isArray(json) || json.length == 0) return 'Empty Table';
	const headers = Object.keys(json[0]);
	return x(`<table>
		<thead><tr>
			${headers.map(h=>`<th>${h}</th>`).join('\n')}
		</tr></thead>
		<tbody>
		${json.map(row=>{
			return `<tr>${headers.map(h=>{
				return `<td>${row[h]}</td>`
			}).join('\n')}</tr>`;
		}).join('\n')}
		</tbody>
	</table>`)
}

global.css.result_block = css`
	.ResultBlock{


	}
	.LogBlock{
		.logs{
			overflow-y: auto;
		}
	}
`

const ResultBlock = comp(function(value){
	const [mode, setMode] = useLocalState(this, 'result_mode', 'code'); //'table', 'code'
	const [expanded, setExpanded] = useLocalState(this, 'result_expand', true);

	const handleCopy = (evt)=>{
		evt.stopPropagation()

		navigator.clipboard.writeText(
			mode=='table'
				? json2csv(value)
				: JSON.stringify(value, null, '\t')
		)
	}


	return x`<div class=${cx('ResultBlock Block', {expanded})}>
		<h4 onclick=${()=>setExpanded(!expanded)}>
			result
			<div class='controls'>
				<i class=${cx('fa fa-fw fa-code', {highlight : mode=='code'})} onclick=${(evt)=>{setMode('code');evt.stopPropagation()}}></i>
				<i class=${cx('fa fa-fw fa-table', {highlight : mode=='table'})} onclick=${(evt)=>{setMode('table');evt.stopPropagation()}}></i>
				<i class='fa fa-fw fa-copy' alt='test' onclick=${handleCopy}></i>
			</div>
		</h4>
		<div class='content'>
			${mode=='code' &&
				x`<pre><code>${JSON.stringify(value, null, '  ')}</code></pre>`
			}
			${mode=='table' &&
				renderTable(value)
			}
		</div>
	</div>`;
})


const Logs = comp(function(logs){
	const [expanded, setExpanded] = useLocalState(this, 'logs_expand', true);

	return x`<div class=${cx('LogBlock Block', {expanded})}>
		<h4 onclick=${()=>setExpanded(!expanded)}>
			logs
			<div class='controls'>
			</div>
		</h4>
		<div class='content'>
			<div class='logs'>
			${logs.map(log=>{
				if(!Array.isArray(log)) log=[log];
				return x`<pre class='log'>
					${log.map(x=>JSON.stringify(x,null,'  ')).join(' ')}
				</pre>`;
			})}
			</div>
		</div>
	</div>`;
})


const CollapseGroup = require('./collaspeGroup.js');
const Editor = require('./editor.js');

const Worker = require('./worker.js');

const InputPanel = require('./inputPanel.js');


const initCode = `//Let's gooooo

console.log(sheet1)

const OnlyBlueTeam = sheet1.filter((row)=>{
  return row.team == 'blue'
});



return OnlyBlueTeam;`

const Main = comp(function(){
	const [code, setCode] = useLocalState(this, 'code', initCode);

	global.code = code;

	const [pending, setPending] = this.useState(false);

	const [output, setOutput] = this.useState({
		result : null,
		logs : []
	});

	const updateCode = (newCode)=>{
		setCode(newCode);

		global.code = newCode;
		global.runWorker();
	}

	// console.log(output)

	// this.useEffect(()=>{

	// 	if(this.refs.debounce) return;

	// 	this.refs.debounce = true;

	// 	setTimeout(()=>{
	// 		console.log('RUNNING')
	// 		setOutput(Worker(code, input1));
	// 		this.refs.debounce = false;
	// 	}, 500)
	// }, [code, input1]);


	this.useEffect(()=>{
		global.runWorker = ()=>{
			setPending(true);
			clearInterval(this.refs.debounce)
			this.refs.debounce = setTimeout(()=>{
				console.log('Running worker')
				setOutput(Worker(global.code));
				//this.refs.debounce = false;
				setPending(false);
			}, 1000)
		}
	}, [])

	console.log(output)

	return x`<div class='root'>
		<nav>
			Sheetpad - ${pending ? 'pending' : 'ready'}
		</nav>
		<main>
			${InputPanel()}

			<div class='editor'>
				${Editor(code, updateCode)}
			</div>
			<div class='OutputPanel'>
				${ResultBlock(output.result)}
				${Logs(output.logs)}
			</div>
		</main>
	</div>`
});


module.exports = Main;


/*
<div class='inputs'>
	${CollapseGroup({
		input1 : x`<textarea
			value=${input1}
			oninput=${(evt)=>setInput1(evt.target.value)}></textarea>`,
		input2 : x`<textarea
			value=${input2}
			oninput=${(evt)=>setInput2(evt.target.value)}></textarea>`,
		input3 : x`<textarea
			value=${input3}
			oninput=${(evt)=>setInput3(evt.target.value)}></textarea>`,
	}, { input1 : true })}
</div>
*/