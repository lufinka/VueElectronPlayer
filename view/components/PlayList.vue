<template>
  <div class="play-list-wrap">
    <ul v-if="playlist.length" class="play-list" :class="listType">
      <li v-for="(song, index) in playlist" v-on:contextmenu="handleRightClick(index)" v-on:dblclick="play(index)" :class="{current: isCurrent(index)}">
        <div class="image">
          <img :src="song.metas.cover" />
        </div>
        <div class="metas">
          <h3>{{song.name}}</h3>
          <h6>{{song.metas.artist}} / {{song.metas.album}}</h6>
        </div>
        <div class="operates">
          <template v-if="isCurrent(index)">
            <a v-if="tempStatus.playing" v-on:click="pause()" href="javascript:void(0);" class="button btn-play">
              <ProgressCircle :size="circleSize" :progress="progress"/>
              <i class="icon">pause</i>
            </a>
            <a v-else v-on:click="play()" href="javascript:void(0);" class="button btn-play">
              <ProgressCircle :size="circleSize" :progress="progress"/>
              <i class="icon">play_arrow</i>
            </a>
          </template>
          <template v-else>
            <a v-on:click="play(index)" href="javascript:void(0);" class="button btn-play"><i class="icon">{{song.isCurrent ? 'pause' : 'play_arrow'}}</i></a>
          </template>
        </div>
      </li>
    </ul>
    <DragImporter :show="!playlist.length" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import player from '@/player'
import DragImporter from '@/components/DragImporter'
import ProgressCircle from '@/components/ProgressCircle'

export default {
  name: 'play-list',
  methods: {
    pause () {
      player.pause()
    },
    play (index) {
      player.play(index)
    },
    isCurrent (index) {
      return index === this.status.index
    },
    handleRightClick (index) {
      this.rightClickedItemIndex = index
      this.menu.popup()
    }
  },
  computed: {
    progress () {
      return this.$store.getters.progress
    },
    circleSize () {
      return this.listType === 'list' ? 'small' : 'medium'
    },
    listType () {
      return ['list', 'grid'][this.status.listType] || 'list'
    },
    ...mapState(['tempStatus', 'status', 'playlist'])
  },
  components: {
    DragImporter,
    ProgressCircle
  },
  mounted () {
    const { Menu, MenuItem } = window.electron.remote
    this.menu = new Menu()
    this.menu.append(new MenuItem({
      label: 'Play This Item',
      click: () => {
        this.play(this.rightClickedItemIndex)
      }
    }))
    this.menu.append(new MenuItem({
      label: 'Remove This Item',
      click: () => {
        this.$store.dispatch('removeSong', this.rightClickedItemIndex)
      }
    }))
  }
}
</script>
<style lang="scss" scoped>
@import "~scssinc";

.play-list-wrap{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  user-select: none;
}

.play-list.list{
  display: block;
  margin: 0;
  padding: 0;
  li{
    display: block;
    height: 80px;
    padding: 0 20px;
    background-clip: padding-box;
    border-bottom: 1px solid rgba(#fff, .05);
    &:hover{
      background-color: rgba(#fff, .05);
    }
    &:last-child{
      border-bottom: none;
    }
    &.current{
      background-color: rgba(#000, .1);
      .metas{
        color: $color_primary;
        h6{
          opacity: 1;
        }
      }
      .operates{
        .btn-play{
          border: none;
          color: rgba($color_primary, .8);
          line-height: 50px;
        }
      }
    }
    .image{
      float: left;
      width: 60px;
      height: 60px;
      margin: 10px 0;
      img{
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .metas{
      float: left;
      max-width: 300px;
      margin: 20px 0 0 15px;
      color: #fff;
      text-transform: capitalize;
      h3{
        height: 20px;
        overflow: hidden;
        opacity: .8;
        font-size: 14px;
        font-weight: bold;
        line-height: 20px;
      }
      h6{
        height: 20px;
        overflow: hidden;
        opacity: .4;
        font-size: 12px;
        font-weight: lighter;
        line-height: 20px;
      }
    }
    .operates{
      float: right;
      width: 48px;
      height: 48px;
      margin-top: 16px;
    }
    .btn-play{
      position: relative;
      display: block;
      width: 48px;
      height: 48px;
      border: 1px solid rgba(#fff, .1);
      border-radius: 50%;
      color: rgba(#fff, .5);
      font-size: 20px;
      line-height: 46px;
      text-align: center;
      &:hover{
        border-color: rgba(#fff, .2);
        color: rgba(#fff, .8);
      }
    }
  }
}

.play-list.grid{
  max-width: 800px;
  margin: 0 auto;
  padding: 5px;
  overflow: hidden;
  li{
    position: relative;
    float: left;
    display: block;
    width: 25%;
    height: auto;
    padding-bottom: 25%;
    border: 5px solid transparent;
    &.current{
      background-color: rgba(#000, .1);
      .metas{
        color: $color_primary;
        h6{
          opacity: 1;
        }
      }
      .operates{
        opacity: 1;
        .btn-play{
          border: none;
          color: rgba($color_primary, .8);
          line-height: 63px;
        }
      }
    }
    .image{
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 100%;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .metas{
      position: absolute;
      z-index: 3;
      right: 0;
      bottom: 0;
      left: 0;
      height: 60px;
      padding: 20px 10px 10px 10px;
      overflow: hidden;
      background-image: linear-gradient(rgba(#000, 0), rgba(#000, 1));
      color: #fff;
      text-align: center;
      text-transform: capitalize;
      h3{
        height: 18px;
        overflow: hidden;
        opacity: .8;
        font-size: 14px;
        font-weight: bold;
        line-height: 18px;
      }
      h6{
        height: 14px;
        overflow: hidden;
        opacity: .4;
        font-size: 12px;
        font-weight: lighter;
        line-height: 14px;
      }
    }
    .operates{
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(#000, .7);
      opacity: 0;
      &:hover{
        opacity: 1;
        .btn-play{
          opacity: 1;
        }
      }
      .btn-play{
        display: block;
        position: absolute;
        top: -20px;
        right: 0;
        bottom: 0;
        left: 0;
        width: 60px;
        height: 60px;
        margin: auto;
        border: 1px solid rgba(#fff, .5);
        border-radius: 50%;
        color: rgba(#fff, .8);
        font-size: 32px;
        line-height: 58px;
        text-align: center;
      }
    }
  }  
}
</style>