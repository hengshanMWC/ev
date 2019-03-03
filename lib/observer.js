class Observer{
	constructor(vm, data){
		this.vm = vm
		this.walk(data)
	}
	walk(data){
		Object.keys(data).forEach( key => this.defineReactive(data, key, data[key]))
	}
	defineReactive(obj, key, val){
		this.observe(val)
		let dep = new Dep()
		Object.defineProperty(obj, key, {
			enumerable: true,
    		configurable: true,
    		get(){
    			if(Dep.target){
    				dep.addSub(Dep.target)
    			}
    			return val
    		},
    		set(newVal){
    			if(val === newVal) return
				val = newVal
				dep.notify()
    		}
		})
	}
	observe(data){
		if(!isObject(data)) return
		new Observer(this.vm, data)
	}
}

