//index.js
import CanvasDrag from '../../components/canvas-drag/canvas-drag';
const app = getApp()
Page({
    data: {
      graph: {},
        motto: 'Hello World',
        userInfo: {},
        animation: "",
        interval: "",
        currentCata:"",
        modelClass:"isModel",
        n: 0,
        playStatus: 1,
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        savePath: "",
        pos: {},
        useBorderFlag:false,
        picList: {},
        srcs: {},
        paths: [],
        innerAudioContext: "",
    },

    /**
     * 使用头像
     */
  onAddAvatar(useBorder=false) {
    useBorder= "";
    var that = this;
    if (wx.getStorageSync(this.getHD(this.data.userInfo.avatarUrl)) != "") {
      var url =  wx.getStorageSync(this.getHD(that.data.userInfo.avatarUrl));
      this.setData({
        graph: {
          x:20,
          y:20,
          w: 160,
          h: 160,
          type: 'image',
          url: url,
          text: useBorder
        }
      });
    } else {
      wx.showLoading({
        title: '头像加载中...',
        mask: "true"
      });
      wx.downloadFile({
        url: that.getHD(that.data.userInfo.avatarUrl),
        success: function (res) {
          var avatar = res.tempFilePath;
          wx.setStorageSync(that.getHD(that.data.userInfo.avatarUrl), avatar);
          that.setData({
            graph: {
              x: 20,
              y: 20,
              w: 160,
              h: 160,
              type: 'image',
              url: avatar,
              text:useBorder
            }
          });
          wx.hideLoading();
        }
      })
    }
  },
    onAddBorder(src){
      var that = this;
      if (wx.getStorageSync(src) != "") {
        that.setData({
          graph: {
            x: 0,
            y: 0,
            w: 200,
            h: 200,
            type: 'image',
            url: wx.getStorageSync(src),
          }
        });
      } else {
        wx.showLoading({
          title: '边框加载中...',
          mask: "true"
        });
        console.log(src+"我要下载")
        wx.getImageInfo({
          src: src,
          success: function (res) {
            wx.setStorageSync(src, res.path);
            that.setData({
              graph: {
                x: 0,
                y: 0,
                w: 200,
                h: 200,
                type: 'image',
                url: res.path,
              }
            });
            wx.hideLoading()
          },
          fail: res => {
            console.log(path + "图片加载失败")
          }
        })
      }

    },
    /**
     * 添加图片
     */
    onAddImage() {
        wx.chooseImage({
            success: (res) => {
                this.setData({
                    graph: {
                        x:0,
                        y:0,
                        w: 200,
                        h: 200,
                        type: 'image',
                        url: res.tempFilePaths[0],
                    }
                });
            }
        })
    },

    /**
     * 添加文本
     */
    onAddText() {
        this.setData({
            graph: {
                type: 'text',
                text: 'helloworld',
            }
        });
    },

    /**
     * 图片预览
     */
    onExport() {
        CanvasDrag.export()
            .then((filePath) => {
                console.log(filePath);
                wx.previewImage({
                    urls: [filePath]
                })
            })
            .catch((e) => {
                console.error(e);
            })
    },
    /**
     * 改变背景颜色
     */
    onChangeBgColor() {
        CanvasDrag.changeBgColor('yellow');
    },

    /**
     * 改变背景照片
     */
    onChangeBgImage() {
      wx.chooseImage({
        success: (res) => {
          CanvasDrag.changeBgImage(res.tempFilePaths[0]);
        }
          });
    },
  //事件处理函数
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'https://www.sweetxxin.top/merry?cdn=yes',
      success: function (e) {
        that.setData({
          srcs: e.data
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log("我在这里app.globalData.userInfo")
      this.onAddAvatar();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log("我在这里this.data.canIUse")
        this.onAddAvatar();
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
          console.log("我在这里this.data.canIUse")
         this.onAddAvatar();
        }
      })
    }

    wx.clearStorageSync();
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0',
      success: function (res) {
        console.log("res")
      }
    })
    var that = this;
    this.data.interval = setInterval(function () {
      var n = that.data.n;
      that.setData({
        n: n + 1
      })
      that.rotateAni(n);
    }, 1000);
    const innerAudioContext = wx.createInnerAudioContext();
    this.setData({
      innerAudioContext: innerAudioContext
    })
    innerAudioContext.autoplay = true;
    innerAudioContext.loop = true
    innerAudioContext.src = 'http://att.chinauui.com/day_101224/20101224_45d9eda16263e181abc537vvv7dHnE1d.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  rotateAni: function (n) {
    this.animation.rotate(180 * (n)).step()
    this.setData({
      animation: this.animation.export()
    })
  },
  play: function () {
    if (this.data.playStatus == 1) {
      this.data.innerAudioContext.pause();
      this.setData({
        playStatus: 0,
      })
      clearInterval(this.data.interval);
    } else {
      this.data.innerAudioContext.play();
      this.setData({
        playStatus: 1
      })
      var that = this;
      this.data.interval = setInterval(function () {
        var n = that.data.n;
        that.setData({
          n: n + 1
        })
        that.rotateAni(n);
      }, 1000);
    }

  },
  getUserInfo: function (e) {
    console.log(e)
    var msg = e.detail.errMsg;
    console.log(msg.indexOf("deny")!=-1)
    if (msg.indexOf("deny")!=-1){
      console.log("拒绝授权")
      this.setData({
        hasUserInfo: false
      })
    }else{
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      console.log("允许授权")
    }
    this.onAddAvatar();
  },
  onSave: function () {
   
    wx.showLoading({
      title: '分享图片生成中...',
      mask:"true"
    });
    CanvasDrag.export()
      .then((filePath) => {
        wx.saveImageToPhotosAlbum({
          filePath:filePath,
          success: function () {
            wx.hideLoading()
          },
          fail:function(){
            wx.hideLoading()
          }
        })
      })
      .catch((e) => {
        console.error(e);
      })
  },
  use: function (e) {
    var that = this;
    var src = e.target.dataset.imgsrc;
    // src=src.split('/');
    // src = src[0] + '/' + src[1] + '/' + src[2] + '/' + src[3] + '/' + src[5] + '/' + src[6] ;
    
    for(var i=0;i<this.data.srcs[this.data.currentCata].length;i++){
      if (this.data.srcs[this.data.currentCata][i]==src){
        console.log("find it")
        src = this.data.srcs["原图"][this.data.currentCata][i];
        console.log(src);
        break;
      }
    }
    if(this.data.useBorderFlag){
      this.onAddBorder(src);
    }else{
    if (wx.getStorageSync(src) != "") {
      that.setData({
        graph: {
          w: 80,
          h: 80,
          type: 'image',
          url: wx.getStorageSync(src),
        }
      });
    } else {
      wx.showLoading({
        title: '装饰加载中...',
        mask: "true"
      });
      wx.getImageInfo({
        src:src,
        success: function (res) {
          wx.setStorageSync(src, res.path);
          that.setData({
            graph: {
              w: 80,
              h: 80,
              type: 'image',
              url: res.path,
            }
          });
          wx.hideLoading()
        },
        fail: res => {
          console.log(path + "图片加载失败")
        }
      })
    }
    }
  },
  getHD: function (imageUrl) {
    imageUrl = imageUrl.split('/');        //把头像的路径切成数组
    //把大小数值为 46 || 64 || 96 || 132 的转换为0
    if (imageUrl[imageUrl.length - 1] && (imageUrl[imageUrl.length - 1] == 46 || imageUrl[imageUrl.length - 1] == 64 || imageUrl[imageUrl.length - 1] == 96 || imageUrl[imageUrl.length - 1] == 132)) {
      imageUrl[imageUrl.length - 1] = 0;
    }
    imageUrl = imageUrl.join('/');   //重新拼接为字符串
    console.log('高清的头像', imageUrl);
    return imageUrl;
  },

  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功

        that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  avatarMove:function(e){
    this.setData({
      modelClass:"isMoving"
    })
  },
  avatarEnd:function(e){
    console.log(e)
    this.setData({
      modelClass: "isModel"
    })
  },
  select:function(e){
    wx.showToast({
      title: '装饰加载中',
      icon: 'loading',
      duration: 1000
    })

    var cata = e.target.dataset.catagory;
    this.setData({
      paths:this.data.srcs[cata],
      useBorderFlag: false,
      currentCata:cata
    })
  },
  onUseBorder:function(){
    this.setData({
      useBorderFlag:true,
      paths: this.data.srcs["原图"]['边框'],
      currentCata:"边框"
    })
  },
})
