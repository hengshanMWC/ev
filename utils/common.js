//只能是object非array类型
function isObject(data){
	return data && typeof data === 'object' && !Array.isArray(data)
}
function isY(val){
	return val !== '' && val !== undefined && val !== null
}

