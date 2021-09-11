import { createStore } from 'vuex'

const axios = require('axios');

// const instance = axios.create({
//   baseURL: 'http://localhost:3000/api/users/',
//   headers: {'Authorization': 'Bearer '+ `${this.token}`}
// });

let user = localStorage.getItem('user');
// let tokenAccess = localStorage.getItem('token');
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
  baseURL: 'http://localhost:3000/api/users/',
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
    }
  },
  actions: {
    login: ({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post('/login', userInfos)
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
        instance.post('/signup', userInfos)
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
      instance.get(`/${user.userId}/profile`)
      .then(function (response) {
        commit('userInfos', response.data);
      })
      .catch(function () {
      });
    },
    deleteInfos: ({ commit }) => {
      instance.delete(`/${user.userId}/profile`)
        .then(function (response) {
          commit('deleteInfos', user.id)
          alert(response.data);
      })
      .catch(function () {
      });
    },
    getAllMessages: ({ commit }) => {
      instance.get(`/`)
      .then(function (response) {
        commit('userInfos', response.data);
      })
      .catch(function () {
      });
    },
  },
})

export default store;