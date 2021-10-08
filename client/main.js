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


	.editor{
		height : 500px;
		.CollapseGroup{

		}
	}

	main{
		display: flex;

		.inputs{
			width : 25%;
		}
		.editor{
			flex-grow : 1;
			height: 100%;
		}
		.outputs{
			width : 25%;
		}


		.group{
			textarea{
				height:100%;
				width:100%;
			}
		}


	}

`;

// const json2csv = (data)=>{
// 	let header = Object.keys(data[0]);

// };

// const xsv2json = (xsv)=>{
// 	const delimiter = xsv.indexof('\t')==-1 ? ',' : '\t';
// 	let [header, ...rows] = xsv.split('\n');
// 	header = header.split(delimiter);
// 	return rows.map(row=>{
// 		return row.split(delimiter).reduce((acc, val, idx)=>{
// 			acc[header[idx]] = val;
// 			return acc;
// 		},{})
// 	});
// };



// //const Sheet = comp(function(name, data, onChange){
// const Sheet = comp(function(name){
// 	const [viewMode, setViewMode] = this.useState('edit'); //'table'

// 	const [data, setData] = this.useState('');

// 	const renderSheet = ()=>{
// 		const data = xsv2json(data);

// 	}
// 	const renderEdit = ()=>{

// 		return x`<textarea value=${data} oninput=${(evt)=>setData(evt.target.value)}></textarea>`
// 	}

// 	return x`<div class='Sheet'>
// 		<div class='controls'>
// 			<label>${name}</label>

// 			<i class='fa fa-fw fa-copy'></i>
// 			<i class='fa fa-fw fa-code'></i>
// 			<i class='fa fa-fw fa-table'></i>
// 		</div>

// 		${viewMode == 'edit'
// 			? renderEdit()
// 			: renderSheet()}

// 		${data}
// 	</div>`
// })




const Logs = (logs)=>{

}


const CollapseGroup = require('./collaspeGroup.js');
const Editor = require('./editor.js');

const Worker = require('./worker.js');

const Main = comp(function(){
	const [code, setCode] = useLocalState(this, 'code', `//Let's gooooo\n\n\n\n`);
	const [input1, setInput1] = useLocalState(this, 'input1', '');
	const [input2, setInput2] = useLocalState(this, 'input2', '');
	const [input3, setInput3] = useLocalState(this, 'input3', '');

	const [output, setOutput] = this.useState({
		result : null,
		logs : []
	});

	console.log(output)

	this.useEffect(()=>{

		if(this.refs.debounce) return;

		this.refs.debounce = true;

		setTimeout(()=>{
			console.log('RUNNING')
			setOutput(Worker(code, input1));
			this.refs.debounce = false;
		}, 500)
	}, [code, input1]);

	return x`<div class='root'>
		<nav>
			Sheetpad
		</nav>
		<main>
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
			<div class='editor'>
				${Editor(code, setCode)}
			</div>
			<div class='outputs'>
				${CollapseGroup({
					result : x`<div>${output.result}</div>`,
					logs : x`<div>BAR</div>`
				}, { result : true, logs : true })}
			</div>
		</main>
	</div>`
});


module.exports = Main;