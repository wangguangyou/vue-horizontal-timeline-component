
中国历史时间轴
```vue
<template>
  <vue-horizontal-timeline-component
  :rightComplete="rightComplete"
  :leftComplete="leftComplete"
  :positionId="20" @left-loading="left" @right-loading="right" :timelineList="timelineList" >
  <template v-slot:default="slotProps">
    <div class="content">
      <div class="chat">
        {{slotProps.item.content}}
      </div>
    </div>

  </template>
  <template v-slot:time="slotProps">
    {{slotProps.item.time}} 
  </template>
  </vue-horizontal-timeline-component>
</template>

<script>
  const data = [
    {id:11,content:'魏',time:'220～265（45年）'},
    {id:12,content:'蜀',time:'221～263（42年）'},
    {id:13,content:'吴',time:'222～280（58年）'},
    {id:14,content:'晋国',time:'265～420（100余年）'},
    {id:15,content:'西晋',time:'西晋：265～317（52年）'},
    {id:16,content:'东晋',time:'317～420（103年）'},
    {id:17,content:'南北朝',time:'420～589年（169年）'},
    {id:18,content:'南朝：宋',time:'（420～479）'},
    {id:19,content:'齐',time:'（479～502）'},
    {id:20,content:'梁',time:'（502～557）'},
    {id:21,content:'陈',time:'（557～589）'},
    {id:22,content:'北朝：北魏',time:'（386～534）'},
    {id:23,content:'北朝：东魏',time:'（534～550）'},
    {id:24,content:'北朝：西魏',time:'（535～556）'},
    {id:25,content:'北朝：北齐',time:'（550～557）'},
    {id:26,content:'北朝：北周',time:'（557～581）'},
    {id:27,content:'随',time:'581～618（37年）'},
    {id:28,content:'唐',time:'618～907（200余年）'},
    {id:29,content:'五代',time:'907～960（53年）'},
    {id:30,content:'后梁',time:'（907～923)'},
    {id:31,content:'后唐',time:'（923～936）'}
  ]
export default {
  data() {
    return {
      timelineList:null,
      rightComplete:false,
      leftComplete:false,
    }
  },
  methods:{
    right(resolve){
      setTimeout(()=>{
        this.timelineList = this.timelineList.concat([
        {id:32,content:'后晋',time:'（936～947）'},
        {id:33,content:'后周',time:'（920～960）'},
        {id:34,content:'宋',time:'960～1279（300余年）'},
        {id:35,content:'北宋',time:'北宋：960～1127（100余年）'},
        {id:36,content:'南宋',time:'1127～1279（100余年）'},
        {id:37,content:'辽',time:'907～1125（200余年）'},
        {id:38,content:'金',time:'1115～1234（100余年）'},
        {id:39,content:'元',time:'1206～1368（1206铁木真建国，1271年正是定国号为元，97年）'},
        {id:40,content:'明',time:'1368～1644（200余年）'},
        {id:41,content:'清',time:'1616～1911（200余年）'},
        {id:42,content:'中华民国',time:'1912～1949（37年）'},
        {id:43,content:'中华人民共和国',time:'1949至今'}
      ])
        this.rightComplete = true
        resolve()
      },1000)
    },
    left(resolve){
      setTimeout(()=>{
        this.timelineList =
        [
          {id:1,content:'夏',time:'约前22世纪末至约前21世纪初～约前17世纪初（400余年）'},
          {id:2,content:'商',time:'约前17世纪初～约前11世纪（600年左右）'},
          {id:3,content:'周',time:'约前11世纪～256年（800余年）'},
          {id:4,content:'西周',time:'约前11世纪～前771年（300余年）'},
          {id:5,content:'东周',time:'前770年～前256年（400余年）'},
          {id:6,content:'秦',time:'前221年～前206年（15年）'},
          {id:7,content:'汉',time:'前206年～公元220年（400余年）'},
          {id:8,content:'西汉',time:'前206年～公元25年（包括王莽与更始帝）（200余年）'},
          {id:9,content:'东汉',time:'25～220（100余年）'},
          {id:10,content:'三国',time:'220～280（60年，不过三国时代一般从184年黄巾之乱算起）'}
        ].concat(this.timelineList)
        this.leftComplete = true
        resolve()
      },1000)
    }
  },
  mounted(){
    setTimeout(()=>{
      this.timelineList=data
    },500)
  }
}
</script>
<style lang="less">
  .content {
    padding:20px
  }
  .chat {
    position: relative;
    min-width:100px;
    max-width:180px;
    padding: 10px;
    word-wrap:break-word; 
    border: 1px solid #e4e7ed;
    border-radius: 4px;
  }
</style>
```