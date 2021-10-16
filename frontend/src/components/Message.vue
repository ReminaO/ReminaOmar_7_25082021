<template>
<div class="container-fluid">
  <div class="jumbotron text-black">
    <h1>Accueil - Exprimez vous 😊</h1>
    <p class="text-center">Bienvenue sur la plateforme d'échange de Groupomania</p>
  </div>
    <div class="card">
      <input class="form-row__input" type="text" id="title" name="title" ref="title" v-model="title" placeholder="Titre"><br><br>
      <label for="attachement">Image : </label><br>
      <input  type="file" ref="image" @change="imgSelected()" class="form-row__input">
      <br><br>
      <textarea  class="form-row__input" type="content" id="content" name="content" ref="content" v-model="content" placeholder="Exprimez-vous"></textarea><br>
      <button @click="addMessage()" class="button-size btn-primary" data-bs-toggle="button" autocomplete="off">
        Publier
      </button>
    </div><br>
    <div v-for="message in messages" :key="message.id" class="card card-margin">
        <div class="message-container">
        <div >
          <div class=" message-display">
            <div>
              <p class="username-display text-black"> {{ message.userName }} </p>
              <p class="title-display text-black"> Titre : {{ message.title }} </p>
              <p class="content-display text-black"> {{ message.content }} </p>
              
            </div>
              <img :src="message.attachement" class="img-fluid image"/>
              
          </div>
          <span class="date-format">Publié le {{ formatDate(message.createdAt)}}</span>
          
        </div><br>
            <button v-if="this.$store.state.user.userId == message.UserId  || this.$store.state.user.isAdmin == 1"  name="delete" class="button-small btn-danger" data-bs-toggle="button" autocomplete="off" @click="deleteMessage(message.id)">
              Supprimer
            </button> 
      <br><br><br><br>
      </div>
      <div v-if="comments">
    <div 
      v-for="(comment) in comments.filter((comment) => { 
        return comment.messageId == message.id 
        })" 
      :key="comment.id"
      class="comment-content">
      <div class="comment-display">
        <div class="comment-display__content">
            <p class="comment-display__username"> {{ comment.userName }} </p>
            <p class="comment-display__comment"> {{ comment.comment }} </p>
        </div>
      </div>
      <div>
        
        <button v-if="this.$store.state.user.userId == comment.userId || this.$store.state.user.isAdmin == 1" name="delete" class="button deleteBtn btn-danger" data-bs-toggle="button" autocomplete="off" @click="deleteComment(comment.id)">
        Supprimer
        </button>
      </div> 
    <br>
    </div>
  </div>
      <Comment v-bind="message"/>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import Comment from '@/components/Comment.vue';


const axios = require('axios');



let user = localStorage.getItem('user');
// let message = localStorage.getItem('message');
if (!user) {
 user = {
    userId: -1,
    token: '',
  }; 
} else {
  try {
    user = JSON.parse(user);
  } catch (ex) {
    user = {
      userId: -1,
      token: '',
    };
  }
}
const instance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  headers: {'Authorization': 'Bearer '+ `${user.token}`}
});

export default {
  name: 'Message',
  components : {
    Comment, 
  },
  data () {
    return{
      toggle: true, 
      attachement:'',
      content:'',
      title:'',
      userName:'',
      likes:'',
      message: {},
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
    comment() {
        return this.$store.state.comment
    }
    },     
  
  mounted: function () {
    const self = this;
    console.log(this.$store.state.user);
    if (this.$store.state.user.userId == -1) {
      this.$router.push('/');
      return ;
    }
    self.$store.dispatch('getAllMessages');
  },
  
  methods :{
  formatDate(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY')
  }
},
  imgSelected: function () {
    this.attachement = this.$refs.image.files[0];
  },
  addMessage: function () {
    const formData = new FormData();
    formData.append('image', this.attachement);
    formData.append('content', this.content);
    formData.append('title', this.title);
    formData.append('username', this.userName);
    instance.post(`messages/post/${user.userId}`, formData, {
    })
    .then(response => {
      this.title = response.data 
      this.content = response.data 
      this.attachement = response.data
      this.userName = response.data 
      this.$router.go("/wall");
    })
  },
  deleteMessage: function (message) {
    const self = this;
    instance.delete(`messages/post/${message}/${user.userId}`, {
    })
    .then(function () {
      alert("Message supprimé !");
      self.$router.go('/wall')
    }, function (error) {
      console.log(error);
    })
    },
    deleteComment: function (comment) {
      const self = this;
      instance.delete(`comments/comment/${comment}/${user.userId}`, {
      })
      .then(function () {
        alert("Commentaire supprimé !");
        self.$router.go('/wall')
      }, function (error) {
        console.log(error);
      })
    }
}
}

</script>

<style scoped>
.update {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  flex-wrap: wrap;
  width: 100%;
}
.message-display {
  display: flex;
  /* flex-direction: column; */
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  border-bottom: solid 3px rgb(231, 154, 154);
}
.username-display {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.title-display {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: clamp(0.7rem, 1rem + 10vw, 0.5rem);
}
.content-display {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: clamp(1.5rem, 1rem + 10vw, 1rem);
}
.form-row__input {
    padding:8px;
    border: none;
    border-radius: 8px;
    background:#f2f2f2;
    font-weight: 500;
    font-size: clamp(0.5rem, 1rem + 10vw, 1rem);
    flex:1;
    width: min(max(100%), 100%);
    color: black;
  }
  .container-fluid {
    display: flex;
    flex-direction: column;
    margin-bottom: 100px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
  .card {
    width: 75%;
    padding: 20px;
    flex-wrap: wrap;
    border: 5px solid rgb(212, 104, 104);
    border-radius: 30px;
  }
  .jumbotron {
    padding: 10px;
  }
  .button-size {
  margin : 0 25%;
  width: min(max(50%), 50%);
  background-color: rgb(19, 16, 168);
  color:#f2f2f2;
}
.image {
    width: auto;
    height : 250px;
    flex-wrap: wrap;
    object-fit: contain;
    padding-bottom: 10px;
}
.button-small {
  /* width: 100%; */
  background-color: rgb(19, 16, 168);
  color:#f2f2f2;
}
.date-format {
  padding:10px;
}
.comment-display__content {
  display: flex;
  justify-content: space-between;
}
.comment-display__comment{
  padding:8px;
    border: none;
    border-radius: 8px;
    background:#e9ace4;
    font-weight: 500;
    font-size: 16px;
    color: black;
    text-align: right;
    width: 80%;
    min-width: 10px;
}
.comment-display__username {
  display: flex;
  text-align: center;
  align-items: center;
  border: solid 1px #e9aaaa;
  border-radius: 30px;
  padding: 10px;
  background:#e9aaaa;
  width: auto;
}
.deleteBtn{
  text-align: center;
  background-color: rgb(19, 16, 168);
  color:#f2f2f2;
}
.card-margin {
  margin: 10px;
}
</style>