class CoreTimer {
	constructor(defaultValue = {}) {
		this.defaultTime = defaultValue.time ??= { h: 0, m: 0, s: 0 };
		this.time = { ...this.defaultTime }
		this.interval = defaultValue.interval ??= 200;
		this.idTime = defaultValue.idTime ??= null;
		this.setTimeUi = null 
	}

	start() {
		this.idTime = setInterval(() => {
			this.calcTime();
			this.chekcAndSetTimeUi(this.time)
		}, this.interval);
	}
	stop() {
		clearInterval(this.idTime)
	}
	reset() {
		this.stop()
		this.time = { ...this.defaultTime } 
		this.chekcAndSetTimeUi(this.defaultTime)
	}
	exportData(){
		return {
			time : this.defaultTime,
			interval : this.interval,
			idTime : this.idTime
		}
	}
	calcTime() {}
	chekcAndSetTimeUi(value){
		if(typeof this.setTimeUi == 'function') 
			this.setTimeUi(value)
	}
}

class Stopwatch extends CoreTimer {
		constructor(defaultValue = {}){
			defaultValue.interval = defaultValue.interval ??= 1000
			super(defaultValue)
		}
		calcTime() {
			let s = this.time.s
			let m = this.time.m
			let h = this.time.h

			this.time.h = s != 59 ? h
						: m != 59 ? h
						: h + 1
			this.time.m = s != 59 ? m 
						: m != 59 ? m + 1 
						: 0
			this.time.s = s != 59 ? s + 1 
						: 0
		}
		exportData(){
			let data = super.exportData()
			return { type: 'stopwatch', data: data}
		}
}
class Alarm extends CoreTimer {
		constructor(defaultValue = {}){
			defaultValue.interval = defaultValue.interval ??= 1000
			super(defaultValue)
		}
		setTime(newTime){
			this.time = newTime
		}
		calcTime(){
			let now = new Date()
			if( this.isNowEqualTimer(now) ) this.ring()
		}
		isNowEqualTimer( now ){
			return now.getHours() == this.time.h 
						&& now.getMinutes() == this.time.m 
						&& now.getSeconds() == this.time.s
		}
		ring(){
			this.stop()
			this.actionAfterRing()
		}
		actionAfterRing(){ 
		}

		exportData(){
			let data = super.exportData()
			return { type: 'alarm', data: data}
		}
}
class Timer extends Alarm {
		constructor(defaultValue = {}){
			defaultValue.time = defaultValue.time ??= { h:0, m:5, s:0 }
			super(defaultValue)
		}
	calcTime(){
		let s = this.time.s
		let m = this.time.m
		let h = this.time.h

		this.time.h = m != 0 ? h
				: h != 0 ? h - 1
				: 0
		this.time.m = s != 0 ? m 
				: m != 0 ? m - 1
				: h != 0 ? 59
				: 0
		this.time.s = s != 0 ? s - 1
				: m != 0 ? 59
				: h != 0 ? 59
				: 0
			if( this.isTimeEqual0() ) this.ring()
	}
	isTimeEqual0(){
		return this.time.h == 0 && this.time.m == 0 && this.time.s == 0
	}
		exportData(){
			let data = {
				time : this.defaultTime,
				interval : this.interval,
				idTime : this.idTime
			}
			return { type: 'timer', data: data}
		}
}

class TrackTimer {
		constructor(args = {}){
			this.timer = null
			this.setTimer(args.timer ??= {})

			this.title = args.title ??= ''
			this.tags = args.tags ??= []
		}
		
		start(){	
			this.timer.start()
		}
		stop(){
			this.timer.stop()
		}
		reset(){
			this.timer.reset()
		}

		setTimer(timer){
			this.#checkTimer(timer)
			this.timer = timer
		}
		setTitle(value){
			this.title = this.#htmlEntities(value)
		}
		addTags(tag){
				this.tags.push(tag)
		}
		removeTag(tag){
			this.tags = this.tags.filter(e => e !== tag)	
		}

		exportData() {
		 return {
				 timer: this.timer.exportData(),
				 track: { title: this.title, tags: this.tags }
		 }
		}

		#htmlEntities(str) {
				return String(str)
						.replace(new RegExp('"','g'), '&quot;')
						.replace(new RegExp("'",'g'), '&quot;')
		}
		#checkTimer(timer){
			if(!timer || !(timer instanceof CoreTimer))
				throw new Error('We can\'t initialize without coreTimer')
		}
}
class GroupTimer {
	constructor(data = {}){
			this.group = []
			if(data.group && data.group.length > 0) 
					this.group = this.#importGroup(data.group)

			this.orderTimers = data.orderTimers ??= []
			this.countIds = data.countIds ??= 0
	}

	add(typeTimer){
			this.group.push(this.#instanceTimer(typeTimer))
			this.#initOrderTimers()
	}
	remove(index){
		let childrenDeleted = this.orderTimers[index].children
		let parentsDeleted = this.orderTimers[index].parents

		this.group.splice(index, 1)
		this.orderTimers.splice(index, 1)
		this.#rebuildParentsAndChildrenTree(index, childrenDeleted, parentsDeleted)
	}

		//stop all timer but won't deactivation them
		stop(){
				this.#exploreTimersGroup((index) => {
					this.group[index].stop()	
				})
		}
		reset(){
				this.#exploreTimersGroup((index) => {
					this.group[index].reset()	
				})
		}
		start(){
			for(let i = 0; i < this.group.length; i++){
				if(this.orderTimers[i].state === 1){
						this.group[i].start()	
						break
				}
			}
		}
		//Using for Stopwatch
		stopManually(index){
			this.group[index].stop()	
			this.orderTimers[index].state = 0
			this.#fireStartChildren(this.orderTimers[index].children)
		}
		linkChildren(currentTimerIndex, children){
			if( !Array.isArray(children) ) 
				throw new Error('2e argument of linkNextTimer() isn\'t a array')

			let orderTimer = this.orderTimers[currentTimerIndex]
			orderTimer.children = children

			this.#addParentToChild(currentTimerIndex, children)
			this.#cutOffLinkBetweenComponentNextTimer(orderTimer.children)
		}
		exportData(){
			let groupTimers = []
			if(this.group.length > 0) groupTimers = this.#exportGroupTimer(this.group)
			let data = {
					group: groupTimers,
					orderTimers: this.orderTimers,
					countIds: this.countIds
			}	
			return data
		}

		#exportGroupTimer(group){
			let exportGroup = []
				for(let i = 0; i < group.length; i++){
					exportGroup.push(this.group[i].exportData())
				}
				return exportGroup
		}

		// PRIVATE METHODES
		#instanceTimer(typeTimer, data = { timer: {}, track: {} }){
				let timer, track
				switch(typeTimer){
						case 'stopwatch':
								timer = new Stopwatch(data.timer.data)
								break
						case 'alarm':
								timer = new Alarm(data.timer.data)
								break
						case 'timer':
								timer = new Timer(data.timer.data)
								break
						default :
								throw new Error("Type of timer doesn't existe")
				}
				track = new TrackTimer({
						timer: timer, 
						title: data.track.title,
						tags: data.track.tags
				})
				return track
		}
		#importGroup(groups){
			let groupInstance = []
			for(const group of groups){
				let type = group.timer.type
				groupInstance.push(this.#instanceTimer(type, group))	
			}
				return groupInstance
		}
		#exploreTimersGroup(fn){
			for(let i = 0; i < this.group.length; i++){
				fn(i)
			}
		}
		#initOrderTimers(){
			let currentId = this.countIds
			/**
			 * id {number}: order ID
			 * state {bool}: 1 = ready, 0 = finish
			 * children {array} : [id]
			 * parents {array} : [id]
			 */
			let data = {
				id : currentId,
				state : 1,
				children : [],
				parents : []
			}
			this.orderTimers.push(data)
			this.countIds++

			//init parents
			let sizeOrder = this.orderTimers.length
			if(this.orderTimers[sizeOrder - 2] != undefined)
				this.orderTimers[sizeOrder - 1].parents = [this.orderTimers[sizeOrder - 2].id]

			// Modif precedent Timer
			let beforeIndex = sizeOrder - 2 < 0 ? null : sizeOrder - 2
			// Precedent Timer doesn't existe
			if(beforeIndex === null) return 0

			let beforeOrderTimer = this.orderTimers[beforeIndex]
			beforeOrderTimer.children.push( this.orderTimers[sizeOrder - 1].id )

			// Precedent Timer isn't Stopwatch
			if(this.group[beforeIndex].timer instanceof Stopwatch) return 0

			const childrenStart = () => this.#fireStartChildren(beforeOrderTimer.children)
			this.group[beforeIndex].timer.actionAfterRing = () => {
					this.orderTimers[beforeIndex].state = 0
					childrenStart()
			}
		}
		#fireStartChildren(children){
			for(const childId of children) {
				let index = this.#idToIndex(childId)
				this.group[index].start()
			}
		}
		#idToIndex(id){
			for(let i = 0; i < this.orderTimers.length; i++)
				if(this.orderTimers[i].id	== id) return i
		}
		#rebuildParentsAndChildrenTree(index, childrenDeleted, parentsDeleted){
			
			let sizeOrder = this.orderTimers.length
			if(sizeOrder == 1){
				this.orderTimers[0].children = []
				this.orderTimers[0].parents = []
				return 0
			}

			for(const parentId of parentsDeleted){
				let indexParent = this.#idToIndex(parentId)
				let orderParent = this.orderTimers[indexParent]
				orderParent.children = orderParent.children.filter((e) => e != index) 
			}
			for(const childId of childrenDeleted){
				let indexChild = this.#idToIndex(childId)
				let orderChild = this.orderTimers[indexChild]
				orderChild.parents = orderChild.parents.filter((e) => e != index) 
			}
		}
		#addParentToChild(indexParent, children){
			for(const child of children){
					let index = this.#idToIndex(child)
					let orderChild = this.orderTimers[index]
					let isParentInclude = orderChild.parents.includes(indexParent)
					if(!isParentInclude) orderChild.parents.push(indexParent)
			}
		}
		#cutOffLinkBetweenComponentNextTimer(children){
			for(const child of children){
					let index = this.#idToIndex(child)
					let newParents = this.orderTimers[index]
							.parents
							.filter((index) => !children.includes(index))
					let newChildren = this.orderTimers[index]
							.children
							.filter((index) => !children.includes(index))

					this.orderTimers[index].children = newChildren
					this.orderTimers[index].parents = newParents
			}
		}

}

export { 
		CoreTimer,
		Stopwatch,
		Alarm,
		Timer,
		TrackTimer,
		GroupTimer
}
