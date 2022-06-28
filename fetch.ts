module.exports.cities = function() {
    const axios = require('axios');
    const parse = require('node-html-parser').parse;
    
    
    return axios
    .get('http://waptianqi.2345.com/temperature-rank-rev.htm')
    .then(res => {
        //console.log(`statusCode: ${res.status}`);
        //console.log(res.data);
        const root = parse(res.data);
        const list = root.querySelector('.temperList');
        const ret = [];
        for (const tr of list.childNodes) {
            const nodes = tr.childNodes;
            const link = nodes[1].querySelector('a');
            console.log(link.getAttribute('href'));
            const items = {
                city: link.textContent,
                link: 'http://waptianqi.2345.com' + link.getAttribute('href'),
                province: nodes[1].querySelector('i').textContent,
                range: nodes[2].textContent,
                average: nodes[3].textContent,
            };
            //console.log(items);
            ret.push(items);
        }
        return ret;
    })
    .catch(error => {
        console.error(error);
    });

};
module.exports.weather = function(links) {
    Promise.all(links.map(link => {
        return axios
        .get('http://waptianqi.2345.com' + link)
        .then(res => {
            const root = parse(res.data);
            const list = root.querySelector('.phrase').map(x => x.textContent);
            console.log(list);
            return res.data;
        })
        .catch(error => {
            console.error(error);
        });

    }))

}
