// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

    AMapLoader.load({
        "key": "bd025ef2a45752cd896864d70447a76f",              // 申请好的Web端开发者Key，首次调用 load 时必填
        "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        "plugins": [],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        "AMapUI": {             // 是否加载 AMapUI，缺省不加载
            "version": '1.1',   // AMapUI 版本
            "plugins":['overlay/SimpleMarker'],       // 需要加载的 AMapUI ui插件
        },
        "Loca":{                // 是否加载 Loca， 缺省不加载
            "version": '2.0'  // Loca 版本
        },
    }).then((AMap)=>{
        var map = new AMap.Map('container');
        init(AMap);
        //map.addControl(new AMap.Scale());
    }).catch((e)=>{
        console.error(e);  //加载错误提示
    });
    function init(AMap) {
        const fetchData = require('./fetch.ts');
        fetchData();
    }