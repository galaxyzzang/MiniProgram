//pages/index/index.js
const app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),  //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    userInfo: app.globalData.userInfo, //用户信息
  },
  //加载后，看用户是否已经授权过，授权则直接跳转到主页
  onLoad: function () {
    var that = this;
    // getSetting获取用户设置，查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          //用户已经授权
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo);
              that.setData({userInfo:res.userInfo})
              app.globalData.userInfo = res.userInfo;
              //that.queryUserInfo(); 
              //跳转至首页
              console.log('switch')
              wx.switchTab({
                url: '/pages/home/home'
              })
            }
          });
        }
      }
    })
  },
  //初次，授权登录
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      console.log('permit: ' + e.detail.userInfo);
      app.globalData.userInfo = e.detail.userInfo
      this.setData({ userInfo: e.detail.userInfo});
      
      var that = this;
      //插入登录的用户的相关信息到数据库
      wx.request({
        url: app.globalData.urlPath + '/UsrInfo', //开发者服务器接口
        data: {//请求的参数(要插入到数据库的数据)
          openid: getApp().globalData.openid,
          nickName: e.detail.userInfo.nickName,
          avatarUrl: e.detail.userInfo.avatarUrl,
          province: e.detail.userInfo.province,
          city: e.detail.userInfo.city
        },
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        //接口调用成功的回调函数
        success: function (res) {
          //从数据库获取用户信息
          //that.queryUserInfo();//将globalData中的用户信息赋值
          console.log('success ' + res.data)
          console.log("插入小程序登录用户信息成功！");
        },
        fail: function (res) {
          console.log('fail');
        }
      });
      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: '/pages/home/home'
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  //用openid向后端请求用户数据
  queryUserInfo: function () {
    console.log('query'),
      wx.request({
        url: app.globalData.urlPath + 'user/userInfo',
        data: {
          openid: app.globalData.openid   //请求参数为openid
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //后端返回用户信息
          console.log('succeed in getting userInfo: '+res.data)
          getApp().globalData.userInfo = res.data;
        }
      })
  },

})
