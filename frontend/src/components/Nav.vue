<template>
    <nav class="navbar navbar-expand navbar-light bg-light">
      <div>
        <router-link to="/wall" class="navbar-brand">Groupomania</router-link>
      </div>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/wall" class="nav-link">Accueil</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">Profil</router-link>
        </li>
        <li class="nav-item">
          <router-link @click="logout()" to="/" class="nav-link">Deconnexion</router-link>
        </li>
      </div>
    </nav>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'Nav',
computed: {
    ...mapState({
      user: 'userInfos',
    }),
},
  methods: {
      logout: function () {
      this.$store.commit('logout');
      this.$router.push('/');
    },
  }
}
</script>
<style scoped>
.navbar{
  display: flex;
  justify-content: space-between;
}
</style>