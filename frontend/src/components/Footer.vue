<template>
<div class="container footer">
    <div class="row">
        <div class="col col-sm12 col-md12">
            <ul class="footer-link">
                <li><a href="#" class="text-white">Mentions Légales</a></li>
                <li><a href="#" class="text-white">About us</a></li>
                <li><a href="#" class="text-white">Contact</a></li>
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
<style scoped>
.footer-link {
    display: flex;
    justify-content: space-around;
    list-style: none;
}
.footer{
    padding-top:20px;
    background-color:#d65959;
}
a {
    list-style: none;
    text-decoration : none; 
    text-decoration-style : solid;
}
</style>
