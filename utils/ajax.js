function ajax(api, data = {}, method = 'GET'){
	return new Promise((resolve, reject) => {
		let req =  new XMLHttpRequest()
		req.onreadystatechange = function(){
			if(req.readyState === 4){
				if(req.status === 200){
					resolve(req.responseText)
				} else {
					reject(req.status)
				}
			}
		}
		req.open(method, api)
		req.send(data)
	})
}