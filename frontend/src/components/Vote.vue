<template>
    <div class="feeling">
          <div class="likes">
            <p @click="like()"> J'aime 👍</p>
          </div>
          <div class="dislikes">
            <p @click="dislike()">Je n'aime pas 👎</p>
          </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
const axios = require('axios');


let user = localStorage.getItem('user');
let like = localStorage.getItem('like');
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
  baseURL: 'http://localhost:3000/api/likes',
  headers: {'Authorization': 'Bearer '+ `${user.token}`}
});

export default {
  name: 'Vote',
  data () {
    return{
      toggle: true, 
      attachement:'',
      content:'',
      title:'',
      userName:'',
    }
      
  },
  computed : {
    ...mapState(['status']),
    
    likes() {
      return this.$store.state.likes
    },
    dislikes() {
      return this.$store.state.dislikes
    }
    },

    like: function () {
      const formData = new FormData();
      formData.append('userId', this.userId);
      instance.put(`/${like.messageId}/like`, formData, {
      })
      .then(response => {
        this.userId = response.data 
        this.$router.go("/wall");
      })
    },
    dislike: function () {
      const formData = new FormData();
      formData.append('userId', this.userId);
      instance.put(`/${like.messageId}/dislike`, formData, {
      })
      .then(response => {
        this.userId = response.data 
        this.$router.go("/wall");
      })
    }   
}
</script>
<style scoped>
.feeling {
    display: flex;
    justify-content: space-between;
}
</style>