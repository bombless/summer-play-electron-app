// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

    AMapLoader.load({
        "key": "bd025ef2a45752cd896864d70447a76f",          // 申请好的Web端开发者Key，首次调用 load 时必填
        "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        "plugins": [],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        "AMapUI": {         // 是否加载 AMapUI，缺省不加载
        "version": '1.1',   // AMapUI 版本
        "plugins":['overlay/SimpleMarker'],       // 需要加载的 AMapUI ui插件
        },
        "Loca":{        // 是否加载 Loca， 缺省不加载
        "version": '2.0'  // Loca 版本
        },
    }).then((AMap)=>{
        const map = new AMap.Map('container');
        init(AMap, map);
        //map.addControl(new AMap.Scale());
    }).catch((e)=>{
        console.error(e);  //加载错误提示
    });
    function mark(map, info) {
        var marker = new AMap.Marker({
            icon: 'http://vdata.amap.com/icons/b18/1/2.png',
            position: info.position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: info.province + info.city,
        });
        
        map.setFitView();

        // 将创建的点标记添加到已有的地图实例：
        map.add(marker);
        return marker;
    }
    
    async function init(AMap, map) {
        const options = require('./weather');
        const departurePoint = document.querySelector('#departurePoint');
        departurePoint.addEventListener('change', () => {
            storage.setItem('departurePoint', departurePoint.value);
        });
        departurePoint.value = storage.getItem('departurePoint');

        const Cities = require('./cities');

        const cities = new Cities(x => map.setFitView(x), info => mark(map, info));
        for (const item of await cities.items) {

            const info = document.createElement('div');
            const cityInfo = document.createElement('div');
            cityInfo.textContent = item.city;
            const temperatureInfo = document.createElement('div');
            temperatureInfo.textContent = item.range;
            info.append(cityInfo, temperatureInfo);
        
            function zoom() {
    
                const infoWindow = new AMap.InfoWindow({
                    content: info  //传入 dom 对象，或者 html 字符串
                });
                
                 // 打开信息窗体
                infoWindow.open(map, item.position);
                map.setFitView(cities.getProvinceCities(item.province));
            }
            item.cityLi.addEventListener('click', zoom);
            item.provinceLi.addEventListener('click', zoom);
        }
    }
    