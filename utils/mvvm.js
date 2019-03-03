//根据a.b.c
function getAnalysisKey(vm,exp){
	let key = exp.split('.')
	return  key.length > 1 
	? key.reduce((obj, newKey) => obj[newKey], vm)
	: vm[exp]
}
//根据a.b.c
function setAnalysisKey(vm, exp){
	let key = exp.split('.')
	if(key.length > 1){
		exp = key.pop()
		let data = key.reduce((obj, newKey) => obj[newKey], vm)
		return {data,key: exp}
	} else {
		return {data: vm, key: exp}
		
	}
}