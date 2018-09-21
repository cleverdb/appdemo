# -*- coding: utf-8 -*-
import gzip
import requests
import ssl
import json
import urllib.request
from io import StringIO
from http import cookiejar
import time
import datetime


mobile="13377863363"
idCardNo="420621199012164568"
fristTargetId =""
targetRoomid = [12,12,12,12,12]
filename = 'cookie.txt'
activityId = '4350'
token = 'azrkvw1493281329'
activityVersion ='' ;
initCookie ='env_orgcode=xlzdadmin; last_env=g2; public_no_token=e744f82cdc7ac4caa3ffee2d035a04bc8168b7c1b3272f433f88b56b7d58d296a%3A2%3A%7Bi%3A0%3Bs%3A15%3A%22public_no_token%22%3Bi%3A1%3Bs%3A16%3A%22azrkvw1493281329%22%3B%7D; yunke_org_id=98b60a297ccf311bd19cd3424bc3b162bc57266afd86271381eb19e0ee128372a%3A2%3A%7Bi%3A0%3Bs%3A12%3A%22yunke_org_id%22%3Bi%3A1%3Bs%3A36%3A%2239debffa-6dec-d05e-8cf7-dbb6483baf0a%22%3B%7D; ztc_org_id=2e4de75b25bba306188fec3cd7b1b2f62beb164f62eb111d33b1cd218bb1d634a%3A2%3A%7Bi%3A0%3Bs%3A10%3A%22ztc_org_id%22%3Bi%3A1%3Bi%3A493%3B%7D; PHPSESSID=ib4cc1sad7h1fupeh22ri7etl7; aliyungf_tc=AQAAAPyvwTZXiAQAGvSUPW7rGhTqwt5W; acw_tc=76b20f6a15372693266994098e151d7d3c4fc5a0a75dd30698da5b75bab07a; SelectCity=0%2C%E5%85%A8%E5%9B%BD; gr_user_id=eebd6b7f-4d72-4188-a431-611f82c4ed01'


# session代表某一次连接
houseSession = requests.session()
#原始的session.cookies 没有save()方法
houseSession.cookies = cookiejar.LWPCookieJar(filename=filename)

#获取验证码
def sendVerifyCode():
    url = 'https://ztcwx.myscrm.cn/index.php?r=choose-room-activity/send-verify-code'
    header = {
        'Host': 'ztcwx.myscrm.cn',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.2; zh-cn; Chitanda/Akari) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 Micromessage/6.0.0.58_r884092.501 NetType/WIFI',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Referer': 'https://ztcwx.myscrm.cn/page/login.html?activityId=%s&token=%s&url=https://ztcwx.myscrm.cn/page/activity.html?token=%s&activityId=%s'%(activityId, token, token, activityId),
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cookie': initCookie
    }
    data = 'token=%s&mobile=%s&activityId=%s'%(token, mobile, activityId)
    ssl._create_default_https_context = ssl._create_unverified_context
    houseSession.post(url, data,headers=header,verify=False)

def login(verifyCode):
    url = 'https://ztcwx.myscrm.cn/index.php?r=choose-room-activity/confirm-login'
    header = {
        'Host': 'ztcwx.myscrm.cn',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.2; zh-cn; Chitanda/Akari) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 Micromessage/6.0.0.58_r884092.501 NetType/WIFI',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Referer': 'https://ztcwx.myscrm.cn/page/login.html?activityId=%s&token=%s&url=https://ztcwx.myscrm.cn/page/activity.html?token=%s&activityId=%s'%(activityId, token, token, activityId),
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cookie': initCookie
    }
    data = '&token=%s&activityId=%s&mobile=%s&idCardNo=%s&verifyCode=%s'%(token, activityId, mobile, idCardNo, verifyCode)
    ssl._create_default_https_context = ssl._create_unverified_context
    loginResult = houseSession.post(url, data,headers=header,verify=False)
    jsonData = loginResult.json()
    retCode = jsonData["retCode"]
    if retCode != "0001001" :
        print(jsonData)
        houseSession.cookies.save()
        print("账户登陆成功")
        return True
    else:
        print(loginResult.json())
        return False

#获取倒计时时间
def beforSatartTime(roomid):
    url = "https://ztcwx.myscrm.cn/index.php?r=choose-room/room&token=%s&chooseRoomId=%s"%(token,roomid)
    header = {
        'Host': 'ztcwx.myscrm.cn',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.2; zh-cn; Chitanda/Akari) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 Micromessage/6.0.0.58_r884092.501 NetType/WIFI',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Referer': 'https://ztcwx.myscrm.cn/page/room.html?token=%s&activityId=%s&chooseRoomId=%s'%(token, activityId, roomid),
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cookie': initCookie
    }
    page =houseSession.get(url,headers=header,verify=False)
    jsonData = page.json();
    raw = jsonData['data'];
    return raw['beforeStartRegularTime']



#判断房源是否可以抢，并且获取activityVersion 参数
def enterRoom(roomid):
    print("进入房间号:%s"%(roomid))
    url = "https://ztcwx.myscrm.cn/index.php?r=choose-room/room&token=%s&chooseRoomId=%s"%(token,roomid)
    header = {
        'Host': 'ztcwx.myscrm.cn',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.2; zh-cn; Chitanda/Akari) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 Micromessage/6.0.0.58_r884092.501 NetType/WIFI',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Referer': 'https://ztcwx.myscrm.cn/page/room.html?token=%s&activityId=%s&chooseRoomId=%s'%(token, activityId, roomid),
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cookie': initCookie
    }
    page =houseSession.get(url,headers=header,verify=False)
    jsonData = page.json();
    raw = jsonData['data'];
    #获取activityVersion，后续提交表单需要
    global activityVersion
    activityVersion = raw['activityVersion']
    # choose_room_status ==0 代表房源可选
    if(raw['choose_room_status'] == 0):
        print("enter room id:%s,"%(roomid))
        return True;
    else :
        return False;

    #获取randomCode参数，（是否检验）
def chooseRoom(roomid):
    url = "https://ztcwx.myscrm.cn/index.php?r=choose-room/get-random-code&token=%s&chooseRoomId=%s&activityVersion=%s"%(token, roomid, activityVersion)
    header = {
        'Host': 'ztcwx.myscrm.cn',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.2; zh-cn; Chitanda/Akari) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 Micromessage/6.0.0.58_r884092.501 NetType/WIFI',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Referer': 'https://ztcwx.myscrm.cn/page/room.html?token=%s&activityId=%s&chooseRoomId=%s'%(token, activityId,roomid),
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cookie': initCookie
    }
    page =houseSession.get(url,headers=header,verify=False)
    jsonData = page.json();
    raw = jsonData['data'];
    randomCode = raw['randomCode']
    #判断是否需要验证码验证 question==null 不需要
    #if(raw['question']):
        #处理验证码
        #TODO
    #默认不需要验证码，提交订单
    return submitOrder(roomid, randomCode)

def submitOrder(roomid, randomCode ,question_option_id = 0):
    url = "https://ztcwx.myscrm.cn/index.php?r=choose-room/submit-order"
    header = {
    'Host': 'ztcwx.myscrm.cn',
    'Connection': 'keep-alive',
    'Content-Length': '127',
    'Accept': '*/*',
    'Origin': 'https://ztcwx.myscrm.cn',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.2; zh-cn; Chitanda/Akari) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 Micromessage/6.0.0.58_r884092.501 NetType/WIFI',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Referer': 'https://ztcwx.myscrm.cn/page/room.html?token=%s&activityId=%s&chooseRoomId=%s'%(token, activityId, roomid),
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cookie': initCookie
    }
    data = 'verify=False&token=%s&chooseRoomId=%s&activityVersion=%s&randomCode=%s&question_option_id=%s'%(token,roomid,activityVersion,randomCode,question_option_id)
    ssl._create_default_https_context = ssl._create_unverified_context
    page = houseSession.post(url, data,headers=header,verify=False)
    jsonData = page.json();
    raw = jsonData['data'];
    if(raw['status'] == 1):
        return True;
    else :
        return False;



if  __name__ == "__main__":
    houseSession.cookies.load(ignore_discard=True)
    remaintime = 0
    sendVerifyCode()
    code = input("输入验证码:")
    result = login(code)
    if result:
        #活动开始时间
        #Fri, 21 Sep 2018 08:29:07 GMT
        #serverTime = time.mktime(time.strptime("Fri, 21 Sep 2018 08:29:07 GMT", '%a, %d %b %Y %H:%M:%S GMT'))
        # activityTime = time.mktime(time.strptime("2018-09-21 16:30:00", '%Y-%m-%d %H:%M:%S'))
        # #每隔5秒刷新页面
        # while(activityTime > int(time.time())):
        #     #刷新页面
        #     remaintime = beforSatartTime(fristTargetId) #剩余时间
        #     if(10 > remaintime):
        #         break
        #     time.sleep(5)
        # time.sleep(remaintime-1)
        # print("进入二次等待")
        #开始买房
        print(time.strftime("%Y-%m-%d %H:%M:%S:%MS", time.localtime()))
        # for roomid in targetRoomid:
        #     if(enterRoom(roomid)):
        #         if(chooseRoom(roomid)):
        #             print("抢房成功，房号：%s"%(roomid))
        #             break;
        #startBuyHouse()





