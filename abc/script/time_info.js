/**
 * Created by lil09 on 2017/7/14.
 */
import "jquery"
import { MySoft } from "../common/framework"
import "../common/css_framework"
let ten_seconds = 10;
let isCanChooseRoom=true;//是否有选房权限
let expiredTip="活动已过期";

//开始(公测)选房源倒计时
function beginTimer(index, callback) {
    var obj = $("#step" + index);
    var seconds = obj.attr("seconds") - 0;
    if (seconds <= 10) {
        ten_seconds = seconds;
    }
    if (seconds > 0) {
        obj.css("display", "block");
        var run_second = 60 * 60 * 24;
        if (seconds > (run_second - 2)) {
            $("#step_sub1_" + index).show();
        }
        else {
            $("#step_sub2_" + index).show();
        }
        if (seconds < 10) {
            //正式选房源10秒倒计时
            tenSencondsTimer(index);
        }
        MySoft.tools.timer({
            cacheObj: obj,
            obj: obj.find('span'),
            seconds: seconds,
            format: "hh时mm分ss秒",
            run_second: run_second,
            run_callback: function (second) {
                if (run_second == second + 2) {
                    $("#step_sub1_" + index).hide();
                    $("#step_sub2_" + index).show();
                }
                if (second == 9) {
                    ten_seconds = second + 1;
                    //正式选房源10秒倒计时
                    tenSencondsTimer(index);
                }
            },
            callback: function () {
                obj.hide();
                $("#step" + (index + 1)).css("display", "block");
                callback && callback();
            }
        });
    }
    else {
        obj.hide();
        $("#step" + (index + 1)).css("display", "block");
        callback && callback();
    }
}

//剩余(公测)选房源时间倒计时
function leftTimer(index, callback) {
    var obj = $("#step" + index);
    var seconds = obj.attr("seconds") - 0;
    if (seconds > 0) {
        MySoft.tools.timer({
            cacheObj: obj,
            seconds: seconds,
            obj: obj.find('span'),
            format: "dd天hh时mm分ss秒",
            dayAlwaysShow: false,
            callback: function () {
                if (index != 4) {
                    obj.hide();
                }
                else {
                    obj.text(expiredTip);
                }
                callback && callback();
            }
        });
    }
    else {
        if (index != 4) {
            obj.hide();
        }
        else {
            obj.text(expiredTip);
        }
        callback && callback();
    }
}

//正式选房源10秒倒计时
function tenSencondsTimer(index) {
    var obj = $("#ten_senconds_div");
    var seconds = ten_seconds;
    if (seconds > 0) {
        MySoft.tools.timer({
            cacheObj: obj, seconds: seconds, format: "ss", run_second:15,
            run_callback:function(second){
                var down_second=10;
                if(down_second>=second+1){
                    var text=second+1;
                    let html=`${Math.floor(text/10)}${text%10}`;
                    $("#ten_senconds").html(html);
                }
            },
            callback: function () {
                MySoft.tools.cancelPop("ten_senconds_div", {mask_id: "mask_ten_senconds"});
                $("#step" + index).hide();
                $("#step" + (index + 1)).css("display", "block");
                //剩余(公测)选房源时间倒计时
                leftTimer(index + 1);
            }
        });
    }
    else {
        MySoft.tools.cancelPop("ten_senconds_div", {mask_id: "mask_ten_senconds"});
        $("#step" + index).hide();
        $("#step" + (index + 1)).css("display", "block");
        //剩余(公测)选房源时间倒计时
        leftTimer(index + 1);
    }
    $.mask.show({mask_id: "mask_ten_senconds", opacity: 0.8,background:"#09007d"});
    obj.show();
}

//设置时间信息
function setTimeInfo(data) {
    //获取正式活动开始年份
    var regularStartDate = data.timeInfo.regularStartDate;
    data.timeInfo.regularYear = 0;
    if (regularStartDate.length > 4) {
        data.timeInfo.regularYear = regularStartDate.substring(0, 4) - 0;
    }
    $("#time_tip_area").html($.templates("#time_tip_area_Template").render(data.timeInfo));
    //是否有选房权限
    isCanChooseRoom = data.timeInfo.activityStatus != -1;
    if (!isCanChooseRoom) {
        expiredTip = "暂无选房权限";
    }
    if (data.timeInfo.activityStatus < 2 && isCanChooseRoom) {
        $("#gongche_tip").show();
        $("#zhengshi_tip").hide();
    }
    else {
        $("#gongche_tip").hide();
        if(isCanChooseRoom){
            $("#zhengshi_tip").show();
        }
    }

    //开始(公测)选房源倒计时
    beginTimer(1, function () {
        //剩余(公测)选房源时间倒计时
        leftTimer(2, function () {
            //开始(公测)选房源倒计时
            $("#gongche_tip").hide();
            if(isCanChooseRoom) {
                $("#zhengshi_tip").show();
            }
            $("#tab_2_rooms .content .hover").removeClass("hover");
            //开始(公测)选房源倒计时
            beginTimer(3, function () {
                //剩余(公测)选房源时间倒计时
                leftTimer(4);
            });
        });
    });
}

//设置房源详情时间信息
function setRoomTimeInfo(data) {
    //是否有选房权限
    isCanChooseRoom=data.activityInfo.activityStatus != -1;
    if(!isCanChooseRoom){
        expiredTip="暂无选房权限";
    }


    if ($("#step1").length > 0) {
        //开始(公测)选房源倒计时
        beginTimer(1, function () {
            //剩余(公测)选房源时间倒计时
            leftTimer(2, function () {
                //开始(公测)选房源倒计时
                beginTimer(3, function () {
                    //剩余(公测)选房源时间倒计时
                    leftTimer(4,function () {
                        $("#step4").addClass("disabled").attr("href", "javascript:;");
                    });
                });
            });
        });
    }
}

$(function () {
    //选购倒计时弹出层关闭
    $("#ten_senconds_div .icon-close").click(function () {
        MySoft.tools.cancelPop("ten_senconds_div", {mask_id: "mask_ten_senconds"});
    });
});

export {setTimeInfo,setRoomTimeInfo};


// WEBPACK FOOTER //
// ./src/js/common/time_info.js