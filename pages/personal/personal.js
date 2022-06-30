let startY = 0; //手指起始坐标
let moveY = 0;  //手指移动坐标
let moveDistance = 0;   //手指移动距离
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform: 'translateY(0)',
        coverTransition: '',
        userInfo: {}, //用户信息
        recentPlayList: [], //用户播放记录

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 读取用户的基本信息
        let userInfo = wx.getStorageSync('userInfo')
        if(userInfo){
            // 更新userInfo的状态
            this.setData({
                userInfo: JSON.parse(userInfo)
            })

            //获取用户播放记录
            this.getUserRecentPlayList(this.data.userInfo.userId)
        }
    },

    // // 获取用户播放记录
    // async getUserRecentPlayList(userId){
    //     let recentPlayListData = await request('/user/record',{uid:userId,type:0})
    //     let index = 0
    //     let recentPlayList = recentPlayListData.allData.splice(0,10).map(item => {
    //         item.id = index++
    //         return item
    //     })
    //     this.setData({
    //         recentPlayList
    //     })
    // },

    getUserRecentPlayList(userId){
        let recentPlayListData = JSON.parse(wx.getStorageSync('history'))
        // let index = 0
        if(recentPlayListData.length<=10){
            let recentPlayList = recentPlayListData.map(item => {
                // item.id = index++
                return item
            })
            this.setData({
                recentPlayList
            })
        }
        else{
            let recentPlayList = recentPlayListData.splice(0,10).map(item => {
                item.id = index++
                return item
            })
            this.setData({
                recentPlayList
            })
        }
    },

    //跳转至songDetail页面
    toSongDetail(event){
        let song = event.currentTarget.dataset.song
        console.log(song)
        //路由跳转传参：query参数
        if(song.album){
            wx.navigateTo({
                //参数长度过长，会被自动截取
                // url: '/pages/songDetail/songDetail?song=' + JSON.stringify(song)
                url: '/pages/songDetail/songDetail?musicId=' + song.id
            })
        }
        else{
            wx.navigateTo({
                //参数长度过长，会被自动截取
                // url: '/pages/songDetail/songDetail?song=' + JSON.stringify(song)
                url: '/pages/songDetail/songDetail?musicId=' + song.privilege.id
            })
        }
    },

    handleTouchStart(event){
        this.setData({
            coverTransition: ``
        })
        //获取手指的起始坐标
        startY = event.touches[0].clientY;
    },

    handleTouchMove(event){
        moveY = event.touches[0].clientY;
        moveDistance = moveY - startY;
        //动态更新coverTransform的状态值
        if(moveDistance <= 0){
            return;
        }
        if(moveDistance >= 80){
            moveDistance = 80
        }
        this.setData({
            coverTransform: `translateY(${moveDistance}rpx)`
        })
    },

    handleTouchEnd(){
        this.setData({
            coverTransform: `translateY(0rpx)`,
            coverTransition: `transform 1s linear`
        })
    },

    //跳转到登录Login页面的回调
    toLogin(){
        wx.navigateTo({
            url: '/pages/login/login'
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
        this.getUserRecentPlayList(1)

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