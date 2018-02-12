<template>
  <v-app>
    <v-content fluid>
      <router-view>
      </router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  name: 'App'
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.code {
  font-family: "Courier New", Courier, monospace;
}

</style>