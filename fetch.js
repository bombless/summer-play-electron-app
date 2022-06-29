
const axios = require('axios');
const parse = require('node-html-parser').parse;

function regions() {
    const geolocation = require('./region.json');
    const data = {};
    for (const province of geolocation.districts) {
        const entry = province.name;
        for (const city of province.districts) {
            const key = city.name;
            if (!data[entry]) {
                data[entry] = {};
            }
            data[entry][key] = [city.center.longitude, city.center.latitude];
        }
    }

    return (province, city) => {
        for (const entry of Object.keys(data)) {
            if (entry.indexOf(province) > -1) {
                for (const key of Object.keys(data[entry])) {
                    if (key.indexOf(city) > -1) {
                        return data[entry][key];
                    }
                }
            }
        }
    }

}

module.exports.cities = function() {
    const getPosition = regions();
    return axios
    .get('http://waptianqi.2345.com/temperature-rank-rev.htm')
    .then(res => {
        //console.log(`statusCode: ${res.status}`);
        //console.log(res.data);
        //console.log(res);
        const root = parse(res.data);
        const list = root.querySelector('.temperList');
        const ret = [];
        for (const tr of list.childNodes) {
            const nodes = tr.childNodes;
            const link = nodes[1].querySelector('a');
            const city = link.textContent;
            const province = nodes[1].querySelector('i').textContent;
            const position = getPosition(province, city);
            const item = {
                city,
                province,
                position,
                link: link.getAttribute('href'),
                range: nodes[2].textContent,
                average: nodes[3].textContent,
            };
            console.log(item);
            ret.push(item);
        }
        return ret;
    })
    .catch(error => {
        console.error(error);
    });

};
module.exports.weather = function(links) {
    return Promise.all(links.map(link => {
        if (!link) return Promise.reject();
        return axios
        .request({
            method: 'GET',
            url: 'http://waptianqi.2345.com' + link,
            responseType: 'arraybuffer',
            reponseEncoding: 'binary'
        })
        //.get('http://waptianqi.2345.com' + link)
        .then(res => {
            const data = res.data;
            //console.log('data', res.data);
            const html = new TextDecoder("gbk").decode(data);
            //console.log('html', html);
            const root = parse(html);
            //console.log('x', root);
            //window.x = root;
            //console.log(res);
            const list = [].slice.call(root.querySelectorAll('.days15-weather .phrase')).map(x => x.textContent.indexOf('雨') > -1);
            //console.log(list);
            return list;
        })
        .catch(error => {
            console.error(error);
        });

    }))

}
