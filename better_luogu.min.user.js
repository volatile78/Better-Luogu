// ==UserScript==
// @name         Better Luogu!
// @namespace    https://www.luogu.com.cn/user/772464
// @version      1.14.1
// @description:zh  洛谷扩展
// @description  Luogu Expansion
// @author       volatile
// @match        *://*.luogu.com.cn/*
// @match        *://*.luogu.com/*
// @icon         https://s21.ax1x.com/2024/08/11/pASqf4x.png
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
// @require      https://cdn.jsdmirror.com/gh/highlightjs/cdn-release/build/highlight.min.js
// @require      https://cdn.jsdmirror.com/npm/marked@4.0.0/marked.min.js
// @require      https://cdn.jsdmirror.com/npm/katex@0.16.9/dist/katex.min.js
// @require      https://cdn.jsdmirror.com/npm/katex@0.16.9/dist/contrib/auto-render.min.js
// @license      MIT
// ==/UserScript==
(function() {
    'use strict'
    marked.setOptions({
        highlight: function(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
        langPrefix: 'hljs language-'
    });
    const renderer = new marked.Renderer();
    const originalCodeRenderer = renderer.code;
    renderer.code = function(code, lang, escaped) {
        const originalHtml = originalCodeRenderer.call(this, code, lang, escaped);
        const temp = document.createElement('div');
        temp.innerHTML = originalHtml;
        let preElement, codeElement;
        if (temp.firstElementChild.tagName === 'PRE') {
            preElement = temp.firstElementChild;
            codeElement = preElement.querySelector('code');
        }
        let languageClass = '';
        if (codeElement && codeElement.className) {
            const classMatch = codeElement.className.match(/language-(\w+)/);
            if (classMatch) languageClass = `language-${classMatch[1]}`;
        }
        languageClass = languageClass || '';
        preElement.setAttribute('data-v-6e0a2e13', '');
        preElement.setAttribute('data-line', '');
        preElement.className = `pre hide-numbers ${languageClass} line-numbers`;
        preElement.setAttribute('tabindex', '0');
        if (codeElement) {
            codeElement.setAttribute('data-v-6e0a2e13', '');
            const existingClasses = codeElement.className.split(' ').filter(cls =>cls && !cls.startsWith('language-')).join(' ');
            codeElement.className = `${existingClasses} ${languageClass}`.trim();
        }
        return temp.innerHTML;
    };
    marked.setOptions({ renderer });
    class Review{
        constructor(id,uid,user,content,choose,time){
            this.id=id;
            this.uid=uid;
            this.user=user;
            this.content=content;
            this.choose=choose;
            this.time=time
        }
    }

    function getTime(timestamp){
        const date=new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function lgColor(color){
        if(color=='Gray') color='rgb(191, 191, 191)';
        else if(color=='Blue') color='rgb(52, 152, 219)';
        else if(color=='Green') color='rgb(82, 196, 26)';
        else if(color=='Orange') color='rgb(243, 156, 17)';
        else if(color=='Red') color='rgb(254, 76, 97)';
        else if(color=='Purple') color='rgb(157, 61, 207)';
        else if(color=='Cheater') color='rgb(173, 139, 0)';
        return color;
    }

    let reviews=[];
    let rvmg=document.createElement('div');
    rvmg.className='lfe-marked';
    let rvmghtml;
    let lastid=0;
    GM_addStyle(`.ops[data-v-1a591deb] a[data-v-1a591deb]{display:block!important;width:auto!important;margin:0.3em 0!important;text-align:left!important;padding:0.4em 2em 0.4em 0.6em!important;line-height:1.3!important;border-radius:4px!important;transition:all 0.2s!important;background:transparent!important;position:relative!important;color:inherit!important;text-decoration:none!important;cursor:pointer!important;transform:scale(1);}.ops[data-v-1a591deb] a[data-v-1a591deb] svg{width:16px!important;height:16px!important;margin:0!important;margin-right:8px!important;display:inline-block!important;vertical-align:middle!important;flex-shrink:0!important;}.ops[data-v-1a591deb] a[data-v-1a591deb]::after{content:""!important;position:absolute!important;right:0.6em!important;top:50%!important;transform:translateY(-50%) scale(1)!important;width:12px!important;height:12px!important;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 5l7 7-7 7'/%3E%3C/svg%3E") no-repeat center center!important;background-size:100% 100%!important;transition:all 0.2s!important;}.ops[data-v-1a591deb] a[data-v-1a591deb]:hover{background:#f0f0f0!important;transform:scale(1.03);}.ops[data-v-1a591deb] a[data-v-1a591deb]:hover::after{background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 5l7 7-7 7'/%3E%3C/svg%3E") no-repeat center center!important;right:0.5em!important;transform:translateY(-50%) scale(1.2)!important;width:14px!important;height:14px!important;}.ops[data-v-1a591deb]{padding:0.1em 0.5em!important;margin-top:-0.2em!important;text-align:left!important;font-size:0.9em!important;}.center[data-v-1f03983a]{height:auto!important;min-height:unset!important;padding:0.5em!important;box-sizing:border-box!important;}.header[data-v-1a591deb]{margin-bottom:0.05em!important;text-align:center!important;}footer[data-v-1a591deb]{margin-top:0.5em!important;}`);
    GM_addStyle(`.ccf-info{font-size:8px!important;color:#666;margin:5px 0!important;display:block;line-height:1.2;text-align:center!important;}.follow-fans-info{display:flex;gap:20px;margin:2px 0 4px 0!important;align-items:center;justify-content:center!important;}.follow-fans-info a{text-decoration:none!important;display:flex;flex-direction:column;align-items:center;}.follow-fans-info .label{font-size:12px!important;color:#888!important;margin-bottom:2px;transition:color 0.2s ease;}.follow-fans-info .num{font-size:1em!important;font-weight:bold;color:#666!important;line-height:1;margin:0;transition:color 0.2s ease;}.follow-fans-info a:hover .label,.follow-fans-info a:hover .num{color:#0e90d2!important;text-decoration:none!important;}`);
    let nowurl = window.location.href;
    var swalcss=document.createElement("style");
    swalcss.innerHTML=".swal-overlay {background-color: rgba(0, 0, 0, 0.5);}";
    var css = ".search-container{width:600px;max-width:90vw;display:none;z-index:10000;position:fixed;top:20%;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.98);backdrop-filter:blur(20px);border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.15),0 0 0 1px rgba(255,255,255,0.1);overflow:hidden;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);border:1px solid rgba(255,255,255,0.2)}.search-btlg{width:100%;height:70px;padding:0 60px 0 25px;border:none;border-radius:0;font-size:18px;font-weight:500;transition:all 0.3s ease;background:transparent;color:#2d3748;box-sizing:border-box;letter-spacing:-0.2px}.search-btlg:focus{outline:none;background:rgba(102,126,234,0.02)}.search-btlg::placeholder{color:#a0aec0;font-weight:400;letter-spacing:normal}#mask{position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);z-index:100;transition:all 0.3s ease}div[data-v-0a593618],div[data-v-fdcd5a58]{display:none}@media (prefers-color-scheme: dark){.search-container{background:rgba(45,55,72,0.95);border:1px solid rgba(255,255,255,0.1)}.search-btlg{color:#e2e8f0}.search-btlg::placeholder{color:#718096}}@media (max-width:768px){.search-container{width:95vw;top:10%;border-radius:12px}.search-btlg{height:60px;font-size:16px;padding:0 50px 0 20px}}.contest-search-box-btlg{display:flex;align-items:center;border:1px solid #e0e0e0;border-radius:4px;padding:0 8px;height:36px;width:300px;box-sizing:border-box;}.contest-search-input-btlg{flex:1;border:none;outline:none;height:100%;font-size:14px;padding:0 4px;}.contest-search-input-btlg::placeholder{color:#999;}.contest-search-icon-btlg{width:16px;height:16px;fill:#999;cursor:pointer;margin-left:4px;}";
    var style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
    document.head.appendChild(swalcss);
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
        if(name == 'version'){
            setcookie('version','1.14.1',114514,'/','luogu.com.cn',true);
            return "1.14.1";
        }
        else if(name == 'update'){
            setcookie('update','true',114514,'/','luogu.com.cn',true);
            return "true";
        }
        else if(name=='engine'){
            setcookie('engine','bing',114514,'/','luogu.com.cn',true);
            return "bing";
        }
        else if(name=='code'){
            setcookie('code','1',1919810,'/','luogu.com.cn',true);
            return "1";
        }
        else if(name=='love'){
            setcookie('love','0',1919810,'/','luogu.com.cn',true);
            return "0";
        }
        else if(name=='notice'){
            setcookie('notice',0,1919810,'/','luogu.com.cn',true);
            return 0;
        }
    }

    let useruid = getcookie('uid');
    function deletecookie(name){ document.cookie = name+ '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';}

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
    function update(){
        swal("Better Luogu!","修复了一些bug");
    }
    if(getcookie('version')!='1.14.1'&&nowurl=='https://www.luogu.com.cn/'){
        deletecookie('version');
        setcookie('version','1.14.1',114514,'/','luogu.com.cn',true);
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
            for(let i=0;i<res['messages']['result'].length;i++) reallyDeleteChat(res['messages']['result'][i].id);
        });
    }

    function reloadmenu(){
        swal("Better Luogu!","更改成功","success",{button: "刷新"}).then((value) => {location.reload();});
    }
    function addBadge(){
        let badgeSettings = GM_getValue('badge_settings');
        if(badgeSettings.enabled){
            let badge=document.createElement('span');
            badge.className='btlg-badge';
            badge.innerText=badgeSettings.text;
            GM_addStyle(`.btlg-badge{${badgeSettings.css}}`);
            let targetUsername = '';
            let debounceTimer = null;
            const PROCESSED_FLAG = 'data-btlg-processed';
            function fetchUsername() {
                const uid = getcookie('uid');
                if (!uid) return;
                $.get('https://www.luogu.com.cn/api/user/search?keyword=' + uid,{},function (res) {
                    if (res && res.users && res.users.length > 0) {
                        targetUsername = res.users[0].name;
                        processTargetLinks();
                    }
                });
            }
            function isLinkTextValid(link) {
                const linkText = link.textContent.trim();
                if (link.children.length === 0) {
                    return linkText === targetUsername;
                }
                if (link.children.length === 1 && link.children[0].tagName.toLowerCase() === 'span') {
                    const spanText = link.children[0].textContent.trim();
                    return spanText === targetUsername;
                }
                return false;
            }
            function processTargetLinks() {
                if (!targetUsername) return;
                let userLinks = document.querySelectorAll(`a[href="https://www.luogu.com.cn/user/${getcookie('uid')}"]:not([${PROCESSED_FLAG}])`);
                if (userLinks.length === 0) {
                    const allLinks = Array.from(document.querySelectorAll(`a:not([${PROCESSED_FLAG}])`));
                    userLinks = allLinks.filter(link => {
                        try {
                            const absoluteHref = new URL(link.href, window.location.href).href;
                            const linkText = link.textContent.trim();
                            return (
                                absoluteHref === 'https://www.luogu.com.cn/user/'+getcookie('uid') &&
                                isLinkTextValid(link)
                            );
                        } catch (e) {
                            return false;
                        }
                    });
                } else {
                    userLinks = Array.from(userLinks).filter(link => {
                        const linkText = link.textContent.trim();
                        return link.children.length === 0 && linkText === targetUsername;
                    });
                }

                userLinks.forEach(link => {
                    const parentTag = link.parentElement?.tagName.toLowerCase();
                    if (parentTag === 'p') return;
                    link.setAttribute(PROCESSED_FLAG, 'true');
                    link.insertAdjacentElement('afterend', badge.cloneNode(true));
                });
            }
            function debounceProcess() {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(processTargetLinks, 100);
            }
            fetchUsername();

            const observer = new MutationObserver((mutations) => {
                const hasUsefulNodes = mutations.some(mutation => Array.from(mutation.addedNodes).some(node => node.nodeType === 1));
                if (hasUsefulNodes) debounceProcess();
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
            window.addEventListener('unload', () => {
                clearTimeout(debounceTimer);
                observer.disconnect();
            });
        }
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
                    text: "输入地址（如：https://google.com/search?q=）",
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
    search.innerHTML = '<input type="text" class="search-btlg" placeholder="搜索网页内容..." name="search" autocomplete="off">';
    document.body.appendChild(search);

    let search_input = search.querySelector('.search-btlg');

    function checkUpdate(){
        $.get('https://www.luogu.com.cn/api/user/search?keyword=1416603',{},function(res){
            let slogan=res['users'][0].slogan;
            if(slogan!=getcookie('version')) swal("Better Luogu!","有新版本"+slogan,"warning",{buttons: {
                cancel: "取消",
                update: {
                    text: "前往更新",
                    value: "update"
                }
            }}).then((value) => {if(value=='update') window.open('https://www.luogu.me/article/w31r5kzz','_self');});
            else swal("Better Luogu!","已是最新版本"+slogan,"warning");
        });
    }

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

    let _rvmg='';

    function getComment(lid,lastid){
        if(lastid){
            document.querySelector('#app > div.main-container > main > div > div > div > div.body > div > div').remove();
            document.querySelector('#app > div.main-container > main > div > div > div > div.body > div').appendChild(rvmg);
        }
        $.get('https://www.luogu.com.cn/article/'+lid+'/replies'+(lastid?'?after='+lastid.toString():''),{},function(res){
            for(let i=0;res.replySlice[i]!=undefined;i++){
                let comment=res.replySlice[i];
                let rvid=comment.id;
                let rv=comment.content;
                let rvuid=comment.author.uid;
                let rvname=comment.author.name;
                let rvtime=comment.time*1000;
                let rvt=getTime(rvtime);
                reviews.push(new Review(rvid,rvuid,rvname,rv,false,rvt));
            }
            rvmghtml=`<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background-color: #f5f7fa; min-height: 100vh;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;"><h1 style="color: #2c3e50; margin: 0; font-weight: 600;">评论管理</h1><div><button id="batchSelect" style="background-color: #27ae60; color: white; border: none; padding: 10px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; font-weight: 500;">全选</button><button id="batchDelete"style="background-color: #e74c3c; color: white; border: none; padding: 10px 16px; border-radius: 4px; cursor: pointer; font-weight: 500;">批量删除</button></div></div><div id="batchActions"style="background-color: #3498db; color: white; padding: 12px 20px; border-radius: 6px; margin-bottom: 20px; display: none; align-items: center; justify-content: space-between;"><span id="selectedCount"style="font-weight: 500;">已选择<span style="color: #3498db; font-weight: 500;"id="slct"></span>条评论</span><div><button id="selectAll"style="background: transparent; color: white; border: 1px solid white; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 10px;">全选</button><button id="deselectAll"style="background: transparent; color: white; border: 1px solid white; padding: 6px 12px; border-radius: 4px; cursor: pointer;">取消选择</button></div></div><div style="background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden;"><div style="display: flex; background-color: #f8f9fa; padding: 15px 20px; border-bottom: 1px solid #eaecef; font-weight: 600; color: #495057;"><div style="width: 50px; text-align: center;">选择</div><div style="width: 80px;">编号</div><div style="width: 150px;">用户名</div><div style="flex: 1;">评论内容</div><div style="width: 120px; text-align: center;">操作</div></div>`;
            reviews.forEach((review,index)=>{
                rvmghtml+=`<div class="comment-item"style="display: flex; padding: 18px 20px; border-bottom: 1px solid #f1f3f4; align-items: flex-start; transition: background-color 0.2s;"><div style="width: 50px; text-align: center; padding-top: 3px;"><input type="checkbox"class="comment-checkbox"style="cursor: pointer; width: 18px; height: 18px;"${(review.choose?'checked':'')} data-comment-id="${review.id}"></div><div style="width: 80px; color: #6c757d; font-weight: 500;">${review.id}</div><div style="width: 150px;"><div style="font-weight: 500; color: #2c3e50;"><a href="https://www.luogu.com.cn/user/${review.uid}">${review.user}</a></div><div style="font-size: 12px; color: #7f8c8d;">${review.time}</div></div><div style="flex: 1; color: #34495e; line-height: 1.5; word-wrap: break-word; max-width: 600px;">${review.content}</div><div style="width: 120px; text-align: right;"><button class="btn-delete"style="background-color: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; " data-comment-id="${review.id}">删除</button></div></div>`;
            });
            _rvmg=rvmghtml+`</div><div style="text-align: center; margin: 25px 0;">${(reviews.length%20==0&&reviews.length?`<button style="background-color: #3498db; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-size: 15px; font-weight: 500; transition: background-color 0.3s;" id="getmorerv">加载更多</button>`:``)}</div><div style="display: flex; justify-content: space-between; margin-top: 20px; color: #7f8c8d; font-size: 14px;"><div>已获取<span style="color: #3498db; font-weight: 500;"id="rvct">${reviews.length}</span>条评论</div></div></div>`;
            rvmg.innerHTML=_rvmg;
        });
    }
    function deleteComment(lid,id){
        let csrf = document.querySelector("meta[name=csrf-token]").content;
        $.ajax({
            url: 'https://www.luogu.com.cn'+'/article/'+lid.toString()+'/deleteReply/'+id.toString(),
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
        reloadmenu();
    }
    async function batchDeleteComment(lid,id,i,tot,retryCount=10){
        return new Promise((resolve, reject) => {
            let csrf = document.querySelector("meta[name=csrf-token]").content;
            let attempts = 0;
            function attemptDelete() {
                $.ajax({
                    url: 'https://www.luogu.com.cn'+'/article/'+lid.toString()+'/deleteReply/'+id.toString(),
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
                    },
                    success: function(response) {
                        swal("Better Luogu!","请等待删除完毕，当前进度"+(i+1).toString()+'/'+tot.toString(),"success",{button: "停止"}).then((value) => {location.reload();});
                        resolve(response);
                    },
                    error: function(xhr, status, error) {
                        attempts++;
                        if (attempts < retryCount) {
                            swal("Better Luogu!","删除失败，正在重试，当前进度"+(i+1).toString()+'/'+tot.toString(),"error",{button: "停止"}).then((value) => {location.reload();});
                            setTimeout(attemptDelete, 1000 * Math.pow(2, attempts));
                        } else {
                            swal("Better Luogu!","删除失败，请重试","error",{button: "刷新"}).then((value) => {location.reload();});
                            reject(error);
                        }
                    }
                });
            }
            attemptDelete();
        });
    }

    async function chooseComment(lid){
        let chooce=document.querySelectorAll('.comment-checkbox:checked');
        let chooces=Array.from(chooce).map(checkbox=>{
            return checkbox.getAttribute('data-comment-id');
        });
        if(chooces.length==0) swal("Better Luogu!","请先选择","error")
        else{
            let tot=chooces.length;
            for(let i=0;i<chooces.length;i++){
                const deleteId = chooces[i];
                try {
                    await batchDeleteComment(lid, deleteId, i, tot);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    swal("Better Luogu!","删除失败，请重试","error",{button: "刷新"}).then((value) => {location.reload();});
                }
            }
        }
    }

    let noticeBoard = document.createElement('div');
    noticeBoard.className = 'notice-board';
    noticeBoard.innerHTML = '<div class="notice-content"><div class="notice-header"><h3>公告</h3><button class="notice-close">&times;</button></div><div class="notice-body"></div><div class="notice-footer"><button class="notice-confirm">已阅</button></div></div>';

    let noticeStyle = document.createElement('style');
    noticeStyle.innerHTML = '.notice-board{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,0.8);backdrop-filter:blur(20px);border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.15);z-index:10002;width:700px;max-width:95vw;display:none;border:1px solid rgba(255,255,255,0.2)}.notice-content{padding:25px}.notice-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.notice-header h3{margin:0;color:#2c3e50;font-weight:600}.notice-close{background:none;border:none;font-size:24px;cursor:pointer;color:#718096}.notice-body{color:#4a5568;line-height:1.6;margin-bottom: 25px;}@media (prefers-color-scheme: dark){.notice-board{background:rgba(45,55,72,0.8)}.notice-header h3{color:#e2e8f0}.notice-body{color:#a0aec0}.notice-footer{border-top-color:rgba(255,255,255,0.1)}}@keyframes noticeFadeIn{from{opacity:0;transform:translate(-50%,-60%)}to{opacity:1;transform:translate(-50%,-50%)}}.notice-board{animation:noticeFadeIn 0.3s ease}.notice-footer{display:flex;justify-content:flex-end;padding-top:15px;border-top:1px solid rgba(0, 0, 0, 0.05);}.notice-confirm{background:#3182ce;color:white;border:none;border-radius:8px;padding:10px 20px;font-size:14px;font-weight:500;cursor:pointer;transition:background 0.2s}.notice-confirm:hover{background:#2b6cb0}';
    document.head.appendChild(noticeStyle);
    document.body.appendChild(noticeBoard);

    function showNotice(title, content) {
        noticeBoard.querySelector('.notice-header h3').textContent = title;
        noticeBoard.querySelector('.notice-body').innerHTML = content;
        noticeBoard.style.display = 'block';
        showMask();
    }

    function hideNotice() {
        noticeBoard.style.display = 'none';
        hideMask();
    }

    if(nowurl == 'https://www.luogu.com.cn/'){
        let searchuser = document.createElement('div');
        searchuser.className='lg-article';
        searchuser.innerHTML='<h2>Better Luogu!</h2><div class="am-input-group am-input-group-primary am-input-group-sm"><input type="text" class="am-form-field" placeholder="输入用户名跳转主页" name="user"></input></div>';
        document.querySelector('div.lg-right > div:nth-child(1)').insertAdjacentElement('beforebegin', searchuser);
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
        links.insertAdjacentHTML('beforeend','<p><strong>Better Luogu!</strong><br><a href="http://blg.volatiles.dpdns.org/" target="_blank">文档</a> | <a href="https://www.wjx.cn/vm/wmliui0.aspx">问卷调查</a></p><p><strong>extend-luogu</strong><br><a href="https://fastly.jsdelivr.net/gh/extend-luogu/extend-luogu/dist/extend-luogu.min.user.js" target="_blank">下载</a> | <a href="https://extend-luogu.github.io/docs/" target="_blank">文档</a></p><p><strong>oiso++</strong><br><a href="https://amzcd.top/files/ex-oiso.min.user.js" target="_blank">下载</a></p><p><strong>Amazing Luogu</strong><br><a href="http://gh.halonice.com/https://raw.githubusercontent.com/zym2013/Amazing-Luogu/refs/heads/main/index.user.js" target="_blank">下载</a> | <a href="https://zym2013.dpdns.org/amldocs/" target="_blank">文档</a></p>');
    }
    function checkNotice(){
        $.get('https://www.luogu.com.cn/api/feed/list?user=1416603',{},function(res){
            let latestbb=res.feeds.result[0];
            let latest=latestbb.content;
            let latestid=latestbb.id;
            if(latestid>getcookie('notice')){
                let toHtml=marked.parse(latest);
                showNotice('公告',toHtml);
                noticeBoard.querySelector('.notice-close').addEventListener('click', hideNotice);
                noticeBoard.querySelector('.notice-confirm').addEventListener('click', hideNotice);
                mask.addEventListener('click', hideNotice);
                deletecookie('notice');
                setcookie('notice',latestid,114514,'/','luogu.com.cn',true);
            }
        });
    }
    function blockUser(uid,relationship){
        let csrf = document.querySelector("meta[name=csrf-token]").content;
        $.ajax({
            url: 'https://www.luogu.com.cn/api/user/updateRelationShip',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({uid:Number(uid),relationship:relationship}),
            cache: false,
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': csrf
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(res){
                hideMask();
                reloadmenu();
            },
            error: function(xhr,status,error){
                const responseText = xhr.responseText;
                let errorMsg = 'unknown';
                try {
                    const errorData = JSON.parse(responseText);
                    errorMsg = errorData.errorMessage;
                } catch (e) {
                    errorMsg=error||status||'network';
                }
                hideMask();
                if(errorMsg=='user.not_unrelated') swal("Better Luogu!","已拉黑/关注","error").then(()=>{location.reload()});
            }
        });
    }
    function badge() {
        swal.close();
        const existingModal = document.querySelector('.badge-settings-modal');
        if (existingModal) existingModal.remove();
        const defaultSettings = {
            text: '请输入文本',
            enabled: false,
            css: `background: rgb(254,76,97);color: #fff;padding: 3px 9px;border-radius: 999px;font-size: 15px;line-height: 1.2;display: inline-block;white-space: nowrap;font-weight: bold;margin-left: 2px;`
        };
        let badgeSettings = GM_getValue('badge_settings', defaultSettings);
        let badgeModal = document.createElement('div');
        badgeModal.className = 'badge-settings-modal';
        badgeModal.style.cssText = `position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: white;border-radius: 16px;box-shadow: 0 20px 40px rgba(0,0,0,0.15);z-index: 1001;width: 600px;max-width: 90vw;padding: 25px;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;display: none;`;
        badgeModal.innerHTML = `<div style="margin-bottom:20px"><h2 style="margin:0 0 20px 0;color:#2c3e50;font-weight:600">Badge 设置</h2><div class="setting-group" style="margin-bottom:20px"><label style="display:block;margin-bottom:8px;font-weight:500;color:#4a5568">Badge 文字</label><input type="text" id="badge-text" value="${badgeSettings.text}" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box" placeholder="输入 badge 显示的文字"></div><div class="setting-group" style="margin-bottom:20px"><label style="display:block;margin-bottom:8px;font-weight:500;color:#4a5568">CSS 样式</label><textarea id="badge-css" rows="6" spellcheck="false" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;font-family:Consolas, Monaco, 'Courier New', monospace;box-sizing:border-box;resize:vertical" placeholder="输入自定义 CSS 样式（支持 CSS 属性）">${badgeSettings.css.trim()}</textarea><div style="font-size:12px;color:#718096;margin-top:5px">提示：可以使用标准的 CSS 属性，如 background, color, padding, border-radius 等，<a href="https://www.luogu.me/paste/yboy8d6i">颜色对照表</a></div></div><div class="setting-group" style="margin-bottom:25px"><label style="display:flex;align-items:center;cursor:pointer"><input type="checkbox" id="badge-enabled" ${badgeSettings.enabled ? 'checked' : ''} style="margin-right:8px;width:16px;height:16px"><span style="font-weight:500;color:#4a5568">启用 Badge</span></label></div><div class="preview-section" style="margin-bottom:25px"><h3 style="margin:0 0 10px 0;font-size:16px;color:#4a5568">预览</h3><div style="background:#f7fafc;border-radius:8px;padding:15px"><div class="preview-content" style="display:flex;align-items:center;gap:8px"><span id="badge-preview" class="badge-preview">${badgeSettings.text}</span></div></div></div><div style="display:flex;gap:10px;justify-content:flex-end;border-top:1px solid #eaeaea;padding-top:20px"><button id="badge-reset" style="padding:10px 20px;border:1px solid #e2e8f0;border-radius:8px;background:#f7fafc;color:#4a5568;font-weight:500;cursor:pointer;transition:all 0.2s">重置为默认</button><button id="badge-cancel" style="padding:10px 20px;border:1px solid #e2e8f0;border-radius:8px;background:#f7fafc;color:#4a5568;font-weight:500;cursor:pointer;transition:all 0.2s">取消</button><button id="badge-save" style="padding:10px 20px;border:none;border-radius:8px;background:#3182ce;color:white;font-weight:500;cursor:pointer;transition:all 0.2s">保存设置</button></div></div>`;

        document.body.appendChild(badgeModal);
        badgeModal.style.display = 'block';
        showMask();
        let previewTimeout;
        let eventHandlers = {};
        function updatePreview() {
            const badgeTextInput = document.getElementById('badge-text');
            const badgeCssInput = document.getElementById('badge-css');
            const badgePreview = document.getElementById('badge-preview');
            const text = badgeTextInput.value || badgeSettings.text;
            const css = badgeCssInput.value || defaultSettings.css;
            badgePreview.textContent = text;
            badgePreview.style.cssText = css;
            badgePreview.style.display = 'inline-block';
            badgePreview.style.whiteSpace = 'nowrap';
        }
        function schedulePreviewUpdate() {
            clearTimeout(previewTimeout);
            previewTimeout = setTimeout(updatePreview, 200);
        }
        const badgeTextInput = document.getElementById('badge-text');
        const badgeCssInput = document.getElementById('badge-css');
        const badgeEnabledInput = document.getElementById('badge-enabled');

        eventHandlers.textInput = () => schedulePreviewUpdate();
        eventHandlers.cssInput = () => schedulePreviewUpdate();
        eventHandlers.enabledChange = () => schedulePreviewUpdate();

        badgeTextInput.addEventListener('input', eventHandlers.textInput);
        badgeCssInput.addEventListener('input', eventHandlers.cssInput);
        badgeEnabledInput.addEventListener('change', eventHandlers.enabledChange);

        updatePreview();

        const badgeSaveBtn = document.getElementById('badge-save');
        eventHandlers.saveClick = function() {
            const newSettings = {
                text: badgeTextInput.value || defaultSettings.text,
                css: badgeCssInput.value || defaultSettings.css,
                enabled: badgeEnabledInput.checked
            };

            GM_setValue('badge_settings', newSettings);

            swal({
                title: "保存成功",
                text: "Badge 设置已保存。刷新页面后生效。",
                icon: "success",
                buttons: {
                    cancel: "稍后刷新",
                    confirm: {
                        text: "立即刷新",
                        value: true
                    }
                }
            }).then((value) => {
                closeBadgeModal();
                if (value) {
                    location.reload();
                }
            });
        };
        badgeSaveBtn.addEventListener('click', eventHandlers.saveClick);

        const badgeCancelBtn = document.getElementById('badge-cancel');
        eventHandlers.cancelClick = function() { closeBadgeModal(); };
        badgeCancelBtn.addEventListener('click', eventHandlers.cancelClick);

        const badgeResetBtn = document.getElementById('badge-reset');
        eventHandlers.resetClick = function() {
            badgeTextInput.value = defaultSettings.text;
            badgeCssInput.value = defaultSettings.css;
            badgeEnabledInput.checked = defaultSettings.enabled;
            updatePreview();

            swal({
                title: "已重置",
                text: "设置已重置为默认值。",
                icon: "info",
                timer: 1500,
                buttons: false
            });
        };
        badgeResetBtn.addEventListener('click', eventHandlers.resetClick);

        eventHandlers.escKey = function(event) {
            if (event.key === 'Escape') closeBadgeModal();
        };
        document.addEventListener('keydown', eventHandlers.escKey);

        eventHandlers.maskClick = function() { closeBadgeModal(); };
        mask.addEventListener('click', eventHandlers.maskClick);

        function closeBadgeModal() {
            badgeTextInput.removeEventListener('input', eventHandlers.textInput);
            badgeCssInput.removeEventListener('input', eventHandlers.cssInput);
            badgeEnabledInput.removeEventListener('change', eventHandlers.enabledChange);
            badgeSaveBtn.removeEventListener('click', eventHandlers.saveClick);
            badgeCancelBtn.removeEventListener('click', eventHandlers.cancelClick);
            badgeResetBtn.removeEventListener('click', eventHandlers.resetClick);
            document.removeEventListener('keydown', eventHandlers.escKey);
            mask.removeEventListener('click', eventHandlers.maskClick);

            clearTimeout(previewTimeout);
            badgeModal.style.display = 'none';
            badgeModal.remove();
            hideMask();
        }
    }
    window.onload=function(){
        checkNotice();
        let button = document.createElement("a");
        button.innerHTML = '<button id="NLTB" style=\"background-color: rgb\(94,114,228\);border-radius: 7px;color: white;border: none;padding: 7px 12px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;border: none;box-shadow: 2px 3px 7px #000;\"><b>BETTER<b></button>';
        if(nowurl == 'https://www.luogu.com.cn/'||nowurl.includes('https://www.luogu.com.cn/chat')||nowurl.includes('https://www.luogu.com.cn/user/notification')){
            document.querySelector('#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.tiny > div.container > nav').insertAdjacentElement('beforebegin', button);

            const tb = document.getElementById("NLTB");

            tb.addEventListener('click', function(){
                swalcss.remove();
                swalcss.innerHTML=".swal-overlay {background-color: rgba(0, 0, 0, 0.5);}";
                document.head.appendChild(swalcss);
                swal("Better Luogu!","选择一个更改", {
                    buttons: {
                        update: {
                            text: "检查更新",
                            value: "update",
                        },
                        content: {
                            text: "版本内容",
                            value: "content"
                        },
                        engine: {
                            text: "搜索引擎",
                            value: "engine"
                        },
                        code: {
                            text: "缺省源",
                            value: "code"
                        },
                        badge: {
                            text: "badge",
                            value: "badge"
                        }
                    },
                }).then((value) => {
                    switch (value){
                        case "update":
                            checkUpdate();
                            break;
                        case "content":
                            update();
                            break;
                        case "engine":
                            engine();
                            break;
                        case "code":
                            code();
                            break;
                        case "badge":
                            badge();
                            break;
                    }
                });
            });
        }
        else if(!nowurl.includes('https://www.luogu.com.cn/ticket')){
            let usernav=document.getElementsByClassName('nav-search')[0];
            if(usernav==null) usernav=document.querySelector('#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.normal > div.header > div.user-nav > nav > div:nth-child(1)');
            usernav.insertAdjacentElement('beforebegin', button);
            const tb = document.getElementById("NLTB");

            tb.addEventListener('click', function(){window.location.href='https://blg.volatiles.dpdns.org/';});
        }
        else{
            let usernav=document.getElementsByClassName('avatar')[0];usernav.insertAdjacentElement('beforebegin', button);
            const tb = document.getElementById("NLTB");

            tb.addEventListener('click', function(){window.location.href='https://blg.volatiles.dpdns.org/';});
        }

        let nowuid=getcookie('uid');

        if(nowurl == 'https://www.luogu.com.cn/'){
            let uu=document.querySelector('#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div > h2 > a').href;
            let uuid='';
            for(let i=0;i<uu.length;i++){
                if(uu[i]>='0'&&uu[i]<='9') uuid+=uu[i];
            }
            console.log(uuid);
            if(uuid!='0') setcookie('uid',uuid,114514,'/','luogu.com.cn',true);
            $('input[name="user"]').keydown(function(e){
                if(e.which===13){
                    let searchusr=$('input[name="user"]').val();
                    $.get('https://www.luogu.com.cn/api/user/search?keyword=' + searchusr, {}, function (res) {
                        var users = res['users'];
                        if(users[0]!=null) window.open('https://www.luogu.com.cn/user/'+users[0]['uid'].toString(),'_self');
                    });
                }
            });
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
        else if(nowurl.includes('https://www.luogu.com.cn/chat')){
            let index=document;
            let once = true;
            let menu = document.createElement('button');
            menu.className = 'menu';
            menu.style.backgroundColor = 'transparent';
            menu.style.border = 'none';
            menu.style.float = 'right';
            menu.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path></svg>';
            if(nowurl.includes('?uid=')){
                once=false;
                document.querySelector('#app > div.main-container > main > div > div.card.wrapper.padding-none > div.main > div > div.top-container > div.title').appendChild(menu);
            }
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
                $.get('https://www.luogu.com.cn/api/user/search?keyword='+uid,{},function(res){
                    let userInfo = res['users'][0];
                    let avatar = userInfo.avatar;
                    let userType;
                    let userColor=lgColor(userInfo.color);

                    if(userInfo.isAdmin) userType='管理员';
                    else if(userInfo.isBanned) userType='封禁用户';
                    else userType='普通用户';

                    let customModal = document.createElement('div');
                    customModal.className = 'custom-modal';
                    customModal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.15);z-index:10001;width:400px;max-width:90vw;display:none;';
                    customModal.innerHTML = `<div style="padding:25px;text-align:center"><div style="margin-bottom:20px"><img src="${avatar}" style="width:80px;height:80px;border-radius:50%;border:3px solid ${userColor}"/></div><h3 style="margin:10px 0 5px;color:${userColor}">${chatuser}</h3><p style="color:#718096;margin:5px 0">UID: ${uid}</p><p style="color:#667eea;margin:5px 0 20px">${userType}</p><button class="clear-chat-btn" style="background:#e74c3c;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;width:100%">清空私信</button><br><br><button class="black-btn" style="background:#e74c3c;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;width:100%">拉黑</button></div>`;
                    document.body.appendChild(customModal);

                    customModal.style.display = 'block';
                    showMask();

                    document.querySelector('.clear-chat-btn').addEventListener('click', function(){
                        deleteChat(uid);
                        customModal.style.display = 'none';
                        hideMask();
                    });
                    document.querySelector('.black-btn').addEventListener('click',function(){
                        customModal.style.display = 'none';
                        blockUser(uid,2);
                    });

                    mask.addEventListener('click', function(){
                        customModal.style.display = 'none';
                        hideMask();
                    });
                });
            });

            let modalStyle = document.createElement('style');
            modalStyle.innerHTML = '.custom-modal{animation:modalFadeIn 0.3s ease}@keyframes modalFadeIn{from{opacity:0;transform:translate(-50%,-60%)}to{opacity:1;transform:translate(-50%,-50%)}}@media (prefers-color-scheme: dark){.custom-modal{background:rgba(45,55,72,0.95)}}';
            document.head.appendChild(modalStyle);
        }
        let isSearch = false;
        document.addEventListener('keydown', function(event){
            if(event.altKey && event.key == 's'){
                if(!isSearch){
                    search.style.display = 'flex';
                    showMask();
                    isSearch=true;
                }
                else{
                    search.style.display = 'none';
                    search_input.value='';
                    hideMask();
                    isSearch=false;
                }
            }
            if(event.keyCode===27){
                if(isSearch){
                    search.style.display = 'none';
                    search_input.value='';
                    hideMask();
                    isSearch=false;
                }
            }
        });
        mask.addEventListener('click',function(){
            search.style.display = 'none';
            search_input.value='';
            hideMask();
            isSearch=false;
        });

        $('input[name="search"]').keydown(function(e){
            if(e.which===13){
                let sc=$('input[name="search"]').val();
                if(sc!=""){
                    if(getcookie('engine')=='baidu') window.open('https://www.baidu.com/s?wd=' + sc,'_blank');
                    else if(getcookie('engine')=='google') window.open('https://google.com/search?q=' + sc,'_blank');
                    else if(getcookie('engine')=='bing') window.open('https://cn.bing.com/search?q=' + sc,'_blank');
                    else window.open(getcookie('engine')+'='+sc,'_blank');
                }
            }
        });
        if(nowurl.includes('https://www.luogu.com.cn/problem/')){
            let sfcode=getcookie('code');
            if(sfcode=="1"){
                let cgqsy=document.createElement('span');
                cgqsy.setAttribute('data-v-db920be0','');
                cgqsy.setAttribute('data-v-715ac623','');
                cgqsy.innerHTML='<span title="更改缺省源" data-v-db920be0=""><span data-v-715ac623="" data-v-db920be0-s="" class="v-popper--has-tooltip" style="cursor: pointer; margin-left: 0.3em;"><svg data-v-715ac623="" data-v-db920be0-s="" class="svg-inline--fa fa-gear" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="gear" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path class="" fill="currentColor" d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"></path></svg></span></span>';
                let codenav=document.getElementsByClassName('actions')[0];
                codenav.insertBefore(cgqsy,codenav.firstChild);
                cgqsy.addEventListener('click',function(){
                    let nowcode=document.getElementsByClassName('cm-content')[0].innerHTML;
                    localStorage.setItem('code', nowcode);
                    setcookie('code','0',1919810,'/','luogu.com.cn',true);
                    swal("Better Luogu!","更改成功","success");
                    cgqsy.remove();
                });
            }
            else{
                var flag1=true;
                setInterval(function(){
                    let t=document.getElementsByClassName('cm-content')[0];
                    let nowcode;
                    if(t!=null) nowcode=t.innerHTML;
                    if(nowcode=='<div class="cm-activeLine cm-line"><br></div>'&&flag1){
                        let incode=localStorage.getItem('code');
                        document.querySelector('#app > div.main-container > div > div.panel.panel-b > div > div.panel.panel-a > div:nth-child(2) > div > div > div.cm-scroller > div.cm-content.cm-lineWrapping').innerHTML=incode;
                        flag1=false;
                    }
                },1000);
            }
        }
        var toolflag=true;
        setInterval(function () {
            let toolbar=document.getElementsByClassName('cs-toolbar-group')[2];
            if(toolbar!=null){
                if(toolflag){
                    toolflag=false;
                    let zdk=document.createElement('span');
                    zdk.className='cs-toolbar-tool';
                    zdk.innerHTML='<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0H24V24H0z" fill="none"/><path d="M21 18v2H3v-2h18zM6.596 3.904L8.01 5.318 4.828 8.5l3.182 3.182-1.414 1.414L2 8.5l4.596-4.596zM21 11v2h-9v-2h9zm0-7v2h-9V4h9z"/></g></svg><span class="cs-tooltip">Callouts</span>';
                    toolbar.appendChild(zdk);
                    let epigraph=document.createElement('span');
                    epigraph.className='cs-toolbar-tool';
                    epigraph.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="none" height="24" viewBox="0 0 24 24" width="24"><path d="M22 18.0048C22 18.5544 21.5544 19 21.0048 19H12.9952C12.4456 19 12 18.5544 12 18.0048C12 17.4552 12.4456 17.0096 12.9952 17.0096H21.0048C21.5544 17.0096 22 17.4552 22 18.0048Z" fill="currentColor"/><path d="M22 12.0002C22 12.5499 21.5544 12.9954 21.0048 12.9954H2.99519C2.44556 12.9954 2 12.5499 2 12.0002C2 11.4506 2.44556 11.0051 2.99519 11.0051H21.0048C21.5544 11.0051 22 11.4506 22 12.0002Z" fill="currentColor"/><path d="M21.0048 6.99039C21.5544 6.99039 22 6.54482 22 5.99519C22 5.44556 21.5544 5 21.0048 5H8.99519C8.44556 5 8 5.44556 8 5.99519C8 6.54482 8.44556 6.99039 8.99519 6.99039H21.0048Z" fill="currentColor"/></svg><span class="cs-tooltip">epigraph</span>';
                    toolbar.appendChild(epigraph);
                    let center=document.createElement('span');
                    center.className='cs-toolbar-tool';
                    center.innerHTML='<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256"/><path d="M40,76H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Z"/><path d="M64,100a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16Z"/><path d="M216,140H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/><path d="M192,180H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16Z"/></svg><span class="cs-tooltip">居中</span>';
                    toolbar.appendChild(center);
                    let right=document.createElement('span');
                    right.className='cs-toolbar-tool';
                    right.innerHTML='<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M20 5C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5H20Z" fill="currentColor"/><path d="M20 9C20.5523 9 21 9.44772 21 10C21 10.5523 20.5523 11 20 11H12C11.4477 11 11 10.5523 11 10C11 9.44772 11.4477 9 12 9H20Z" fill="currentColor"/><path d="M21 14C21 13.4477 20.5523 13 20 13H4C3.44772 13 3 13.4477 3 14C3 14.5523 3.44772 15 4 15H20C20.5523 15 21 14.5523 21 14Z" fill="currentColor"/><path d="M20 17C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H12C11.4477 19 11 18.5523 11 18C11 17.4477 11.4477 17 12 17H20Z" fill="currentColor"/></svg><span class="cs-tooltip">居右</span>';
                    toolbar.appendChild(right);
                    let mb=document.querySelector('body > div.casket');
                    let p=document.createElement('div');
                    p.className='cs-dialog-container';
                    p.innerHTML='<div class="cs-dialog"><div class=""><div class="cs-dialog-header">插入Callouts<div class="cs-close-container"><svg class="svg-inline--fa fa-xmark cs-icon" aria-hidden="true" focusable="false" data-prefix="far" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path class="" fill="currentColor" d="M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l119 119L39 375c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l119-119L311 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-119-119L345 137z"></path></svg></div></div><div><div class="cs-dialog-item"><div class="cs-dialog-item-label">类型</div><select class="cs-dialog-item-content"><option value="info">info</option><option value="warning">warning</option><option value="success">success</option><option value="error">error</option></select></div><!----><div class="cs-dialog-submit-area"><button class="cs-dialog-button cs-dialog-button-info">开启自动打开</button><button class="cs-dialog-button cs-dialog-button-info">确认</button><button class="cs-dialog-button cs-dialog-button-info">取消</button></div></div></div><!----></div>';
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
            else toolflag=true;
        },1000);
        if(nowurl.includes('https://www.luogu.com.cn/article/mine')){
            const xpath = "//a[text()='编辑']";
            const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            const editLinks = [];
            for(let i=0;i<result.snapshotLength;i++) editLinks.push(result.snapshotItem(i));
            editLinks.forEach(link=>{link.target = '_blank';});
        }
        else if(nowurl.includes('https://www.luogu.com.cn/article/')&&nowurl.includes('/edit')){
            let rvpg=document.querySelector('#app > div.main-container > main > div > div > div > div.header > nav > ul > li:nth-child(2)');
            if(rvpg!=null){
                if(rvpg.innerText=='功能说明'){
                    let lid='';
                    for(let i=33;i<nowurl.length;i++){
                        if(nowurl[i]=='/') break;
                        lid+=nowurl[i];
                    }
                    getComment(lid,0);
                    rvpg.innerText='评论管理';
                    let flag=true;
                    setInterval(function(){
                        if(rvpg.classList.contains('selected')){
                            if(flag){
                                if(document.querySelector('#app > div.main-container > main > div > div > div > div.body > div > div')!=null){
                                    document.querySelector('#app > div.main-container > main > div > div > div > div.body > div > div').remove();
                                    document.querySelector('#app > div.main-container > main > div > div > div > div.body > div').appendChild(rvmg);
                                    flag=false;
                                }
                            }
                        }
                        else flag=true;
                    },1000);
                    document.addEventListener('click',function(e){
                        if(e.target&&e.target.id==='getmorerv'){
                            lastid=reviews[reviews.length-1].id;
                            getComment(lid,lastid);
                        }
                        else if(e.target&&e.target.classList.contains('btn-delete')){
                            let commentId=e.target.getAttribute('data-comment-id');
                            deleteComment(lid,commentId);
                        }
                        else if(e.target&&e.target.id==='batchDelete') chooseComment(lid);
                        else if(e.target&&e.target.id==='batchSelect'){
                            for(let i=0;i<reviews.length;i++) reviews[i].choose=1;
                            rvmghtml=`<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background-color: #f5f7fa; min-height: 100vh;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;"><h1 style="color: #2c3e50; margin: 0; font-weight: 600;">评论管理</h1><div><button id="batchSelect" style="background-color: #27ae60; color: white; border: none; padding: 10px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; font-weight: 500;">全选</button><button id="batchDelete"style="background-color: #e74c3c; color: white; border: none; padding: 10px 16px; border-radius: 4px; cursor: pointer; font-weight: 500;">批量删除</button></div></div><div id="batchActions"style="background-color: #3498db; color: white; padding: 12px 20px; border-radius: 6px; margin-bottom: 20px; display: none; align-items: center; justify-content: space-between;"><span id="selectedCount"style="font-weight: 500;">已选择<span style="color: #3498db; font-weight: 500;"id="slct"></span>条评论</span><div><button id="selectAll"style="background: transparent; color: white; border: 1px solid white; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 10px;">全选</button><button id="deselectAll"style="background: transparent; color: white; border: 1px solid white; padding: 6px 12px; border-radius: 4px; cursor: pointer;">取消选择</button></div></div><div style="background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden;"><div style="display: flex; background-color: #f8f9fa; padding: 15px 20px; border-bottom: 1px solid #eaecef; font-weight: 600; color: #495057;"><div style="width: 50px; text-align: center;">选择</div><div style="width: 80px;">编号</div><div style="width: 150px;">用户名</div><div style="flex: 1;">评论内容</div><div style="width: 120px; text-align: center;">操作</div></div>`;
                            reviews.forEach((review,index)=>{
                                rvmghtml+=`<div class="comment-item"style="display: flex; padding: 18px 20px; border-bottom: 1px solid #f1f3f4; align-items: flex-start; transition: background-color 0.2s;"><div style="width: 50px; text-align: center; padding-top: 3px;"><input type="checkbox"class="comment-checkbox"style="cursor: pointer; width: 18px; height: 18px;"${(review.choose?'checked':'')} data-comment-id="${review.id}"></div><div style="width: 80px; color: #6c757d; font-weight: 500;">${review.id}</div><div style="width: 150px;"><div style="font-weight: 500; color: #2c3e50;"><a href="https://www.luogu.com.cn/user/${review.uid}">${review.user}</a></div></div><div style="flex: 1; color: #34495e; line-height: 1.5; word-wrap: break-word; max-width: 600px;">${review.content}</div><div style="width: 120px; text-align: right;"><button class="btn-delete"style="background-color: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; " data-comment-id="${review.id}">删除</button></div></div>`;
                            });
                            _rvmg=rvmghtml+`</div><div style="text-align: center; margin: 25px 0;">${(reviews.length%20==0&&reviews.length?`<button style="background-color: #3498db; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-size: 15px; font-weight: 500; transition: background-color 0.3s;" id="getmorerv">加载更多</button>`:``)}</div><div style="display: flex; justify-content: space-between; margin-top: 20px; color: #7f8c8d; font-size: 14px;"><div>已获取<span style="color: #3498db; font-weight: 500;"id="rvct">${reviews.length}</span>条评论</div></div></div>`;
                            rvmg.innerHTML=_rvmg;
                        }
                    });
                }
            }
        }
        else if(nowurl.includes('https://www.luogu.com.cn/user/')&&!nowurl.includes('https://www.luogu.com.cn/user/notification')&&!nowurl.includes('https://www.luogu.com.cn/user/setting')){
            let userUid='';
            for(let i=0;i<nowurl.length;i++){
                if(nowurl[i]>='0'&&nowurl[i]<='9') userUid+=nowurl[i];
                else if(userUid) break;
            }
            $.get('https://www.luogu.com.cn/api/user/info/'+userUid,{},function(res){
                let isAdmin=res['user'].isAdmin;
                let verified=res['user'].verified;
                if(!isAdmin&&!verified){
                    let it=res['user'].introduction;
                    let introduction=marked.parse(it);
                    let jsCard=document.createElement('div');
                    jsCard.setAttribute('data-v-c3407962','');
                    jsCard.setAttribute('data-v-f4fefeb2','');
                    jsCard.setAttribute('data-v-754e1ea4-s','');
                    jsCard.className='l-card';
                    jsCard.innerHTML=`<div data-v-f4fefeb2="" class="header"><h3 data-v-f4fefeb2="" style="margin: 0px;">个人介绍（仅Better Luogu!可见）</h3><span data-v-f4fefeb2="" class="edit-button"><!----><button data-v-505b6a97="" data-v-f4fefeb2="" class="lform-size-small" type="button">复制<!----></button></span></div><br><div data-v-f4fefeb2="" class="lfe-marked-wrap introduction">${introduction}<div class="lfe-marked"></div></div>`;
                    let flag=1;
                    let main=document.querySelector('#app > div.main-container.lside-nav > main > div > div.l-card > div.user-header-bottom > div.menu > ul > li:nth-child(1) > span');
                    setInterval(function(){
                        if(main.classList.contains('selected')){
                            if(flag){
                                document.querySelector('#app > div.main-container.lside-nav > main > div > div.sidebar-container.reverse > div.main > div:nth-child(1)').insertAdjacentElement('beforebegin', jsCard);
                                if (typeof katex !== 'undefined') {
                                    renderMathInElement(document.body, {
                                        delimiters: [
                                            {left: "$$", right: "$$", display: true},
                                            {left: "$", right: "$", display: false},
                                            {left: "\\(", right: "\\)", display: false},
                                            {left: "\\[", right: "\\]", display: true}
                                        ],
                                        throwOnError: false
                                    });
                                }
                            }
                            flag=0;
                            let copyit=document.querySelector('#app > div.main-container.lside-nav > main > div > div.sidebar-container.reverse > div.main > div:nth-child(1) > div.header > span > button');
                            copyit.addEventListener('click',function(){GM_setClipboard(it);swal({title: "Better Luogu!",text: "用户信息已复制到剪贴板",icon: "success",topLayer: true});});
                        }
                        else flag=1;
                        if(document.querySelector('#app > div.main-container.lside-nav > main > div > div.l-card > div.user-header-bottom > div.menu > ul > li:nth-child(8)')!=null) jsCard.remove();
                    },1000);
                }
            });
        }
        else if(nowurl.includes('https://www.luogu.com.cn/contest/')&&!nowurl.includes('https://www.luogu.com.cn/contest/list')){
            let contestId='';
            for(let i=0;i<nowurl.length;i++){
                if(nowurl[i]>='0'&&nowurl[i]<='9') contestId+=nowurl[i];
                else if(contestId) break;
            }
            let cid=Number(contestId);
            let contest_search=document.createElement('div');
            contest_search.innerHTML='<div class="contest-search-box-btlg"><input class="contest-search-input-btlg" type="text" placeholder="输入uid/用户名" name="search-user"><svg class="contest-search-icon-btlg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></div><br>';
            let contest_search_input = contest_search.querySelector('.contest-search-input-btlg');
            let contest_search_icon = contest_search.querySelector('.contest-search-icon-btlg');

            function displayUserInfoModal(userData, rank) {
                let user = userData.user;
                let score = userData.score;
                let runningTime = userData.runningTime;
                let details = userData.details;

                let minutes = Math.floor(runningTime / 60000);
                let seconds = Math.floor((runningTime % 60000) / 1000);
                let timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                let modal = document.createElement('div');
                modal.className = 'custom-modal';
                modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.15);z-index:1000;width:500px;max-width:95vw;display:none;';

                let modalContent = `<div style="padding:25px;text-align:center"><div style="margin-bottom:20px"><img src="${user.avatar}" style="width:80px;height:80px;border-radius:50%;border:3px solid ${lgColor(user.color)}"/></div><h3 style="margin:10px 0 5px;color:${lgColor(user.color)}">${user.name}</h3><p style="color:#718096;margin:5px 0">UID: ${user.uid}</p><p style="color:#667eea;margin:5px 0 20px">排名: ${rank}</p><div style="background:#f7fafc;border-radius:8px;padding:15px;margin:15px 0;"><div style="display:flex;justify-content:space-around;margin-bottom:10px;"><div style="text-align:center;"><div style="font-size:20px;font-weight:bold;color:#2d3748;">${score}</div><div style="font-size:12px;color:#718096;">总分</div></div><div style="text-align:center;"><div style="font-size:20px;font-weight:bold;color:#2d3748;">${timeStr}</div><div style="font-size:12px;color:#718096;">总用时</div></div></div></div>`;

                if(Object.keys(details).length > 0) {
                    modalContent += `<div style="text-align:left;margin-top:15px;"><h4 style="margin:0 0 10px;color:#2c3e50;font-size:14px;font-weight:600;">题目得分详情</h4><div style="max-height:200px;overflow-y:auto;font-size:13px;">`;

                    let problemIds = Object.keys(details);

                    problemIds.sort((a, b) => {
                        let numA = parseInt(a.replace(/\D/g, '')) || 0;
                        let numB = parseInt(b.replace(/\D/g, '')) || 0;
                        return numA - numB;
                    });
                    for(let problemId of problemIds) {
                        let problem = details[problemId];
                        let problemTimeDisplay = '';
                        if (problem.score > 0) {
                            let problemTimeMinutes = Math.floor(problem.runningTime / 60000);
                            let problemTimeSeconds = Math.floor((problem.runningTime % 60000) / 1000);
                            problemTimeDisplay = `${problemTimeMinutes}:${problemTimeSeconds.toString().padStart(2, '0')}`;
                        }
                        modalContent += `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f3f4;"><span style="font-weight:500;">${problemId}</span><div style="display:flex;gap:15px;"><span style="color:${problem.score > 0 ? '#27ae60' : '#e74c3c'}">${problem.score}分</span><span style="color:#718096;">${problemTimeDisplay}</span></div></div>`;
                    }

                    modalContent += `</div></div>`;
                }
                modalContent += `<div style="display:flex;gap:10px;margin-top:25px;"><a href="https://www.luogu.com.cn/user/${user.uid}" target="_blank" style="flex:1;background:#667eea;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;text-decoration:none;text-align:center;">查看主页</a><button id="copyUserInfoBtn" style="flex:1;background:#edf2f7;color:#2d3748;border:1px solid #e2e8f0;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;">复制信息</button></div></div>`;
                modal.innerHTML = modalContent;
                document.body.appendChild(modal);

                modal.style.display = 'block';
                showMask();

                document.getElementById('copyUserInfoBtn').addEventListener('click', function() {
                    let userInfo = `用户: ${user.name} (UID: ${user.uid})\n排名: ${rank}\n总分: ${score}\n总用时: ${timeStr}`;

                    if(Object.keys(details).length > 0) {
                        userInfo += `\n\n题目得分:\n`;

                        let problemIds = Object.keys(details);
                        problemIds.sort((a, b) => {
                            let numA = parseInt(a.replace(/\D/g, '')) || 0;
                            let numB = parseInt(b.replace(/\D/g, '')) || 0;
                            return numA - numB;
                        });

                        for(let problemId of problemIds) {
                            let problem = details[problemId];
                            let problemTimeDisplay = '';
                            if (problem.score > 0) {
                                let problemTimeMinutes = Math.floor(problem.runningTime / 60000);
                                let problemTimeSeconds = Math.floor((problem.runningTime % 60000) / 1000);
                                problemTimeDisplay = `${problemTimeMinutes}:${problemTimeSeconds.toString().padStart(2, '0')}`;
                            }
                            userInfo += `${problemId}: ${problem.score}分 (${problemTimeDisplay})\n`;
                        }
                    }

                    GM_setClipboard(userInfo);
                    swal({title: "Better Luogu!",
                          text: "用户信息已复制到剪贴板",
                          icon: "success",
                          topLayer: true});
                });
                mask.addEventListener('click', function() {
                    modal.style.display = 'none';
                    hideMask();
                    modal.remove();
                });
            }

            function contestFindUser() {
                let searchusr = contest_search_input.value.trim();
                if(!searchusr) return;

                let isUid = /^\d+$/.test(searchusr);
                let searchValue = isUid ? Number(searchusr) : searchusr;
                let searchFinished = false;

                swal({ title: "Better Luogu!", text: "正在并发查找用户，请稍候...", icon: "info", buttons: false, closeOnClickOutside: false, closeOnEsc: false });

                $.get(`https://www.luogu.com.cn/fe/api/contest/scoreboard/${cid}`, {}, function(firstRes) {
                    let totalCount = firstRes.scoreboard.count;
                    let perPage = firstRes.scoreboard.perPage || 50;
                    let totalPages = Math.ceil(totalCount / perPage);

                    let foundInFirstPage = findUserInPage(firstRes.scoreboard.result, searchValue, isUid);
                    if(foundInFirstPage) {
                        swal.close();
                        displayUserInfoModal(foundInFirstPage.user, foundInFirstPage.index + 1);
                        return;
                    }

                    let pagePromises = [];
                    let concurrencyLimit = 5;
                    let foundUserResult = null;

                    function fetchPage(pageNum) {
                        return $.get(`https://www.luogu.com.cn/fe/api/contest/scoreboard/${cid}?page=${pageNum}`, {});
                    }

                    async function batchFetchPages(startPage, batchSize) {
                        for(let i = startPage; i <= totalPages && i < startPage + batchSize; i++) {
                            if(searchFinished) return;
                            pagePromises.push(
                                fetchPage(i).then(function(pageRes) {
                                    if(searchFinished) return;
                                    let found = findUserInPage(pageRes.scoreboard.result, searchValue, isUid);
                                    if(found && !searchFinished) {
                                        searchFinished = true;
                                        foundUserResult = {
                                            user: found.user,
                                            rank: (i - 1) * perPage + found.index + 1,
                                            page: i
                                        };
                                    }
                                })
                            );
                        }
                        await Promise.allSettled(pagePromises);

                        if(foundUserResult) {
                            swal.close();
                            displayUserInfoModal(foundUserResult.user, foundUserResult.rank);
                            return true;
                        }
                        return false;
                    }

                    (async function parallelSearch() {
                        for(let startPage = 2; startPage <= totalPages; startPage += concurrencyLimit) {
                            if(searchFinished) break;
                            let found = await batchFetchPages(startPage, concurrencyLimit);
                            if(found) return;
                        }

                        if(!searchFinished) {
                            swal.close();
                            swal("Better Luogu!", "未找到该用户", "error");
                        }
                    })();
                }).fail(function() {
                    swal.close();
                    swal("Better Luogu!", "获取比赛信息失败", "error");
                });
            }
            function findUserInPage(users, searchValue, isUid) {
                for(let i = 0; i < users.length; i++) {
                    let user = users[i].user;
                    if(isUid) {
                        if(user.uid === searchValue) {
                            return {user: users[i], index: i};
                        }
                    } else {
                        if(user.name.toLowerCase().includes(searchValue.toLowerCase())) {
                            return {user: users[i], index: i};
                        }
                    }
                }
                return null;
            }

            contest_search_input.addEventListener('keydown',function(e){
                if(e.keyCode === 13 || e.which === 13) contestFindUser();
            });
            contest_search_icon.addEventListener('click', function(){contestFindUser();});

            let flag=1;
            setInterval(function(){
                if(document.querySelector('#app > div.main-container > main > div > div.card.padding-none > div > ul > li:nth-child(3) > span').classList.contains('selected')){
                    if(flag) document.querySelector('#app > div.main-container > main > div > div.card.padding-default > div').insertAdjacentElement('beforebegin', contest_search);
                    flag=0;
                }
                else flag=1;
            },1000);
        }
        let userCard=document.querySelector('.header[data-v-1a591deb]');
        if(userCard!=null){
            $.get('https://www.luogu.com.cn/api/user/info/' + useruid, {}, function(res) {
                let follow = res['user'].followingCount || 0;
                let fans = res['user'].followerCount || 0;
                let ccfLevel = res['user']['rating']?.['user']?.ccfLevel || '未评级';
                let ranking = res['user'].ranking || '未上榜';
                let ccf = 'CCF 评级：' + ccfLevel;
                let rankingText = '咕值排行：' + ranking;

                const cr = document.createElement('span');
                cr.className = 'ccf-info';
                cr.textContent = `${ccf}|${rankingText}`;

                const f = document.createElement('div');
                f.className = 'follow-fans-info';

                const fl = document.createElement('a');
                fl.href = 'https://www.luogu.com.cn/user/' + useruid + '/following';
                const flLabel = document.createElement('span');
                flLabel.className = 'label';
                flLabel.textContent = '关注';
                const flNum = document.createElement('span');
                flNum.className = 'num';
                flNum.textContent = follow;
                fl.appendChild(flNum);
                fl.appendChild(flLabel);

                const fs = document.createElement('a');
                fs.href = 'https://www.luogu.com.cn/user/' + useruid + '/follower';
                const fsLabel = document.createElement('span');
                fsLabel.className = 'label';
                fsLabel.textContent = '粉丝';
                const fsNum = document.createElement('span');
                fsNum.className = 'num';
                fsNum.textContent = fans;
                fs.appendChild(fsNum);
                fs.appendChild(fsLabel);

                const fd = document.createElement('a');
                fd.href = 'https://www.luogu.com.cn/user/' + useruid + '/activity';
                const fdLabel = document.createElement('span');
                fdLabel.className = 'label';
                fdLabel.textContent = '动态';
                const fdNum = document.createElement('span');
                fdNum.className = 'num';
                fdNum.textContent = '加载中...';
                fd.appendChild(fdNum);
                fd.appendChild(fdLabel);

                f.appendChild(fl);
                f.appendChild(fs);
                f.appendChild(fd);
                userCard.appendChild(cr);
                userCard.appendChild(f);

                $.get('https://www.luogu.com.cn/api/feed/list?user=' + useruid, {}, function(feedRes) {
                    let feedCount = feedRes['feeds']?.count || 0;
                    fdNum.textContent = feedCount;
                }).fail(function() {
                    fdNum.textContent = 'null';
                });
            });
        }
        if(!nowurl.includes('https://www.luogu.com.cn/ticket')) addBadge();
    }
    let jumpFlag=1;
    setInterval(function(){
        if(document.querySelector('head > title').innerText=='安全访问中心 - 洛谷'){
            if(jumpFlag){
                let url=document.getElementById('url').innerText;
                let nurl=url.replace(".com",".me");
                document.querySelector('body > div:nth-child(1) > div > p:nth-child(5) > a').href=nurl;
                document.querySelector('#url').innerText=nurl;
                jumpFlag=0;
            }
        }
        else jumpFlag=1;
    },1000);
})();
