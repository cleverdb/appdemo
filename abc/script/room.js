/**
 * Created by lil09 on 15-11-12.
 */
import {token,activityId} from 'setToken';
import $ from 'jquery';
import { MySoft } from "framework";
import "css_framework";
import {setRoomTimeInfo} from '../common/time_info';

define(function (require, exports, module) {
    require("../../css/timer.css");
    require("../../css/page/choose_room.css");
    require("jsrender");
    require("jquery.url");

    var chooseRoomId=$.url.param("chooseRoomId");

    var randomCode="";
    let activityVersion="";

    $.templates({
        temp: {
            markup: "#wrap_Template",
            helpers: {
                formatCurrency:function(value){
                    return MySoft.tools.formatCurrency(value);
                },
                formatArea:function(value){
                    return MySoft.tools.formatArea(value);
                }
            }
        },
        temp2:{
            markup: "#securityVerification_content_Template",
            helpers: {
                fromCharCode:function(value){
                    return String.fromCharCode(value-0+65);
                }
            }
        },
        temp3:{
            markup: "#roomOtherSelectedTip_content_Template",
            helpers: {
                formatCurrency:function(value){
                    return MySoft.tools.formatCurrency(value);
                }
            }
        }
    });

    //打开秒杀错误提示
    function openMiaoErrTip(status) {
        if(status!=7){
            MySoft.tools.cancelPop("securityVerificationTip", {mask_id: "mask_securityVerificationTip"});
            $.mask.show({mask_id: "mask_miaoshaTip"});
            $("#mask_miaoshaTip").off(".mask");
            $("#mask_miaoshaTip").on("click.mask", function () {
                //关闭秒杀错误提示
                closeMiaoErrTip();
            });
            $("#btn_tip_1,#btn_tip_2").hide();
            if (status == 4) {
                $("#btn_tip_2").show();
            }
            else {
                $("#btn_tip_1").show();
            }
        }

        switch (status.toString()) {
            case "2":
                $("#miaoshaTip .content").html('<div>资格失效,</div><div>请速与开发商联系。</div>');
                break;
            case "4":
                $("#miaoshaTip .content").html('<div>您已有选中房源，</div><div>请查看订单。</div>');
                break;
            case "5":
                $("#miaoshaTip .content").html('<div>活动暂未开始，敬请期待。</div>');
                break;
            case "6":
                $("#miaoshaTip .content").html('<div>网络异常，请稍后再试。</div>');
                break;
            case "7":
                $.openTipLayer({content: "答案错误，请重新选择。"});
                var okObj=$("#securityVerification");
                okObj.addClass("disabled");
                MySoft.tools.timer({
                    seconds: 2, callback: function () {
                        okObj.removeClass("disabled");
                    }
                });
                break;
        }
        if(status!=7){
            $("#miaoshaTip").show();
        }
    }

    //关闭秒杀错误提示
    function closeMiaoErrTip() {
        MySoft.tools.cancelPop("miaoshaTip", {mask_id: "mask_miaoshaTip"});
    }

    //提交选房操作
    function submitOrder(question_option_id) {
        var options = {
            url: "/index.php?r=choose-room/submit-order",
            data: {token,chooseRoomId,activityVersion,randomCode,question_option_id},
            success: function (result) {
                //result.data={status:"3",is_show_price:true,nextFavorite:{buildingArea: "200.0000",choose_room_id: "54", roomFavoriteCount: 1, roomFullName: "B区-1栋-1单元-14-10014", roomPrice: "2400000.00", status: 0}};
                var status = result.data.status.toString();
                //1选房源成功,2用户无资格,3房源已被选,4:已选房源,5:该活动已取消,6:网络异常，请稍后再试,7:答案错误
                switch (status) {
                    case "2":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                        //打开秒杀错误提示
                        openMiaoErrTip(status);
                        break;
                    case "3":
                        //房源已被他人选中
                        $("#roomOtherSelectedTip_content").html($.render.temp3({token, activityId,data:result.data}));
                        $.mask.show({mask_id: "mask_roomOtherSelectedTip"});
                        $("#roomOtherSelectedTip").show();
                        break;
                    default :
                        window.location.href = "success.html?token=" + token + "&isBeta=" + result.data.isBeta + "&orderId=" + result.data.orderId;
                        break;
                }
            }
        };
        MySoft.tools.ajax(options);
    }

    //事件绑定
    function bindEvent() {
        //房源列表
        $("#roomList").on("click",function () {
            window.location.href="room_list.html?activityId="+activityId+"&token="+token;
        });
        //我的收藏
        $("#favoriteList").on("click",function () {
            window.location.href="my_favorite.html?activityId="+activityId+"&token="+token;
        });
        //收藏功能
        $("#favrite").on("click", function () {
            var obj = $(this).find("i");
            var obj2 = $(this).find(".fz12");
            var hasSelected = (obj.hasClass("icon-likeselected") && obj.hasClass("color1"));
            var options = {
                url: "/index.php?r=choose-room/collect",
                data: {token,chooseRoomId,isCollect:(hasSelected ? 0 : 1)},
                success: function (result) {
                    var data = result.data;
                    if(!hasSelected && data.isFavoriteFull){
                        obj.removeClass("icon-like").addClass("icon-likeselected color-foward");
                        obj2.text("收藏已满");
                        $.openTipLayer({content: "房源收藏人数已达"+data.roomFavoriteLimit+"人上限。"});
                    }
                    else{
                        $.openTipLayer({
                            content: hasSelected ? "取消收藏成功" : "收藏成功", callback: function () {
                                if (hasSelected) {
                                    obj.removeClass("icon-likeselected color1 color-foward").addClass("icon-like");
                                    obj2.text("收藏");
                                }
                                else {
                                    obj.removeClass("icon-like").addClass("icon-likeselected color1");
                                    obj2.text(data.roomFavoriteCount);
                                }
                            }
                        });
                    }
                }
            };
            MySoft.tools.ajax(options);
        });
        //确认订单
        $("#step2,#step4").on("click", function () {
            if ($(this).hasClass("disabled")) {
                return;
            }
            var options = {
                url: "/index.php?r=choose-room/get-random-code",
                type: "get",
                data: {token, chooseRoomId,activityVersion},
                success: function (result) {
                    randomCode = result.data.randomCode;
                    $("#confirmOrderTip").data("question",result.data.question);
                    $.mask.show({mask_id: "mask_confirmOrderTip"});
                    $("#confirmOrderTip").show();
                }
            };
            MySoft.tools.ajax(options);
        });
        //确认订单层操作
        $("#confirmOrderTip").on("click", function (e) {
            var target = $(e.target);
            if (target.closest('.cancel').length) {
                //取消
                MySoft.tools.cancelPop("confirmOrderTip", {mask_id: "mask_confirmOrderTip"});
                return;
            }
            if (target.closest('.ok').length) {
                //确定
                if ($("#orderAgree").find(".icon-checkbg").filter(":visible").length > 0) {
                    $.openTipLayer({content: "请先同意"+$("#orderAgree .color-more").text()});
                    return;
                }
                if ($('#agreementAutoTransfer').length && $("#agreementAutoTransfer").find(".icon-checkbg").filter(":visible").length > 0) {
                    $.openTipLayer({content: '请先勾选“同意选房成功冻结款自动转定金”'});
                    return;
                }
                MySoft.tools.cancelPop("confirmOrderTip", {mask_id: "mask_confirmOrderTip"});
                var question=$("#confirmOrderTip").data("question");
                if(typeof question=="undefined" || question==null){
                    //提交选房操作
                    submitOrder(0);
                }
                else{
                    //安全验证
                    $("#securityVerification_content").html($.render.temp2(question));
                    $.mask.show({mask_id: "mask_securityVerificationTip"});
                    $("#securityVerificationTip").show();
                }
            }
            if (target.closest('#orderAgree').length) {
                //确认订单层在线开盘协议操作
                if (target.closest("a").length == 0) {
                    if ($("#orderAgree").find(".icon-check").filter(":visible").length > 0) {
                        $("#orderAgree").find(".icon-check").hide();
                        $("#orderAgree").find(".icon-checkbg").show();
                    }
                    else {
                        $("#orderAgree").find(".icon-checkbg").hide();
                        $("#orderAgree").find(".icon-check").show();
                    }
                }
            }
            if (target.closest('#agreementAutoTransfer').length) {
                //确认订单层在线开盘同意选房成功冻结款自动转定金操作
                if ($("#agreementAutoTransfer").find(".icon-check").filter(":visible").length > 0) {
                    $("#agreementAutoTransfer").find(".icon-check").hide();
                    $("#agreementAutoTransfer").find(".icon-checkbg").show();
                }
                else {
                    $("#agreementAutoTransfer").find(".icon-checkbg").hide();
                    $("#agreementAutoTransfer").find(".icon-check").show();
                }
            }
        });
        //秒杀单错误提示
        $("#miaoshaTip").on("click", ".close_ok", function () {
            //关闭秒杀错误提示
            closeMiaoErrTip();
        });
        //安全验证层操作
        $("#securityVerificationTip").on("click", function (e) {
            var target = $(e.target);
            if (target.closest('.options').length) {
                //选择答案
                $("#securityVerificationTip .icon-check").removeClass("icon-check color1").addClass("icon-checkbg color8");
                target.closest('.options').find("i").removeClass("icon-checkbg color8").addClass("icon-check color1");
            }
            if (target.closest('.cancel').length) {
                //取消
                MySoft.tools.cancelPop("securityVerificationTip", {mask_id: "mask_securityVerificationTip"});
                return;
            }
            var okObj=target.closest('.ok');
            if (okObj.length) {
                //确定
                if(okObj.hasClass("disabled")){
                    return;
                }
                if ($("#securityVerificationTip .icon-check").length == 0) {
                    $.openTipLayer({content: "请选择一个答案"});
                    return;
                }
                var option_id=$("#securityVerificationTip .icon-check").attr("vid");
                MySoft.tools.cancelPop("securityVerificationTip", {mask_id: "mask_securityVerificationTip"});
                //提交选房操作
                submitOrder(option_id);
            }
        });
        //刷新
        $("#refresh").on("click", function () {
            if ($(this).hasClass("disabled")) {
                return false;
            }
            //初始化数据
            initData();
        });
        //房源已被他人选中层操作
        $("#roomOtherSelectedTip").on("click",".cancel",function () {
            //取消
            MySoft.tools.cancelPop("roomOtherSelectedTip", {mask_id: "mask_roomOtherSelectedTip"});
        });
    }

    //初始化数据
    function initData() {
        var options = {
            url: "/index.php?r=choose-room/room",
            type: "get",
            data: {token, chooseRoomId},
            success: function (result) {
                var data = result.data;
                activityVersion=data.activityVersion;
                //获取正式活动开始年份
                var regularStartDate=data.activityInfo.regularStartDate;
                data.activityInfo.regularYear=0;
                if(regularStartDate.length>4){
                    data.activityInfo.regularYear=regularStartDate.substring(0,4)-0;
                }
                $("#wrap").html($.render.temp({token, activityId,chooseRoomId, data}));
                MySoft.tools.setTitle(data.roomFullNameNoProjName);
                MySoft.tools.timer({
                    seconds: 2, callback: function () {
                        $("#refresh").removeClass("disabled");
                    }
                });
                //设置房源详情时间信息
                setRoomTimeInfo(data);

                //事件绑定
                bindEvent();
            },
            resultCustomFalseFun:function (result) {
                if(result.retCode == "2701011") {
                    $("#wrap").html($.templates("#wrap_hasSale_Template").render({token, activityId}));
                }
                else{
                    $.openTipLayer({content: result.retMsg});
                }
            }
        };
        MySoft.tools.ajax(options);
    }

    $(function () {
        //初始化数据
        initData();
    });
});


// WEBPACK FOOTER //
// ./src/js/page/room.js