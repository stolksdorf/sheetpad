

/*

Function('"use strict";return (' + obj + ')')();

*/


//TODO: add timer to run

module.exports = (code, ...inputs)=>{
	let logs = [], error, result;


console.log('FOO', global.input1)

	try{

		const console = {
			log : (...args)=>logs.push(args)
		};

		let startTime = Date.now();



		//result = Function('"use strict";return (' + code + ')')();
		result = eval(`(()=>{
				let raw1 = \`${global.sheet1.raw}\`;
				let sheet1 = ${global.sheet1.sheet
					? JSON.stringify(global.sheet1.sheet)
					: '[]'};
				let raw2 = \`${global.sheet2.raw}\`;
				let sheet2 = ${JSON.stringify(global.sheet2.sheet)};
				let raw3 = \`${global.sheet3.raw}\`;
				let sheet3 = ${JSON.stringify(global.input3.sheet)};

				${code}

		})()`);

		logs.push([`Code finished: ${Date.now() - startTime}ms`]);
	}catch(err){
		error = err;
		console.error('ERROR')
		console.error(err)
		console.log(err.lineNumber)
		console.log(err.stack)

		console.log(Object.keys(err))
		//process error to get actual line number
		logs.push(err);
	}



	return {
		result, logs, error
	}
}