<template>
<div class="container">
  <nav class="navbar navbar-expand navbar-light bg-light">
      <router-link to="/wall" class="navbar-brand">Groupomania</router-link>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/wall" class="nav-link">Accueil</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">Profil</router-link>
        </li>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Home',
  ...mapState(['status'])
}
</script>

<style scoped>
.navbar{
  display: flex;
  justify-content: space-between;
}

</style>