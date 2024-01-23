<template>
  <div class="custom-progress" :style="{width:`${stages.length * 100}px`}">
    <div v-if="!props.stages" class="custom-progress__dialog">
      <create-dialog @refresh="refreshStages"/>
    </div>
    <div class="custom-progress__items">
      <div v-for="stage in stages" :key="stage.id" :style="{width:`${stages.length * 100}px`}"
           class="custom-progress__item">
        <div class="custom-progress__item-number">{{ stage.thresholdPoints }}</div>
        <div class="custom-progress__item-image">
          <img :src="checkScore(stage, stages)" alt="">
        </div>
      </div>
    </div>
    <div :style="`width:${progressWidth(stages)}px; `" :class="{'rounded':!isFull}" class="custom-progress__fill"></div>
  </div>
</template>


<script setup>
import {onMounted, ref} from "vue";
import CreateDialog from "@/components/CreateDialog.vue";
import {useStageStore} from "@/stores/store";
import smallStar from '@/assets/small-star.svg'
import fillSmallStar from '@/assets/fill-small-star.svg'
import winIcon from '@/assets/win-icon.svg'

const list = ref([])
const store = useStageStore()
const stages = ref([])
const props = defineProps(['stages'])
const isFull = ref(true)
onMounted(() => {
  refreshStages()
})
const checkScore = (stage, stages) => {
  let icon = smallStar
  let allScore = 0

  for (let stage in stages) {
    for (let game of stages[stage].games) {
      allScore += game.bestResult
    }
  }

  if (allScore >= stage.thresholdPoints) {
    icon = fillSmallStar
  }
  if (stage.thresholdPoints === stages.at(-1).thresholdPoints) {
    icon = winIcon
  }
  return icon
}

const refreshStages = () => {
  if (props.stages === undefined) {
    store.getStages()
    stages.value = store.stages
    refreshList()
  } else {
    stages.value = props.stages
  }
}
const refreshList = () => {
  list.value = []
  for (let stage of stages.value) {
    list.value.push(stage.thresholdPoints)
  }
}

const progressWidth = ((stages) => {
  refreshList()
  let score = 0
  let allScoreList = list.value

  for (let stage of stages) {
    for (let game of stage.games) {
      score += game.bestResult
    }
  }

  let lessThanScoreList = [0]
  let isFindMoreScore = false
  let findMoreScore = 0

  for (let i = 0; i < allScoreList.length; i++) {
    if (allScoreList[i] <= score && !isFindMoreScore) {
      lessThanScoreList.push(allScoreList[i])
    } else if (allScoreList[i] > score && !isFindMoreScore) {
      findMoreScore = allScoreList[i]
      isFindMoreScore = true
    }
  }

  let progressPx = 0
  for (let i = 0; i < lessThanScoreList.length - 1; i++) {
    progressPx += 100
  }

  let lastStagePoints = 0
  let rimmedPx = 0
  if (stages.length > 0) {
    lastStagePoints = stages.at(-1).thresholdPoints
  }

  isFull.value = true
  if (score >= lastStagePoints) {
    isFull.value = false
    progressPx = 0
    for (let i = 0; i < lessThanScoreList.length - 1; i++) {
      progressPx += 100
    }
  } else if (lessThanScoreList.at(-1) !== score && lessThanScoreList.at(-1) && isFull.value
      || lessThanScoreList.at(-1) === 0 && isFull.value) {
    score -= lessThanScoreList.at(-1)
    rimmedPx = (score * 100) / (findMoreScore - lessThanScoreList.at(-1))
  }

  let result = progressPx + rimmedPx
  if (result === 0) {
    return 0
  }
  if (result > 0 && result < 10) {
    return 10
  }
  return result

})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Work+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.rounded {
  border-radius: 30px !important;
}

.custom-progress {
  margin-top: 110px;
  margin-left: 400px;
  width: 600px;
  height: 30px;
  border-radius: 30px;
  position: relative;
  background: #dadada;

  &__dialog {
    position: absolute;
    left: -150px;
  }

  &__items {
    display: flex;
    top: 0;
    position: absolute;
    width: 100%;
    height: 30px;
  }

  &__fill {
    display: flex;
    top: 0;
    position: absolute;
    width: 0px;
    height: 30px;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    background: blue;
    border-right: 2px;
  }

  &__item {
    z-index: 2;
    position: relative;

    &-number {
      position: absolute;
      z-index: 3;
      top: 38px;
      right: -13px;
      color: #7f7878;
      text-align: center;
      font-family: 'Inter';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.14px;
    }

    &-image {
      position: absolute;
      z-index: 3;
      top: -30px;
      right: -12px;

      img {
        z-index: 4;
      }
    }

    &:last-child {
      border-right: none;
    }

    width: 19%;
    height: 100%;
    border-right: 1px solid #d0cbcb;
  }
}
</style>