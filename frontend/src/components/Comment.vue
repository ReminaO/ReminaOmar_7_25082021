<template>
<div class="container">
  <div class="card comment-publish">
    <input class="form-row__input form-control" type="text" id="comment"  v-bind="$attrs" ref="comment" name="comment" v-model="comment" placeholder="Votre Commentaire..."><br>
    <button @click="addPost($attrs)"  v-bind="$attrs" ref="comment" class="button btn-primary" data-bs-toggle="button" autocomplete="off">
      Publier
    </button>
  </div><br>
  
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
  baseURL: 'http://localhost:3000/api/comments/',
  headers: {'Authorization': 'Bearer '+ `${user.token}`}
});

export default {
  name: 'Comment',
  data () {
    return{
      comment : '',
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
    },
    message() {
        return this.$store.state.message
    },
    
    },     
  
  mounted: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push('/');
      return ;
    }
    this.$store.dispatch('getAllComments');
  },
  
  methods :{
    
    addPost: function () {
      let messageId = this.$refs.comment.id;
      instance.post(`comment/${messageId}/${user.userId}`, {
        comment: this.comment
      })
      .then(response => {
        this.comment = response.data.comment
        this.$router.go("/wall");
      });
    },
    
  },
  
}
</script>

<style scoped>
.form-row__input {
    padding:8px;
    border: none;
    border-radius: 8px;
    background:#e9ace4;
    font-weight: 500;
    font-size: 16px;
    flex:1;
    min-width: 100px;
    color: black;
  }
  .card {
    background-color: #ffffff;
    border: none;
  }
  button {
  margin : 0 35%;
  width: 30%;
  background-color: rgb(19, 16, 168);
  color:#f2f2f2;
}
.form-row__input {
    width: min(max(100%), 100%);
}

.comment-publish {
  border: solid 1px #e9ace4;
  border-radius : 30px;
  padding: 10px
}
</style>