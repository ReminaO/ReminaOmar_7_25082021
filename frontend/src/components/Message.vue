<template>
<div class="container-fluid">
  <div class="jumbotron text-black">
    <h1 class="text-center">Accueil - Exprimez vous 😊</h1>
    <p class="text-center">Bienvenue sur la plateforme d'échange de Groupomania</p>
  </div>
  <div class="row">
    <div class="col col-xl-10 d-flex flex-column">
      <form @submit="sendForm" class="card">
        <input class="form-row__input" type="text" id="title" name="title" ref="title" v-model="title" placeholder="Titre"><br><br>
        <label for="attachement">Image : </label><br>
        <input  type="file" ref="image" @change="imgSelected()" class="form-row__input">
        <br><br>
        <textarea  class="form-row__input" type="content" id="content" name="content" ref="content" v-model="content" placeholder="Exprimez-vous..."></textarea><br>
        <p v-if="errors.length">
            <b class="text-danger">Merci de corriger l'erreur suivante:</b>
            <ul>
              <li class="text-danger" v-for="error in errors" :key='error.index'>{{ error }}</li>
            </ul>
        </p>
        <button @click="addMessage()" class="button-size" data-bs-toggle="button" autocomplete="off">
          Publier
        </button>
      </form><br>
      <!-- Section Message -->
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
          <button v-if="this.$store.state.user.userId == message.UserId  || this.$store.state.user.isAdmin == 1"  name="delete" class="button-small" data-bs-toggle="button" autocomplete="off" @click="deleteMessage(message.id)">
            🗑️
          </button> 
        <br><br><br><br>
        </div>
        <!-- Section commentaires -->
        <div v-if="comments">
      <div 
        v-for="(comment) in comments.filter((comment) => { 
          return comment.messageId == message.id 
          })" 
        :key="comment.id"
        class="comment-content">
        <div class="comment-display">
        <img :src="require(`../assets/icon.png`)" class='icon-image img-fluid' alt="logo-groupomania">
          <div class="comment-display__content">
              <div class="comment-display__username"> {{ comment.userName }} </div>
              <p class="comment-display__comment"> {{ comment.comment }} </p>
          </div>
        </div>
        <div>
          <button v-if="this.$store.state.user.userId == comment.userId || this.$store.state.user.isAdmin == 1" name="delete" class="button deleteBtn" data-bs-toggle="button" autocomplete="off" @click="deleteComment(comment.id)">
          🗑️
          </button>
        </div> 
      <br>
      </div>
    </div>
      <Comment v-bind="message"/>
    </div>
  </div>
</div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import Comment from '@/components/Comment.vue';


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
      errors: []
    }
  },
  computed : {
    ...mapState({
      user: 'userInfos',
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
    }),
    },     
  
  mounted: function () {
    const self = this;
    console.log(this.$store.state.user);
    if (this.$store.state.user.userId == -1) {
      this.$router.push('/');
      return ;
    }
    if( window.localStorage )
  {
    if( !localStorage.getItem('firstLoad') )
    {
      localStorage['firstLoad'] = true;
      window.location.reload();
    }  
    else
      localStorage.removeItem('firstLoad');
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
    if (!this.title || !this.content || !this.attachement){
        return false
      } else {
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
    })
  }
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
    }, 
    sendForm: function (e) {
      if (this.title && this.content && this.attachement ) {
        this.$router.go("/wall");
        return true;
      }

      this.errors = [];

      if (!this.title) {
        this.errors.push('Titre requis');
      }

      if (!this.content) {
        this.errors.push('Contenu requis');
      }

      if (!this.image) {
        this.errors.push('Image requise ');
      }

      if (!this.errors.length) {
        return true;
      }
      e.preventDefault();
    }
}
}

</script>

<style scoped>
.message-display {
  display: flex;
  /* flex-direction: column; */
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 15px;
  border-bottom: solid 3px rgb(209, 81, 90);
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
    background-color: rgb(247, 245, 245);
  }
  .card {
    width:auto;
    padding: 20px;
    flex-wrap: wrap;
    border-radius: 10px;
    background-color: rgb(255, 255, 255);
  }
  .col{
    padding:0;
}
.row{
  display: flex;
  justify-content: center;
}
  .jumbotron {
    padding: 10px;
  }
  .button-size {
    margin : 0 25%;
    width: min(max(50%), 50%);
    background-color: rgb(9, 31, 67);
    color:#f2f2f2;
    border-radius: 10px;
    border: none;
    padding: 10px;
}
.button-size:hover {
  background-color: rgb(51, 89, 151)
}
  .image {
    width: auto;
    height : 250px;
    flex-wrap: wrap;
    object-fit: contain;
    border-radius: 10px;
  }
.button-small {
  /* width: 100%; */
  background-color: white;
  border: none;
}
.date-format {
  padding:10px;
}
.comment-display__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color:#e6f3f8;
  border-radius: 20px;
  padding: 0 25px;
  margin-bottom : 15px;
  -webkit-box-shadow: 5px 5px 10px 0.5px rgba(0,0,0,0.2);
  box-shadow: 5px 5px 10px 0.5px rgba(0,0,0,0.2);
}
.comment-content{
  display:flex;
  align-items: center;
}
.comment-display {
  display: flex;
}
.comment-display__username {
  font-size: 20px;
  /* color:  */
  margin-bottom: 3px;
  border-bottom: 1px dashed grey;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
}
.comment-display__content {
  font-size: 18px;
}
.deleteBtn{
  background-color: white;
  border: none;
  margin-left:15px;
}
.card-margin {
  margin-bottom: 10px;
}
.icon-image {
  height:30px;
  object-fit: contain;
}
</style>