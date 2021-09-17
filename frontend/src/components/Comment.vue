<template>
<div class="container">
<div class = "row">
  <div class="card">
        <label class="form-row__input"  id="post" name="post" ref="post">Commentaire : </label><br>
        <input class="form-row__input" type="text" id="post" name="post" ref="post" v-model="post"><br><br>
        <button @click="addPost()" class="button">
          Publier
        </button>
    </div><br>
</div>
<div class = "row">
  <div class="card">
    <div v-for="comment in comments" :key="comment.id">
      <div>
        <img :src="users.map((user) => { 
          if (user.id === comment.userId) {
            return user.imageUrl
            };
            }).join('')" 
        class="h-12 w-12 rounded-full flex-none"/>
        <div class=" ml-3 flex flex-col">
            <p class="font-semibold"> {{ comment.userName }} </p>
            <p class="font-thin text-sm"> {{dateTime(comment.createdAt)}} </p>
        </div>
      </div>
      <div>
        <input v-if='!toggle' class="form-row__input" type="text" id="post" name="post" ref="post" v-model="post"><br><br>
        <button v-if='!toggle' @click="modifyComment()" class="button">
        enregistrer
        </button>
        <button @click="toggle = !toggle" class="button">
        Modifier
        </button><br>
        <button v-if="user.id == comment.UserId || user.isAdmin == 1" name="delete" class="button" @click="deleteMessage()">
        Supprimer
        </button>
      </div> 
    <br>
    </div>
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
      toggle: true
    }
      
  },
  computed : {
    ...mapState(['status']),
    message() {
        return this.$store.state.message
    },
    comment() {
        return this.$store.state.comment
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

</style>