<template>
  <v-card>
    <v-toolbar
      flat
      class="text-center">

      <v-btn
        text
        color="green"
        @click="update_state('OK')">
        OK
      </v-btn>



      <v-btn
        text
        color="red"
        @click="update_state('NG')">
        NG
      </v-btn>

      <v-btn
        text
        @click="update_state(null)">
        Reset
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
          height="30"
          background-color="red"
          :buffer-value="percentage('NG') + percentage('OK')"
          :value="percentage('OK')"
          color="green"
          rounded />
      </v-sheet>



      <v-list
        dense
        rounded>
        <v-subheader>Members</v-subheader>
        <v-list-item
            v-for="(user, index) in users"
            :key="index"
            :class="{red: user.state === 'NG', green: user.state === 'OK',}">
          <v-list-item-content>
            <v-list-item-title>
              {{user.properties.display_name}} ({{user.properties.name_romaji}})
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>


  </v-card>
</template>

<script>

  export default {
    name: 'Home',
    components: {

    },
    data: () => ({
      users: []
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
      percentage(state){
        return 100 * this.users.filter(u => u.state === state).length / this.users.length
      }
    },
    computed: {
      current_user(){
        return this.$store.state.current_user
      },
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
