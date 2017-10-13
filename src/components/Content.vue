<template>
  <div class="hivemind-widget">
    <div class="hivemind-body">
      <div class="hivemind-loading" v-if="loading">
        <spinner :spacing="10" :line-fg-color="config.color" message="loading"></spinner>
      </div>
      <div class="hivemind-content" v-else>
        <error v-if="error" :message="error"></error>
        <ul class="hivemind-posts" v-else>
          <li class="hivemind-post" v-for="post in items" :key="post._id">
            <div class="hivemind-post-thumb" v-if="config.thumb === 'left'">
              <img :src="post.thumb" @load="thumbLoaded($event, post)">
            </div>
            <div class="hivemind-post-content">
              <div class="hivemind-post-date">{{ post.created_time }}</div>
              <a
                class="hivemind-post-link"
                target="_blank"
                v-text="post.title"
                :href="post.link"
                :style="config.title.style"
                :title="post.title"></a>
              <div class="hivemind-post-info" v-if="config.engagement === 'basic'">
                <span class="hivemind-post-info-item" title="likes">
                  <i class="material-icons">thumb_up</i>
                  {{ post.likes | currency }}
                </span>
                <span class="hivemind-post-info-item" title="comments">
                  <i class="material-icons">forum</i>
                  {{ post.comments | currency }}
                </span>
                <span class="hivemind-post-info-item" title="shares">
                  <i class="material-icons">share</i>
                  {{ post.shares | currency }}
                </span>
                <span class="hivemind-post-info-item" title="clicks">
                  <i class="material-icons">touch_app</i>
                  {{ post.clicks | currency }}
                </span>
              </div>
              <div class="hivemind-post-info" v-if="config.engagement === 'reactions'">
                <span class="hivemind-post-info-item" title="love">
                  <i class="material-icons">favorite</i>
                  {{ post.reactions.love | currency }}
                </span>
                <span class="hivemind-post-info-item" title="haha">
                  <i class="material-icons">mood</i>
                  {{ post.reactions.haha | currency }}
                </span>
                <span class="hivemind-post-info-item" title="wow">
                  <i class="material-icons">mood_bad</i>
                  {{ post.reactions.wow | currency }}
                </span>
                <span class="hivemind-post-info-item" title="sad">
                  <i class="material-icons">sentiment_dissatisfied</i>
                  {{ post.reactions.sad | currency }}
                </span>
                <span class="hivemind-post-info-item" title="angry">
                  <i class="material-icons">sentiment_very_dissatisfied</i>
                  {{ post.reactions.angry | currency }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="hivemind-brand">
      <a href="https://beta.hivemind.id" target="_blank">
        <img src="https://unpkg.com/hivemind-widget/img/powered.gif" alt="powered by hivemind.id">
      </a>
    </div>
  </div>
</template>

<script>
  import Widget from './Widget.vue'

  export default {
    extends: Widget,
    props: {
      limit: {
        type: Number,
        required: false,
        default: 5
      },
      thumb: {
        type: String,
        required: false,
        default: 'hidden'
      },
      datetime: {
        type: String,
        required: false,
        default: 'st'
      },
      engagement: {
        type: String,
        required: false,
        default: 'basic'
      },
      overflow: {
        type: String,
        required: false,
        default: 'hidden'
      },
      color: {
        type: String,
        required: false,
        default: '#059B85'
      }
    },
    data () {
      return {
        items: []
      }
    },
    computed: {
      config () {
        return {
          thumb: this.thumb || 'hidden',
          engagement: this.engagement || 'basic',
          title: {
            style: {
              whiteSpace: this.overflow === 'display' ? 'normal' : 'nowrap',
              color: this.color
            }
          }
        }
      }
    },
    methods: {
      fetchContents (token) {
        let filter = {
          $board: this.hiveid,
          $dateformat: this.datetime || 'st'
        }

        if (this.limit) {
          filter.$limit = this.limit
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
          post.thumb = 'https://via.placeholder.com/300?text=not%20found'
          if (post.picture) {
            post.thumb = post.picture
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
      thumbLoaded (e, post) {
        let img = e.target
        let isLoaded = img.complete && img.naturalHeight > 1
        if (!isLoaded) {
          img.src = '//via.placeholder.com/130?text=broken'
        }
      }
    },
    mounted () {
      this.preProcessing()
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
  }
  .hivemind-post {
    position: relative;
    display: block;
    padding: 12px 10px;
    border-top: 1px solid #ddd;
    text-align: left;
  }
  .hivemind-post:after {
    content: "";
    display: table;
    clear: both;
  }
  .hivemind-post-thumb {
    float: left;
    margin-right: 15px;
  }
  .hivemind-post-thumb > img {
    width: 65px;
    height: 65px;
    margin: 0;
  }
  .hivemind-post-date {
    font-size: 85%;
  }
  .hivemind-post-link {
    display: block;
    margin: 3px 0 7px;
    max-width: 100%;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 100%;
    color: #0a7a7d;
    cursor: pointer;
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
