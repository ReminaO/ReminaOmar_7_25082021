<template>
<div class="container">
  <div class="card formulaire">
    <div class="form-group">
        <!-- Modifier ma photo de profil -->
        <img :src="message.attachement"/><br>
        <input class="image" type="file" ref="image" @change="imgSelected()">
        <br><br>
        <textarea  class="form-row__input" type="content" id="content" name="content" ref="content" v-model="content"></textarea><br>
        <button @click="addMessage()" class="button">
          enregistrer
        </button>
    </div><br>
    <div class="form-row">
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
import { mapState } from 'vuex';
const axios = require('axios');

let user = localStorage.getItem('user');
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
  baseURL: 'http://localhost:3000/api/messages',
  headers: {'Authorization': 'Bearer '+ `${user.token}`}
});

export default {
  name: 'Home',
  data () {
    return{
      title:'',
      content: '',
      attachement: '',
      likes: '',
    }
      
  },
  computed : {
    ...mapState(['status'])
  },
  mounted: function () {
    console.log(this.$store.state.user);
    if (this.$store.state.user.userId == -1) {
      this.$router.push('/');
      return ;
    }
    this.$store.dispatch('getAllMessages');
  },
  
  methods :{
    imgSelected: function () {
      this.image = this.$refs.image.files[0];
      this.user.attachement = URL.createObjectURL(this.image)
    },
  },
  addMessage: function () {
      const formData = new FormData();
        formData.append('image', this.image);
        formData.append('content', this.content);
        formData.append('username', this.userName);
      
      instance.post(`/`, formData, {
      })
      .then(response => {
        this.username = response.data 
        this.content = response.data 
        this.image = response.data 
        this.$router.go("/wall");
      })
    },
}
</script>

<style scoped>
.navbar{
  display: flex;
  justify-content: space-between;
}

</style>