<template>
<div class="container">
  <div class="jumbotron">
   <h1>Accueil - Exprimez vous :)</h1>
</div>
<div class = "row">
  <div class="card">
        <label class="form-row__input"  id="title" name="title" ref="title">Titre: </label><br>
        <input class="form-row__input" type="text" id="title" name="title" ref="title" v-model="title"><br><br>

        <label class="form-row__input" for="attachment">Image : </label><br>
        <input  type="file" ref="image" @change="imgSelected()">
        <br><br>
        <label class="form-row__input"  id="content" name="content" ref="content">Exprimez vous: </label><br>
        <textarea  class="form-row__input" type="content" id="content" name="content" ref="content" v-model="content"></textarea><br>
        <button @click="addMessage()" class="button">
          Publier
        </button>
    </div><br>
</div>
<div class = "row">
  <div class="card">
    <div v-for="message in messages" :key="message.id">
        
    <br>
    </div>
    </div>
</div>
    <!-- <div class="form-row">
      <button @click="toggle = !toggle" class="button">
        Modifier
      </button><br>
      <button @click="deleteMessage()" class="button">
        Supprimer
      </button> 
    </div> -->
  
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
    ...mapState(['status']),
    user: 'userInfos',
    message: 'messageInfos',
    comment : "commentInfos"
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
      this.attachement = this.$refs.image.files[0];
      // this.message.attachement = URL.createObjectURL(this.image)
    },
  },
  addMessage: function () {
      const formData = new FormData();
        formData.append('image', this.attachement);
        formData.append('content', this.content);
        formData.append('title', this.title);
        formData.append('user', this.userId);
      
      instance.post(`/post`, formData, {
      })
      .then(response => {
        this.title = response.data 
        this.content = response.data 
        this.attachement = response.data
        this.userId = response.data 
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