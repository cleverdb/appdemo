/**
 * Created by lil09 on 15-1-10.
 */
import {token} from 'setToken';
import $ from "jquery";
$(function () {
    //css active hack
    $("body").on("touchstart", function () {});
});

let MySoft={};
//正则验证
MySoft.regExp = {
    //手机号码
    tel: /(^1\d{10})$/ig
};
//工具
MySoft.tools = {
    //ajax 请求
    ajax: function (options) {
        options = $.extend({needLoading: true, tipLayerId: "info_96377184-d340",
                type: 'post',
                contentType: "application/x-www-form-urlencoded;charset=utf-8" },
            options);
        var hasLoading = $(".note").filter(":visible").length > 0;
        if (!hasLoading && options.needLoading) {
            $.openTipLayer({id: "defaultLoading", content: "", closeTime: 0, warpClass: "note-loadwarp", zIndex: 3000, isMask: true});
        }
        var success = options.success;
        options.success = function (result) {
            if (!hasLoading && options.needLoading) {
                $.closeTipLayer({id: "defaultLoading"});
            }
            else if (hasLoading) {
                $.closeTipLayer({id: options.tipLayerId});
            }
            if (options.sucesssTopFun) {
                options.sucesssTopFun();
            }
            if (result.retCode != 0) {
                if(result.retCode == 2703037) {
                    //在线开盘微信端认筹用户活动未登录（标准版）
                    let login_url = "/page/login.html?activityId=" + result.data.activityId + "&token=" + token+"&url="+encodeURIComponent(window.location.href);
                    window.location.replace(login_url);
                }
                else if(result.retCode == "2703041") {
                    //在线开盘微信端认筹用户活动未登录（富力登录app）
                    window.location.replace(result.data.redirectUrl);
                }
                else if(result.retCode == 2703038) {
                    //签到岗未登录
                    let login_url = "/page/sign_login.html?activityName=" + encodeURIComponent(result.data.activityName) + "&activityId=" + result.data.activityId + "&token=" + token + "&url=" + encodeURIComponent(window.location.href);
                    window.location.replace(login_url);
                }
                else if(result.retCode == 2703035) {
                    //强制扫码签到
                    let sign_qr_url = "/page/sign_personal_qr.html?activityId=" + result.data.activityId + "&token=" + token;
                    window.location.replace(sign_qr_url);
                }
                else if(result.retCode == 2702011) {
                    //用户存在有效的正式订单，取消发布活动，直接接入“我的订单”页面
                    window.location.replace("/page/my_orders.html?activityId="+result.data.activityId+"&token="+token);
                }
                else if(result.retCode == 2700008) {
                    //用户不存在有效的正式订单，活动已经取消
                    //var err_url = "/page/error.html?message=" + result.retMsg;
                    //window.location.replace(err_url);
                    if($("#wrap").length>0) {
                        $("#wrap").html('<div class="err-icon"></div><div id="message" class="err-title">' + result.retMsg + '</div>');
                    }
                    else {
                        $.openTipLayer({content: result.retMsg});
                        if (options.resultFalseFun) {
                            options.resultFalseFun();
                        }
                    }
                }
                else if(result.retCode == "0001001") {
                    //需要微信登录跳转
                    let wx_login_url = "/index.php?r=yunke/choose-room-wx-login&token=" + token + "&originUrl=" + encodeURIComponent(window.location.href);
                    window.location.replace(wx_login_url);
                }
                else if(result.retCode == "3002013") {
                    //在线验资微信端用户未登录（标准版）
                    let login_url = "/page/zxyz/login.html?zxyz_activity_id=" + result.data.zxyz_activity_id+"&url="+encodeURIComponent(window.location.href);
                    window.location.replace(login_url);
                }
                else if(result.retCode == "3002008") {
                    //在线验资微信端用户未登录（富力登录web）
                    let login_url = "/page/zxyz/activity.html?zxyz_activity_id=" + result.data.zxyz_activity_id;
                    window.location.replace(login_url);
                }
                else if(result.retCode == "3002016") {
                    //在线验资APP端用户未登录（富力登录APP）
                    window.location.replace(result.data.redirectUrl);
                }
                else if(result.retCode == "-3060000") {
                    //现场开盘微信端用户未登录
                    let login_url = "/page/xckp/login.html?activityId=" + result.data.activityId + "&url="+encodeURIComponent(window.location.href);
                    window.location.replace(login_url);
                }
                else if(result.retCode == "-3062000") {
                    ///现场开盘签到岗未登录
                    let login_url = "/page/xckp/sign_login.html?activityId=" + result.data.activityId + "&url=" + encodeURIComponent(window.location.href);
                    window.location.replace(login_url);
                }
                else if(result.retCode == "-3010011") {
                    //现场开盘PAD端用户未登录
                    let login_url = "/page/xckp_pad/login.html?activityId=" + result.data.activityId;
                    window.location.replace(login_url);
                }
                else if(result.retCode == "-3030013") {
                    //现场开盘PAD端购房者未扫码
                    let login_url = "/page/xckp_pad/valid_user.html?activityId=" + result.data.activityId;
                    window.location.replace(login_url);
                }
                else if(result.retCode == "2703046") {
                    //在线开盘提交订单版本号不一致
                    $.openTipLayer({content: result.retMsg,callback:function () {
                        window.location.reload();
                    }});
                }
                else if (options.resultCustomFalseFun) {
                    //自定义处理特殊页面逻辑
                    options.resultCustomFalseFun(result);
                }
                else{
                    $.openTipLayer({content: result.retMsg});
                    if (options.resultFalseFun) {
                        options.resultFalseFun();
                    }
                }
                return;
            }
            if (success) {
                success(result);
            }
        }
        var error = options.error;
        options.error = function (xhr, status) {
            if (!hasLoading && options.needLoading) {
                $.closeTipLayer({id: "defaultLoading"});
            }
            else if (hasLoading) {
                $.closeTipLayer({id: options.tipLayerId});
            }
            /* status:"null","timeout", "error", "notmodified" 和 "parsererror"。
             请求错误代码
             0 － （未初始化）还没有调用send()方法
             1 － （载入）已调用send()方法，正在发送请求
             2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
             3 － （交互）正在解析响应内容
             4 － （完成）响应内容解析完成，可以在客户端调用了*/
            var msg = "请求错误，代码：" + xhr.status + "(" + status + ")";
            if (status != "abort") {
                if (xhr.status == 0 && status == "error") {
                    msg = "网络已断开";
                }
                $.openTipLayer({content: msg});
            }
            if (error) {
                error();
            }
        }
        $.ajax(options);
    },
    //设置浏览器标题
    setTitle: function (title) {
        if (!title) {
            return;
        }
        document.title = title;
        if (navigator.userAgent.match(/MicroMessenger\/([\d.]+)/i)) {
            // hack在微信等webview中无法修改document.title的情况
            var $body = $('body');
            var $iframe = $('<iframe src="/favicon.ico" style="display:none;"></iframe>').on('load', function() {
                setTimeout(function() {
                    $iframe.off('load').remove();
                }, 0);
            }).appendTo($body);
        }
    },
    //图片加载成功调整高宽
    resizeImg: function (_this, opts) {
        opts = $.extend({isCut: true, max: "100%", areaId: "", backgroundId: "", verticalAlign: false,
            placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        }, opts);
        var backgroundId = opts.backgroundId;
        var width = parseInt($(_this).css("width"));
        var height = parseInt($(_this).css("height"));
        if (opts.isCut) {
            if (width < height) {
                let top = (width - height) * 100 / (2 * width) + "%";
                $(_this).css({width: opts.max, "margin-top": top});
                let src = $(_this).attr("src");
                if (backgroundId != "") {
                    let css = {
                        "background-image": "url(" + src + ")",
                        "background-size": "100% auto",
                        "background-position": "center"
                    };
                    if (src.indexOf(opts.placeholder) == -1) {
                        css["background-repeat"] = "no-repeat";
                    }
                    $("#" + backgroundId).css(css);
                }
            }
            else {
                var left = (height - width) * 100 / (2 * height) + "%";
                $(_this).css({height: opts.max, "margin-left": left});
                let src = $(_this).attr("src");
                if (backgroundId != "") {
                    let css = {
                        "background-image": "url(" + src + ")",
                        "background-size": "auto 100%",
                        "background-position": "center"
                    };
                    if (src.indexOf(opts.placeholder) == -1) {
                        css["background-repeat"] = "no-repeat";
                    }
                    $("#" + backgroundId).css(css);
                }
            }
        }
        else {
            var areaId = opts.areaId;
            if (areaId != "") {
                var areaWidth = $("#" + areaId).width();
                var areaHeight = $("#" + areaId).height();
                var imgW = areaWidth;
                var imgH = (height / width) * imgW;
                if (imgH > areaHeight) {
                    $(_this).css({width: "auto", height: opts.max});
                }
                else {
                    if (opts.verticalAlign) {
                        let top = (areaHeight - (height / width) * areaWidth) / 2;
                        $(_this).css({width: opts.max, height: "auto", marginTop: top});
                    }
                    else {
                        $(_this).css({width: opts.max, height: "auto"});
                    }
                }
            }
        }
    },
    //取消弹出框
    cancelPop: function (id, opts) {
        opts = $.extend({ mask_id: "divLayerMask", closeRemove: false }, opts);
        $.mask.hide({ mask_id: opts.mask_id, closeRemove: opts.closeRemove });
        $("#" + id).hide();
    },
    //时分秒倒计时
    timer: function (opts) {
        opts = $.extend({seconds: 60 * 10, obj: null,cacheObj:null, format: "dd天hh:mm:ss",format2: "hh时mm分ss秒", showDay: false,dayAlwaysShow:true,run_second:60*60*24,run_callback:function(){}, callback: function () {
        } }, opts);
        var seconds = opts.seconds;
        var cacheObj = opts.cacheObj;
        var obj = opts.obj;
        var format = opts.format;
        var timeout = null;
        if(cacheObj!=null){
            var now_second=new Date().getTime();
            cacheObj.data("old_second",now_second);
            cacheObj.data("seconds",seconds);
        }
        var timing = function () {
            if(cacheObj!=null){
                //最后15s倒计时不要矫正时间
                if(seconds>15) {
                    var now_second = new Date().getTime();
                    var old_second = cacheObj.data("old_second");
                    seconds = cacheObj.data("seconds");
                    seconds = seconds - Math.round((now_second - old_second) / 1000);
                    if(seconds<0){seconds=0;}
                }
            }
            if (obj != null) {
                var day = Math.floor(seconds / 60 / 60 / 24);
                var h = Math.floor((seconds - day * 24 * 60 * 60) / 60 / 60);
                var m = Math.floor((seconds - day * 24 * 60 * 60 - h * 60 * 60) / 60);
                var s = Math.floor((seconds - day * 24 * 60 * 60 - h * 60 * 60 - m * 60));
                if (format.indexOf("dd") == -1) {
                    h = h + day * 24;
                }
                if (format.indexOf("hh") == -1) {
                    m = m + h * 60;
                }
                if (format.indexOf("mm") == -1) {
                    s = s + m * 60;
                }
                if (h < 10) {
                    h = "0" + h;
                }
                if (m < 10) {
                    m = "0" + m;
                }
                if (s < 10) {
                    s = "0" + s;
                }

                if(!opts.dayAlwaysShow && day==0){
                    format=opts.format2;
                }
                var html = format.replace("dd", day).replace("hh", h).replace("mm", m).replace("ss", s);
                if (opts.showDay) {
                    if (day > 0) {
                        html = day + "天";
                    }
                }
                obj.html(html);
            }
            seconds--;
            if (seconds < 0) {
                opts.callback();
                clearTimeout(timeout);
            }
            else {
                if(opts.run_second>=seconds+2){
                    opts.run_callback(seconds);
                }
                timeout = setTimeout(timing, 1000);
            }
        };
        timing();
    },
    //金额格式化
    formatCurrency: function (num) {
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num)) {
            num = "0";
        }
        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        var cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10) {
            cents = "0" + cents;
            if (cents == "00") {
                cents = "";
            }
        }
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                num.substring(num.length - (4 * i + 3));
        }
        return (((sign) ? '' : '-') + num + (cents == "" ? '' : '.' + cents));
    },
    //面积格式化
    formatArea: function (area) {
        if (isNaN(area)) {
            return area;
        }
        return area * 1;
    }
};
//日期格式化
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

/* Copyright (c) 2015 mysoft
 * Product:遮罩层
 * Author:liangsky
 * CreateDate: 2015-1-10
 * Version 1.0
 example:
 open: $.mask.show();
 close: $.mask.hide();
 */
(function ($, window, undefined) {
    $.mask = (function () {
        /*//取得遮照高度
        function bheight() {
            return $(document).height();
        }

        //取得遮照宽度
        function bwidth() {
            return (document.body.clientWidth > $(window).width() ? document.body.clientWidth : $(window).width()) + "px";
        }*/

        //改变窗口遮照重新计算
        /*function resize(id) {
         if ($("#" + id + ":visible").length > 0) {
         $("#" + id)
         .css({
         width: bwidth(),
         height: bheight()
         });
         }
         }*/
        //初始化
        function init(opts) {
            /*var h, w;
            h = bheight();
            w = bwidth();*/
            $("<div id='" + opts.mask_id + "' style='display:none;'></div>")
                .appendTo('body')
                .css({
                    position: opts.position,//"absolute",//fixed
                    cursor: opts.cursor,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: opts.bottom,
                    //width: w,
                    //height: h+100,
                    zIndex: opts.zIndex,
                    filter: "alpha(opacity=" + opts.opacity * 100 + ")",
                    opacity: opts.opacity,
                    background: opts.background
                });
        }

        return{
            //显示遮罩层
            show: function (opts) {
                opts = $.extend({ mask_id: "divLayerMask", position: "fixed", bottom: 0, cursor: "default", opacity: 0.5, background: "#000", zIndex: 2000 }, opts);
                if ($("#" + opts.mask_id).length == 0) {
                    init(opts);
                }
                else {
                    $("#" + opts.mask_id).css({/*width: bwidth(), height: bheight(),*/zIndex: opts.zIndex});
                }
                // handle window resize
                /*$(window).off('resize.mask').on('resize.mask', { id: opts.mask_id },
                 function (e) {
                 resize(e.data.id);
                 });*/
                if ($.fn.bgiframe) {
                    $("#" + opts.mask_id).bgiframe();
                }
                $("#" + opts.mask_id+",.js_no_scroll").off('touchmove.mask' + opts.mask_id).on('touchmove.mask' + opts.mask_id, function (e) {
                    event.preventDefault();
                    return false;
                });
                $("#" + opts.mask_id).show();
            },
            //隐藏遮罩层
            hide: function (opts) {
                opts = $.extend({ mask_id: "divLayerMask", closeRemove: false }, opts);
                $("#" + opts.mask_id).off('touchmove.mask' + opts.mask_id);
                if (opts.closeRemove) {
                    $("#" + opts.mask_id).remove();
                } else {
                    $("#" + opts.mask_id).hide();
                }
            }
        }
    })();
})($, window);
/* Copyright (c) 2014 mysoft
 * Product:信息提示层
 * Author:liangsky
 * CreateDate: 2015-1-14
 * Version 1.0
 example:
 open: $.openTipLayer({content:"提示内容"});
 close: $.closeTipLayer();
 */
(function ($, window, undefined) {
    $.openTipLayer = function (opts) {
        //type参数：note_sucess:成功,note_error:失败
        opts = $.extend({
            id: "info_96377184-d340", type: "note-error", mask_position: "fixed", warpClass: "", content: "异常错误", isMask: false, mask_id: "divLayerMask",
            zIndex: 2500, autoCloseTime: true, closeTime: 2500, closeRemove: false, opacity: 0.5, callback: function () {
            }
        }, opts);
        var content = opts.content;
        if (opts.autoCloseTime && opts.closeTime > 0) {
            //toast提示的最大、最小宽度，文字范围在4-30之间，10个以内就1S，20个以内2S，超过20个就3S
            if (content.length < 10) {
                opts.closeTime = 1000;
            }
            else if (content.length > 20) {
                opts.closeTime = 3000;
            }
            else {
                opts.closeTime = 2000;
            }
        }
        if (opts.isMask) {
            $.mask.show({ mask_id: opts.mask_id, position: opts.mask_position, opacity: 0.5, background: "#000", zIndex: opts.zIndex - 10 });
        }
        if ($("#" + opts.id).length == 0) {
            var html = '<div id="' + opts.id + '" class="note ' + opts.type + ' ' + opts.warpClass + '">';
            html += opts.content;
            html += '</div>';
            $(html).appendTo("body");
        }
        else {
            $("#" + opts.id).html(content);
        }
        $("#" + opts.id).css({zIndex: opts.zIndex});
        var obj = $("#" + opts.id);
        obj.data("opts", opts);
        if (opts.closeTime > 0) {
            setTimeout(function () {
                opts.callback();
                $.closeTipLayer({id: opts.id, mask_id: opts.mask_id, closeRemove: opts.closeRemove});
            }, opts.closeTime);
        }
        else {
            opts.callback();
        }
        obj.stop(true).fadeIn(300);
    };
    $.closeTipLayer = function (opts) {
        opts = $.extend({id: "info_96377184-d340", callback_close: function () {
        }}, opts);
        opts = $.extend($("#" + opts.id).data("opts"), opts);
        if (typeof opts != "undefined") {
            $("#" + opts.id).stop(true).fadeOut(300, function () {
                if (opts.closeRemove) {
                    $("#" + opts.id).remove();
                }
                $.mask.hide({ mask_id: opts.mask_id, closeRemove: opts.closeRemove });
                opts.callback_close();
            });
        }
    }
})($, window);

export { MySoft }


// WEBPACK FOOTER //
// ./src/js/common/framework.js