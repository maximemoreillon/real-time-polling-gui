<template>
  <v-card max-width="600px" class="mx-auto mt-5">
    <v-toolbar
      flat
      class="text-center">

      <v-btn
        color="green"
        class="mr-2"
        dark
        @click="update_state('OK')">
        <v-icon>mdi-thumb-up</v-icon>
        <span>OK</span>
      </v-btn>

      <v-btn

        class="mr-2"
        @click="update_state(null)">
        <v-icon>mdi-close</v-icon>
        <span>Reset</span>
      </v-btn>



      <v-btn
        color="red"
        class="mr-2"
        dark
        @click="update_state('NG')">
        <v-icon>mdi-thumb-down</v-icon>
        <span>NG</span>

      </v-btn>

      <v-spacer></v-spacer>




      <v-btn
        text
        @click="update_all_states(null)">
        Reset All
      </v-btn>


    </v-toolbar>
    <v-divider></v-divider>

    <v-card-text>

      <v-sheet
        rounded
        outlined
        color="grey lighten-4">
        <v-progress-linear
          height="50"
          background-color="red lighten-3"
          :buffer-value="100*(count('NG') + count('OK'))/users.length"
          :value="100*count('OK')/users.length"
          color="green lighten-3"
          rounded>
          OK: {{ count('OK') }}, NG: {{ count('NG') }}, Total: {{users.length}}
        </v-progress-linear>
      </v-sheet>
    </v-card-text>

    <v-card-subtitle>Members: {{users.length}}</v-card-subtitle>


    <v-card-text>
      <transition-group name="list" tag="div">
      <v-card
        class="my-3 lighten-3"
        flat
        outlined
        v-for="(user) in sorted_users"
        :key="user.identity"
        :class="{red: user.state === 'NG', green: user.state === 'OK',}">

        <v-card-text class="text--primary">{{user.properties.display_name}} ({{user.properties.name_romaji}})</v-card-text>

      </v-card>
      </transition-group>
    </v-card-text>









  </v-card>
</template>

<script>

  export default {
    name: 'Home',
    components: {

    },
    data: () => ({
      users: [ ]
    }),
    mounted(){
      this.get_users()
    },
    methods: {
      get_users(){
        const url = `${process.env.VUE_APP_API_URL}/users`
        this.axios.get(url)
        .then(({data}) => {this.users = data})
        .catch(console.error)
      },
      update_state(state){
        const url = `${process.env.VUE_APP_API_URL}/users/${this.current_user.identity}`
        this.axios.patch(url,{state})
        .then( () => { })
        .catch(console.error)
      },
      update_all_states(state){
        if(this.$store.state.locked) {
          if(prompt('Password') !== 'poketenashi') return alert('Access denied')
          this.$store.commit('unlock')
        }
        const url = `${process.env.VUE_APP_API_URL}/users/`
        this.axios.patch(url,{state})
        .then( () => { })
        .catch(console.error)
      },
      count(state){
        return this.users.filter(u => u.state === state).length
      }
    },
    computed: {
      current_user(){
        return this.$store.state.current_user
      },
      sorted_users(){
        //return []
        return this.users.slice().sort((a,b) => {
          if(!a.state && b.state) return 1
          else if(a.state && !b.state) return -1
          else if(a.state < b.state) return -1
          else if(a.state > b.state) return 1
          return 0
        })
      }
    },



    sockets: {
      user_connected (user) {
        this.users.push(user)
      },
      user_disconnected (user) {
        const found_index = this.users.findIndex(u => u.identity === user.identity)
        if(found_index > -1) this.users.splice(found_index,1)
      },
      user_updated(user){
        const found_index = this.users.findIndex(u => u.identity === user.identity)
        if(found_index > -1) this.$set(this.users,found_index,user)
      },
      all_users_updated(users){
        this.users = users
      }
    },


  }
</script>

<style scoped>
.list-move {
  transition: transform 0.25s;
}
</style>
