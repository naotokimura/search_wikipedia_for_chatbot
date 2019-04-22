const mecab = require('mecabaas-client');
const async = require('async');
const wiki = require('wikijs').default({
    apiUrl : 'http://ja.wikipedia.org/w/api.php'
});

function getWiki(params) {
    return new Promise(function(resolve, reject) {
        let noun = [];
        const readAll = async() => {
            //文中の最初に現れた固有名詞をMeCabで抽出。
            let morphs = await mecab.parse(params.sentence);
            await morphs.map(function( morph ) {
                if (morph[2] === '固有名詞') noun.push(morph[0]);
            });
            if (noun.length == 0) {
                console.log('no noun');
                resolve({"noun":"null", "msg":"null"});
                return;
            }
            console.log(noun[0]);
            
            //Wikipediaで固有名詞を検索し、最初にヒットしたページから情報を抽出。
            let search_results = await wiki.search(noun[0]);
            if (search_results.length == 0) {
                console.log('no wikipedia content');
                resolve({"noun":"null", "msg":"null"});
                return;
            }
            //ページ全体の情報を取得。
            let page = await wiki.page(search_results.results[0]);
            //概要を取得。
            let summary = await page.summary();
            resolve({"noun":encodeURI(noun[0]), "msg":summary});
        }
        readAll();
    });
}
module.exports.main = getWiki;
var params = {sentence:"siri"};
getWiki(params);
