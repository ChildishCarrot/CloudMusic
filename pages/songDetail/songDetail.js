// pages/songDetail/songDetail.js
import moment from 'moment'
import request from '../../utils/request'

//获取全局实例
const appInstance = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,      //音乐是否播放
        song: {},            //歌曲详情对象
        musicId: '',
        musicLink: '',      //  音乐的链接
        currentTime: '00:00',   //实时时间
        durationTime: '00:00',  //总时长
        currentWidth: 0,        //实时进度条的宽度
        dt:0                //总时长原数据

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //options:用于接收路由跳转的query参数
        console.log(options)

        let musicId = options.musicId
        this.setData({
            musicId
        })
        this.getMusicInfo(musicId)

        

        //判断当前页面音乐是否在播放
        if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
            //修改当前页面音乐播放状态为true
            this.setData({
                isPlay:true
            })
        }

        //创建控制音乐播放的实例
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        // 监听音乐播放/暂停/停止
        this.backgroundAudioManager.onPlay(() => {
            this.changePlayState(true)
            appInstance.globalData.musicId = musicId
        })
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false)
        })

        //监听音乐实时播放的进度
        this.backgroundAudioManager.onTimeUpdate(() => {
            let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
            let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450
            this.setData({
                currentTime,
                currentWidth
            })
        })
    },

    //修改播放状态的功能函数
    changePlayState(isPlay){
        //修改音乐是否的状态
        this.setData({
            isPlay
        })
        //修改全局音乐播放的状态
        appInstance.globalData.isMusicPlay = isPlay
    },

    //获取音乐详情的功能函数
    async getMusicInfo(musicId){
        let songData = await request('/song/detail',{ids:musicId})

        let durationTime = moment(songData.songs[0].dt).format('mm:ss')
        this.setData({
            song: songData.songs[0],
            durationTime,
            dt:songData.songs[0].dt
        })

        //动态修改窗口的标题
        wx.setNavigationBarTitle({
            title: this.data.song.name
        })
    },
    // 点击播放或者暂停的回调
    handleMusicPlay(){
        let isPlay = !this.data.isPlay
        // //修改播放状态
        // this.setData({
        //     isPlay
        // })
        let {musicId,musicLink} = this.data
        this.musicControl(isPlay,musicId,musicLink)
    },

    //控制音乐播放/暂停的功能函数
    async musicControl(isPlay,musicId,musicLink){
        
        if(isPlay){  //音乐播放
            
            if(!musicLink){
                //获取音乐的播放链接
                let musicLinkData = await request('/song/url',{id:musicId})
                musicLink = musicLinkData.data[0].url
                this.setData({
                    musicLink
                })
            }

            this.backgroundAudioManager.src = musicLink
            this.backgroundAudioManager.title = this.data.song.name
        }else{  //音乐暂停
            this.backgroundAudioManager.pause()
        }

    },

    //点击切歌的回调   尚未实现页面间通信，未实现切换歌曲
    handleSwitch(event){
        //获取切歌类型
        let type = event.currentTarget.id

    },

    //改变播放时间
    changeCurrentTime(event){
        // console.log(event.detail.x-event.currentTarget.offsetLeft)
        let currentTime =  moment((event.detail.x-75)*2/450 * this.data.dt).format('mm:ss')
        this.backgroundAudioManager.seek((event.detail.x-75)*2/450 * this.data.dt/1000)
        let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450 
        this.setData({
            currentTime,
            currentWidth
        })
        

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})