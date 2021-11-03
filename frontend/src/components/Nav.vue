<template>
<nav class="navbar navbar-expand-lg navbar-dark">
  <div class="container-fluid">
    <div>
      <img :src="require(`../assets/icon.png`)" alt="logo" /><router-link to="/wall" class="navbar-brand text-white">Groupomania</router-link>
    </div>
  <div>
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item">
        <router-link  class="nav-link active " aria-current="page" to="/wall">Accueil</router-link>
      </li>
      <li class="nav-item">
        <router-link  class="nav-link" to="/profile">Profil</router-link>
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
  background-color:rgb(9, 31, 67);
  flex-wrap: wrap;
  padding: 0;
}
img { 
  height: 50px;
}
header {
  display: flex;
  justify-content: space-between;
}
.container-fluid {
  padding:0;
}
</style>