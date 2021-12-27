<template>
  <div class="container-fluid">
    <PageLoader />
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
import PageLoader from '@/components/PageLoader.vue';

export default {
  name: 'Home',
  components : {
    Nav,
    Footer,
    Message,
    PageLoader
  },
  computed : {
    ...mapState(['status']),
  },
}
</script>

<style scoped>
.container-fluid {
  margin: 0;
  padding: 0;
}
</style>