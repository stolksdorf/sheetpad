const {css,xo,x,cx,comp} = require('../crux.js');

global.css.collapseGroup = css`
	.CollapseGroup{
		display        : flex;
		flex-direction : column;
		height         : 100%;

		border : 1px solid var(--blue);

		.group{
			border         : 1px solid var(--green);
			flex-grow      : 0;
			display        : flex;
			flex-direction : column;
			.content{
				display   : none;
				flex-grow : 1;
			}

			&.expanded{
				flex-grow : 1;
				.content{
					display : block;
				}
			}
		}

	}
`;



const CollapseGroup = comp(function(groups, initStates={}){
	const [expandedGroups, setExpandedGroups] = this.useState(initStates);

	return x`<div class='CollapseGroup'>
		${xo.keymap(groups, (val, key)=>{
			const expanded = !!expandedGroups[key];

			return [key,
				x`<div class=${cx('group', {expanded})}>
					<h3 onclick=${()=>setExpandedGroups({...expandedGroups, [key]:!expanded})}>${key}</h3>
					<div class='content'>${val}</div>
				</div>`
			]
		})}

	</div>`

});



module.exports = CollapseGroup;