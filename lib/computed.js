class Computed {
	constructor(vm){
		this.vm = vm
		this.init()
	}
	//计算属性
	init(){
		let computed = this.vm.$computed
		if(!isObject(computed)) return
		this.vm.proxyData(computed)
		Object.keys(computed).forEach( key => this.initComputed(key, computed[key]))
		delete this.$computed
	}
	initComputed(key, cd){
		new Watcher(this, key, function(){
			this[key] = cd()
		})
	}
}
