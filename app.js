'use strict'

const inTxtValDefault = `The Quick Brown Fox Jumps Over The Lazy Dog
The Quick brown cat that looks like fox jumps over the fence`;
const inRgxValDefault = "quick\\s(brown).*(jumps)";

const inTxt = document.querySelector("#inTxt");
const inRgx = document.querySelector("#inRgx");
const runBtn = document.querySelector("#runBtn");
const shareBtn = document.querySelector("#shareBtn");
const outTxt = document.querySelector("#outTxt");
const outExec = document.querySelector("#outExec");
const shareLink = document.querySelector("#shareLink");
const chGlob = document.querySelector("#chGlob");
const chCase = document.querySelector("#chCase");
const chMult = document.querySelector("#chMult");

const runRx = () => {
  getShareLink();
  var str = inTxt.value;
  if (str.length === 0) {outTxt.innerText = outExec.innerText = "";return;}
  if (inRgx.value.length === 0) {outTxt.innerText = outExec.innerText = "";return;}
    
  var opt = "";
  if (chGlob.checked) opt += "g";
  if (chCase.checked) opt += "i";
  if (chMult.checked) opt += "m";  
  
  try {
    var regexp = new RegExp(inRgx.value, opt);
    
    outTxt.innerHTML = str.replace(regexp, d => `<span class="marker">${d}</span>`);
    var outExecVal = "", rxArray, idx = 1;
    while (rxArray = regexp.exec(str)) {
      console.log('--->', rxArray); 
      outExecVal += "iter " + idx + ": " + rxArray + " [idx:" + rxArray.index + 
        " next: " + regexp.lastIndex + "]\n";
      idx++;
      
      // break the loop to prevent infinite execution
      // there is only one result
      if (regexp.lastIndex === 0) break;
      // fallback for all other cases that I'm yet to find
      if (idx > 100) break;
    }
    if (idx > 1) outExecVal += "iter " + idx + ": null";
    else outExecVal = "No matches.";
    
    outExec.innerText = outExecVal; 
  } catch (err) {
    outTxt.innerText = err;
    outExec.innerText = "";
  }
};

const getQueryStringParams = () => {
  var match,
    pl     = /\+/g,  // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    query  = window.location.search.substring(1);

  var urlParams = {};
  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
  
  inTxt.value = urlParams["intxt"] || inTxtValDefault;   
  inRgx.value = urlParams["inrgx"] || inRgxValDefault;
  
  runRx();
};

const getShareLink = () => {
  var link = location.protocol + '//' + location.host + location.pathname;
  link += "?intxt=" + encodeURIComponent(inTxt.value);
  link += "&inrgx=" + encodeURIComponent(inRgx.value);
  shareLink.value = link;
}

runBtn.onclick = inRgx.oninput = 
chGlob.onchange = chCase.onchange = chMult.onchange = 
inTxt.oninput = runRx;

shareBtn.onclick = () => {copyToClipboard(shareLink);};

window.onload = getQueryStringParams;

//------------------------------------------------------------
// http://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}
//------------------------------------------------------------
// encode(decode) html text into html entity
var decodeHtmlEntity = function(str) {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
};

var encodeHtmlEntity = function(str) {
  var buf = [];
  for (var i=str.length-1;i>=0;i--) {
    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
  }
  return buf.join('');
};
//------------------------------------------------------------