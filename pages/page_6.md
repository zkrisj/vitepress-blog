---
page: true
title: 第 6 页
aside: false
---
<script setup>
import Page from "../.vitepress/theme/components/Page.vue";
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(100,120)
</script>
<Page :posts="posts" :pageCurrent="6" :pagesNum="8" />