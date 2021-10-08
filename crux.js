const css = require('../pico-css');
const xo = require('../xo');
const {comp,x,cx} = xo;


global.css.crux_style = css`
	:root{
		--yellow : #f0dfaf;
		--purple : #bfbdd0;
		--black  : #3f3f3f;
		--white  : #f0dfaf;
		--green  : #7f9f7f;
		--grey   : #4f4f4f;
		--orange : #dfaf8f;
		--red    : #cc9393;
		--blue   : #7cb8bb;
	}
	html,body{
		font-size   : 16px;
		height      : 100%;
		padding     : 2em;
		margin      : 0px;
		font-family : monospace;
	}
	body,h1,h2,h3,h4,h5,h6,p,ol,ul{
		margin      : 0px;
		padding     : 0px;
		font-weight : normal;
	}
	body,input,textarea{
		color            : var(--white);
		background-color : var(--black);
	}
	*{
		box-sizing: border-box;
	}
	.container{
		width     : calc(100% - 60px);
		max-width : 85rem;
		margin    : 0 auto;
	}

	button{
		font-family: monospace;
		border: 1px solid var(--green);
		cursor: pointer;

	}

	input[type='text']{
		border        : 1px solid var(--yellow);
		outline       : none;
		padding       : 0.2em 0.3em;
		font-family   : monospace;
		border-radius : 3px;

		&:focus{
			border-color: var(--green);
		}
	}
`;

module.exports = {
	css : css, //(typeof window !== 'undefined') ? css : ()=>{}
	comp,x,cx,xo
}