function learn(token, meta, callback) {
    _send("learn", token, meta, callback);
}

function recommend(token, meta, callback) {
    _send("recommend", token, meta, callback);
}

function learnAndRecommend(token, meta, callback) {
    _send("learnrec", token, meta, callback);
}

function _send(endpoint, token, learn, meta, callback) {
    if (!callback) {
        callback = meta;
        meta = undefined;
    }

    meta = meta || {};
    meta.id = meta.id || document.location.href;
    if (endpoint === "learn" || endpoint === "learnrec") {
        meta.url = meta.url || document.location.href;
        meta.title = meta.title || document.title;
    }

    if (!meta.actor) meta.actor = _cookie();

    $.post("/api/" + endpoint + "?token=" + token + "&meta=" + encodeURIComponent(JSON.stringify(meta)), function (data, textStatus) {
        if (textStatus === 'success') {
            callback(null, JSON.parse(data));
        } else {
            callback(new Error('error loading recommendations'));
        }
    });
}

/* returns unique actor id from cookie. if empty sets one and returns */
function _cookie() {
    return "123";
}
