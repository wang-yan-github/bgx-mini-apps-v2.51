// pages/fbfCenter/selectFbfs/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 委托发包 转到拨打电话
  onWeituofb: function(e) {
    wx.makePhoneCall({
      phoneNumber: "02885521744" // 仅为示例，并非真实的电话号码
    })
  },
  // 自主发包
  onZizhufb: function(e) {
    wx.navigateTo({
      url: '/pages/fbfCenter/issuexm/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})