const {css,xo,x,cx,comp} = require('../crux.js');

global.input1 = {};
global.input2 = {};
global.input3 = {};

global.css.input_panel = css`
	.InputPanel{
		display        : flex;
		flex-direction : column;
		height         : 100%;
		border : 1px solid var(--blue);
	}

`;


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


const drawTable = ()=>{

};

//TODO: Parse numbers and booleans
const xsv2json = (xsv)=>{
	try{
		const delimiter = xsv.trim().indexOf('\t')==-1 ? ',' : '\t';
		let [header, ...rows] = xsv.split('\n');
		header = header.split(delimiter).map(x=>x.trim());
		return rows.map(row=>{
			return row.split(delimiter).reduce((acc, val, idx)=>{
				acc[header[idx]] = val;
				return acc;
			},{})
		});
	}catch(err){
		return [];
	}
};

const initSheet = `
name, score, team
Agatha,30,red
Bert,12,red
Carl,4,blue
Demi,34,green
Ethal,22,blue
`;


global.css.sheet_block = css`
	.SheetBlock{

	}
`;
const SheetBlock = comp(function(id, initExpanded=false, initVal=''){

	const [value, setValue] = useLocalState(this, id+'val', initVal);
	const [mode, setMode] = this.useState('edit'); //'edit', 'table', 'code'
	const [expanded, setExpanded] = useLocalState(this, id+'expand', initExpanded)

	this.useEffect(()=>{
		clearInterval(this.refs.debounce)
		this.refs.debounce = setTimeout(()=>{
			global[id] = global[id] || {};

			global[id].raw = value.trim();
			global[id].sheet = xsv2json(value.trim());

			console.log('setting', id)
			console.log(global[id])

			global.runWorker();
		}, 500);

	}, [value]);


	return x`<div class=${cx('SheetBlock Block', {expanded})}>
		<h4 onclick=${()=>setExpanded(!expanded)}>
			${id}
			<div class='controls'>
				<i class=${cx('fa fa-fw fa-edit', {highlight : mode=='edit'})} onclick=${(evt)=>{setMode('edit');evt.stopPropagation()}}></i>
				<i class=${cx('fa fa-fw fa-code', {highlight : mode=='code'})} onclick=${(evt)=>{setMode('code');evt.stopPropagation()}}></i>
				<i class=${cx('fa fa-fw fa-table', {highlight : mode=='table'})} onclick=${(evt)=>{setMode('table');evt.stopPropagation()}}></i>
			</div>
		</h4>
		<div class='content'>
			${mode=='edit' &&
				x`<textarea
					spellcheck='false'
					value=${value}
					oninput=${(evt)=>setValue(evt.target.value)}>
				</textarea>`
			}
			${mode=='code' &&
				x`<pre><code>${JSON.stringify(global[id].sheet, null, '  ')}</code></pre>`
			}
			${mode=='table' &&
				renderTable(global[id].sheet)
			}
		</div>
	</div>`;
});



const InputPanel = comp(function(){




	return x`<div class='InputPanel'>
		${SheetBlock('sheet1', true, initSheet)}
		${SheetBlock('sheet2', true)}
		${SheetBlock('sheet3')}
	</div>`;

});





module.exports = InputPanel;