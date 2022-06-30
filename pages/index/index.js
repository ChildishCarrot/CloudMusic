import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerList: [], //轮播图数据
        recommendList: [], //推荐歌单
        topList: [], //排行榜数据

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        let bannerListData = await request('/banner',{type:2});
        this.setData({
            bannerList: bannerListData.banners,
        })

        //获取推荐歌单数据
        let recommendListData = await request('/personalized',{limit:10})
        this.setData({
            recommendList: recommendListData.result,
        })

        // //获取排行榜数据  原版
        // let index = 0;
        // let resultArray = [];
        // while(index<5){
        //     let topListData = await request('/top/list',{idx:index++});
        //     let topListItem = {name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0,3)};
        //     resultArray.push(topListItem);
        //     //不需要等待五次请求全部结束才更新，用户体验较好，渲染次数会多一些
        //     // this.setData({
        //     //     topList: resultArray
        //     // })
        // }

        // 获取排行榜歌单  宏凯的云服务器版--------------------------
        const topList = await request("/toplist")
        //    获取排行榜数据;
        let resultArray = [];
        for (let i = 0; i < 5; i++) {
            let topListData = await request("/playlist/detail", {id: topList.list[i].id})
            let topListItem = {
                name: topListData.playlist.name,
                tracks: topListData.playlist.tracks.slice(0, 5)
            };
            resultArray.push(topListItem);
            //    更新topList的状态值
            this.setData({
                topList: resultArray
            })
        }
        // -------------------------------------------------

        //更新topList状态值,放在此处更新会导致用户发送请求过程中长时间白屏，用户体验差
        this.setData({
            topList: resultArray
        })
        
    },

    //跳转至recommendSong页面的回调
    toRecommendSong(){
        wx.navigateTo({
            url: '/pages/recommendSong/recommendSong'
        })
    },

    //跳转至songDetail页面
    toSongDetail(event){
        let song = event.currentTarget.dataset.song
        console.log(song)
        //路由跳转传参：query参数
        if(!song.album){
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