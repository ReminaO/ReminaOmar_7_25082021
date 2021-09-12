import { createStore } from 'vuex'

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
  baseURL: 'http://localhost:3000/api/',
  headers: {'Authorization': 'Bearer '+ `${user.token}`}
});

// Create a new store instance.
const store = createStore({
  state: {
    status: '',
    user: user,
    userInfos: {
      email: '',
      username: '',
      bio: '',
      imageUrl: '',
      isAdmin:'',
    },
    message: [],
    messageInfos: {
      title:'',
      content: '',
      attachement: '',
      likes: '',
    },
    comment: [],
    commentInfos: {
      userName: '',
      post: ''
    }
  },
  mutations: {
    setStatus: function (state, status) {
      state.status = status;
    },
    logUser: function (state, user) {
        localStorage.setItem('user', JSON.stringify(user));
        state.user = user;
    },
    userInfos: function (state, userInfos) {
      state.userInfos = userInfos;
    },
    logout: function (state) {
      state.user = {
        userId: -1,
        token: '',
      }
      localStorage.removeItem('user');
    },
    deleteInfos: function (state) {
      state.user = {
        userId: -1,
        token: '',
      }
      localStorage.removeItem('user');
    },
    messageInfos: function (state, messageInfos) {
      state.messageinfos = messageInfos;
    },
    
    message: function (state, user) {
      localStorage.setItem('message', JSON.stringify(user));
      state.message = message;
  },
  },
  actions: {
    login: ({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post('users/login', userInfos)
        .then(function (response) {
          commit('setStatus', '');
          commit('logUser', response.data);
          resolve(response);
        })
        .catch(function (error) {
          commit('setStatus', 'error_login');
          reject(error);
        });
      });
    },
    signup: ({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        instance.post('users/signup', userInfos)
        .then(function (response) {
          commit('setStatus', 'created');
          resolve(response);
        })
        .catch(function (error) {
          commit('setStatus', 'error_create');
          reject(error);
        });
      });
    },
    getUserInfos: ({ commit }) => {
      instance.get(`users/${user.userId}/profile`)
      .then(function (response) {
        commit('userInfos', response.data);
      })
      .catch(function () {
      });
    },
    deleteInfos: ({ commit }) => {
      instance.delete(`users/${user.userId}/profile`)
        .then(function (response) {
          commit('deleteInfos', user.id)
          alert(response.data);
      })
      .catch(function () {
      });
    },
    getAllMessages: ({ commit }) => {
      instance.get(`messages`)
      .then(function (response) {
        commit('messageInfos', response.data);
        commit('message', response.data);
      })
      .catch(function () {
      });
    },
    deleteMessage: ({ commit }) => {
      instance.delete(`messages/${message.userId}/post`)
        .then(function (response) {
          commit('deleteInfos', message.id)
          alert(response.data);
      })
      .catch(function () {
      });
    },
  },
})

export default store;