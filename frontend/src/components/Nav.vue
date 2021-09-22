<template>
<nav class="navbar navbar-expand-lg navbar-dark">
  <div class="container-fluid">
    <img :src="require(`../assets/icon.png`)" alt="logo"><router-link to="/wall" class="navbar-brand text-white">Groupomania</router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
  <div class="collapse navbar-collapse " id="navbarTogglerDemo02">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item">
        <router-link  class="nav-link active " aria-current="page" to="/wall">Accueil</router-link>
      </li>
      <li class="nav-item">
        <router-link  class="nav-link"  to="/profile">Profil</router-link>
      </li>
      <li class="nav-item">
        <router-link @click="logout()"  class="nav-link" to="/">Déconnexion</router-link>
      </li>
    </ul>
  </div>
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
  background-color:#d65959;
}
img { 
  height: 50px;
}

header {
  display: flex;
  justify-content: space-between;
}
</style>