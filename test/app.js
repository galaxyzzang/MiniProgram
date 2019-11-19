//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    //登录
    wx.login({
      success: res => {
        console.log('wx.login:' + res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: that.globalData.urlPath + '/OpenID',
          data: { code: res.code },
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          success: (res) => {
            console.log('wx.login:success')
            console.log(res.data)
            console.log(this);
            this.globalData.openid = res.data.openid;
          }
        })
      }
    }
    )
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null,  //用户信息
    urlPath: 'http://172.20.10.10:5000',
    openid: null
  }
})