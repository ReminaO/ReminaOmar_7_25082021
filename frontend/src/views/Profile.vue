<template>
  <div class="card">
    <nav>
        <router-link to="/">Accueil</router-link> |
        <router-link to="/profile">Profil</router-link>
    </nav>
    <h1 class="card__title">Espace Perso</h1>
    <p class="card__subtitle">Voilà donc qui je suis...</p>
    <form ref="form">
      <img :src="user.imageUrl"/><br>
      <input v-if='!toggle' class="image" type="file" ref="image" @change="fileSelected">
        <!-- Modifier ma photo de profil -->
      <br><br>
      <label for="pseudo">Pseudo : {{pseudoMessage}} {{user.username}}</label><br>
      <input v-if='!toggle' type="text" id="pseudo" v-model="pseudoMessage" name="pseudo"> <br>
      <label for="email"> Email : {{user.email}}</label><br>
      <input v-if='!toggle' type="text" id="email" name="email"> <br> 
      <label for="bio">Petit mot sur moi : {{user.bio}} </label><br>
      <textarea v-if='!toggle' type="bio" id="bio" name="bio"></textarea><br>
      <button v-if='!toggle' @click="modifyProfile()" class="button">
        enregistrer
      </button>
    </form>
    
    
    <div class="form-row">
      <button @click="logout()" class="button">
        Déconnexion
      </button>
    </div>
    <div class="form-row">
      <button @click="toggle = !toggle" class="button">
        Modifier
      </button>
    </div>
    <div class="form-row">
      <button @click="deleteProfile()" class="button">
        Supprimer
      </button> 
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
  data () {
   return {
     toggle: true,
     pseudoMessage : [],
   }
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
    },
    fileSelected: function () {
      this.image = this.$refs.image.files[0];
      this.user.imageUrl = URL.createObjectURL(this.image)
    },
    modifyProfile: function () {
      this.$store.dispatch('modifyInfos');
    },
    deleteProfile: function () {
      this.$store.dispatch('deleteInfos');
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