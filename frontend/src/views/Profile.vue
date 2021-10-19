<template>
<div class="container-fluid">
  <Nav /><br>
  <h1 class="text-center">Espace Perso</h1>
  <div class="card formulaire">
    <form @submit="checkForm" class="form-group">
        <!-- Modifier ma photo de profil -->
        <img :src="user.imageUrl"/><br>
        <input v-if='!toggle' class="image" type="file" ref="image" @change="fileSelected()">
          
        <br><br>
        <label for="isAdmin" v-if='$store.state.user.isAdmin == 1'>Admin</label> <input type="checkbox" v-model="checked" v-if='$store.state.user.isAdmin == 1' id='isAdmin' :checked="$store.state.user.isAdmin"/><br>
        <label for="email"> Email : {{user.email}}</label><br>
        <label for="username">Nom :  {{user.username}}</label><br>
        <label for="bio">Petit mot sur moi : {{user.bio}} </label><br><br>
        <!-- Modifier mes informations de profil -->
        <input v-if='!toggle' class="form-row__input" type="text" id="username" name="username" ref="username" v-model="username" placeholder="Modifier mon nom"> <br><br>
        <textarea v-if='!toggle' class="form-row__input" type="text" id="bio" name="bio" ref="bio" v-model="bio" placeholder="Modifier ma bio"></textarea><br><br>
        <input v-if='!toggle' class="form-row__input" type="password" id="password" name="password" ref="password" v-model="password" placeholder="Modifier le mot de passe**"> <br><br>
        <p v-if='!toggle'>**Champs obligatoires</p>
        <p v-if="errors.length && !toggle">
          <b class="text-danger">Merci de corriger l'erreur suivante:</b>
          <ul>
            <li class="text-danger" v-for="error in errors" :key='error.index'>{{ error }}</li>
          </ul>
        </p>
        <button v-if='!toggle && !show' @click="modifyProfile()" class="button btn-primary" data-bs-toggle="button" autocomplete="off">
          Enregistrer
        </button><br>
        
    </form><br>
    <div class="form-row">
      <button @click="show = !show" v-if='!toggle && !show' class="button btn-primary" data-bs-toggle="button" autocomplete="off">
        Annuler
      </button><br><br>
      <button v-if='!toggle && !show' @click="deleteProfile()" class="button btn-danger" data-bs-toggle="button" autocomplete="off">
        Supprimer
      </button> <br>
      
      <button @click="toggle = !toggle" class="button btn-primary" data-bs-toggle="button" autocomplete="off">
        Modifier
      </button><br>
      <button @click="logout()" class="button btn-primary" data-bs-toggle="button" autocomplete="off">
        Déconnexion
      </button><br>
      
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
    show: false,
    id:'',
    email: '',
    username: '',
    bio: '',
    imageUrl:'',
    isAdmin:'',
    password:'',
    errors: []
   }
 },
  mounted: function () {
    const self = this;
    console.log(this.$store.state.user);
    if (this.$store.state.user.userId == -1) {
      this.$router.push('/');
      return ;
    }
    self.$store.dispatch('getUserInfos');
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
      if (!this.password){
        return false
      } else {
        const formData = new FormData();
        formData.append('image', this.image);
        formData.append('username', this.username);
        formData.append('bio', this.bio);
        formData.append('password', this.password);      
        instance.put(`/${user.userId}/profile`, formData, {
          })
          .then(response => {
            this.username = response.data 
            this.bio = response.data 
            this.image = response.data
            this.password = response.data
      })
      }
      
    },
    deleteProfile: function () {
      const self = this;
      this.$store.dispatch('deleteInfos')
      .then(function () {
        alert("Profile supprimé !");
        self.$router.push('/')
      }, function (error) {
        console.log(error);
      })
    }, 
    checkForm: function (e) {
      if (this.password) {
        alert("Profile mis à jour ! ");
        this.$router.go("/profile");
        return true;
      }

      this.errors = [];

      if (!this.password) {
        this.errors.push('Mot de passe obligatoire');
      }

      e.preventDefault();
    }
  }

}

</script>

<style scoped>
html, body{
  height: 100%;
  width: 100%;
}
.card {
  margin: 5% 15%;
  width: 75%;
  padding:15px;
  flex-wrap: wrap;
    border: 5px solid rgb(212, 104, 104);
    border-radius: 30px;
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
  background-color: rgb(19, 16, 168);
}
.btn-danger {
  border : 3px solid red
}
.container-fluid {
  margin: 0;
  padding: 0;
}

label {
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 20px;
}

</style>>