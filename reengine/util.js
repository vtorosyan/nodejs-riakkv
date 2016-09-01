// cookie expire days that sets in anonymouse user browser
var anonymousUserCookieExpireDays = 180;

// cookie name that sets in anonymouse user browser 
var anonymousUserCookieName = "rec_cookie";

/*
 Parse meta data from meta tags from document object
 There are 3 cases:

 facebook: when meta tag property is named "property"
 google plus: when meta tag property is named "itemprop"
 header meta tags: simple meta tags from header
 */
function parseMetaData() {
    var m = document.getElementsByTagName('meta');
    var name;
    var content;
    var metaData = [];

    if (m.length != 0) {
        for (i = 0; i < m.length; i++) {
            if (m[i].getAttribute('property') !== null) {
                name = m[i].getAttribute('property');
            } else if (m[i].getAttribute('itemprop') !== null) {
                name = m[i].getAttribute('itemprop');
            } else {
                name = m[i].name;
            }
            m[i].url = m[i].url || document.location.href;
            m[i].title = m[i].title || document.title;

            // user unique idd
            var userId = checkUserIdAndSetCookieIfNeeded();

            content = m[i].content;
            metaData.push({"name": name, "content": content});
        }
    }
    return Object.keys(metaData).length !== 0 ? JSON.stringify(metaData) : metaData;
}

/*
 Check if user comes with user id and if not create unique id and store it in cookie.
 If cookie already exists return unique id.
 */
function checkUserIdAndSetCookieIfNeeded() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
        params[key] = value;
    });

    if (!("uid" in params) && !("userid" in params) && !("id" in params)) {
        if (!readCookie(anonymousUserCookieName)) {
            var uuid = createUUID();
            storeCookie(anonymousUserCookieName, uuid, anonymouseUserCookieExpireDays);
            return uuid;
        }
    }

    return readCookie(anonymousUserCookieName);
}

// Create unique id for anonymous user.
function createUUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

// Store cookie with given name and value.
function storeCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

// Read cookie with given name.
function readCookie(_name) {
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var name = ca[i].split('=')[0];
        var value = ca[i].split('=')[1];
        if (name === _name) {
            return value;
        }
    }
    return null;
}

// Erase cookie with given name.
function eraseCookie(name) {
    createCookie(name, "", -1);
}