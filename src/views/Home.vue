<template>
  <v-card max-width="600px" class="mx-auto mt-5">
    <v-toolbar
      flat
      class="text-center">
      <v-toolbar-title>Polls</v-toolbar-title>

    </v-toolbar>
    <v-divider></v-divider>

    <v-card-text class="text-center py-10">

      <v-btn :to="{name: 'poll', params: {id: poll_id}}">Create new poll</v-btn>


    </v-card-text>



  </v-card>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'Home',
  components: {

  },
  data: () => ({

  }),
  mounted(){

  },
  methods: {

  },
  computed: {
    poll_id(){
      return uuidv4()
    }
  },
  sockets: {

  },


}
</script>

<style scoped>

</style>
