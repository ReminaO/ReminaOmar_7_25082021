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
      <div>
        <img v-if="users.map((user) => {
          if (this.$store.state.user.userId === message.UserId) 
          return this.$store.state.user.imageUrl;}).join('') !== (null || '')" 
          :src="users.map((user) => {
          if (this.$store.state.user.userId === message.UserId) 
          return user.profilePhoto;}).join('')"/>
        <div class=" ml-3 flex flex-col">
            <p class="font-semibold"> {{ message.userName }} </p>
            <p class="font-semibold"> Titre : {{ message.title }} </p>
            <p class="font-semibold"> {{ message.content }} </p>
            <img :src="message.attachement"/>
            <p class="font-thin text-sm"> {{message.createdAt}} </p>
        </div>
      </div>
      <div>
        <label v-if='!toggle' class="form-row__input"  id="title" name="title" ref="title">Titre: </label><br>
        <input v-if='!toggle' class="form-row__input" type="text" id="title" name="title" ref="title" v-model="title"><br><br>

        <label v-if='!toggle' class="form-row__input" for="attachment">Image : </label><br>
        <input v-if='!toggle' type="file" ref="image" @change="imgSelected()">
        <br><br>
        <label v-if='!toggle' class="form-row__input"  id="content" name="content" ref="content">Exprimez vous: </label><br>
        <textarea v-if='!toggle' class="form-row__input" type="content" id="content" name="content" ref="content" v-model="content"></textarea><br>
        <button v-if='!toggle' @click="modifyMessage()" class="button">
          enregistrer
        </button>
        <button @click="toggle = !toggle" class="button">
          Modifier
        </button><br>
        <button v-if="this.$store.state.user.userId == message.UserId || this.$store.state.user.isAdmin == 1" name="delete" class="button" @click="deleteMessage()">
          Supprimer
        </button>
      </div> 
    <br>
    <Comment />
    </div>
  </div>
</div>
  
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Comment from '@/components/Comment.vue';

const axios = require('axios');


let user = localStorage.getItem('user');
let message = localStorage.getItem('message');
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
  components : {
    Comment
  },
  data () {
    return{
      toggle: true,
      attachement:'',
      content:'',
      title:'',
      userName:'',
      likes:'',
      // messages: []
    }
      
  },
  computed : {
    ...mapState(['status']),
    
    user (){
        return this.$store.state.userinfos
    },
    users() {
        return this.$store.state.users
    },
    messages() {
        return this.$store.state.messages
    },
    comments() {
        return this.$store.state.comments
    }
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
      formData.append('username', this.userName);
      instance.post(`/post`, formData, {
      })
      .then(response => {
        this.title = response.data 
        this.content = response.data 
        this.attachement = response.data
        this.userName = response.data 
        this.$router.go("/wall");
      })
    },
    modifyMessage: function () {
      const formData = new FormData();
      formData.append('image', this.attachement);
      formData.append('content', this.content);
      formData.append('title', this.title);
      instance.put(`/${message.userId}/post`, formData, {
      })
      .then(response => {
        this.title = response.data 
        this.content = response.data 
        this.attachement = response.data
        this.$router.go("/wall");
      })
    },
    deleteMessage: function () {
      const self = this;
      this.$store.dispatch('deleteMessage')
      .then(function () {
        self.$router.go('/wall')
      }, function (error) {
        console.log(error);
      })
    }
}
</script>

<style scoped>

</style>