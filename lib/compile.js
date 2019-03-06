class Compile {
	constructor(vm, el){
		this.vm = vm
		this.el = document.querySelector(el)
		this.dom = null
		this.init()
	}
	init(){
		if(this.el){
			this.dom = this.getDocumentFragment()
			this.startCompile(this.dom)
			this.el.appendChild(this.dom)
		} else {
			console.log('el不存在')
		}
	}
	/**
	* 添加到虚拟dom
	*/
	getDocumentFragment(){
		let el = this.el
		let dom = document.createDocumentFragment()
		this.vm.lifecycle('beforeMount')
		let node = el.firstChild;
		while(node) {
			dom.appendChild(node)
			node = el.firstChild
		} 
		return dom
	}
	//开始解析模板
	startCompile(dom){
		Array.from(dom.childNodes).forEach( node => {
			let reg = /\{\{(.*)\}\}/
			let type = node.nodeType
			let text = node.textContent.trim()
			//元素
			if(type === 1){
				this.compileElement(node)	
			} else if(type === 3 && reg.test(text)){
				//文本
				reg.exec(text)[0]
				let dataKey = reg.exec(text)
				
				this.compileText(node, dataKey)
			}
			if(node.childNodes && node.childNodes.length){
				this.startCompile(node)
			}
		})
	}
	//元素节点
	compileElement(node){
		Array.from(node.attributes).forEach( attr => {
			let attrName = attr.name
			if(this.isV(attrName)){
				this[attrName.slice(2)](node, attr.value)
				node.removeAttribute(attr.name)
			} else if(this.isEvent(attrName)){
				let name = this.delEvent(attrName)
				this.complieEvent(node, attr.value, name)
				node.removeAttribute(attr.name)
			}
		})
	}
	//文本节点
	compileText(node, dataKey){
		let that = this
		let signText = node.textContent
		let sign = dataKey[0]
		let key = dataKey[1]
		new Watcher(this.vm, key, function(){
			that.setText(node, getAnalysisKey(this, key), sign, signText)
		}).cd.call(that.vm)
	}
	//v-model
	model(node,key){
		let that = this
		let oldVal = getAnalysisKey(that.vm, key)
		that.setValue(node, oldVal)
		new Watcher(this.vm, key, function(){
			that.setValue(node, getAnalysisKey(this, key))
		})
		node.addEventListener('input', e => {
			let newVal = e.target.value
			if(oldVal === newVal) return
			let obj = setAnalysisKey(that.vm, key)
			obj.data[obj.key] = newVal//出发set
			oldVal = newVal
		})
	}
	//事件
	complieEvent(node, value, name){
		function fn(...arr){
			this[value](...arr)
		}
		let vmFn = fn.bind(this.vm)
		node.addEventListener(name, vmFn)
	}
	//v-
	isV(attr){
		return /^v-/.test(attr)
	}
	//v-on:
	isEvent(attr){
		return /^@|(v-on:)/.test(attr)
	}
	//清除点事件的后缀
	delEvent(attr){
		return attr.replace(/^@|(v-on:)/, "")
	}
	//输入框
	setValue(node, val){
		node.value = val === undefined ? '' : val
	}
	//文本节点
	setText(node, val, sign, singText){
		let objReg = new RegExp(`${sign}`,'g')
		node.textContent = singText.replace(objReg, val === undefined ? '' : val)

	}
}