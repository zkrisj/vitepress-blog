---
page: true
title: 第 8 页
aside: false
---
<script setup>
import Page from "../.vitepress/theme/components/Page.vue";
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(140,160)
</script>
<Page :posts="posts" :pageCurrent="8" :pagesNum="8" />