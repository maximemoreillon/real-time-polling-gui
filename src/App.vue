<template>
  <AppTemplate
    :options="options"
    @user="get_user($event)">

    <!-- <template v-slot:nav>
      <v-list
        dense
        nav >
        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template> -->

  </AppTemplate>
</template>

<script>
import AppTemplate from '@moreillon/vue_application_template_vuetify'
export default {
  name: 'App',

  components: {
    AppTemplate
  },

  data: () => ({
    options: {
      title: "Real-time polling",
      authenticate: true,
      main_class: 'grey lighten-4',
      footer_color: 'grey lighten-4',
      skip_greetings: process.env.NODE_ENV === 'development',
      login_url: `${process.env.VUE_APP_AUTHENTICATION_API_URL}/login`,
      identification_url: `${process.env.VUE_APP_AUTHENTICATION_API_URL}/v2/whoami`,
    },
    nav: [
      {title: 'Home', to: {name: 'Home'}, icon: 'mdi-home'},
      {title: 'About', to: {name: 'About'}, icon: 'mdi-information-outline'},
    ]
  }),
  sockets: {
    connect () {
      console.log('Socket connected')
    },
    disconnect() {
      console.log('Socket disconnected')
    }

  },

  methods: {
    get_user(user){
      this.$store.commit('set_current_user', user)
      if(!user) return
      this.$socket.disconnect()
      this.$socket.auth = {token: localStorage.jwt}
      this.$socket.connect()
    }
  }
};
</script>
