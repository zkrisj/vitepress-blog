import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'

//每页的文章数量
const pageSize = 10

export default defineConfig({
    title: 'zkrisj',
    base: '/vitepress-blog',
    cacheDir: './node_modules/vitepress_cache',
    description: 'vitepress,blog,blog-theme',
    ignoreDeadLinks: true,
    themeConfig: {
        algolia: {
          // container: '#app',
          appId: '48REP6ZA9O',
          apiKey: '3482029dd8400cbaa54eff5893aabb62',
          indexName: 'dev_zkrisj',
          placeholder: '请输入关键词',
          buttonText: '搜索',
        },
        posts: await getPosts(pageSize),
        website: 'https://github.com/airene/vitepress-blog-pure', //copyright link
        // 评论的仓库地址
        comment: {
            repo: 'zkrisj/vitepress-blog',
            themes: 'github-light',
            issueTerm: 'pathname'
        },
        nav: [
            { text: '首页', link: '/' },
            { text: '归档', link: '/pages/archives' },
            { text: '标签', link: '/pages/tags' },
            { text: '关于', link: '/pages/about' }
            // { text: 'Airene', link: 'http://airene.net' }  -- External link test
        ],

        //outline:[2,3],
        outlineTitle: '文章摘要',
        socialLinks: [{ icon: 'github', link: 'https://github.com/airene/vitepress-blog-pure' }]
    },
    srcExclude: ['README.md'], // exclude the README.md , needn't to compiler

    vite: {
        //build: { minify: false }
        server: { port: 5000 }
    }
    /*
      optimizeDeps: {
          keepNames: true
      }
      */
})
