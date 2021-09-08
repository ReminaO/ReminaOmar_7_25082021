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
    },    
  },
  mutations: {
    setStatus: function (state, status) {
      state.status = status;
    },
      logUser: function (state, user) {
        //instance.defaults.headers.common = {'Authorization': `bearer ${user.token}`};
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
    }
  },

  modifyInfos: ({ commit }) => {
    const fd = new FormData();
      fd.append("imageUrl", user.imageUrl);
      fd.append("username", user.username);
      fd.append("email", user.email);
      fd.append("password", user.password);
    instance.put(`/${user.userId}/profile`, fd)
      .then(function (response) {
        commit('user', response.data);
    })
    .catch(function () {
    });
  },

  deleteInfos: ({ commit }) => {
    instance.delete(`/${user.userId}/profile`)
    .then(function (response) {
      commit('userInfos', response.data);
    })
    .catch(function () {
    });
  },
  
})

export default store;