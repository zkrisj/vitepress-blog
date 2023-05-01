---
page: true
title: 第 7 页
aside: false
---
<script setup>
import Page from "../.vitepress/theme/components/Page.vue";
import { useData } from "vitepress";
const { theme } = useData();
const posts = theme.value.posts.slice(120,140)
</script>
<Page :posts="posts" :pageCurrent="7" :pagesNum="8" />