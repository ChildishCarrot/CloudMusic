// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '',
        month: '',
        recommendList: [] //推荐列表数据

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //判断用户是否登录
        let userInfo = wx.getStorageSync('userInfo')
        if(!userInfo){
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                success: ()=> {
                    //跳转至登录界面
                    wx.reLaunch({
                        url: '/pages/login/login'
                    })
                }
            })
        }



        //更新日期数据
        this.setData({
            day: new Date().getDate(),
            month: new Date().getMonth()+1
        })

        //获取每日推荐数据
        this.getRecommendList()

    },

    // 获取用户每日推荐的数据
    async getRecommendList(){
        let recommendListData = await request('/recommend/songs')
        console.log(recommendListData)
        this.setData({
            // 原版 recommendList:recommendListData.recommend
            recommendList: recommendListData.data.dailySongs
        })
    },

    //跳转至songDetail页面
    toSongDetail(event){
        let song = event.currentTarget.dataset.song

        //路由跳转传参：query参数
        wx.navigateTo({
            //参数长度过长，会被自动截取
            // url: '/pages/songDetail/songDetail?song=' + JSON.stringify(song)
            url: '/pages/songDetail/songDetail?musicId=' + song.id
        })
        
        //修改播放历史
        let history = wx.getStorageSync('history')
        if(!history){
            history = []
            history[0] = song
            wx.setStorageSync('history',JSON.stringify(history))
        }
        else{
            let historyObj = JSON.parse(history)
            historyObj  = [song,...historyObj]
            for(let i=1;i<historyObj.length;i++){
                if(historyObj[i].id==song.id)historyObj.splice(i,1)
            }
            wx.setStorageSync('history',JSON.stringify(historyObj))
        }
        
        
        
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