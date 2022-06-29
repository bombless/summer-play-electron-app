function options() {
    const weather = require('./fetch.ts').weather;
    const element = document.createElement('select');
    const all = ['查看全部', '七天内有雨', '七天内无雨', '连续三天无雨', '七天内五天无雨', '七天内三天无雨'];

    for (const option of all) {
        const node = document.createElement('option');
        node.textContent = node.value = option;
        element.appendChild(node);
    }

    element.addEventListener('change', () => {
        //console.log(element.parentElement, element.parentElement.querySelectorAll('li'))
        const nodeList = element.parentElement.querySelectorAll('li');
        const links = [].slice.call(nodeList).map(x => x.dataset.link);
        function trigger(indices) {
            nodeList.forEach((x, idx) => {
                nodeList[idx].style.display = indices.includes(idx) ? 'list-item' : 'none';
            });
        }
        //console.log(links);
        cachedWeather(links).then(list => {
            switch (element.value) {
                case '查看全部': return trigger([...Array(links.length).keys()]);
                case '七天内有雨': return trigger(list.reduce((acc, x, idx) => {
                    if (x.some(x => x)) { acc.push(idx); }
                    return acc;
                }, []));
                case '七天内无雨': return trigger(list.reduce((acc, x, idx) => {
                    if (!x.some(x => x)) { acc.push(idx); }
                    return acc;
                }, []));
                case '连续三天无雨': return trigger(list.reduce((acc, x, idx) => {
                    function helper(list) {
                        return list.reduce((acc, x) => x ? 0 : acc + 1, 0);
                    }
                    if (helper(x) >= 3) { acc.push(idx); }
                    return acc;
                }, []));
                case '七天内五天无雨': return trigger(list.reduce((acc, x, idx) => {
                    function helper(list) {
                        return list.reduce((acc, x) => x ? acc + 1 : acc, 0);
                    }
                    if (helper(x) <= 2) { acc.push(idx); }
                    return acc;
                }, []));
                case '七天内三天无雨': return trigger(list.reduce((acc, x, idx) => {
                    function helper(list) {
                        return list.reduce((acc, x) => x ? acc + 1 : acc, 0);
                    }
                    if (helper(x) <= 4) { acc.push(idx); }
                    return acc;
                }, []));
            }
        });
    });

    function cachedWeather(links) {
        const key = 'cache:' + links.join(':');
        if (options[key]) {
            return Promise.resolve(options[key])
        }
        return weather(links).then(list => {
            options[key] = list;
            return list;
        });
    } 

    return element;

}

module.exports = options;
