<template>
  <div class="container-fluid">
    <div class='logo'>
      <img :src="require(`../assets/icon-above-font.png`)" alt="logo-groupomania">
    </div>
    <form @submit="checkForm" class="card">
      <h1 class="card__title" v-if="mode == 'login'">Connexion</h1>
      <h1 class="card__title" v-else>Inscription</h1>
      <p class="card__subtitle" v-if="mode == 'login'">Tu n'as pas encore de compte ? <span class="card__action" @click="switchToCreateAccount()">Créer un compte</span></p>
      <p class="card__subtitle" v-else>Tu as déjà un compte ? <span class="card__action" @click="switchToLogin()">Se connecter</span></p>
      <div class="form-row">
        <input v-model="email" @change="isEmailValid" class="form-row__input" type="text" placeholder="Adresse mail"/>
      </div>
      <div class="form-row" v-if="mode == 'create'">
        <input v-model="username" class="form-row__input" type="text" placeholder="Pseudo"/>
        <textarea v-model="bio" class="form-row__input" type="text" placeholder="Biographie"/>
      </div>
      <div class="form-row">
        <input v-model="password" @change="isPwdValid" class="form-row__input" type="password" placeholder="Mot de passe"/>
      </div>
      <div class="form-row text-danger" v-if="mode == 'login' && status == 'error_login'">
        Adresse mail et/ou mot de passe invalide
      </div>
      <div class="form-row text-danger"  v-if="mode == 'create' && status == 'error_create'">
        <p v-if="errors.length">
          <span>
            <p class="text-danger" v-for="error in errors" :key='error.index'>{{ error }}</p>
          </span>
        </p>
      </div>
      <div class="form-row">
        <button @click="login()" class="button" :class="{'button--disabled' : !validatedFields}" v-if="mode == 'login'">
          <span v-if="status == 'loading'">Connexion en cours...</span>
          <span v-else>Connexion</span>
        </button>
        <button @click="signup()" class="button"  :class="{'button--disabled' : !validatedFields}" v-else>
          <span v-if="status == 'loading'">Création en cours...</span>
          <span v-else>Créer mon compte</span>
        </button>
      </div>
    </form>
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
      errors: []
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
    checkForm: function (e) {
      const email_regex = /^(([^<>()[\].,;:s@"]+(.[^<>()[\].,;:s@"]+)*)|(".+"))@((s[[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
      const email = this.email;
      const pwd_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      const password = this.password;
      
      this.errors = [];
    
      if (!email_regex.test(email)) {
        this.errors.push('Merci de saisir le bon format d\'adresse mail !');
    } else if (!pwd_regex.test(password)) {
        this.errors.push('Le mot de passe doit comporter un minimum de 8 caractères, au moins un chiffre et au moins une lettre ');
    } else {
        this.errors.push('Adresse mail déjà utilisée !');
      }
      e.preventDefault();
    },
  }
}
</script>

<style scoped>
  .card {
      text-align: center;
      width: 50%;
      background: rgb(255, 178, 162);
      color: white;
      background-position: 50% 50%;
      border: 1px solid rgb(253, 88, 55);
      padding: 10px;
      border-radius: 8px;
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
    border: rgb(204, 43, 54) solid 1px;
    border-radius: 8px;
    background-color: rgba(201, 55, 65,0.5);
    font-weight: 500;
    font-size: 20px;
    flex:1;
    min-width: 100px;
    color: white;
  }
  .form-row__input::placeholder {
    color:rgba(255,255,255,0.8);
    
  }
.form-row__input {
    outline:rgb(255, 101, 70);
    
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
  background-color:rgb(255, 101, 70);
  color:rgba(255,255,255,1);
  border-radius: 8px;
  padding: 10px 25px;
  font-size: 23px;
  border: none;
}
.button--disabled {
  background-color:rgba(253, 45, 1, 0.2);
  color:rgba(255,255,255,0.8);
}
.card__action {
  color: rgb(167, 39, 14);
  cursor: pointer;
}
.card__action:hover {
  color: rgb(253, 45, 1);
  text-decoration: underline;

}
.card__subtitle {
  font-size: 23px;
}
</style>>