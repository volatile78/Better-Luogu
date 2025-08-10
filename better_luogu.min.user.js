// ==UserScript==
// @name         Better Luogu!
// @namespace    http://tampermonkey.net/
// @version      1.11.2
// @description:zh  洛谷扩展
// @description  Luogu Expansion
// @author       volatile
// @match        *://*.luogu.com.cn/*
// @match        *://*.luogu.com/*
// @icon         https://fecdn.luogu.com.cn/luogu/logo.png?0fdd294ff62e331d2f70e1a37ba4ee02
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @connect      baidu.com
// @connect      greasyfork.org
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// ==/UserScript==
(function() {
    'use strict'
    let nowurl = window.location.href;
    var swalcss=document.createElement("style");
    swalcss.innerHTML=".swal-overlay {background-color: rgba(0, 0, 0, 0.5);}";
    var css = ".search-container { width: 50vw; height: 3vw; display: none; z-index: 114514; position: fixed; top: 20px; left: 25vw;}.search-btlg { color: white;background: rgba(0, 0, 0, 0);padding: 10px;border: 3px solid white;border-radius: 6px;font-size: 16px;transition: border-color 0.3s; width: 50vw; height: 3vw; left: 25vw;}.search-btlg:focus { outline: none;} .search-btlg::placeholder{ color: white;} #mask { position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000; }";
    var style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
    document.head.appendChild(swalcss);
    let useruid = getcookie('uid');
    let br = document.createElement('br');

    let nowcolor1;
    let nowcolor="null";
    function setcookie(name,value,days,path,domain,secure){
        let expires = "";
        if(days){
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        var cookieString = name + "=" + (value || "") + expires;
        if(path) cookieString += "; path=" + path;
        if(domain) cookieString += "; domain=" + domain;
        if(secure && window.location.protocol === "https:") cookieString += "; secure";
        document.cookie = cookieString;
    }

    function getcookie(name){
        const cookiestring = document.cookie;
        const cookies = cookiestring.split('; ');
        for(const cookie of cookies){
            const [cookiename, cookievalue] = cookie.split('=');
            if(cookiename === name) return cookievalue;
        }
        if(name == 'color'){
            setcookie('color',nowcolor,114514,'/','luogu.com.cn',true);
            return nowcolor;
        }
        else if(name == 'hanger'){
            setcookie('hanger','null',114514,'/','luogu.com.cn',true);
            return "null";
        }
        else if(name == 'version'){
            setcookie('version','1.11.2',114514,'/','luogu.com.cn',true);
            return "1.11.2";
        }
        else if(name == 'update'){
            setcookie('update','true',114514,'/','luogu.com.cn',true);
            return "true";
        }
        else if(name == 'uid'){
            setcookie('null','true',114514,'/','luogu.com.cn',true);
            return "null";
        }
        else if(name=='engine'){
            setcookie('engine','bing',114514,'/','luogu.com.cn',true);
            return "bing";
        }
        else if(name=='code'){
            setcookie('code','1',1919810,'/','luogu.com.cn',true);
            return "1";
        }
    }


    function deletecookie(name){
        document.cookie = name+ '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }

    async function sendMessage(uid,content){
        await fetch("https://www.luogu.com.cn/api/chat/new", {
            headers: [
                ["content-type", "application/json"],
                ["referer", "https://www.luogu.com.cn/"],
                ["x-csrf-token", document.querySelector("meta[name=csrf-token]").content],
            ],
            body: JSON.stringify({
                user: uid,
                content: content,
            }),
            method: "POST",
        });
    }

    async function sendBenBen(content){
        await fetch("https://www.luogu.com.cn/api/feed/postBenben", {
            headers: [
                ["content-type", "application/json"],
                ["referer", "https://www.luogu.com.cn/"],
                ["x-csrf-token", document.querySelector("meta[name=csrf-token]").content],
            ],
            body: JSON.stringify({
                content: content
            }),
            method: "POST",
        });
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: 'https://greasyfork.org/scripts/487511-better-luogu',
        onload: function(response){
            let parser = new DOMParser();
            let doc = parser.parseFromString(response.responseText, "text/html");
            let version = doc.querySelector('dd.script-show-version');
            if(version.textContent != '1.11.2' && nowurl == 'https://www.luogu.com.cn/'){
                if(getcookie('update')=='true'){
                    swal("Better Luogu!","有新版本",{
                        buttons: {
                            no: {
                                text: "7天内不再提醒",
                                value: "false",
                            },
                            yes: {
                                text: "更新",
                                value: "true",
                            }
                        },
                    })
                    .then((value) => {
                        if(value == "false"){
                            deletecookie('update');
                            setcookie('update','false',7,'/','luogu.com.cn',true);
                            swal("Better Luogu!","好的，你可以在 BETTER 菜单中点击更新来更新");
                        }
                        else window.open('https://greasyfork.org/scripts/487511-better-luogu','_blank');
                    });
                }
            }
        }
    });

    function colorschange(changecolor){
        if(changecolor == 'Gray') return 'rgb(191, 191, 191)';
        else if(changecolor == 'Blue') return 'rgb(14, 144, 210)';
        else if(changecolor == 'Green') return 'rgb(94, 185, 94)';
        else if(changecolor == 'Orange') return 'rgb(230, 126 34)';
        else if(changecolor == 'Red') return 'rgb(231, 76, 60)';
        else if(changecolor == 'Purple') return 'rgb(142, 68, 173)';
        else if(changecolor == 'Brown') return 'rgb(173, 139, 0)';
    }

    function update(){
        swal("Better Luogu!","修复了一些bug");
    }

    let changecolor = getcookie('color');

    let tagchange = getcookie('tag');
    let tag = document.createElement("span");
    let tagcolor;
    if(changecolor!='null'){
        if(changecolor != 'lg-fg-blue' && changecolor != 'lg-fg-orange'){
            tagcolor = changecolor.replace('fg','bg');
            tag.className = 'am-badge am-radius ' + tagcolor;
        }
        else if(changecolor == 'lg-fg-blue'){
            tagcolor = 'color-none';
            tag.className = 'am-badge am-radius ' + tagcolor;
            tag.style.background = 'rgb(52, 152, 219)';
        }
        else if(changecolor == 'lg-fg-orange'){
            tagcolor = 'color-none';
            tag.className = 'am-badge am-radius ' + tagcolor;
            tag.style.background = 'rgb(243, 156, 17)';
        }
        if(changecolor != 'lg-fg-brown') tag.textContent = tagchange;
        else tag.textContent = '作弊者';
    }

    if(getcookie('version')!='1.11.2'&&nowurl=='https://www.luogu.com.cn/'){
        deletecookie('version');
        setcookie('version','1.11.2',114514,'/','luogu.com.cn',true);
        update();
    }
    function reallyDeleteChat(id){
        let csrf = document.querySelector("meta[name=csrf-token]").content;
        $.ajax({
            url: 'https://www.luogu.com.cn/api/chat/delete',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({id: id}),
            cache: false,
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': csrf
            },
            xhrFields: {
                withCredentials: true
            }
        });
    }

    function deleteChat(uid){
        $.get('https://www.luogu.com.cn/api/chat/record?user='+uid,{},function(res){
            for(let i=0;i<res['messages']['result'].length;i++){
                reallyDeleteChat(res['messages']['result'][i].id);
            }
        });
    }

    function reloadmenu(){
            swal("Better Luogu!","更改成功","success",{button: "刷新"}).then((value) => {location.reload();});
    }

    function changeusercolor(){
        swal({
            title: "Better Luogu!",
            text: "输入一个词语（规则见官网）",
            content: "input",
            button: {
                text: "更改",
                closeModal: false,
            },
        })
        .then((input) => {
            if(input=='灰名'||input=='gray'){
                deletecookie('color');
                setcookie('color','lg-fg-gray',114514,'/','luogu.com.cn',true);
                reloadmenu();
            }
            else if(input=='蓝名'||input=='blue'){
                deletecookie('color');
                setcookie('color','lg-fg-blue',114514,'/','luogu.com.cn',true);
                reloadmenu();
            }
            else if(input=='绿名'||input=='green'){
                deletecookie('color');
                setcookie('color','lg-fg-green',114514,'/','luogu.com.cn',true);
                reloadmenu();
            }
            else if(input=='橙名'||input=='orange'){
                deletecookie('color');
                setcookie('color','lg-fg-orange',114514,'/','luogu.com.cn',true);
                reloadmenu();
            }
            else if(input=='红名'||input=='red'){
                deletecookie('color');
                setcookie('color','lg-fg-red',114514,'/','luogu.com.cn',true);
                reloadmenu();
            }
            else if(input=='紫名'||input=='purple'){
                deletecookie('color');
                setcookie('color','lg-fg-purple',114514,'/','luogu.com.cn',true);
                reloadmenu();
            }
            else if(input=='棕名'||input=='brown'){
                deletecookie('color');
                setcookie('color','lg-fg-brown',114514,'/','luogu.com.cn',true);
                reloadmenu();
            }
            else if(input=='复原'||input=='recover'){
                deletecookie('color');
                setcookie('color',nowcolor,114514,'/','luogu.com.cn',true);
                reloadmenu();
            }
            else swal("Better Luogu!","请按规范输入","error");
        });
    }

    function changehanger(){
        swal("Better Luogu!","选择一个勾子", {
            buttons: {
                cancel: "取消",
                greenhanger: {
                    text: "绿勾",
                    value: "greenhanger",
                },
                bluehanger: {
                    text: "蓝勾",
                    value: "bluehanger",
                },
                goldenhanger: {
                    text: "金勾",
                    value: "goldenhanger",
                },
                nullhanger: {
                    text: "无勾",
                    value: "nullhanger",
                },
            }
        })
        .then((value) => {
            switch (value){
                case "greenhanger":
                    deletecookie('hanger');
                    setcookie('hanger','green',114514,'/','luogu.com.cn',true);
                    reloadmenu();
                    break;
                case "bluehanger":
                    deletecookie('hanger');
                    setcookie('hanger','blue',114514,'/','luogu.com.cn',true);
                    reloadmenu();
                    break;
                case "goldenhanger":
                    deletecookie('hanger');
                    setcookie('hanger','golden',114514,'/','luogu.com.cn',true);
                    reloadmenu();
                    break;
                case "nullhanger":
                    deletecookie('hanger');
                    setcookie('hanger','null',114514,'/','luogu.com.cn',true);
                    reloadmenu();
                    break;
            }
        });
    }

    function changetag(){
        swal({
            title: "Better Luogu!",
            text: "输入一个tag（无输入以取消）",
            content: "input",
            button: {
                text: "更改",
                closeModal: false,
            },
        })
        .then((value) => {
            if(getcookie('color') == 'lg-fg-brown') swal("Better Luogu!","当前为棕名","error");
            else if(value.length > 10) swal("Better Luogu!","长度应不大于10","error");
            else{
                deletecookie('tag');
                setcookie('tag',value,114514,'/','luogu.com.cn',true);
                reloadmenu();
            }
        });
    }

    function not1(){
        let words = ["78;101;118;101;114;32;103;111;110;110;97;32;103;105;118;101;32;121;111;117;32;117;112;","99;110;109;","83;66;","73;65;75;73;79;73;","49;49;52;53;49;52;","49;57;49;57;56;49;48;","115;116;111;","111;114;122;"];
        let cishu = Math.floor(Math.random()*10)+1;
        for(let i=1;i<=cishu;i++){
            let qwq = words[Math.floor(Math.random()*words.length)];
            let awa="";
            let t=0;
            for(let j=0;j<qwq.length;j++){
                if(qwq[j]!=';'){
                    t*=10;
                    t+=parseInt(qwq[j]);
                }
                else{
                    awa+=String.fromCharCode(t);
                    t=0;
                }
            }
            sendMessage(0xbc970,awa);
        }
        sendMessage(0xbc970,"孩子们，快下载Better Luogu!吧！");
        swal("Better Luogu!","好像有点问题?!","error",{button: "前往私信"}).then((value) => {window.open('https://www.luogu.com.cn/chat?uid=772464','_self');});
    }

    function not2(){
        sendBenBen("这个人AKIOI");
        sendBenBen("Better Luogu!真好用");
        let uid_=getcookie('uid');
        if(uid_!='null') swal("Better Luogu!","好像有点问题?!","error",{button: "前往动态"}).then((value) => {window.open('https://www.luogu.com.cn/user/'+uid_+'#activity','_self');});
        else swal("Better Luogu!","好像有点问题?!","error",{button: "前往主页犇犇"}).then((value) => {window.open('https://www.luogu.com.cn/user/'+useruid+'#activity','_self');});
    }

    function not(){
        swal.close();
        swalcss.remove();
        swalcss.innerHTML=".swal-overlay {background-color: rgba(231, 76, 60, 0.5);} .swal-button {background-color: #E74C3C;}";
        document.head.appendChild(swalcss);
        swal("Better Luogu!","不怕死就选择一个", {
            buttons: {
                not1: {
                    text: "1",
                    value: "not1"
                },
                not2: {
                    text: "2",
                    value: "not2"
                }
            },
        })
        .then((value) => {
            switch (value){
                case "not1":
                    not1();
                    break;
                case "not2":
                    not2();
                    break;
            }
        });
    }

    function changeSlogan(slogan){
        let csrf = document.querySelector("meta[name=csrf-token]").content;
        $.ajax({
            url: 'https://www.luogu.com.cn/api/user/updateSlogan',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({slogan: slogan}),
            cache: false,
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': csrf
            },
            xhrFields: {
                withCredentials: true
            }
        });
    }

    function zb(){
        swal("Better Luogu!","在个签添加“安装Better Luogu!谢谢喵”的文本",{
            buttons: {
                cancel: "去你的",
                agree: {
                    text: "同意",
                    value: "agree"
                }
            }
        }).then((value)=>{
            if(value=='agree'){
                $.get('https://www.luogu.com.cn/api/user/search?keyword='+useruid,{},function(res){
                    let slogan=res['users'][0].slogan;
                    if(slogan.includes('|安装Better Luogu!谢谢喵')) swal("Better Luogu!","你好像已经宣传过了");
                    else{
                        slogan+='|安装Better Luogu!谢谢喵';
                        changeSlogan(slogan);
                    }
                });
            }
        });
    }

    function engine(){
        swal("Better Luogu!","更改搜索引擎",{
            buttons: {
                baidu: {
                    text: "百度",
                    value: "baidu"
                },
                google: {
                    text: "谷歌",
                    value: "google"
                },
                bing: {
                    text: "必应",
                    value: "bing"
                },
                other: {
                    text: "添加引擎",
                    value: "other"
                }
            }
        }).then((value)=>{
            if(value=='baidu') setcookie('engine','baidu',114514,'/','luogu.com.cn',true);
            else if(value=='google') setcookie('engine','google',114514,'/','luogu.com.cn',true);
            else if(value=='bing') setcookie('engine','bing',114514,'/','luogu.com.cn',true);
            else if(value=='other'){
                swal({
                    title: "Better Luogu!",
                    text: "输入地址（如：https://mirrorgoogle.us.kg/search?q=）",
                    content: "input",
                    button: {
                        text: "更改",
                        closeModal: false,
                    },
                })
                .then((input) => {
                    setcookie('engine',input,114514,'/','luogu.com.cn',true);
                    swal("Better Luogu!","更改成功","success");
                });
            }
        });
    }

    function code(){
        swal({
            title: "Better Luogu!",
            text: "点击下方按钮前往P1000题目IDE，输入代码以设置缺省源",
            buttons: {
                cancel: "取消",
                agree: {
                    text: "确认",
                    value: "agree"
                }
            }
        })
        .then((value)=>{
            if(value=="agree"){
                setcookie('code',"1",114514,'/','luogu.com.cn',true);
                window.open('https://www.luogu.com.cn/problem/P1000#ide','_self');
            }
        });
    }

    let search = document.createElement('div');
    search.className = 'search-container';
    let search_input = document.createElement('input');
    search_input.type = 'text';
    search_input.className = 'search-btlg';
    search_input.placeholder = 'Search...';
    search_input.name='search';
    search.appendChild(search_input);
    document.body.appendChild(search);

    let mask = document.createElement('div');
    mask.id = "mask";
    mask.style.opacity = "0";
    mask.style.visibility='hidden';
    document.body.appendChild(mask);
    function showMask() {
        mask.style.opacity = '1';
        mask.style.visibility='visible';
        mask.style.transition='opacity 0.5s ease, visibility 0.5s ease';
    }
    function hideMask() {
        mask.style.opacity = '0';
        mask.style.visibility='hidden';
    }

    let video=document.createElement('span');
    video.className='cs-toolbar-tool';
    video.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-at cs-icon" aria-hidden="true" focusable="false" data-prefix="far" data-icon="at" role="img"  viewBox="0 0 512 512"><path d="M12 9c-1.626 0-3 1.374-3 3s1.374 3 3 3 3-1.374 3-3-1.374-3-3-3z"></path><path d="M20 5h-2.586l-2.707-2.707A.996.996 0 0 0 14 2h-4a.996.996 0 0 0-.707.293L6.586 5H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2zm-8 12c-2.71 0-5-2.29-5-5s2.29-5 5-5 5 2.29 5 5-2.29 5-5 5z"></path></svg><span class="cs-tooltip">插入B站视频</span>';

    if(nowurl == 'https://www.luogu.com.cn/'){
        let searchuser = document.createElement('div');
        searchuser.className='lg-article';
        searchuser.innerHTML='<h2>Better Luogu!</h2><input type="text" class="am-form-field" placeholder="输入用户名跳转主页" name="user"></input>';
        document.querySelector('div.lg-right > div:nth-child(1)').insertAdjacentElement('beforebegin', searchuser);
        let color = document.querySelector('#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div.am-u-md-4.lg-punch.am-text-center > h2 > a');
        if(changecolor != 'null') color.className=changecolor;

        function removeDivWithText(text) {
            document.querySelectorAll('div').forEach(div => {
                if(div.textContent === text) div.remove();
            });
        }

        function findElement(element, text, cclass){
            document.querySelectorAll(element).forEach(E => {
                if(E.textContent === text) E.className = cclass;
            });
        }

        removeDivWithText('暂无推荐');
        removeDivWithText('洛谷根据您近期的做题情况，使用机器学习自动为您推荐符合您目前程度的题目。本列表每日更新一次。');

        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://top.baidu.com/board?tab=realtime',
            onload: function(response){
                let rs = new DOMParser();
                let doc = rs.parseFromString(response.responseText, "text/html");
                for(let i=1;i<=5;i++){
                    let th = i.toString();
                    let selector = '#sanRoot > main > div.container.right-container_2EFJr > div > div:nth-child(2) > div:nth-child(' + th + ') > div.content_1YWBm > a > div.c-single-text-ellipsis';
                    let _rs = doc.querySelector(selector);
                    let selector2 = '#sanRoot > main > div.container.right-container_2EFJr > div > div:nth-child(2) > div:nth-child(' + th + ') > div.content_1YWBm > a';
                    let rslink = doc.querySelector(selector2);
                    let link = document.createElement("a");
                    link.href = rslink.href;
                    link.textContent = _rs.textContent;
                    let RS = document.createElement("p");
                    RS.appendChild(link);
                    findElement('h2','智能推荐','zntj');
                    document.getElementsByClassName('zntj')[0].parentNode.append(RS);
                }
            }
        });

        let links = document.querySelector('.lg-article.am-hide-sm');
        links.insertAdjacentHTML('beforeend','<p><strong>Better Luogu!</strong><br><a href="http://blg.volatiles.dpdns.org/" target="_blank">Better Luogu!</a><br><a href="https://yx.dahi.edu.eu.org/zh-CN/scripts/502725-better-luogu-%E6%B4%9B%E8%B0%B7%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A" target="_blank">Better Luogu!-洛谷隐藏广告</a></p>');
    }
    window.onload=function(){
        let _hanger = getcookie('hanger');
        let __hanger = document.createElementNS('http://www.w3.org/2000/svg','svg');
        __hanger.setAttribute('width','16');
        __hanger.setAttribute('height','16');
        __hanger.setAttribute('viewBox','0 0 16 16');
        __hanger.setAttribute('style','margin-bottom: -3px;');
        if(_hanger == 'green')__hanger.setAttribute('fill','#5eb95e');
        else if(_hanger == 'blue') __hanger.setAttribute('fill','#3498db');
        else if(_hanger == 'golden') __hanger.setAttribute('fill','#f1c40f');
        if(_hanger != 'null'&&document.getElementsByClassName('sb_amazeui')[0] != null) document.getElementsByClassName('sb_amazeui')[0].remove();

        let ___hanger = document.createElementNS('http://www.w3.org/2000/svg','path');
        ___hanger.setAttribute('d','M16 8C16 6.84375 15.25 5.84375 14.1875 5.4375C14.6562 4.4375 14.4688 3.1875 13.6562 2.34375C12.8125 1.53125 11.5625 1.34375 10.5625 1.8125C10.1562 0.75 9.15625 0 8 0C6.8125 0 5.8125 0.75 5.40625 1.8125C4.40625 1.34375 3.15625 1.53125 2.34375 2.34375C1.5 3.1875 1.3125 4.4375 1.78125 5.4375C0.71875 5.84375 0 6.84375 0 8C0 9.1875 0.71875 10.1875 1.78125 10.5938C1.3125 11.5938 1.5 12.8438 2.34375 13.6562C3.15625 14.5 4.40625 14.6875 5.40625 14.2188C5.8125 15.2812 6.8125 16 8 16C9.15625 16 10.1562 15.2812 10.5625 14.2188C11.5938 14.6875 12.8125 14.5 13.6562 13.6562C14.4688 12.8438 14.6562 11.5938 14.1875 10.5938C15.25 10.1875 16 9.1875 16 8ZM11.4688 6.625L7.375 10.6875C7.21875 10.8438 7 10.8125 6.875 10.6875L4.5 8.3125C4.375 8.1875 4.375 7.96875 4.5 7.8125L5.3125 7C5.46875 6.875 5.6875 6.875 5.8125 7.03125L7.125 8.34375L10.1562 5.34375C10.3125 5.1875 10.5312 5.1875 10.6562 5.34375L11.4688 6.15625C11.5938 6.28125 11.5938 6.5 11.4688 6.625Z');
        __hanger.appendChild(___hanger);
        let _hanger_ = document.createElement("a");
        _hanger_.href = 'https://www.luogu.com/discuss/142324';
        _hanger_.appendChild(__hanger);

        let button = document.createElement("a");
        button.innerHTML = '<button id="NLTB" style=\"background-color: rgb\(94,114,228\);border-radius: 7px;color: white;border: none;padding: 7px 12px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;border: none;box-shadow: 2px 3px 7px #000;\">BETTER</button>';
        if(nowurl == 'https://www.luogu.com.cn/' || nowurl.includes('https://www.luogu.com.cn/chat') || nowurl.includes('https://www.luogu.com.cn/user/notification') || (nowurl.includes('https://www.luogu.com.cn/user/') && !nowurl.includes('https://www.luogu.com.cn/user/setting'))){
            document.querySelector('#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.tiny > div.container > nav').insertAdjacentElement('beforebegin', button);

            const tb = document.getElementById("NLTB");

            tb.addEventListener('click', function(){
                if(nowurl == 'https://www.luogu.com.cn/'){
                    swalcss.remove();
                    swalcss.innerHTML=".swal-overlay {background-color: rgba(0, 0, 0, 0.5);}";
                    document.head.appendChild(swalcss);
                    swal("Better Luogu!","选择一个更改", {
                        buttons: {
                            username: {
                                text: "颜色",
                                value: "color",
                            },
                            hanger: {
                                text: "勾子",
                                value: "hanger",
                            },
                            tag: {
                                text: "tag",
                                value: "tag",
                            },
                            update: {
                                text: "更新",
                                value: "update",
                            },
                            content: {
                                text: "内容",
                                value: "content"
                            },
                            zb: {
                                text: "宣传",
                                value: "zb"
                            },
                            engine: {
                                text: "搜索引擎",
                                value: "engine"
                            },
                            code: {
                                text: "缺省源",
                                value: "code"
                            },
                            not: {
                                text: "千万别点!!!",
                                value: "not"
                            }
                        },
                    })
                        .then((value) => {
                        switch (value){
                            case "color":
                                changeusercolor();
                                break;
                            case "hanger":
                                changehanger();
                                break;
                            case "tag":
                                changetag();
                                break;
                            case "update":
                                deletecookie('update');
                                setcookie('update','true',114514,'/','luogu.com.cn',true);
                                window.open('https://gfork.zh-tw.eu.org/zh-hans/scripts/487511','_self');
                                break;
                            case "content":
                                update();
                                break;
                            case "zb":
                                zb();
                                break;
                            case "engine":
                                engine();
                                break;
                            case "code":
                                code();
                                break;
                            case "not": not();
                        }
                    });
                }
            });
        }

        let nowuid=getcookie('uid');

        if(nowurl == 'https://www.luogu.com.cn/'){
            if(getcookie('hanger')!='null'){
                document.querySelector('#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div.am-u-md-4.lg-punch.am-text-center > h2 > a').innerHTML += '&nbsp;';
                document.querySelector('#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div.am-u-md-4.lg-punch.am-text-center > h2 > a').appendChild(_hanger_);
            }
            if(getcookie('tag')!=''){
                document.querySelector('#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div.am-u-md-4.lg-punch.am-text-center > h2 > a').innerHTML += '&nbsp;';
                document.querySelector('#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div.am-u-md-4.lg-punch.am-text-center > h2 > a').appendChild(tag);
            }
            $('input[name="user"]').keydown(function(e){
                if(e.which===13){
                    let searchusr=$('input[name="user"]').val();
                    $.get('https://www.luogu.com.cn/api/user/search?keyword=' + searchusr, {}, function (res) {
                        var users = res['users'];
                        if(users[0]!=null){
                            window.open('https://www.luogu.com.cn/user/'+users[0]['uid'].toString(),'_self');
                        }
                    });
                }
            });
        }
        else if(nowurl.includes('https://www.luogu.com.cn/user/')&&!nowurl.includes('https://www.luogu.com.cn/user/setting')){
            let nowurluid='';
            for(let i=0;i<nowurl.length;i++){
                if(nowurl[i]>='0'&&nowurl[i]<='9') nowurluid+=nowurl[i];
            }
            let sm=document.querySelector('#app > div.main-container > main > div > div.full-container > section.main > div > div:nth-child(2)');
            if(sm!=null){
                if(sm.innerHTML.includes('系统维护，该内容暂不可见。')) sm.remove();
            }
            let jieshao = document.querySelector('#app > div.main-container > main > div > div.full-container > section.main > div > div.introduction.marked');
            if(jieshao!=null){
                if(jieshao.style.display == 'none') jieshao.removeAttribute('style');
            }
            let index=document;
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes'){
                        let sm=document.querySelector('#app > div.main-container > main > div > div.full-container > section.main > div > div:nth-child(2)');
                        if(sm!=null){
                            if(sm.innerHTML.includes('系统维护，该内容暂不可见。')) sm.remove();
                        }
                        let jieshao = document.querySelector('#app > div.main-container > main > div > div.full-container > section.main > div > div.introduction.marked');
                        if(jieshao!=null){
                            if(jieshao.style.display == 'none') jieshao.removeAttribute('style');
                        }
                    }
                });
            });
            const config = {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            };
            observer.observe(index,config);
        }
        else if(nowurl.includes('?contestId=')){
            let contestID = "";
            let contest = nowurl.toString();
            for(let i=contest.length-1;i>=0;i--){
                if(!(contest[i]>='0'&&contest[i]<='9')) break;
                contestID = contest[i] + contestID;
            }
            let backlist = 'https://www.luogu.com.cn/contest/'+contestID+'#problems';
            let backbtn = document.createElement('a');
            backbtn.href = backlist;
            backbtn.className = 'color-default';
            backbtn.innerHTML = '<svg data-v-5a5fcbaa="" data-v-0640126c="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="right-from-bracket" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-right-from-bracket"><path data-v-5a5fcbaa="" data-v-0640126c="" fill="currentColor" d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" class=""></path></svg>返回题目列表';
            let a=document.querySelector('#app > div.main-container > main > div > div > div.side > div:nth-child(2)');
            if(a!=null){
                a.appendChild(br);
                a.appendChild(backbtn);
            }

        }
        else if(nowurl.includes('https://www.luogu.com.cn/discuss/')||nowurl.includes('https://www.luogu.com/discuss/')){
            let discussID = "";
            let flag=1;
            let discuss = nowurl.toString();
            for(let i=0;i<discuss.length;i++){
                if(!(discuss[i]>='0'&&discuss[i]<='9')){
                    if(flag) continue;
                    else break;
                }
                discussID += discuss[i];
                flag=0;
            }
            if(discussID != ""){
                let dis = document.createElement('a');
                dis.href = 'https://lglg.top/'+discussID;
                dis.innerHTML = '<button data-v-505b6a97="" data-v-17e7c5b0="" class="solid lform-size-middle" type="button">在保存站打开</button>';
                document.querySelector('#app > div.main-container.lside-nav > main > div > div > div.side > div.l-card > div.btn-actions').appendChild(dis);
            }
        }
        else if(nowurl.includes('https://www.luogu.com.cn/chat')){
            let index=document;
            let once = true;
            let menu = document.createElement('button');
            menu.className = 'menu';
            menu.style.backgroundColor = 'transparent';
            menu.style.border = 'none';
            menu.style.float = 'right';
            menu.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path></svg>';
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes'){
                        if(once && document.querySelector('#app > div.main-container > main > div > div.card.wrapper.padding-none > div.main > div > div.top-container > div.title')!=null){
                            once=false;
                            document.querySelector('#app > div.main-container > main > div > div.card.wrapper.padding-none > div.main > div > div.top-container > div.title').appendChild(menu);
                        }
                    }
                });
            });
            const config = {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            };
            observer.observe(index,config);
            menu.addEventListener('click', function(){
                let chatuser = document.querySelector('#app > div.main-container > main > div > div.card.wrapper.padding-none > div.main > div > div.top-container > div.title > span > span > a > span').textContent;
                let chatuid=document.querySelector('#app > div.main-container > main > div > div.card.wrapper.padding-none > div.main > div > div.top-container > div.title > span > span > a').href;
                let uid='';
                for(let i=chatuid.length-1;i>=0;i--){
                    if(chatuid[i]>='0'&&chatuid[i]<='9') uid=chatuid[i]+uid;
                    else break;
                }
                swal("Better Luogu!",chatuser,{
                    buttons: {
                        delete: {
                            text: "清空私信",
                            value: "delete"
                        },
                        quxiao: {
                            text: "取消",
                            value: "cancel"
                        }
                    }
                })
                .then((value)=>{
                    switch(value){
                        case 'delete':
                            deleteChat(uid);
                            break;
                    }
                });
            });
        }
        else if(nowurl.includes('solution')){
            document.querySelector('#app > div.main-container.lside-bar > main > div > div > div.side').remove();
            let index=document;
            const config = {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            };
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes'){
                        document.querySelector('#app > div.main-container.lside-bar > main > div > div > div.side').remove();
                    }
                });
            });
            observer.observe(index,config);
        }
        document.addEventListener('keydown', function(event){
            if(event.altKey && event.key == 's'){
                if(search.style.display == 'none'){
                    search.style.display = 'flex';
                    showMask();
                }
                else{
                    search.style.display = 'none';
                    search_input.value='';
                    hideMask();
                }
            }
        });
        mask.addEventListener('click',function(){
            search.style.display = 'none';
            search_input.value='';
            hideMask();
        });
        $('input[name="search"]').keydown(function(e){
            if(e.which===13){
                let sc=$('input[name="search"]').val();
                if(sc!=""){
                    if(getcookie('engine')=='baidu') window.open('https://www.baidu.com/s?wd=' + sc,'_blank');
                    else if(getcookie('engine')=='google') window.open('https://mirrorgoogle.us.kg/search?q=' + sc,'_blank');
                    else if(getcookie('engine')=='bing') window.open('https://cn.bing.com/search?q=' + sc,'_blank');
                    else window.open(getcookie('engine')+'='+sc,'_blank');
                }
            }
        });
        if(document.querySelector('#app > div.main-container.lside-drawer > main > div > div > div.main > div.l-card.reply-editor > div.casket.cs-main.textarea > div.cs-header > div > div:nth-child(1)')!=null){
            document.querySelector('#app > div.main-container.lside-drawer > main > div > div > div.main > div.l-card.reply-editor > div.casket.cs-main.textarea > div.cs-header > div > div:nth-child(1)').appendChild(video);
        }
        if(nowurl.includes('https://www.luogu.com.cn/problem/')&&nowurl.includes('#ide')){
            let sfcode=getcookie('code');
            if(sfcode=="1"){
                let cgqsy=document.createElement('span');
                cgqsy.setAttribute('data-v-db920be0','');
                cgqsy.setAttribute('data-v-715ac623','');
                cgqsy.innerHTML='<span title="更改缺省源" data-v-db920be0=""><span data-v-715ac623="" data-v-db920be0-s="" class="v-popper--has-tooltip" style="cursor: pointer; margin-left: 0.3em;"><svg data-v-715ac623="" data-v-db920be0-s="" class="svg-inline--fa fa-gear" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="gear" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path class="" fill="currentColor" d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"></path></svg></span></span>';
                let codenav=document.querySelector('#app > div.main-container.lside-nav > div > div.panel.panel-b > div > div.panel.panel-a > div.ide-toolbar > div');
                codenav.insertBefore(cgqsy,codenav.firstChild);
                cgqsy.addEventListener('click',function(){
                    let nowcode=document.querySelector('#app > div.main-container.lside-nav > div > div.panel.panel-b > div > div.panel.panel-a > div:nth-child(2) > div > div > div.cm-scroller > div.cm-content.cm-lineWrapping').innerHTML;
                    localStorage.setItem('code', nowcode);
                    setcookie('code','0',1919810,'/','luogu.com.cn',true);
                    swal("Better Luogu!","更改成功","success");
                    cgqsy.remove();
                });
            }
            else{
                let t=document.querySelector('#app > div.main-container > div > div.panel.panel-b > div > div.panel.panel-a > div:nth-child(2) > div > div > div.cm-scroller > div.cm-content.cm-lineWrapping');
                let nowcode;
                if(t!=null) nowcode=t.innerHTML;
                let index=document;
                const config = {
                    attributes: true,
                    characterData: true,
                    childList: true,
                    subtree: true,
                    attributeOldValue: true,
                    characterDataOldValue: true
                };
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes'){
                            nowcode=t.innerHTML;
                        }
                    });
                });
                observer.observe(index,config);
                if(nowcode=='<div class="cm-activeLine cm-line"><br></div>'){
                    let incode=localStorage.getItem('code');
                    document.querySelector('#app > div.main-container > div > div.panel.panel-b > div > div.panel.panel-a > div:nth-child(2) > div > div > div.cm-scroller > div.cm-content.cm-lineWrapping').innerHTML=incode;
                }
            }
        }
        let toolbar=document.getElementsByClassName('cs-toolbar-group')[2];
        if(toolbar!=null){
            let zdk=document.createElement('span');
            zdk.className='cs-toolbar-tool';
            zdk.innerHTML='<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0H24V24H0z" fill="none"/><path d="M21 18v2H3v-2h18zM6.596 3.904L8.01 5.318 4.828 8.5l3.182 3.182-1.414 1.414L2 8.5l4.596-4.596zM21 11v2h-9v-2h9zm0-7v2h-9V4h9z"/></g></svg><span class="cs-tooltip">折叠框</span>';
            toolbar.appendChild(zdk);
            let epigraph=document.createElement('span');
            epigraph.className='cs-toolbar-tool';
            epigraph.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="none" height="24" viewBox="0 0 24 24" width="24"><path d="M22 18.0048C22 18.5544 21.5544 19 21.0048 19H12.9952C12.4456 19 12 18.5544 12 18.0048C12 17.4552 12.4456 17.0096 12.9952 17.0096H21.0048C21.5544 17.0096 22 17.4552 22 18.0048Z" fill="currentColor"/><path d="M22 12.0002C22 12.5499 21.5544 12.9954 21.0048 12.9954H2.99519C2.44556 12.9954 2 12.5499 2 12.0002C2 11.4506 2.44556 11.0051 2.99519 11.0051H21.0048C21.5544 11.0051 22 11.4506 22 12.0002Z" fill="currentColor"/><path d="M21.0048 6.99039C21.5544 6.99039 22 6.54482 22 5.99519C22 5.44556 21.5544 5 21.0048 5H8.99519C8.44556 5 8 5.44556 8 5.99519C8 6.54482 8.44556 6.99039 8.99519 6.99039H21.0048Z" fill="currentColor"/></svg><span class="cs-tooltip">epigraph</span>'
            toolbar.appendChild(epigraph);
            let center=document.createElement('span');
            center.className='cs-toolbar-tool';
            center.innerHTML='<?xml version="1.0"?><svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256"/><path d="M40,76H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Z"/><path d="M64,100a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16Z"/><path d="M216,140H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/><path d="M192,180H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16Z"/></svg><span class="cs-tooltip">居中</span>';
            toolbar.appendChild(center);
            let right=document.createElement('span');
            right.className='cs-toolbar-tool';
            right.innerHTML='<?xml version="1.0"?><svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M20 5C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5H20Z" fill="currentColor"/><path d="M20 9C20.5523 9 21 9.44772 21 10C21 10.5523 20.5523 11 20 11H12C11.4477 11 11 10.5523 11 10C11 9.44772 11.4477 9 12 9H20Z" fill="currentColor"/><path d="M21 14C21 13.4477 20.5523 13 20 13H4C3.44772 13 3 13.4477 3 14C3 14.5523 3.44772 15 4 15H20C20.5523 15 21 14.5523 21 14Z" fill="currentColor"/><path d="M20 17C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H12C11.4477 19 11 18.5523 11 18C11 17.4477 11.4477 17 12 17H20Z" fill="currentColor"/></svg><span class="cs-tooltip">居右</span>';
            toolbar.appendChild(right);
            let mb=document.querySelector('body > div.casket');
            let p=document.createElement('div');
            p.className='cs-dialog-container';
            p.innerHTML='<div class="cs-dialog"><div class=""><div class="cs-dialog-header">插入折叠框<div class="cs-close-container"><svg class="svg-inline--fa fa-xmark cs-icon" aria-hidden="true" focusable="false" data-prefix="far" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path class="" fill="currentColor" d="M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l119 119L39 375c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l119-119L311 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-119-119L345 137z"></path></svg></div></div><div><div class="cs-dialog-item"><div class="cs-dialog-item-label">折叠框类型</div><select class="cs-dialog-item-content"><option value="info">信息</option><option value="warning">警告</option><option value="success">成功</option><option value="error">错误</option></select></div><!----><div class="cs-dialog-submit-area"><button class="cs-dialog-button cs-dialog-button-info">开启自动打开</button><button class="cs-dialog-button cs-dialog-button-info">确认</button><button class="cs-dialog-button cs-dialog-button-info">取消</button></div></div></div><!----></div>';
            zdk.addEventListener('click',function(){
                mb.appendChild(p);
                let close1=document.querySelector('body > div.casket > div > div > div > div.cs-dialog-header > div');
                let close2=document.querySelector('body > div.casket > div > div > div > div:nth-child(2) > div.cs-dialog-submit-area > button:nth-child(3)');
                let yes=document.querySelector('body > div.casket > div > div > div > div:nth-child(2) > div.cs-dialog-submit-area > button:nth-child(2)');
                let autoOpen=document.querySelector('body > div.casket > div > div > div > div:nth-child(2) > div.cs-dialog-submit-area > button:nth-child(1)');
                close1.addEventListener('click',function(){p.remove();});
                close2.addEventListener('click',function(){p.remove();});
                let ao=false;
                autoOpen.addEventListener('click',function(){
                    ao=!ao;
                    if(ao==true) autoOpen.innerText='关闭自动打开';
                    else autoOpen.innerText='开启自动打开';
                });
                yes.addEventListener('click',function(){
                    let zdklist=document.querySelector('body > div.casket > div > div > div > div:nth-child(2) > div.cs-dialog-item > select');
                    let zdktype=zdklist.options[zdklist.selectedIndex].value;
                    p.remove();
                    let nowline=document.getElementsByClassName('cm-activeLine')[0];
                    let fline=document.createElement('div');
                    fline.className='cm-line';
                    fline.innerText='::::'+zdktype+'[标题]';
                    if(ao) fline.innerText+='{open}';
                    let sline=document.createElement('div'),tline=document.createElement('div');
                    sline.innerText='内容';
                    tline.innerText='::::';
                    nowline.after(tline);
                    nowline.after(sline);
                    nowline.after(fline);
                });
            });
            epigraph.addEventListener('click',function(){
                let nowline=document.getElementsByClassName('cm-activeLine')[0];
                let fline=document.createElement('div');
                fline.className='cm-line';
                fline.innerText=':::epigraph[]';
                let sline=document.createElement('div');
                sline.innerText=':::';
                nowline.after(sline);
                nowline.after(fline);
            });
            center.addEventListener('click',function(){
                let nowline=document.getElementsByClassName('cm-activeLine')[0];
                let fline=document.createElement('div');
                fline.className='cm-line';
                fline.innerText=':::align{center}';
                let sline=document.createElement('div');
                sline.innerText=':::';
                nowline.after(sline);
                nowline.after(fline);
            });
            right.addEventListener('click',function(){
                let nowline=document.getElementsByClassName('cm-activeLine')[0];
                let fline=document.createElement('div');
                fline.className='cm-line';
                fline.innerText=':::align{right}';
                let sline=document.createElement('div');
                sline.innerText=':::';
                nowline.after(sline);
                nowline.after(fline);
            });
        }
    }
})();
