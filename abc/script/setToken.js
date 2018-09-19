/**
 * Created by lil09 on 2017/4/24.
 */
let token,activityId,zxyz_activity_id,yyjh_jzl_activity_id;

let url = decodeURIComponent(location.search).substring(1);
let params = url.split("&");
let param;
for(var i = 0;param = params[i];i++){
    var key = param.split("=")[0];
    var value = param.split("=")[1];
    if(key == "token"){
        token = value;
        sessionStorage.setItem("token",token);
    }else if(key == "activityId"){
        activityId = value;
        sessionStorage.setItem("activityId",activityId);
    }
    else if(key == "zxyz_activity_id"){
        zxyz_activity_id = value;
        sessionStorage.setItem("zxyz_activity_id",zxyz_activity_id);
    } else if (key == 'yyjh_jzl_activity_id') {
        yyjh_jzl_activity_id = value;
        sessionStorage.setItem("yyjh_jzl_activity_id", yyjh_jzl_activity_id);
    }
}
token = sessionStorage.getItem("token");
activityId = sessionStorage.getItem("activityId");
zxyz_activity_id = sessionStorage.getItem("zxyz_activity_id");
yyjh_jzl_activity_id = sessionStorage.getItem("yyjh_jzl_activity_id");

export {token,activityId,zxyz_activity_id,yyjh_jzl_activity_id};




// WEBPACK FOOTER //
// ./src/js/common/setToken.js