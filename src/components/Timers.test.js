import { 
		CoreTimer,
		Stopwatch, 
		Alarm,
		Timer,
		TrackTimer,
		GroupTimer 
} from './Timers'

describe("TIME TRACK", () => {
describe("# CoreTimer", () => {
	let timer = null;
	beforeEach(() => {
		timer = new CoreTimer();
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.restoreAllMocks();
	});

	it("should default value for timer", () => {
		expect(timer.time).toStrictEqual({ h: 0, m: 0, s: 0 });
		expect(timer.interval > 0).toBe(true);
		expect(timer.idTime == null).toBe(true);
	});
	it("should customized default value", () => {
		const customizedValue = {
			time: { h: 5, m: 3, s: 9 },
			interval: 500,
			idTime: 2,
		};
		timer = new CoreTimer(customizedValue);
		expect(timer.time).toStrictEqual(customizedValue.time);
		expect(timer.interval).toBe(customizedValue.interval);
		expect(timer.idTime).toBe(customizedValue.idTime);
	});
		it("should export data", () => {
				let timerData = { time: {h:0,m:2,s:3}, interval: 500, idTime: 2}
				const customizedValue = {
						time: timerData.time,
						interval: timerData.interval,
						idTime: timerData.idTime
				};
				timer = new CoreTimer(customizedValue);
				let data = timer.exportData()

				expect(data).toStrictEqual(timerData)
		})

	describe("## start", () => {
		it("should init setInterval", () => {
			jest.spyOn(global, "setInterval");

			timer.start();

			expect(setInterval).toHaveBeenCalled();
			expect(timer.idTime).not.toBe(null);
		});
		it("should call calcTime", () => {
			//Customise setTimeout and setInterval for the nexts tests
			jest.useFakeTimers();
			jest.spyOn(timer, "calcTime");

			timer.start();
			jest.runOnlyPendingTimers();

			expect(timer.calcTime).toHaveBeenCalled();
			jest.useRealTimers();
		});
		it("should modif value of time", () => {
			jest.useFakeTimers();
			timer.calcTime = () => timer.time.s++;

			timer.start();
			jest.runOnlyPendingTimers();

			expect(timer.time).toStrictEqual({ h: 0, m: 0, s: 1 });
			jest.useRealTimers();
		});
	});
	describe("## stop", () => {
		it("should cancel setInterval", () => {
			jest.spyOn(global, "clearInterval");
			timer.start();
			timer.stop();

			expect(clearInterval).toHaveBeenCalled();
		});
	});
	describe("## reset", () => {
		it("should cancel setInterval", () => {
			jest.spyOn(global, "clearInterval");
			timer.start();
			timer.reset();

			expect(clearInterval).toHaveBeenCalled();
		});
		it("should reset default value of timer", () => {
			let valueDefault = {
				time: JSON.parse(JSON.stringify(timer.time)),
				interval: timer.interval,
				idTime: timer.idTime,
			};

			timer.time = { h: 1, m: 2, s: 3 };
			timer.reset();

			expect(timer.time).toStrictEqual(valueDefault.time);
		});
		it("should reset default custom value of timer", () => {
			let valueCustom = {
				time: { h: 2, m: 3, s: 10 },
				interval: 400,
				idTime: 12,
			};
			timer = new CoreTimer(valueCustom);
			let valueDefault = {
				time: JSON.parse(JSON.stringify(timer.time)),
				interval: timer.interval,
				idTime: timer.idTime,
			};

			timer.time.s = timer.time.s + 1 
			timer.reset();

			expect(timer.time).toStrictEqual(valueDefault.time);
		});
	});
});

describe('# Stopwatch', () => {
	let stopwatch = null
	beforeEach(() => {
		stopwatch = new Stopwatch()	
	})
		it('should to have default value', () => {
			//Stopwatch have a specific default interval
			expect(stopwatch.time).not.toBe({ h:0, m:0, s:0 })
			expect(stopwatch.interval).toBe(1000)
			expect(stopwatch.idTime).toBe(null)
		})
		it('should to have custom default value', () => {
			let customValue = {
					time : { h:2, m:0, s:3 },
					interval : 250,
			}
			stopwatch = new Stopwatch(customValue)
			expect(stopwatch.time).toStrictEqual(customValue.time)
			expect(stopwatch.interval).toBe(customValue.interval)
		})

		it("should export data", () => {
				let timerData = { time: {h:0,m:2,s:3}, interval: 500, idTime: 2}
				const customizedValue = {
						time: timerData.time,
						interval: timerData.interval,
						idTime: timerData.idTime
				};
				stopwatch = new Stopwatch(customizedValue);
				let data = stopwatch.exportData()

				expect(data).toStrictEqual({type: 'stopwatch', data:timerData})
		})

		describe('## start', () => {
			it('should to have increment seconde time value', () => {
				jest.useFakeTimers()

				stopwatch.start()
				jest.runOnlyPendingTimers()

				expect(stopwatch.time.s).toBe(1)
				expect(stopwatch.time.m).toBe(0)
				expect(stopwatch.time.h).toBe(0)
				jest.useRealTimers()
			})
			it('should to have increment minute time value', () => {
				let customValue = {
					time : { h:0, m:2, s:59 },
				}
				stopwatch = new Stopwatch(customValue)
				jest.useFakeTimers()

				stopwatch.start()
				jest.runOnlyPendingTimers()

				expect(stopwatch.time.s).toBe(0)
				expect(stopwatch.time.m).toBe(3)
				expect(stopwatch.time.h).toBe(0)
				jest.useRealTimers()
			})
			it('should to have increment minute time value', () => {
				let customValue = {
					time : { h:2, m:59, s:59 },
				}
				stopwatch = new Stopwatch(customValue)
				jest.useFakeTimers()

				stopwatch.start()
				jest.runOnlyPendingTimers()

				expect(stopwatch.time.s).toBe(0)
				expect(stopwatch.time.m).toBe(0)
				expect(stopwatch.time.h).toBe(3)
				jest.useRealTimers()
			})
		})

})
describe('# Alarm', () => {
	let alarm = null
	beforeEach(() => {
		alarm = new Alarm()	
	})
		it('should to have default value', () => {
			//Alarm have a specific default interval
			expect(alarm.time).toStrictEqual({ h:0, m:0, s:0 })
			expect(alarm.interval).toBe(1000)
			expect(alarm.idTime).toBe(null)
		})
		it('should to have custom default value', () => {
			let customValue = {
					time : { h:2, m:0, s:3 },
					interval : 250,
			}
			alarm = new Alarm(customValue)
			expect(alarm.time).toStrictEqual(customValue.time)
			expect(alarm.interval).toBe(customValue.interval)
		})

		it("should export data", () => {
				let timerData = { time: {h:0,m:2,s:3}, interval: 500, idTime: 2}
				const customizedValue = {
						time: timerData.time,
						interval: timerData.interval,
						idTime: timerData.idTime
				};
				alarm = new Alarm(customizedValue);
				let data = alarm.exportData()

				expect(data).toStrictEqual({type: 'alarm', data:timerData})
		})

		describe('## setTime', () => {
			it('should fire set method to modify time value', () => {
					const customValue = { h:1, m:2, s:3 }
					alarm.setTime(customValue)
					expect(alarm.time).toStrictEqual(customValue)
			})
		})
		describe('## start', () => {
			it('should fire ring methode when time has come', () => {
				jest.useFakeTimers()
					.setSystemTime(new Date('December 17, 2021 01:02:03'))
				let ring = jest.spyOn(alarm, 'ring')
				alarm.setTime({ h:1, m:2, s:4 })

				alarm.start()
				jest.runOnlyPendingTimers()

				expect(ring).toHaveBeenCalled()
				jest.useRealTimers()
			})
			it('shouldn\'t fire ring methode when time hasn\'t come', () => {
				jest.useFakeTimers()
					.setSystemTime(new Date('December 17, 2021 11:02:03'))
				let ring = jest.spyOn(alarm, 'ring')
				alarm.setTime({ h:1, m:2, s:4 })

				alarm.start()
				jest.runOnlyPendingTimers()

				expect(ring).not.toHaveBeenCalled()
				jest.useRealTimers()
			})
		})
})
describe('# Timer', () => {
	let timer = null
	beforeEach(() => {
		timer = new Timer()	
	})
		it('should to have default value', () => {
			//timer have a specific default interval
			expect(timer.time).toStrictEqual({ h:0, m:5, s:0 })
			expect(timer.interval).toBe(1000)
			expect(timer.idTime).toBe(null)
		})
		it('should to have custom default value', () => {
			let customValue = {
					time : { h:2, m:0, s:3 },
					interval : 250,
			}
			timer = new Timer(customValue)
			expect(timer.time).toStrictEqual(customValue.time)
			expect(timer.interval).toBe(customValue.interval)
		})

		it("should export data", () => {
				let timerData = { time: {h:0,m:2,s:3}, interval: 500, idTime: 2}
				const customizedValue = {
						time: timerData.time,
						interval: timerData.interval,
						idTime: timerData.idTime
				};
				timer = new Timer(customizedValue);
				let data = timer.exportData()

				expect(data).toStrictEqual({type: 'timer', data:timerData})
		})

		describe('## setTime', () => {
			it('should fire set method to modify time value', () => {
					const customValue = { h:1, m:2, s:3 }
					timer.setTime(customValue)
					expect(timer.time).toStrictEqual(customValue)
			})
		})
		describe('## start', () => {
				beforeEach(() => {
					jest.useFakeTimers()
				})
				afterEach(() => {
					jest.useRealTimers()
				})

			it('should not reduce seconds when time value is equal 0', () => {
				timer.setTime({ h:0, m:0, s:0 })		

				timer.start()	
				jest.runOnlyPendingTimers()

				expect(timer.time.s).toBe(0)
				expect(timer.time.m).toBe(0)
				expect(timer.time.h).toBe(0)
			})
			it('should reduce seconds of time value', () => {
				timer.setTime({ h:1, m:2, s:3 })		

				timer.start()	
				jest.runOnlyPendingTimers()

				expect(timer.time.s).toBe(2)
				expect(timer.time.m).toBe(2)
				expect(timer.time.h).toBe(1)
			})
			it('should reduce minutes of time value', () => {
				timer.setTime({ h:1, m:2, s:0 })		

				timer.start()	
				jest.runOnlyPendingTimers()

				expect(timer.time.s).toBe(59)
				expect(timer.time.m).toBe(1)
				expect(timer.time.h).toBe(1)
			})
			it('should reduce hours of time value', () => {
				timer.setTime({ h:1, m:0, s:0 })		

				timer.start()	
				jest.runOnlyPendingTimers()

				expect(timer.time.s).toBe(59)
				expect(timer.time.m).toBe(59)
				expect(timer.time.h).toBe(0)
			})

			it('should fire ring methode when time value is up', () => {
				let ring = jest.spyOn(timer, 'ring')
				timer.setTime({ h:0, m:0, s:1 })

				timer.start()
				jest.runOnlyPendingTimers()

				expect(ring).toHaveBeenCalled()
			})
			it('shouldn\'t fire ring methode when time value isn\'t up', () => {
				let ring = jest.spyOn(timer, 'ring')
				timer.setTime({ h:1, m:2, s:4 })

				timer.start()
				jest.runOnlyPendingTimers()

				expect(ring).not.toHaveBeenCalled()
			})
		})
})

describe('# TrackTimer', () => {

		describe('## init', () => {
				it('shound throw error when init without arg', () => {
						expect(() => new TrackTimer()).toThrow()
				})
				it('shound throw error when init with arg isn\'t CoreTimer', () => {
						class Test { }
						let test = new Test()
						expect(() => new TrackTimer(test)).toThrow()
				})
				it('shouldn\'t init without coreTimer in arg #empty', () => {
						try {
								let trackTimer_timer = new TrackTimer()				
						} catch(e){
								expect(e.message).toEqual('We can\'t initialize without coreTimer')
						}
				})
				it('shouldn\'t init without coreTimer in arg #falseArg', () => {
						class Test { }
						let test = new Test()
						try {
								let trackTimer_timer = new TrackTimer(test)				
						} catch(e){
								expect(e.message).toEqual('We can\'t initialize without coreTimer')
						}
				})

				it('should init with coreTimer in arg #Timer', () => {
						let timer = new Timer()
						let trackTimer= new TrackTimer({timer: timer})
						
						expect(() => new TrackTimer({timer: timer})).not.toThrow()
						expect(trackTimer.timer).toBeInstanceOf(Timer)
				})
				it('should init with coreTimer in arg #Alarm', () => {
						let timer = new Alarm()
						let trackTimer= new TrackTimer({timer})				
						
						expect(() => new TrackTimer({timer})).not.toThrow()
						expect(trackTimer.timer).toBeInstanceOf(Alarm)
				})
				it('should init with coreTimer in arg #Stopwatch', () => {
						let timer = new Stopwatch()
						let trackTimer= new TrackTimer({timer})
						
						expect(() => new TrackTimer({timer})).not.toThrow()
						expect(trackTimer.timer).toBeInstanceOf(Stopwatch)
				})

			it('should init propreties #title, #tags', () => {
					let timer = new Stopwatch()
					let trackTimer= new TrackTimer({timer})

					expect(typeof trackTimer.title).toBe('string')
					expect(typeof trackTimer.tags).toBe('object')
			})
		})
		describe('## action', () => {
				it("should call start and modif value of time", () => {
						jest.useFakeTimers();
						let timer = new Stopwatch()
						let start = jest.spyOn(timer, "start");
						timer.calcTime = () => timer.time.s++;
						let trackTimer = new TrackTimer({timer})

						trackTimer.start();
						jest.runOnlyPendingTimers();

						expect(start).toHaveBeenCalled();
						expect(trackTimer.timer.time).toStrictEqual({ h: 0, m: 0, s: 1 });
						jest.useRealTimers();
				});
				it("should call stop", () => {
						let timer = new Stopwatch()
						let stop = jest.spyOn(timer, "stop");
						let trackTimer = new TrackTimer({timer})

						trackTimer.start();
						trackTimer.stop();

						expect(stop).toHaveBeenCalled();
				});
				it("should call reset", () => {
						let timer = new Stopwatch()
						let reset = jest.spyOn(timer, "reset");
						let trackTimer = new TrackTimer({timer})

						trackTimer.start();
						trackTimer.reset();

						expect(reset).toHaveBeenCalled();
				});
				it("should save time of timer when call stop", () => {
						jest.useFakeTimers();
						let timer = new Stopwatch()
						timer.calcTime = () => timer.time.s++;
						let trackTimer = new TrackTimer({timer})

						trackTimer.start();
						jest.runOnlyPendingTimers();
						jest.runOnlyPendingTimers();
						trackTimer.stop();

						expect(trackTimer.timer.time).toStrictEqual({ h: 0, m: 0, s: 2 });
						jest.useRealTimers();
				});

				describe('### propreties', () => {
						let trackTimer = null
						beforeEach(() => {
							let timer = new Stopwatch()
							trackTimer = new TrackTimer({timer})
						})

				it('should set title with respecting the contraints', () => {
						trackTimer.setTitle('Salut les gens')
						expect(trackTimer.title).toBe('Salut les gens')

						trackTimer.setTitle('"test"')
						expect(trackTimer.title).toBe('&quot;test&quot;')

						trackTimer.setTitle("'test'")
						expect(trackTimer.title).toBe('&quot;test&quot;')
				})
						it('should add tags', () => {
							let tag = 'sport'
							let tag2 = 'exo'
							trackTimer.addTags(tag)
							trackTimer.addTags(tag2)
							expect(trackTimer.tags).toStrictEqual([tag, tag2])
						})
						it('should remove specifique tag', () => {
							let tag = 'sport'
							let tag2 = 'exo'

							trackTimer.addTags(tag)
							trackTimer.addTags(tag2)
							trackTimer.removeTag(tag)

							expect(trackTimer.tags).toStrictEqual([tag2])
						})
				})
		})
		describe('## export', () => {
			it('should export data', () => {
					let timerData = { time: {h:0,m:2,s:3}, interval: 500, idTime: null}
					let timer = new Stopwatch(timerData)
					const data = {
							timer: timer.exportData(),
							track: { title: 'test', tags: ['cook', 'egg'] }
					}
					let trackTimer= new TrackTimer({
							timer, 
							title: 'test', 
							tags: ['cook', 'egg']
					})
					const dataReturn = trackTimer.exportData()
					expect(dataReturn).toStrictEqual(data)
			})

		})

})
describe('# GroupTimer', () => {
	let groupTimer = null
	beforeEach(() => {
		groupTimer = new GroupTimer()
	})

	it('should init with default value', () => {
			expect(groupTimer.group).toStrictEqual([])
			expect(groupTimer.orderTimers).toStrictEqual([])
			expect(groupTimer.countIds).toBe(0)
	})
	it('export data', () => {
			let timerData0 = { time: {h:0,m:2,s:3}, interval: 500, idTime: null}
			let timerData1 = { time: {h:1,m:0,s:1}, interval: 200, idTime: null}
			let timerData2 = { time: {h:11,m:0,s:0}, interval: 1000, idTime: null}

			let data = {
					group: [
							{timer: {type: 'stopwatch', data: timerData0},
							 track: { title: 'train', tags: ['sport'] }
							},
							{timer: {type: 'timer', data: timerData1},
							 track: { title: 'cuisson', tags: ['cook', 'egg'] }
							},
							{timer: {type: 'alarm', data: timerData2},
							 track: { title: 'reveil', tags: ['week', 'school'] }
							}
					],
					orderTimers: [
							{id:0, state:1, children:[1], parents:[]},
							{id:1, state:1, children:[2], parents:[0]},
							{id:2, state:1, children:[], parents:[1]},
					],
					countIds: 3
			}

			groupTimer.add('stopwatch')
			groupTimer.add('timer')
			groupTimer.add('alarm')

			groupTimer.group[0].timer.defaultTime = timerData0.time
			groupTimer.group[1].timer.defaultTime = timerData1.time
			groupTimer.group[2].timer.defaultTime = timerData2.time
			groupTimer.group[0].timer.interval = timerData0.interval
			groupTimer.group[1].timer.interval = timerData1.interval
			groupTimer.group[2].timer.interval = timerData2.interval
			groupTimer.group[0].setTitle('train')
			groupTimer.group[1].setTitle('cuisson')
			groupTimer.group[2].setTitle('reveil')
			groupTimer.group[0].addTags('sport')
			groupTimer.group[1].addTags('cook')
			groupTimer.group[1].addTags('egg')
			groupTimer.group[2].addTags('week')
			groupTimer.group[2].addTags('school')

			let dataExport = groupTimer.exportData()

			expect(dataExport.group).toStrictEqual(data.group)
			expect(dataExport.orderTimers).toStrictEqual(data.orderTimers)
			expect(dataExport.countIds).toStrictEqual(data.countIds)
	})
	it('should init with customized timer', () => {
			let timerData = { time: {h:0,m:2,s:3}, interval: 500, idTime: 0}
			let data = {
					group: [
							{timer: {type: 'stopwatch', data: timerData},
							 track: { title: 'train', tags: ['sport'] }
							},
							{timer: {type: 'timer', data: timerData},
							 track: { title: 'cuisson', tags: ['cook', 'egg'] }
							},
							{timer: {type: 'alarm', data: timerData},
							 track: { title: 'reveil', tags: ['week', 'school'] }
							}
					],
					orderTimers: [
							{id:0, state:1, children:[1], parents:[]},
							{id:1, state:1, children:[2], parents:[0]},
							{id:2, state:1, children:[], parents:[1]},
					],
					countIds: 3
			}
			groupTimer = new GroupTimer(data)

			let trackTimer0 = new TrackTimer({
					timer: new Stopwatch(timerData), 
					title: data.group[0].track.title,
					tags : data.group[0].track.tags
			})
			let trackTimer1 = new TrackTimer({
					timer: new Timer(timerData), 
					title: data.group[1].track.title,
					tags : data.group[1].track.tags
			})
			let trackTimer2 = new TrackTimer({
					timer: new Alarm(timerData), 
					title: data.group[2].track.title,
					tags : data.group[2].track.tags
			})

			expect(groupTimer.group[0]).toStrictEqual(trackTimer0)
			expect(groupTimer.group[1]).toStrictEqual(trackTimer1)
			expect(groupTimer.group[2]).toStrictEqual(trackTimer2)
			expect(groupTimer.orderTimers).toStrictEqual(data.orderTimers)
			expect(groupTimer.countIds).toStrictEqual(data.countIds)
	})

	describe('## add Timer', () => {
		it('should add Stopwatch in GroupeTimer', () => {
			let stopwatch = new Stopwatch()
			let trackTimer = new TrackTimer({timer: stopwatch})
			groupTimer.add('stopwatch')
			expect(groupTimer.group[0]).toStrictEqual(trackTimer)
		})
		it('should add Alarm in GroupeTimer', () => {
			let alarm = new Alarm()
			let trackTimer = new TrackTimer({timer: alarm})
			groupTimer.add('alarm')
			expect(groupTimer.group[0]).toStrictEqual(trackTimer)
		})
		it('should add Timer in GroupeTimer', () => {
			let timer = new Timer()
			let trackTimer = new TrackTimer({timer})
			groupTimer.add('timer')
			expect(groupTimer.group[0]).toStrictEqual(trackTimer)
		})
		it('should add multiple Timers in GroupeTimer', () => {
			groupTimer.add('timer')
			groupTimer.add('alarm')
			groupTimer.add('timer')

			expect(groupTimer.group[0].timer).toBeInstanceOf(Timer)
			expect(groupTimer.group[1].timer).toBeInstanceOf(Alarm)
			expect(groupTimer.group[0].timer).toBeInstanceOf(Timer)
			expect(groupTimer.group.length).toBe(3)
		})
		it('shouldn\'t add timer which doesn\'t existe in GroupeTimer', () => {
			let message = ''
			try {
				groupTimer.add('watch')
			} catch (e) {
				message = e.message
			}
			expect(groupTimer.group.length).toBe(0)
			expect(message).toBe("Type of timer doesn't existe")
		})
		it('should add multiple Timers with correct value in orderTimers', () => {
			groupTimer.add('timer')
			groupTimer.add('alarm')
			groupTimer.add('timer')

			expect(groupTimer.orderTimers[0].children).toContain(1)
			expect(groupTimer.orderTimers[1].children).toContain(2)
			expect(groupTimer.orderTimers[2].children.length).toBe(0)

			expect(groupTimer.orderTimers[0].parents.length).toBe(0)
			expect(groupTimer.orderTimers[1].parents).toContain(0)
			expect(groupTimer.orderTimers[2].parents).toContain(1)

			expect(groupTimer.orderTimers[0].id).toBe(0)
			expect(groupTimer.orderTimers[1].id).toBe(1)
			expect(groupTimer.orderTimers[2].id).toBe(2)
		})
	})
	describe('## removeTimer', () => {
		it('should remove specific timer with index in #GroupTimer', () => {
				groupTimer.add('timer')
				groupTimer.add('alarm')

				groupTimer.remove(1)

				expect(groupTimer.group.length).toBe(1)
				expect(groupTimer.group[0].timer).toBeInstanceOf(Timer)
		})
			it('should remove a timer and check that nothing children would call him', () => {
				groupTimer.add('timer')
				groupTimer.add('alarm')

				groupTimer.remove(1)

				expect(groupTimer.orderTimers[0].children.length).toBe(0)
				expect(groupTimer.orderTimers[1]).toBe(undefined)
			})
			it('should remove the first timer and check children and parents', () => {
				groupTimer.add('timer')
				groupTimer.add('alarm')

				groupTimer.remove(0)

				expect(groupTimer.orderTimers[0].children.length).toBe(0)
				expect(groupTimer.orderTimers[0].parents.length).toBe(0)
				expect(groupTimer.group[0].timer).toBeInstanceOf(Alarm)
			})

			it('should remove 1 timer and remove his id of his parent', () => {
				groupTimer.add('timer')
				groupTimer.add('alarm')
				groupTimer.add('alarm')

				groupTimer.remove(2)
				expect(groupTimer.orderTimers[1].children).not.toContain(2)
			})
			it('should remove 1 timer and remove his id of all parents', () => {
				groupTimer.add('timer')
				groupTimer.add('alarm')
				groupTimer.add('alarm')
				groupTimer.add('alarm')

				groupTimer.linkChildren(0, [1,2])
				groupTimer.linkChildren(1, [3])
				groupTimer.remove(3)

				expect(groupTimer.orderTimers[1].children).not.toContain(3)
				expect(groupTimer.orderTimers[2].children).not.toContain(3)
			})
			it('should remove 1 timer in middle of group and remove its id of all its parents and children', () => {
				groupTimer.add('timer')
				groupTimer.add('alarm')
				groupTimer.add('alarm')
				groupTimer.add('alarm')
				groupTimer.add('alarm')

				groupTimer.linkChildren(0, [1,2])
				groupTimer.linkChildren(1, [3,4])
				groupTimer.remove(1)

				expect(groupTimer.orderTimers[0].children).not.toContain(1)
				expect(groupTimer.orderTimers[0].children).toContain(2)
				expect(groupTimer.orderTimers[1].children).toContain(3)
				expect(groupTimer.orderTimers[2].children).not.toContain(1)
				expect(groupTimer.orderTimers[2].parents).toContain(2)

				expect(groupTimer.orderTimers[3].parents.length).toBe(0)
				expect(groupTimer.orderTimers[3].children.length).toBe(0)
			})
	})

	describe('## start', () => {
		it('should start the first timer in GroupTimer', () => {
				groupTimer.add('stopwatch')
				groupTimer.add('timer')
				let startTimer_0 = jest.spyOn(groupTimer.group[0], 'start')
				let startTimer_1 = jest.spyOn(groupTimer.group[1], 'start')

				groupTimer.start()
				expect(startTimer_0).toHaveBeenCalled()
				expect(startTimer_1).not.toHaveBeenCalled()
		})
		it('should start the first timer which is ready in GroupTimer', () => {
				groupTimer.add('timer')
				groupTimer.add('stopwatch')
				groupTimer.group[0].time = { h:0, m:0, s:0 }
				groupTimer.orderTimers[0] = 0
				let startTimer_0 = jest.spyOn(groupTimer.group[0], 'start')
				let startTimer_1 = jest.spyOn(groupTimer.group[1], 'start')

				groupTimer.start()

				expect(startTimer_0).not.toHaveBeenCalled()
				expect(startTimer_1).toHaveBeenCalled()
		})

		describe('### link the differents timers', () => {
			it('should start the 2e timer after the 1er is end', () => {
				jest.useFakeTimers()
				groupTimer.add('timer')
				groupTimer.add('stopwatch')

				groupTimer.group[0].timer.time = { h:0, m:0, s:1 }
				let startTrackTimer_0 = jest.spyOn(groupTimer.group[0], 'start')
				let startTimer_0 = jest.spyOn(groupTimer.group[0].timer, 'start')
				let ringTimer_0 = jest.spyOn(groupTimer.group[0].timer, 'ring')
				let startTimer_1 = jest.spyOn(groupTimer.group[1], 'start')

				groupTimer.start()
				jest.runOnlyPendingTimers()

				expect(startTrackTimer_0).toHaveBeenCalled()
				expect(startTimer_0).toHaveBeenCalled()
				expect(ringTimer_0).toHaveBeenCalled()
				expect(startTimer_1).toHaveBeenCalled()
				expect(groupTimer.orderTimers[0].state).toBe(0)
				jest.useRealTimers()
			})
			it('should start 2e timer after manually stop the 1er timer #Stopwatch when user stop it manually', () => {
				groupTimer.add('stopwatch')
				groupTimer.add('timer')

				let startTimer_0 = jest.spyOn(groupTimer.group[0], 'start')
				let stopTimer_0 = jest.spyOn(groupTimer.group[0], 'stop')
				let startTimer_1 = jest.spyOn(groupTimer.group[1], 'start')

				groupTimer.start()
				groupTimer.stopManually(0)

				expect(groupTimer.orderTimers[0].state).toBe(0)

				expect(startTimer_0).toHaveBeenCalled()
				expect(stopTimer_0).toHaveBeenCalled()
				expect(startTimer_1).toHaveBeenCalled()
			})
			it('should cut off manually the current Timer and start the 2e timer', () => {
				groupTimer.add('timer')
				groupTimer.add('timer')

				let startTimer_0 = jest.spyOn(groupTimer.group[0], 'start')
				let stopTimer_0 = jest.spyOn(groupTimer.group[0], 'stop')
				let startTimer_1 = jest.spyOn(groupTimer.group[1], 'start')

				groupTimer.start()
				groupTimer.stopManually(0)

				expect(groupTimer.orderTimers[0].state).toBe(0)

				expect(startTimer_0).toHaveBeenCalled()
				expect(stopTimer_0).toHaveBeenCalled()
				expect(startTimer_1).toHaveBeenCalled()
			})
			it('should start the 2e when the 1er is end then start the 3e timer when the 2e is end', () => {
				jest.useFakeTimers()
				groupTimer.add('timer')
				groupTimer.add('timer')
				groupTimer.add('stopwatch')
				groupTimer.group[0].timer.time = { h:0, m:0, s:1 }
				groupTimer.group[1].timer.time = { h:0, m:0, s:1 }

				let startTimer_0 = jest.spyOn(groupTimer.group[0], 'start')
				let startTimer_1 = jest.spyOn(groupTimer.group[1], 'start')
				let startTimer_2 = jest.spyOn(groupTimer.group[2], 'start')

				groupTimer.start()
				jest.runOnlyPendingTimers()
				jest.runOnlyPendingTimers()

				expect(groupTimer.orderTimers[0].state).toBe(0)
				expect(groupTimer.orderTimers[1].state).toBe(0)

				expect(startTimer_0).toHaveBeenCalled()
				expect(startTimer_1).toHaveBeenCalled()
				expect(startTimer_2).toHaveBeenCalled()
				jest.useRealTimers()
			})

			it('should break up a link between 2 timers for to have indepedant timer',() => {
				jest.useFakeTimers()
				groupTimer.add('timer')
				groupTimer.add('timer')
				groupTimer.group[0].timer.time = { h:0, m:0, s:1 }
				groupTimer.group[1].timer.time = { h:0, m:1, s:1 }

				let startTimer_0 = jest.spyOn(groupTimer.group[0], 'start')
				let startTimer_1 = jest.spyOn(groupTimer.group[1], 'start')

				groupTimer.linkChildren(0, [])
				groupTimer.start()
				jest.runOnlyPendingTimers()

				expect(groupTimer.orderTimers[0].children).toStrictEqual([])
				expect(groupTimer.orderTimers[0].parents).toStrictEqual([])

				expect(startTimer_0).toHaveBeenCalled()
				expect(startTimer_1).not.toHaveBeenCalled()
				jest.useRealTimers()
			})
			it('should start the 2e and 3e timer in same time when the 1er starting',() => {
				jest.useFakeTimers()
				groupTimer.add('timer')
				groupTimer.add('timer')
				groupTimer.add('stopwatch')
				groupTimer.add('stopwatch')
				groupTimer.group[0].timer.time = { h:0, m:0, s:1 }
				groupTimer.group[1].timer.time = { h:0, m:1, s:1 }

				let startTimer_0 = jest.spyOn(groupTimer.group[0], 'start')
				let startTimer_1 = jest.spyOn(groupTimer.group[1], 'start')
				let startTimer_2 = jest.spyOn(groupTimer.group[2], 'start')
				let startTimer_3 = jest.spyOn(groupTimer.group[3], 'start')

				groupTimer.linkChildren(0, [1,2])
				groupTimer.start()
				jest.runOnlyPendingTimers()

				expect(groupTimer.orderTimers[0].children).toStrictEqual([1,2])
				expect(groupTimer.orderTimers[1].children).toStrictEqual([])
				expect(groupTimer.orderTimers[1].parents).toStrictEqual([0])
				expect(groupTimer.orderTimers[2].parents).toStrictEqual([0])

				expect(startTimer_0).toHaveBeenCalled()
				expect(startTimer_1).toHaveBeenCalled()
				expect(startTimer_2).toHaveBeenCalled()
				expect(startTimer_3).not.toHaveBeenCalled()
				jest.useRealTimers()
			})
			it('shouldn\'start the 3e timer after the 2e timer are end, 2 and 3 timer are parallel ', () => {
				jest.useFakeTimers()
				groupTimer.add('timer')
				groupTimer.add('timer')
				groupTimer.add('timer')
				groupTimer.group[0].timer.time = { h:0, m:0, s:1 }
				groupTimer.group[1].timer.time = { h:0, m:0, s:1 }
				groupTimer.group[2].timer.time = { h:0, m:0, s:2 }

				let startTimer_1 = jest.spyOn(groupTimer.group[1], 'start')
				let stopTimer_1 = jest.spyOn(groupTimer.group[1].timer, 'stop')
				let startTimer_2 = jest.spyOn(groupTimer.group[2], 'start')

				groupTimer.linkChildren(0, [1,2])
				groupTimer.start()
				jest.runOnlyPendingTimers()
				jest.runOnlyPendingTimers()

				expect(groupTimer.orderTimers[1].children).not.toContain(2)
				expect(groupTimer.orderTimers[2].parents).not.toContain(1)

				expect(startTimer_1).toHaveBeenCalled()
				expect(stopTimer_1).toHaveBeenCalled()
				expect(startTimer_2).toHaveBeenCalledTimes(1)
				jest.useRealTimers()
			})

		})
	})
	describe('## pause', () => {
		it('should pause all timers in same time', () => {
				jest.useFakeTimers()
				groupTimer.add('timer')
				groupTimer.add('timer')
				groupTimer.add('stopwatch')
				groupTimer.group[0].timer.time = { h:0, m:0, s:1 }
				groupTimer.group[1].timer.time = { h:0, m:0, s:4 }

				let stopTimer_1 = jest.spyOn(groupTimer.group[1], 'stop')
				let stopTimer_2 = jest.spyOn(groupTimer.group[2], 'stop')

				groupTimer.linkChildren(0, [1,2])
				groupTimer.start()
				jest.runOnlyPendingTimers()
				jest.runOnlyPendingTimers()
				groupTimer.stop()

				expect(stopTimer_1).toHaveBeenCalled()
				expect(stopTimer_2).toHaveBeenCalled()
				expect(groupTimer.group[0].timer.time.s).toBe(0)
				expect(groupTimer.group[1].timer.time.s).toBe(3)
				expect(groupTimer.group[2].timer.time.s).toBe(1)
				jest.useRealTimers()
		})
	})
	describe('## reset', () => {
		it('should reset all timers in same time', () => {
				jest.useFakeTimers()
				groupTimer.add('timer')
				groupTimer.add('timer')
				groupTimer.add('stopwatch')
				groupTimer.group[0].timer.time = { h:0, m:0, s:1 }
				groupTimer.group[1].timer.time = { h:0, m:0, s:4 }

				let resetTimer_1 = jest.spyOn(groupTimer.group[1], 'reset')
				let resetTimer_2 = jest.spyOn(groupTimer.group[2], 'reset')

				groupTimer.linkChildren(0, [1,2])
				groupTimer.start()
				jest.runOnlyPendingTimers()
				jest.runOnlyPendingTimers()
				groupTimer.reset()
				
				expect(resetTimer_1).toHaveBeenCalled()
				expect(resetTimer_2).toHaveBeenCalled()
				expect(groupTimer.group[0].timer.time.s).toBe(0)
				expect(groupTimer.group[1].timer.time.s).toBe(0)
				expect(groupTimer.group[2].timer.time.s).toBe(0)
				jest.useRealTimers()
		})
	})

})
})

