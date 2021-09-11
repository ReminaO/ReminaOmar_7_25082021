<template>
<div class="container">
  <Nav />
  <Message />
  <Footer />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Nav from '@/components/Nav.vue';
import Footer from '@/components/Footer.vue';
import Message from '@/components/Message.vue';

export default {
  name: 'Home',
  components : {
    Nav,
    Footer,
    Message
  },
  computed : {
    ...mapState(['status'])
  },
  mounted: function () {
    console.log(this.$store.state.user);
    if (this.$store.state.user.userId == -1) {
      this.$router.push('/');
      return ;
    }
    this.$store.dispatch('getAllMessages');
  },
}
</script>

<style scoped>
</style>