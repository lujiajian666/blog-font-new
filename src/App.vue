<template>
  <div id="app">
    <router-view />
    <div class="ikaros">
      <img src="./assets/ikaros.jpeg" @click="play" :class="{ on: on }">
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3"></div>
      <audio ref="audio" class="audio" preload loop></audio>
    </div>
  </div>
</template>
<script>
  import CryForTheMoon from './assets/cry-for-the-moon.mp3';
  export default {
    data() {
      return {
        on: false
      }
    },
    mounted() {
      const audio = this.$refs.audio;
      audio.src = CryForTheMoon;
      audio.oncanplay = () => {
        this.play()
      }
    },
    methods: {
      play() {
        const audio = this.$refs.audio;
        audio.play().then(_ => {
          this.on = true
        })
      },
    }
  }
</script>
<style lang="less">
  html,
  body,
  p {
    padding: 0;
    margin: 0
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .ikaros {
    position: fixed;
    bottom: 10px;
    height: 50px;
    width: 50px;
    img {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: 30;
      left: 30px;
     
      border-radius: 50%;
      cursor: pointer;
      &.on {
        animation: rotate2 10s linear infinite;
      }
    }

    .audio {
      visibility: hidden;
    }

    .circle1,
    .circle2,
    .circle3 {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: 29;
      left: 30px;
      border-radius: 50%;
      border: orange 5px solid;
      box-sizing: border-box;
    }

    .circle1 {
      animation: circle 2.5s linear infinite;
    }

    .circle2 {
      animation: circle 2.5s linear 1.25s infinite;
    }

    .circle3 {
      animation: circle 2.5s linear 2.5s infinite;
    }
  }

  @keyframes rotate2 {
    0% {
      transform: rotateZ(0deg);
    }

    100% {
      transform: rotateZ(-360deg);
    }
  }

  @keyframes circle {
    0% {
      opacity: 0;
      transform: scale(1);
    }

    50% {
      opacity: .4;
      transform: scale(1.2);
    }

    100% {
      opacity: 0;
      transform: scale(1.4);
    }
  }
</style>