<template>
<div class="container-fluid">
    <div class="row">
        <div class="col col-sm12 col-md12">
            <ul class="footer-link">
                <li><a href="#">Mentions Légales</a></li>
                <li><a href="#">About us</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </div>
    </div>
</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'Footer',
computed: {
    ...mapState({
      user: 'userInfos',
    }),
}
}
</script>
