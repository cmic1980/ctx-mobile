var a = navigator.userAgent;
var isAndroid = a.indexOf('Android') > -1 || a.indexOf('Adr') > -1; //android终端
var isiOS = !!a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
if(isAndroid){
    alert('是Android');
}
if(isiOS ){
    alert('是iOS');
}