<template>
<div class="container-fluid">
    <div class='logo'>
      <img :src="require(`../assets/icon-above-font.png`)" alt="logo-groupomania">
    </div>
    <div class="card">
      <h1 class="card__title" v-if="mode == 'login'">Connexion</h1>
      <h1 class="card__title" v-else>Inscription</h1>
      <p class="card__subtitle" v-if="mode == 'login'">Tu n'as pas encore de compte ? <span class="card__action" @click="switchToCreateAccount()">Créer un compte</span></p>
      <p class="card__subtitle" v-else>Tu as déjà un compte ? <span class="card__action" @click="switchToLogin()">Se connecter</span></p>
      <div class="form-row">
        <input v-model="email" class="form-row__input" type="text" placeholder="Adresse mail"/>
      </div>
      <div class="form-row" v-if="mode == 'create'">
        <input v-model="username" class="form-row__input" type="text" placeholder="Pseudo"/>
        <textarea v-model="bio" class="form-row__input" type="text" placeholder="Biographie"/>
      </div>
      <div class="form-row">
        <input v-model="password" class="form-row__input" type="password" placeholder="Mot de passe"/>
      </div>
      <div class="form-row text-warning" v-if="mode == 'login' && status == 'error_login'">
        Adresse mail et/ou mot de passe invalide
      </div>
      <div class="form-row text-warning" v-if="mode == 'create' && status == 'error_create'">
        Adresse mail déjà utilisée
      </div>
      <div class="form-row">
        <button @click="login()" class="button btn-primary" data-bs-toggle="button" autocomplete="off" :class="{'button--disabled' : !validatedFields}" v-if="mode == 'login'">
          <span v-if="status == 'loading'">Connexion en cours...</span>
          <span v-else>Connexion</span>
        </button>
        <button @click="signup()" class="button btn-primary" data-bs-toggle="button" autocomplete="off" :class="{'button--disabled' : !validatedFields}" v-else>
          <span v-if="status == 'loading'">Création en cours...</span>
          <span v-else>Créer mon compte</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Login',
  data: function () {
    return {
      mode: 'login',
      id: '',
      email: '',
      username: '',
      password: '',
      bio: '',
    }
  },
  mounted: function () {
    if (this.$store.state.user.userId != -1) {
      this.$router.go('/wall');
      return ;
    }
  },
  computed: {
    validatedFields: function () {
      if (this.mode == 'create') {
        if (this.email != "" && this.username != "" && this.bio != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapState(['status'])
  },
  methods: {
    switchToCreateAccount: function () {
      this.mode = 'create';
    },
    switchToLogin: function () {
      this.mode = 'login';
    },
    login: function () {
      const self = this;
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password,
      }).then(function () {
        self.$router.push('/wall');
      }, function (error) {
        console.log(error);
      })
    },
    signup: function () {
      const self = this;
      this.$store.dispatch('signup', {
        email: this.email,
        username: this.username,
        bio: this.bio,
        password: this.password,
      }).then(function () {
        self.login();
      }, function (error) {
        console.log(error);
      })
    },
  }
}
</script>

<style scoped>
  .card {
      text-align: center;
      width: 60%;
      background-image: linear-gradient(rgba(0, 0, 255, 0.5), rgba(230, 91, 91, 0.795)),
      url("../assets/network.jpg"); 
      background-repeat: no-repeat;
      background-attachment: fixed;
      color: white;
      background-position: 50% 50%;
      border: 5px solid rgb(212, 104, 104);
      padding: 10px;
        }
  .form-row {
    display: flex;
    margin: 16px 0px;
    gap:16px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .form-row__input {
    padding:8px;
    border: #fff6f6 solid 0.5px;
    border-radius: 8px;
    background-color: #fff6f6;
    opacity: 0.33;
    font-weight: 500;
    font-size: 16px;
    flex:1;
    min-width: 100px;
  }
  .form-row__input::placeholder {
    color:#000000;
  }

  .logo img{
    height: 300px;
    object-fit: contain;
  }
  .container-fluid {
    display: flex;
    flex-direction: column;
    align-items: center; 
    margin: 0;
    padding: 0;
  }
  button {
  background-color: rgb(19, 16, 168);
  color:#f2f2f2;
}
  /* div {
    height: 100%;
    background-image: linear-gradient(rgba(0, 0, 255, 0.5), rgba(230, 91, 91, 0.795)),
    url("../assets/network.jpg"); 
    background-repeat: no-repeat;
    background-attachment: fixed;
    
  } */
</style>>