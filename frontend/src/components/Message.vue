<template>
<div class="container-fluid">
  <div class="jumbotron text-black">
    <h1>Accueil - Exprimez vous 😊</h1>
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
    <div class="card">
      <div v-for="message in messages" :key="message.id">
        <div class="message-container">
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
              <img :src="message.attachement" class="img-fluid image"/>
          </div>
        </div>
        <div class="update">
          <div>
            <input v-if="this.$store.state.user.userId == message.UserId && !toggle|| this.$store.state.user.isAdmin == 1 && !toggle" class="form-row__input" type="text" id="title" name="title" ref="title" v-model="title" placeholder="Modifier le titre"><br><br>
            <label v-if="this.$store.state.user.userId == message.UserId && !toggle || this.$store.state.user.isAdmin == 1 && !toggle " for="attachment" class="text-black">Image : </label><br>
            <input v-if="this.$store.state.user.userId == message.UserId && !toggle || this.$store.state.user.isAdmin == 1 && !toggle" type="file" ref="image" @change="imgSelected()" class="form-row__input">
            <br><br>
            <textarea v-if="this.$store.state.user.userId == message.UserId && !toggle || this.$store.state.user.isAdmin == 1 && !toggle" class="form-row__input" type="content" id="content" name="content" ref="content" v-model="content" placeholder="Modifier le commentaire"></textarea><br>
            <button v-if="this.$store.state.user.userId == message.UserId && !toggle || this.$store.state.user.isAdmin == 1 && !toggle" @click="modifyMessage()" class="button-small btn-primary" data-bs-toggle="button" autocomplete="off">
              enregistrer
            </button><br><br>
          </div>
          <div>
            <button v-if="this.$store.state.user.userId == message.UserId || this.$store.state.user.isAdmin == 1" @click="toggle = !toggle" class="button-small btn-primary" data-bs-toggle="button" autocomplete="off">
              Modifier
            </button><br><br>
            <button v-if="this.$store.state.user.userId == message.UserId && !toggle || this.$store.state.user.isAdmin == 1 && !toggle "  name="delete" class="button-small btn-primary" data-bs-toggle="button" autocomplete="off" @click="deleteMessage()">
              Supprimer
            </button><br><br>
          </div>
        </div> 
      <br>
      <Vote />
      <span class="date-format">Publié le {{ formatDate(message.createdAt)}}</span><br><br>
      <Comment />
      </div>
      </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import Comment from '@/components/Comment.vue';
import Vote from '@/components/Vote.vue';

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
  name: 'Message',
  components : {
    Comment, 
    Vote
  },
  data () {
    return{
      toggle: true, 
      attachement:'',
      content:'',
      title:'',
      userName:'',
      likes:'',
      id: this.$route.params.id,
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
    instance.post(`/post/${user.userId}`, formData, {
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
    },
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
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
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
  font-size: clamp(1rem, 1rem + 10vw, 2rem);
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
    width: 70%;
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
    width: min(max(100%), 70%);
    height : 250px;
    flex-wrap: wrap;
    object-fit: contain;
}
/* img { 
  height: 250px;
} */
.button-small {
  width: 100%;
  background-color: rgb(19, 16, 168);
  color:#f2f2f2;
}
.message-container {
  border-bottom: 3px solid rgb(231, 154, 154);
}
.date-format {
  padding:10px;
}
</style>