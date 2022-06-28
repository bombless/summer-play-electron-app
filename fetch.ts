module.exports = function() {
    const axios = require('axios');
    const parse = require('node-html-parser').parse;
    
    
    return axios
    .get('http://waptianqi.2345.com/temperature-rank-rev.htm')
    .then(res => {
        console.log(`statusCode: ${res.status}`);
        console.log(res.data);
        const root = parse(res.data);
        const list = root.querySelector('.temperList');
        for (const tr of list.childNodes) {
            const nodes = tr.childNodes;
            const items = {
                city: nodes[1].querySelector('a').textContent,
                province: nodes[1].querySelector('i').textContent,
                range: nodes[2].textContent,
                average: nodes[3].textContent,
            };
            console.log(items);
        }
    })
    .catch(error => {
        console.error(error);
    });

};
