const app = new VE({
	el: '#app',
	data: {
		title: '',
		name: '',
		sex: '',
		url: '',
		born: 1996,
		year: 2019,
		study: {
			chinese: 100,
			english: 100,
			math: 100,
		}
	},
	//计算属性
	computed: {
		age(){
			return this.year - this.born
		},
		score(){
			let study = this.study
			return Object.keys(study).reduce((val, newKey) => val + Number(study[newKey]),0)
		},
		gender(){
			let sex = this.sex
			let map = {
				'女': sex === 0,
				'男': sex === 1,
				'双性人': !isNaN(sex) && sex !== 0 && sex !== 1,
				'外星人': isNaN(sex),
			}
			return Object.keys(map).find( key => map[key])
		}
	},
	methods: {
		editTitle(){
			this.title = '随机数：' + Math.random() 
		},
		toGithub(){
			location.href = this.url
		}
	},
	//4种生命周期
	beforeCreate(){
		document.title = 'beforeCreate'
		console.log(this)
	},
	created(){
		ajax('./static/userInfo.json')
		.then( res => {
			console.log(res)
			res = JSON.parse(res)
			this.name = res.name
			this.sex = res.sex
		})
		console.log(this)
	},
	beforeMount(){
		ajax('./static/githubUrl.text')
		.then( res => {
			this.url = res
		})
		console.log(this)
	},
	mounted(){
		console.log(this)
	},
})