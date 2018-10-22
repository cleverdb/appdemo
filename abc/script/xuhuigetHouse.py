# -*- coding: utf-8 -*-
import gzip
import requests
import ssl
import json
import urllib.request
from io import StringIO
from http import cookiejar
import time
import threading
import datetime
from builtins import str


mobile="15600684638"
idCardNo="421125199309044638"
fristTargetId ="2555694"
targetRoomid = [2555694]
targetRoomidTwo = []
threadStop = True
filename = 'cookie.txt'
activityId = '4703'
token = 'gjbkst1514448478'
_activityVersion =4 ;
initCookie ='aliyungf_tc=AQAAAA1GBxJXcwIAm5EryklVOKlcdYEj; PHPSESSID=kc8jgt1r7u6k0o1kpp5dacsh34; env_orgcode=hyyhadmin; public_no_token=8306102b7d3ecfd4780037b3f9b6647868890ac62da572101e62752b2d84ce21a%3A2%3A%7Bi%3A0%3Bs%3A15%3A%22public_no_token%22%3Bi%3A1%3Bs%3A16%3A%22gjbkst1514448478%22%3B%7D; yunke_org_id=b095813e04cc880874c75cb6e8836d6dd1410dee679bda34b9f5e72ec8085d59a%3A2%3A%7Bi%3A0%3Bs%3A12%3A%22yunke_org_id%22%3Bi%3A1%3Bs%3A36%3A%2239e3a984-83bb-65c1-1fe9-ae2cf7c01b2c%22%3B%7D; ztc_org_id=c8c82cce6b7a60b5ddf0333c86bc9f3a628e5695360205cec03bc91d05c8e445a%3A2%3A%7Bi%3A0%3Bs%3A10%3A%22ztc_org_id%22%3Bi%3A1%3Bi%3A758%3B%7D; last_env=g2'


# session代表某一次连接
houseSession = requests.session()
#原始的session.cookies 没有save()方法
houseSession.cookies = cookiejar.LWPCookieJar(filename=filename)

def index():
    url = 'https://ztcwx.myscrm.cn/index.php?r=choose-room-activity/login'
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
    data = '&token=%s&activityId=%s'%(token, activityId)
    ssl._create_default_https_context = ssl._create_unverified_context
    login = houseSession.post(url, data,headers=header,verify=False)
    jsonData = login.json()
    isEnableSmsVerify = jsonData["data"]["isEnableSmsVerify"]
    if isEnableSmsVerify == 0 :
        return False
    else:
        return True
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
    
def loginWithoutVerifyCode():
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
    data = '&token=%s&activityId=%s&mobile=%s&idCardNo=%s'%(token, activityId, mobile, idCardNo)
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
    ssl._create_default_https_context = ssl._create_unverified_context
    page =houseSession.get(url,headers=header,verify=False)
    jsonData = page.json();
    print(jsonData)
    raw = jsonData['data'];
    return raw['activityInfo']['beforeStartRegularTime']



#判断房源是否可以抢，并且获取activityVersion 参数
def enterRoom(roomid):
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
    ssl._create_default_https_context = ssl._create_unverified_context
    page =houseSession.get(url,headers=header,verify=False)
    jsonData = page.json();
    raw = jsonData['data'];
    print(raw)
    if raw == False :
        print("房源已下架:%s,"%(roomid))
        return False;
    #获取activityVersion，后续提交表单需要
    global _activityVersion
    _activityVersion = str(raw["activityVersion"])
    # choose_room_status ==0 代表房源可选
    if(raw['choose_room_status'] == 0):
        print("进入房间号:%s"%(roomid))
        return True;
    else :
        print("房源已经被抢id:%s"%(roomid))
        return False;

    #获取randomCode参数，（是否检验）
def chooseRoom(roomid):
    url = "https://ztcwx.myscrm.cn/index.php?r=choose-room/get-random-code&token=%s&chooseRoomId=%s&activityVersion=%s"%(token, roomid, _activityVersion)
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
    ssl._create_default_https_context = ssl._create_unverified_context
    page =houseSession.get(url,headers=header,verify=False)
    jsonData = page.json();
    raw = jsonData['data'];
    print(jsonData)
    randomCode = str(raw['randomCode'])
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
    data = 'verify=False&token=%s&chooseRoomId=%s&activityVersion=%s&randomCode=%s&question_option_id=%s'%(token,roomid,_activityVersion,randomCode,question_option_id)
    ssl._create_default_https_context = ssl._create_unverified_context
    page = houseSession.post(url, data,headers=header,verify=False)
    jsonData = page.json();
    raw = jsonData['data'];
    if(raw['status'] == 1):
        return True;
    else :
        return False;

def getHouseOne():
    global threadStop
    for roomid in targetRoomid:
        if(enterRoom(roomid)):
            if threadStop :
                if(chooseRoom(roomid)):
                    print("抢房成功，房号：%s,时间：%s"%(roomid,time.strftime("%Y-%m-%d %H:%M:%S:%MS", time.localtime())))
                    threadStop = False
                    break;
                else:
                    print("抢房失败，房号：%s"%(roomid))

def getHouseTwo():
    global threadStop
    for roomid in targetRoomidTwo:
        if(enterRoom(roomid)):
            if threadStop :
                if(chooseRoom(roomid)):
                    print("抢房成功，房号：%s,时间：%s"%(roomid,time.strftime("%Y-%m-%d %H:%M:%S:%MS", time.localtime())))
                    threadStop = False
                    break;
                else:
                    print("抢房失败，房号：%s"%(roomid))


if  __name__ == "__main__":
    houseSession.cookies.load(ignore_discard=True)
    remaintime = 0
    loginresult = False
    loginresult = loginWithoutVerifyCode()
    if loginresult:
        #活动开始时间
        #Fri, 21 Sep 2018 08:29:07 GMT
        #serverTime = time.mktime(time.strptime("Fri, 21 Sep 2018 08:29:07 GMT", '%a, %d %b %Y %H:%M:%S GMT'))
        activityTime = time.mktime(time.strptime("2018-10-22 10:00:00", '%Y-%m-%d %H:%M:%S'))
        #每隔5秒刷新页面
        while(activityTime > int(time.time())):
             #刷新页面
            remaintime = int(beforSatartTime(fristTargetId)) #剩余时间
            print("剩余时间：%d"%remaintime)
            if(15 > remaintime):
                break
            time.sleep(5)
        if remaintime-1 > 0:
            time.sleep(remaintime-1)
            print("进入二次等待")
        #开始买房
        print("开始选房，选房时间：%s"%time.strftime("%Y-%m-%d %H:%M:%S:%MS", time.localtime()))
        # for roomid in targetRoomid:
        #     if(enterRoom(roomid)):
        #         print("-----------enterRoom-------------")
        #         if(chooseRoom(roomid)):
        #             print("抢房成功，房号：%s"%(roomid))
        #             break;
        #         else:
        #             print("抢房失败，房号：%s"%(roomid))
        one = threading.Thread(target=getHouseOne)
        one.start()
        two = threading.Thread(target=getHouseTwo)
        two.start()

    else:
        print("------登陆失败--------------")



