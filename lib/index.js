class VE {
	constructor(opt){
		let opts = {
			'data': false,
			'computed': false,
			'el': true,
			'methods': false,
			'beforeCreate': false,
			'created': false,
			'beforeMount': false,
			'mounted': false,
		}
		this.defPot(opt,opts)
		this.init()
	}
	init(){
		let unfold = [
			'methods'
		]
		this.lifecycle('beforeCreate')
		new Observer(this,this.$data)
		this.unfold(unfold)
		this.proxyData(this.$data)
		new Computed(this)
		this.lifecycle('created')
		new Compile(this, this.$el)
		this.lifecycle('mounted')	
	}
	//改为$
	defPot(opt, opts){
		Object.keys(opts).forEach( key => {
			let value
			let v = opts[key]
			if(v !== undefined){
				value = opt[key]
			}
			if(value){
				Object.defineProperty(this, '$' + key, {
					enumerable: v,
					configurable: true,
					value,
				})
			}
		})
	}
	
	//摊开到this上
	unfold(arr){
		arr.forEach( key => {
			let data = this['$' +  key]
			Object.keys(data).forEach( val => {
				this[val] = data[val]
			}) 
		})
	}
	//代理data
	proxyData(data){
		let that = this;
		let val;
		Object.keys(data).forEach( key => {
			// this.isObject(data[key])
			Object.defineProperty(that, key, {
				enumerable: false,
				configurable: true,
				get: function getter () {
					val = data[key]
					if(typeof val === 'function'){
						return val.call(that)
					} else {
						return val
					}
				},
				set: function setter (newVal) {
					if(newVal === val) return
					val = newVal
				    data[key] = val;
					// this.observe(data)
				}
			})
		})
	}
	lifecycle(name){
		this['$' + name]()
	}
	//递归
	observe(data){
		if(!isObject(data)) return
		this.proxyData(data)
	}
}
