<template>
  <button type="button" class="  btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
    Добавить этап
  </button>

  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="stageError" class="alert alert-danger" role="alert">
            Чекпоинты этапа должны быть больше!
          </div>
          <div class="row mb-3 g-3">
            <div class="col">
              <input v-model="newStage.name" type="text" class="form-control" placeholder="Название">
            </div>
            <div class="col">
              <input v-model="newStage.thresholdPoints" type="number" class="form-control" placeholder="Чекпоинт">
            </div>
            <div class="row">
              <button @click="addStage" type="button" class="offset-3 mt-2 col-6 btn btn-primary">Добавить этап</button>
            </div>
          </div>
          <h3 class="offset-3">Выберите стадию</h3>
          <select v-model="stageIdToAddGame" class="form-select mb-2" aria-label="ывв">
            <option v-for="stage in stages" :value="stage.id">{{ stage.name }}</option>
          </select>

          <div class="row g-3">
            <div class="col">
              <input v-model="newGame.name" type="text" class="form-control" placeholder="Название">
            </div>
            <div class="col">
              <input v-model="newGame.bestResult" type="number" class="form-control" placeholder="Рекорд">
            </div>
          </div>
          <div class="row">
            <button @click="addGame" type="button" class="offset-3 mt-2 col-6 btn btn-primary">Добавить игру</button>
          </div>
          <div class="row mb-2">
            <button  type="button" class="offset-3 mt-2 col-6 btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>
<script setup>
import {useStageStore} from '@/stores/store'
import {onMounted, ref} from "vue";

const emit = defineEmits(['refresh'])
const store = useStageStore()
const stages = ref([])
const stageIdToAddGame = ref(0)
const stageError = ref(false)
const gamerError = ref(false)
onMounted(() => {
  stages.value = store.stages
})

const newStage = ref({
  id: Date.now(),
  name: '',
  thresholdPoints: 0,
  games: []
})

const newGame = ref({
  name: '',
  bestResult: 0,
  isPlayed: false
})
const addStage = () => {
  stageError.value = false
  if (newStage.value.thresholdPoints <= stages.value.at(-1).thresholdPoints) {
    stageError.value = true
  }

  if (!stageError.value) {
    let newStageToAdd = JSON.parse(JSON.stringify(newStage.value))
    newStage.value.id = 0
    newStage.value.name = ''
    newStage.value.thresholdPoints = 0
    newStage.value.games = []
    store.addStage(newStageToAdd)
  }
  emit('refresh')
  stages.value = store.stages
}
const addGame = () => {
  let newGameToAdd = JSON.parse(JSON.stringify(newGame.value))
  newGame.value = {
    name: '',
    bestResult: 0,
    isPlayed: false
  }
  store.addGame(newGameToAdd, stageIdToAddGame.value)
  emit('refresh')
}

store.count++
store.$patch({count: store.count + 1})
store.increment()
</script>
<style scoped>

</style>