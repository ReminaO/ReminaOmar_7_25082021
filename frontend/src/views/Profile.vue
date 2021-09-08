<template>
  <div class="card">
    <nav>
        <router-link to="/">Accueil</router-link> |
        <router-link to="/profile">Profil</router-link>
    </nav>
    <h1 class="card__title">Espace Perso</h1>
    <p class="card__subtitle">Voilà donc qui je suis...</p>
    <p>{{user.username}}</p> <p>{{user.email}}</p> <p>{{user.bio}} </p>
    <img :src="user.imageUrl"/>
    <div class="form-row">
      <button @click="logout()" class="button">
        Déconnexion
      </button>
      <!-- <button @click="modify()"class="button">
        Modifier
      </button>
      <button @click="delete()"class="button">
        Supprimer
      </button> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Profile',
  mounted: function () {
    console.log(this.$store.state.user);
    if (this.$store.state.user.userId == -1) {
      this.$router.push('/');
      return ;
    }
    this.$store.dispatch('getUserInfos');
  },
  computed: {
    ...mapState({
      user: 'userInfos',
    })
  },
  methods: {
    logout: function () {
      this.$store.commit('logout');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.card {
        margin: 15% 25%;
        width: 50%;
        }
img {
  height: 100px;
}
</style>>