---
page: true
title: 主页
aside: false
---
<script setup>
import Page from "./.vitepress/theme/components/Page.vue";
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(0,20)
</script>
<Page :posts="posts" :pageCurrent="1" :pagesNum="8" />