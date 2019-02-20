/**
 * Created by zhangqi on 16/10/12.
 */
var iflytek = (function(document){
	

    
    // 给input添加语音按钮
    // var htmlBnt = '<span id="speech_span" style="display:inline-block;width:30px;height:30px;position:fixed; z-index:100;cursor: pointer; left:50%; bottom:10px;">'
    // 	+'<a type="button" data-target="#speech_input" data-toggle="modal" class="speech_icon"><i class="fa fa-microphone" style="font-size: 30px"></i></a></span>';
    //var htmlBnt = '<span id="speech_span" style="display:inline-block;width:30px;height:30px;position:fixed; z-index:100;cursor: pointer; left:50%; bottom:10px;">'
    //    +'<a type="button" id="micphoneElement" class="speech_icon"><i class="fa fa-microphone" style="font-size: 30px"></i></a></span>';
    
    //$("#userInputArea").after(htmlBnt);

    //$("#speech_span").after(speechStr);

    // $(".speech").each(function(index,item){
    //     $(this).after(htmlBnt);
    //     if(index == 0){
    //         $("#speech_span").after(speechStr);	
    //      }
    //   });
    
    var tip = document.getElementById('a');
    var volumeTip = document.getElementById('volume');
    volumeTip.width = parseFloat(window.getComputedStyle(tip, null).width) -100;
    var volumeWrapper = document.getElementById('canvas_wrapper');
    var oldText = tip.innerHTML;
    /* 标识麦克风按钮状态，按下状态值为true，否则为false */
    var mic_pressed = false;
    var volumeEvent = (function () {
        var lastVolume = 0;
        var eventId = 0;
        var canvas = volumeTip,
            cwidth = canvas.width,
            cheight = canvas.height;
        var ctx = canvas.getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, cwidth, 0);
        var animationId;
        gradient.addColorStop(1, 'red');
        gradient.addColorStop(0.8, 'yellow');
        gradient.addColorStop(0.5, '#9ec5f5');
        gradient.addColorStop(0, '#c1f1c5');

        volumeWrapper.style.display = "none";

        var listen = function(volume){
            lastVolume = volume;
        };
        var draw = function(){
            if(volumeWrapper.style.display == "none"){
                cancelAnimationFrame(animationId);
            }
            ctx.clearRect(0, 0, cwidth, cheight);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1 + lastVolume*cwidth/30, cheight);
            animationId = requestAnimationFrame(draw);
        };
        var start = function(){
            animationId = requestAnimationFrame(draw);
            volumeWrapper.style.display = "block";
        };
        var stop = function(){
            clearInterval(eventId);
            volumeWrapper.style.display = "none";
        };
        return {
            "listen":listen,
            "start":start,
            "stop":stop
        };
    })();
    /***********************************************local Variables**********************************************************/

    var conversationWithWatsonAPI = function(words, callback) {

        //Send Request To Watson

        $.ajax({
            //url: 'https://iot-bb-conversation-v10.eu-gb.mybluemix.net/bookingroom',
            url:'/IOT/'+'RTC',
            type:'post',
            data:{
                "text":words
                // ,
                // from:('zh'),
                // to:('en'),
                // appid:('20170320000042676'),
                // salt:('1357924680'),
                // sign:(md5(signStr))
            },
            dataType:'json',
            //timeout:30000,
            success:function(data){

                if(data) {

                    if(callback) {
                        callback(data);
                    }

                    //$("#"+curInputId).val(data.trans_result.dst);
                    //console.info(data.trans_result[0]);
                    //$("#iat_result1").val(data.trans_result[0].dst);

                    //Send Request To Watson
                    

                }
                
                //resule = data.trans_result[0].dst;
                //alert(data.trans_result[0].dst);
                //$('#res').html(resule);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                alert("连接服务器超时...无法更新数据");
            },
            complete:function(XMLHttpRequest, textStatus){
                    working = false;
                    $('#sub').val("翻译");
            }
        });

    }


    var baiduTranslateFun = function(from, to, words, callback) {

        var signStr = "20170320000042676"+words+"1357924680"+"2e9wqKfNIJhWjikxt2WI";

        $.ajax({
            url:'http://api.fanyi.baidu.com/api/trans/vip/translate',
            type:'get',
            data:{
                q:(words),
                from:(from),
                to:(to),
                appid:('20170320000042676'),
                salt:('1357924680'),
                sign:(md5(signStr))
            },
            dataType:'jsonp',
            //timeout:30000,
            success:function(data){
                if(data && data.trans_result) {
                    //$("#"+curInputId).val(data.trans_result.dst);
                    //console.info(data.trans_result[0]);
                    var distResultStr = data.trans_result[0].dst;
                    //$("#iat_result1").val(distEnglistStr);
                    if(callback) {
                        callback(distResultStr);
                    }

                }
                
                //resule = data.trans_result[0].dst;
                //alert(data.trans_result[0].dst);
                //$('#res').html(resule);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                alert("连接服务器超时...无法更新数据");
            },
            complete:function(XMLHttpRequest, textStatus){
                    working = false;
                    $('#sub').val("翻译");
            }
        });

    }


    var returnResultByWatsonSay = function(words) {

        var watsonResWords = words;

        baiduTranslateFun('en','zh',watsonResWords,function(result) {
            var watsonWords = result;
            var postTime = new Date().format("hh:mm:ss");
            var data = {
                watsonWords:watsonWords,
                postTime:postTime
            };
            var watsonWordsHtml = template('otherChatTmpl', data);
            //document.getElementById('content').innerHTML = html;
            //var watsonWordsHtml = $("#otherChatTmpl").html().replaceAll("{{WORDS}}",watsonWords).replaceAll("{{TIME}}",postTime);
            //$("#coversationList").append("<li><b>我:</b>"+result+"</li>");
            //
            $("#wastonChatList").append(watsonWordsHtml);
            $("#lastTime").html(postTime);
            scrollToBottom();
            // console.info(result);
            // $("#coversationList").append("<li><b>Watson:</b>"+result+"</li>");
            playTTS(result, 'aisxping');
        });

    }


    //Scroll to bottom
    var scrollToBottom = function() {
        $('html, body').animate({  
            scrollTop: 99999  
        }, 1200);  
    }

    
    //Get Data from WEX API

    /**
    http://9.111.97.226:8393/api/v10/search?collection=col_25061&&enableHref=true&query=RTC 升级 4.0 linux&output=application/xml
    **/

    var tmpKeywords, tmpTotal, tmpArticleList;
    var getContentFromWex = function(searchComb) {
        //清空搜索结果
        tmpKeywords="";
        tmpTotal=0;
        tmpArticleList=[];

        openHelpPage();

        var pageLoading = '<div class="text-center pageLoading"><div><img src="../images/animal.gif"/></div><div>正在努力加载中...</div></div>';

        $("#wexDocsListContent").html(pageLoading);

        var searchArr = searchComb.split("-");

        startToAjaxWex(searchArr[0], function() {
            startToAjaxWex(searchArr[1], function() {
                
                console.info(tmpArticleList);
                var wexData = {
                    keywords: tmpKeywords,
                    total: tmpTotal,
                    list:tmpArticleList
                };
                var wexContentList = template('wexResultTmpl', wexData);
                $("#wexDocsListContent").html(wexContentList);

                resetContentHeight();

            })
        })

        /*
        if(data.es_apiResponse && data.es_apiResponse.es_result) {
            var wexData = {
                keywords: data.es_apiResponse.es_query[0].searchTerms,
                total: data.es_apiResponse.es_totalResults,
                list:data.es_apiResponse.es_result
            };
            var wexContentList = template('wexResultTmpl', wexData);
            $("#wexDocsListContent").html(wexContentList);

            resetContentHeight();
        } else {
            var wexData = {
                keywords: data.es_apiResponse.es_query[0].searchTerms,
                total: data.es_apiResponse.es_totalResults,
                list:[]
            };
            var wexContentList = template('wexResultTmpl', wexData);
            $("#wexDocsListContent").html(wexContentList);
        }
        */
        

    }


    var startToAjaxWex = function(searchText, callback) {
        $.ajax({
            url:'http://9.111.97.226:8393/api/v10/search',
            type:'get',
            data:{
                collection:"col_25061",
                enableHref:true,
                query:(searchText),
                output:"application/javascript"
            },
            dataType:'jsonp',
            //timeout:30000,
            success:function(data){
                
                console.info("WEX SAY:");
                console.info(data);

                if(data.es_apiResponse.es_result && data.es_apiResponse.es_result.length == 1) {
                    tmpArticleList = tmpArticleList.push(data.es_apiResponse.es_result);
                } 
                if(data.es_apiResponse.es_result && data.es_apiResponse.es_result.length > 1) {
                    tmpArticleList = tmpArticleList.concat(data.es_apiResponse.es_result);
                }

                tmpTotal+=parseInt(data.es_apiResponse.es_totalResults);
                tmpKeywords+=data.es_apiResponse.es_query[0].searchTerms+","

                if(callback) {
                    callback();
                }
                
                //resule = data.trans_result[0].dst;
                //alert(data.trans_result[0].dst);
                //$('#res').html(resule);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                alert("连接WEX服务器超时...无法获取数据");
            },
            complete:function(XMLHttpRequest, textStatus){
                console.info("WEX COMPLETE");
            }
        });
    }


    //General Show Right Info
    var showCententBySmartTips = function(tmplId, tmplData) {

        openHelpPage();

        var smartContentInfo = template(tmplId, tmplData);
        $("#wexDocsListContent").html(smartContentInfo);

        resetContentHeight();

    }
    

    /**
     * 初始化Session会话
     */
    var session = new IFlyIatSession({
        "callback":{
            "onResult": function (err, result) {
                /* 若回调的err为空或错误码为0，则会话成功，可提取识别结果进行显示*/
                if (err == null || err == undefined || err == 0) {
                    if (result == '' || result == null)
                    	$("#"+curInputId).val("没有获取到识别结果") ;
                    else
                    	//$("#"+curInputId).val(result);
                        
                        if(result) {
                            result = result.substr(0, result.length-1);
                        }

                        if($.trim(result) == "") {
                            tip.innerHTML = "倾听中...(声音过小)";
                            //return;
                        }

                        var selfWords = result;
                        var postTime = new Date().format("hh:mm:ss");
                        var data = {
                            selfWords:selfWords,
                            postTime:postTime
                        };
                        var selfWordsHtml = template('selfChatTmpl', data);
                        //var selfWordsHtml = $("#selfChatTmpl").html().replaceAll("{{WORDS}}",selfWords).replaceAll("{{TIME}}",postTime);
                        //$("#coversationList").append("<li><b>我:</b>"+result+"</li>");
                        //
                        if($.trim(result) != "") {
                            $("#wastonChatList").append(selfWordsHtml);
                            scrollToBottom();
                        }
                        

                        $("#userInputArea").val(result);

                        baiduTranslateFun('zh','en',result, function(resultWords) {
                            
                            console.info("resultWords:"+resultWords);
                            conversationWithWatsonAPI(resultWords, function(watsonResData) {

                                console.info("This is the complex logic");
                                console.info(watsonResData);
                                var data = watsonResData;
                                var wastonWords = data.text[0];
                                if(data.isfinish) {
                                    //Conversation is finish, Show URL
                                    returnResultByWatsonSay(wastonWords);

                                    var entities = data.entities;

                                    var searchTextEN = "";
                                    var searchTextCN = "";

   

                                    for(var i=0; i<entities.length; i++) {
                                        if(entities[i].value.split(",").length>1) {
                                            searchTextEN+=(" "+entities[i].value.split(",")[0]);
                                            searchTextCN+=(" "+entities[i].value.split(",")[1]);
                                        } else {
                                            searchTextEN+=(" "+entities[i].value.split(",")[0]);
                                            searchTextCN+=(" "+entities[i].value.split(",")[0]);
                                        }
                                        
                                    }


                                    if(data.type == "upgrade") { 
                                        //searchTextEN += " upgrade ";
                                        //searchTextCN+= " 升级 ";
                                        if(!data.curVersion) {
                                            data.curVersion = 4;
                                        }
                                        if(data.curVersion == 4 && data.targetVersion == 5) {
                                            if(data.osVersion == "linux") {
                                                showCententBySmartTips("rtcUpdateExtenstionTmpl",rtcUpdate4_5_linux);
                                            } else {
                                                showCententBySmartTips("rtcUpdateExtenstionTmpl",rtcUpdate4_5_windows);
                                            }
                                        } else if(data.curVersion == 5 && data.targetVersion == 6) {
                                            if(data.osVersion == "linux") {
                                                showCententBySmartTips("rtcUpdateExtenstionTmpl",rtcUpdate5_6_linux);
                                            } else {
                                                showCententBySmartTips("rtcUpdateExtenstionTmpl",rtcUpdate5_6_windows);
                                            }
                                            
                                        } else if(data.curVersion == 4 && data.targetVersion == 6) {
                                            if(data.osVersion == "linux") {
                                                showCententBySmartTips("rtcUpdateExtenstionTmpl",rtcUpdate4_6_linux);
                                            } else {
                                                showCententBySmartTips("rtcUpdateExtenstionTmpl",rtcUpdate4_6_windows);
                                            }
                                            
                                        } else {
                                            searchTextEN += " upgrade ";
                                            searchTextCN+= " 升级 ";
                                            var searchComb = searchTextEN + "-" + searchTextCN;
                                            getContentFromWex(searchComb);

                                        }

                                    }

                                    if(data.type == "extension") {
                                        //searchTextEN += " extension ";
                                        //searchTextCN+= " 扩展 ";
                                        showCententBySmartTips("rtcUpdateExtenstionTmpl",rtcExtensionInfo);
                                    }

                                    //General Task like reset password
                                    if(data.type == "general") {
                                        
                                        //Reset Password
                                        if(searchTextEN.indexOf("reset")>=0 && searchTextEN.indexOf("password")>=0) {
                                            showCententBySmartTips("resetPasswordTmpl",{
                                                keywords:"重置密码",
                                                total:1,
                                                url:data.url
                                            });
                                        }


                                    }

                                    //If the type is search, need to search from wex
                                    if(data.type == "search") {

                                        var searchComb = searchTextEN + "-" + searchTextCN;

                                        getContentFromWex(searchComb);

                                    }
                                        


                                } else {
                                    //What type it is? upgrade,extension,general
                                    
                                    returnResultByWatsonSay(wastonWords);

                                    
                                }

                                



                            });
                        });

                        

                    /* 若回调的err不为空且错误码不为0，则会话失败，可提取错误码 */
                } else {
                	$("#"+curInputId).val('error code : ' + err + ", error description : " + result);
                }
                mic_pressed = false;
                volumeEvent.stop();
            },
            "onVolume": function (volume) {
                volumeEvent.listen(volume);
            },
            "onError":function(){
                mic_pressed = false;
                volumeEvent.stop();
            },
            "onProcess":function(status){
                switch (status){
                    case 'onStart':
                        tip.innerHTML = "服务初始化...";
                        break;
                    case 'normalVolume':
                    case 'started':
                        tip.innerHTML = "倾听中...";
                        break;
                    case 'onStop':
                        tip.innerHTML = "等待结果...";
                        break;
                    case 'onEnd':
                        tip.innerHTML = oldText;
                        break;
                    case 'lowVolume':
                        tip.innerHTML = "倾听中...(声音过小)";
                        break;
                    default:
                        tip.innerHTML = status;
                }
            }
        }
    });

    if(!session.isSupport()){
        tip.innerHTML = "当前浏览器不支持！";
        return;
    }

    var play = function() {
        if (!mic_pressed) {
            var ssb_param = {
                "grammar_list": null,
                "params": "appid=58bd2c89,appidkey=d43cdcf919a0fdbd, lang = sms, acous = anhui, aue=speex-wb;-1, usr = mkchen, ssm = 1, sub = iat, net_type = wifi, rse = utf8, ent =sms16k, rst = plain, auf  = audio/L16;rate=16000, vad_enable = 1, vad_timeout = 5000, vad_speech_tail = 500, compress = igzip"
            };
            $("#"+curInputId).val("");
            /* 调用开始录音接口，通过function(volume)和function(err, obj)回调音量和识别结果 */
            session.start(ssb_param);
            mic_pressed = true;
            volumeEvent.start();
        }
        else {
            //停止麦克风录音，仍会返回已传录音的识别结果.
            session.stop();
        }
    }

    /**
     * 取消本次会话识别
     */
    var cancel = function() {
        session.cancel();
    }   
  
    // 添加语音点击事件 
    var curInputId;
    $(".speech_icon").click(function(){
    	curInputId = $(this).parent().prev().attr("id");   	
  	    play();  	
  	});
    
    tip.addEventListener("click",function(){
        play();
    });

    //页面不可见，断开麦克风调用
    document.addEventListener("visibilitychange",function(){
        if(document.hidden == true){
            session.kill();
        }
    });

    // $('#micphoneElement').popover({ 
    //     html : true,
    //     title: function() {
    //      return "端到端需求交付周期";
    //     },
    //     content: function() {
    //      return "从<b>[分析中]</b>到<b>[已发布]</b>所需周期的故事个数.";
    //     }
    // });



})(document)


/** TTS API **/
/***************************************************ELEMENT**************************************************************/
var HINT_IFLYTEK = '科大讯飞成立于1999年，是中国最大的智能化语音技术提供商，其语音核心技术代表世界最高水平。2008年科大讯飞在深圳证券交易所挂牌上市';
var HINT_API = '本API基于HTML5和NODEJS技术，实现网页上的语音合成、语音识别效果，兼容个人电脑、苹果和安卓等移动终端设备.';
var HINT_ENG = 'IFLYTEK.AI enables developers to add a natural language interface to their app or device in minutes. It’s faster and more accurate than Siri, and requires no upfront investment, expertise, or training dataset.';
/***************************************************ELEMENT**************************************************************/
/***********************************************local Variables**********************************************************/
var audioPalyUrl = "http://h5.xf-yun.com/audioStream/";

/**
  * 初始化Session会话
  * url                 连接的服务器地址（可选）
  * reconnection        客户端是否支持断开重连
  * reconnectionDelay   重连支持的延迟时间   
  */
var sessionTTS = new IFlyTtsSession({
                                    'url'                : 'ws://h5.xf-yun.com/tts.do',
                                    'reconnection'       : true,
                                    'reconnectionDelay'  : 30000
                                });
/* 音频播放对象 */
window.iaudio = null;
/* 音频播放状态 0:未播放且等待音频数据状态，1:正播放且等待音频数据状态，2：未播放且不等待音频数据*/
var audio_state = 0;
/***********************************************local Variables**********************************************************/

function playTTS(content, vcn){
    resetTTS();
    
    ssb_param = {"appid": '58ca8f50', "appkey":"21c47159cad6d952", "synid":"12345", "params" : "ent=aisound,aue=lame,vcn="+vcn};

    sessionTTS.start(ssb_param, content, function (err, obj)
    {
        var audio_url = audioPalyUrl + obj.audio_url;
        if( audio_url != null && audio_url != undefined )
        {
            window.iaudio.src = audio_url;
            window.iaudio.play();
        }
    });
};

/**
  * 停止播放音频
  *
  */
function stopTTS() {
    audio_state = 2;
    window.iaudio.pause();
}

function startTTS() {
    audio_state = 1;
    window.iaudio.play();
}

function play_xiaoyan(){playTTS(HINT_API, 'aisxping')};
function play_yufeng(){playTTS(HINT_IFLYTEK, 'viviyufeng')};
function play_mary(){playTTS(HINT_ENG , 'vivimary')};

/**
  * 重置音频缓存队列和播放对象
  * 若音频正在播放，则暂停当前播放对象，创建并使用新的播放对象.
  */
function resetTTS()
{
    audio_array = [];    
    audio_state = 0;
    if(window.iaudio != null)
    {
        window.iaudio.pause();
    }
    window.iaudio = new Audio();
    window.iaudio.src = '';
    //window.iaudio.play();
};

String.prototype.replaceAll  = function(s1,s2){   
    return this.replace(new RegExp(s1,"gm"),s2);   
};

Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}

template.helper('dateFormat', function (date, format) {

    if (typeof date === "string") {
        var mts = date.match(/(\/Date\((\d+)\)\/)/);
        if (mts && mts.length >= 3) {
            date = parseInt(mts[2]);
        }
    }
    date = new Date(date);
    if (!date || date.toUTCString() == "Invalid Date") {
        return "";
    }

    var map = {
        "M": date.getMonth() + 1, //月份 
        "d": date.getDate(), //日 
        "h": date.getHours(), //小时 
        "m": date.getMinutes(), //分 
        "s": date.getSeconds(), //秒 
        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    

    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});


//Close Help Page
var closeHelpPage = function() {
    $(".rightTipsInfo").css({
        right:"-50%"
    })
}

var openHelpPage = function() {
    $(".rightTipsInfo").css({
       right:0
    });
}

function resetContentHeight() {
    var rightListHeight = $(window).height()-120-100;
    $(".rightTipsContent").css({
        height:rightListHeight+"px"
    })
}

$(window).resize(function() {
    resetContentHeight();
});

$(function() {
    $("#firstTime").html(new Date().format("hh:mm:ss"));
    $("#lastTime").html(new Date().format("hh:mm:ss"));


    //console.info($(window).height()-120-100);
    //$(".rightTipsContent").height($(window).height()-120-80)
    //设置图表标题提示
    // $('#micphoneElement').popover({ 
    //     html : true,
    //     title: function() {
    //      return "故事开发周期";
    //     },
    //     content: function() {
    //      return '<div id="a">点击开始录音</div>'+
    //                 '<div id="canvas_wrapper" style="display:none">'+
    //                  '<canvas id="volume" height="4"></canvas>'+
    //             '</div>';
    //     }
    // }); 
})

