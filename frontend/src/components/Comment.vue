<template>
<div class="container">
  <div class="card">
        <input class="form-row__input" type="text" id="post" name="post" ref="post" v-model="post" placeholder="Commentaire"><br><br>
        <button @click="addPost()" class="button btn-primary" data-bs-toggle="button" autocomplete="off">
          Publier
        </button>
    </div><br>
  <div class="card">
    <div v-for="comment in comments" :key="comment.id">
      <div>
        <img :src="users.map((user) => { 
          if (this.$store.state.user.userId === comment.userId) {
            return user.imageUrl
            };
            }).join('')" 
        class="h-12 w-12 rounded-full flex-none"/>
        <div class=" ml-3">
            <p> {{ comment.userName }} </p>
        </div>
      </div>
      <div>
        <input v-if='!toggle' class="form-row__input" type="text" id="post" name="post" ref="post" v-model="post"><br><br>
        <button v-if='!toggle' @click="modifyComment()" class="button btn-primary" data-bs-toggle="button" autocomplete="off">
        enregistrer
        </button>
        <button v-if="this.$store.state.user.userId == comment.UserId || this.$store.state.user.isAdmin == 1" @click="toggle = !toggle" class="button btn-primary" data-bs-toggle="button" autocomplete="off">
        Modifier
        </button><br>
        <button v-if='!toggle' name="delete" class="button btn-primary" data-bs-toggle="button" autocomplete="off" @click="deleteMessage()">
        Supprimer
        </button>
      </div> 
    <br>
    </div>
</div>
  
  </div>
</template>

<script>
import { mapState } from 'vuex';
const axios = require('axios');

let user = localStorage.getItem('user');
let comment = localStorage.getItem('comment');
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
  baseURL: 'http://localhost:3000/api/comments',
  headers: {'Authorization': 'Bearer '+ `${user.token}`}
});

export default {
  name: 'Home',
  data () {
    return{
      toggle: true,
      post:''
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
    this.$store.dispatch('getAllComments');
  },
  
  methods :{
  },
  addPost: function () {
      const formData = new FormData();
      formData.append('post', this.post);
      formData.append('user', this.user);
      instance.post(`/`, formData, {
      })
      .then(response => {
        this.post = response.data
        this.user = response.data 
        this.$router.go("/wall");
      })
    },
    modifyComment: function () {
      const formData = new FormData();
      formData.append('post', this.post);
      instance.put(`/${comment.id}`, formData, {
      })
      .then(response => {
        this.post = response.data
        this.$router.go("/wall");
      })
    },
    deleteComment: function () {
      const self = this;
      this.$store.dispatch('deleteComment')
      .then(function () {
        self.$router.go('/wall')
      }, function (error) {
        console.log(error);
      })
    }
}
</script>

<style scoped>
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
  .card {
    padding: 10px;
    background-color: #ffffff;
    color: white;
  }
  button {
  margin : 0 25%;
  width: 50%;
  background-color: rgb(19, 16, 168);
  color:#f2f2f2;
}
.form-row__input {
    width: min(max(100%), 100%);
}
</style>