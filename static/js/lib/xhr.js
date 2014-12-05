function getJSON(url, success) {
  var xhr = createCORSRequest('GET', url);
  xhr.withCredentials = true;
  xhr.onload = function() {
   var json = JSON.parse(xhr.responseText);
   success(json);
  };
  xhr.send();
}

//simple get rss feed method (for proxied context)

function getRSS(url, success) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    var rss = xhr.responseText;
    //console.log(rss);
    var arr = rss.split("\n");
    var urls = [];
    for(var i =0; i< arr.length; i++){
      var text = arr[i];
      var m = text.match(/<enclosure url=\"(.*?)\"/);
      if(m){
        urls.push(m[1]);
      }
    }
    console.log(urls);
    success(urls);
  };
  xhr.send();
}


function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}
