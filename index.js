function getWiki(params) {
    const mecab = require('mecabaas-client');
    const wiki = require("wikijs").default;
    var wikipedia = wiki({ apiUrl: "http://ja.wikipedia.org/w/api.php" });
    var noun = '';
    var noun_array = [];

    return new Promise(function(resolve, reject) {
        //mecab
        mecab.parse(params.sentence)
        .then(function(morphs){
            morphs.map(function(morph) {
                if (morph[2] === '固有名詞') {
                    noun_array.push(morph[0]);
                    //wiki
                    if(noun_array.length==1){
                        console.log(noun_array[0]);
                        wikipedia.search(noun_array[0])
                        .then(data => {
                            wikipedia
                            .page(data.results[0])
                            .then(page => {return page.summary()})
                            .then(summary => {
                                console.log(summary)
                                resolve({"noun":morph[0], "msg" : summary});
                            })
                        });
                    }
                }
            });
        },
        function(error){
            console.log(error);
            resolve({"msg" : "null"});
        }
    )
    .then(()=>{
        if(noun_array.length == 0){
            console.log('no noun');
            resolve({"msg" : "null"});
        };
    })
    });
}

module.exports.main = getWiki;

