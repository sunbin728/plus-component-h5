<template>
  <div :class="[prefixCls, {showAll}]">
    <div :class="`${prefixCls}--head`">
      <span>点击以编辑</span>
      <div>
        <button @click='onOk'>{{ editing ? '完成' : '编辑' }}</button>
        <button @click='showEditor'>收起</button>
      </div>
    </div>
    <div :class="`${prefixCls}--list__wrap`">
      <div :class="`${prefixCls}--switch`" @click='showEditor' v-show='!showAll'>
        <svg>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
      </div>
      <span :class="`${prefixCls}--list__label`">我的订阅</span>
      <div :class="[`${prefixCls}--list`, { editing }]">
        <div 
        :class="[`${prefixCls}--list__item`, { active: ~~(currentCate.id) === 0  }]" 
        @click="chooseCate($event, {id: 0, name:'推荐'})"
        >推荐</div>
        <div :class="[`${prefixCls}--list__item`, { active: myCate.id === currentCate.id }]" v-for='myCate in myCates' @click='chooseCate($event, myCate)' :key='`myCate-${myCate.id}`'>{{ myCate.name }}</div>
      </div>
    </div>
    <div :class="`${prefixCls}--list__wrap`" v-show='showAll'>
      <span :class="`${prefixCls}--list__label`">更多订阅</span>
      <div :class="`${prefixCls}--list`">
        <div :class="[`${prefixCls}--list__item`]" v-for='cate in moreCates' @click='chooseCate($event, cate)' :key='`moreCate-${cate.id}`'>{{ cate.name }}</div>
      </div>
    </div>
  </div>
</template>
<script>
const prefixCls = "news__filter";
export default {
  name: "NewsFilter",
  data() {
    return {
      prefixCls,
      editing: false,
      showAll: false,

      myCates: [],
      moreCates: [],

      currentCate: {
        id: 0,
        name: "推荐"
      }
    };
  },

  watch: {
    editing() {},
    showAll(val) {
      !val && (this.editing = !1);
    }
  },
  methods: {
    showEditor() {
      this.showAll = !this.showAll;
    },
    onOk() {
      if (this.editing) {
        this.editing = false;
        const follows = this.myCates.map(c => c.id).join(",");
        this.$http.patch("/news/categories/follows", {
          follows
        });
        this.showAll = false;
        this.$emit("onOk", this.myCates);
      } else {
        this.editing = true;
      }
    },
    chooseCate(e, cate) {
      if (this.showAll) {
        if (this.editing) {
          const index = this.myCates.findIndex(c => c.id === cate.id);
          if (index > -1) {
            this.moreCates.push(cate);
            this.myCates.splice(index, 1);
          } else {
            const index2 = this.moreCates.findIndex(c => c.id === cate.id);
            this.myCates.push(cate);
            this.moreCates.splice(index2, 1);
          }
        } else {
          this.editing = true;
        }
      } else {
        if (cate.id !== this.currentCate.id) {
          const { target: el } = e;
          this.currentCate = { ...cate, el };
          this.$emit("change", this.currentCate);
        }
      }
    },
    async fetchCates() {
      const {
        data: { my_cates: myCates, more_cates: moreCates } = {}
      } = await this.$http.get("/news/cates");
      this.myCates = myCates ? [...myCates] : [];
      this.moreCates = moreCates ? [...moreCates] : [];
    }
  },

  mounted() {
    this.fetchCates();
  }
};
</script>
<style lang='less' src='../style/newsFilter.less'>
</style>
