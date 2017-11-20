<template>
  <div :class="css.widget.class">
    <div class="hivemind-header" v-if="config.title">
      <a class="hivemind-brand" :href="brand.url" :target="brand.target" v-if="media !== 'xs'">
        <img :src="brand.img" :alt="brand.alt">
      </a>
      <h3 class="hivemind-title" v-text="config.title"></h3>
    </div>
    <div class="hivemind-body">
      <div class="hivemind-loading" v-if="loading">
        <spinner :spacing="10" :line-fg-color="config.color" message="loading"></spinner>
      </div>
      <div class="hivemind-content" v-else>
        <error v-if="error" :message="error"></error>
        <ul :class="config.posts.class" v-else>
          <li class="hivemind-post" :style="css.post.style" v-for="item in items" :key="item._id">
            <div class="hivemind-post-thumb" v-if="config.thumb.enabled">
              <a
                :target="config.target"
                :href="item.link"
                :title="item.title">
                <img :src="item.thumb" @load="thumbLoaded" @error="thumbError">
              </a>
            </div>
            <div class="hivemind-post-content">
              <div class="hivemind-post-date" v-if="config.datetime.enabled">
                {{ item.created_time }}
              </div>
              <a
                class="hivemind-post-link"
                v-text="item.title"
                :href="item.link"
                :target="config.target"
                :style="config.link.style"
                :title="item.title"></a>
              <div class="hivemind-post-info" v-if="config.engagement === 'basic'">
                <span class="hivemind-post-info-item" title="likes">
                  <i class="material-icons">thumb_up</i>
                  {{ item.likes | currency }}
                </span>
                <span class="hivemind-post-info-item" title="comments">
                  <i class="material-icons">forum</i>
                  {{ item.comments | currency }}
                </span>
                <span class="hivemind-post-info-item" title="shares">
                  <i class="material-icons">share</i>
                  {{ item.shares | currency }}
                </span>
                <span class="hivemind-post-info-item" title="clicks">
                  <i class="material-icons">touch_app</i>
                  {{ item.clicks | currency }}
                </span>
              </div>
              <div class="hivemind-post-info" v-if="config.engagement === 'reactions'">
                <span class="hivemind-post-info-item" title="love">
                  <i class="material-icons">favorite</i>
                  {{ item.reactions.love | currency }}
                </span>
                <span class="hivemind-post-info-item" title="haha">
                  <i class="material-icons">mood</i>
                  {{ item.reactions.haha | currency }}
                </span>
                <span class="hivemind-post-info-item" title="wow">
                  <i class="material-icons">mood_bad</i>
                  {{ item.reactions.wow | currency }}
                </span>
                <span class="hivemind-post-info-item" title="sad">
                  <i class="material-icons">sentiment_dissatisfied</i>
                  {{ item.reactions.sad | currency }}
                </span>
                <span class="hivemind-post-info-item" title="angry">
                  <i class="material-icons">sentiment_very_dissatisfied</i>
                  {{ item.reactions.angry | currency }}
                </span>
              </div>
            </div>
          </li>
          <div v-if="hikeid" :data-advs-adspot-id="hikeid" style="display:none"></div>
        </ul>
      </div>
    </div>
    <div class="hivemind-footer" v-if="!config.title || media === 'xs'">
      <a class="hivemind-brand" :href="brand.url" :target="brand.target">
        <img :src="brand.img" :alt="brand.alt">
      </a>
    </div>
  </div>
</template>

<script>
  import Widget from '../components/Widget.vue'

  export default {
    name: 'content',
    extends: Widget,
    props: [
      'limit',
      'thumb',
      'target',
      'datetime',
      'engagement',
      'optimizer',
      'overflow',
      'columnXs',
      'columnSm',
      'columnMd',
      'columnLg',
      'column',
      'hikeid'
    ],
    data () {
      return {
        items: []
      }
    },
    computed: {
      config () {
        let results = this.settings

        results.link = {
          style: {
            whiteSpace: results.overflow === 'display' ? 'normal' : 'nowrap'
          }
        }

        results.thumb = {
          value: results.thumb,
          enabled: ['left', 'top'].indexOf(results.thumb) !== -1
        }

        if (results.thumb.enabled) {
          if (results.thumb.value === 'left') {
            results.thumb.placeholder = 'https://via.placeholder.com/80?text=not%20found'
            results.thumb.error = 'https://via.placeholder.com/80?text=broken'
          } else if (results.thumb.value === 'top') {
            results.thumb.placeholder = 'https://via.placeholder.com/500x300?text=not%20found'
            results.thumb.error = 'https://via.placeholder.com/500x300?text=broken'
          }
        }

        results.col = {
          df: results.column === parseInt(results.column) ? results.column : undefined,
          xs: results.columnXs === parseInt(results.columnXs) ? results.columnXs : undefined,
          sm: results.columnSm === parseInt(results.columnSm) ? results.columnSm : undefined,
          md: results.columnMd === parseInt(results.columnMd) ? results.columnMd : undefined,
          lg: results.columnLg === parseInt(results.columnLg) ? results.columnLg : undefined
        }

        results.posts = {
          class: {
            'hivemind-posts': true,
            'hivemind-posts-list': results.thumb.value === 'left',
            'hivemind-posts-card': results.thumb.value === 'top',
            'hivemind-posts-column': !!results.col.df || !!results.col.xs || !!results.col.sm || !!results.col.md || !!results.col.lg
          }
        }

        results.datetime = {
          value: results.datetime,
          enabled: ['sd', 'ld', 'st', 'lt', 'rv'].indexOf(results.datetime) !== -1
        }

        results.optimizer = results.optimizer === 'yes'

        return results
      },
      css () {
        let cfg = this.config.col
        let col = 1

        switch (this.media) {
          case 'lg':
            col = cfg.lg || cfg.df || 1
            break
          case 'md':
            col = cfg.md || cfg.lg || cfg.df || 1
            break
          case 'sm':
            col = cfg.sm || cfg.md || cfg.lg || cfg.df || 1
            break
          case 'xs':
            col = cfg.xs || cfg.sm || cfg.md || cfg.lg || cfg.df || 1
            break
        }

        return {
          widget: {
            class: ['hivemind-widget', 'hivemind-widget-' + this.media]
          },
          post: {
            style: {
              'width': ( 100 / col ) + '%'
            }
          }
        }
      }
    },
    methods: {
      fetchContents (token) {
        let filter = {
          $board: this.config.hiveid,
          $dateformat: this.config.datetime.value
        }

        if (this.config.limit) {
          filter.$limit = this.config.limit
        }

        this.$api.request({
          method: 'get',
          url: 'contents',
          params: filter,
          headers: {
            authorization: token
          }
        }).then((response) => {
          this.fillContents(response.data.data)
        }).catch((error) => {
          this.error = error.message
        }).then(() => {
          this.loading = false
        })
      },
      fillContents (posts) {
        // format posts data
        for (let i = 0; i < posts.length; i++) {
          let post = posts[i]

          // format thumbnail
          if (this.config.thumb.enabled) {
            // set image placeholder
            post.thumb = this.config.thumb.placeholder

            if (this.config.thumb.value === 'left' && post.picture) {
              // if thumb left set thumb with fb post thumb
              post.thumb = post.picture
            } else if (this.config.thumb.value === 'top' && post.full_picture) {
              let pic = post.full_picture
              if (this.config.optimizer) {
                let result = null
                if (pic.indexOf('scontent.xx.fbcdn.net') >= 0) {
                  result = pic.replace(/^\/\/|^.*?:\/\//, '')
                  result = 'http://rsz.io/' + result + '?w=500&h=300&mode=crop'
                } else if (pic.indexOf('external.xx.fbcdn.net') >= 0) {
                  let url = new URL(pic)
                  let params = new URLSearchParams(url.search.slice(1))
                  result = params.get('url')
                  result = result.replace(/^\/\/|^.*?:\/\//, '')
                  result = 'http://rsz.io/' + result + '?w=500&h=300&mode=crop'
                } else {
                  result = this.config.thumb.placeholder
                }
                post.thumb = result
              } else {
                post.thumb = pic
              }
            }
          }

          // format title and icon
          switch (post.type) {
            case 'photo':
              post.title = post.message || post.name
              post.icon = 'photo'
              break
            case 'link':
              post.title = post.name || post.message
              post.icon = 'launch'
              break
            case 'status':
              post.title = post.name || post.message
              post.icon = 'receipt'
              break
            case 'video':
              post.title = post.name || post.message
              post.icon = 'play_circle_filled'
              break
          }

          // add analytics parameters
          let utm = post.link.indexOf('?') === -1 ? '?' : '&'
          post.link += utm + 'utm_source=hivemind.id&utm_medium=widget'
        }

        this.items = posts
      },
      thumbLoaded (e) {
        let img = e.target
        let isLoaded = img.complete && img.naturalHeight > 1

        if (!isLoaded) {
          img.src = this.config.thumb.error
        }
      },
      thumbError (e) {
        let img = e.target
        img.src = this.config.thumb.error
      }
    },
    mounted () {
      this.authenticate().then((response) => {
        this.fetchContents(response.data.accessToken)
      }).catch((error) => {
        this.error = error.message
        this.loading = false
      })
    }
  }
</script>

<style scoped>
  .hivemind-posts {
    padding: 0;
    margin: 0;
    list-style: none;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    text-align: left;
  }
  .hivemind-post {
    position: relative;
    display: block;
    margin: 0;
    padding: 12px 10px;
    border-top: 1px solid #ddd;
    text-align: left;
    box-sizing: border-box;
    background: none;
  }
  .hivemind-post:after {
    content: "";
    display: table;
    clear: both;
  }
  .hivemind-post-thumb a {
    display: block;
  }
  .hivemind-post-thumb img {
    max-width: 100%;
  }
  .hivemind-posts-list .hivemind-post-thumb {
    float: left;
    margin-right: 15px;
  }
  .hivemind-posts-list img {
    width: 65px;
    height: 65px;
    margin: 0;
  }
  .hivemind-posts-card .hivemind-post-thumb {
    margin-bottom: 7px;
  }
  .hivemind-posts-card img {
    width: 100%;
    max-height: 200px;
  }
  .hivemind-posts-column {
    margin: 0 -10px;
    padding: 0;
    border: 0;
  }
  .hivemind-posts-column .hivemind-post {
    display: inline-block;
    vertical-align: top;
    text-align: left;
    padding: 5px 10px;
    border: 0;
  }
  .hivemind-post-date {
    font-size: 85%;
    margin-bottom: 3px;
  }
  .hivemind-post-link {
    display: block;
    margin-bottom: 7px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 100%;
    text-decoration: none;
    line-height: 1.3em;
  }
  .hivemind-post-info {
    font-size: 80%;
  }
  .hivemind-post-info > span {
    margin-right: 7px;
    white-space: nowrap;
    text-transform: uppercase;
  }
  .hivemind-post-info > span > i {
    position: relative;
    margin-left: 1px;
    margin-right: 5px;
    font-size: 100%;
    opacity: .5;
    top: 2px;
  }
</style>
