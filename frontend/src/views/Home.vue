<template>
<div class="container-fluid">
  <Nav />
  <Message v-bind="message"/>
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
  data () {
    return{
      message: {},
    }
  },
  computed : {
    ...mapState(['status']),
  },
}
</script>

<style scoped>

</style>