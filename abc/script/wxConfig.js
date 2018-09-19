/**
 * Created by lil09 on 17-4-25
 */
import {activityId} from 'setToken';
import $ from "jquery";

define(function (require, exports, module) {
    var wxParams;

    //获取wx参数
    var url = "/index.php?r=choose-room-activity/get-sign-package-for-js-sdk";

    var locationHref = window.location.href.split('#')[0];
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        data: {
            url: locationHref,
            activityId
        },
        success: function (res) {
            if (res.retCode == 0) {
                var data = res.data;
                wxParams = data;
                wxConfig();
            } else {
                $.openTipLayer({content: res.errMsg});
            }
        },
        error: function () {
            //$.openTipLayer({content: "微信JS_API获取失败！"});
        }
    });

    //var __jsSdkError = false;
    var wxConfig = function () {
        window.wx.config({
            debug: false, //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: wxParams.appId, //必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: wxParams.timestamp, //必填，生成签名的时间戳
            nonceStr: wxParams.nonceStr, //必填，生成签名的随机串
            signature: wxParams.signature, //必填，签名，见附录1
            jsApiList: [
                'checkJsApi', //判断当前客户端版本是否支持指定JS接口
                'onMenuShareTimeline', //分享到朋友圈
                'onMenuShareAppMessage', //分享给朋友
                'onMenuShareQQ', //分享到QQ
                'onMenuShareWeibo', //分享到腾讯微博
                'hideOptionMenu', //隐藏右上角菜单接口
                'showOptionMenu', //显示右上角菜单接口
                'closeWindow', //关闭当前网页窗口接口
                'hideMenuItems', //批量隐藏功能按钮接口
                'showMenuItems', //批量显示功能按钮接口
                'hideAllNonBaseMenuItem', //隐藏所有非基础按钮接口
                'showAllNonBaseMenuItem',//显示所有功能按钮接口
                'scanQRCode',//微信扫一扫接口
                'chooseImage',
                'uploadImage',
                'previewImage'
            ]// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        window.wx.error(function (res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            //__jsSdkError = true;
            //$.openTipLayer({content: "微信JS_API配置失败：" + res.errMsg});
        });
    };

});



// WEBPACK FOOTER //
// ./src/js/common/wxConfig.js