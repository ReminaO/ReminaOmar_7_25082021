<template>
<div class="container-fluid footer">
    <div class="row">
        <div class="col col-sm12 col-md12">
            <ul class="footer-link">
                <li><a href="#" class="text-white">Mentions Légales</a></li>
                <li><a href="#" class="text-white">About Us</a></li>
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
    flex-direction: column;
    align-items: center;
    list-style: none;
    margin-top: 30px;
    margin-bottom: 0px;
    padding: 0;
}
.container-fluid{
    background-color:rgb(9, 31, 67);
    height: 150px;
    padding: 0;
    margin:0;
}
a {
    list-style: none;
    text-decoration : none; 
    text-decoration-style : solid;
}
li {
    padding: 5px;
}
.col{
    padding:0;
}
</style>
