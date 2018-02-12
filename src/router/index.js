import Vue from 'vue'
import Router from 'vue-router'
import Note from '@/components/Note'


Vue.use(Router)

export default new Router({
  /* History mode leads to an issue wherein a GET to a non-hash URL could
     send the password in plaintext */

  //mode: 'history',
  routes: [
    {
      path: '/*',
      name: 'Note',
      component: Note
    },
  ]
})
