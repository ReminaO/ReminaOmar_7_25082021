<template>
<div class="container">
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
      </div>
    </nav>
  <h1>Espace Perso</h1>
  <div class="card formulaire">
    <div class="form-row">
        <!-- Modifier ma photo de profil -->
        <img :src="user.imageUrl"/><br>
        <input v-if='!toggle' class="image" type="file" ref="image" @change="fileSelected()">
          
        <br><br>
        <label for="email"> Email : {{user.email}}</label><br>
        <label for="username">Pseudo :  {{user.username}}</label><br>
        <input v-if='!toggle' class="form-row__input" type="text" id="pseudo" name="username" ref="username" v-model="username"> <br>
        
        <label for="bio">Petit mot sur moi : {{user.bio}} </label><br>
        <textarea v-if='!toggle' class="form-row__input" type="bio" id="bio" name="bio" ref="bio" v-model="bio"></textarea><br>
        <button v-if='!toggle' @click="modifyProfile()" class="button">
          enregistrer
        </button>
    </div><br>
    <div class="form-row">
      <button @click="logout()" class="button">
        Déconnexion
      </button><br>
      <button @click="toggle = !toggle" class="button">
        Modifier
      </button><br>
      <button @click="deleteProfile()" class="button">
        Supprimer
      </button> 
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Profile',
  data () {
   return {
    toggle: true,
    id:'',
    email: '',
    username: '',
    bio: '',
    imageUrl:'',
   }
 },
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
    },
    fileSelected: function () {
      this.image = this.$refs.image.files[0];
      this.user.imageUrl = URL.createObjectURL(this.image)
    },
    modifyProfile: function () {
      const self = this;
      this.$store.dispatch('modifyInfos', {
        username: this.$refs.username,
        bio: this.$refs.bio,
        imageUrl: this.$refs.imageUrl
      }).then(function () {
        self.$router.push('/profile');
      }, function (error) {
        console.log(error);
      })
    },
    deleteProfile: function () {
      const self = this;
      this.$store.dispatch('deleteInfos', {
        email: this.user.email,
        username: this.user.sername,
        bio: this.user.bio,
        image: this.user.imageUrl,
        password:'this.user.password',
      }).then(function () {
        self.$router.push('/')
      }, function (error) {
        console.log(error);
      })
    }
  }
}
</script>

<style scoped>
.card {
  margin: 5% 15%;
  width: 75%;
  padding:15px;
  }
img {
  height: 150px;
  object-fit: contain;
}
.form-row {
  display: flex;
  flex-direction: column;
}

.form-row__input {
    padding:8px;
    border: none;
    border-radius: 8px;
    background:#f2f2f2;
    font-weight: 500;
    font-size: 16px;
    flex:1;
    min-width: 100px;
    color: black;
  }
  
.navbar{
  display: flex;
  justify-content: space-between;
}

.formulaire {
  display: flex;
}

button {
  margin : 0 25%;
  width: 50%;
}
</style>>