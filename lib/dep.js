class Dep {
	static target = null
	constructor(){
		this.subs = []
	}
	addSub(watcher){
		this.subs.push(watcher)
	}
	notify(){
		this.subs.forEach( watcher => {
			watcher.update()
		})
	}
}