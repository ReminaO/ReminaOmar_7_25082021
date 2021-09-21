<template>
<div class="container ">
  <div class="jumbotron text-black">
    <h1>Accueil - Exprimez vous :)</h1>
  </div>
    <div class="card">
          <input class="form-row__input" type="text" id="title" name="title" ref="title" v-model="title" placeholder="Titre"><br><br>
          <label for="attachment">Image : </label><br>
          <input  type="file" ref="image" @change="imgSelected()">
          <br><br>
          <textarea  class="form-row__input" type="content" id="content" name="content" ref="content" v-model="content" placeholder="Exprimez-vous"></textarea><br>
          <button @click="addMessage()" class="button">
            Publier
          </button>
      </div><br>
    <div class="card">
      <div v-for="message in messages" :key="message.id">
        <div >
          <img  
            :src="users.map((user) => {
            if (this.$store.state.user.userId == message.UserId) 
            return this.$store.state.user.imageUrl;})"/>
          <div class=" message-display">
            <div>
              <p class="username-display text-black"> {{ message.userName }} </p>
              <p class="title-display text-black"> Titre : {{ message.title }} </p>
              <p class="content-display text-black"> {{ message.content }} </p>
            </div>
              <img :src="message.attachement" class="img-fluid"/>
          </div>
        </div>
        <div class="update">
          <div>
            <input v-if='!toggle' class="form-row__input" type="text" id="title" name="title" ref="title" v-model="title" placeholder="Modifier le titre"><br><br>
            <label v-if='!toggle' for="attachment">Image : </label><br>
            <input v-if='!toggle' type="file" ref="image" @change="imgSelected()">
            <br><br>
            <textarea v-if='!toggle' class="form-row__input" type="content" id="content" name="content" ref="content" v-model="content" placeholder="Modifier le commentaire"></textarea><br>
            <button v-if='!toggle' @click="modifyMessage()" class="button">
              enregistrer
            </button>
          </div>
          <div>
            <button v-if="this.$store.state.user.userId == message.UserId || this.$store.state.user.isAdmin == 1" @click="toggle = !toggle" class="button">
              Modifier
            </button><br><br>
            <button v-if='!toggle' name="delete" class="button" @click="deleteMessage()">
              Supprimer
            </button><br><br>
          </div>
        </div> 
      <br>
      <Comment />
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
.update {
  display: flex;
  justify-content: space-between;
}
.message-display {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.username-display {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.title-display {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
.content-display {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: clamp(1rem, 1rem + 10vw, 2rem);
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
  .container {
    display: flex;
    flex-direction: column;
    margin-bottom: 100px;
    align-items: center;
    justify-content: center;
  }
  .card {
    width: 85%;
    padding: 10px;
    background-color:#ffffff;
    color: white;
  }
  .jumbotron {
    padding: 10px;
  }
</style>