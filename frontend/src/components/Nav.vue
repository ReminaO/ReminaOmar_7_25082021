<template>
<div class='container-fluid'>
    <nav class="navbar navbar-expand navbar-light">
      <div>
        <img :src="require(`../assets/icon.png`)" alt="logo"><router-link to="/wall" class="navbar-brand logo text-white">Groupomania</router-link>
      </div>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/wall" class="nav-link text-white">Accueil</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile" class="nav-link text-white">Profil</router-link>
        </li>
        <li class="nav-item">
          <router-link @click="logout()" to="/" class="nav-link text-white">Déconnexion</router-link>
        </li>
      </div>
    </nav>
  </div>
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
  background-color:#d65959;
}
img { 
  height: 50px;
}
.container-fluid{
  background-color:#d65959;
}
</style>