<template>
  <ul :class="config.posts.class">
    <template v-if="showHike">
      <div data-advs-adspot-id="NDkzOjExMjcw" style="display:none"></div>
      <div data-advs-adspot-id="NDkzOjExMjcw" style="display:none"></div>
    </template>
    <template v-for="(item, index) in items">
      <li class="hivemind-post" :style="css.post.style" :key="item._id">
        <div class="hivemind-post-thumb" v-if="config.thumb.enabled">
          <a
            :target="config.target"
            :href="item.link">
            <img :src="item.thumb" @load="thumbLoaded" @error="thumbError">
          </a>
        </div>
        <div class="hivemind-post-content">
          <div class="hivemind-post-date" v-if="config.datetime.enabled && config.datetime.position === 'top'">
            {{ item.created_time }}
          </div>
          <a
            class="hivemind-post-link"
            v-text="item.title"
            :href="item.link"
            :target="config.target"
            :style="config.link.style"></a>
          <div class="hivemind-post-date" v-if="config.datetime.enabled && config.datetime.position === 'bottom'">
            {{ item.created_time }}
          </div>
          <div class="hivemind-post-info" v-if="config.engagement === 'basic'">
            <span
              class="hivemind-post-info-item"
              v-for="(icon, key) in engagements.basic"
              :key="key"
              :title="key">
              <i class="material-icons" v-text="icon"></i>
              {{ item[key] | shortnum }}
            </span>
          </div>
          <div class="hivemind-post-info" v-if="config.engagement === 'reactions'">
            <span
              class="hivemind-post-info-item"
              v-for="(icon, key) in engagements.reactions"
              :key="key"
              :title="key">
              <i class="material-icons" v-text="icon"></i>
              {{ item.reactions[key] | shortnum }}
            </span>
          </div>
        </div>
      </li>
    </template>
    <template v-if="showHike">
      <div data-advs-adspot-id="NDkzOjExMjcw" style="display:none"></div>
    </template>
  </ul>
</template>

<script>
  export default {
    name: 'stories',
    props: [
      'widget',
      'stories',
      'summaries',
      'screen'
    ],
    data () {
      return {
        engagements: {
          basic: {
            likes: 'thumb_up',
            comments: 'forum',
            shares: 'share',
            clicks: 'touch_app'
          },
          reactions: {
            love: 'favorite',
            haha: 'mood',
            wow: 'mood_bad',
            sad: 'sentiment_dissatisfied',
            angry: 'sentiment_very_dissatisfied'
          }
        }
      }
    },
    computed: {
      config () {
        let results = Object.assign({}, this.widget.options)

        results.link = {
          style: {
            whiteSpace: results.overflow === 'display' ? 'normal' : 'nowrap'
          }
        }

        results.thumb = {
          value: results.thumb,
          enabled: ['left', 'top', 'left-first', 'top-first'].indexOf(results.thumb) !== -1
        }

        if (results.thumb.enabled) {
          if (results.thumb.value === 'left') {
            results.thumb.placeholder = 'https://via.placeholder.com/80?text=not%20found'
            results.thumb.error = 'https://via.placeholder.com/80?text=broken'
          } else if (results.thumb.value === 'top') {
            results.thumb.placeholder = 'https://via.placeholder.com/400x250?text=not%20found'
            results.thumb.error = 'https://via.placeholder.com/400x250?text=broken'
          }
        }

        results.col = {
          df: parseInt(results.column) || undefined,
          xs: parseInt(results.columnXs) || undefined,
          sm: parseInt(results.columnSm) || undefined,
          md: parseInt(results.columnMd) || undefined,
          lg: parseInt(results.columnLg) || undefined
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
          enabled: ['sd', 'ld', 'st', 'lt', 'rv'].indexOf(results.datetime) !== -1,
          position: results.datetimePosition || 'top'
        }

        results.optimizer = results.optimizer === 'yes'

        return results
      },
      css () {
        let cfg = this.config.col
        let col = 1

        switch (this.screen) {
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
          post: {
            style: {
              'width': ( 100 / col ) + '%'
            }
          }
        }
      },
      items () {
        let posts = this.stories

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
                post.thumb = `https://cdn.hivemind.id/image/facebook/${post._id}?w=400&h=250`
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
          let redirect = 'https://api.hivemind.id/widgets/' + this.widget._id + '/redirect?url='
          let utm = post.link.indexOf('?') === -1 ? '?' : '&'
          post.link += utm + 'utm_source=hivemind.id&utm_medium=widget'
          post.link = redirect + post.link
        }

        return posts
      }
    },
    methods: {
      showHike () {
        return true
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
    }
  }
</script>

<style scoped>
  .hivemind-posts {
    padding: 0;
    margin: 0;
    list-style: none;
    border-bottom: 1px solid #ddd;
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
    width: 80px;
    display: table-cell;
    vertical-align: top;
    padding-right: 15px;
  }
  .hivemind-posts-list img {
    width: 100%;
    height: auto;
    margin: 0;
  }
  .hivemind-posts-list .hivemind-post-content {
    display: table-cell;
    vertical-align: top;
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
