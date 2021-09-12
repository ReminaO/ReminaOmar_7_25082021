<template>
<div class="container">
  <Nav />
  <h1>Espace Perso</h1>
  <div class="card formulaire">
    <div class="form-group">
        <!-- Modifier ma photo de profil -->
        <img :src="user.imageUrl"/><br>
        <input v-if='!toggle' class="image" type="file" ref="image" @change="fileSelected()">
          
        <br><br>
        <label for="email"> Email : {{user.email}}</label><br>
        <label for="username">Pseudo :  {{user.username}}</label><br>
        <input v-if='!toggle' class="form-row__input" type="text" id="pseudo" name="username" ref="username" v-model="username"> <br>
        
        <label for="bio">Petit mot sur moi : {{user.bio}} </label><br>
        <textarea v-if='!toggle' class="form-row__input" type="bio" id="bio" name="bio" ref="bio" v-model="bio"></textarea><br>
        <label for="isAdmin">Admin : {{user.isAdmin}} </label>
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
  
<Footer />
</div>
</template>

<script>
import { mapState } from 'vuex';
const axios = require('axios');

import Nav from '@/components/Nav.vue';
import Footer from '@/components/Footer.vue';

let user = localStorage.getItem('user');
// let tokenAccess = localStorage.getItem('token');
if (!user) {
 user = {
    userId: -1,
    token: '',
  }; 
} else {
  try {
    user = JSON.parse(user);
    //instance.defaults.headers.common = {'Authorization': `bearer ${user.token}`};
  } catch (ex) {
    user = {
      userId: -1,
      token: '',
    };
  }
}
const instance = axios.create({
  baseURL: 'http://localhost:3000/api/users/',
  headers: {'Authorization': 'Bearer '+ `${user.token}`}
});
export default {
  name: 'Profile',
  components: {
    Nav,
    Footer
  },
  data () {
   return {
    toggle: true,
    id:'',
    email: '',
    username: '',
    bio: '',
    imageUrl:'',
    isAdmin:''
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
      const formData = new FormData();
        formData.append('image', this.image);
        formData.append('username', this.username);
        formData.append('bio', this.bio);
      
      instance.put(`/${user.userId}/profile`, formData, {
      })
      .then(response => {
        this.username = response.data 
        this.bio = response.data 
        this.image = response.data 
        this.$router.go("/profile");
      })
    },
    deleteProfile: function () {
      const self = this;
      this.$store.dispatch('deleteInfos')
      .then(function () {
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
.form-group {
  text-align: center;
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
  
.formulaire {
  display: flex;
}

button {
  margin : 0 25%;
  width: 50%;
}
</style>>