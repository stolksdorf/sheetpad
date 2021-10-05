

/*

Function('"use strict";return (' + obj + ')')();

*/


module.exports = (code, ...inputs)=>{
	let logs = [], error, output;



	const console = {
		log : (...args)=>logs.push(args)
	};

	try{
		//output = Function('"use strict";return (' + code + ')')();
		output = eval(`(()=>{
			let input1 = "${inputs[0]}";
			${code}
		})()`);
	}catch(err){
		error = err;
		logs.push(err);
	}

	return {
		output, logs, error
	}
}