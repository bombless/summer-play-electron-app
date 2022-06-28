// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

    AMapLoader.load({
        "key": "bd025ef2a45752cd896864d70447a76f",              // 申请好的Web端开发者Key，首次调用 load 时必填
        "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        "plugins": ['AMap.Geocoder', 'AMap.Weather'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        "AMapUI": {             // 是否加载 AMapUI，缺省不加载
            "version": '1.1',   // AMapUI 版本
            "plugins":['overlay/SimpleMarker'],       // 需要加载的 AMapUI ui插件
        },
        "Loca":{            // 是否加载 Loca， 缺省不加载
            "version": '2.0'  // Loca 版本
        },
    }).then((AMap)=>{
        const map = new AMap.Map('container');
        init(AMap, map);
        //map.addControl(new AMap.Scale());
    }).catch((e)=>{
        console.error(e);  //加载错误提示
    });
    async function init(AMap, map) {
        const weather = new AMap.Weather();
        let markerCount = 0;
        const fetchData = require('./fetch.ts');
        const tabs = document.querySelector('#tabs');
        const data = await fetchData();
        const provinces = new Map;
        const cities = [];
        const pannel = document.querySelector('#pannel');
        pannel.className = 'pannel';
        const cityOl = document.createElement('ol');
        cityOl.dataset.name = '全国';
        cityOl.className = 'pannel';
        provinces.set('全国', { dom: cityOl, cities })
        tabs.addEventListener('click', e => {
            pannel.querySelectorAll('.pannel').forEach(pannel => {
                // console.log(e.target.textContent, pannel.dataset.name);
                map.setFitView(provinces.get(e.target.textContent).cities);
                if (e.target.textContent === pannel.dataset.name) {
                    pannel.style.display = 'block';
                }
                else {
                    pannel.style.display = 'none';
                }
            })
            // console.log(e.target);
        })
        for (const item of data) {
            let province;
            if (provinces.has(item.province)) {
                province = provinces.get(item.province);
            } else {
                const provincePannel = document.createElement('ol');
                provincePannel.className = 'pannel';
                provincePannel.dataset.name = item.province;
                provincePannel.style.display = 'none';
                pannel.appendChild(provincePannel);
                const btn = document.createElement('li');
                btn.textContent = item.province;
                tabs.appendChild(btn);
                province = { dom: provincePannel, cities: [] };
                provinces.set(item.province, province);
            }
            const cityLi = document.createElement('li');
            cityLi.textContent = item.average + ' ' + item.province + item.city;
            cityOl.appendChild(cityLi);
            cityLi.title = JSON.stringify(item);
            const provinceLi = document.createElement('li');
            provinceLi.textContent = item.average + ' ' + item.province + item.city;
            province.dom.appendChild(provinceLi);
            provinceLi.title = JSON.stringify(item);
            var geocoder = new AMap.Geocoder({
              // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
              city: item.province + item.city
            })
              
            geocoder.getLocation(item.province + '省' + item.city + '政府', function(status, result) {
              if (status === 'complete' && result.info === 'OK') {
                //console.log(result);
                //console.log(result.geocodes[0].location.pos);
                var marker = new AMap.Marker({
                    icon: 'http://vdata.amap.com/icons/b18/1/2.png',
                    position: result.geocodes[0].location,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    title: item.province + item.city,
                });
                //console.log(item.province + item.city, marker);
                
                // 将创建的点标记添加到已有的地图实例：
                map.add(marker);
                province.cities.push(marker);
                cities.push(marker);
                markerCount += 1;
                if (markerCount === data.length) {
                    map.setFitView();
                }
                function zoom() {
                    //map.setZoomAndCenter(11, result.geocodes[0].location);

                    const infoWindow = new AMap.InfoWindow({
                        content: item.city + '<br/>' + item.range  //传入 dom 对象，或者 html 字符串
                    });
                    
                     // 打开信息窗体
                    infoWindow.open(map, result.geocodes[0].location);
                    map.setFitView(provinces.get(item.province).cities);
                }
                cityLi.addEventListener('click', zoom);
                provinceLi.addEventListener('click', zoom);
                //map.setZoomAndCenter(11, result.geocodes[0].location);

              }
            });
            //break
        }
        pannel.appendChild(cityOl);
    }