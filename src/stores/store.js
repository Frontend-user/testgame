import { defineStore } from 'pinia'

export const useStageStore = defineStore('store', {
    state: () => {
        return {
            stages :[
                {
                    "name": "Этап первый",
                    "id": 1,
                    "thresholdPoints": 25,
                    "games": [
                        {
                            "name": "Игра 1.1",
                            "bestResult": 0,
                            "isPlayed": false
                        }
                    ]
                },
                {
                    "name": "Этап второй",
                    "id": 2,
                    "thresholdPoints": 50,
                    "games": [
                        {
                            "name": "Игра 2.1",
                            "bestResult": 0,
                            "isPlayed": false
                        }
                    ]
                },
                {
                    "id": 3,
                    "name": "Этап третий",
                    "thresholdPoints": 100,
                    "games": [
                        {
                            "name": "Игра 3.1",
                            "bestResult": 0,
                            "isPlayed": false
                        }
                    ]
                },
                {
                    "id": 4,
                    "name": "Этап четвертый",
                    "thresholdPoints": 200,
                    "games": [
                        {
                            "name": "Игра 4.1",
                            "bestResult": 0,
                            "isPlayed": false
                        }
                    ]
                },
                {
                    "id": 5,
                    "name": "Этап пятый",
                    "thresholdPoints": 500,
                    "games": [
                        {
                            "name": "Игра 5.1",
                            "bestResult": 0,
                            "isPlayed": false
                        }
                    ]
                },
                {
                    "id": 6,
                    "name": "Этап шестой",
                    "thresholdPoints": 1000,
                    "games": [
                        {
                            "name": "Игра 6.1",
                            "bestResult": 0,
                            "isPlayed": false
                        },
                        {
                            "name": "Игра 6.2",
                            "bestResult": 0,
                            "isPlayed": false
                        }
                    ]
                },
            ],
            count: 0,
        }
    },
    actions: {
        increment() {
            this.count++
        },
        getStages(){
            if(!localStorage.getItem('stage')){
                localStorage.setItem('stage', JSON.stringify(this.stages))
            }
        this.stages =  JSON.parse( localStorage.getItem('stage'))
        },
        addStage(newStage){
            this.stages.push(newStage)
            localStorage.setItem('stage', JSON.stringify(this.stages))
            this.getStages()
        },
        addGame(game,stageId) {
            for(let i = 0; i <this.stages.length; i++) {
                if(this.stages[i].id === stageId) {
                    this.stages[i].games.push(game)
                }
            }
            localStorage.setItem('stage', JSON.stringify(this.stages))
            this.getStages()
        }
    },
})