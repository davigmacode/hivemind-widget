<template>
  <!-- Slider main container -->
  <div
    class="swiper-container"
    @mouseenter.stop="autoplay('stop')"
    @mouseleave.stop="autoplay('start')">
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper">
      <!-- Slides -->
      <div
        v-for="item in items"
        :key="item._id"
        class="swiper-slide">
        <div
          :data-background="item.full_picture"
          class="swiper-lazy">
          <div class="swiper-meta">
            <div class="swiper-meta-inner">
              <h3 class="swiper-meta-title">
                <a
                  v-text="item.title"
                  :href="item.link"
                  :title="item.title"
                  :target="widget.options.target"></a>
              </h3>
              <small class="swiper-meta-date" v-text="item.created_time"></small>
            </div>
          </div>
          <div class="swiper-lazy-preloader"></div>
        </div>
      </div>
    </div>
    <!-- If we need pagination -->
    <div class="swiper-pagination"></div>

    <!-- If we need navigation buttons -->
    <div class="swiper-button-prev swiper-button-white"></div>
    <div class="swiper-button-next swiper-button-white"></div>
  </div>
</template>

<script>
  export default {
    props: [
      'widget',
      'stories',
      'summaries',
      'screen'
    ],
    data () {
      return {
        swiper: null
      }
    },
    computed: {
      items () {
        let posts = this.stories

        // format posts data
        for (let i = 0; i < posts.length; i++) {
          let post = posts[i]

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
      autoplay (action) {
        this.swiper.autoplay[action]()
      }
    },
    mounted () {
      this.swiper = new Swiper(this.$el, {
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          hideOnClick: true
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        // enable keyboard control
        keyboard: true,
        // Disable preloading of all images
        preloadImages: false,
        // Enable lazy loading
        lazy: true,
        // enable loop
        loop: true
      })
    }
  }
</script>

<style scoped>
  .swiper-lazy {
    display: block;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100%;
  }
  .swiper-meta {
    position: absolute;
    z-index: 1;
    width: 100%;
    bottom: 0;
    background: rgba(0,0,0,0.5);
  }
  .swiper-meta-inner {
    display: block;
    padding: 20px;
    text-shadow: 1px 1px 3px rgba(0,0,0,.2);
    text-align: left;
  }
  .swiper-meta-title {
    margin: 0;
  }
  .swiper-meta-title > a {
    text-decoration: none;
    color: #fff;
  }
  .swiper-meta-date {
    display: block;
    margin-top: 7px;
    color: #fff;
  }
  .swiper-pagination-fraction {
    top: 10px;
    right: 10px;
    bottom: auto;
    left: auto;
    width: auto;
    color: #fff;
    background: rgba(0,0,0,0.5);
    padding: 5px 9px;
    border-radius: 2px;
  }
</style>
