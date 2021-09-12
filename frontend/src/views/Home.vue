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
}
</script>

<style scoped>
</style>