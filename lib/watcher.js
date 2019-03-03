class Watcher {
	constructor(vm, exp, cd){
		this.vm = vm;
		this.exp = exp;
		this.cd = cd.bind(vm);
		this.value = this.get()
	}
	//有的key是a.b.c
	get key(){
		return getAnalysisKey(this.vm,this.exp)
	}
	update(){
		this.run()
	}
	run(){
		let oldValue = this.value
		let newValue = this.key
		if(oldValue === newValue) return
		this.cd()	
	}
	get(){
		Dep.target = this;
		let value = this.key
		Dep.target = null
		return value
	}
}