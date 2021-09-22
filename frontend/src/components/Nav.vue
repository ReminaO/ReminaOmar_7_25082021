<template>
<header class="navbar navbar-expand-sm">
  <div class="container-fluid"><div>
    <img :src="require(`../assets/icon.png`)" alt="logo"><router-link to="/wall" class="navbar-brand logo text-white">Groupomania</router-link>
  </div>
   <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
  <div class="collapse navbar-collapse d-flex" id="navbarTogglerDemo02">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item">
        <router-link to="/wall" class="nav-link active text-white" aria-current="page">Accueil</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/profile" class="nav-link text-white">Profil</router-link>
      </li>
      <li class="nav-item">
        <router-link @click="logout()" to="/" class="nav-link text-white">Déconnexion</router-link>
      </li>
    </ul>
  </div>
  </div>
</header>
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