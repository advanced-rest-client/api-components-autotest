var CryptoJS=CryptoJS||function(c) {
var t={}; var e=t.lib={}; var r=e.Base={ extend: function(t) {
n.prototype=this; var e=new n; return t&&e.mixIn(t), e.hasOwnProperty('init')||(e.init=function() {
e.$super.init.apply(this, arguments)
}), (e.init.prototype=e).$super=this, e;}, create: function() {
var t=this.extend(); return t.init.apply(t, arguments), t
}, init: function() {}, mixIn: function(t) {
for (let e in t)t.hasOwnProperty(e)&&(this[e]=t[e]); t.hasOwnProperty('toString')&&(this.toString=t.toString)
}, clone: function() {
return this.init.prototype.extend(this)
} }; function n() {} var h=e.WordArray=r.extend({ init: function(t, e) {
t=this.words=t||[], this.sigBytes=null!=e?e:4*t.length
}, toString: function(t) {
return (t||o).stringify(this)
}, concat: function(t) {
var e=this.words; var r=t.words; var n=this.sigBytes; var i=t.sigBytes; if (this.clamp(), n%4) for (var o=0; o<i; o++) {
var s=r[o>>>2]>>>24-o%4*8&255; e[n+o>>>2]|=s<<24-(n+o)%4*8
} else if (65535<r.length) for (o=0; o<i; o+=4)e[n+o>>>2]=r[o>>>2]; else e.push.apply(e, r); return this.sigBytes+=i, this
}, clamp: function() {
var t=this.words; var e=this.sigBytes; t[e>>>2]&=4294967295<<32-e%4*8, t.length=c.ceil(e/4)
}, clone: function() {
var t=r.clone.call(this); return t.words=this.words.slice(0), t
}, random: function(t) {
for (var e=[], r=0; r<t; r+=4)e.push(4294967296*c.random()|0); return new h.init(e, t);} }); var i=t.enc={}; var o=i.Hex={stringify:function(t){for(var e=t.words,r=t.sigBytes,n=[],i=0;i<r;i++){var o=e[i>>>2]>>>24-i%4*8&255;n.push((o>>>4).toString(16)),n.push((15&o).toString(16))}return n.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n+=2)r[n>>>3]|=parseInt(t.substr(n,2),16)<<24-n%8*4;return new h.init(r,e/2)}}; var s=i.Latin1={stringify:function(t){for(var e=t.words,r=t.sigBytes,n=[],i=0;i<r;i++){var o=e[i>>>2]>>>24-i%4*8&255;n.push(String.fromCharCode(o))}return n.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n++)r[n>>>2]|=(255&t.charCodeAt(n))<<24-n%4*8;return new h.init(r,e)}}; var a=i.Utf8={stringify:function(t){try{return decodeURIComponent(escape(s.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return s.parse(unescape(encodeURIComponent(t)))}}; var l=e.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=new h.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=a.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(t){var e=this._data,r=e.words,n=e.sigBytes,i=this.blockSize,o=n/(4*i),s=(o=t?c.ceil(o):c.max((0|o)-this._minBufferSize,0))*i,a=c.min(4*s,n);if(s){for(var l=0;l<s;l+=i)this._doProcessBlock(r,l);var u=r.splice(0,s);e.sigBytes-=a}return new h.init(u,a)},clone:function(){var t=r.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}); var u=(e.Hasher=l.extend({ cfg: r.extend(), init: function(t) {
this.cfg=this.cfg.extend(t), this.reset()
}, reset: function() {
l.reset.call(this), this._doReset();}, update: function(t) {
return this._append(t), this._process(), this
}, finalize: function(t) {
return t&&this._append(t), this._doFinalize()
}, blockSize: 16, _createHelper: function(r) {
return function(t, e) {
return new r.init(e).finalize(t);};}, _createHmacHelper: function(r) {
return function(t, e) {
return new u.HMAC.init(r, e).finalize(t);};} }), t.algo={}); return t
}(Math); if (!function() {
var t=CryptoJS; var e=t.lib; var r=e.WordArray; var n=e.Hasher; var i=t.algo; var h=[]; var o=i.SHA1=n.extend({ _doReset: function() {
this._hash=new r.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
}, _doProcessBlock: function(t, e) {
for (var r=this._hash.words, n=r[0], i=r[1], o=r[2], s=r[3], a=r[4], l=0; l<80; l++) {
if (l<16)h[l]=0|t[e+l]; else {
var u=h[l-3]^h[l-8]^h[l-14]^h[l-16]; h[l]=u<<1|u>>>31;} var c=(n<<5|n>>>27)+a+h[l]; c+=l<20?1518500249+(i&o|~i&s):l<40?1859775393+(i^o^s):l<60?(i&o|i&s|o&s)-1894007588:(i^o^s)-899497514, a=s, s=o, o=i<<30|i>>>2, i=n, n=c
}r[0]=r[0]+n|0, r[1]=r[1]+i|0, r[2]=r[2]+o|0, r[3]=r[3]+s|0, r[4]=r[4]+a|0;}, _doFinalize: function() {
var t=this._data; var e=t.words; var r=8*this._nDataBytes; var n=8*t.sigBytes; return e[n>>>5]|=128<<24-n%32, e[14+(64+n>>>9<<4)]=Math.floor(r/4294967296), e[15+(64+n>>>9<<4)]=r, t.sigBytes=4*e.length, this._process(), this._hash
}, clone: function() {
var t=n.clone.call(this); return t._hash=this._hash.clone(), t;} }); t.SHA1=n._createHelper(o), t.HmacSHA1=n._createHmacHelper(o)
}(), function() {
var c=CryptoJS.lib.WordArray; CryptoJS.enc.Base64={ stringify: function(t) {
var e=t.words; var r=t.sigBytes; var n=this._map; t.clamp(); for (var i=[], o=0; o<r; o+=3) for (let s=(e[o>>>2]>>>24-o%4*8&255)<<16|(e[o+1>>>2]>>>24-(o+1)%4*8&255)<<8|e[o+2>>>2]>>>24-(o+2)%4*8&255, a=0; a<4&&o+.75*a<r; a++)i.push(n.charAt(s>>>6*(3-a)&63)); var l=n.charAt(64); if (l) for (;i.length%4;)i.push(l); return i.join('');}, parse: function(t) {
var e=t.length; var r=this._map; var n=r.charAt(64); if (n) {
var i=t.indexOf(n); -1!=i&&(e=i);} for (var o=[], s=0, a=0; a<e; a++) if (a%4) {
var l=r.indexOf(t.charAt(a-1))<<a%4*2; var u=r.indexOf(t.charAt(a))>>>6-a%4*2; o[s>>>2]|=(l|u)<<24-s%4*8, s++
} return c.create(o, s);}, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" }
}(), function(c) {
var t=CryptoJS; var e=t.lib; var r=e.WordArray; var n=e.Hasher; var i=t.algo; var k=[]; !function() {
for (let t=0; t<64; t++)k[t]=4294967296*c.abs(c.sin(t+1))|0
}(); var o=i.MD5=n.extend({ _doReset: function() {
this._hash=new r.init([1732584193, 4023233417, 2562383102, 271733878]);}, _doProcessBlock: function(t, e) {
for (let r=0; r<16; r++) {
var n=e+r; var i=t[n]; t[n]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8)
} var o=this._hash.words; var s=t[e+0]; var a=t[e+1]; var l=t[e+2]; var u=t[e+3]; var c=t[e+4]; var h=t[e+5]; var f=t[e+6]; var d=t[e+7]; var p=t[e+8]; var g=t[e+9]; var m=t[e+10]; var v=t[e+11]; var y=t[e+12]; var x=t[e+13]; var b=t[e+14]; var w=t[e+15]; var S=o[0]; var C=o[1]; var A=o[2]; var T=o[3]; S=R(S, C, A, T, s, 7, k[0]), T=R(T, S, C, A, a, 12, k[1]), A=R(A, T, S, C, l, 17, k[2]), C=R(C, A, T, S, u, 22, k[3]), S=R(S, C, A, T, c, 7, k[4]), T=R(T, S, C, A, h, 12, k[5]), A=R(A, T, S, C, f, 17, k[6]), C=R(C, A, T, S, d, 22, k[7]), S=R(S, C, A, T, p, 7, k[8]), T=R(T, S, C, A, g, 12, k[9]), A=R(A, T, S, C, m, 17, k[10]), C=R(C, A, T, S, v, 22, k[11]), S=R(S, C, A, T, y, 7, k[12]), T=R(T, S, C, A, x, 12, k[13]), A=R(A, T, S, C, b, 17, k[14]), S=M(S, C=R(C, A, T, S, w, 22, k[15]), A, T, a, 5, k[16]), T=M(T, S, C, A, f, 9, k[17]), A=M(A, T, S, C, v, 14, k[18]), C=M(C, A, T, S, s, 20, k[19]), S=M(S, C, A, T, h, 5, k[20]), T=M(T, S, C, A, m, 9, k[21]), A=M(A, T, S, C, w, 14, k[22]), C=M(C, A, T, S, c, 20, k[23]), S=M(S, C, A, T, g, 5, k[24]), T=M(T, S, C, A, b, 9, k[25]), A=M(A, T, S, C, u, 14, k[26]), C=M(C, A, T, S, p, 20, k[27]), S=M(S, C, A, T, x, 5, k[28]), T=M(T, S, C, A, l, 9, k[29]), A=M(A, T, S, C, d, 14, k[30]), S=L(S, C=M(C, A, T, S, y, 20, k[31]), A, T, h, 4, k[32]), T=L(T, S, C, A, p, 11, k[33]), A=L(A, T, S, C, v, 16, k[34]), C=L(C, A, T, S, b, 23, k[35]), S=L(S, C, A, T, a, 4, k[36]), T=L(T, S, C, A, c, 11, k[37]), A=L(A, T, S, C, d, 16, k[38]), C=L(C, A, T, S, m, 23, k[39]), S=L(S, C, A, T, x, 4, k[40]), T=L(T, S, C, A, s, 11, k[41]), A=L(A, T, S, C, u, 16, k[42]), C=L(C, A, T, S, f, 23, k[43]), S=L(S, C, A, T, g, 4, k[44]), T=L(T, S, C, A, y, 11, k[45]), A=L(A, T, S, C, w, 16, k[46]), S=E(S, C=L(C, A, T, S, l, 23, k[47]), A, T, s, 6, k[48]), T=E(T, S, C, A, d, 10, k[49]), A=E(A, T, S, C, b, 15, k[50]), C=E(C, A, T, S, h, 21, k[51]), S=E(S, C, A, T, y, 6, k[52]), T=E(T, S, C, A, u, 10, k[53]), A=E(A, T, S, C, m, 15, k[54]), C=E(C, A, T, S, a, 21, k[55]), S=E(S, C, A, T, p, 6, k[56]), T=E(T, S, C, A, w, 10, k[57]), A=E(A, T, S, C, f, 15, k[58]), C=E(C, A, T, S, x, 21, k[59]), S=E(S, C, A, T, c, 6, k[60]), T=E(T, S, C, A, v, 10, k[61]), A=E(A, T, S, C, l, 15, k[62]), C=E(C, A, T, S, g, 21, k[63]), o[0]=o[0]+S|0, o[1]=o[1]+C|0, o[2]=o[2]+A|0, o[3]=o[3]+T|0;}, _doFinalize: function() {
var t=this._data; var e=t.words; var r=8*this._nDataBytes; var n=8*t.sigBytes; e[n>>>5]|=128<<24-n%32; var i=c.floor(r/4294967296); var o=r; e[15+(64+n>>>9<<4)]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8), e[14+(64+n>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8), t.sigBytes=4*(e.length+1), this._process(); for (var s=this._hash, a=s.words, l=0; l<4; l++) {
var u=a[l]; a[l]=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8)
} return s
}, clone: function() {
var t=n.clone.call(this); return t._hash=this._hash.clone(), t
} }); function R(t, e, r, n, i, o, s) {
var a=t+(e&r|~e&n)+i+s; return (a<<o|a>>>32-o)+e
} function M(t, e, r, n, i, o, s) {
var a=t+(e&n|r&~n)+i+s; return (a<<o|a>>>32-o)+e;} function L(t, e, r, n, i, o, s) {
var a=t+(e^r^n)+i+s; return (a<<o|a>>>32-o)+e
} function E(t, e, r, n, i, o, s) {
var a=t+(r^(e|~n))+i+s; return (a<<o|a>>>32-o)+e
}t.MD5=n._createHelper(o), t.HmacMD5=n._createHmacHelper(o);}(Math), void 0===YAHOO) var YAHOO={}; YAHOO.lang={ extend: function(t, e, r) {
if (!e||!t) throw new Error('YAHOO.lang.extend failed, please check that all dependencies are included.'); function n() {} if (n.prototype=e.prototype, t.prototype=new n, (t.prototype.constructor=t).superclass=e.prototype, e.prototype.constructor==Object.prototype.constructor&&(e.prototype.constructor=e), r) {
var i; for (i in r)t.prototype[i]=r[i]; var o=function() {}; var s=['toString', "valueOf"]; try {
/MSIE/.test(navigator.userAgent)&&(o=function(t, e) {
for (i=0; i<s.length; i+=1) {
var r=s[i]; var n=e[r]; "function"==typeof n&&n!=Object.prototype[r]&&(t[r]=n)
}
})
} catch (t) {}o(t.prototype, r)
}
} }; CryptoJS=CryptoJS||function(c) {
var t={}; var e=t.lib={}; var r=e.Base={ extend: function(t) {
n.prototype=this; var e=new n; return t&&e.mixIn(t), e.hasOwnProperty('init')||(e.init=function() {
e.$super.init.apply(this, arguments)
}), (e.init.prototype=e).$super=this, e
}, create: function() {
var t=this.extend(); return t.init.apply(t, arguments), t
}, init: function() {}, mixIn: function(t) {
for (let e in t)t.hasOwnProperty(e)&&(this[e]=t[e]); t.hasOwnProperty('toString')&&(this.toString=t.toString)
}, clone: function() {
return this.init.prototype.extend(this)
} }; function n() {} var h=e.WordArray=r.extend({ init: function(t, e) {
t=this.words=t||[], this.sigBytes=null!=e?e:4*t.length;}, toString: function(t) {
return (t||o).stringify(this)
}, concat: function(t) {
var e=this.words; var r=t.words; var n=this.sigBytes; var i=t.sigBytes; if (this.clamp(), n%4) for (var o=0; o<i; o++) {
var s=r[o>>>2]>>>24-o%4*8&255; e[n+o>>>2]|=s<<24-(n+o)%4*8;} else for (o=0; o<i; o+=4)e[n+o>>>2]=r[o>>>2]; return this.sigBytes+=i, this
}, clamp: function() {
var t=this.words; var e=this.sigBytes; t[e>>>2]&=4294967295<<32-e%4*8, t.length=c.ceil(e/4)
}, clone: function() {
var t=r.clone.call(this); return t.words=this.words.slice(0), t;}, random: function(t) {
for (var e=[], r=0; r<t; r+=4)e.push(4294967296*c.random()|0); return new h.init(e, t)
} }); var i=t.enc={}; var o=i.Hex={stringify:function(t){for(var e=t.words,r=t.sigBytes,n=[],i=0;i<r;i++){var o=e[i>>>2]>>>24-i%4*8&255;n.push((o>>>4).toString(16)),n.push((15&o).toString(16))}return n.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n+=2)r[n>>>3]|=parseInt(t.substr(n,2),16)<<24-n%8*4;return new h.init(r,e/2)}}; var s=i.Latin1={stringify:function(t){for(var e=t.words,r=t.sigBytes,n=[],i=0;i<r;i++){var o=e[i>>>2]>>>24-i%4*8&255;n.push(String.fromCharCode(o))}return n.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n++)r[n>>>2]|=(255&t.charCodeAt(n))<<24-n%4*8;return new h.init(r,e)}}; var a=i.Utf8={stringify:function(t){try{return decodeURIComponent(escape(s.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return s.parse(unescape(encodeURIComponent(t)))}}; var l=e.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=new h.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=a.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(t){var e=this._data,r=e.words,n=e.sigBytes,i=this.blockSize,o=n/(4*i),s=(o=t?c.ceil(o):c.max((0|o)-this._minBufferSize,0))*i,a=c.min(4*s,n);if(s){for(var l=0;l<s;l+=i)this._doProcessBlock(r,l);var u=r.splice(0,s);e.sigBytes-=a}return new h.init(u,a)},clone:function(){var t=r.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}); var u=(e.Hasher=l.extend({ cfg: r.extend(), init: function(t) {
this.cfg=this.cfg.extend(t), this.reset()
}, reset: function() {
l.reset.call(this), this._doReset()
}, update: function(t) {
return this._append(t), this._process(), this
}, finalize: function(t) {
return t&&this._append(t), this._doFinalize();}, blockSize: 16, _createHelper: function(r) {
return function(t, e) {
return new r.init(e).finalize(t);}
}, _createHmacHelper: function(r) {
return function(t, e) {
return new u.HMAC.init(r, e).finalize(t)
};} }), t.algo={}); return t
}(Math); !function() {
var t; var e=(t=CryptoJS).lib; var i=e.Base; var o=e.WordArray; (t=t.x64={}).Word=i.extend({ init: function(t, e) {
this.high=t, this.low=e
} }), t.WordArray=i.extend({ init: function(t, e) {
t=this.words=t||[], this.sigBytes=null!=e?e:8*t.length;}, toX32: function() {
for (var t=this.words, e=t.length, r=[], n=0; n<e; n++) {
var i=t[n]; r.push(i.high), r.push(i.low)
} return o.create(r, this.sigBytes);}, clone: function() {
for (var t=i.clone.call(this), e=t.words=this.words.slice(0), r=e.length, n=0; n<r; n++)e[n]=e[n].clone(); return t;} })
}(), CryptoJS.lib.Cipher||function() {
var t=(f=CryptoJS).lib; var e=t.Base; var s=t.WordArray; var r=t.BufferedBlockAlgorithm; var n=f.enc.Base64; var i=f.algo.EvpKDF; var o=t.Cipher=r.extend({ cfg: e.extend(), createEncryptor: function(t, e) {
return this.create(this._ENC_XFORM_MODE, t, e);}, createDecryptor: function(t, e) {
return this.create(this._DEC_XFORM_MODE, t, e)
}, init: function(t, e, r) {
this.cfg=this.cfg.extend(r), this._xformMode=t, this._key=e, this.reset();}, reset: function() {
r.reset.call(this), this._doReset();}, process: function(t) {
return this._append(t), this._process();}, finalize: function(t) {
return t&&this._append(t), this._doFinalize();}, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function(n) {
return { encrypt: function(t, e, r) {
return ('string'==typeof e?d:h).encrypt(n, t, e, r)
}, decrypt: function(t, e, r) {
return ('string'==typeof e?d:h).decrypt(n, t, e, r)
} }
} }); t.StreamCipher=o.extend({ _doFinalize: function() {
return this._process(!0);}, blockSize: 1 }); function a(t, e, r) {
var n=this._iv; n?this._iv=void 0:n=this._prevBlock; for (let i=0; i<r; i++)t[e+i]^=n[i];} var l=f.mode={}; var u=(t.BlockCipherMode=e.extend({ createEncryptor: function(t, e) {
return this.Encryptor.create(t, e);}, createDecryptor: function(t, e) {
return this.Decryptor.create(t, e);}, init: function(t, e) {
this._cipher=t, this._iv=e;} })).extend(); u.Encryptor=u.extend({ processBlock: function(t, e) {
var r=this._cipher; var n=r.blockSize; a.call(this, t, e, n), r.encryptBlock(t, e), this._prevBlock=t.slice(e, e+n);} }), u.Decryptor=u.extend({ processBlock: function(t, e) {
var r=this._cipher; var n=r.blockSize; var i=t.slice(e, e+n); r.decryptBlock(t, e), a.call(this, t, e, n), this._prevBlock=i
} }), l=l.CBC=u, u=(f.pad={}).Pkcs7={ pad: function(t, e) {
for (var r, n=(r=(r=4*e)-t.sigBytes%r)<<24|r<<16|r<<8|r, i=[], o=0; o<r; o+=4)i.push(n); r=s.create(i, r), t.concat(r);}, unpad: function(t) {
t.sigBytes-=255&t.words[t.sigBytes-1>>>2];} }, t.BlockCipher=o.extend({ cfg: o.cfg.extend({ mode: l, padding: u }), reset: function() {
o.reset.call(this); var t=(e=this.cfg).iv; var e=e.mode; if (this._xformMode==this._ENC_XFORM_MODE) var r=e.createEncryptor; else r=e.createDecryptor, this._minBufferSize=1; this._mode=r.call(e, this, t&&t.words)
}, _doProcessBlock: function(t, e) {
this._mode.processBlock(t, e);}, _doFinalize: function() {
var t=this.cfg.padding; if (this._xformMode==this._ENC_XFORM_MODE) {
t.pad(this._data, this.blockSize); var e=this._process(!0);} else e=this._process(!0), t.unpad(e); return e;}, blockSize: 4 }); var c=t.CipherParams=e.extend({ init: function(t) {
this.mixIn(t)
}, toString: function(t) {
return (t||this.formatter).stringify(this)
} }); var h=(l=(f.format={}).OpenSSL={stringify:function(t){var e=t.ciphertext;return((t=t.salt)?s.create([1398893684,1701076831]).concat(t).concat(e):e).toString(n)},parse:function(t){var e=(t=n.parse(t)).words;if(1398893684==e[0]&&1701076831==e[1]){var r=s.create(e.slice(2,4));e.splice(0,4),t.sigBytes-=16}return c.create({ciphertext:t,salt:r})}},t.SerializableCipher=e.extend({cfg:e.extend({format:l}),encrypt:function(t,e,r,n){n=this.cfg.extend(n);var i=t.createEncryptor(r,n);return e=i.finalize(e),i=i.cfg,c.create({ciphertext:e,key:r,iv:i.iv,algorithm:t,mode:i.mode,padding:i.padding,blockSize:t.blockSize,formatter:n.format})},decrypt:function(t,e,r,n){return n=this.cfg.extend(n),e=this._parse(e,n.format),t.createDecryptor(r,n).finalize(e.ciphertext)},_parse:function(t,e){return"string"==typeof t?e.parse(t,this):t}})); var f=(f.kdf={}).OpenSSL={execute:function(t,e,r,n){return n=n||s.random(8),t=i.create({keySize:e+r}).compute(t,n),r=s.create(t.words.slice(e),4*r),t.sigBytes=4*e,c.create({key:t,iv:r,salt:n})}}; var d=t.PasswordBasedCipher=h.extend({ cfg: h.cfg.extend({ kdf: f }), encrypt: function(t, e, r, n) {
return r=(n=this.cfg.extend(n)).kdf.execute(r, t.keySize, t.ivSize), n.iv=r.iv, (t=h.encrypt.call(this, t, e, r.key, n)).mixIn(r), t;}, decrypt: function(t, e, r, n) {
return n=this.cfg.extend(n), e=this._parse(e, n.format), r=n.kdf.execute(r, t.keySize, t.ivSize, e.salt), n.iv=r.iv, h.decrypt.call(this, t, e, r.key, n);} });}(), function() {
var t=CryptoJS; var e=(n=t.lib).WordArray; var r=n.Hasher; var c=[]; var n=t.algo.SHA1=r.extend({ _doReset: function() {
this._hash=new e.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);}, _doProcessBlock: function(t, e) {
for (var r=this._hash.words, n=r[0], i=r[1], o=r[2], s=r[3], a=r[4], l=0; l<80; l++) {
if (l<16)c[l]=0|t[e+l]; else {
var u=c[l-3]^c[l-8]^c[l-14]^c[l-16]; c[l]=u<<1|u>>>31
}u=(n<<5|n>>>27)+a+c[l], u=l<20?u+(1518500249+(i&o|~i&s)):l<40?u+(1859775393+(i^o^s)):l<60?u+((i&o|i&s|o&s)-1894007588):u+((i^o^s)-899497514), a=s, s=o, o=i<<30|i>>>2, i=n, n=u
}r[0]=r[0]+n|0, r[1]=r[1]+i|0, r[2]=r[2]+o|0, r[3]=r[3]+s|0, r[4]=r[4]+a|0;}, _doFinalize: function() {
var t=this._data; var e=t.words; var r=8*this._nDataBytes; var n=8*t.sigBytes; return e[n>>>5]|=128<<24-n%32, e[14+(64+n>>>9<<4)]=Math.floor(r/4294967296), e[15+(64+n>>>9<<4)]=r, t.sigBytes=4*e.length, this._process(), this._hash
}, clone: function() {
var t=r.clone.call(this); return t._hash=this._hash.clone(), t
} }); t.SHA1=r._createHelper(n), t.HmacSHA1=r._createHmacHelper(n)
}(), function(i) {
function t(t) {
return 4294967296*(t-(0|t))|0;} for (var e=CryptoJS, r=(o=e.lib).WordArray, n=o.Hasher, o=e.algo, s=[], p=[], a=2, l=0; l<64;) {
var u; t: {
u=a; for (let c=i.sqrt(u), h=2; h<=c; h++) if (!(u%h)) {
u=!1; break t
}u=!0;}u&&(l<8&&(s[l]=t(i.pow(a, .5))), p[l]=t(i.pow(a, 1/3)), l++), a++;} var g=[]; o=o.SHA256=n.extend({ _doReset: function() {
this._hash=new r.init(s.slice(0));}, _doProcessBlock: function(t, e) {
for (var r=this._hash.words, n=r[0], i=r[1], o=r[2], s=r[3], a=r[4], l=r[5], u=r[6], c=r[7], h=0; h<64; h++) {
if (h<16)g[h]=0|t[e+h]; else {
var f=g[h-15]; var d=g[h-2]; g[h]=((f<<25|f>>>7)^(f<<14|f>>>18)^f>>>3)+g[h-7]+((d<<15|d>>>17)^(d<<13|d>>>19)^d>>>10)+g[h-16]
}f=c+((a<<26|a>>>6)^(a<<21|a>>>11)^(a<<7|a>>>25))+(a&l^~a&u)+p[h]+g[h], d=((n<<30|n>>>2)^(n<<19|n>>>13)^(n<<10|n>>>22))+(n&i^n&o^i&o), c=u, u=l, l=a, a=s+f|0, s=o, o=i, i=n, n=f+d|0
}r[0]=r[0]+n|0, r[1]=r[1]+i|0, r[2]=r[2]+o|0, r[3]=r[3]+s|0, r[4]=r[4]+a|0, r[5]=r[5]+l|0, r[6]=r[6]+u|0, r[7]=r[7]+c|0;}, _doFinalize: function() {
var t=this._data; var e=t.words; var r=8*this._nDataBytes; var n=8*t.sigBytes; return e[n>>>5]|=128<<24-n%32, e[14+(64+n>>>9<<4)]=i.floor(r/4294967296), e[15+(64+n>>>9<<4)]=r, t.sigBytes=4*e.length, this._process(), this._hash;}, clone: function() {
var t=n.clone.call(this); return t._hash=this._hash.clone(), t;} }); e.SHA256=n._createHelper(o), e.HmacSHA256=n._createHmacHelper(o);}(Math), function() {
function t() {
return n.create.apply(n, arguments)
} for (var e=CryptoJS, r=e.lib.Hasher, n=(o=e.x64).Word, i=o.WordArray, o=e.algo, et=[t(1116352408, 3609767458), t(1899447441, 602891725), t(3049323471, 3964484399), t(3921009573, 2173295548), t(961987163, 4081628472), t(1508970993, 3053834265), t(2453635748, 2937671579), t(2870763221, 3664609560), t(3624381080, 2734883394), t(310598401, 1164996542), t(607225278, 1323610764), t(1426881987, 3590304994), t(1925078388, 4068182383), t(2162078206, 991336113), t(2614888103, 633803317), t(3248222580, 3479774868), t(3835390401, 2666613458), t(4022224774, 944711139), t(264347078, 2341262773), t(604807628, 2007800933), t(770255983, 1495990901), t(1249150122, 1856431235), t(1555081692, 3175218132), t(1996064986, 2198950837), t(2554220882, 3999719339), t(2821834349, 766784016), t(2952996808, 2566594879), t(3210313671, 3203337956), t(3336571891, 1034457026), t(3584528711, 2466948901), t(113926993, 3758326383), t(338241895, 168717936), t(666307205, 1188179964), t(773529912, 1546045734), t(1294757372, 1522805485), t(1396182291, 2643833823), t(1695183700, 2343527390), t(1986661051, 1014477480), t(2177026350, 1206759142), t(2456956037, 344077627), t(2730485921, 1290863460), t(2820302411, 3158454273), t(3259730800, 3505952657), t(3345764771, 106217008), t(3516065817, 3606008344), t(3600352804, 1432725776), t(4094571909, 1467031594), t(275423344, 851169720), t(430227734, 3100823752), t(506948616, 1363258195), t(659060556, 3750685593), t(883997877, 3785050280), t(958139571, 3318307427), t(1322822218, 3812723403), t(1537002063, 2003034995), t(1747873779, 3602036899), t(1955562222, 1575990012), t(2024104815, 1125592928), t(2227730452, 2716904306), t(2361852424, 442776044), t(2428436474, 593698344), t(2756734187, 3733110249), t(3204031479, 2999351573), t(3329325298, 3815920427), t(3391569614, 3928383900), t(3515267271, 566280711), t(3940187606, 3454069534), t(4118630271, 4000239992), t(116418474, 1914138554), t(174292421, 2731055270), t(289380356, 3203993006), t(460393269, 320620315), t(685471733, 587496836), t(852142971, 1086792851), t(1017036298, 365543100), t(1126000580, 2618297676), t(1288033470, 3409855158), t(1501505948, 4234509866), t(1607167915, 987167468), t(1816402316, 1246189591)], rt=[], s=0; s<80; s++)rt[s]=t(); o=o.SHA512=r.extend({ _doReset: function() {
this._hash=new i.init([new n.init(1779033703, 4089235720), new n.init(3144134277, 2227873595), new n.init(1013904242, 4271175723), new n.init(2773480762, 1595750129), new n.init(1359893119, 2917565137), new n.init(2600822924, 725511199), new n.init(528734635, 4215389547), new n.init(1541459225, 327033209)])
}, _doProcessBlock: function(t, e) {
for (var r=(u=this._hash.words)[0], n=u[1], i=u[2], o=u[3], s=u[4], a=u[5], l=u[6], u=u[7], c=r.high, h=r.low, f=n.high, d=n.low, p=i.high, g=i.low, m=o.high, v=o.low, y=s.high, x=s.low, b=a.high, w=a.low, S=l.high, C=l.low, A=u.high, T=u.low, k=c, R=h, M=f, L=d, E=p, N=g, D=m, I=v, B=y, O=x, H=b, P=w, _=S, U=C, K=A, j=T, F=0; F<80; F++) {
var z=rt[F]; if (F<16) var W=z.high=0|t[e+2*F]; var J=z.low=0|t[e+2*F+1]; else {
W=((J=(W=rt[F-15]).high)>>>1|(V=W.low)<<31)^(J>>>8|V<<24)^J>>>7; var V=(V>>>1|J<<31)^(V>>>8|J<<24)^(V>>>7|J<<25); var q=((J=(q=rt[F-2]).high)>>>19|(G=q.low)<<13)^(J<<3|G>>>29)^J>>>6; var G=(G>>>19|J<<13)^(G<<3|J>>>29)^(G>>>6|J<<26); var $=(J=rt[F-7]).high; var X=(Y=rt[F-16]).high; var Y=Y.low; W=(W=(W=W+$+((J=V+J.low)>>>0<V>>>0?1:0))+q+((J=J+G)>>>0<G>>>0?1:0))+X+((J=J+Y)>>>0<Y>>>0?1:0); z.high=W, z.low=J
}$=B&H^~B&_, Y=O&P^~O&U, z=k&M^k&E^M&E; var Z=R&L^R&N^L&N; var Q=(V=(k>>>28|R<<4)^(k<<30|R>>>2)^(k<<25|R>>>7),q=(R>>>28|k<<4)^(R<<30|k>>>2)^(R<<25|k>>>7),(G=et[F]).high); var tt=G.low; X=K+((B>>>14|O<<18)^(B>>>18|O<<14)^(B<<23|O>>>9))+((G=j+((O>>>14|B<<18)^(O>>>18|B<<14)^(O<<23|B>>>9)))>>>0<j>>>0?1:0), K=_, j=U, _=H, U=P, H=B, P=O, B=D+(X=(X=(X=X+$+((G=G+Y)>>>0<Y>>>0?1:0))+Q+((G=G+tt)>>>0<tt>>>0?1:0))+W+((G=G+J)>>>0<J>>>0?1:0))+((O=I+G|0)>>>0<I>>>0?1:0)|0, D=E, I=N, E=M, N=L, M=k, L=R, k=X+(z=V+z+((J=q+Z)>>>0<q>>>0?1:0))+((R=G+J|0)>>>0<G>>>0?1:0)|0
}h=r.low=h+R, r.high=c+k+(h>>>0<R>>>0?1:0), d=n.low=d+L, n.high=f+M+(d>>>0<L>>>0?1:0), g=i.low=g+N, i.high=p+E+(g>>>0<N>>>0?1:0), v=o.low=v+I, o.high=m+D+(v>>>0<I>>>0?1:0), x=s.low=x+O, s.high=y+B+(x>>>0<O>>>0?1:0), w=a.low=w+P, a.high=b+H+(w>>>0<P>>>0?1:0), C=l.low=C+U, l.high=S+_+(C>>>0<U>>>0?1:0), T=u.low=T+j, u.high=A+K+(T>>>0<j>>>0?1:0);}, _doFinalize: function() {
var t=this._data; var e=t.words; var r=8*this._nDataBytes; var n=8*t.sigBytes; return e[n>>>5]|=128<<24-n%32, e[30+(128+n>>>10<<5)]=Math.floor(r/4294967296), e[31+(128+n>>>10<<5)]=r, t.sigBytes=4*e.length, this._process(), this._hash.toX32();}, clone: function() {
var t=r.clone.call(this); return t._hash=this._hash.clone(), t
}, blockSize: 32 }), e.SHA512=r._createHelper(o), e.HmacSHA512=r._createHmacHelper(o)
}(); var dbits; var b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; var b64pad='='; function hex2b64(t) {
var e; var r; var n=''; for (e=0; e+3<=t.length; e+=3)r=parseInt(t.substring(e, e+3), 16), n+=b64map.charAt(r>>6)+b64map.charAt(63&r); if (e+1==t.length?(r=parseInt(t.substring(e, e+1), 16), n+=b64map.charAt(r<<2)):e+2==t.length&&(r=parseInt(t.substring(e, e+2), 16), n+=b64map.charAt(r>>2)+b64map.charAt((3&r)<<4)), b64pad) for (;0<(3&n.length);)n+=b64pad; return n
} function b64tohex(t) {
var e; var r; var n; var i=""; var o=0; for (e=0; e<t.length&&t.charAt(e)!=b64pad; ++e)(n=b64map.indexOf(t.charAt(e)))<0||(o=0==o?(i+=int2char(n>>2), r=3&n, 1):1==o?(i+=int2char(r<<2|n>>4), r=15&n, 2):2==o?(i+=int2char(r), i+=int2char(n>>2), r=3&n, 3):(i+=int2char(r<<2|n>>4), i+=int2char(15&n), 0)); return 1==o&&(i+=int2char(r<<2)), i
} function b64toBA(t) {
var e; var r=b64tohex(t); var n=new Array; for (e=0; 2*e<r.length; ++e)n[e]=parseInt(r.substring(2*e, 2*e+2), 16); return n
} var canary=0xdeadbeefcafe; var j_lm=15715070==(16777215&canary); function BigInteger(t, e, r) {
null!=t&&('number'==typeof t?this.fromNumber(t, e, r):null==e&&'string'!=typeof t?this.fromString(t, 256):this.fromString(t, e))
} function nbi() {
return new BigInteger(null);} function am1(t, e, r, n, i, o) {
for (;0<=--o;) {
var s=e*this[t++]+r[n]+i; i=Math.floor(s/67108864), r[n++]=67108863&s
} return i
} function am2(t, e, r, n, i, o) {
for (let s=32767&e, a=e>>15; 0<=--o;) {
var l=32767&this[t]; var u=this[t++]>>15; var c=a*l+u*s; i=((l=s*l+((32767&c)<<15)+r[n]+(1073741823&i))>>>30)+(c>>>15)+a*u+(i>>>30), r[n++]=1073741823&l;} return i;} function am3(t, e, r, n, i, o) {
for (let s=16383&e, a=e>>14; 0<=--o;) {
var l=16383&this[t]; var u=this[t++]>>14; var c=a*l+u*s; i=((l=s*l+((16383&c)<<14)+r[n]+i)>>28)+(c>>14)+a*u, r[n++]=268435455&l
} return i;}dbits=j_lm&&'Microsoft Internet Explorer'==navigator.appName?(BigInteger.prototype.am=am2, 30):j_lm&&'Netscape'!=navigator.appName?(BigInteger.prototype.am=am1, 26):(BigInteger.prototype.am=am3, 28), BigInteger.prototype.DB=dbits, BigInteger.prototype.DM=(1<<dbits)-1, BigInteger.prototype.DV=1<<dbits; var BI_FP=52; BigInteger.prototype.FV=Math.pow(2, BI_FP), BigInteger.prototype.F1=BI_FP-dbits, BigInteger.prototype.F2=2*dbits-BI_FP; var rr; var vv; var BI_RM="0123456789abcdefghijklmnopqrstuvwxyz"; var BI_RC=new Array; for (rr='0'.charCodeAt(0), vv=0; vv<=9; ++vv)BI_RC[rr++]=vv; for (rr='a'.charCodeAt(0), vv=10; vv<36; ++vv)BI_RC[rr++]=vv; for (rr='A'.charCodeAt(0), vv=10; vv<36; ++vv)BI_RC[rr++]=vv; function int2char(t) {
return BI_RM.charAt(t)
} function intAt(t, e) {
var r=BI_RC[t.charCodeAt(e)]; return null==r?-1:r
} function bnpCopyTo(t) {
for (let e=this.t-1; 0<=e; --e)t[e]=this[e]; t.t=this.t, t.s=this.s
} function bnpFromInt(t) {
this.t=1, this.s=t<0?-1:0, 0<t?this[0]=t:t<-1?this[0]=t+this.DV:this.t=0;} function nbv(t) {
var e=nbi(); return e.fromInt(t), e
} function bnpFromString(t, e) {
var r; if (16==e)r=4; else if (8==e)r=3; else if (256==e)r=8; else if (2==e)r=1; else if (32==e)r=5; else {
if (4!=e) return void this.fromRadix(t, e); r=2;} this.t=0, this.s=0; for (var n=t.length, i=!1, o=0; 0<=--n;) {
var s=8==r?255&t[n]:intAt(t, n); s<0?'-'==t.charAt(n)&&(i=!0):(i=!1, 0==o?this[this.t++]=s:o+r> this.DB?(this[this.t-1]|=(s&(1<<this.DB-o)-1)<<o, this[this.t++]=s>>this.DB-o):this[this.t-1]|=s<<o, (o+=r)>=this.DB&&(o-=this.DB));}8==r&&0!=(128&t[0])&&(this.s=-1, 0<o&&(this[this.t-1]|=(1<<this.DB-o)-1<<o)), this.clamp(), i&&BigInteger.ZERO.subTo(this, this);} function bnpClamp() {
for (let t=this.s&this.DM; 0<this.t&&this[this.t-1]==t;)--this.t;} function bnToString(t) {
if (this.s<0) return "-"+this.negate().toString(t); var e; if (16==t)e=4; else if (8==t)e=3; else if (2==t)e=1; else if (32==t)e=5; else {
if (4!=t) return this.toRadix(t); e=2
} var r; var n=(1<<e)-1; var i=!1; var o=""; var s=this.t; var a=this.DB-s*this.DB%e; if (0<s--) for (a<this.DB&&0<(r=this[s]>>a)&&(i=!0, o=int2char(r)); 0<=s;)a<e?(r=(this[s]&(1<<a)-1)<<e-a, r|=this[--s]>>(a+=this.DB-e)):(r=this[s]>>(a-=e)&n, a<=0&&(a+=this.DB, --s)), 0<r&&(i=!0), i&&(o+=int2char(r)); return i?o:'0'} function bnNegate() {
var t=nbi(); return BigInteger.ZERO.subTo(this, t), t;} function bnAbs() {
return this.s<0?this.negate():this
} function bnCompareTo(t) {
var e=this.s-t.s; if (0!=e) return e; var r=this.t; if (0!=(e=r-t.t)) return this.s<0?-e:e; for (;0<=--r;) if (0!=(e=this[r]-t[r])) return e; return 0
} function nbits(t) {
var e; var r=1; return 0!=(e=t>>>16)&&(t=e, r+=16), 0!=(e=t>>8)&&(t=e, r+=8), 0!=(e=t>>4)&&(t=e, r+=4), 0!=(e=t>>2)&&(t=e, r+=2), 0!=(e=t>>1)&&(t=e, r+=1), r
} function bnBitLength() {
return this.t<=0?0:this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM);} function bnpDLShiftTo(t, e) {
var r; for (r=this.t-1; 0<=r; --r)e[r+t]=this[r]; for (r=t-1; 0<=r; --r)e[r]=0; e.t=this.t+t, e.s=this.s
} function bnpDRShiftTo(t, e) {
for (let r=t; r<this.t; ++r)e[r-t]=this[r]; e.t=Math.max(this.t-t, 0), e.s=this.s;} function bnpLShiftTo(t, e) {
var r; var n=t%this.DB; var i=this.DB-n; var o=(1<<i)-1; var s=Math.floor(t/this.DB); var a=this.s<<n&this.DM; for (r=this.t-1; 0<=r; --r)e[r+s+1]=this[r]>>i|a, a=(this[r]&o)<<n; for (r=s-1; 0<=r; --r)e[r]=0; e[s]=a, e.t=this.t+s+1, e.s=this.s, e.clamp()
} function bnpRShiftTo(t, e) {
e.s=this.s; var r=Math.floor(t/this.DB); if (r>=this.t)e.t=0; else {
var n=t%this.DB; var i=this.DB-n; var o=(1<<n)-1; e[0]=this[r]>>n; for (let s=r+1; s<this.t; ++s)e[s-r-1]|=(this[s]&o)<<i, e[s-r]=this[s]>>n; 0<n&&(e[this.t-r-1]|=(this.s&o)<<i), e.t=this.t-r, e.clamp()
}
} function bnpSubTo(t, e) {
for (var r=0, n=0, i=Math.min(t.t, this.t); r<i;)n+=this[r]-t[r], e[r++]=n&this.DM, n>>=this.DB; if (t.t<this.t) {
for (n-=t.s; r<this.t;)n+=this[r], e[r++]=n&this.DM, n>>=this.DB; n+=this.s
} else {
for (n+=this.s; r<t.t;)n-=t[r], e[r++]=n&this.DM, n>>=this.DB; n-=t.s
}e.s=n<0?-1:0, n<-1?e[r++]=this.DV+n:0<n&&(e[r++]=n), e.t=r, e.clamp()
} function bnpMultiplyTo(t, e) {
var r=this.abs(); var n=t.abs(); var i=r.t; for (e.t=i+n.t; 0<=--i;)e[i]=0; for (i=0; i<n.t; ++i)e[i+r.t]=r.am(0, n[i], e, i, 0, r.t); e.s=0, e.clamp(), this.s!=t.s&&BigInteger.ZERO.subTo(e, e);} function bnpSquareTo(t) {
for (var e=this.abs(), r=t.t=2*e.t; 0<=--r;)t[r]=0; for (r=0; r<e.t-1; ++r) {
var n=e.am(r, e[r], t, 2*r, 0, 1); (t[r+e.t]+=e.am(r+1, 2*e[r], t, 2*r+1, n, e.t-r-1))>=e.DV&&(t[r+e.t]-=e.DV, t[r+e.t+1]=1)
}0<t.t&&(t[t.t-1]+=e.am(r, e[r], t, 2*r, 0, 1)), t.s=0, t.clamp()
} function bnpDivRemTo(t, e, r) {
var n=t.abs(); if (!(n.t<=0)) {
var i=this.abs(); if (i.t<n.t) return null!=e&&e.fromInt(0), void(null!=r&&this.copyTo(r)); null==r&&(r=nbi()); var o=nbi(); var s=this.s; var a=t.s; var l=this.DB-nbits(n[n.t-1]); 0<l?(n.lShiftTo(l, o), i.lShiftTo(l, r)):(n.copyTo(o), i.copyTo(r)); var u=o.t; var c=o[u-1]; if (0!=c) {
var h=c*(1<<this.F1)+(1<u?o[u-2]>>this.F2:0); var f=this.FV/h; var d=(1<<this.F1)/h; var p=1<<this.F2; var g=r.t; var m=g-u; var v=null==e?nbi():e; for (o.dlShiftTo(m, v), 0<=r.compareTo(v)&&(r[r.t++]=1, r.subTo(v, r)), BigInteger.ONE.dlShiftTo(u, v), v.subTo(o, o); o.t<u;)o[o.t++]=0; for (;0<=--m;) {
var y=r[--g]==c?this.DM:Math.floor(r[g]*f+(r[g-1]+p)*d); if ((r[g]+=o.am(0, y, r, m, 0, u))<y) for (o.dlShiftTo(m, v), r.subTo(v, r); r[g]<--y;)r.subTo(v, r);}null!=e&&(r.drShiftTo(u, e), s!=a&&BigInteger.ZERO.subTo(e, e)), r.t=u, r.clamp(), 0<l&&r.rShiftTo(l, r), s<0&&BigInteger.ZERO.subTo(r, r)
}
}
} function bnMod(t) {
var e=nbi(); return this.abs().divRemTo(t, null, e), this.s<0&&0<e.compareTo(BigInteger.ZERO)&&t.subTo(e, e), e;} function Classic(t) {
this.m=t;} function cConvert(t) {
return t.s<0||0<=t.compareTo(this.m)?t.mod(this.m):t
} function cRevert(t) {
return t
} function cReduce(t) {
t.divRemTo(this.m, null, t);} function cMulTo(t, e, r) {
t.multiplyTo(e, r), this.reduce(r)
} function cSqrTo(t, e) {
t.squareTo(e), this.reduce(e);} function bnpInvDigit() {
if (this.t<1) return 0; var t=this[0]; if (0==(1&t)) return 0; var e=3&t; return 0<(e=(e=(e=(e=e*(2-(15&t)*e)&15)*(2-(255&t)*e)&255)*(2-((65535&t)*e&65535))&65535)*(2-t*e%this.DV)%this.DV)?this.DV-e:-e
} function Montgomery(t) {
this.m=t, this.mp=t.invDigit(), this.mpl=32767&this.mp, this.mph=this.mp>>15, this.um=(1<<t.DB-15)-1, this.mt2=2*t.t;} function montConvert(t) {
var e=nbi(); return t.abs().dlShiftTo(this.m.t, e), e.divRemTo(this.m, null, e), t.s<0&&0<e.compareTo(BigInteger.ZERO)&&this.m.subTo(e, e), e;} function montRevert(t) {
var e=nbi(); return t.copyTo(e), this.reduce(e), e
} function montReduce(t) {
for (;t.t<=this.mt2;)t[t.t++]=0; for (let e=0; e<this.m.t; ++e) {
var r=32767&t[e]; var n=r*this.mpl+((r*this.mph+(t[e]>>15)*this.mpl&this.um)<<15)&t.DM; for (t[r=e+this.m.t]+=this.m.am(0, n, t, e, 0, this.m.t); t[r]>=t.DV;)t[r]-=t.DV, t[++r]++;}t.clamp(), t.drShiftTo(this.m.t, t), 0<=t.compareTo(this.m)&&t.subTo(this.m, t);} function montSqrTo(t, e) {
t.squareTo(e), this.reduce(e);} function montMulTo(t, e, r) {
t.multiplyTo(e, r), this.reduce(r);} function bnpIsEven() {
return 0==(0<this.t?1&this[0]:this.s);} function bnpExp(t, e) {
if (4294967295<t||t<1) return BigInteger.ONE; var r=nbi(); var n=nbi(); var i=e.convert(this); var o=nbits(t)-1; for (i.copyTo(r); 0<=--o;) if (e.sqrTo(r, n), 0<(t&1<<o))e.mulTo(n, i, r); else {
var s=r; r=n, n=s;} return e.revert(r)
} function bnModPowInt(t, e) {
var r; return r=new(t<256||e.isEven()?Classic:Montgomery)(e), this.exp(t, r)
} function bnClone() {
var t=nbi(); return this.copyTo(t), t;} function bnIntValue() {
if (this.s<0) {
if (1==this.t) return this[0]-this.DV; if (0==this.t) return -1
} else {
if (1==this.t) return this[0]; if (0==this.t) return 0
} return (this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]
} function bnByteValue() {
return 0==this.t?this.s:this[0]<<24>>24
} function bnShortValue() {
return 0==this.t?this.s:this[0]<<16>>16;} function bnpChunkSize(t) {
return Math.floor(Math.LN2*this.DB/Math.log(t))
} function bnSigNum() {
return this.s<0?-1:this.t<=0||1==this.t&&this[0]<=0?0:1
} function bnpToRadix(t) {
if (null==t&&(t=10), 0==this.signum()||t<2||36<t) return "0"; var e=this.chunkSize(t); var r=Math.pow(t,e); var n=nbv(r); var i=nbi(); var o=nbi(); var s=''; for (this.divRemTo(n, i, o); 0<i.signum();)s=(r+o.intValue()).toString(t).substr(1)+s, i.divRemTo(n, i, o); return o.intValue().toString(t)+s;} function bnpFromRadix(t, e) {
this.fromInt(0), null==e&&(e=10); for (var r=this.chunkSize(e), n=Math.pow(e, r), i=!1, o=0, s=0, a=0; a<t.length; ++a) {
var l=intAt(t, a); l<0?'-'==t.charAt(a)&&0==this.signum()&&(i=!0):(s=e*s+l, ++o>=r&&(this.dMultiply(n), this.dAddOffset(s, 0), s=o=0));}0<o&&(this.dMultiply(Math.pow(e, o)), this.dAddOffset(s, 0)), i&&BigInteger.ZERO.subTo(this, this);} function bnpFromNumber(t, e, r) {
if ('number'==typeof e) if (t<2) this.fromInt(1); else for (this.fromNumber(t, r), this.testBit(t-1)||this.bitwiseTo(BigInteger.ONE.shiftLeft(t-1), op_or, this), this.isEven()&&this.dAddOffset(1, 0); !this.isProbablePrime(e);) this.dAddOffset(2, 0), this.bitLength()>t&&this.subTo(BigInteger.ONE.shiftLeft(t-1), this); else {
var n=new Array; var i=7&t; n.length=1+(t>>3), e.nextBytes(n), 0<i?n[0]&=(1<<i)-1:n[0]=0, this.fromString(n, 256);}
} function bnToByteArray() {
var t=this.t; var e=new Array; e[0]=this.s; var r; var n=this.DB-t*this.DB%8; var i=0; if (0<t--) for (n<this.DB&&(r=this[t]>>n)!=(this.s&this.DM)>>n&&(e[i++]=r|this.s<<this.DB-n); 0<=t;)n<8?(r=(this[t]&(1<<n)-1)<<8-n, r|=this[--t]>>(n+=this.DB-8)):(r=this[t]>>(n-=8)&255, n<=0&&(n+=this.DB, --t)), 0!=(128&r)&&(r|=-256), 0==i&&(128&this.s)!=(128&r)&&++i, (0<i||r!=this.s)&&(e[i++]=r); return e
} function bnEquals(t) {
return 0==this.compareTo(t);} function bnMin(t) {
return this.compareTo(t)<0?this:t;} function bnMax(t) {
return 0<this.compareTo(t)?this:t;} function bnpBitwiseTo(t, e, r) {
var n; var i; var o=Math.min(t.t, this.t); for (n=0; n<o; ++n)r[n]=e(this[n], t[n]); if (t.t<this.t) {
for (i=t.s&this.DM, n=o; n<this.t; ++n)r[n]=e(this[n], i); r.t=this.t
} else {
for (i=this.s&this.DM, n=o; n<t.t; ++n)r[n]=e(i, t[n]); r.t=t.t
}r.s=e(this.s, t.s), r.clamp();} function op_and(t, e) {
return t&e;} function bnAnd(t) {
var e=nbi(); return this.bitwiseTo(t, op_and, e), e;} function op_or(t, e) {
return t|e;} function bnOr(t) {
var e=nbi(); return this.bitwiseTo(t, op_or, e), e
} function op_xor(t, e) {
return t^e;} function bnXor(t) {
var e=nbi(); return this.bitwiseTo(t, op_xor, e), e
} function op_andnot(t, e) {
return t&~e;} function bnAndNot(t) {
var e=nbi(); return this.bitwiseTo(t, op_andnot, e), e
} function bnNot() {
for (var t=nbi(), e=0; e<this.t; ++e)t[e]=this.DM&~this[e]; return t.t=this.t, t.s=~this.s, t
} function bnShiftLeft(t) {
var e=nbi(); return t<0?this.rShiftTo(-t, e):this.lShiftTo(t, e), e
} function bnShiftRight(t) {
var e=nbi(); return t<0?this.lShiftTo(-t, e):this.rShiftTo(t, e), e;} function lbit(t) {
if (0==t) return -1; var e=0; return 0==(65535&t)&&(t>>=16, e+=16), 0==(255&t)&&(t>>=8, e+=8), 0==(15&t)&&(t>>=4, e+=4), 0==(3&t)&&(t>>=2, e+=2), 0==(1&t)&&++e, e
} function bnGetLowestSetBit() {
for (let t=0; t<this.t; ++t) if (0!=this[t]) return t*this.DB+lbit(this[t]); return this.s<0?this.t*this.DB:-1;} function cbit(t) {
for (var e=0; 0!=t;)t&=t-1, ++e; return e
} function bnBitCount() {
for (var t=0, e=this.s&this.DM, r=0; r<this.t; ++r)t+=cbit(this[r]^e); return t
} function bnTestBit(t) {
var e=Math.floor(t/this.DB); return e>=this.t?0!=this.s:0!=(this[e]&1<<t%this.DB)
} function bnpChangeBit(t, e) {
var r=BigInteger.ONE.shiftLeft(t); return this.bitwiseTo(r, e, r), r
} function bnSetBit(t) {
return this.changeBit(t, op_or);} function bnClearBit(t) {
return this.changeBit(t, op_andnot)
} function bnFlipBit(t) {
return this.changeBit(t, op_xor);} function bnpAddTo(t, e) {
for (var r=0, n=0, i=Math.min(t.t, this.t); r<i;)n+=this[r]+t[r], e[r++]=n&this.DM, n>>=this.DB; if (t.t<this.t) {
for (n+=t.s; r<this.t;)n+=this[r], e[r++]=n&this.DM, n>>=this.DB; n+=this.s;} else {
for (n+=this.s; r<t.t;)n+=t[r], e[r++]=n&this.DM, n>>=this.DB; n+=t.s
}e.s=n<0?-1:0, 0<n?e[r++]=n:n<-1&&(e[r++]=this.DV+n), e.t=r, e.clamp();} function bnAdd(t) {
var e=nbi(); return this.addTo(t, e), e
} function bnSubtract(t) {
var e=nbi(); return this.subTo(t, e), e;} function bnMultiply(t) {
var e=nbi(); return this.multiplyTo(t, e), e;} function bnSquare() {
var t=nbi(); return this.squareTo(t), t;} function bnDivide(t) {
var e=nbi(); return this.divRemTo(t, e, null), e
} function bnRemainder(t) {
var e=nbi(); return this.divRemTo(t, null, e), e;} function bnDivideAndRemainder(t) {
var e=nbi(); var r=nbi(); return this.divRemTo(t, e, r), new Array(e, r);} function bnpDMultiply(t) {
this[this.t]=this.am(0, t-1, this, 0, 0, this.t), ++this.t, this.clamp()
} function bnpDAddOffset(t, e) {
if (0!=t) {
for (;this.t<=e;) this[this.t++]=0; for (this[e]+=t; this[e]>=this.DV;) this[e]-=this.DV, ++e>=this.t&&(this[this.t++]=0), ++this[e]
}
} function NullExp() {} function nNop(t) {
return t
} function nMulTo(t, e, r) {
t.multiplyTo(e, r)
} function nSqrTo(t, e) {
t.squareTo(e);} function bnPow(t) {
return this.exp(t, new NullExp);} function bnpMultiplyLowerTo(t, e, r) {
var n; var i=Math.min(this.t+t.t, e); for (r.s=0, r.t=i; 0<i;)r[--i]=0; for (n=r.t-this.t; i<n; ++i)r[i+this.t]=this.am(0, t[i], r, i, 0, this.t); for (n=Math.min(t.t, e); i<n; ++i) this.am(0, t[i], r, i, 0, e-i); r.clamp()
} function bnpMultiplyUpperTo(t, e, r) {
--e; var n=r.t=this.t+t.t-e; for (r.s=0; 0<=--n;)r[n]=0; for (n=Math.max(e-this.t, 0); n<t.t; ++n)r[this.t+n-e]=this.am(e-n, t[n], r, 0, 0, this.t+n-e); r.clamp(), r.drShiftTo(1, r)
} function Barrett(t) {
this.r2=nbi(), this.q3=nbi(), BigInteger.ONE.dlShiftTo(2*t.t, this.r2), this.mu=this.r2.divide(t), this.m=t;} function barrettConvert(t) {
if (t.s<0||t.t>2*this.m.t) return t.mod(this.m); if (t.compareTo(this.m)<0) return t; var e=nbi(); return t.copyTo(e), this.reduce(e), e
} function barrettRevert(t) {
return t;} function barrettReduce(t) {
for (t.drShiftTo(this.m.t-1, this.r2), t.t> this.m.t+1&&(t.t=this.m.t+1, t.clamp()), this.mu.multiplyUpperTo(this.r2, this.m.t+1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t+1, this.r2); t.compareTo(this.r2)<0;)t.dAddOffset(1, this.m.t+1); for (t.subTo(this.r2, t); 0<=t.compareTo(this.m);)t.subTo(this.m, t);} function barrettSqrTo(t, e) {
t.squareTo(e), this.reduce(e);} function barrettMulTo(t, e, r) {
t.multiplyTo(e, r), this.reduce(r)
} function bnModPow(t, e) {
var r; var n; var i=t.bitLength(); var o=nbv(1); if (i<=0) return o; r=i<18?1:i<48?3:i<144?4:i<768?5:6, n=new(i<8?Classic:e.isEven()?Barrett:Montgomery)(e); var s=new Array; var a=3; var l=r-1; var u=(1<<r)-1; if (s[1]=n.convert(this), 1<r) {
var c=nbi(); for (n.sqrTo(s[1], c); a<=u;)s[a]=nbi(), n.mulTo(c, s[a-2], s[a]), a+=2;} var h; var f; var d=t.t-1; var p=!0; var g=nbi(); for (i=nbits(t[d])-1; 0<=d;) {
for (l<=i?h=t[d]>>i-l&u:(h=(t[d]&(1<<i+1)-1)<<l-i, 0<d&&(h|=t[d-1]>>this.DB+i-l)), a=r; 0==(1&h);)h>>=1, --a; if ((i-=a)<0&&(i+=this.DB, --d), p)s[h].copyTo(o), p=!1; else {
for (;1<a;)n.sqrTo(o, g), n.sqrTo(g, o), a-=2; 0<a?n.sqrTo(o, g):(f=o, o=g, g=f), n.mulTo(g, s[h], o);} for (;0<=d&&0==(t[d]&1<<i);)n.sqrTo(o, g), f=o, o=g, g=f, --i<0&&(i=this.DB-1, --d)
} return n.revert(o)
} function bnGCD(t) {
var e=this.s<0?this.negate():this.clone(); var r=t.s<0?t.negate():t.clone(); if (e.compareTo(r)<0) {
var n=e; e=r, r=n
} var i=e.getLowestSetBit(); var o=r.getLowestSetBit(); if (o<0) return e; for (i<o&&(o=i), 0<o&&(e.rShiftTo(o, e), r.rShiftTo(o, r)); 0<e.signum();)0<(i=e.getLowestSetBit())&&e.rShiftTo(i, e), 0<(i=r.getLowestSetBit())&&r.rShiftTo(i, r), 0<=e.compareTo(r)?(e.subTo(r, e), e.rShiftTo(1, e)):(r.subTo(e, r), r.rShiftTo(1, r)); return 0<o&&r.lShiftTo(o, r), r;} function bnpModInt(t) {
if (t<=0) return 0; var e=this.DV%t; var r=this.s<0?t-1:0; if (0<this.t) if (0==e)r=this[0]%t; else for (let n=this.t-1; 0<=n; --n)r=(e*r+this[n])%t; return r;} function bnModInverse(t) {
var e=t.isEven(); if (this.isEven()&&e||0==t.signum()) return BigInteger.ZERO; for (var r=t.clone(), n=this.clone(), i=nbv(1), o=nbv(0), s=nbv(0), a=nbv(1); 0!=r.signum();) {
for (;r.isEven();)r.rShiftTo(1, r), e?(i.isEven()&&o.isEven()||(i.addTo(this, i), o.subTo(t, o)), i.rShiftTo(1, i)):o.isEven()||o.subTo(t, o), o.rShiftTo(1, o); for (;n.isEven();)n.rShiftTo(1, n), e?(s.isEven()&&a.isEven()||(s.addTo(this, s), a.subTo(t, a)), s.rShiftTo(1, s)):a.isEven()||a.subTo(t, a), a.rShiftTo(1, a); 0<=r.compareTo(n)?(r.subTo(n, r), e&&i.subTo(s, i), o.subTo(a, o)):(n.subTo(r, n), e&&s.subTo(i, s), a.subTo(o, a));} return 0!=n.compareTo(BigInteger.ONE)?BigInteger.ZERO:0<=a.compareTo(t)?a.subtract(t):a.signum()<0?(a.addTo(t, a), a.signum()<0?a.add(t):a):a;}Classic.prototype.convert=cConvert, Classic.prototype.revert=cRevert, Classic.prototype.reduce=cReduce, Classic.prototype.mulTo=cMulTo, Classic.prototype.sqrTo=cSqrTo, Montgomery.prototype.convert=montConvert, Montgomery.prototype.revert=montRevert, Montgomery.prototype.reduce=montReduce, Montgomery.prototype.mulTo=montMulTo, Montgomery.prototype.sqrTo=montSqrTo, BigInteger.prototype.copyTo=bnpCopyTo, BigInteger.prototype.fromInt=bnpFromInt, BigInteger.prototype.fromString=bnpFromString, BigInteger.prototype.clamp=bnpClamp, BigInteger.prototype.dlShiftTo=bnpDLShiftTo, BigInteger.prototype.drShiftTo=bnpDRShiftTo, BigInteger.prototype.lShiftTo=bnpLShiftTo, BigInteger.prototype.rShiftTo=bnpRShiftTo, BigInteger.prototype.subTo=bnpSubTo, BigInteger.prototype.multiplyTo=bnpMultiplyTo, BigInteger.prototype.squareTo=bnpSquareTo, BigInteger.prototype.divRemTo=bnpDivRemTo, BigInteger.prototype.invDigit=bnpInvDigit, BigInteger.prototype.isEven=bnpIsEven, BigInteger.prototype.exp=bnpExp, BigInteger.prototype.toString=bnToString, BigInteger.prototype.negate=bnNegate, BigInteger.prototype.abs=bnAbs, BigInteger.prototype.compareTo=bnCompareTo, BigInteger.prototype.bitLength=bnBitLength, BigInteger.prototype.mod=bnMod, BigInteger.prototype.modPowInt=bnModPowInt, BigInteger.ZERO=nbv(0), BigInteger.ONE=nbv(1), NullExp.prototype.convert=nNop, NullExp.prototype.revert=nNop, NullExp.prototype.mulTo=nMulTo, NullExp.prototype.sqrTo=nSqrTo, Barrett.prototype.convert=barrettConvert, Barrett.prototype.revert=barrettRevert, Barrett.prototype.reduce=barrettReduce, Barrett.prototype.mulTo=barrettMulTo, Barrett.prototype.sqrTo=barrettSqrTo; var lowprimes=[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997]; var lplim=(1<<26)/lowprimes[lowprimes.length-1]; function bnIsProbablePrime(t) {
var e; var r=this.abs(); if (1==r.t&&r[0]<=lowprimes[lowprimes.length-1]) {
for (e=0; e<lowprimes.length; ++e) if (r[0]==lowprimes[e]) return !0; return !1;} if (r.isEven()) return !1; for (e=1; e<lowprimes.length;) {
for (var n=lowprimes[e], i=e+1; i<lowprimes.length&&n<lplim;)n*=lowprimes[i++]; for (n=r.modInt(n); e<i;) if (n%lowprimes[e++]==0) return !1
} return r.millerRabin(t);} function bnpMillerRabin(t) {
var e=this.subtract(BigInteger.ONE); var r=e.getLowestSetBit(); if (r<=0) return !1; var n=e.shiftRight(r); (t=t+1>>1)>lowprimes.length&&(t=lowprimes.length); for (let i=nbi(), o=0; o<t; ++o) {
i.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]); var s=i.modPow(n, this); if (0!=s.compareTo(BigInteger.ONE)&&0!=s.compareTo(e)) {
for (let a=1; a++<r&&0!=s.compareTo(e);) if (0==(s=s.modPowInt(2, this)).compareTo(BigInteger.ONE)) return !1; if (0!=s.compareTo(e)) return !1;}
} return !0
} function Arcfour() {
this.i=0, this.j=0, this.S=new Array
} function ARC4init(t) {
var e; var r; var n; for (e=0; e<256; ++e) this.S[e]=e; for (e=r=0; e<256; ++e)r=r+this.S[e]+t[e%t.length]&255, n=this.S[e], this.S[e]=this.S[r], this.S[r]=n; this.i=0, this.j=0;} function ARC4next() {
var t; return this.i=this.i+1&255, this.j=this.j+this.S[this.i]&255, t=this.S[this.i], this.S[this.i]=this.S[this.j], this.S[this.j]=t, this.S[t+this.S[this.i]&255];} function prng_newstate() {
return new Arcfour;}BigInteger.prototype.chunkSize=bnpChunkSize, BigInteger.prototype.toRadix=bnpToRadix, BigInteger.prototype.fromRadix=bnpFromRadix, BigInteger.prototype.fromNumber=bnpFromNumber, BigInteger.prototype.bitwiseTo=bnpBitwiseTo, BigInteger.prototype.changeBit=bnpChangeBit, BigInteger.prototype.addTo=bnpAddTo, BigInteger.prototype.dMultiply=bnpDMultiply, BigInteger.prototype.dAddOffset=bnpDAddOffset, BigInteger.prototype.multiplyLowerTo=bnpMultiplyLowerTo, BigInteger.prototype.multiplyUpperTo=bnpMultiplyUpperTo, BigInteger.prototype.modInt=bnpModInt, BigInteger.prototype.millerRabin=bnpMillerRabin, BigInteger.prototype.clone=bnClone, BigInteger.prototype.intValue=bnIntValue, BigInteger.prototype.byteValue=bnByteValue, BigInteger.prototype.shortValue=bnShortValue, BigInteger.prototype.signum=bnSigNum, BigInteger.prototype.toByteArray=bnToByteArray, BigInteger.prototype.equals=bnEquals, BigInteger.prototype.min=bnMin, BigInteger.prototype.max=bnMax, BigInteger.prototype.and=bnAnd, BigInteger.prototype.or=bnOr, BigInteger.prototype.xor=bnXor, BigInteger.prototype.andNot=bnAndNot, BigInteger.prototype.not=bnNot, BigInteger.prototype.shiftLeft=bnShiftLeft, BigInteger.prototype.shiftRight=bnShiftRight, BigInteger.prototype.getLowestSetBit=bnGetLowestSetBit, BigInteger.prototype.bitCount=bnBitCount, BigInteger.prototype.testBit=bnTestBit, BigInteger.prototype.setBit=bnSetBit, BigInteger.prototype.clearBit=bnClearBit, BigInteger.prototype.flipBit=bnFlipBit, BigInteger.prototype.add=bnAdd, BigInteger.prototype.subtract=bnSubtract, BigInteger.prototype.multiply=bnMultiply, BigInteger.prototype.divide=bnDivide, BigInteger.prototype.remainder=bnRemainder, BigInteger.prototype.divideAndRemainder=bnDivideAndRemainder, BigInteger.prototype.modPow=bnModPow, BigInteger.prototype.modInverse=bnModInverse, BigInteger.prototype.pow=bnPow, BigInteger.prototype.gcd=bnGCD, BigInteger.prototype.isProbablePrime=bnIsProbablePrime, BigInteger.prototype.square=bnSquare, Arcfour.prototype.init=ARC4init, Arcfour.prototype.next=ARC4next; var rng_state; var rng_pool; var rng_pptr; var rng_psize=256; function rng_seed_int(t) {
rng_pool[rng_pptr++]^=255&t, rng_pool[rng_pptr++]^=t>>8&255, rng_pool[rng_pptr++]^=t>>16&255, rng_pool[rng_pptr++]^=t>>24&255, rng_psize<=rng_pptr&&(rng_pptr-=rng_psize)
} function rng_seed_time() {
rng_seed_int((new Date).getTime());} if (null==rng_pool) {
var t; if (rng_pool=new Array, void(rng_pptr=0)!==window&&(void 0!==window.crypto||void 0!==window.msCrypto)) {
var crypto=window.crypto||window.msCrypto; if (crypto.getRandomValues) {
var ua=new Uint8Array(32); for (crypto.getRandomValues(ua), t=0; t<32; ++t)rng_pool[rng_pptr++]=ua[t];} else if ('Netscape'==navigator.appName&&navigator.appVersion<'5') {
var z=window.crypto.random(32); for (t=0; t<z.length; ++t)rng_pool[rng_pptr++]=255&z.charCodeAt(t)
}
} for (;rng_pptr<rng_psize;)t=Math.floor(65536*Math.random()), rng_pool[rng_pptr++]=t>>>8, rng_pool[rng_pptr++]=255&t; rng_pptr=0, rng_seed_time()
} function rng_get_byte() {
if (null==rng_state) {
for (rng_seed_time(), (rng_state=prng_newstate()).init(rng_pool), rng_pptr=0; rng_pptr<rng_pool.length; ++rng_pptr)rng_pool[rng_pptr]=0; rng_pptr=0
} return rng_state.next();} function rng_get_bytes(t) {
var e; for (e=0; e<t.length; ++e)t[e]=rng_get_byte();} function SecureRandom() {} function parseBigInt(t, e) {
return new BigInteger(t, e);} function linebrk(t, e) {
for (var r='', n=0; n+e<t.length;)r+=t.substring(n, n+e)+'\n', n+=e; return r+t.substring(n, t.length)
} function byte2Hex(t) {
return t<16?'0'+t.toString(16):t.toString(16);} function pkcs1pad2(t, e) {
if (e<t.length+11) throw "Message too long for RSA"; for (var r=new Array, n=t.length-1; 0<=n&&0<e;) {
var i=t.charCodeAt(n--); i<128?r[--e]=i:127<i&&i<2048?(r[--e]=63&i|128, r[--e]=i>>6|192):(r[--e]=63&i|128, r[--e]=i>>6&63|128, r[--e]=i>>12|224);}r[--e]=0; for (let o=new SecureRandom, s=new Array; 2<e;) {
for (s[0]=0; 0==s[0];)o.nextBytes(s); r[--e]=s[0];} return r[--e]=2, r[--e]=0, new BigInteger(r)
} function oaep_mgf1_arr(t, e, r) {
for (var n='', i=0; n.length<e;)n+=r(String.fromCharCode.apply(String, t.concat([(4278190080&i)>>24, (16711680&i)>>16, (65280&i)>>8, 255&i]))), i+=1; return n
} function oaep_pad(t, e, r, n) {
var i=KJUR.crypto.MessageDigest; var o=KJUR.crypto.Util; var s=null; if ('string'==typeof(r=r||'sha1')&&(s=i.getCanonicalAlgName(r), n=i.getHashLength(s), r=function(t) {
return hextorstr(o.hashHex(rstrtohex(t), s));}), t.length+2*n+2>e) throw "Message too long for RSA"; var a; var l=''; for (a=0; a<e-t.length-2*n-2; a+=1)l+='\0'; var u=r('')+l+''+t; var c=new Array(n); (new SecureRandom).nextBytes(c); var h=oaep_mgf1_arr(c, u.length, r); var f=[]; for (a=0; a<u.length; a+=1)f[a]=u.charCodeAt(a)^h.charCodeAt(a); var d=oaep_mgf1_arr(f, c.length, r); var p=[0]; for (a=0; a<c.length; a+=1)p[a+1]=c[a]^d.charCodeAt(a); return new BigInteger(p.concat(f))
} function RSAKey() {
this.n=null, this.e=0, this.d=null, this.p=null, this.q=null, this.dmp1=null, this.dmq1=null, this.coeff=null;} function RSASetPublic(t, e) {
if (this.isPublic=!0, this.isPrivate=!1, "string"!=typeof t) this.n=t, this.e=e; else {
if (!(null!=t&&null!=e&&0<t.length&&0<e.length)) throw "Invalid RSA public key"; this.n=parseBigInt(t, 16), this.e=parseInt(e, 16);}
} function RSADoPublic(t) {
return t.modPowInt(this.e, this.n);} function RSAEncrypt(t) {
var e=pkcs1pad2(t, this.n.bitLength()+7>>3); if (null==e) return null; var r=this.doPublic(e); if (null==r) return null; var n=r.toString(16); return 0==(1&n.length)?n:'0'+n;} function RSAEncryptOAEP(t, e, r) {
var n=oaep_pad(t, this.n.bitLength()+7>>3, e, r); if (null==n) return null; var i=this.doPublic(n); if (null==i) return null; var o=i.toString(16); return 0==(1&o.length)?o:'0'+o
} function pkcs1unpad2(t, e) {
for (var r=t.toByteArray(), n=0; n<r.length&&0==r[n];)++n; if (r.length-n!=e-1||2!=r[n]) return null; for (++n; 0!=r[n];) if (++n>=r.length) return null; for (var i=''; ++n<r.length;) {
var o=255&r[n]; o<128?i+=String.fromCharCode(o):191<o&&o<224?(i+=String.fromCharCode((31&o)<<6|63&r[n+1]), ++n):(i+=String.fromCharCode((15&o)<<12|(63&r[n+1])<<6|63&r[n+2]), n+=2);} return i;} function oaep_mgf1_str(t, e, r) {
for (var n='', i=0; n.length<e;)n+=r(t+String.fromCharCode.apply(String, [(4278190080&i)>>24, (16711680&i)>>16, (65280&i)>>8, 255&i])), i+=1; return n;} function oaep_unpad(t, e, r, n) {
var i=KJUR.crypto.MessageDigest; var o=KJUR.crypto.Util; var s=null; for ('string'==typeof(r=r||'sha1')&&(s=i.getCanonicalAlgName(r), n=i.getHashLength(s), r=function(t) {
return hextorstr(o.hashHex(rstrtohex(t), s));}), t=t.toByteArray(), a=0; a<t.length; a+=1)t[a]&=255; for (;t.length<e;)t.unshift(0); if ((t=String.fromCharCode.apply(String, t)).length<2*n+2) throw "Cipher too short"; var a; var l=t.substr(1,n); var u=t.substr(n+1); var c=oaep_mgf1_str(u,n,r); var h=[]; for (a=0; a<l.length; a+=1)h[a]=l.charCodeAt(a)^c.charCodeAt(a); var f=oaep_mgf1_str(String.fromCharCode.apply(String, h), t.length-n, r); var d=[]; for (a=0; a<u.length; a+=1)d[a]=u.charCodeAt(a)^f.charCodeAt(a); if ((d=String.fromCharCode.apply(String, d)).substr(0, n)!==r('')) throw "Hash mismatch"; var p=(d=d.substr(n)).indexOf(''); if ((-1!=p?d.substr(0, p).lastIndexOf('\0'):-1)+1!=p) throw "Malformed data"; return d.substr(p+1)
} function RSASetPrivate(t, e, r) {
if (this.isPrivate=!0, "string"!=typeof t) this.n=t, this.e=e, this.d=r; else {
if (!(null!=t&&null!=e&&0<t.length&&0<e.length)) throw "Invalid RSA private key"; this.n=parseBigInt(t, 16), this.e=parseInt(e, 16), this.d=parseBigInt(r, 16)
}
} function RSASetPrivateEx(t, e, r, n, i, o, s, a) {
if (this.isPrivate=!0, this.isPublic=!1, null==t) throw "RSASetPrivateEx N == null"; if (null==e) throw "RSASetPrivateEx E == null"; if (0==t.length) throw "RSASetPrivateEx N.length == 0"; if (0==e.length) throw "RSASetPrivateEx E.length == 0"; if (!(null!=t&&null!=e&&0<t.length&&0<e.length)) throw "Invalid RSA private key in RSASetPrivateEx"; this.n=parseBigInt(t, 16), this.e=parseInt(e, 16), this.d=parseBigInt(r, 16), this.p=parseBigInt(n, 16), this.q=parseBigInt(i, 16), this.dmp1=parseBigInt(o, 16), this.dmq1=parseBigInt(s, 16), this.coeff=parseBigInt(a, 16);} function RSAGenerate(t, e) {
var r=new SecureRandom; var n=t>>1; this.e=parseInt(e, 16); for (let i=new BigInteger(e, 16); ;) {
for (;this.p=new BigInteger(t-n, 1, r), 0!=this.p.subtract(BigInteger.ONE).gcd(i).compareTo(BigInteger.ONE)||!this.p.isProbablePrime(10););for (;this.q=new BigInteger(n, 1, r), 0!=this.q.subtract(BigInteger.ONE).gcd(i).compareTo(BigInteger.ONE)||!this.q.isProbablePrime(10););if (this.p.compareTo(this.q)<=0) {
var o=this.p; this.p=this.q, this.q=o;} var s=this.p.subtract(BigInteger.ONE); var a=this.q.subtract(BigInteger.ONE); var l=s.multiply(a); if (0==l.gcd(i).compareTo(BigInteger.ONE)) {
this.n=this.p.multiply(this.q), this.d=i.modInverse(l), this.dmp1=this.d.mod(s), this.dmq1=this.d.mod(a), this.coeff=this.q.modInverse(this.p); break
}
} this.isPrivate=!0;} function RSADoPrivate(t) {
if (null==this.p||null==this.q) return t.modPow(this.d, this.n); for (var e=t.mod(this.p).modPow(this.dmp1, this.p), r=t.mod(this.q).modPow(this.dmq1, this.q); e.compareTo(r)<0;)e=e.add(this.p); return e.subtract(r).multiply(this.coeff).mod(this.p).multiply(this.q).add(r);} function RSADecrypt(t) {
var e=parseBigInt(t, 16); var r=this.doPrivate(e); return null==r?null:pkcs1unpad2(r, this.n.bitLength()+7>>3)
} function RSADecryptOAEP(t, e, r) {
var n=parseBigInt(t, 16); var i=this.doPrivate(n); return null==i?null:oaep_unpad(i, this.n.bitLength()+7>>3, e, r)
}SecureRandom.prototype.nextBytes=rng_get_bytes, RSAKey.prototype.doPublic=RSADoPublic, RSAKey.prototype.setPublic=RSASetPublic, RSAKey.prototype.encrypt=RSAEncrypt, RSAKey.prototype.encryptOAEP=RSAEncryptOAEP, RSAKey.prototype.type='RSA', RSAKey.prototype.doPrivate=RSADoPrivate, RSAKey.prototype.setPrivate=RSASetPrivate, RSAKey.prototype.setPrivateEx=RSASetPrivateEx, RSAKey.prototype.generate=RSAGenerate, RSAKey.prototype.decrypt=RSADecrypt, RSAKey.prototype.decryptOAEP=RSADecryptOAEP, void 0!==KJUR&&KJUR||(KJUR={}), void 0!==KJUR.asn1&&KJUR.asn1||(KJUR.asn1={}), KJUR.asn1.ASN1Util=new function() {
this.integerToByteHex=function(t) {
var e=t.toString(16); return e.length%2==1&&(e='0'+e), e;}, this.bigIntToMinTwosComplementsHex=function(t) {
var e=t.toString(16); if ('-'!=e.substr(0, 1))e.length%2==1?e='0'+e:e.match(/^[0-7]/)||(e='00'+e); else {
var r=e.substr(1).length; r%2==1?r+=1:e.match(/^[0-7]/)||(r+=2); for (var n='', i=0; i<r; i++)n+='f'; e=new BigInteger(n, 16).xor(t).add(BigInteger.ONE).toString(16).replace(/^-/, "");} return e;}, this.getPEMStringFromHex=function(t, e) {
return hextopem(t, e)
}, this.newObject=function(t) {
var e=KJUR.asn1; var r=e.DERBoolean; var n=e.DERInteger; var i=e.DERBitString; var o=e.DEROctetString; var s=e.DERNull; var a=e.DERObjectIdentifier; var l=e.DEREnumerated; var u=e.DERUTF8String; var c=e.DERNumericString; var h=e.DERPrintableString; var f=e.DERTeletexString; var d=e.DERIA5String; var p=e.DERUTCTime; var g=e.DERGeneralizedTime; var m=e.DERSequence; var v=e.DERSet; var y=e.DERTaggedObject; var x=e.ASN1Util.newObject; var b=Object.keys(t); if (1!=b.length) throw "key of param shall be only one."; var w=b[0]; if (-1==':bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:'.indexOf(':'+w+':')) throw "undefined key: "+w; if ('bool'==w) return new r(t[w]); if ('int'==w) return new n(t[w]); if ('bitstr'==w) return new i(t[w]); if ('octstr'==w) return new o(t[w]); if ('null'==w) return new s(t[w]); if ('oid'==w) return new a(t[w]); if ('enum'==w) return new l(t[w]); if ('utf8str'==w) return new u(t[w]); if ('numstr'==w) return new c(t[w]); if ('prnstr'==w) return new h(t[w]); if ('telstr'==w) return new f(t[w]); if ('ia5str'==w) return new d(t[w]); if ('utctime'==w) return new p(t[w]); if ('gentime'==w) return new g(t[w]); if ('seq'==w) {
for (var S=t[w], C=[], A=0; A<S.length; A++) {
var T=x(S[A]); C.push(T);} return new m({ array: C })
} if ('set'==w) {
for (S=t[w], C=[], A=0; A<S.length; A++) {
T=x(S[A]); C.push(T)
} return new v({ array: C })
} if ('tag'==w) {
var k=t[w]; if ('[object Array]'===Object.prototype.toString.call(k)&&3==k.length) {
var R=x(k[2]); return new y({ tag: k[0], explicit: k[1], obj: R })
} var M={}; if (void 0!==k.explicit&&(M.explicit=k.explicit), void 0!==k.tag&&(M.tag=k.tag), void 0===k.obj) throw "obj shall be specified for 'tag'."; return M.obj=x(k.obj), new y(M);}
}, this.jsonToASN1HEX=function(t) {
return this.newObject(t).getEncodedHex()
};}, KJUR.asn1.ASN1Util.oidHexToInt=function(t) {
for (var e='', r=parseInt(t.substr(0, 2), 16), n=(e=Math.floor(r/40)+'.'+r%40, ""), i=2; i<t.length; i+=2) {
var o=('00000000'+parseInt(t.substr(i, 2), 16).toString(2)).slice(-8); if (n+=o.substr(1, 7), "0"==o.substr(0, 1))e=e+'.'+new BigInteger(n, 2).toString(10), n=''} return e
}, KJUR.asn1.ASN1Util.oidIntToHex=function(t) {
function a(t) {
var e=t.toString(16); return 1==e.length&&(e='0'+e), e;} function e(t) {
var e='', r=new BigInteger(t, 10).toString(2), n=7-r.length%7; 7==n&&(n=0); for (var i='', o=0; o<n; o++)i+='0'; for (r=i+r, o=0; o<r.length-1; o+=7) {
var s=r.substr(o, 7); o!=r.length-7&&(s='1'+s), e+=a(parseInt(s, 2))
} return e;} if (!t.match(/^[0-9.]+$/)) throw "malformed oid string: "+t; var r='', n=t.split('.'), i=40*parseInt(n[0])+parseInt(n[1]); r+=a(i), n.splice(0, 2); for (let o=0; o<n.length; o++)r+=e(n[o]); return r
}, KJUR.asn1.ASN1Object=function() {
this.getLengthHexFromValue=function() {
if (void 0===this.hV||null==this.hV) throw "this.hV is null or undefined."; if (this.hV.length%2==1) throw "value hex must be even length: n="+''.length+',v='+this.hV; var t=this.hV.length/2; var e=t.toString(16); if (e.length%2==1&&(e='0'+e), t<128) return e; var r=e.length/2; if (15<r) throw "ASN.1 length too long to represent by 8x: n = "+t.toString(16); return (128+r).toString(16)+e
}, this.getEncodedHex=function() {
return null!=this.hTLV&&!this.isModified||(this.hV=this.getFreshValueHex(), this.hL=this.getLengthHexFromValue(), this.hTLV=this.hT+this.hL+this.hV, this.isModified=!1), this.hTLV
}, this.getValueHex=function() {
return this.getEncodedHex(), this.hV;}, this.getFreshValueHex=function() {
return ""
};}, KJUR.asn1.DERAbstractString=function(t) {
KJUR.asn1.DERAbstractString.superclass.constructor.call(this); this.getString=function() {
return this.s
}, this.setString=function(t) {
this.hTLV=null, this.isModified=!0, this.s=t, this.hV=utf8tohex(this.s).toLowerCase();}, this.setStringHex=function(t) {
this.hTLV=null, this.isModified=!0, this.s=null, this.hV=t;}, this.getFreshValueHex=function() {
return this.hV;}, void 0!==t&&('string'==typeof t?this.setString(t):void 0!==t.str?this.setString(t.str):void 0!==t.hex&&this.setStringHex(t.hex));}, YAHOO.lang.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object), KJUR.asn1.DERAbstractTime=function(t) {
KJUR.asn1.DERAbstractTime.superclass.constructor.call(this); this.localDateToUTC=function(t) {
return utc=t.getTime()+6e4*t.getTimezoneOffset(), new Date(utc);}, this.formatDate=function(t, e, r) {
var n=this.zeroPadding; var i=this.localDateToUTC(t); var o=String(i.getFullYear()); "utc"==e&&(o=o.substr(2, 2)); var s=o+n(String(i.getMonth()+1), 2)+n(String(i.getDate()), 2)+n(String(i.getHours()), 2)+n(String(i.getMinutes()), 2)+n(String(i.getSeconds()), 2); if (!0===r) {
var a=i.getMilliseconds(); if (0!=a) {
var l=n(String(a), 3); s=s+'.'+(l=l.replace(/[0]+$/, ""));}
} return s+'Z'}, this.zeroPadding=function(t, e) {
return t.length>=e?t:new Array(e-t.length+1).join('0')+t
}, this.getString=function() {
return this.s
}, this.setString=function(t) {
this.hTLV=null, this.isModified=!0, this.s=t, this.hV=stohex(t)
}, this.setByDateValue=function(t, e, r, n, i, o) {
var s=new Date(Date.UTC(t, e-1, r, n, i, o, 0)); this.setByDate(s)
}, this.getFreshValueHex=function() {
return this.hV
}
}, YAHOO.lang.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object), KJUR.asn1.DERAbstractStructured=function(t) {
KJUR.asn1.DERAbstractString.superclass.constructor.call(this); this.setByASN1ObjectArray=function(t) {
this.hTLV=null, this.isModified=!0, this.asn1Array=t;}, this.appendASN1Object=function(t) {
this.hTLV=null, this.isModified=!0, this.asn1Array.push(t);}, this.asn1Array=new Array, void 0!==t&&void 0!==t.array&&(this.asn1Array=t.array);}, YAHOO.lang.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object), KJUR.asn1.DERBoolean=function() {
KJUR.asn1.DERBoolean.superclass.constructor.call(this), this.hT='01', this.hTLV='0101ff'}, YAHOO.lang.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object), KJUR.asn1.DERInteger=function(t) {
KJUR.asn1.DERInteger.superclass.constructor.call(this), this.hT='02', this.setByBigInteger=function(t) {
this.hTLV=null, this.isModified=!0, this.hV=KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t);}, this.setByInteger=function(t) {
var e=new BigInteger(String(t), 10); this.setByBigInteger(e);}, this.setValueHex=function(t) {
this.hV=t;}, this.getFreshValueHex=function() {
return this.hV
}, void 0!==t&&(void 0!==t.bigint?this.setByBigInteger(t.bigint):void 0!==t.int?this.setByInteger(t.int):'number'==typeof t?this.setByInteger(t):void 0!==t.hex&&this.setValueHex(t.hex))
}, YAHOO.lang.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object), KJUR.asn1.DERBitString=function(t) {
if (void 0!==t&&void 0!==t.obj) {
var e=KJUR.asn1.ASN1Util.newObject(t.obj); t.hex='00'+e.getEncodedHex()
}KJUR.asn1.DERBitString.superclass.constructor.call(this), this.hT='03', this.setHexValueIncludingUnusedBits=function(t) {
this.hTLV=null, this.isModified=!0, this.hV=t;}, this.setUnusedBitsAndHexValue=function(t, e) {
if (t<0||7<t) throw "unused bits shall be from 0 to 7: u = "+t; var r='0'+t; this.hTLV=null, this.isModified=!0, this.hV=r+e
}, this.setByBinaryString=function(t) {
var e=8-(t=t.replace(/0+$/, "")).length%8; 8==e&&(e=0); for (var r=0; r<=e; r++)t+='0'; var n=''; for (r=0; r<t.length-1; r+=8) {
var i=t.substr(r, 8); var o=parseInt(i, 2).toString(16); 1==o.length&&(o='0'+o), n+=o
} this.hTLV=null, this.isModified=!0, this.hV='0'+e+n
}, this.setByBooleanArray=function(t) {
for (var e='', r=0; r<t.length; r++)1==t[r]?e+='1':e+='0'; this.setByBinaryString(e);}, this.newFalseArray=function(t) {
for (var e=new Array(t), r=0; r<t; r++)e[r]=!1; return e
}, this.getFreshValueHex=function() {
return this.hV;}, void 0!==t&&('string'==typeof t&&t.toLowerCase().match(/^[0-9a-f]+$/)?this.setHexValueIncludingUnusedBits(t):void 0!==t.hex?this.setHexValueIncludingUnusedBits(t.hex):void 0!==t.bin?this.setByBinaryString(t.bin):void 0!==t.array&&this.setByBooleanArray(t.array));}, YAHOO.lang.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object), KJUR.asn1.DEROctetString=function(t) {
if (void 0!==t&&void 0!==t.obj) {
var e=KJUR.asn1.ASN1Util.newObject(t.obj); t.hex=e.getEncodedHex()
}KJUR.asn1.DEROctetString.superclass.constructor.call(this, t), this.hT='04'}, YAHOO.lang.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString), KJUR.asn1.DERNull=function() {
KJUR.asn1.DERNull.superclass.constructor.call(this), this.hT='05', this.hTLV='0500'}, YAHOO.lang.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object), KJUR.asn1.DERObjectIdentifier=function(t) {
function a(t) {
var e=t.toString(16); return 1==e.length&&(e='0'+e), e
} function o(t) {
var e='', r=new BigInteger(t, 10).toString(2), n=7-r.length%7; 7==n&&(n=0); for (var i='', o=0; o<n; o++)i+='0'; for (r=i+r, o=0; o<r.length-1; o+=7) {
var s=r.substr(o, 7); o!=r.length-7&&(s='1'+s), e+=a(parseInt(s, 2));} return e;}KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this), this.hT='06', this.setValueHex=function(t) {
this.hTLV=null, this.isModified=!0, this.s=null, this.hV=t;}, this.setValueOidString=function(t) {
if (!t.match(/^[0-9.]+$/)) throw "malformed oid string: "+t; var e='', r=t.split('.'), n=40*parseInt(r[0])+parseInt(r[1]); e+=a(n), r.splice(0, 2); for (let i=0; i<r.length; i++)e+=o(r[i]); this.hTLV=null, this.isModified=!0, this.s=null, this.hV=e
}, this.setValueName=function(t) {
var e=KJUR.asn1.x509.OID.name2oid(t); if (''===e) throw "DERObjectIdentifier oidName undefined: "+t; this.setValueOidString(e);}, this.getFreshValueHex=function() {
return this.hV
}, void 0!==t&&('string'==typeof t?t.match(/^[0-2].[0-9.]+$/)?this.setValueOidString(t):this.setValueName(t):void 0!==t.oid?this.setValueOidString(t.oid):void 0!==t.hex?this.setValueHex(t.hex):void 0!==t.name&&this.setValueName(t.name));}, YAHOO.lang.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object), KJUR.asn1.DEREnumerated=function(t) {
KJUR.asn1.DEREnumerated.superclass.constructor.call(this), this.hT='0a', this.setByBigInteger=function(t) {
this.hTLV=null, this.isModified=!0, this.hV=KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t);}, this.setByInteger=function(t) {
var e=new BigInteger(String(t), 10); this.setByBigInteger(e)
}, this.setValueHex=function(t) {
this.hV=t
}, this.getFreshValueHex=function() {
return this.hV
}, void 0!==t&&(void 0!==t.int?this.setByInteger(t.int):'number'==typeof t?this.setByInteger(t):void 0!==t.hex&&this.setValueHex(t.hex));}, YAHOO.lang.extend(KJUR.asn1.DEREnumerated, KJUR.asn1.ASN1Object), KJUR.asn1.DERUTF8String=function(t) {
KJUR.asn1.DERUTF8String.superclass.constructor.call(this, t), this.hT='0c'}, YAHOO.lang.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString), KJUR.asn1.DERNumericString=function(t) {
KJUR.asn1.DERNumericString.superclass.constructor.call(this, t), this.hT='12'}, YAHOO.lang.extend(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString), KJUR.asn1.DERPrintableString=function(t) {
KJUR.asn1.DERPrintableString.superclass.constructor.call(this, t), this.hT='13'}, YAHOO.lang.extend(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString), KJUR.asn1.DERTeletexString=function(t) {
KJUR.asn1.DERTeletexString.superclass.constructor.call(this, t), this.hT='14'}, YAHOO.lang.extend(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString), KJUR.asn1.DERIA5String=function(t) {
KJUR.asn1.DERIA5String.superclass.constructor.call(this, t), this.hT='16'}, YAHOO.lang.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString), KJUR.asn1.DERUTCTime=function(t) {
KJUR.asn1.DERUTCTime.superclass.constructor.call(this, t), this.hT='17', this.setByDate=function(t) {
this.hTLV=null, this.isModified=!0, this.date=t, this.s=this.formatDate(this.date, "utc"), this.hV=stohex(this.s)
}, this.getFreshValueHex=function() {
return void 0===this.date&&void 0===this.s&&(this.date=new Date, this.s=this.formatDate(this.date, "utc"), this.hV=stohex(this.s)), this.hV;}, void 0!==t&&(void 0!==t.str?this.setString(t.str):'string'==typeof t&&t.match(/^[0-9]{12}Z$/)?this.setString(t):void 0!==t.hex?this.setStringHex(t.hex):void 0!==t.date&&this.setByDate(t.date));}, YAHOO.lang.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime), KJUR.asn1.DERGeneralizedTime=function(t) {
KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, t), this.hT='18', this.withMillis=!1, this.setByDate=function(t) {
this.hTLV=null, this.isModified=!0, this.date=t, this.s=this.formatDate(this.date, "gen", this.withMillis), this.hV=stohex(this.s)
}, this.getFreshValueHex=function() {
return void 0===this.date&&void 0===this.s&&(this.date=new Date, this.s=this.formatDate(this.date, "gen", this.withMillis), this.hV=stohex(this.s)), this.hV;}, void 0!==t&&(void 0!==t.str?this.setString(t.str):'string'==typeof t&&t.match(/^[0-9]{14}Z$/)?this.setString(t):void 0!==t.hex?this.setStringHex(t.hex):void 0!==t.date&&this.setByDate(t.date), !0===t.millis&&(this.withMillis=!0))
}, YAHOO.lang.extend(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime), KJUR.asn1.DERSequence=function(t) {
KJUR.asn1.DERSequence.superclass.constructor.call(this, t), this.hT='30', this.getFreshValueHex=function() {
for (var t='', e=0; e<this.asn1Array.length; e++) {
t+=this.asn1Array[e].getEncodedHex()
} return this.hV=t, this.hV
}
}, YAHOO.lang.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured), KJUR.asn1.DERSet=function(t) {
KJUR.asn1.DERSet.superclass.constructor.call(this, t), this.hT='31', this.sortFlag=!0, this.getFreshValueHex=function() {
for (var t=new Array, e=0; e<this.asn1Array.length; e++) {
var r=this.asn1Array[e]; t.push(r.getEncodedHex())
} return 1==this.sortFlag&&t.sort(), this.hV=t.join(''), this.hV
}, void 0!==t&&void 0!==t.sortflag&&0==t.sortflag&&(this.sortFlag=!1);}, YAHOO.lang.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured), KJUR.asn1.DERTaggedObject=function(t) {
KJUR.asn1.DERTaggedObject.superclass.constructor.call(this), this.hT='a0', this.hV='', this.isExplicit=!0, this.asn1Object=null, this.setASN1Object=function(t, e, r) {
this.hT=e, this.isExplicit=t, this.asn1Object=r, this.isExplicit?(this.hV=this.asn1Object.getEncodedHex(), this.hTLV=null, this.isModified=!0):(this.hV=null, this.hTLV=r.getEncodedHex(), this.hTLV=this.hTLV.replace(/^../, e), this.isModified=!1)
}, this.getFreshValueHex=function() {
return this.hV
}, void 0!==t&&(void 0!==t.tag&&(this.hT=t.tag), void 0!==t.explicit&&(this.isExplicit=t.explicit), void 0!==t.obj&&(this.asn1Object=t.obj, this.setASN1Object(this.isExplicit, this.hT, this.asn1Object)))
}, YAHOO.lang.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object); var KJUR; var utf8tob64u; var b64utoutf8; var ASN1HEX=new function() {}; function Base64x() {} function stoBA(t) {
for (var e=new Array, r=0; r<t.length; r++)e[r]=t.charCodeAt(r); return e;} function BAtos(t) {
for (var e='', r=0; r<t.length; r++)e+=String.fromCharCode(t[r]); return e
} function BAtohex(t) {
for (var e='', r=0; r<t.length; r++) {
var n=t[r].toString(16); 1==n.length&&(n='0'+n), e+=n
} return e;} function stohex(t) {
return BAtohex(stoBA(t))
} function stob64(t) {
return hex2b64(stohex(t));} function stob64u(t) {
return b64tob64u(hex2b64(stohex(t)));} function b64utos(t) {
return BAtos(b64toBA(b64utob64(t)))
} function b64tob64u(t) {
return t=(t=(t=t.replace(/\=/g, "")).replace(/\+/g, "-")).replace(/\//g, "_")
} function b64utob64(t) {
return t.length%4==2?t+='==':t.length%4==3&&(t+='='), t=(t=t.replace(/-/g, "+")).replace(/_/g, "/")
} function hextob64u(t) {
return t.length%2==1&&(t='0'+t), b64tob64u(hex2b64(t));} function b64utohex(t) {
return b64tohex(b64utob64(t))
} function utf8tob64(t) {
return hex2b64(uricmptohex(encodeURIComponentAll(t)))
} function b64toutf8(t) {
return decodeURIComponent(hextouricmp(b64tohex(t)));} function utf8tohex(t) {
return uricmptohex(encodeURIComponentAll(t));} function hextoutf8(t) {
return decodeURIComponent(hextouricmp(t));} function hextorstr(t) {
for (var e='', r=0; r<t.length-1; r+=2)e+=String.fromCharCode(parseInt(t.substr(r, 2), 16)); return e;} function rstrtohex(t) {
for (var e='', r=0; r<t.length; r++)e+=('0'+t.charCodeAt(r).toString(16)).slice(-2); return e
} function hextob64(t) {
return hex2b64(t);} function hextob64nl(t) {
var e=hextob64(t).replace(/(.{64})/g, "$1\r\n"); return e=e.replace(/\r\n$/, "");} function b64nltohex(t) {
return b64tohex(t.replace(/[^0-9A-Za-z\/+=]*/g, ""));} function hextopem(t, e) {
return "-----BEGIN "+e+'-----\r\n'+hextob64nl(t)+'\r\n-----END '+e+'-----\r\n'} function pemtohex(t, e) {
if (-1==t.indexOf('-----BEGIN ')) throw "can't find PEM header: "+e; return b64nltohex(t=void 0!==e?(t=t.replace('-----BEGIN '+e+'-----', "")).replace('-----END '+e+'-----', ""):(t=t.replace(/-----BEGIN [^-]+-----/, "")).replace(/-----END [^-]+-----/, ""));} function hextoArrayBuffer(t) {
if (t.length%2!=0) throw "input is not even length"; if (null==t.match(/^[0-9A-Fa-f]+$/)) throw "input is not hexadecimal"; for (var e=new ArrayBuffer(t.length/2), r=new DataView(e), n=0; n<t.length/2; n++)r.setUint8(n, parseInt(t.substr(2*n, 2), 16)); return e;} function ArrayBuffertohex(t) {
for (var e='', r=new DataView(t), n=0; n<t.byteLength; n++)e+=('00'+r.getUint8(n).toString(16)).slice(-2); return e;} function zulutomsec(t) {
var e; var r; var n; var i; var o; var s; var a; var l; var u; var c; var h; if (h=t.match(/^(\d{2}|\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(|\.\d+)Z$/)) return l=h[1], e=parseInt(l), 2===l.length&&(50<=e&&e<100?e=1900+e:0<=e&&e<50&&(e=2e3+e)), r=parseInt(h[2])-1, n=parseInt(h[3]), i=parseInt(h[4]), o=parseInt(h[5]), s=parseInt(h[6]), a=0, ""!==(u=h[7])&&(c=(u.substr(1)+'00').substr(0, 3), a=parseInt(c)), Date.UTC(e, r, n, i, o, s, a); throw "unsupported zulu format: "+t;} function zulutosec(t) {
return ~~(zulutomsec(t)/1e3);} function zulutodate(t) {
return new Date(zulutomsec(t));} function datetozulu(t, e, r) {
var n; var i=t.getUTCFullYear(); if (e) {
if (i<1950||2049<i) throw "not proper year for UTCTime: "+i; n=(''+i).slice(-2);} else n=('000'+i).slice(-4); if (n+=('0'+(t.getUTCMonth()+1)).slice(-2), n+=('0'+t.getUTCDate()).slice(-2), n+=('0'+t.getUTCHours()).slice(-2), n+=('0'+t.getUTCMinutes()).slice(-2), n+=('0'+t.getUTCSeconds()).slice(-2), r) {
var o=t.getUTCMilliseconds(); 0!==o&&(n+='.'+(o=(o=('00'+o).slice(-3)).replace(/0+$/g, "")));} return n+='Z'} function uricmptohex(t) {
return t.replace(/%/g, "")
} function hextouricmp(t) {
return t.replace(/(..)/g, "%$1")
} function ipv6tohex(t) {
var e='malformed IPv6 address'; if (!t.match(/^[0-9A-Fa-f:]+$/)) throw e; var r=(t=t.toLowerCase()).split(':').length-1; if (r<2) throw e; var n=':'.repeat(7-r+2); var i=(t=t.replace('::', n)).split(':'); if (8!=i.length) throw e; for (let o=0; o<8; o++)i[o]=('0000'+i[o]).slice(-4); return i.join('')
} function hextoipv6(t) {
if (!t.match(/^[0-9A-Fa-f]{32}$/)) throw "malformed IPv6 address octet"; for (var e=(t=t.toLowerCase()).match(/.{1,4}/g), r=0; r<8; r++)e[r]=e[r].replace(/^0+/, ""), ""==e[r]&&(e[r]='0'); var n=(t=':'+e.join(':')+':').match(/:(0:){2,}/g); if (null===n) return t.slice(1, -1); var i=''; for (r=0; r<n.length; r++)n[r].length>i.length&&(i=n[r]); return (t=t.replace(i, "::")).slice(1, -1)
} function hextoip(t) {
var e='malformed hex value'; if (!t.match(/^([0-9A-Fa-f][0-9A-Fa-f]){1,}$/)) throw e; if (8!=t.length) return 32==t.length?hextoipv6(t):t; try {
return parseInt(t.substr(0, 2), 16)+'.'+parseInt(t.substr(2, 2), 16)+'.'+parseInt(t.substr(4, 2), 16)+'.'+parseInt(t.substr(6, 2), 16)
} catch (t) {
throw e;}
} function iptohex(t) {
var e='malformed IP address'; if (!(t=t.toLowerCase(t)).match(/^[0-9.]+$/)) {
if (t.match(/^[0-9a-f:]+$/)&&-1!==t.indexOf(':')) return ipv6tohex(t); throw e;} var r=t.split('.'); if (4!==r.length) throw e; var n=''; try {
for (let i=0; i<4; i++) {
n+=('0'+parseInt(r[i]).toString(16)).slice(-2)
} return n
} catch (t) {
throw e;}
} function encodeURIComponentAll(t) {
for (var e=encodeURIComponent(t), r='', n=0; n<e.length; n++)'%'==e[n]?(r+=e.substr(n, 3), n+=2):r=r+'%'+stohex(e[n]); return r;} function newline_toUnix(t) {
return t=t.replace(/\r\n/gm, "\n");} function newline_toDos(t) {
return t=(t=t.replace(/\r\n/gm, "\n")).replace(/\n/gm, "\r\n");} function hextoposhex(t) {
return t.length%2==1?'0'+t:'7'<t.substr(0, 1)?'00'+t:t;} function intarystrtohex(t) {
t=(t=(t=t.replace(/^\s*\[\s*/, "")).replace(/\s*\]\s*$/, "")).replace(/\s*/g, ""); try {
return t.split(/,/).map(function(t, e, r) {
var n=parseInt(t); if (n<0||255<n) throw "integer not in range 0-255"; return ('00'+n.toString(16)).slice(-2);}).join('')
} catch (t) {
throw "malformed integer array string: "+t
}
}ASN1HEX.getLblen=function(t, e) {
if ('8'!=t.substr(e+2, 1)) return 1; var r=parseInt(t.substr(e+3, 1)); return 0==r?-1:0<r&&r<10?r+1:-2;}, ASN1HEX.getL=function(t, e) {
var r=ASN1HEX.getLblen(t, e); return r<1?'':t.substr(e+2, 2*r);}, ASN1HEX.getVblen=function(t, e) {
var r; return ""==(r=ASN1HEX.getL(t, e))?-1:('8'===r.substr(0, 1)?new BigInteger(r.substr(2), 16):new BigInteger(r, 16)).intValue();}, ASN1HEX.getVidx=function(t, e) {
var r=ASN1HEX.getLblen(t, e); return r<0?r:e+2*(r+1)
}, ASN1HEX.getV=function(t, e) {
var r=ASN1HEX.getVidx(t, e); var n=ASN1HEX.getVblen(t, e); return t.substr(r, 2*n)
}, ASN1HEX.getTLV=function(t, e) {
return t.substr(e, 2)+ASN1HEX.getL(t, e)+ASN1HEX.getV(t, e);}, ASN1HEX.getNextSiblingIdx=function(t, e) {
return ASN1HEX.getVidx(t, e)+2*ASN1HEX.getVblen(t, e);}, ASN1HEX.getChildIdx=function(t, e) {
var r=ASN1HEX; var n=new Array; var i=r.getVidx(t, e); "03"==t.substr(e, 2)?n.push(i+2):n.push(i); for (let o=r.getVblen(t, e), s=i, a=0; ;) {
var l=r.getNextSiblingIdx(t, s); if (null==l||2*o<=l-i) break; if (200<=a) break; n.push(l), s=l, a++;} return n;}, ASN1HEX.getNthChildIdx=function(t, e, r) {
return ASN1HEX.getChildIdx(t, e)[r];}, ASN1HEX.getIdxbyList=function(t, e, r, n) {
var i; var o; var s=ASN1HEX; if (0!=r.length) return i=r.shift(), o=s.getChildIdx(t, e), s.getIdxbyList(t, o[i], r, n); if (void 0!==n&&t.substr(e, 2)!==n) throw "checking tag doesn't match: "+t.substr(e, 2)+'!='+n; return e;}, ASN1HEX.getTLVbyList=function(t, e, r, n) {
var i=ASN1HEX; var o=i.getIdxbyList(t, e, r); if (void 0===o) throw "can't find nthList object"; if (void 0!==n&&t.substr(o, 2)!=n) throw "checking tag doesn't match: "+t.substr(o, 2)+'!='+n; return i.getTLV(t, o);}, ASN1HEX.getVbyList=function(t, e, r, n, i) {
var o; var s; var a=ASN1HEX; if (void 0===(o=a.getIdxbyList(t, e, r, n))) throw "can't find nthList object"; return s=a.getV(t, o), !0===i&&(s=s.substr(2)), s
}, ASN1HEX.hextooidstr=function(t) {
function e(t, e) {
return t.length>=e?t:new Array(e-t.length+1).join('0')+t
} var r=[]; var n=t.substr(0,2); var i=parseInt(n, 16); r[0]=new String(Math.floor(i/40)), r[1]=new String(i%40); for (var o=t.substr(2), s=[], a=0; a<o.length/2; a++)s.push(parseInt(o.substr(2*a, 2), 16)); var l=[]; var u=''; for (a=0; a<s.length; a++)128&s[a]?u+=e((127&s[a]).toString(2), 7):(u+=e((127&s[a]).toString(2), 7), l.push(new String(parseInt(u, 2))), u=''); var c=r.join('.'); return 0<l.length&&(c=c+'.'+l.join('.')), c;}, ASN1HEX.dump=function(t, e, r, n) {
var i=ASN1HEX; var o=i.getV; var s=i.dump; var a=i.getChildIdx; var l=t; t instanceof KJUR.asn1.ASN1Object&&(l=t.getEncodedHex()); function u(t, e) {
return t.length<=2*e?t:t.substr(0, e)+'..(total '+t.length/2+'bytes)..'+t.substr(t.length-e, e);} void 0===e&&(e={ ommit_long_octet: 32 }), void 0===r&&(r=0), void 0===n&&(n=''); var c=e.ommit_long_octet; if ('01'==l.substr(r, 2)) return "00"==(h=o(l, r))?n+'BOOLEAN FALSE\n':n+'BOOLEAN TRUE\n'; if ('02'==l.substr(r, 2)) return n+'INTEGER '+u(h=o(l, r), c)+'\n'; if ('03'==l.substr(r, 2)) return n+'BITSTRING '+u(h=o(l, r), c)+'\n'; if ('04'==l.substr(r, 2)) {
var h=o(l, r); if (i.isASN1HEX(h)) {
var f=n+'OCTETSTRING, encapsulates\n'; return f+=s(h, e, 0, n+'  ')
} return n+'OCTETSTRING '+u(h, c)+'\n'} if ('05'==l.substr(r, 2)) return n+'NULL\n'; if ('06'==l.substr(r, 2)) {
var d=o(l, r); var p=KJUR.asn1.ASN1Util.oidHexToInt(d); var g=KJUR.asn1.x509.OID.oid2name(p); var m=p.replace(/\./g, " "); return ""!=g?n+'ObjectIdentifier '+g+' ('+m+')\n':n+'ObjectIdentifier ('+m+')\n'} if ('0c'==l.substr(r, 2)) return n+'UTF8String \''+hextoutf8(o(l, r))+'\'\n'; if ('13'==l.substr(r, 2)) return n+'PrintableString \''+hextoutf8(o(l, r))+'\'\n'; if ('14'==l.substr(r, 2)) return n+'TeletexString \''+hextoutf8(o(l, r))+'\'\n'; if ('16'==l.substr(r, 2)) return n+'IA5String \''+hextoutf8(o(l, r))+'\'\n'; if ('17'==l.substr(r, 2)) return n+'UTCTime '+hextoutf8(o(l, r))+'\n'; if ('18'==l.substr(r, 2)) return n+'GeneralizedTime '+hextoutf8(o(l, r))+'\n'; if ('30'==l.substr(r, 2)) {
if ('3000'==l.substr(r, 4)) return n+'SEQUENCE {}\n'; f=n+'SEQUENCE\n'; var v=e; if ((2==(b=a(l, r)).length||3==b.length)&&'06'==l.substr(b[0], 2)&&'04'==l.substr(b[b.length-1], 2)) {
g=i.oidname(o(l, b[0])); var y=JSON.parse(JSON.stringify(e)); y.x509ExtName=g, v=y
} for (var x=0; x<b.length; x++)f+=s(l, v, b[x], n+'  '); return f;} if ('31'==l.substr(r, 2)) {
f=n+'SET\n'; var b=a(l, r); for (x=0; x<b.length; x++)f+=s(l, e, b[x], n+'  '); return f
} var w=parseInt(l.substr(r, 2), 16); if (0==(128&w)) return n+'UNKNOWN('+l.substr(r, 2)+') '+o(l, r)+'\n'; var S=31&w; if (0==(32&w)) return "68747470"==(h=o(l, r)).substr(0, 8)&&(h=hextoutf8(h)), "subjectAltName"===e.x509ExtName&&2==S&&(h=hextoutf8(h)), f=n+'['+S+'] '+h+'\n'; var f=n+'['+S+']\n'; for (b=a(l, r), x=0; x<b.length; x++)f+=s(l, e, b[x], n+'  '); return f
}, ASN1HEX.isASN1HEX=function(t) {
var e=ASN1HEX; if (t.length%2==1) return !1; var r=e.getVblen(t, 0); var n=t.substr(0,2); var i=e.getL(t, 0); return t.length-n.length-i.length==2*r;}, ASN1HEX.oidname=function(t) {
var e=KJUR.asn1; KJUR.lang.String.isHex(t)&&(t=e.ASN1Util.oidHexToInt(t)); var r=e.x509.OID.oid2name(t); return ""===r&&(r=t), r
}, void 0!==KJUR&&KJUR||(KJUR={}), void 0!==KJUR.lang&&KJUR.lang||(KJUR.lang={}), KJUR.lang.String=function() {}, b64utoutf8='function'==typeof Buffer?(utf8tob64u=function(t) {
return b64tob64u(new Buffer(t, "utf8").toString('base64'));}, function(t) {
return new Buffer(b64utob64(t), "base64").toString('utf8')
}):(utf8tob64u=function(t) {
return hextob64u(uricmptohex(encodeURIComponentAll(t)));}, function(t) {
return decodeURIComponent(hextouricmp(b64utohex(t)));}), KJUR.lang.String.isInteger=function(t) {
return !!t.match(/^[0-9]+$/)||!!t.match(/^-[0-9]+$/);}, KJUR.lang.String.isHex=function(t) {
return !(t.length%2!=0||!t.match(/^[0-9a-f]+$/)&&!t.match(/^[0-9A-F]+$/))
}, KJUR.lang.String.isBase64=function(t) {
return !(!(t=t.replace(/\s+/g, "")).match(/^[0-9A-Za-z+\/]+={0,3}$/)||t.length%4!=0)
}, KJUR.lang.String.isBase64URL=function(t) {
return !t.match(/[+/=]/)&&(t=b64utob64(t), KJUR.lang.String.isBase64(t))
}, KJUR.lang.String.isIntegerArray=function(t) {
return !!(t=t.replace(/\s+/g, "")).match(/^\[[0-9,]+\]$/)
}; var strdiffidx=function(t, e) {
var r=t.length; t.length>e.length&&(r=e.length); for (let n=0; n<r; n++) if (t.charCodeAt(n)!=e.charCodeAt(n)) return n; return t.length!=e.length?r:-1;}; void 0!==KJUR&&KJUR||(KJUR={}), void 0!==KJUR.crypto&&KJUR.crypto||(KJUR.crypto={}), KJUR.crypto.Util=new function() {
this.DIGESTINFOHEAD={ sha1: "3021300906052b0e03021a05000414", sha224: "302d300d06096086480165030402040500041c", sha256: "3031300d060960864801650304020105000420", sha384: "3041300d060960864801650304020205000430", sha512: "3051300d060960864801650304020305000440", md2: "3020300c06082a864886f70d020205000410", md5: "3020300c06082a864886f70d020505000410", ripemd160: "3021300906052b2403020105000414" }, this.DEFAULTPROVIDER={ md5: "cryptojs", sha1: "cryptojs", sha224: "cryptojs", sha256: "cryptojs", sha384: "cryptojs", sha512: "cryptojs", ripemd160: "cryptojs", hmacmd5: "cryptojs", hmacsha1: "cryptojs", hmacsha224: "cryptojs", hmacsha256: "cryptojs", hmacsha384: "cryptojs", hmacsha512: "cryptojs", hmacripemd160: "cryptojs", MD5withRSA: "cryptojs/jsrsa", SHA1withRSA: "cryptojs/jsrsa", SHA224withRSA: "cryptojs/jsrsa", SHA256withRSA: "cryptojs/jsrsa", SHA384withRSA: "cryptojs/jsrsa", SHA512withRSA: "cryptojs/jsrsa", RIPEMD160withRSA: "cryptojs/jsrsa", MD5withECDSA: "cryptojs/jsrsa", SHA1withECDSA: "cryptojs/jsrsa", SHA224withECDSA: "cryptojs/jsrsa", SHA256withECDSA: "cryptojs/jsrsa", SHA384withECDSA: "cryptojs/jsrsa", SHA512withECDSA: "cryptojs/jsrsa", RIPEMD160withECDSA: "cryptojs/jsrsa", SHA1withDSA: "cryptojs/jsrsa", SHA224withDSA: "cryptojs/jsrsa", SHA256withDSA: "cryptojs/jsrsa", MD5withRSAandMGF1: "cryptojs/jsrsa", SHA1withRSAandMGF1: "cryptojs/jsrsa", SHA224withRSAandMGF1: "cryptojs/jsrsa", SHA256withRSAandMGF1: "cryptojs/jsrsa", SHA384withRSAandMGF1: "cryptojs/jsrsa", SHA512withRSAandMGF1: "cryptojs/jsrsa", RIPEMD160withRSAandMGF1: "cryptojs/jsrsa" }, this.CRYPTOJSMESSAGEDIGESTNAME={ md5: CryptoJS.algo.MD5, sha1: CryptoJS.algo.SHA1, sha224: CryptoJS.algo.SHA224, sha256: CryptoJS.algo.SHA256, sha384: CryptoJS.algo.SHA384, sha512: CryptoJS.algo.SHA512, ripemd160: CryptoJS.algo.RIPEMD160 }, this.getDigestInfoHex=function(t, e) {
if (void 0===this.DIGESTINFOHEAD[e]) throw "alg not supported in Util.DIGESTINFOHEAD: "+e; return this.DIGESTINFOHEAD[e]+t;}, this.getPaddedDigestInfoHex=function(t, e, r) {
var n=this.getDigestInfoHex(t, e); var i=r/4; if (n.length+22>i) throw "key is too short for SigAlg: keylen="+r+','+e; for (var o='00'+n, s='', a=i-'0001'.length-o.length, l=0; l<a; l+=2)s+='ff'; return "0001"+s+o
}, this.hashString=function(t, e) {
return new KJUR.crypto.MessageDigest({ alg: e }).digestString(t)
}, this.hashHex=function(t, e) {
return new KJUR.crypto.MessageDigest({ alg: e }).digestHex(t)
}, this.sha1=function(t) {
return new KJUR.crypto.MessageDigest({ alg: "sha1", prov: "cryptojs" }).digestString(t);}, this.sha256=function(t) {
return new KJUR.crypto.MessageDigest({ alg: "sha256", prov: "cryptojs" }).digestString(t);}, this.sha256Hex=function(t) {
return new KJUR.crypto.MessageDigest({ alg: "sha256", prov: "cryptojs" }).digestHex(t)
}, this.sha512=function(t) {
return new KJUR.crypto.MessageDigest({ alg: "sha512", prov: "cryptojs" }).digestString(t)
}, this.sha512Hex=function(t) {
return new KJUR.crypto.MessageDigest({ alg: "sha512", prov: "cryptojs" }).digestHex(t);}
}, KJUR.crypto.Util.md5=function(t) {
return new KJUR.crypto.MessageDigest({ alg: "md5", prov: "cryptojs" }).digestString(t)
}, KJUR.crypto.Util.ripemd160=function(t) {
return new KJUR.crypto.MessageDigest({ alg: "ripemd160", prov: "cryptojs" }).digestString(t)
}, KJUR.crypto.Util.SECURERANDOMGEN=new SecureRandom, KJUR.crypto.Util.getRandomHexOfNbytes=function(t) {
var e=new Array(t); return KJUR.crypto.Util.SECURERANDOMGEN.nextBytes(e), BAtohex(e)
}, KJUR.crypto.Util.getRandomBigIntegerOfNbytes=function(t) {
return new BigInteger(KJUR.crypto.Util.getRandomHexOfNbytes(t), 16);}, KJUR.crypto.Util.getRandomHexOfNbits=function(t) {
var e=t%8; var r=new Array(1+(t-e)/8); return KJUR.crypto.Util.SECURERANDOMGEN.nextBytes(r), r[0]=(255<<e&255^255)&r[0], BAtohex(r);}, KJUR.crypto.Util.getRandomBigIntegerOfNbits=function(t) {
return new BigInteger(KJUR.crypto.Util.getRandomHexOfNbits(t), 16);}, KJUR.crypto.Util.getRandomBigIntegerZeroToMax=function(t) {
for (let e=t.bitLength(); ;) {
var r=KJUR.crypto.Util.getRandomBigIntegerOfNbits(e); if (-1!=t.compareTo(r)) return r
}
}, KJUR.crypto.Util.getRandomBigIntegerMinToMax=function(t, e) {
var r=t.compareTo(e); if (1==r) throw "biMin is greater than biMax"; if (0==r) return t; var n=e.subtract(t); return KJUR.crypto.Util.getRandomBigIntegerZeroToMax(n).add(t);}, KJUR.crypto.MessageDigest=function(t) {
this.setAlgAndProvider=function(e, t) {
if (null!==(e=KJUR.crypto.MessageDigest.getCanonicalAlgName(e))&&void 0===t&&(t=KJUR.crypto.Util.DEFAULTPROVIDER[e]), -1!=':md5:sha1:sha224:sha256:sha384:sha512:ripemd160:'.indexOf(e)&&'cryptojs'==t) {
try {
this.md=KJUR.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[e].create();} catch (t) {
throw "setAlgAndProvider hash alg set fail alg="+e+'/'+t;} this.updateString=function(t) {
this.md.update(t);}, this.updateHex=function(t) {
var e=CryptoJS.enc.Hex.parse(t); this.md.update(e)
}, this.digest=function() {
return this.md.finalize().toString(CryptoJS.enc.Hex);}, this.digestString=function(t) {
return this.updateString(t), this.digest()
}, this.digestHex=function(t) {
return this.updateHex(t), this.digest();}
} if (-1!=':sha256:'.indexOf(e)&&'sjcl'==t) {
try {
this.md=new sjcl.hash.sha256
} catch (t) {
throw "setAlgAndProvider hash alg set fail alg="+e+'/'+t
} this.updateString=function(t) {
this.md.update(t)
}, this.updateHex=function(t) {
var e=sjcl.codec.hex.toBits(t); this.md.update(e);}, this.digest=function() {
var t=this.md.finalize(); return sjcl.codec.hex.fromBits(t);}, this.digestString=function(t) {
return this.updateString(t), this.digest();}, this.digestHex=function(t) {
return this.updateHex(t), this.digest();};}
}, this.updateString=function(t) {
throw "updateString(str) not supported for this alg/prov: "+this.algName+'/'+this.provName;}, this.updateHex=function(t) {
throw "updateHex(hex) not supported for this alg/prov: "+this.algName+'/'+this.provName;}, this.digest=function() {
throw "digest() not supported for this alg/prov: "+this.algName+'/'+this.provName
}, this.digestString=function(t) {
throw "digestString(str) not supported for this alg/prov: "+this.algName+'/'+this.provName;}, this.digestHex=function(t) {
throw "digestHex(hex) not supported for this alg/prov: "+this.algName+'/'+this.provName
}, void 0!==t&&void 0!==t.alg&&(this.algName=t.alg, void 0===t.prov&&(this.provName=KJUR.crypto.Util.DEFAULTPROVIDER[this.algName]), this.setAlgAndProvider(this.algName, this.provName));}, KJUR.crypto.MessageDigest.getCanonicalAlgName=function(t) {
return "string"==typeof t&&(t=(t=t.toLowerCase()).replace(/-/, "")), t;}, KJUR.crypto.MessageDigest.getHashLength=function(t) {
var e=KJUR.crypto.MessageDigest; var r=e.getCanonicalAlgName(t); if (void 0===e.HASHLENGTH[r]) throw "not supported algorithm: "+t; return e.HASHLENGTH[r]
}, KJUR.crypto.MessageDigest.HASHLENGTH={ md5: 16, sha1: 20, sha224: 28, sha256: 32, sha384: 48, sha512: 64, ripemd160: 20 }, KJUR.crypto.Mac=function(t) {
this.setAlgAndProvider=function(t, e) {
if (null==(t=t.toLowerCase())&&(t='hmacsha1'), "hmac"!=(t=t.toLowerCase()).substr(0, 4)) throw "setAlgAndProvider unsupported HMAC alg: "+t; void 0===e&&(e=KJUR.crypto.Util.DEFAULTPROVIDER[t]), this.algProv=t+'/'+e; var r=t.substr(4); if (-1!=':md5:sha1:sha224:sha256:sha384:sha512:ripemd160:'.indexOf(r)&&'cryptojs'==e) {
try {
var n=KJUR.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[r]; this.mac=CryptoJS.algo.HMAC.create(n, this.pass);} catch (t) {
throw "setAlgAndProvider hash alg set fail hashAlg="+r+'/'+t
} this.updateString=function(t) {
this.mac.update(t)
}, this.updateHex=function(t) {
var e=CryptoJS.enc.Hex.parse(t); this.mac.update(e);}, this.doFinal=function() {
return this.mac.finalize().toString(CryptoJS.enc.Hex);}, this.doFinalString=function(t) {
return this.updateString(t), this.doFinal();}, this.doFinalHex=function(t) {
return this.updateHex(t), this.doFinal();};}
}, this.updateString=function(t) {
throw "updateString(str) not supported for this alg/prov: "+this.algProv;}, this.updateHex=function(t) {
throw "updateHex(hex) not supported for this alg/prov: "+this.algProv;}, this.doFinal=function() {
throw "digest() not supported for this alg/prov: "+this.algProv;}, this.doFinalString=function(t) {
throw "digestString(str) not supported for this alg/prov: "+this.algProv;}, this.doFinalHex=function(t) {
throw "digestHex(hex) not supported for this alg/prov: "+this.algProv
}, this.setPassword=function(t) {
if ('string'==typeof t) {
var e=t; return t.length%2!=1&&t.match(/^[0-9A-Fa-f]+$/)||(e=rstrtohex(t)), void(this.pass=CryptoJS.enc.Hex.parse(e))
} if ('object'!=typeof t) throw "KJUR.crypto.Mac unsupported password type: "+t; e=null; if (void 0!==t.hex) {
if (t.hex.length%2!=0||!t.hex.match(/^[0-9A-Fa-f]+$/)) throw "Mac: wrong hex password: "+t.hex; e=t.hex
} if (void 0!==t.utf8&&(e=utf8tohex(t.utf8)), void 0!==t.rstr&&(e=rstrtohex(t.rstr)), void 0!==t.b64&&(e=b64tohex(t.b64)), void 0!==t.b64u&&(e=b64utohex(t.b64u)), null==e) throw "KJUR.crypto.Mac unsupported password type: "+t; this.pass=CryptoJS.enc.Hex.parse(e)
}, void 0!==t&&(void 0!==t.pass&&this.setPassword(t.pass), void 0!==t.alg&&(this.algName=t.alg, void 0===t.prov&&(this.provName=KJUR.crypto.Util.DEFAULTPROVIDER[this.algName]), this.setAlgAndProvider(this.algName, this.provName)))
}, KJUR.crypto.Signature=function(t) {
var e=null; if (this._setAlgNames=function() {
var t=this.algName.match(/^(.+)with(.+)$/); t&&(this.mdAlgName=t[1].toLowerCase(), this.pubkeyAlgName=t[2].toLowerCase())
}, this._zeroPaddingOfSignature=function(t, e) {
for (var r='', n=e/4-t.length, i=0; i<n; i++)r+='0'; return r+t;}, this.setAlgAndProvider=function(t, e) {
if (this._setAlgNames(), "cryptojs/jsrsa"!=e) throw "provider not supported: "+e; if (-1!=':md5:sha1:sha224:sha256:sha384:sha512:ripemd160:'.indexOf(this.mdAlgName)) {
try {
this.md=new KJUR.crypto.MessageDigest({ alg: this.mdAlgName })
} catch (t) {
throw "setAlgAndProvider hash alg set fail alg="+this.mdAlgName+'/'+t
} this.init=function(t, e) {
var r=null; try {
r=void 0===e?KEYUTIL.getKey(t):KEYUTIL.getKey(t, e)
} catch (t) {
throw "init failed:"+t
} if (!0===r.isPrivate) this.prvKey=r, this.state='SIGN'; else {
if (!0!==r.isPublic) throw "init failed.:"+r; this.pubKey=r, this.state='VERIFY'}
}, this.updateString=function(t) {
this.md.updateString(t)
}, this.updateHex=function(t) {
this.md.updateHex(t);}, this.sign=function() {
if (this.sHashHex=this.md.digest(), void 0!==this.ecprvhex&&void 0!==this.eccurvename) {
var t=new KJUR.crypto.ECDSA({ curve: this.eccurvename }); this.hSign=t.signHex(this.sHashHex, this.ecprvhex);} else if (this.prvKey instanceof RSAKey&&'rsaandmgf1'===this.pubkeyAlgName) this.hSign=this.prvKey.signWithMessageHashPSS(this.sHashHex, this.mdAlgName, this.pssSaltLen); else if (this.prvKey instanceof RSAKey&&'rsa'===this.pubkeyAlgName) this.hSign=this.prvKey.signWithMessageHash(this.sHashHex, this.mdAlgName); else if (this.prvKey instanceof KJUR.crypto.ECDSA) this.hSign=this.prvKey.signWithMessageHash(this.sHashHex); else {
if (!(this.prvKey instanceof KJUR.crypto.DSA)) throw "Signature: unsupported private key alg: "+this.pubkeyAlgName; this.hSign=this.prvKey.signWithMessageHash(this.sHashHex);} return this.hSign
}, this.signString=function(t) {
return this.updateString(t), this.sign()
}, this.signHex=function(t) {
return this.updateHex(t), this.sign()
}, this.verify=function(t) {
if (this.sHashHex=this.md.digest(), void 0!==this.ecpubhex&&void 0!==this.eccurvename) return new KJUR.crypto.ECDSA({ curve: this.eccurvename }).verifyHex(this.sHashHex, t, this.ecpubhex); if (this.pubKey instanceof RSAKey&&'rsaandmgf1'===this.pubkeyAlgName) return this.pubKey.verifyWithMessageHashPSS(this.sHashHex, t, this.mdAlgName, this.pssSaltLen); if (this.pubKey instanceof RSAKey&&'rsa'===this.pubkeyAlgName) return this.pubKey.verifyWithMessageHash(this.sHashHex, t); if (void 0!==KJUR.crypto.ECDSA&&this.pubKey instanceof KJUR.crypto.ECDSA) return this.pubKey.verifyWithMessageHash(this.sHashHex, t); if (void 0!==KJUR.crypto.DSA&&this.pubKey instanceof KJUR.crypto.DSA) return this.pubKey.verifyWithMessageHash(this.sHashHex, t); throw "Signature: unsupported public key alg: "+this.pubkeyAlgName
};}
}, this.init=function(t, e) {
throw "init(key, pass) not supported for this alg:prov="+this.algProvName
}, this.updateString=function(t) {
throw "updateString(str) not supported for this alg:prov="+this.algProvName;}, this.updateHex=function(t) {
throw "updateHex(hex) not supported for this alg:prov="+this.algProvName
}, this.sign=function() {
throw "sign() not supported for this alg:prov="+this.algProvName;}, this.signString=function(t) {
throw "digestString(str) not supported for this alg:prov="+this.algProvName;}, this.signHex=function(t) {
throw "digestHex(hex) not supported for this alg:prov="+this.algProvName
}, this.verify=function(t) {
throw "verify(hSigVal) not supported for this alg:prov="+this.algProvName
}, void 0!==(this.initParams=t)&&(void 0!==t.alg&&(this.algName=t.alg, void 0===t.prov?this.provName=KJUR.crypto.Util.DEFAULTPROVIDER[this.algName]:this.provName=t.prov, this.algProvName=this.algName+':'+this.provName, this.setAlgAndProvider(this.algName, this.provName), this._setAlgNames()), void 0!==t.psssaltlen&&(this.pssSaltLen=t.psssaltlen), void 0!==t.prvkeypem)) {
if (void 0!==t.prvkeypas) throw "both prvkeypem and prvkeypas parameters not supported"; try {
e=KEYUTIL.getKey(t.prvkeypem); this.init(e)
} catch (t) {
throw "fatal error to load pem private key: "+t
}
}
}, KJUR.crypto.Cipher=function(t) {}, KJUR.crypto.Cipher.encrypt=function(t, e, r) {
if (e instanceof RSAKey&&e.isPublic) {
var n=KJUR.crypto.Cipher.getAlgByKeyAndName(e, r); if ('RSA'===n) return e.encrypt(t); if ('RSAOAEP'===n) return e.encryptOAEP(t, "sha1"); var i=n.match(/^RSAOAEP(\d+)$/); if (null!==i) return e.encryptOAEP(t, "sha"+i[1]); throw "Cipher.encrypt: unsupported algorithm for RSAKey: "+r;} throw "Cipher.encrypt: unsupported key or algorithm"
}, KJUR.crypto.Cipher.decrypt=function(t, e, r) {
if (e instanceof RSAKey&&e.isPrivate) {
var n=KJUR.crypto.Cipher.getAlgByKeyAndName(e, r); if ('RSA'===n) return e.decrypt(t); if ('RSAOAEP'===n) return e.decryptOAEP(t, "sha1"); var i=n.match(/^RSAOAEP(\d+)$/); if (null!==i) return e.decryptOAEP(t, "sha"+i[1]); throw "Cipher.decrypt: unsupported algorithm for RSAKey: "+r;} throw "Cipher.decrypt: unsupported key or algorithm";}, KJUR.crypto.Cipher.getAlgByKeyAndName=function(t, e) {
if (t instanceof RSAKey) {
if (-1!=':RSA:RSAOAEP:RSAOAEP224:RSAOAEP256:RSAOAEP384:RSAOAEP512:'.indexOf(e)) return e; if (null==e) return "RSA"; throw "getAlgByKeyAndName: not supported algorithm name for RSAKey: "+e;} throw "getAlgByKeyAndName: not supported algorithm name: "+e;}, KJUR.crypto.OID=new function() {
this.oidhex2name={ "2a864886f70d010101": "rsaEncryption", "2a8648ce3d0201": "ecPublicKey", "2a8648ce380401": "dsa", "2a8648ce3d030107": "secp256r1", "2b8104001f": "secp192k1", "2b81040021": "secp224r1", "2b8104000a": "secp256k1", "2b81040023": "secp521r1", "2b81040022": "secp384r1", "2a8648ce380403": "SHA1withDSA", "608648016503040301": "SHA224withDSA", "608648016503040302": "SHA256withDSA" };}, RSAKey.getPosArrayOfChildrenFromHex=function(t) {
return ASN1HEX.getChildIdx(t, 0);}, RSAKey.getHexValueArrayOfChildrenFromHex=function(t) {
var e; var r=ASN1HEX.getV; var n=r(t,(e=RSAKey.getPosArrayOfChildrenFromHex(t))[0]); var i=r(t,e[1]); var o=r(t,e[2]); var s=r(t,e[3]); var a=r(t,e[4]); var l=r(t,e[5]); var u=r(t,e[6]); var c=r(t,e[7]); var h=r(t, e[8]); return (e=new Array).push(n, i, o, s, a, l, u, c, h), e
}, RSAKey.prototype.readPrivateKeyFromPEMString=function(t) {
var e=pemtohex(t); var r=RSAKey.getHexValueArrayOfChildrenFromHex(e); this.setPrivateEx(r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8]);}, RSAKey.prototype.readPKCS5PrvKeyHex=function(t) {
var e=RSAKey.getHexValueArrayOfChildrenFromHex(t); this.setPrivateEx(e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8]);}, RSAKey.prototype.readPKCS8PrvKeyHex=function(t) {
var e; var r; var n; var i; var o; var s; var a; var l; var u=ASN1HEX.getVbyList; if (!1===ASN1HEX.isASN1HEX(t)) throw "not ASN.1 hex string"; try {
e=u(t, 0, [2, 0, 1], "02"), r=u(t, 0, [2, 0, 2], "02"), n=u(t, 0, [2, 0, 3], "02"), i=u(t, 0, [2, 0, 4], "02"), o=u(t, 0, [2, 0, 5], "02"), s=u(t, 0, [2, 0, 6], "02"), a=u(t, 0, [2, 0, 7], "02"), l=u(t, 0, [2, 0, 8], "02")
} catch (t) {
throw "malformed PKCS#8 plain RSA private key"
} this.setPrivateEx(e, r, n, i, o, s, a, l)
}, RSAKey.prototype.readPKCS5PubKeyHex=function(t) {
var e=ASN1HEX; var r=e.getV; if (!1===e.isASN1HEX(t)) throw "keyHex is not ASN.1 hex string"; var n=e.getChildIdx(t, 0); if (2!==n.length||'02'!==t.substr(n[0], 2)||'02'!==t.substr(n[1], 2)) throw "wrong hex for PKCS#5 public key"; var i=r(t, n[0]); var o=r(t, n[1]); this.setPublic(i, o)
}, RSAKey.prototype.readPKCS8PubKeyHex=function(t) {
var e=ASN1HEX; if (!1===e.isASN1HEX(t)) throw "not ASN.1 hex string"; if ('06092a864886f70d010101'!==e.getTLVbyList(t, 0, [0, 0])) throw "not PKCS8 RSA public key"; var r=e.getTLVbyList(t, 0, [1, 0]); this.readPKCS5PubKeyHex(r);}, RSAKey.prototype.readCertPubKeyHex=function(t, e) {
var r; var n; (r=new X509).readCertHex(t), n=r.getPublicKeyHex(), this.readPKCS8PubKeyHex(n);}; var _RE_HEXDECONLY=new RegExp(''); function _rsasign_getHexPaddedDigestInfoForString(t, e, r) {
var n; var i=(n=t, KJUR.crypto.Util.hashString(n, r)); return KJUR.crypto.Util.getPaddedDigestInfoHex(i, r, e);} function _zeroPaddingOfSignature(t, e) {
for (var r='', n=e/4-t.length, i=0; i<n; i++)r+='0'; return r+t
} function pss_mgf1_str(t, e, r) {
for (var n='', i=0; n.length<e;)n+=hextorstr(r(rstrtohex(t+String.fromCharCode.apply(String, [(4278190080&i)>>24, (16711680&i)>>16, (65280&i)>>8, 255&i])))), i+=1; return n
} function _rsasign_getDecryptSignatureBI(t, e, r) {
var n=new RSAKey; return n.setPublic(e, r), n.doPublic(t)
} function _rsasign_getHexDigestInfoFromSig(t, e, r) {
return _rsasign_getDecryptSignatureBI(t, e, r).toString(16).replace(/^1f+00/, "");} function _rsasign_getAlgNameAndHashFromHexDisgestInfo(t) {
for (let e in KJUR.crypto.Util.DIGESTINFOHEAD) {
var r=KJUR.crypto.Util.DIGESTINFOHEAD[e]; var n=r.length; if (t.substring(0, n)==r) return [e, t.substring(n)]
} return [];}_RE_HEXDECONLY.compile('[^0-9a-f]', "gi"), RSAKey.prototype.sign=function(t, e) {
var r; var n=(r=t, KJUR.crypto.Util.hashString(r, e)); return this.signWithMessageHash(n, e)
}, RSAKey.prototype.signWithMessageHash=function(t, e) {
var r=parseBigInt(KJUR.crypto.Util.getPaddedDigestInfoHex(t, e, this.n.bitLength()), 16); return _zeroPaddingOfSignature(this.doPrivate(r).toString(16), this.n.bitLength());}, RSAKey.prototype.signPSS=function(t, e, r) {
var n; var i=(n=rstrtohex(t), KJUR.crypto.Util.hashHex(n, e)); return void 0===r&&(r=-1), this.signWithMessageHashPSS(i, e, r)
}, RSAKey.prototype.signWithMessageHashPSS=function(t, e, r) {
function n(t) {
return KJUR.crypto.Util.hashHex(t, e)
} var i; var o=hextorstr(t); var s=o.length; var a=this.n.bitLength()-1; var l=Math.ceil(a/8); if (-1===r||void 0===r)r=s; else if (-2===r)r=l-s-2; else if (r<-2) throw "invalid salt length"; if (l<s+r+2) throw "data too long"; var u=''; 0<r&&(u=new Array(r), (new SecureRandom).nextBytes(u), u=String.fromCharCode.apply(String, u)); var c=hextorstr(n(rstrtohex('\0\0\0\0\0\0\0\0'+o+u))); var h=[]; for (i=0; i<l-r-s-2; i+=1)h[i]=0; var f=String.fromCharCode.apply(String, h)+''+u; var d=pss_mgf1_str(c,f.length,n); var p=[]; for (i=0; i<f.length; i+=1)p[i]=f.charCodeAt(i)^d.charCodeAt(i); var g=65280>>8*l-a&255; for (p[0]&=~g, i=0; i<s; i++)p.push(c.charCodeAt(i)); return p.push(188), _zeroPaddingOfSignature(this.doPrivate(new BigInteger(p)).toString(16), this.n.bitLength());}, RSAKey.prototype.verify=function(t, e) {
var r=parseBigInt(e=(e=e.replace(_RE_HEXDECONLY, "")).replace(/[ \n]+/g, ""), 16); if (r.bitLength()> this.n.bitLength()) return 0; var n=_rsasign_getAlgNameAndHashFromHexDisgestInfo(this.doPublic(r).toString(16).replace(/^1f+00/, "")); if (0==n.length) return !1; var i; var o=n[0]; return n[1]==(i=t, KJUR.crypto.Util.hashString(i, o));}, RSAKey.prototype.verifyWithMessageHash=function(t, e) {
var r=parseBigInt(e=(e=e.replace(_RE_HEXDECONLY, "")).replace(/[ \n]+/g, ""), 16); if (r.bitLength()> this.n.bitLength()) return 0; var n=_rsasign_getAlgNameAndHashFromHexDisgestInfo(this.doPublic(r).toString(16).replace(/^1f+00/, "")); if (0==n.length) return !1; n[0]; return n[1]==t;}, RSAKey.prototype.verifyPSS=function(t, e, r, n) {
var i; var o=(i=rstrtohex(t), KJUR.crypto.Util.hashHex(i, r)); return void 0===n&&(n=-1), this.verifyWithMessageHashPSS(o, e, r, n)
}, RSAKey.prototype.verifyWithMessageHashPSS=function(t, e, r, n) {
var i=new BigInteger(e, 16); if (i.bitLength()> this.n.bitLength()) return !1; function o(t) {
return KJUR.crypto.Util.hashHex(t, r);} var s; var a=hextorstr(t); var l=a.length; var u=this.n.bitLength()-1; var c=Math.ceil(u/8); if (-1===n||void 0===n)n=l; else if (-2===n)n=c-l-2; else if (n<-2) throw "invalid salt length"; if (c<l+n+2) throw "data too long"; var h=this.doPublic(i).toByteArray(); for (s=0; s<h.length; s+=1)h[s]&=255; for (;h.length<c;)h.unshift(0); if (188!==h[c-1]) throw "encoded message does not end in 0xbc"; var f=(h=String.fromCharCode.apply(String, h)).substr(0, c-l-1); var d=h.substr(f.length,l); var p=65280>>8*c-u&255; if (0!=(f.charCodeAt(0)&p)) throw "bits beyond keysize not zero"; var g=pss_mgf1_str(d, f.length, o); var m=[]; for (s=0; s<f.length; s+=1)m[s]=f.charCodeAt(s)^g.charCodeAt(s); m[0]&=~p; var v=c-l-n-2; for (s=0; s<v; s+=1) if (0!==m[s]) throw "leftmost octets not zero"; if (1!==m[v]) throw "0x01 marker not found"; return d===hextorstr(o(rstrtohex('\0\0\0\0\0\0\0\0'+a+String.fromCharCode.apply(String, m.slice(-n)))));}, RSAKey.SALT_LEN_HLEN=-1, RSAKey.SALT_LEN_MAX=-2, RSAKey.SALT_LEN_RECOVER=-2; var jsonlint=function() {
var t; var r={}; var e=((t={ trace: function() {}, yy: {}, symbols_: { error: 2, JSONString: 3, STRING: 4, JSONNumber: 5, NUMBER: 6, JSONNullLiteral: 7, NULL: 8, JSONBooleanLiteral: 9, TRUE: 10, FALSE: 11, JSONText: 12, JSONValue: 13, EOF: 14, JSONObject: 15, JSONArray: 16, "{": 17, "}": 18, JSONMemberList: 19, JSONMember: 20, ":": 21, ",": 22, "[": 23, "]": 24, JSONElementList: 25, $accept: 0, $end: 1 }, terminals_: { 2: "error", 4: "STRING", 6: "NUMBER", 8: "NULL", 10: "TRUE", 11: "FALSE", 14: "EOF", 17: "{", 18: "}", 21: ":", 22: ",", 23: "[", 24: "]" }, productions_: [0, [3, 1], [5, 1], [7, 1], [9, 1], [9, 1], [12, 2], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [15, 2], [15, 3], [20, 3], [19, 1], [19, 3], [16, 2], [16, 3], [25, 1], [25, 3]], performAction: function(t, e, r, n, i, o, s) {
var a=o.length-1; switch (i) {
case 1: this.$=t.replace(/\\(\\|")/g, "$1").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\v/g, "\v").replace(/\\f/g, "\f").replace(/\\b/g, "\b"); break; case 2: this.$=Number(t); break; case 3: this.$=null; break; case 4: this.$=!0; break; case 5: this.$=!1; break; case 6: return this.$=o[a-1]; case 13: this.$={}; break; case 14: this.$=o[a-1]; break; case 15: this.$=[o[a-2], o[a]]; break; case 16: this.$={}, this.$[o[a][0]]=o[a][1]; break; case 17: this.$=o[a-2], o[a-2][o[a][0]]=o[a][1]; break; case 18: this.$=[]; break; case 19: this.$=o[a-1]; break; case 20: this.$=[o[a]]; break; case 21: this.$=o[a-2], o[a-2].push(o[a])
}
}, table: [{ 3: 5, 4: [1, 12], 5: 6, 6: [1, 13], 7: 3, 8: [1, 9], 9: 4, 10: [1, 10], 11: [1, 11], 12: 1, 13: 2, 15: 7, 16: 8, 17: [1, 14], 23: [1, 15] }, { 1: [3] }, { 14: [1, 16] }, { 14: [2, 7], 18: [2, 7], 22: [2, 7], 24: [2, 7] }, { 14: [2, 8], 18: [2, 8], 22: [2, 8], 24: [2, 8] }, { 14: [2, 9], 18: [2, 9], 22: [2, 9], 24: [2, 9] }, { 14: [2, 10], 18: [2, 10], 22: [2, 10], 24: [2, 10] }, { 14: [2, 11], 18: [2, 11], 22: [2, 11], 24: [2, 11] }, { 14: [2, 12], 18: [2, 12], 22: [2, 12], 24: [2, 12] }, { 14: [2, 3], 18: [2, 3], 22: [2, 3], 24: [2, 3] }, { 14: [2, 4], 18: [2, 4], 22: [2, 4], 24: [2, 4] }, { 14: [2, 5], 18: [2, 5], 22: [2, 5], 24: [2, 5] }, { 14: [2, 1], 18: [2, 1], 21: [2, 1], 22: [2, 1], 24: [2, 1] }, { 14: [2, 2], 18: [2, 2], 22: [2, 2], 24: [2, 2] }, { 3: 20, 4: [1, 12], 18: [1, 17], 19: 18, 20: 19 }, { 3: 5, 4: [1, 12], 5: 6, 6: [1, 13], 7: 3, 8: [1, 9], 9: 4, 10: [1, 10], 11: [1, 11], 13: 23, 15: 7, 16: 8, 17: [1, 14], 23: [1, 15], 24: [1, 21], 25: 22 }, { 1: [2, 6] }, { 14: [2, 13], 18: [2, 13], 22: [2, 13], 24: [2, 13] }, { 18: [1, 24], 22: [1, 25] }, { 18: [2, 16], 22: [2, 16] }, { 21: [1, 26] }, { 14: [2, 18], 18: [2, 18], 22: [2, 18], 24: [2, 18] }, { 22: [1, 28], 24: [1, 27] }, { 22: [2, 20], 24: [2, 20] }, { 14: [2, 14], 18: [2, 14], 22: [2, 14], 24: [2, 14] }, { 3: 20, 4: [1, 12], 20: 29 }, { 3: 5, 4: [1, 12], 5: 6, 6: [1, 13], 7: 3, 8: [1, 9], 9: 4, 10: [1, 10], 11: [1, 11], 13: 30, 15: 7, 16: 8, 17: [1, 14], 23: [1, 15] }, { 14: [2, 19], 18: [2, 19], 22: [2, 19], 24: [2, 19] }, { 3: 5, 4: [1, 12], 5: 6, 6: [1, 13], 7: 3, 8: [1, 9], 9: 4, 10: [1, 10], 11: [1, 11], 13: 31, 15: 7, 16: 8, 17: [1, 14], 23: [1, 15] }, { 18: [2, 17], 22: [2, 17] }, { 18: [2, 15], 22: [2, 15] }, { 22: [2, 21], 24: [2, 21] }], defaultActions: { 16: [2, 6] }, parseError: function(t, e) {
throw new Error(t)
}, parse: function(t) {
function e() {
var t; return "number"!=typeof(t=r.lexer.lex()||1)&&(t=r.symbols_[t]||t), t;} var r=this; var n=[0]; var i=[null]; var o=[]; var s=this.table; var a=""; var l=0; var u=0; var c=0; this.lexer.setInput(t), this.lexer.yy=this.yy, this.yy.lexer=this.lexer, void 0===this.lexer.yylloc&&(this.lexer.yylloc={}); var h=this.lexer.yylloc; o.push(h), "function"==typeof this.yy.parseError&&(this.parseError=this.yy.parseError); for (var f, d, p, g, m, v, y, x, b, w, S={}; ;) {
if (p=n[n.length-1], void 0===(g=this.defaultActions[p]?this.defaultActions[p]:(null==f&&(f=e()), s[p]&&s[p][f]))||!g.length||!g[0]) {
if (!c) {
for (v in b=[], s[p]) this.terminals_[v]&&2<v&&b.push('\''+this.terminals_[v]+'\''); var C=''; C=this.lexer.showPosition?'Parse error on line '+(l+1)+':\n'+this.lexer.showPosition()+'\nExpecting '+b.join(', ')+', got \''+this.terminals_[f]+'\'':'Parse error on line '+(l+1)+': Unexpected '+(1==f?'end of input':'\''+(this.terminals_[f]||f)+'\''), this.parseError(C, { text: this.lexer.match, token: this.terminals_[f]||f, line: this.lexer.yylineno, loc: h, expected: b })
} if (3==c) {
if (1==f) throw new Error(C||'Parsing halted.'); u=this.lexer.yyleng, a=this.lexer.yytext, l=this.lexer.yylineno, h=this.lexer.yylloc, f=e()
} for (;!(2..toString()in s[p]);) {
if (0==p) throw new Error(C||'Parsing halted.'); w=1, n.length=n.length-2*w, i.length=i.length-w, o.length=o.length-w, p=n[n.length-1]
}d=f, f=2, g=s[p=n[n.length-1]]&&s[p][2], c=3
} if (g[0]instanceof Array&&1<g.length) throw new Error('Parse Error: multiple actions possible at state: '+p+', token: '+f); switch (g[0]) {
case 1: n.push(f), i.push(this.lexer.yytext), o.push(this.lexer.yylloc), n.push(g[1]), f=null, d?(f=d, d=null):(u=this.lexer.yyleng, a=this.lexer.yytext, l=this.lexer.yylineno, h=this.lexer.yylloc, 0<c&&c--); break; case 2: if (y=this.productions_[g[1]][1], S.$=i[i.length-y], S._$={ first_line: o[o.length-(y||1)].first_line, last_line: o[o.length-1].last_line, first_column: o[o.length-(y||1)].first_column, last_column: o[o.length-1].last_column }, void 0!==(m=this.performAction.call(S, a, u, l, this.yy, g[1], i, o))) return m; y&&(n=n.slice(0, -1*y*2), i=i.slice(0, -1*y), o=o.slice(0, -1*y)), n.push(this.productions_[g[1]][0]), i.push(S.$), o.push(S._$), x=s[n[n.length-2]][n[n.length-1]], n.push(x); break; case 3: return !0
}
} return !0;} }).lexer={ EOF: 1, parseError: function(t, e) {
if (!this.yy.parseError) throw new Error(t); this.yy.parseError(t, e);}, setInput: function(t) {
return this._input=t, this._more=this._less=this.done=!1, this.yylineno=this.yyleng=0, this.yytext=this.matched=this.match='', this.conditionStack=['INITIAL'], this.yylloc={ first_line: 1, first_column: 0, last_line: 1, last_column: 0 }, this;}, input: function() {
var t=this._input[0]; return this.yytext+=t, this.yyleng++, this.match+=t, this.matched+=t, t.match(/\n/)&&this.yylineno++, this._input=this._input.slice(1), t;}, unput: function(t) {
return this._input=t+this._input, this;}, more: function() {
return this._more=!0, this
}, less: function(t) {
this._input=this.match.slice(t)+this._input;}, pastInput: function() {
var t=this.matched.substr(0, this.matched.length-this.match.length); return (20<t.length?'...':'')+t.substr(-20).replace(/\n/g, "")
}, upcomingInput: function() {
var t=this.match; return t.length<20&&(t+=this._input.substr(0, 20-t.length)), (t.substr(0, 20)+(20<t.length?'...':'')).replace(/\n/g, "")
}, showPosition: function() {
var t=this.pastInput(); var e=new Array(t.length+1).join('-'); return t+this.upcomingInput()+'\n'+e+'^'}, next: function() {
if (this.done) return this.EOF; var t; var e; var r; var n; var i; this._input||(this.done=!0), this._more||(this.yytext='', this.match=''); for (var o=this._currentRules(), s=0; s<o.length&&(!(r=this._input.match(this.rules[o[s]]))||e&&!(r[0].length>e[0].length)||(e=r, n=s, this.options.flex)); s++);return e?((i=e[0].match(/\n.*/g))&&(this.yylineno+=i.length), this.yylloc={ first_line: this.yylloc.last_line, last_line: this.yylineno+1, first_column: this.yylloc.last_column, last_column: i?i[i.length-1].length-1:this.yylloc.last_column+e[0].length }, this.yytext+=e[0], this.match+=e[0], this.yyleng=this.yytext.length, this._more=!1, this._input=this._input.slice(e[0].length), this.matched+=e[0], t=this.performAction.call(this, this.yy, this, o[n], this.conditionStack[this.conditionStack.length-1]), this.done&&this._input&&(this.done=!1), t||void 0):''===this._input?this.EOF:void this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), { text: "", token: null, line: this.yylineno });}, lex: function() {
var t=this.next(); return void 0!==t?t:this.lex();}, begin: function(t) {
this.conditionStack.push(t)
}, popState: function() {
return this.conditionStack.pop()
}, _currentRules: function() {
return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules
}, topState: function() {
return this.conditionStack[this.conditionStack.length-2]
}, pushState: function(t) {
this.begin(t);}, options: {}, performAction: function(t, e, r, n) {
switch (r) {
case 0: break; case 1: return 6; case 2: return e.yytext=e.yytext.substr(1, e.yyleng-2), 4; case 3: return 17; case 4: return 18; case 5: return 23; case 6: return 24; case 7: return 22; case 8: return 21; case 9: return 10; case 10: return 11; case 11: return 8; case 12: return 14; case 13: return "INVALID"
}
}, rules: [/^(?:\s+)/, /^(?:(-?([0-9]|[1-9][0-9]+))(\.[0-9]+)?([eE][-+]?[0-9]+)?\b)/, /^(?:"(?:\\[\\"bfnrt/]|\\u[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*")/, /^(?:\{)/, /^(?:\})/, /^(?:\[)/, /^(?:\])/, /^(?:,)/, /^(?::)/, /^(?:true\b)/, /^(?:false\b)/, /^(?:null\b)/, /^(?:$)/, /^(?:.)/], conditions: { INITIAL: { rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], inclusive: !0 } } }, t); return void 0!==r&&(r.parser=e, r.parse=function() {
return e.parse.apply(e, arguments);}, !(r.main=function(t) {
if (!t[1]) throw new Error('Usage: '+t[0]+' FILE'); if ('undefined'!=typeof process) var e=(!0)('fs').readFileSync((!0)('path').join(process.cwd(), t[1]), "utf8"); else e=(!0)('file').path((!0)('file').cwd()).join(t[1]).read({ charset: "utf-8" }); return r.parser.parse(e)
})===(!0).main&&r.main('undefined'!=typeof process?process.argv.slice(1):(!0)('system').args)), r
}(); !function(t, e) {
"object"==typeof exports&&'undefined'!=typeof module?module.exports=e():'function'==typeof define&&define.amd?define(e):(t=t||self).CodeMirror=e();}(this, function() {
"use strict"; var t=navigator.userAgent; var e=navigator.platform; var g=/gecko\/\d/i.test(t); var r=/MSIE \d/.test(t); var n=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(t); var i=/Edge\/(\d+)/.exec(t); var w=r||n||i; var S=w&&(r?document.documentMode||6:+(i||n)[1]); var x=!i&&/WebKit\//.test(t); var o=x&&/Qt\/\d+\.\d+/.test(t); var s=!i&&/Chrome\//.test(t); var m=/Opera\//.test(t); var l=/Apple Computer/.test(navigator.vendor); var a=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(t); var u=/PhantomJS/.test(t); var c=!i&&/AppleWebKit/.test(t)&&/Mobile\/\w+/.test(t); var h=/Android/.test(t); var f=c||h||/webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(t); var b=c||/Mac/.test(e); var d=/\bCrOS\b/.test(t); var p=/win/i.test(e); var v=m&&t.match(/Version\/(\d*\.\d*)/); (v=v&&Number(v[1]))&&15<=v&&(x=!(m=!1)); var y=b&&(o||m&&(null==v||v<12.11)); var C=g||w&&9<=S; function A(t) {
return new RegExp('(^|\\s)'+t+'(?:$|\\s)\\s*')
} var T; var k=function(t, e) {
var r=t.className; var n=A(e).exec(r); if (n) {
var i=r.slice(n.index+n[0].length); t.className=r.slice(0, n.index)+(i?n[1]+i:'')
}
}; function R(t) {
for (let e=t.childNodes.length; 0<e; --e)t.removeChild(t.firstChild); return t
} function M(t, e) {
return R(t).appendChild(e);} function E(t, e, r, n) {
var i=document.createElement(t); if (r&&(i.className=r), n&&(i.style.cssText=n), "string"==typeof e)i.appendChild(document.createTextNode(e)); else if (e) for (let o=0; o<e.length; ++o)i.appendChild(e[o]); return i;} function L(t, e, r, n) {
var i=E(t, e, r, n); return i.setAttribute('role', "presentation"), i
} function N(t, e) {
if (3==e.nodeType&&(e=e.parentNode), t.contains) return t.contains(e); do {
if (11==e.nodeType&&(e=e.host), e==t) return !0;} while (e=e.parentNode);} function D() {
var e; try {
e=document.activeElement
} catch (t) {
e=document.body||null;} for (;e&&e.shadowRoot&&e.shadowRoot.activeElement;)e=e.shadowRoot.activeElement; return e;} function I(t, e) {
var r=t.className; A(e).test(r)||(t.className+=(r?' ':'')+e)
} function B(t, e) {
for (let r=t.split(' '), n=0; n<r.length; n++)r[n]&&!A(r[n]).test(e)&&(e+=' '+r[n]); return e
}T=document.createRange?function(t, e, r, n) {
var i=document.createRange(); return i.setEnd(n||t, r), i.setStart(t, e), i;}:function(t, e, r) {
var n=document.body.createTextRange(); try {
n.moveToElementText(t.parentNode);} catch (t) {
return n;} return n.collapse(!0), n.moveEnd('character', r), n.moveStart('character', e), n
}; var O=function(t) {
t.select()
}; function H(t) {
var e=Array.prototype.slice.call(arguments, 1); return function() {
return t.apply(null, e)
}
} function P(t, e, r) {
for (let n in e=e||{}, t)!t.hasOwnProperty(n)||!1===r&&e.hasOwnProperty(n)||(e[n]=t[n]); return e
} function _(t, e, r, n, i) {
null==e&&-1==(e=t.search(/[^\s\u00a0]/))&&(e=t.length); for (let o=n||0, s=i||0; ;) {
var a=t.indexOf('\t', o); if (a<0||e<=a) return s+(e-o); s+=a-o, s+=r-s%r, o=a+1;}
}c?O=function(t) {
t.selectionStart=0, t.selectionEnd=t.value.length
}:w&&(O=function(t) {
try {
t.select();} catch (t) {}
}); var U=function() {
this.id=null, this.f=null, this.time=0, this.handler=H(this.onTimeout, this);}; function K(t, e) {
for (let r=0; r<t.length; ++r) if (t[r]==e) return r; return -1;}U.prototype.onTimeout=function(t) {
t.id=0, t.time<=+new Date?t.f():setTimeout(t.handler, t.time-new Date);}, U.prototype.set=function(t, e) {
this.f=e; var r=+new Date+t; (!this.id||r<this.time)&&(clearTimeout(this.id), this.id=setTimeout(this.handler, t), this.time=r)
}; var j=30; var F={toString:function(){return"CodeMirror.Pass"}}; var z={scroll:!1}; var W={origin:"*mouse"}; var J={ origin: "+move" }; function V(t, e, r) {
for (let n=0, i=0; ;) {
var o=t.indexOf('\t', n); -1==o&&(o=t.length); var s=o-n; if (o==t.length||e<=i+s) return n+Math.min(s, e-i); if (i+=o-n, n=o+1, e<=(i+=r-i%r)) return n;}
} var q=['']; function G(t) {
for (;q.length<=t;)q.push($(q)+' '); return q[t];} function $(t) {
return t[t.length-1];} function X(t, e) {
for (var r=[], n=0; n<t.length; n++)r[n]=e(t[n], n); return r;} function Y() {} function Z(t, e) {
var r; return r=Object.create?Object.create(t):(Y.prototype=t, new Y), e&&P(e, r), r;} var Q=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/; function tt(t) {
return /\w/.test(t)||''<t&&(t.toUpperCase()!=t.toLowerCase()||Q.test(t))
} function et(t, e) {
return e?!!(-1<e.source.indexOf('\\w')&&tt(t))||e.test(t):tt(t)
} function rt(t) {
for (let e in t) if (t.hasOwnProperty(e)&&t[e]) return; return 1
} var nt=/[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/; function it(t) {
return 768<=t.charCodeAt(0)&&nt.test(t)
} function ot(t, e, r) {
for (;(r<0?0<e:e<t.length)&&it(t.charAt(e));)e+=r; return e;} function st(t, e, r) {
for (let n=r<e?-1:1; ;) {
if (e==r) return e; var i=(e+r)/2; var o=n<0?Math.ceil(i):Math.floor(i); if (o==e) return t(o)?e:r; t(o)?r=o:e=o+n;}
} var at=null; function lt(t, e, r) {
var n; at=null; for (let i=0; i<t.length; ++i) {
var o=t[i]; if (o.from<e&&o.to>e) return i; o.to==e&&(o.from!=o.to&&'before'==r?n=i:at=i), o.from==e&&(o.from!=o.to&&'before'!=r?n=i:at=i)
} return null!=n?n:at
} var ut; var ct; var ht; var ft; var dt; var pt; var gt; var mt=(ut='bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN', ct='nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111', ht=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/, ft=/[stwN]/, dt=/[LRr]/, pt=/[Lb1n]/, gt=/[1n]/, function(t, e) {
var r='ltr'==e?'L':'R'; if (0==t.length||'ltr'==e&&!ht.test(t)) return !1; for (var n, i=t.length, o=[], s=0; s<i; ++s)o.push((n=t.charCodeAt(s))<=247?ut.charAt(n):1424<=n&&n<=1524?'R':1536<=n&&n<=1785?ct.charAt(n-1536):1774<=n&&n<=2220?'r':8192<=n&&n<=8203?'w':8204==n?'b':'L'); for (let a=0, l=r; a<i; ++a) {
var u=o[a]; "m"==u?o[a]=l:l=u
} for (let c=0, h=r; c<i; ++c) {
var f=o[c]; "1"==f&&'r'==h?o[c]='n':dt.test(f)&&'r'==(h=f)&&(o[c]='R')
} for (let d=1, p=o[0]; d<i-1; ++d) {
var g=o[d]; "+"==g&&'1'==p&&'1'==o[d+1]?o[d]='1':','!=g||p!=o[d+1]||'1'!=p&&'n'!=p||(o[d]=p), p=g;} for (let m=0; m<i; ++m) {
var v=o[m]; if (','==v)o[m]='N'; else if ('%'==v) {
var y=void 0; for (y=m+1; y<i&&'%'==o[y]; ++y);for (let x=m&&'!'==o[m-1]||y<i&&'1'==o[y]?'1':'N', b=m; b<y; ++b)o[b]=x; m=y-1
}
} for (let w=0, S=r; w<i; ++w) {
var C=o[w]; "L"==S&&'1'==C?o[w]='L':dt.test(C)&&(S=C);} for (let A=0; A<i; ++A) if (ft.test(o[A])) {
var T=void 0; for (T=A+1; T<i&&ft.test(o[T]); ++T);for (let k='L'==(A?o[A-1]:r), R=k==('L'==(T<i?o[T]:r))?k?'L':'R':r, M=A; M<T; ++M)o[M]=R; A=T-1;} for (var L, E=[], N=0; N<i;) if (pt.test(o[N])) {
var D=N; for (++N; N<i&&pt.test(o[N]); ++N);E.push(new vt(0, D, N))
} else {
var I=N; var B=E.length; for (++N; N<i&&'L'!=o[N]; ++N);for (let O=I; O<N;) if (gt.test(o[O])) {
I<O&&E.splice(B, 0, new vt(1, I, O)); var H=O; for (++O; O<N&&gt.test(o[O]); ++O);E.splice(B, 0, new vt(2, H, O)), I=O;} else ++O; I<N&&E.splice(B, 0, new vt(1, I, N))
} return "ltr"==e&&(1==E[0].level&&(L=t.match(/^\s+/))&&(E[0].from=L[0].length, E.unshift(new vt(0, 0, L[0].length))), 1==$(E).level&&(L=t.match(/\s+$/))&&($(E).to-=L[0].length, E.push(new vt(0, i-L[0].length, i)))), "rtl"==e?E.reverse():E;}); function vt(t, e, r) {
this.level=t, this.from=e, this.to=r;} function yt(t, e) {
var r=t.order; return null==r&&(r=t.order=mt(t.text, e)), r;} var xt=[]; var bt=function(t, e, r) {
if (t.addEventListener)t.addEventListener(e, r, !1); else if (t.attachEvent)t.attachEvent('on'+e, r); else {
var n=t._handlers||(t._handlers={}); n[e]=(n[e]||xt).concat(r)
}
}; function wt(t, e) {
return t._handlers&&t._handlers[e]||xt
} function St(t, e, r) {
if (t.removeEventListener)t.removeEventListener(e, r, !1); else if (t.detachEvent)t.detachEvent('on'+e, r); else {
var n=t._handlers; var i=n&&n[e]; if (i) {
var o=K(i, r); -1<o&&(n[e]=i.slice(0, o).concat(i.slice(o+1)));}
}
} function Ct(t, e) {
var r=wt(t, e); if (r.length) for (let n=Array.prototype.slice.call(arguments, 2), i=0; i<r.length; ++i)r[i].apply(null, n);} function At(t, e, r) {
return "string"==typeof e&&(e={ type: e, preventDefault: function() {
this.defaultPrevented=!0
} }), Ct(t, r||e.type, t, e), Et(e)||e.codemirrorIgnore;} function Tt(t) {
var e=t._handlers&&t._handlers.cursorActivity; if (e) for (let r=t.curOp.cursorActivityHandlers||(t.curOp.cursorActivityHandlers=[]), n=0; n<e.length; ++n)-1==K(r, e[n])&&r.push(e[n]);} function kt(t, e) {
return 0<wt(t, e).length;} function Rt(t) {
t.prototype.on=function(t, e) {
bt(this, t, e)
}, t.prototype.off=function(t, e) {
St(this, t, e);};} function Mt(t) {
t.preventDefault?t.preventDefault():t.returnValue=!1
} function Lt(t) {
t.stopPropagation?t.stopPropagation():t.cancelBubble=!0
} function Et(t) {
return null!=t.defaultPrevented?t.defaultPrevented:0==t.returnValue;} function Nt(t) {
Mt(t), Lt(t)
} function Dt(t) {
return t.target||t.srcElement;} function It(t) {
var e=t.which; return null==e&&(1&t.button?e=1:2&t.button?e=3:4&t.button&&(e=2)), b&&t.ctrlKey&&1==e&&(e=3), e;} var Bt; var Ot; var Ht=function() {
if (w&&S<9) return !1; var t=E('div'); return "draggable"in t||'dragDrop'in t
}(); function Pt(t) {
if (null==Bt) {
var e=E('span', "​"); M(t, E('span', [e, document.createTextNode('x')])), 0!=t.firstChild.offsetHeight&&(Bt=e.offsetWidth<=1&&2<e.offsetHeight&&!(w&&S<8))
} var r=Bt?E('span', "​"):E('span', " ", null, "display: inline-block; width: 1px; margin-right: -1px"); return r.setAttribute('cm-text', ""), r
} function _t(t) {
if (null!=Ot) return Ot; var e=M(t, document.createTextNode('AخA')); var r=T(e,0,1).getBoundingClientRect(); var n=T(e, 1, 2).getBoundingClientRect(); return R(t), r&&r.left!=r.right&&(Ot=n.right-r.right<3);} var Ut; var Kt=3!="\n\nb".split(/\n/).length?function(t){for(var e=0,r=[],n=t.length;e<=n;){var i=t.indexOf("\n",e);-1==i&&(i=t.length);var o=t.slice(e,"\r"==t.charAt(i-1)?i-1:i),s=o.indexOf("\r");-1!=s?(r.push(o.slice(0,s)),e+=s+1):(r.push(o),e=i+1)}return r}:function(t){return t.split(/\r\n?|\n/)}; var jt=window.getSelection?function(t){try{return t.selectionStart!=t.selectionEnd}catch(t){return!1}}:function(t){var e;try{e=t.ownerDocument.selection.createRange()}catch(t){}return!(!e||e.parentElement()!=t)&&0!=e.compareEndPoints("StartToEnd",e)}; var Ft="oncopy"in(Ut=E("div"))||(Ut.setAttribute("oncopy","return;"),"function"==typeof Ut.oncopy); var zt=null; var Wt={}; var Jt={}; function Vt(t) {
if ('string'==typeof t&&Jt.hasOwnProperty(t))t=Jt[t]; else if (t&&'string'==typeof t.name&&Jt.hasOwnProperty(t.name)) {
var e=Jt[t.name]; "string"==typeof e&&(e={ name: e }), (t=Z(e, t)).name=e.name;} else {
if ('string'==typeof t&&/^[\w\-]+\/[\w\-]+\+xml$/.test(t)) return Vt('application/xml'); if ('string'==typeof t&&/^[\w\-]+\/[\w\-]+\+json$/.test(t)) return Vt('application/json');} return "string"==typeof t?{ name: t }:t||{ name: "null" };} function qt(t, e) {
e=Vt(e); var r=Wt[e.name]; if (!r) return qt(t, "text/plain"); var n=r(t, e); if (Gt.hasOwnProperty(e.name)) {
var i=Gt[e.name]; for (let o in i)i.hasOwnProperty(o)&&(n.hasOwnProperty(o)&&(n['_'+o]=n[o]), n[o]=i[o])
} if (n.name=e.name, e.helperType&&(n.helperType=e.helperType), e.modeProps) for (let s in e.modeProps)n[s]=e.modeProps[s]; return n
} var Gt={}; function $t(t, e) {
P(e, Gt.hasOwnProperty(t)?Gt[t]:Gt[t]={})
} function Xt(t, e) {
if (!0===e) return e; if (t.copyState) return t.copyState(e); var r={}; for (let n in e) {
var i=e[n]; i instanceof Array&&(i=i.concat([])), r[n]=i
} return r;} function Yt(t, e) {
for (var r; t.innerMode&&(r=t.innerMode(e))&&r.mode!=t;)e=r.state, t=r.mode; return r||{ mode: t, state: e }
} function Zt(t, e, r) {
return !t.startState||t.startState(e, r)
} var Qt=function(t, e, r) {
this.pos=this.start=0, this.string=t, this.tabSize=e||8, this.lastColumnPos=this.lastColumnValue=0, this.lineStart=0, this.lineOracle=r
}; function te(t, e) {
if ((e-=t.first)<0||e>=t.size) throw new Error('There is no line '+(e+t.first)+' in the document.'); for (var r=t; !r.lines;) for (let n=0; ;++n) {
var i=r.children[n]; var o=i.chunkSize(); if (e<o) {
r=i; break;}e-=o;} return r.lines[e]
} function ee(t, r, n) {
var i=[]; var o=r.line; return t.iter(r.line, n.line+1, function(t) {
var e=t.text; o==n.line&&(e=e.slice(0, n.ch)), o==r.line&&(e=e.slice(r.ch)), i.push(e), ++o;}), i;} function re(t, e, r) {
var n=[]; return t.iter(e, r, function(t) {
n.push(t.text);}), n;} function ne(t, e) {
var r=e-t.height; if (r) for (let n=t; n; n=n.parent)n.height+=r
} function ie(t) {
if (null==t.parent) return null; for (var e=t.parent, r=K(e.lines, t), n=e.parent; n; n=(e=n).parent) for (let i=0; n.children[i]!=e; ++i)r+=n.children[i].chunkSize(); return r+e.first
} function oe(t, e) {
var r=t.first; t:do {
for (let n=0; n<t.children.length; ++n) {
var i=t.children[n]; var o=i.height; if (e<o) {
t=i; continue t
}e-=o, r+=i.chunkSize();} return r;} while (!t.lines);for (var s=0; s<t.lines.length; ++s) {
var a=t.lines[s].height; if (e<a) break; e-=a;} return r+s
} function se(t, e) {
return e>=t.first&&e<t.first+t.size
} function ae(t, e) {
return String(t.lineNumberFormatter(e+t.firstLineNumber))
} function le(t, e, r) {
if (void 0===r&&(r=null), !(this instanceof le)) return new le(t, e, r); this.line=t, this.ch=e, this.sticky=r;} function ue(t, e) {
return t.line-e.line||t.ch-e.ch;} function ce(t, e) {
return t.sticky==e.sticky&&0==ue(t, e);} function he(t) {
return le(t.line, t.ch)
} function fe(t, e) {
return ue(t, e)<0?e:t
} function de(t, e) {
return ue(t, e)<0?t:e;} function pe(t, e) {
return Math.max(t.first, Math.min(e, t.first+t.size-1));} function ge(t, e) {
if (e.line<t.first) return le(t.first, 0); var r; var n; var i; var o=t.first+t.size-1; return e.line>o?le(o, te(t, o).text.length):(n=te(t, (r=e).line).text.length, null==(i=r.ch)||n<i?le(r.line, n):i<0?le(r.line, 0):r);} function me(t, e) {
for (var r=[], n=0; n<e.length; n++)r[n]=ge(t, e[n]); return r
}Qt.prototype.eol=function() {
return this.pos>=this.string.length
}, Qt.prototype.sol=function() {
return this.pos==this.lineStart
}, Qt.prototype.peek=function() {
return this.string.charAt(this.pos)||void 0
}, Qt.prototype.next=function() {
if (this.pos<this.string.length) return this.string.charAt(this.pos++)
}, Qt.prototype.eat=function(t) {
var e=this.string.charAt(this.pos); if ('string'==typeof t?e==t:e&&(t.test?t.test(e):t(e))) return ++this.pos, e;}, Qt.prototype.eatWhile=function(t) {
for (var e=this.pos; this.eat(t););return this.pos>e
}, Qt.prototype.eatSpace=function() {
for (var t=this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos; return this.pos>t
}, Qt.prototype.skipToEnd=function() {
this.pos=this.string.length
}, Qt.prototype.skipTo=function(t) {
var e=this.string.indexOf(t, this.pos); if (-1<e) return this.pos=e, !0
}, Qt.prototype.backUp=function(t) {
this.pos-=t;}, Qt.prototype.column=function() {
return this.lastColumnPos<this.start&&(this.lastColumnValue=_(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos=this.start), this.lastColumnValue-(this.lineStart?_(this.string, this.lineStart, this.tabSize):0)
}, Qt.prototype.indentation=function() {
return _(this.string, null, this.tabSize)-(this.lineStart?_(this.string, this.lineStart, this.tabSize):0)
}, Qt.prototype.match=function(t, e, r) {
if ('string'!=typeof t) {
var n=this.string.slice(this.pos).match(t); return n&&0<n.index?null:(n&&!1!==e&&(this.pos+=n[0].length), n);} function i(t) {
return r?t.toLowerCase():t;} if (i(this.string.substr(this.pos, t.length))==i(t)) return !1!==e&&(this.pos+=t.length), !0
}, Qt.prototype.current=function() {
return this.string.slice(this.start, this.pos)
}, Qt.prototype.hideFirstChars=function(t, e) {
this.lineStart+=t; try {
return e();} finally {
this.lineStart-=t;}
}, Qt.prototype.lookAhead=function(t) {
var e=this.lineOracle; return e&&e.lookAhead(t)
}, Qt.prototype.baseToken=function() {
var t=this.lineOracle; return t&&t.baseToken(this.pos);}; var ve=function(t, e) {
this.state=t, this.lookAhead=e
}; var ye=function(t, e, r, n) {
this.state=e, this.doc=t, this.line=r, this.maxLookAhead=n||0, this.baseTokens=null, this.baseTokenPos=1;}; function xe(e, r, n, t) {
var l=[e.state.modeGen]; var i={}; Me(e, r.text, e.doc.mode, n, function(t, e) {
return l.push(t, e)
}, i, t); for (var u=n.state, o=function(t) {
n.baseTokens=l; var o=e.state.overlays[t]; var s=1; var a=0; n.state=!0, Me(e, r.text, o.mode, n, function(t, e) {
for (var r=s; a<t;) {
var n=l[s]; t<n&&l.splice(s, 1, t, l[s+1], n), s+=2, a=Math.min(t, n)
} if (e) if (o.opaque)l.splice(r, s-r, t, "overlay "+e), s=r+2; else for (;r<s; r+=2) {
var i=l[r+1]; l[r+1]=(i?i+' ':'')+'overlay '+e
}
}, i), n.state=u, n.baseTokens=null, n.baseTokenPos=1;}, s=0; s<e.state.overlays.length; ++s)o(s); return { styles: l, classes: i.bgClass||i.textClass?i:null }
} function be(t, e, r) {
if (!e.styles||e.styles[0]!=t.state.modeGen) {
var n=we(t, ie(e)); var i=e.text.length>t.options.maxHighlightLength&&Xt(t.doc.mode,n.state); var o=xe(t, e, n); i&&(n.state=i), e.stateAfter=n.save(!i), e.styles=o.styles, o.classes?e.styleClasses=o.classes:e.styleClasses&&(e.styleClasses=null), r===t.doc.highlightFrontier&&(t.doc.modeFrontier=Math.max(t.doc.modeFrontier, ++t.doc.highlightFrontier));} return e.styles;} function we(r, n, t) {
var e=r.doc; var i=r.display; if (!e.mode.startState) return new ye(e, !0, n); var o=function(t, e, r) {
for (var n, i, o=t.doc, s=r?-1:e-(t.doc.mode.innerMode?1e3:100), a=e; s<a; --a) {
if (a<=o.first) return o.first; var l=te(o, a-1); var u=l.stateAfter; if (u&&(!r||a+(u instanceof ve?u.lookAhead:0)<=o.modeFrontier)) return a; var c=_(l.text, null, t.options.tabSize); (null==i||c<n)&&(i=a-1, n=c);} return i;}(r, n, t); var s=o>e.first&&te(e,o-1).stateAfter; var a=s?ye.fromSaved(e, s, o):new ye(e, Zt(e.mode), o); return e.iter(o, n, function(t) {
Se(r, t.text, a); var e=a.line; t.stateAfter=e==n-1||e%5==0||e>=i.viewFrom&&e<i.viewTo?a.save():null, a.nextLine()
}), t&&(e.modeFrontier=a.line), a;} function Se(t, e, r, n) {
var i=t.doc.mode; var o=new Qt(e, t.options.tabSize, r); for (o.start=o.pos=n||0, ""==e&&Ce(i, r.state); !o.eol();)Ae(i, o, r.state), o.start=o.pos;} function Ce(t, e) {
if (t.blankLine) return t.blankLine(e); if (t.innerMode) {
var r=Yt(t, e); return r.mode.blankLine?r.mode.blankLine(r.state):void 0
}
} function Ae(t, e, r, n) {
for (let i=0; i<10; i++) {
n&&(n[0]=Yt(t, r).mode); var o=t.token(e, r); if (e.pos>e.start) return o
} throw new Error('Mode '+t.name+' failed to advance stream.');}ye.prototype.lookAhead=function(t) {
var e=this.doc.getLine(this.line+t); return null!=e&&t> this.maxLookAhead&&(this.maxLookAhead=t), e
}, ye.prototype.baseToken=function(t) {
if (!this.baseTokens) return null; for (;this.baseTokens[this.baseTokenPos]<=t;) this.baseTokenPos+=2; var e=this.baseTokens[this.baseTokenPos+1]; return { type: e&&e.replace(/( |^)overlay .*/, ""), size: this.baseTokens[this.baseTokenPos]-t }
}, ye.prototype.nextLine=function() {
this.line++, 0<this.maxLookAhead&&this.maxLookAhead--
}, ye.fromSaved=function(t, e, r) {
return e instanceof ve?new ye(t, Xt(t.mode, e.state), r, e.lookAhead):new ye(t, Xt(t.mode, e), r);}, ye.prototype.save=function(t) {
var e=!1!==t?Xt(this.doc.mode, this.state):this.state; return 0<this.maxLookAhead?new ve(e, this.maxLookAhead):e
}; var Te=function(t, e, r) {
this.start=t.start, this.end=t.pos, this.string=t.current(), this.type=e||null, this.state=r;}; function ke(t, e, r, n) {
var i; var o; var s=t.doc; var a=s.mode; var l=te(s,(e=ge(s,e)).line); var u=we(t,e.line,r); var c=new Qt(l.text, t.options.tabSize, u); for (n&&(o=[]); (n||c.pos<e.ch)&&!c.eol();)c.start=c.pos, i=Ae(a, c, u.state), n&&o.push(new Te(c, i, Xt(s.mode, u.state))); return n?o:new Te(c, i, u.state)
} function Re(t, e) {
if (t) for (;;) {
var r=t.match(/(?:^|\s+)line-(background-)?(\S+)/); if (!r) break; t=t.slice(0, r.index)+t.slice(r.index+r[0].length); var n=r[1]?'bgClass':'textClass'; null==e[n]?e[n]=r[2]:new RegExp('(?:^|s)'+r[2]+'(?:$|s)').test(e[n])||(e[n]+=' '+r[2])
} return t;} function Me(t, e, r, n, i, o, s) {
var a=r.flattenSpans; null==a&&(a=t.options.flattenSpans); var l; var u=0; var c=null; var h=new Qt(e,t.options.tabSize,n); var f=t.options.addModeClass&&[null]; for (''==e&&Re(Ce(r, n.state), o); !h.eol();) {
if (l=h.pos>t.options.maxHighlightLength?(a=!1, s&&Se(t, e, n, h.pos), h.pos=e.length, null):Re(Ae(r, h, n.state, f), o), f) {
var d=f[0].name; d&&(l='m-'+(l?d+' '+l:d))
} if (!a||c!=l) {
for (;u<h.start;)i(u=Math.min(h.start, u+5e3), c); c=l
}h.start=h.pos
} for (;u<h.pos;) {
var p=Math.min(h.pos, u+5e3); i(p, c), u=p;}
} var Le=!1; var Ee=!1; function Ne(t, e, r) {
this.marker=t, this.from=e, this.to=r;} function De(t, e) {
if (t) for (let r=0; r<t.length; ++r) {
var n=t[r]; if (n.marker==e) return n
}
} function Ie(t, e) {
for (var r, n=0; n<t.length; ++n)t[n]!=e&&(r=r||[]).push(t[n]); return r
} function Be(t, e) {
if (e.full) return null; var r=se(t, e.from.line)&&te(t, e.from.line).markedSpans; var n=se(t, e.to.line)&&te(t, e.to.line).markedSpans; if (!r&&!n) return null; var i=e.from.ch; var o=e.to.ch; var s=0==ue(e.from,e.to); var a=function(t,e,r){var n;if(t)for(var i=0;i<t.length;++i){var o=t[i],s=o.marker;if(null==o.from||(s.inclusiveLeft?o.from<=e:o.from<e)||o.from==e&&"bookmark"==s.type&&(!r||!o.marker.insertLeft)){var a=null==o.to||(s.inclusiveRight?o.to>=e:o.to>e);(n=n||[]).push(new Ne(s,o.from,a?null:o.to))}}return n}(r,i,s); var l=function(t,e,r){var n;if(t)for(var i=0;i<t.length;++i){var o=t[i],s=o.marker;if(null==o.to||(s.inclusiveRight?o.to>=e:o.to>e)||o.from==e&&"bookmark"==s.type&&(!r||o.marker.insertLeft)){var a=null==o.from||(s.inclusiveLeft?o.from<=e:o.from<e);(n=n||[]).push(new Ne(s,a?null:o.from-e,null==o.to?null:o.to-e))}}return n}(n,o,s); var u=1==e.text.length; var c=$(e.text).length+(u?i:0); if (a) for (let h=0; h<a.length; ++h) {
var f=a[h]; if (null==f.to) {
var d=De(l, f.marker); d?u&&(f.to=null==d.to?null:d.to+c):f.to=i
}
} if (l) for (let p=0; p<l.length; ++p) {
var g=l[p]; if (null!=g.to&&(g.to+=c), null==g.from)De(a, g.marker)||(g.from=c, u&&(a=a||[]).push(g)); else g.from+=c, u&&(a=a||[]).push(g)
}a=a&&Oe(a), l&&l!=a&&(l=Oe(l)); var m=[a]; if (!u) {
var v; var y=e.text.length-2; if (0<y&&a) for (let x=0; x<a.length; ++x)null==a[x].to&&(v=v||[]).push(new Ne(a[x].marker, null, null)); for (let b=0; b<y; ++b)m.push(v); m.push(l);} return m
} function Oe(t) {
for (let e=0; e<t.length; ++e) {
var r=t[e]; null!=r.from&&r.from==r.to&&!1!==r.marker.clearWhenEmpty&&t.splice(e--, 1)
} return t.length?t:null;} function He(t) {
var e=t.markedSpans; if (e) {
for (let r=0; r<e.length; ++r)e[r].marker.detachLine(t); t.markedSpans=null;}
} function Pe(t, e) {
if (e) {
for (let r=0; r<e.length; ++r)e[r].marker.attachLine(t); t.markedSpans=e
}
} function _e(t) {
return t.inclusiveLeft?-1:0;} function Ue(t) {
return t.inclusiveRight?1:0;} function Ke(t, e) {
var r=t.lines.length-e.lines.length; if (0!=r) return r; var n=t.find(); var i=e.find(); var o=ue(n.from, i.from)||_e(t)-_e(e); if (o) return -o; var s=ue(n.to, i.to)||Ue(t)-Ue(e); return s||e.id-t.id;} function je(t, e) {
var r; var n=Ee&&t.markedSpans; if (n) for (let i=void 0, o=0; o<n.length; ++o)(i=n[o]).marker.collapsed&&null==(e?i.from:i.to)&&(!r||Ke(r, i.marker)<0)&&(r=i.marker); return r;} function Fe(t) {
return je(t, !0)
} function ze(t) {
return je(t, !1)
} function We(t, e) {
var r; var n=Ee&&t.markedSpans; if (n) for (let i=0; i<n.length; ++i) {
var o=n[i]; o.marker.collapsed&&(null==o.from||o.from<e)&&(null==o.to||o.to>e)&&(!r||Ke(r, o.marker)<0)&&(r=o.marker)
} return r
} function Je(t, e, r, n, i) {
var o=te(t, e); var s=Ee&&o.markedSpans; if (s) for (let a=0; a<s.length; ++a) {
var l=s[a]; if (l.marker.collapsed) {
var u=l.marker.find(0); var c=ue(u.from,r)||_e(l.marker)-_e(i); var h=ue(u.to, n)||Ue(l.marker)-Ue(i); if (!(0<=c&&h<=0||c<=0&&0<=h)&&(c<=0&&(l.marker.inclusiveRight&&i.inclusiveLeft?0<=ue(u.to, r):0<ue(u.to, r))||0<=c&&(l.marker.inclusiveRight&&i.inclusiveLeft?ue(u.from, n)<=0:ue(u.from, n)<0))) return 1;}
}
} function Ve(t) {
for (var e; e=Fe(t);)t=e.find(-1, !0).line; return t;} function qe(t, e) {
var r=te(t, e); var n=Ve(r); return r==n?e:ie(n);} function Ge(t, e) {
if (e>t.lastLine()) return e; var r; var n=te(t, e); if (!$e(t, n)) return e; for (;r=ze(n);)n=r.find(1, !0).line; return ie(n)+1;} function $e(t, e) {
var r=Ee&&e.markedSpans; if (r) for (let n=void 0, i=0; i<r.length; ++i) if ((n=r[i]).marker.collapsed) {
if (null==n.from) return !0; if (!n.marker.widgetNode&&0==n.from&&n.marker.inclusiveLeft&&Xe(t, e, n)) return !0;}
} function Xe(t, e, r) {
if (null==r.to) {
var n=r.marker.find(1, !0); return Xe(t, n.line, De(n.line.markedSpans, r.marker))
} if (r.marker.inclusiveRight&&r.to==e.text.length) return !0; for (let i=void 0, o=0; o<e.markedSpans.length; ++o) if ((i=e.markedSpans[o]).marker.collapsed&&!i.marker.widgetNode&&i.from==r.to&&(null==i.to||i.to!=r.from)&&(i.marker.inclusiveLeft||r.marker.inclusiveRight)&&Xe(t, e, i)) return !0;} function Ye(t) {
for (var e=0, r=(t=Ve(t)).parent, n=0; n<r.lines.length; ++n) {
var i=r.lines[n]; if (i==t) break; e+=i.height
} for (let o=r.parent; o; o=(r=o).parent) for (let s=0; s<o.children.length; ++s) {
var a=o.children[s]; if (a==r) break; e+=a.height;} return e
} function Ze(t) {
if (0==t.height) return 0; for (var e, r=t.text.length, n=t; e=Fe(n);) {
var i=e.find(0, !0); n=i.from.line, r+=i.from.ch-i.to.ch;} for (n=t; e=ze(n);) {
var o=e.find(0, !0); r-=n.text.length-o.from.ch, r+=(n=o.to.line).text.length-o.to.ch;} return r;} function Qe(t) {
var r=t.display; var e=t.doc; r.maxLine=te(e, e.first), r.maxLineLength=Ze(r.maxLine), r.maxLineChanged=!0, e.iter(function(t) {
var e=Ze(t); e>r.maxLineLength&&(r.maxLineLength=e, r.maxLine=t)
})
} var tr=function(t, e, r) {
this.text=t, Pe(this, e), this.height=r?r(this):1;}; tr.prototype.lineNo=function() {
return ie(this)
}, Rt(tr); var er={}; var rr={}; function nr(t, e) {
if (!t||/^\s*$/.test(t)) return null; var r=e.addModeClass?rr:er; return r[t]||(r[t]=t.replace(/\S+/g, "cm-$&"))
} function ir(t, e) {
var r=L('span', null, null, x?'padding-right: .1px':null); var n={ pre: L('pre', [r], "CodeMirror-line"), content: r, col: 0, pos: 0, cm: t, trailingSpace: !1, splitSpaces: t.getOption('lineWrapping') }; e.measure={}; for (let i=0; i<=(e.rest?e.rest.length:0); i++) {
var o=i?e.rest[i-1]:e.line; var s=void 0; n.pos=0, n.addToken=sr, _t(t.display.measure)&&(s=yt(o, t.doc.direction))&&(n.addToken=ar(n.addToken, s)), n.map=[], ur(o, n, be(t, o, e!=t.display.externalMeasured&&ie(o))), o.styleClasses&&(o.styleClasses.bgClass&&(n.bgClass=B(o.styleClasses.bgClass, n.bgClass||'')), o.styleClasses.textClass&&(n.textClass=B(o.styleClasses.textClass, n.textClass||''))), 0==n.map.length&&n.map.push(0, 0, n.content.appendChild(Pt(t.display.measure))), 0==i?(e.measure.map=n.map, e.measure.cache={}):((e.measure.maps||(e.measure.maps=[])).push(n.map), (e.measure.caches||(e.measure.caches=[])).push({}));} if (x) {
var a=n.content.lastChild; (/\bcm-tab\b/.test(a.className)||a.querySelector&&a.querySelector('.cm-tab'))&&(n.content.className='cm-tab-wrap-hack')
} return Ct(t, "renderLine", t, e.line, n.pre), n.pre.className&&(n.textClass=B(n.pre.className, n.textClass||'')), n
} function or(t) {
var e=E('span', "•", "cm-invalidchar"); return e.title='\\u'+t.charCodeAt(0).toString(16), e.setAttribute('aria-label', e.title), e
} function sr(t, e, r, n, i, o, s) {
if (e) {
var a; var l=t.splitSpaces?function(t,e){if(1<t.length&&!/  /.test(t))return t;for(var r=e,n="",i=0;i<t.length;i++){var o=t.charAt(i);" "!=o||!r||i!=t.length-1&&32!=t.charCodeAt(i+1)||(o=" "),n+=o,r=" "==o}return n}(e,t.trailingSpace):e; var u=t.cm.state.specialChars; var c=!1; if (u.test(e)) {
a=document.createDocumentFragment(); for (let h=0; ;) {
u.lastIndex=h; var f=u.exec(e); var d=f?f.index-h:e.length-h; if (d) {
var p=document.createTextNode(l.slice(h, h+d)); w&&S<9?a.appendChild(E('span', [p])):a.appendChild(p), t.map.push(t.pos, t.pos+d, p), t.col+=d, t.pos+=d
} if (!f) break; h+=1+d; var g=void 0; if ('\t'==f[0]) {
var m=t.cm.options.tabSize; var v=m-t.col%m; (g=a.appendChild(E('span', G(v), "cm-tab"))).setAttribute('role', "presentation"), g.setAttribute('cm-text', "\t"), t.col+=v
} else "\r"==f[0]||'\n'==f[0]?(g=a.appendChild(E('span', "\r"==f[0]?'␍':'␤', "cm-invalidchar"))).setAttribute('cm-text', f[0]):((g=t.cm.options.specialCharPlaceholder(f[0])).setAttribute('cm-text', f[0]), w&&S<9?a.appendChild(E('span', [g])):a.appendChild(g)), t.col+=1; t.map.push(t.pos, t.pos+1, g), t.pos++
}
} else t.col+=e.length, a=document.createTextNode(l), t.map.push(t.pos, t.pos+e.length, a), w&&S<9&&(c=!0), t.pos+=e.length; if (t.trailingSpace=32==l.charCodeAt(e.length-1), r||n||i||c||o) {
var y=r||''; n&&(y+=n), i&&(y+=i); var x=E('span', [a], y, o); if (s) for (let b in s)s.hasOwnProperty(b)&&'style'!=b&&'class'!=b&&x.setAttribute(b, s[b]); return t.content.appendChild(x);}t.content.appendChild(a)
}
} function ar(h, f) {
return function(t, e, r, n, i, o, s) {
r=r?r+' cm-force-border':'cm-force-border'; for (let a=t.pos, l=a+e.length; ;) {
for (var u=void 0, c=0; c<f.length&&!((u=f[c]).to>a&&u.from<=a); c++);if (u.to>=l) return h(t, e, r, n, i, o, s); h(t, e.slice(0, u.to-a), r, n, null, o, s), n=null, e=e.slice(u.to-a), a=u.to
}
}
} function lr(t, e, r, n) {
var i=!n&&r.widgetNode; i&&t.map.push(t.pos, t.pos+e, i), !n&&t.cm.display.input.needsContentAttribute&&(i=i||t.content.appendChild(document.createElement('span'))).setAttribute('cm-marker', r.id), i&&(t.cm.display.input.setUneditable(i), t.content.appendChild(i)), t.pos+=e, t.trailingSpace=!1;} function ur(t, e, r) {
var n=t.markedSpans; var i=t.text; var o=0; if (n) for (var s, a, l, u, c, h, f, d=i.length, p=0, g=1, m='', v=0; ;) {
if (v==p) {
l=u=c=a='', h=f=null, v=1/0; for (var y=[], x=void 0, b=0; b<n.length; ++b) {
var w=n[b]; var S=w.marker; if ('bookmark'==S.type&&w.from==p&&S.widgetNode)y.push(S); else if (w.from<=p&&(null==w.to||w.to>p||S.collapsed&&w.to==p&&w.from==p)) {
if (null!=w.to&&w.to!=p&&v>w.to&&(v=w.to, u=''), S.className&&(l+=' '+S.className), S.css&&(a=(a?a+';':'')+S.css), S.startStyle&&w.from==p&&(c+=' '+S.startStyle), S.endStyle&&w.to==v&&(x=x||[]).push(S.endStyle, w.to), S.title&&((f=f||{}).title=S.title), S.attributes) for (let C in S.attributes)(f=f||{})[C]=S.attributes[C]; S.collapsed&&(!h||Ke(h.marker, S)<0)&&(h=w)
} else w.from>p&&v>w.from&&(v=w.from);} if (x) for (let A=0; A<x.length; A+=2)x[A+1]==v&&(u+=' '+x[A]); if (!h||h.from==p) for (let T=0; T<y.length; ++T)lr(e, 0, y[T]); if (h&&(h.from||0)==p) {
if (lr(e, (null==h.to?d+1:h.to)-p, h.marker, null==h.from), null==h.to) return; h.to==p&&(h=!1)
}
} if (d<=p) break; for (let k=Math.min(d, v); ;) {
if (m) {
var R=p+m.length; if (!h) {
var M=k<R?m.slice(0, k-p):m; e.addToken(e, M, s?s+l:l, c, p+M.length==v?u:'', a, f)
} if (k<=R) {
m=m.slice(k-p), p=k; break;}p=R, c=''}m=i.slice(o, o=r[g++]), s=nr(r[g++], e.cm.options)
}
} else for (let L=1; L<r.length; L+=2)e.addToken(e, i.slice(o, o=r[L]), nr(r[L+1], e.cm.options));} function cr(t, e, r) {
this.line=e, this.rest=function(t) {
for (var e, r; e=ze(t);)t=e.find(1, !0).line, (r=r||[]).push(t); return r;}(e), this.size=this.rest?ie($(this.rest))-r+1:1, this.node=this.text=null, this.hidden=$e(t, e)
} function hr(t, e, r) {
for (var n, i=[], o=e; o<r; o=n) {
var s=new cr(t.doc, te(t.doc, o), o); n=o+s.size, i.push(s);} return i;} var fr=null; function dr(t, e) {
var r=t.ownsGroup; if (r) try {
!function(t) {
var e=t.delayedCallbacks; var r=0; do {
for (;r<e.length; r++)e[r].call(null); for (let n=0; n<t.ops.length; n++) {
var i=t.ops[n]; if (i.cursorActivityHandlers) for (;i.cursorActivityCalled<i.cursorActivityHandlers.length;)i.cursorActivityHandlers[i.cursorActivityCalled++].call(null, i.cm)
}
} while (r<e.length);}(r)
} finally {
fr=null, e(r);}
} var pr=null; function gr(t, e) {
var r=wt(t, e); if (r.length) {
var n; var i=Array.prototype.slice.call(arguments, 2); fr?n=fr.delayedCallbacks:pr?n=pr:(n=pr=[], setTimeout(mr, 0)); for (let o=function(t) {
n.push(function() {
return r[t].apply(null, i);});}, s=0; s<r.length; ++s)o(s)
}
} function mr() {
var t=pr; pr=null; for (let e=0; e<t.length; ++e)t[e]()
} function vr(t, e, r, n) {
for (let i=0; i<e.changes.length; i++) {
var o=e.changes[i]; "text"==o?br(t, e):'gutter'==o?Sr(t, e, r, n):'class'==o?wr(t, e):'widget'==o&&Cr(t, e, n)
}e.changes=null;} function yr(t) {
return t.node==t.text&&(t.node=E('div', null, null, "position: relative"), t.text.parentNode&&t.text.parentNode.replaceChild(t.node, t.text), t.node.appendChild(t.text), w&&S<8&&(t.node.style.zIndex=2)), t.node;} function xr(t, e) {
var r=t.display.externalMeasured; return r&&r.line==e.line?(t.display.externalMeasured=null, e.measure=r.measure, r.built):ir(t, e)
} function br(t, e) {
var r=e.text.className; var n=xr(t, e); e.text==e.node&&(e.node=n.pre), e.text.parentNode.replaceChild(n.pre, e.text), e.text=n.pre, n.bgClass!=e.bgClass||n.textClass!=e.textClass?(e.bgClass=n.bgClass, e.textClass=n.textClass, wr(t, e)):r&&(e.text.className=r);} function wr(t, e) {
!function(t, e) {
var r=e.bgClass?e.bgClass+' '+(e.line.bgClass||''):e.line.bgClass; if (r&&(r+=' CodeMirror-linebackground'), e.background)r?e.background.className=r:(e.background.parentNode.removeChild(e.background), e.background=null); else if (r) {
var n=yr(e); e.background=n.insertBefore(E('div', null, r), n.firstChild), t.display.input.setUneditable(e.background);}
}(t, e), e.line.wrapClass?yr(e).className=e.line.wrapClass:e.node!=e.text&&(e.node.className=''); var r=e.textClass?e.textClass+' '+(e.line.textClass||''):e.line.textClass; e.text.className=r||''} function Sr(t, e, r, n) {
if (e.gutter&&(e.node.removeChild(e.gutter), e.gutter=null), e.gutterBackground&&(e.node.removeChild(e.gutterBackground), e.gutterBackground=null), e.line.gutterClass) {
var i=yr(e); e.gutterBackground=E('div', null, "CodeMirror-gutter-background "+e.line.gutterClass, "left: "+(t.options.fixedGutter?n.fixedPos:-n.gutterTotalWidth)+'px; width: '+n.gutterTotalWidth+'px'), t.display.input.setUneditable(e.gutterBackground), i.insertBefore(e.gutterBackground, e.text)
} var o=e.line.gutterMarkers; if (t.options.lineNumbers||o) {
var s=yr(e); var a=e.gutter=E('div', null, "CodeMirror-gutter-wrapper", "left: "+(t.options.fixedGutter?n.fixedPos:-n.gutterTotalWidth)+'px'); if (t.display.input.setUneditable(a), s.insertBefore(a, e.text), e.line.gutterClass&&(a.className+=' '+e.line.gutterClass), !t.options.lineNumbers||o&&o['CodeMirror-linenumbers']||(e.lineNumber=a.appendChild(E('div', ae(t.options, r), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: "+n.gutterLeft['CodeMirror-linenumbers']+'px; width: '+t.display.lineNumInnerWidth+'px'))), o) for (let l=0; l<t.display.gutterSpecs.length; ++l) {
var u=t.display.gutterSpecs[l].className; var c=o.hasOwnProperty(u)&&o[u]; c&&a.appendChild(E('div', [c], "CodeMirror-gutter-elt", "left: "+n.gutterLeft[u]+'px; width: '+n.gutterWidth[u]+'px'));}
}
} function Cr(t, e, r) {
e.alignable&&(e.alignable=null); for (let n=A('CodeMirror-linewidget'), i=e.node.firstChild, o=void 0; i; i=o)o=i.nextSibling, n.test(i.className)&&e.node.removeChild(i); Ar(t, e, r)
} function Ar(t, e, r) {
if (Tr(t, e.line, e, r, !0), e.rest) for (let n=0; n<e.rest.length; n++)Tr(t, e.rest[n], e, r, !1)
} function Tr(t, e, r, n, i) {
if (e.widgets) for (let o=yr(r), s=0, a=e.widgets; s<a.length; ++s) {
var l=a[s]; var u=E('div', [l.node], "CodeMirror-linewidget"+(l.className?' '+l.className:'')); l.handleMouseEvents||u.setAttribute('cm-ignore-events', "true"), kr(l, u, r, n), t.display.input.setUneditable(u), i&&l.above?o.insertBefore(u, r.gutter||r.text):o.appendChild(u), gr(l, "redraw");}
} function kr(t, e, r, n) {
if (t.noHScroll) {
(r.alignable||(r.alignable=[])).push(e); var i=n.wrapperWidth; e.style.left=n.fixedPos+'px', t.coverGutter||(i-=n.gutterTotalWidth, e.style.paddingLeft=n.gutterTotalWidth+'px'), e.style.width=i+'px'}t.coverGutter&&(e.style.zIndex=5, e.style.position='relative', t.noHScroll||(e.style.marginLeft=-n.gutterTotalWidth+'px'));} function Rr(t) {
if (null!=t.height) return t.height; var e=t.doc.cm; if (!e) return 0; if (!N(document.body, t.node)) {
var r='position: relative;'; t.coverGutter&&(r+='margin-left: -'+e.display.gutters.offsetWidth+'px;'), t.noHScroll&&(r+='width: '+e.display.wrapper.clientWidth+'px;'), M(e.display.measure, E('div', [t.node], null, r));} return t.height=t.node.parentNode.offsetHeight;} function Mr(t, e) {
for (let r=Dt(e); r!=t.wrapper; r=r.parentNode) if (!r||1==r.nodeType&&'true'==r.getAttribute('cm-ignore-events')||r.parentNode==t.sizer&&r!=t.mover) return 1
} function Lr(t) {
return t.lineSpace.offsetTop;} function Er(t) {
return t.mover.offsetHeight-t.lineSpace.offsetHeight
} function Nr(t) {
if (t.cachedPaddingH) return t.cachedPaddingH; var e=M(t.measure, E('pre', "x", "CodeMirror-line-like")); var r=window.getComputedStyle?window.getComputedStyle(e):e.currentStyle; var n={ left: parseInt(r.paddingLeft), right: parseInt(r.paddingRight) }; return isNaN(n.left)||isNaN(n.right)||(t.cachedPaddingH=n), n;} function Dr(t) {
return j-t.display.nativeBarWidth;} function Ir(t) {
return t.display.scroller.clientWidth-Dr(t)-t.display.barWidth
} function Br(t) {
return t.display.scroller.clientHeight-Dr(t)-t.display.barHeight;} function Or(t, e, r) {
if (t.line==e) return { map: t.measure.map, cache: t.measure.cache }; for (let n=0; n<t.rest.length; n++) if (t.rest[n]==e) return { map: t.measure.maps[n], cache: t.measure.caches[n] }; for (let i=0; i<t.rest.length; i++) if (ie(t.rest[i])>r) return { map: t.measure.maps[i], cache: t.measure.caches[i], before: !0 }
} function Hr(t, e, r, n) {
return Ur(t, _r(t, e), r, n);} function Pr(t, e) {
if (e>=t.display.viewFrom&&e<t.display.viewTo) return t.display.view[gn(t, e)]; var r=t.display.externalMeasured; return r&&e>=r.lineN&&e<r.lineN+r.size?r:void 0;} function _r(t, e) {
var r=ie(e); var n=Pr(t, r); n&&!n.text?n=null:n&&n.changes&&(vr(t, n, r, cn(t)), t.curOp.forceUpdate=!0); var i=Or(n=n||function(t, e) {
var r=ie(e=Ve(e)); var n=t.display.externalMeasured=new cr(t.doc, e, r); n.lineN=r; var i=n.built=ir(t, n); return n.text=i.pre, M(t.display.lineMeasure, i.pre), n;}(t, e), e, r); return { line: e, view: n, rect: null, map: i.map, cache: i.cache, before: i.before, hasHeights: !1 };} function Ur(t, e, r, n, i) {
e.before&&(r=-1); var o; var s=r+(n||''); return e.cache.hasOwnProperty(s)?o=e.cache[s]:(e.rect||(e.rect=e.view.text.getBoundingClientRect()), e.hasHeights||(function(t, e, r) {
var n=t.options.lineWrapping; var i=n&&Ir(t); if (!e.measure.heights||n&&e.measure.width!=i) {
var o=e.measure.heights=[]; if (n) {
e.measure.width=i; for (let s=e.text.firstChild.getClientRects(), a=0; a<s.length-1; a++) {
var l=s[a]; var u=s[a+1]; 2<Math.abs(l.bottom-u.bottom)&&o.push((l.bottom+u.top)/2-r.top);}
}o.push(r.bottom-r.top)
}
}(t, e.view, e.rect), e.hasHeights=!0), (o=function(t, e, r, n) {
var i; var o=Fr(e.map,r,n); var s=o.node; var a=o.start; var l=o.end; var u=o.collapse; if (3==s.nodeType) {
for (let c=0; c<4; c++) {
for (;a&&it(e.line.text.charAt(o.coverStart+a));)--a; for (;o.coverStart+l<o.coverEnd&&it(e.line.text.charAt(o.coverStart+l));)++l; if ((i=w&&S<9&&0==a&&l==o.coverEnd-o.coverStart?s.parentNode.getBoundingClientRect():zr(T(s, a, l).getClientRects(), n)).left||i.right||0==a) break; l=a, --a, u='right'}w&&S<11&&(i=function(t, e) {
if (!window.screen||null==screen.logicalXDPI||screen.logicalXDPI==screen.deviceXDPI||!function(t) {
if (null!=zt) return zt; var e=M(t, E('span', "x")); var r=e.getBoundingClientRect(); var n=T(e, 0, 1).getBoundingClientRect(); return zt=1<Math.abs(r.left-n.left)
}(t)) return e; var r=screen.logicalXDPI/screen.deviceXDPI; var n=screen.logicalYDPI/screen.deviceYDPI; return { left: e.left*r, right: e.right*r, top: e.top*n, bottom: e.bottom*n }
}(t.display.measure, i))
} else {
var h; 0<a&&(u=n='right'), i=t.options.lineWrapping&&1<(h=s.getClientRects()).length?h['right'==n?h.length-1:0]:s.getBoundingClientRect();} if (w&&S<9&&!a&&(!i||!i.left&&!i.right)) {
var f=s.parentNode.getClientRects()[0]; i=f?{ left: f.left, right: f.left+un(t.display), top: f.top, bottom: f.bottom }:jr
} for (var d=i.top-e.rect.top, p=i.bottom-e.rect.top, g=(d+p)/2, m=e.view.measure.heights, v=0; v<m.length-1&&!(g<m[v]); v++);let y=v?m[v-1]:0; var x=m[v]; var b={ left: ('right'==u?i.right:i.left)-e.rect.left, right: ('left'==u?i.left:i.right)-e.rect.left, top: y, bottom: x }; i.left||i.right||(b.bogus=!0); t.options.singleCursorHeightPerLine||(b.rtop=d, b.rbottom=p); return b
}(t, e, r, n)).bogus||(e.cache[s]=o)), { left: o.left, right: o.right, top: i?o.rtop:o.top, bottom: i?o.rbottom:o.bottom }
} var Kr; var jr={ left: 0, right: 0, top: 0, bottom: 0 }; function Fr(t, e, r) {
for (var n, i, o, s, a, l, u=0; u<t.length; u+=3) if (a=t[u], l=t[u+1], e<a?(i=0, o=1, s='left'):e<l?o=(i=e-a)+1:(u==t.length-3||e==l&&t[u+3]>e)&&(i=(o=l-a)-1, l<=e&&(s='right')), null!=i) {
if (n=t[u+2], a==l&&r==(n.insertLeft?'left':'right')&&(s=r), "left"==r&&0==i) for (;u&&t[u-2]==t[u-3]&&t[u-1].insertLeft;)n=t[2+(u-=3)], s='left'; if ('right'==r&&i==l-a) for (;u<t.length-3&&t[u+3]==t[u+4]&&!t[u+5].insertLeft;)n=t[(u+=3)+2], s='right'; break
} return { node: n, start: i, end: o, collapse: s, coverStart: a, coverEnd: l }
} function zr(t, e) {
var r=jr; if ('left'==e) for (let n=0; n<t.length&&(r=t[n]).left==r.right; n++);else for (let i=t.length-1; 0<=i&&(r=t[i]).left==r.right; i--);return r;} function Wr(t) {
if (t.measure&&(t.measure.cache={}, t.measure.heights=null, t.rest)) for (let e=0; e<t.rest.length; e++)t.measure.caches[e]={}
} function Jr(t) {
t.display.externalMeasure=null, R(t.display.lineMeasure); for (let e=0; e<t.display.view.length; e++)Wr(t.display.view[e]);} function Vr(t) {
Jr(t), t.display.cachedCharWidth=t.display.cachedTextHeight=t.display.cachedPaddingH=null, t.options.lineWrapping||(t.display.maxLineChanged=!0), t.display.lineNumChars=null;} function qr() {
return s&&h?-(document.body.getBoundingClientRect().left-parseInt(getComputedStyle(document.body).marginLeft)):window.pageXOffset||(document.documentElement||document.body).scrollLeft;} function Gr() {
return s&&h?-(document.body.getBoundingClientRect().top-parseInt(getComputedStyle(document.body).marginTop)):window.pageYOffset||(document.documentElement||document.body).scrollTop;} function $r(t) {
var e=0; if (t.widgets) for (let r=0; r<t.widgets.length; ++r)t.widgets[r].above&&(e+=Rr(t.widgets[r])); return e;} function Xr(t, e, r, n, i) {
if (!i) {
var o=$r(e); r.top+=o, r.bottom+=o;} if ('line'==n) return r; n=n||'local'; var s=Ye(e); if ('local'==n?s+=Lr(t.display):s-=t.display.viewOffset, "page"==n||'window'==n) {
var a=t.display.lineSpace.getBoundingClientRect(); s+=a.top+('window'==n?0:Gr()); var l=a.left+('window'==n?0:qr()); r.left+=l, r.right+=l
} return r.top+=s, r.bottom+=s, r
} function Yr(t, e, r) {
if ('div'==r) return e; var n=e.left; var i=e.top; if ('page'==r)n-=qr(), i-=Gr(); else if ('local'==r||!r) {
var o=t.display.sizer.getBoundingClientRect(); n+=o.left, i+=o.top;} var s=t.display.lineSpace.getBoundingClientRect(); return { left: n-s.left, top: i-s.top };} function Zr(t, e, r, n, i) {
return Xr(t, n=n||te(t.doc, e.line), Hr(t, n, e.ch, i), r);} function Qr(n, t, i, o, s, a) {
function l(t, e) {
var r=Ur(n, s, t, e?'right':'left', a); return e?r.left=r.right:r.right=r.left, Xr(n, o, r, i)
}o=o||te(n.doc, t.line), s=s||_r(n, o); var u=yt(o, n.doc.direction); var e=t.ch; var r=t.sticky; if (e>=o.text.length?(e=o.text.length, r='before'):e<=0&&(e=0, r='after'), !u) return l('before'==r?e-1:e, "before"==r); function c(t, e, r) {
return l(r?t-1:t, 1==u[e].level!=r)
} var h=lt(u, e, r); var f=at; var d=c(e, h, "before"==r); return null!=f&&(d.other=c(e, f, "before"!=r)), d
} function tn(t, e) {
var r=0; e=ge(t.doc, e), t.options.lineWrapping||(r=un(t.display)*e.ch); var n=te(t.doc, e.line); var i=Ye(n)+Lr(t.display); return { left: r, right: r, top: i, bottom: i+n.height }
} function en(t, e, r, n, i) {
var o=le(t, e, r); return o.xRel=i, n&&(o.outside=n), o;} function rn(t, e, r) {
var n=t.doc; if ((r+=t.display.viewOffset)<0) return en(n.first, 0, null, -1, -1); var i=oe(n, r); var o=n.first+n.size-1; if (o<i) return en(n.first+n.size-1, te(n, o).text.length, null, 1, 1); e<0&&(e=0); for (let s=te(n, i); ;) {
var a=an(t, s, i, e, r); var l=We(s, a.ch+(0<a.xRel||0<a.outside?1:0)); if (!l) return a; var u=l.find(1); if (u.line==i) return u; s=te(n, i=u.line)
}
} function nn(e, t, r, n) {
n-=$r(t); var i=t.text.length; var o=st(function(t) {
return Ur(e, r, t-1).bottom<=n;}, i, 0); return { begin: o, end: i=st(function(t) {
return Ur(e, r, t).top>n
}, o, i) }
} function on(t, e, r, n) {
return nn(t, e, r=r||_r(t, e), Xr(t, e, Ur(t, r, n), "line").top);} function sn(t, e, r, n) {
return !(t.bottom<=r)&&(t.top>r||(n?t.left:t.right)>e);} function an(r, t, e, n, i) {
i-=Ye(t); var o=_r(r, t); var s=$r(t); var a=0; var l=t.text.length; var u=!0; var c=yt(t, r.doc.direction); if (c) {
var h=(r.options.lineWrapping?function(t, e, r, n, i, o, s) {
var a=nn(t, e, n, s); var l=a.begin; var u=a.end; /\s/.test(e.text.charAt(u-1))&&u--; for (var c=null, h=null, f=0; f<i.length; f++) {
var d=i[f]; if (!(d.from>=u||d.to<=l)) {
var p=1!=d.level; var g=Ur(t,n,p?Math.min(u,d.to)-1:Math.max(l,d.from)).right; var m=g<o?o-g+1e9:g-o; (!c||m<h)&&(c=d, h=m)
}
}c=c||i[i.length-1]; c.from<l&&(c={ from: l, to: c.to, level: c.level }); c.to>u&&(c={ from: c.from, to: u, level: c.level }); return c;}:function(n, i, o, s, a, l, u) {
var t=st(function(t) {
var e=a[t]; var r=1!=e.level; return sn(Qr(n, le(o, r?e.to:e.from, r?'before':'after'), "line", i, s), l, u, !0);}, 0, a.length-1); var e=a[t]; if (0<t) {
var r=1!=e.level; var c=Qr(n, le(o, r?e.from:e.to, r?'after':'before'), "line", i, s); sn(c, l, u, !0)&&c.top>u&&(e=a[t-1])
} return e
})(r, t, e, o, c, n, i); a=(u=1!=h.level)?h.from:h.to-1, l=u?h.to:h.from-1
} var f; var d; var p=null; var g=null; var m=st(function(t){var e=Ur(r,o,t);return e.top+=s,e.bottom+=s,sn(e,n,i,!1)&&(e.top<=i&&e.left<=n&&(p=t,g=e),1)},a,l); var v=!1; if (g) {
var y=n-g.left<g.right-n; var x=y==u; m=p+(x?0:1), d=x?'after':'before', f=y?g.left:g.right
} else {
u||m!=l&&m!=a||m++, d=0==m?'after':m==t.text.length?'before':Ur(r, o, m-(u?1:0)).bottom+s<=i==u?'after':'before'; var b=Qr(r, le(e, m, d), "line", t, o); f=b.left, v=i<b.top?-1:i>=b.bottom?1:0
} return en(e, m=ot(t.text, m, 1), d, v, n-f);} function ln(t) {
if (null!=t.cachedTextHeight) return t.cachedTextHeight; if (null==Kr) {
Kr=E('pre', null, "CodeMirror-line-like"); for (let e=0; e<49; ++e)Kr.appendChild(document.createTextNode('x')), Kr.appendChild(E('br')); Kr.appendChild(document.createTextNode('x'));}M(t.measure, Kr); var r=Kr.offsetHeight/50; return 3<r&&(t.cachedTextHeight=r), R(t.measure), r||1;} function un(t) {
if (null!=t.cachedCharWidth) return t.cachedCharWidth; var e=E('span', "xxxxxxxxxx"); var r=E('pre', [e], "CodeMirror-line-like"); M(t.measure, r); var n=e.getBoundingClientRect(); var i=(n.right-n.left)/10; return 2<i&&(t.cachedCharWidth=i), i||10;} function cn(t) {
for (var e=t.display, r={}, n={}, i=e.gutters.clientLeft, o=e.gutters.firstChild, s=0; o; o=o.nextSibling, ++s) {
var a=t.display.gutterSpecs[s].className; r[a]=o.offsetLeft+o.clientLeft+i, n[a]=o.clientWidth
} return { fixedPos: hn(e), gutterTotalWidth: e.gutters.offsetWidth, gutterLeft: r, gutterWidth: n, wrapperWidth: e.wrapper.clientWidth }
} function hn(t) {
return t.scroller.getBoundingClientRect().left-t.sizer.getBoundingClientRect().left
} function fn(n) {
var i=ln(n.display); var o=n.options.lineWrapping; var s=o&&Math.max(5, n.display.scroller.clientWidth/un(n.display)-3); return function(t) {
if ($e(n.doc, t)) return 0; var e=0; if (t.widgets) for (let r=0; r<t.widgets.length; r++)t.widgets[r].height&&(e+=t.widgets[r].height); return o?e+(Math.ceil(t.text.length/s)||1)*i:e+i
};} function dn(t) {
var e=t.doc; var r=fn(t); e.iter(function(t) {
var e=r(t); e!=t.height&&ne(t, e);});} function pn(t, e, r, n) {
var i=t.display; if (!r&&'true'==Dt(e).getAttribute('cm-not-content')) return null; var o; var s; var a=i.lineSpace.getBoundingClientRect(); try {
o=e.clientX-a.left, s=e.clientY-a.top;} catch (e) {
return null
} var l; var u=rn(t, o, s); if (n&&0<u.xRel&&(l=te(t.doc, u.line).text).length==u.ch) {
var c=_(l, l.length, t.options.tabSize)-l.length; u=le(u.line, Math.max(0, Math.round((o-Nr(t.display).left)/un(t.display))-c));} return u;} function gn(t, e) {
if (e>=t.display.viewTo) return null; if ((e-=t.display.viewFrom)<0) return null; for (let r=t.display.view, n=0; n<r.length; n++) if ((e-=r[n].size)<0) return n;} function mn(t, e, r, n) {
null==e&&(e=t.doc.first), null==r&&(r=t.doc.first+t.doc.size), n=n||0; var i=t.display; if (n&&r<i.viewTo&&(null==i.updateLineNumbers||i.updateLineNumbers>e)&&(i.updateLineNumbers=e), t.curOp.viewChanged=!0, e>=i.viewTo)Ee&&qe(t.doc, e)<i.viewTo&&yn(t); else if (r<=i.viewFrom)Ee&&Ge(t.doc, r+n)>i.viewFrom?yn(t):(i.viewFrom+=n, i.viewTo+=n); else if (e<=i.viewFrom&&r>=i.viewTo)yn(t); else if (e<=i.viewFrom) {
var o=xn(t, r, r+n, 1); o?(i.view=i.view.slice(o.index), i.viewFrom=o.lineN, i.viewTo+=n):yn(t)
} else if (r>=i.viewTo) {
var s=xn(t, e, e, -1); s?(i.view=i.view.slice(0, s.index), i.viewTo=s.lineN):yn(t);} else {
var a=xn(t, e, e, -1); var l=xn(t, r, r+n, 1); a&&l?(i.view=i.view.slice(0, a.index).concat(hr(t, a.lineN, l.lineN)).concat(i.view.slice(l.index)), i.viewTo+=n):yn(t)
} var u=i.externalMeasured; u&&(r<u.lineN?u.lineN+=n:e<u.lineN+u.size&&(i.externalMeasured=null))
} function vn(t, e, r) {
t.curOp.viewChanged=!0; var n=t.display; var i=t.display.externalMeasured; if (i&&e>=i.lineN&&e<i.lineN+i.size&&(n.externalMeasured=null), !(e<n.viewFrom||e>=n.viewTo)) {
var o=n.view[gn(t, e)]; if (null!=o.node) {
var s=o.changes||(o.changes=[]); -1==K(s, r)&&s.push(r)
}
}
} function yn(t) {
t.display.viewFrom=t.display.viewTo=t.doc.first, t.display.view=[], t.display.viewOffset=0;} function xn(t, e, r, n) {
var i; var o=gn(t,e); var s=t.display.view; if (!Ee||r==t.doc.first+t.doc.size) return { index: o, lineN: r }; for (var a=t.display.viewFrom, l=0; l<o; l++)a+=s[l].size; if (a!=e) {
if (0<n) {
if (o==s.length-1) return null; i=a+s[o].size-e, o++;} else i=a-e; e+=i, r+=i;} for (;qe(t.doc, r)!=r;) {
if (o==(n<0?0:s.length-1)) return null; r+=n*s[o-(n<0?1:0)].size, o+=n
} return { index: o, lineN: r };} function bn(t) {
for (var e=t.display.view, r=0, n=0; n<e.length; n++) {
var i=e[n]; i.hidden||i.node&&!i.changes||++r;} return r
} function wn(t) {
t.display.input.showSelection(t.display.input.prepareSelection())
} function Sn(t, e) {
void 0===e&&(e=!0); for (var r=t.doc, n={}, i=n.cursors=document.createDocumentFragment(), o=n.selection=document.createDocumentFragment(), s=0; s<r.sel.ranges.length; s++) if (e||s!=r.sel.primIndex) {
var a=r.sel.ranges[s]; if (!(a.from().line>=t.display.viewTo||a.to().line<t.display.viewFrom)) {
var l=a.empty(); (l||t.options.showCursorWhenSelecting)&&Cn(t, a.head, i), l||Tn(t, a, o)
}
} return n
} function Cn(t, e, r) {
var n=Qr(t, e, "div", null, null, !t.options.singleCursorHeightPerLine); var i=r.appendChild(E('div', " ", "CodeMirror-cursor")); if (i.style.left=n.left+'px', i.style.top=n.top+'px', i.style.height=Math.max(0, n.bottom-n.top)*t.options.cursorHeight+'px', n.other) {
var o=r.appendChild(E('div', " ", "CodeMirror-cursor CodeMirror-secondarycursor")); o.style.display='', o.style.left=n.other.left+'px', o.style.top=n.other.top+'px', o.style.height=.85*(n.other.bottom-n.other.top)+'px'}
} function An(t, e) {
return t.top-e.top||t.left-e.left;} function Tn(s, t, e) {
var r=s.display; var n=s.doc; var i=document.createDocumentFragment(); var o=Nr(s.display); var k=o.left; var R=Math.max(r.sizerWidth,Ir(s)-r.sizer.offsetLeft)-o.right; var M='ltr'==n.direction; function L(t, e, r, n) {
e<0&&(e=0), e=Math.round(e), n=Math.round(n), i.appendChild(E('div', null, "CodeMirror-selected", "position: absolute; left: "+t+'px;\n                             top: '+e+'px; width: '+(null==r?R-t:r)+'px;\n                             height: '+(n-e)+'px'));} function a(r, y, x) {
var b; var w; var o=te(n,r); var S=o.text.length; function C(t, e) {
return Zr(s, le(r, t), "div", o, e);} function A(t, e, r) {
var n=on(s, o, null, t); var i='ltr'==e==('after'==r)?'left':'right'; return C('after'==r?n.begin:n.end-(/\s/.test(o.text.charAt(n.end-1))?2:1), i)[i];} var T=yt(o, n.direction); return function(t, e, r, n) {
if (!t) return n(e, r, "ltr", 0); for (var i=!1, o=0; o<t.length; ++o) {
var s=t[o]; (s.from<r&&s.to>e||e==r&&s.to==e)&&(n(Math.max(s.from, e), Math.min(s.to, r), 1==s.level?'rtl':'ltr', o), i=!0);}i||n(e, r, "ltr")
}(T, y||0, null==x?S:x, function(t, e, r, n) {
var i='ltr'==r; var o=C(t,i?"left":"right"); var s=C(e-1,i?"right":"left"); var a=null==y&&0==t; var l=null==x&&e==S; var u=0==n; var c=!T||n==T.length-1; if (s.top-o.top<=3) {
var h=(M?l:a)&&c; var f=(M?a:l)&&u?k:(i?o:s).left; var d=h?R:(i?s:o).right; L(f, o.top, d-f, o.bottom);} else {
var p; var g; var m; var v; v=i?(p=M&&a&&u?k:o.left, g=M?R:A(t, r, "before"), m=M?k:A(e, r, "after"), M&&l&&c?R:s.right):(p=M?A(t, r, "before"):k, g=!M&&a&&u?R:o.right, m=!M&&l&&c?k:s.left, M?A(e, r, "after"):R), L(p, o.top, g-p, o.bottom), o.bottom<s.top&&L(k, o.bottom, null, s.top), L(m, s.top, v-m, s.bottom);}(!b||An(o, b)<0)&&(b=o), An(s, b)<0&&(b=s), (!w||An(o, w)<0)&&(w=o), An(s, w)<0&&(w=s)
}), { start: b, end: w };} var l=t.from(); var u=t.to(); if (l.line==u.line)a(l.line, l.ch, u.ch); else {
var c=te(n, l.line); var h=te(n,u.line); var f=Ve(c)==Ve(h); var d=a(l.line,l.ch,f?c.text.length+1:null).end; var p=a(u.line, f?0:null, u.ch).start; f&&(d.top<p.top-2?(L(d.right, d.top, null, d.bottom), L(k, p.top, p.left, p.bottom)):L(d.right, d.top, p.left-d.right, d.bottom)), d.bottom<p.top&&L(k, d.bottom, null, p.top)
}e.appendChild(i);} function kn(t) {
if (t.state.focused) {
var e=t.display; clearInterval(e.blinker); var r=!0; e.cursorDiv.style.visibility='', 0<t.options.cursorBlinkRate?e.blinker=setInterval(function() {
return e.cursorDiv.style.visibility=(r=!r)?'':'hidden'}, t.options.cursorBlinkRate):t.options.cursorBlinkRate<0&&(e.cursorDiv.style.visibility='hidden')
}
} function Rn(t) {
t.state.focused||(t.display.input.focus(), Ln(t));} function Mn(t) {
t.state.delayingBlurEvent=!0, setTimeout(function() {
t.state.delayingBlurEvent&&(t.state.delayingBlurEvent=!1, En(t))
}, 100);} function Ln(t, e) {
t.state.delayingBlurEvent&&(t.state.delayingBlurEvent=!1), "nocursor"!=t.options.readOnly&&(t.state.focused||(Ct(t, "focus", t, e), t.state.focused=!0, I(t.display.wrapper, "CodeMirror-focused"), t.curOp||t.display.selForContextMenu==t.doc.sel||(t.display.input.reset(), x&&setTimeout(function() {
return t.display.input.reset(!0);}, 20)), t.display.input.receivedFocus()), kn(t))
} function En(t, e) {
t.state.delayingBlurEvent||(t.state.focused&&(Ct(t, "blur", t, e), t.state.focused=!1, k(t.display.wrapper, "CodeMirror-focused")), clearInterval(t.display.blinker), setTimeout(function() {
t.state.focused||(t.display.shift=!1)
}, 150));} function Nn(t) {
for (let e=t.display, r=e.lineDiv.offsetTop, n=0; n<e.view.length; n++) {
var i=e.view[n]; var o=t.options.lineWrapping; var s=void 0; var a=0; if (!i.hidden) {
if (w&&S<8) {
var l=i.node.offsetTop+i.node.offsetHeight; s=l-r, r=l
} else {
var u=i.node.getBoundingClientRect(); s=u.bottom-u.top, !o&&i.text.firstChild&&(a=i.text.firstChild.getBoundingClientRect().right-u.left-1)
} var c=i.line.height-s; if ((.005<c||c<-.005)&&(ne(i.line, s), Dn(i.line), i.rest)) for (let h=0; h<i.rest.length; h++)Dn(i.rest[h]); if (a>t.display.sizerWidth) {
var f=Math.ceil(a/un(t.display)); f>t.display.maxLineLength&&(t.display.maxLineLength=f, t.display.maxLine=i.line, t.display.maxLineChanged=!0)
}
}
}
} function Dn(t) {
if (t.widgets) for (let e=0; e<t.widgets.length; ++e) {
var r=t.widgets[e]; var n=r.node.parentNode; n&&(r.height=n.offsetHeight);}
} function In(t, e, r) {
var n=r&&null!=r.top?Math.max(0, r.top):t.scroller.scrollTop; n=Math.floor(n-Lr(t)); var i=r&&null!=r.bottom?r.bottom:n+t.wrapper.clientHeight; var o=oe(e,n); var s=oe(e, i); if (r&&r.ensure) {
var a=r.ensure.from.line; var l=r.ensure.to.line; a<o?s=oe(e, Ye(te(e, o=a))+t.wrapper.clientHeight):Math.min(l, e.lastLine())>=s&&(o=oe(e, Ye(te(e, l))-t.wrapper.clientHeight), s=l)
} return { from: o, to: Math.max(s, o+1) };} function Bn(t, e) {
var r=t.display; var n=ln(t.display); e.top<0&&(e.top=0); var i=t.curOp&&null!=t.curOp.scrollTop?t.curOp.scrollTop:r.scroller.scrollTop; var o=Br(t); var s={}; e.bottom-e.top>o&&(e.bottom=e.top+o); var a=t.doc.height+Er(r); var l=e.top<n; var u=e.bottom>a-n; if (e.top<i)s.scrollTop=l?0:e.top; else if (e.bottom>i+o) {
var c=Math.min(e.top, (u?a:e.bottom)-o); c!=i&&(s.scrollTop=c);} var h=t.curOp&&null!=t.curOp.scrollLeft?t.curOp.scrollLeft:r.scroller.scrollLeft; var f=Ir(t)-(t.options.fixedGutter?r.gutters.offsetWidth:0); var d=e.right-e.left>f; return d&&(e.right=e.left+f), e.left<10?s.scrollLeft=0:e.left<h?s.scrollLeft=Math.max(0, e.left-(d?0:10)):e.right>f+h-3&&(s.scrollLeft=e.right+(d?0:10)-f), s;} function On(t, e) {
null!=e&&(_n(t), t.curOp.scrollTop=(null==t.curOp.scrollTop?t.doc.scrollTop:t.curOp.scrollTop)+e);} function Hn(t) {
_n(t); var e=t.getCursor(); t.curOp.scrollToPos={ from: e, to: e, margin: t.options.cursorScrollMargin };} function Pn(t, e, r) {
null==e&&null==r||_n(t), null!=e&&(t.curOp.scrollLeft=e), null!=r&&(t.curOp.scrollTop=r);} function _n(t) {
var e=t.curOp.scrollToPos; e&&(t.curOp.scrollToPos=null, Un(t, tn(t, e.from), tn(t, e.to), e.margin));} function Un(t, e, r, n) {
var i=Bn(t, { left: Math.min(e.left, r.left), top: Math.min(e.top, r.top)-n, right: Math.max(e.right, r.right), bottom: Math.max(e.bottom, r.bottom)+n }); Pn(t, i.scrollLeft, i.scrollTop)
} function Kn(t, e) {
Math.abs(t.doc.scrollTop-e)<2||(g||fi(t, { top: e }), jn(t, e, !0), g&&fi(t), ai(t, 100))
} function jn(t, e, r) {
e=Math.min(t.display.scroller.scrollHeight-t.display.scroller.clientHeight, e), t.display.scroller.scrollTop==e&&!r||(t.doc.scrollTop=e, t.display.scrollbars.setScrollTop(e), t.display.scroller.scrollTop!=e&&(t.display.scroller.scrollTop=e))
} function Fn(t, e, r, n) {
e=Math.min(e, t.display.scroller.scrollWidth-t.display.scroller.clientWidth), (r?e==t.doc.scrollLeft:Math.abs(t.doc.scrollLeft-e)<2)&&!n||(t.doc.scrollLeft=e, gi(t), t.display.scroller.scrollLeft!=e&&(t.display.scroller.scrollLeft=e), t.display.scrollbars.setScrollLeft(e));} function zn(t) {
var e=t.display; var r=e.gutters.offsetWidth; var n=Math.round(t.doc.height+Er(t.display)); return { clientHeight: e.scroller.clientHeight, viewHeight: e.wrapper.clientHeight, scrollWidth: e.scroller.scrollWidth, clientWidth: e.scroller.clientWidth, viewWidth: e.wrapper.clientWidth, barLeft: t.options.fixedGutter?r:0, docHeight: n, scrollHeight: n+Dr(t)+e.barHeight, nativeBarWidth: e.nativeBarWidth, gutterWidth: r };} function Wn(t, e, r) {
this.cm=r; var n=this.vert=E('div', [E('div', null, null, "min-width: 1px")], "CodeMirror-vscrollbar"); var i=this.horiz=E('div', [E('div', null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar"); n.tabIndex=i.tabIndex=-1, t(n), t(i), bt(n, "scroll", function() {
n.clientHeight&&e(n.scrollTop, "vertical");}), bt(i, "scroll", function() {
i.clientWidth&&e(i.scrollLeft, "horizontal")
}), this.checkedZeroWidth=!1, w&&S<8&&(this.horiz.style.minHeight=this.vert.style.minWidth='18px');}Wn.prototype.update=function(t) {
var e=t.scrollWidth>t.clientWidth+1; var r=t.scrollHeight>t.clientHeight+1; var n=t.nativeBarWidth; if (r) {
this.vert.style.display='block', this.vert.style.bottom=e?n+'px':'0'; var i=t.viewHeight-(e?n:0); this.vert.firstChild.style.height=Math.max(0, t.scrollHeight-t.clientHeight+i)+'px'} else this.vert.style.display='', this.vert.firstChild.style.height='0'; if (e) {
this.horiz.style.display='block', this.horiz.style.right=r?n+'px':'0', this.horiz.style.left=t.barLeft+'px'; var o=t.viewWidth-t.barLeft-(r?n:0); this.horiz.firstChild.style.width=Math.max(0, t.scrollWidth-t.clientWidth+o)+'px'} else this.horiz.style.display='', this.horiz.firstChild.style.width='0'; return !this.checkedZeroWidth&&0<t.clientHeight&&(0==n&&this.zeroWidthHack(), this.checkedZeroWidth=!0), { right: r?n:0, bottom: e?n:0 };}, Wn.prototype.setScrollLeft=function(t) {
this.horiz.scrollLeft!=t&&(this.horiz.scrollLeft=t), this.disableHoriz&&this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz")
}, Wn.prototype.setScrollTop=function(t) {
this.vert.scrollTop!=t&&(this.vert.scrollTop=t), this.disableVert&&this.enableZeroWidthBar(this.vert, this.disableVert, "vert")
}, Wn.prototype.zeroWidthHack=function() {
var t=b&&!a?'12px':'18px'; this.horiz.style.height=this.vert.style.width=t, this.horiz.style.pointerEvents=this.vert.style.pointerEvents='none', this.disableHoriz=new U, this.disableVert=new U;}, Wn.prototype.enableZeroWidthBar=function(r, n, i) {
r.style.pointerEvents='auto', n.set(1e3, function t() {
var e=r.getBoundingClientRect(); ('vert'==i?document.elementFromPoint(e.right-1, (e.top+e.bottom)/2):document.elementFromPoint((e.right+e.left)/2, e.bottom-1))!=r?r.style.pointerEvents='none':n.set(1e3, t)
});}, Wn.prototype.clear=function() {
var t=this.horiz.parentNode; t.removeChild(this.horiz), t.removeChild(this.vert)
}; function Jn() {} function Vn(t, e) {
e=e||zn(t); var r=t.display.barWidth; var n=t.display.barHeight; qn(t, e); for (let i=0; i<4&&r!=t.display.barWidth||n!=t.display.barHeight; i++)r!=t.display.barWidth&&t.options.lineWrapping&&Nn(t), qn(t, zn(t)), r=t.display.barWidth, n=t.display.barHeight;} function qn(t, e) {
var r=t.display; var n=r.scrollbars.update(e); r.sizer.style.paddingRight=(r.barWidth=n.right)+'px', r.sizer.style.paddingBottom=(r.barHeight=n.bottom)+'px', r.heightForcer.style.borderBottom=n.bottom+'px solid transparent', n.right&&n.bottom?(r.scrollbarFiller.style.display='block', r.scrollbarFiller.style.height=n.bottom+'px', r.scrollbarFiller.style.width=n.right+'px'):r.scrollbarFiller.style.display='', n.bottom&&t.options.coverGutterNextToScrollbar&&t.options.fixedGutter?(r.gutterFiller.style.display='block', r.gutterFiller.style.height=n.bottom+'px', r.gutterFiller.style.width=e.gutterWidth+'px'):r.gutterFiller.style.display=''}Jn.prototype.update=function() {
return { bottom: 0, right: 0 }
}, Jn.prototype.setScrollLeft=function() {}, Jn.prototype.setScrollTop=function() {}, Jn.prototype.clear=function() {}; var Gn={ native: Wn, null: Jn }; function $n(r) {
r.display.scrollbars&&(r.display.scrollbars.clear(), r.display.scrollbars.addClass&&k(r.display.wrapper, r.display.scrollbars.addClass)), r.display.scrollbars=new Gn[r.options.scrollbarStyle](function(t) {
r.display.wrapper.insertBefore(t, r.display.scrollbarFiller), bt(t, "mousedown", function() {
r.state.focused&&setTimeout(function() {
return r.display.input.focus()
}, 0);}), t.setAttribute('cm-not-content', "true");}, function(t, e) {
('horizontal'==e?Fn:Kn)(r, t)
}, r), r.display.scrollbars.addClass&&I(r.display.wrapper, r.display.scrollbars.addClass)
} var Xn=0; function Yn(t) {
var e; t.curOp={ cm: t, viewChanged: !1, startHeight: t.doc.height, forceUpdate: !1, updateInput: 0, typing: !1, changeObjs: null, cursorActivityHandlers: null, cursorActivityCalled: 0, selectionChanged: !1, updateMaxLine: !1, scrollLeft: null, scrollTop: null, scrollToPos: null, focus: !1, id: ++Xn }, e=t.curOp, fr?fr.ops.push(e):e.ownsGroup=fr={ ops: [e], delayedCallbacks: [] };} function Zn(t) {
var e=t.curOp; e&&dr(e, function(t) {
for (let e=0; e<t.ops.length; e++)t.ops[e].cm.curOp=null; !function(t) {
for (var e=t.ops, r=0; r<e.length; r++)Qn(e[r]); for (let n=0; n<e.length; n++)(i=e[n]).updatedDisplay=i.mustUpdate&&ci(i.cm, i.update); var i; for (let o=0; o<e.length; o++)ti(e[o]); for (let s=0; s<e.length; s++)ei(e[s]); for (let a=0; a<e.length; a++)ri(e[a])
}(t);});} function Qn(t) {
var e; var r; var n=t.cm; var i=n.display; !(r=(e=n).display).scrollbarsClipped&&r.scroller.offsetWidth&&(r.nativeBarWidth=r.scroller.offsetWidth-r.scroller.clientWidth, r.heightForcer.style.height=Dr(e)+'px', r.sizer.style.marginBottom=-r.nativeBarWidth+'px', r.sizer.style.borderRightWidth=Dr(e)+'px', r.scrollbarsClipped=!0), t.updateMaxLine&&Qe(n), t.mustUpdate=t.viewChanged||t.forceUpdate||null!=t.scrollTop||t.scrollToPos&&(t.scrollToPos.from.line<i.viewFrom||t.scrollToPos.to.line>=i.viewTo)||i.maxLineChanged&&n.options.lineWrapping, t.update=t.mustUpdate&&new ui(n, t.mustUpdate&&{ top: t.scrollTop, ensure: t.scrollToPos }, t.forceUpdate);} function ti(t) {
var e=t.cm; var r=e.display; t.updatedDisplay&&Nn(e), t.barMeasure=zn(e), r.maxLineChanged&&!e.options.lineWrapping&&(t.adjustWidthTo=Hr(e, r.maxLine, r.maxLine.text.length).left+3, e.display.sizerWidth=t.adjustWidthTo, t.barMeasure.scrollWidth=Math.max(r.scroller.clientWidth, r.sizer.offsetLeft+t.adjustWidthTo+Dr(e)+e.display.barWidth), t.maxScrollLeft=Math.max(0, r.sizer.offsetLeft+t.adjustWidthTo-Ir(e))), (t.updatedDisplay||t.selectionChanged)&&(t.preparedSelection=r.input.prepareSelection())
} function ei(t) {
var e=t.cm; null!=t.adjustWidthTo&&(e.display.sizer.style.minWidth=t.adjustWidthTo+'px', t.maxScrollLeft<e.doc.scrollLeft&&Fn(e, Math.min(e.display.scroller.scrollLeft, t.maxScrollLeft), !0), e.display.maxLineChanged=!1); var r=t.focus&&t.focus==D(); t.preparedSelection&&e.display.input.showSelection(t.preparedSelection, r), !t.updatedDisplay&&t.startHeight==e.doc.height||Vn(e, t.barMeasure), t.updatedDisplay&&pi(e, t.barMeasure), t.selectionChanged&&kn(e), e.state.focused&&t.updateInput&&e.display.input.reset(t.typing), r&&Rn(t.cm);} function ri(t) {
var e=t.cm; var r=e.display; var n=e.doc; t.updatedDisplay&&hi(e, t.update), null==r.wheelStartX||null==t.scrollTop&&null==t.scrollLeft&&!t.scrollToPos||(r.wheelStartX=r.wheelStartY=null), null!=t.scrollTop&&jn(e, t.scrollTop, t.forceScroll), null!=t.scrollLeft&&Fn(e, t.scrollLeft, !0, !0), t.scrollToPos&&function(t, e) {
if (!At(t, "scrollCursorIntoView")) {
var r=t.display; var n=r.sizer.getBoundingClientRect(); var i=null; if (e.top+n.top<0?i=!0:e.bottom+n.top>(window.innerHeight||document.documentElement.clientHeight)&&(i=!1), null!=i&&!u) {
var o=E('div', "​", null, "position: absolute;\n                         top: "+(e.top-r.viewOffset-Lr(t.display))+'px;\n                         height: '+(e.bottom-e.top+Dr(t)+r.barHeight)+'px;\n                         left: '+e.left+'px; width: '+Math.max(2, e.right-e.left)+'px;'); t.display.lineSpace.appendChild(o), o.scrollIntoView(i), t.display.lineSpace.removeChild(o);}
}
}(e, function(t, e, r, n) {
var i; null==n&&(n=0), t.options.lineWrapping||e!=r||(r='before'==(e=e.ch?le(e.line, "before"==e.sticky?e.ch-1:e.ch, "after"):e).sticky?le(e.line, e.ch+1, "before"):e); for (let o=0; o<5; o++) {
var s=!1; var a=Qr(t,e); var l=r&&r!=e?Qr(t,r):a; var u=Bn(t,i={left:Math.min(a.left,l.left),top:Math.min(a.top,l.top)-n,right:Math.max(a.left,l.left),bottom:Math.max(a.bottom,l.bottom)+n}); var c=t.doc.scrollTop; var h=t.doc.scrollLeft; if (null!=u.scrollTop&&(Kn(t, u.scrollTop), 1<Math.abs(t.doc.scrollTop-c)&&(s=!0)), null!=u.scrollLeft&&(Fn(t, u.scrollLeft), 1<Math.abs(t.doc.scrollLeft-h)&&(s=!0)), !s) break;} return i;}(e, ge(n, t.scrollToPos.from), ge(n, t.scrollToPos.to), t.scrollToPos.margin)); var i=t.maybeHiddenMarkers; var o=t.maybeUnhiddenMarkers; if (i) for (let s=0; s<i.length; ++s)i[s].lines.length||Ct(i[s], "hide"); if (o) for (let a=0; a<o.length; ++a)o[a].lines.length&&Ct(o[a], "unhide"); r.wrapper.offsetHeight&&(n.scrollTop=e.display.scroller.scrollTop), t.changeObjs&&Ct(e, "changes", e, t.changeObjs), t.update&&t.update.finish()
} function ni(t, e) {
if (t.curOp) return e(); Yn(t); try {
return e()
} finally {
Zn(t);}
} function ii(t, e) {
return function() {
if (t.curOp) return e.apply(t, arguments); Yn(t); try {
return e.apply(t, arguments);} finally {
Zn(t);}
}
} function oi(t) {
return function() {
if (this.curOp) return t.apply(this, arguments); Yn(this); try {
return t.apply(this, arguments);} finally {
Zn(this);}
}
} function si(e) {
return function() {
var t=this.cm; if (!t||t.curOp) return e.apply(this, arguments); Yn(t); try {
return e.apply(this, arguments);} finally {
Zn(t)
}
}
} function ai(t, e) {
t.doc.highlightFrontier<t.display.viewTo&&t.state.highlight.set(e, H(li, t));} function li(l) {
var u=l.doc; if (!(u.highlightFrontier>=l.display.viewTo)) {
var c=+new Date+l.options.workTime; var h=we(l,u.highlightFrontier); var f=[]; u.iter(h.line, Math.min(u.first+u.size, l.display.viewTo+500), function(t) {
if (h.line>=l.display.viewFrom) {
var e=t.styles; var r=t.text.length>l.options.maxHighlightLength?Xt(u.mode,h.state):null; var n=xe(l, t, h, !0); r&&(h.state=r), t.styles=n.styles; var i=t.styleClasses; var o=n.classes; o?t.styleClasses=o:i&&(t.styleClasses=null); for (var s=!e||e.length!=t.styles.length||i!=o&&(!i||!o||i.bgClass!=o.bgClass||i.textClass!=o.textClass), a=0; !s&&a<e.length; ++a)s=e[a]!=t.styles[a]; s&&f.push(h.line), t.stateAfter=h.save(), h.nextLine();} else t.text.length<=l.options.maxHighlightLength&&Se(l, t.text, h), t.stateAfter=h.line%5==0?h.save():null, h.nextLine(); if (+new Date>c) return ai(l, l.options.workDelay), !0;}), u.highlightFrontier=h.line, u.modeFrontier=Math.max(u.modeFrontier, h.line), f.length&&ni(l, function() {
for (let t=0; t<f.length; t++)vn(l, f[t], "text")
});}
} var ui=function(t, e, r) {
var n=t.display; this.viewport=e, this.visible=In(n, t.doc, e), this.editorIsHidden=!n.wrapper.offsetWidth, this.wrapperHeight=n.wrapper.clientHeight, this.wrapperWidth=n.wrapper.clientWidth, this.oldDisplayWidth=Ir(t), this.force=r, this.dims=cn(t), this.events=[];}; function ci(t, e) {
var r=t.display; var n=t.doc; if (e.editorIsHidden) return yn(t), !1; if (!e.force&&e.visible.from>=r.viewFrom&&e.visible.to<=r.viewTo&&(null==r.updateLineNumbers||r.updateLineNumbers>=r.viewTo)&&r.renderedView==r.view&&0==bn(t)) return !1; mi(t)&&(yn(t), e.dims=cn(t)); var i=n.first+n.size; var o=Math.max(e.visible.from-t.options.viewportMargin,n.first); var s=Math.min(i, e.visible.to+t.options.viewportMargin); r.viewFrom<o&&o-r.viewFrom<20&&(o=Math.max(n.first, r.viewFrom)), r.viewTo>s&&r.viewTo-s<20&&(s=Math.min(i, r.viewTo)), Ee&&(o=qe(t.doc, o), s=Ge(t.doc, s)); var a; var l; var u; var c; var h=o!=r.viewFrom||s!=r.viewTo||r.lastWrapHeight!=e.wrapperHeight||r.lastWrapWidth!=e.wrapperWidth; l=o, u=s, 0==(c=(a=t).display).view.length||l>=c.viewTo||u<=c.viewFrom?(c.view=hr(a, l, u), c.viewFrom=l):(c.viewFrom>l?c.view=hr(a, l, c.viewFrom).concat(c.view):c.viewFrom<l&&(c.view=c.view.slice(gn(a, l))), c.viewFrom=l, c.viewTo<u?c.view=c.view.concat(hr(a, c.viewTo, u)):c.viewTo>u&&(c.view=c.view.slice(0, gn(a, u)))), c.viewTo=u, r.viewOffset=Ye(te(t.doc, r.viewFrom)), t.display.mover.style.top=r.viewOffset+'px'; var f=bn(t); if (!h&&0==f&&!e.force&&r.renderedView==r.view&&(null==r.updateLineNumbers||r.updateLineNumbers>=r.viewTo)) return !1; var d=function(t) {
if (t.hasFocus()) return null; var e=D(); if (!e||!N(t.display.lineDiv, e)) return null; var r={ activeElt: e }; if (window.getSelection) {
var n=window.getSelection(); n.anchorNode&&n.extend&&N(t.display.lineDiv, n.anchorNode)&&(r.anchorNode=n.anchorNode, r.anchorOffset=n.anchorOffset, r.focusNode=n.focusNode, r.focusOffset=n.focusOffset)
} return r;}(t); return 4<f&&(r.lineDiv.style.display='none'), function(r, t, e) {
var n=r.display; var i=r.options.lineNumbers; var o=n.lineDiv; var s=o.firstChild; function a(t) {
var e=t.nextSibling; return x&&b&&r.display.currentWheelTarget==t?t.style.display='none':t.parentNode.removeChild(t), e
} for (let l=n.view, u=n.viewFrom, c=0; c<l.length; c++) {
var h=l[c]; if (!h.hidden) if (h.node&&h.node.parentNode==o) {
for (;s!=h.node;)s=a(s); var f=i&&null!=t&&t<=u&&h.lineNumber; h.changes&&(-1<K(h.changes, "gutter")&&(f=!1), vr(r, h, u, e)), f&&(R(h.lineNumber), h.lineNumber.appendChild(document.createTextNode(ae(r.options, u)))), s=h.node.nextSibling;} else {
var d=(m=u, v=e, y=xr(p=r, g=h), g.text=g.node=y.pre, y.bgClass&&(g.bgClass=y.bgClass), y.textClass&&(g.textClass=y.textClass), wr(p, g), Sr(p, g, m, v), Ar(p, g, v), g.node); o.insertBefore(d, s);}u+=h.size;} var p; var g; var m; var v; var y; for (;s;)s=a(s)
}(t, r.updateLineNumbers, e.dims), 4<f&&(r.lineDiv.style.display=''), r.renderedView=r.view, function(t) {
if (t&&t.activeElt&&t.activeElt!=D()&&(t.activeElt.focus(), t.anchorNode&&N(document.body, t.anchorNode)&&N(document.body, t.focusNode))) {
var e=window.getSelection(); var r=document.createRange(); r.setEnd(t.anchorNode, t.anchorOffset), r.collapse(!1), e.removeAllRanges(), e.addRange(r), e.extend(t.focusNode, t.focusOffset)
}
}(d), R(r.cursorDiv), R(r.selectionDiv), r.gutters.style.height=r.sizer.style.minHeight=0, h&&(r.lastWrapHeight=e.wrapperHeight, r.lastWrapWidth=e.wrapperWidth, ai(t, 400)), !(r.updateLineNumbers=null);} function hi(t, e) {
for (let r=e.viewport, n=!0; (n&&t.options.lineWrapping&&e.oldDisplayWidth!=Ir(t)||(r&&null!=r.top&&(r={ top: Math.min(t.doc.height+Er(t.display)-Br(t), r.top) }), e.visible=In(t.display, t.doc, r), !(e.visible.from>=t.display.viewFrom&&e.visible.to<=t.display.viewTo)))&&ci(t, e); n=!1) {
Nn(t); var i=zn(t); wn(t), Vn(t, i), pi(t, i), e.force=!1
}e.signal(t, "update", t), t.display.viewFrom==t.display.reportedViewFrom&&t.display.viewTo==t.display.reportedViewTo||(e.signal(t, "viewportChange", t, t.display.viewFrom, t.display.viewTo), t.display.reportedViewFrom=t.display.viewFrom, t.display.reportedViewTo=t.display.viewTo)
} function fi(t, e) {
var r=new ui(t, e); if (ci(t, r)) {
Nn(t), hi(t, r); var n=zn(t); wn(t), Vn(t, n), pi(t, n), r.finish();}
} function di(t) {
var e=t.gutters.offsetWidth; t.sizer.style.marginLeft=e+'px'} function pi(t, e) {
t.display.sizer.style.minHeight=e.docHeight+'px', t.display.heightForcer.style.top=e.docHeight+'px', t.display.gutters.style.height=e.docHeight+t.display.barHeight+Dr(t)+'px'} function gi(t) {
var e=t.display; var r=e.view; if (e.alignWidgets||e.gutters.firstChild&&t.options.fixedGutter) {
for (var n=hn(e)-e.scroller.scrollLeft+t.doc.scrollLeft, i=e.gutters.offsetWidth, o=n+'px', s=0; s<r.length; s++) if (!r[s].hidden) {
t.options.fixedGutter&&(r[s].gutter&&(r[s].gutter.style.left=o), r[s].gutterBackground&&(r[s].gutterBackground.style.left=o)); var a=r[s].alignable; if (a) for (let l=0; l<a.length; l++)a[l].style.left=o;}t.options.fixedGutter&&(e.gutters.style.left=n+i+'px');}
} function mi(t) {
if (t.options.lineNumbers) {
var e=t.doc; var r=ae(t.options,e.first+e.size-1); var n=t.display; if (r.length!=n.lineNumChars) {
var i=n.measure.appendChild(E('div', [E('div', r)], "CodeMirror-linenumber CodeMirror-gutter-elt")); var o=i.firstChild.offsetWidth; var s=i.offsetWidth-o; return n.lineGutter.style.width='', n.lineNumInnerWidth=Math.max(o, n.lineGutter.offsetWidth-s)+1, n.lineNumWidth=n.lineNumInnerWidth+s, n.lineNumChars=n.lineNumInnerWidth?r.length:-1, n.lineGutter.style.width=n.lineNumWidth+'px', di(t.display), 1;}
}
} function vi(t, e) {
for (var r=[], n=!1, i=0; i<t.length; i++) {
var o=t[i]; var s=null; if ('string'!=typeof o&&(s=o.style, o=o.className), "CodeMirror-linenumbers"==o) {
if (!e) continue; n=!0
}r.push({ className: o, style: s });} return e&&!n&&r.push({ className: "CodeMirror-linenumbers", style: null }), r;} function yi(t) {
var e=t.gutters; var r=t.gutterSpecs; R(e), t.lineGutter=null; for (let n=0; n<r.length; ++n) {
var i=r[n]; var o=i.className; var s=i.style; var a=e.appendChild(E('div', null, "CodeMirror-gutter "+o)); s&&(a.style.cssText=s), "CodeMirror-linenumbers"==o&&((t.lineGutter=a).style.width=(t.lineNumWidth||1)+'px')
}e.style.display=r.length?'':'none', di(t);} function xi(t) {
yi(t.display), mn(t), gi(t);} function bi(t, e, r, n) {
var i=this; this.input=r, i.scrollbarFiller=E('div', null, "CodeMirror-scrollbar-filler"), i.scrollbarFiller.setAttribute('cm-not-content', "true"), i.gutterFiller=E('div', null, "CodeMirror-gutter-filler"), i.gutterFiller.setAttribute('cm-not-content', "true"), i.lineDiv=L('div', null, "CodeMirror-code"), i.selectionDiv=E('div', null, null, "position: relative; z-index: 1"), i.cursorDiv=E('div', null, "CodeMirror-cursors"), i.measure=E('div', null, "CodeMirror-measure"), i.lineMeasure=E('div', null, "CodeMirror-measure"), i.lineSpace=L('div', [i.measure, i.lineMeasure, i.selectionDiv, i.cursorDiv, i.lineDiv], null, "position: relative; outline: none"); var o=L('div', [i.lineSpace], "CodeMirror-lines"); i.mover=E('div', [o], null, "position: relative"), i.sizer=E('div', [i.mover], "CodeMirror-sizer"), i.sizerWidth=null, i.heightForcer=E('div', null, null, "position: absolute; height: "+j+'px; width: 1px;'), i.gutters=E('div', null, "CodeMirror-gutters"), i.lineGutter=null, i.scroller=E('div', [i.sizer, i.heightForcer, i.gutters], "CodeMirror-scroll"), i.scroller.setAttribute('tabIndex', "-1"), i.wrapper=E('div', [i.scrollbarFiller, i.gutterFiller, i.scroller], "CodeMirror"), w&&S<8&&(i.gutters.style.zIndex=-1, i.scroller.style.paddingRight=0), x||g&&f||(i.scroller.draggable=!0), t&&(t.appendChild?t.appendChild(i.wrapper):t(i.wrapper)), i.viewFrom=i.viewTo=e.first, i.reportedViewFrom=i.reportedViewTo=e.first, i.view=[], i.renderedView=null, i.externalMeasured=null, i.viewOffset=0, i.lastWrapHeight=i.lastWrapWidth=0, i.updateLineNumbers=null, i.nativeBarWidth=i.barHeight=i.barWidth=0, i.scrollbarsClipped=!1, i.lineNumWidth=i.lineNumInnerWidth=i.lineNumChars=null, i.alignWidgets=!1, i.cachedCharWidth=i.cachedTextHeight=i.cachedPaddingH=null, i.maxLine=null, i.maxLineLength=0, i.maxLineChanged=!1, i.wheelDX=i.wheelDY=i.wheelStartX=i.wheelStartY=null, i.shift=!1, i.selForContextMenu=null, i.activeTouch=null, i.gutterSpecs=vi(n.gutters, n.lineNumbers), yi(i), r.init(i);}ui.prototype.signal=function(t, e) {
kt(t, e)&&this.events.push(arguments);}, ui.prototype.finish=function() {
for (let t=0; t<this.events.length; t++)Ct.apply(null, this.events[t])
}; var wi=0; var Si=null; function Ci(t) {
var e=t.wheelDeltaX; var r=t.wheelDeltaY; return null==e&&t.detail&&t.axis==t.HORIZONTAL_AXIS&&(e=t.detail), null==r&&t.detail&&t.axis==t.VERTICAL_AXIS?r=t.detail:null==r&&(r=t.wheelDelta), { x: e, y: r }
} function Ai(t) {
var e=Ci(t); return e.x*=Si, e.y*=Si, e
} function Ti(t, e) {
var r=Ci(e); var n=r.x; var i=r.y; var o=t.display; var s=o.scroller; var a=s.scrollWidth>s.clientWidth; var l=s.scrollHeight>s.clientHeight; if (n&&a||i&&l) {
if (i&&b&&x)t:for (let u=e.target, c=o.view; u!=s; u=u.parentNode) for (let h=0; h<c.length; h++) if (c[h].node==u) {
t.display.currentWheelTarget=u; break t
} if (n&&!g&&!m&&null!=Si) return i&&l&&Kn(t, Math.max(0, s.scrollTop+i*Si)), Fn(t, Math.max(0, s.scrollLeft+n*Si)), (!i||i&&l)&&Mt(e), void(o.wheelStartX=null); if (i&&null!=Si) {
var f=i*Si; var d=t.doc.scrollTop; var p=d+o.wrapper.clientHeight; f<0?d=Math.max(0, d+f-50):p=Math.min(t.doc.height, p+f+50), fi(t, { top: d, bottom: p })
}wi<20&&(null==o.wheelStartX?(o.wheelStartX=s.scrollLeft, o.wheelStartY=s.scrollTop, o.wheelDX=n, o.wheelDY=i, setTimeout(function() {
if (null!=o.wheelStartX) {
var t=s.scrollLeft-o.wheelStartX; var e=s.scrollTop-o.wheelStartY; var r=e&&o.wheelDY&&e/o.wheelDY||t&&o.wheelDX&&t/o.wheelDX; o.wheelStartX=o.wheelStartY=null, r&&(Si=(Si*wi+r)/(wi+1), ++wi)
}
}, 200)):(o.wheelDX+=n, o.wheelDY+=i))
}
}w?Si=-.53:g?Si=15:s?Si=-.7:l&&(Si=-1/3); var ki=function(t, e) {
this.ranges=t, this.primIndex=e;}; ki.prototype.primary=function() {
return this.ranges[this.primIndex]
}, ki.prototype.equals=function(t) {
if (t==this) return !0; if (t.primIndex!=this.primIndex||t.ranges.length!=this.ranges.length) return !1; for (let e=0; e<this.ranges.length; e++) {
var r=this.ranges[e]; var n=t.ranges[e]; if (!ce(r.anchor, n.anchor)||!ce(r.head, n.head)) return !1
} return !0
}, ki.prototype.deepCopy=function() {
for (var t=[], e=0; e<this.ranges.length; e++)t[e]=new Ri(he(this.ranges[e].anchor), he(this.ranges[e].head)); return new ki(t, this.primIndex)
}, ki.prototype.somethingSelected=function() {
for (let t=0; t<this.ranges.length; t++) if (!this.ranges[t].empty()) return !0; return !1;}, ki.prototype.contains=function(t, e) {
e=e||t; for (let r=0; r<this.ranges.length; r++) {
var n=this.ranges[r]; if (0<=ue(e, n.from())&&ue(t, n.to())<=0) return r
} return -1
}; var Ri=function(t, e) {
this.anchor=t, this.head=e
}; function Mi(t, e, r) {
var n=t&&t.options.selectionsMayTouch; var i=e[r]; e.sort(function(t, e) {
return ue(t.from(), e.from());}), r=K(e, i); for (let o=1; o<e.length; o++) {
var s=e[o]; var a=e[o-1]; var l=ue(a.to(), s.from()); if (n&&!s.empty()?0<l:0<=l) {
var u=de(a.from(), s.from()); var c=fe(a.to(),s.to()); var h=a.empty()?s.from()==s.head:a.from()==a.head; o<=r&&--r, e.splice(--o, 2, new Ri(h?c:u, h?u:c))
}
} return new ki(e, r);} function Li(t, e) {
return new ki([new Ri(t, e||t)], 0)
} function Ei(t) {
return t.text?le(t.from.line+t.text.length-1, $(t.text).length+(1==t.text.length?t.from.ch:0)):t.to
} function Ni(t, e) {
if (ue(t, e.from)<0) return t; if (ue(t, e.to)<=0) return Ei(e); var r=t.line+e.text.length-(e.to.line-e.from.line)-1; var n=t.ch; return t.line==e.to.line&&(n+=Ei(e).ch-e.to.ch), le(r, n);} function Di(t, e) {
for (var r=[], n=0; n<t.sel.ranges.length; n++) {
var i=t.sel.ranges[n]; r.push(new Ri(Ni(i.anchor, e), Ni(i.head, e)));} return Mi(t.cm, r, t.sel.primIndex)
} function Ii(t, e, r) {
return t.line==e.line?le(r.line, t.ch-e.ch+r.ch):le(r.line+(t.line-e.line), t.ch)
} function Bi(t) {
t.doc.mode=qt(t.options, t.doc.modeOption), Oi(t);} function Oi(t) {
t.doc.iter(function(t) {
t.stateAfter&&(t.stateAfter=null), t.styles&&(t.styles=null);}), t.doc.modeFrontier=t.doc.highlightFrontier=t.doc.first, ai(t, 100), t.state.modeGen++, t.curOp&&mn(t)
} function Hi(t, e) {
return 0==e.from.ch&&0==e.to.ch&&''==$(e.text)&&(!t.cm||t.cm.options.wholeLineUpdateBefore)
} function Pi(t, n, e, i) {
function o(t) {
return e?e[t]:null
} function r(t, e, r) {
!function(t, e, r, n) {
t.text=e, t.stateAfter&&(t.stateAfter=null), t.styles&&(t.styles=null), null!=t.order&&(t.order=null), He(t), Pe(t, r); var i=n?n(t):1; i!=t.height&&ne(t, i)
}(t, e, r, i), gr(t, "change", t, n)
} function s(t, e) {
for (var r=[], n=t; n<e; ++n)r.push(new tr(u[n], o(n), i)); return r;} var a=n.from; var l=n.to; var u=n.text; var c=te(t,a.line); var h=te(t,l.line); var f=$(u); var d=o(u.length-1); var p=l.line-a.line; if (n.full)t.insert(0, s(0, u.length)), t.remove(u.length, t.size-u.length); else if (Hi(t, n)) {
var g=s(0, u.length-1); r(h, h.text, d), p&&t.remove(a.line, p), g.length&&t.insert(a.line, g);} else if (c==h) if (1==u.length)r(c, c.text.slice(0, a.ch)+f+c.text.slice(l.ch), d); else {
var m=s(1, u.length-1); m.push(new tr(f+c.text.slice(l.ch), d, i)), r(c, c.text.slice(0, a.ch)+u[0], o(0)), t.insert(a.line+1, m);} else if (1==u.length)r(c, c.text.slice(0, a.ch)+u[0]+h.text.slice(l.ch), o(0)), t.remove(a.line+1, p); else {
r(c, c.text.slice(0, a.ch)+u[0], o(0)), r(h, f+h.text.slice(l.ch), d); var v=s(1, u.length-1); 1<p&&t.remove(a.line+1, p-1), t.insert(a.line+1, v);}gr(t, "change", t, n);} function _i(t, a, l) {
!function t(e, r, n) {
if (e.linked) for (let i=0; i<e.linked.length; ++i) {
var o=e.linked[i]; if (o.doc!=r) {
var s=n&&o.sharedHist; l&&!s||(a(o.doc, s), t(o.doc, e, s));}
}
}(t, null, !0);} function Ui(t, e) {
if (e.cm) throw new Error('This document is already in use.'); dn((t.doc=e).cm=t), Bi(t), Ki(t), t.options.lineWrapping||Qe(t), t.options.mode=e.modeOption, mn(t)
} function Ki(t) {
('rtl'==t.doc.direction?I:k)(t.display.lineDiv, "CodeMirror-rtl");} function ji(t) {
this.done=[], this.undone=[], this.undoDepth=1/0, this.lastModTime=this.lastSelTime=0, this.lastOp=this.lastSelOp=null, this.lastOrigin=this.lastSelOrigin=null, this.generation=this.maxGeneration=t||1;} function Fi(t, e) {
var r={ from: he(e.from), to: Ei(e), text: ee(t, e.from, e.to) }; return qi(t, r, e.from.line, e.to.line+1), _i(t, function(t) {
return qi(t, r, e.from.line, e.to.line+1);}, !0), r;} function zi(t) {
for (;t.length;) {
if (!$(t).ranges) break; t.pop()
}
} function Wi(t, e, r, n) {
var i=t.history; i.undone.length=0; var o; var s; var a; var l=+new Date; if ((i.lastOp==n||i.lastOrigin==e.origin&&e.origin&&('+'==e.origin.charAt(0)&&i.lastModTime>l-(t.cm?t.cm.options.historyEventDelay:500)||'*'==e.origin.charAt(0)))&&(o=(a=i).lastOp==n?(zi(a.done), $(a.done)):a.done.length&&!$(a.done).ranges?$(a.done):1<a.done.length&&!a.done[a.done.length-2].ranges?(a.done.pop(), $(a.done)):void 0))s=$(o.changes), 0==ue(e.from, e.to)&&0==ue(e.from, s.to)?s.to=Ei(e):o.changes.push(Fi(t, e)); else {
var u=$(i.done); for (u&&u.ranges||Vi(t.sel, i.done), o={ changes: [Fi(t, e)], generation: i.generation }, i.done.push(o); i.done.length>i.undoDepth;)i.done.shift(), i.done[0].ranges||i.done.shift()
}i.done.push(r), i.generation=++i.maxGeneration, i.lastModTime=i.lastSelTime=l, i.lastOp=i.lastSelOp=n, i.lastOrigin=i.lastSelOrigin=e.origin, s||Ct(t, "historyAdded")
} function Ji(t, e, r, n) {
var i; var o; var s; var a; var l; var u=t.history; var c=n&&n.origin; r==u.lastSelOp||c&&u.lastSelOrigin==c&&(u.lastModTime==u.lastSelTime&&u.lastOrigin==c||(i=t, o=c, s=$(u.done), a=e, "*"==(l=o.charAt(0))||'+'==l&&s.ranges.length==a.ranges.length&&s.somethingSelected()==a.somethingSelected()&&new Date-i.history.lastSelTime<=(i.cm?i.cm.options.historyEventDelay:500)))?u.done[u.done.length-1]=e:Vi(e, u.done), u.lastSelTime=+new Date, u.lastSelOrigin=c, u.lastSelOp=r, n&&!1!==n.clearRedo&&zi(u.undone)
} function Vi(t, e) {
var r=$(e); r&&r.ranges&&r.equals(t)||e.push(t)
} function qi(e, r, t, n) {
var i=r['spans_'+e.id]; var o=0; e.iter(Math.max(e.first, t), Math.min(e.first+e.size, n), function(t) {
t.markedSpans&&((i=i||(r['spans_'+e.id]={}))[o]=t.markedSpans), ++o;})
} function Gi(t) {
if (!t) return null; for (var e, r=0; r<t.length; ++r)t[r].marker.explicitlyCleared?e=e||t.slice(0, r):e&&e.push(t[r]); return e?e.length?e:null:t;} function $i(t, e) {
var r=function(t, e) {
var r=e['spans_'+t.id]; if (!r) return null; for (var n=[], i=0; i<e.text.length; ++i)n.push(Gi(r[i])); return n
}(t, e); var n=Be(t, e); if (!r) return n; if (!n) return r; for (let i=0; i<r.length; ++i) {
var o=r[i]; var s=n[i]; if (o&&s)t:for (let a=0; a<s.length; ++a) {
for (var l=s[a], u=0; u<o.length; ++u) if (o[u].marker==l.marker) continue t; o.push(l);} else s&&(r[i]=s)
} return r
} function Xi(t, e, r) {
for (var n=[], i=0; i<t.length; ++i) {
var o=t[i]; if (o.ranges)n.push(r?ki.prototype.deepCopy.call(o):o); else {
var s=o.changes; var a=[]; n.push({ changes: a }); for (let l=0; l<s.length; ++l) {
var u=s[l]; var c=void 0; if (a.push({ from: u.from, to: u.to, text: u.text }), e) for (let h in u)(c=h.match(/^spans_(\d+)$/))&&-1<K(e, Number(c[1]))&&($(a)[h]=u[h], delete u[h]);}
}
} return n;} function Yi(t, e, r, n) {
if (n) {
var i=t.anchor; if (r) {
var o=ue(e, i)<0; o!=ue(r, i)<0?(i=e, e=r):o!=ue(e, r)<0&&(e=r)
} return new Ri(i, e);} return new Ri(r||e, e)
} function Zi(t, e, r, n, i) {
null==i&&(i=t.cm&&(t.cm.display.shift||t.extend)), no(t, new ki([Yi(t.sel.primary(), e, r, i)], 0), n)
} function Qi(t, e, r) {
for (var n=[], i=t.cm&&(t.cm.display.shift||t.extend), o=0; o<t.sel.ranges.length; o++)n[o]=Yi(t.sel.ranges[o], e[o], null, i); no(t, Mi(t.cm, n, t.sel.primIndex), r);} function to(t, e, r, n) {
var i=t.sel.ranges.slice(0); i[e]=r, no(t, Mi(t.cm, i, t.sel.primIndex), n)
} function eo(t, e, r, n) {
no(t, Li(e, r), n)
} function ro(t, e, r) {
var n=t.history.done; var i=$(n); i&&i.ranges?io(t, n[n.length-1]=e, r):no(t, e, r)
} function no(t, e, r) {
io(t, e, r), Ji(t, t.sel, t.cm?t.cm.curOp.id:NaN, r)
} function io(t, e, r) {
var n; var i; var o; var s; (kt(t, "beforeSelectionChange")||t.cm&&kt(t.cm, "beforeSelectionChange"))&&(n=t, o=r, s={ ranges: (i=e).ranges, update: function(t) {
this.ranges=[]; for (let e=0; e<t.length; e++) this.ranges[e]=new Ri(ge(n, t[e].anchor), ge(n, t[e].head))
}, origin: o&&o.origin }, Ct(n, "beforeSelectionChange", n, s), n.cm&&Ct(n.cm, "beforeSelectionChange", n.cm, s), e=s.ranges!=i.ranges?Mi(n.cm, s.ranges, s.ranges.length-1):i); var a=r&&r.bias||(ue(e.primary().head, t.sel.primary().head)<0?-1:1); oo(t, ao(t, e, a, !0)), r&&!1===r.scroll||!t.cm||Hn(t.cm);} function oo(t, e) {
e.equals(t.sel)||(t.sel=e, t.cm&&(t.cm.curOp.updateInput=1, t.cm.curOp.selectionChanged=!0, Tt(t.cm)), gr(t, "cursorActivity", t))
} function so(t) {
oo(t, ao(t, t.sel, null, !1))
} function ao(t, e, r, n) {
for (var i, o=0; o<e.ranges.length; o++) {
var s=e.ranges[o]; var a=e.ranges.length==t.sel.ranges.length&&t.sel.ranges[o]; var l=uo(t,s.anchor,a&&a.anchor,r,n); var u=uo(t, s.head, a&&a.head, r, n); !i&&l==s.anchor&&u==s.head||((i=i||e.ranges.slice(0, o))[o]=new Ri(l, u));} return i?Mi(t.cm, i, e.primIndex):e;} function lo(t, e, r, n, i) {
var o=te(t, e.line); if (o.markedSpans) for (let s=0; s<o.markedSpans.length; ++s) {
var a=o.markedSpans[s]; var l=a.marker; var u="selectLeft"in l?!l.selectLeft:l.inclusiveLeft; var c='selectRight'in l?!l.selectRight:l.inclusiveRight; if ((null==a.from||(u?a.from<=e.ch:a.from<e.ch))&&(null==a.to||(c?a.to>=e.ch:a.to>e.ch))) {
if (i&&(Ct(l, "beforeCursorEnter"), l.explicitlyCleared)) {
if (o.markedSpans) {
--s; continue;} break
} if (!l.atomic) continue; if (r) {
var h=l.find(n<0?1:-1); var f=void 0; if ((n<0?c:u)&&(h=co(t, h, -n, h&&h.line==e.line?o:null)), h&&h.line==e.line&&(f=ue(h, r))&&(n<0?f<0:0<f)) return lo(t, h, e, n, i)
} var d=l.find(n<0?-1:1); return (n<0?u:c)&&(d=co(t, d, n, d.line==e.line?o:null)), d?lo(t, d, e, n, i):null
}
} return e;} function uo(t, e, r, n, i) {
var o=n||1; var s=lo(t, e, r, o, i)||!i&&lo(t, e, r, o, !0)||lo(t, e, r, -o, i)||!i&&lo(t, e, r, -o, !0); return s||(t.cantEdit=!0, le(t.first, 0))
} function co(t, e, r, n) {
return r<0&&0==e.ch?e.line>t.first?ge(t, le(e.line-1)):null:0<r&&e.ch==(n||te(t, e.line)).text.length?e.line<t.first+t.size-1?le(e.line+1, 0):null:new le(e.line, e.ch+r);} function ho(t) {
t.setSelection(le(t.firstLine(), 0), le(t.lastLine()), z)
} function fo(i, t, e) {
var o={ canceled: !1, from: t.from, to: t.to, text: t.text, origin: t.origin, cancel: function() {
return o.canceled=!0;} }; return e&&(o.update=function(t, e, r, n) {
t&&(o.from=ge(i, t)), e&&(o.to=ge(i, e)), r&&(o.text=r), void 0!==n&&(o.origin=n)
}), Ct(i, "beforeChange", i, o), i.cm&&Ct(i.cm, "beforeChange", i.cm, o), o.canceled?(i.cm&&(i.cm.curOp.updateInput=2), null):{ from: o.from, to: o.to, text: o.text, origin: o.origin }
} function po(t, e, r) {
if (t.cm) {
if (!t.cm.curOp) return ii(t.cm, po)(t, e, r); if (t.cm.state.suppressEdits) return;} if (!(kt(t, "beforeChange")||t.cm&&kt(t.cm, "beforeChange"))||(e=fo(t, e, !0))) {
var n=Le&&!r&&function(t, e, r) {
var n=null; if (t.iter(e.line, r.line+1, function(t) {
if (t.markedSpans) for (let e=0; e<t.markedSpans.length; ++e) {
var r=t.markedSpans[e].marker; !r.readOnly||n&&-1!=K(n, r)||(n=n||[]).push(r)
}
}), !n) return null; for (var i=[{ from: e, to: r }], o=0; o<n.length; ++o) for (let s=n[o], a=s.find(0), l=0; l<i.length; ++l) {
var u=i[l]; if (!(ue(u.to, a.from)<0||0<ue(u.from, a.to))) {
var c=[l, 1]; var h=ue(u.from,a.from); var f=ue(u.to, a.to); (h<0||!s.inclusiveLeft&&!h)&&c.push({ from: u.from, to: a.from }), (0<f||!s.inclusiveRight&&!f)&&c.push({ from: a.to, to: u.to }), i.splice.apply(i, c), l+=c.length-3;}
} return i;}(t, e.from, e.to); if (n) for (let i=n.length-1; 0<=i; --i)go(t, { from: n[i].from, to: n[i].to, text: i?['']:e.text, origin: e.origin }); else go(t, e)
}
} function go(t, r) {
if (1!=r.text.length||''!=r.text[0]||0!=ue(r.from, r.to)) {
var e=Di(t, r); Wi(t, r, e, t.cm?t.cm.curOp.id:NaN), yo(t, r, e, Be(t, r)); var n=[]; _i(t, function(t, e) {
e||-1!=K(n, t.history)||(So(t.history, r), n.push(t.history)), yo(t, r, null, Be(t, r));})
}
} function mo(i, o, t) {
var e=i.cm&&i.cm.state.suppressEdits; if (!e||t) {
for (var s, r=i.history, n=i.sel, a='undo'==o?r.done:r.undone, l='undo'==o?r.undone:r.done, u=0; u<a.length&&(s=a[u], t?!s.ranges||s.equals(i.sel):s.ranges); u++);if (u!=a.length) {
for (r.lastOrigin=r.lastSelOrigin=null; ;) {
if (!(s=a.pop()).ranges) {
if (e) return void a.push(s); break;} if (Vi(s, l), t&&!s.equals(i.sel)) return void no(i, s, { clearRedo: !1 }); n=s
} var c=[]; Vi(n, l), l.push({ changes: c, generation: r.generation }), r.generation=s.generation||++r.maxGeneration; for (var h=kt(i, "beforeChange")||i.cm&&kt(i.cm, "beforeChange"), f=function(t) {
var r=s.changes[t]; if (r.origin=o, h&&!fo(i, r, !1)) return a.length=0, {}; c.push(Fi(i, r)); var e=t?Di(i, r):$(a); yo(i, r, e, $i(i, r)), !t&&i.cm&&i.cm.scrollIntoView({ from: r.from, to: Ei(r) }); var n=[]; _i(i, function(t, e) {
e||-1!=K(n, t.history)||(So(t.history, r), n.push(t.history)), yo(t, r, null, $i(t, r))
});}, d=s.changes.length-1; 0<=d; --d) {
var p=f(d); if (p) return p.v
}
}
}
} function vo(t, e) {
if (0!=e&&(t.first+=e, t.sel=new ki(X(t.sel.ranges, function(t) {
return new Ri(le(t.anchor.line+e, t.anchor.ch), le(t.head.line+e, t.head.ch));}), t.sel.primIndex), t.cm)) {
mn(t.cm, t.first, t.first-e, e); for (let r=t.cm.display, n=r.viewFrom; n<r.viewTo; n++)vn(t.cm, n, "gutter")
}
} function yo(t, e, r, n) {
if (t.cm&&!t.cm.curOp) return ii(t.cm, yo)(t, e, r, n); if (e.to.line<t.first)vo(t, e.text.length-1-(e.to.line-e.from.line)); else if (!(e.from.line>t.lastLine())) {
if (e.from.line<t.first) {
var i=e.text.length-1-(t.first-e.from.line); vo(t, i), e={ from: le(t.first, 0), to: le(e.to.line+i, e.to.ch), text: [$(e.text)], origin: e.origin }
} var o=t.lastLine(); e.to.line>o&&(e={ from: e.from, to: le(o, te(t, o).text.length), text: [e.text[0]], origin: e.origin }), e.removed=ee(t, e.from, e.to), r=r||Di(t, e), t.cm?function(t, e, r) {
var n=t.doc; var i=t.display; var o=e.from; var s=e.to; var a=!1; var l=o.line; t.options.lineWrapping||(l=ie(Ve(te(n, o.line))), n.iter(l, s.line+1, function(t) {
if (t==i.maxLine) return a=!0
})); -1<n.sel.contains(e.from, e.to)&&Tt(t); Pi(n, e, r, fn(t)), t.options.lineWrapping||(n.iter(l, o.line+e.text.length, function(t) {
var e=Ze(t); e>i.maxLineLength&&(i.maxLine=t, i.maxLineLength=e, i.maxLineChanged=!0, a=!1)
}), a&&(t.curOp.updateMaxLine=!0)); (function(t, e) {
if (t.modeFrontier=Math.min(t.modeFrontier, e), !(t.highlightFrontier<e-10)) {
for (var r=t.first, n=e-1; r<n; n--) {
var i=te(t, n).stateAfter; if (i&&(!(i instanceof ve)||n+i.lookAhead<e)) {
r=n+1; break
}
}t.highlightFrontier=Math.min(t.highlightFrontier, r)
}
})(n, o.line), ai(t, 400); var u=e.text.length-(s.line-o.line)-1; e.full?mn(t):o.line!=s.line||1!=e.text.length||Hi(t.doc, e)?mn(t, o.line, s.line+1, u):vn(t, o.line, "text"); var c=kt(t, "changes"); var h=kt(t, "change"); if (h||c) {
var f={ from: o, to: s, text: e.text, removed: e.removed, origin: e.origin }; h&&gr(t, "change", t, f), c&&(t.curOp.changeObjs||(t.curOp.changeObjs=[])).push(f);}t.display.selForContextMenu=null;}(t.cm, e, n):Pi(t, e, n), io(t, r, z), t.cantEdit&&uo(t, le(t.firstLine(), 0))&&(t.cantEdit=!1);}
} function xo(t, e, r, n, i) {
var o; ue(n=n||r, r)<0&&(r=(o=[n, r])[0], n=o[1]), "string"==typeof e&&(e=t.splitLines(e)), po(t, { from: r, to: n, text: e, origin: i })
} function bo(t, e, r, n) {
r<t.line?t.line+=n:e<t.line&&(t.line=e, t.ch=0)
} function wo(t, e, r, n) {
for (let i=0; i<t.length; ++i) {
var o=t[i]; var s=!0; if (o.ranges) {
o.copied||((o=t[i]=o.deepCopy()).copied=!0); for (let a=0; a<o.ranges.length; a++)bo(o.ranges[a].anchor, e, r, n), bo(o.ranges[a].head, e, r, n);} else {
for (let l=0; l<o.changes.length; ++l) {
var u=o.changes[l]; if (r<u.from.line)u.from=le(u.from.line+n, u.from.ch), u.to=le(u.to.line+n, u.to.ch); else if (e<=u.to.line) {
s=!1; break
}
}s||(t.splice(0, i+1), i=0)
}
}
} function So(t, e) {
var r=e.from.line; var n=e.to.line; var i=e.text.length-(n-r)-1; wo(t.done, r, n, i), wo(t.undone, r, n, i);} function Co(t, e, r, n) {
var i=e; var o=e; return "number"==typeof e?o=te(t, pe(t, e)):i=ie(e), null==i?null:(n(o, i)&&t.cm&&vn(t.cm, i, r), o)
} function Ao(t) {
this.lines=t, this.parent=null; for (var e=0, r=0; r<t.length; ++r)t[r].parent=this, e+=t[r].height; this.height=e
} function To(t) {
this.children=t; for (var e=0, r=0, n=0; n<t.length; ++n) {
var i=t[n]; e+=i.chunkSize(), r+=i.height, i.parent=this;} this.size=e, this.height=r, this.parent=null;}Ri.prototype.from=function() {
return de(this.anchor, this.head)
}, Ri.prototype.to=function() {
return fe(this.anchor, this.head)
}, Ri.prototype.empty=function() {
return this.head.line==this.anchor.line&&this.head.ch==this.anchor.ch;}, Ao.prototype={ chunkSize: function() {
return this.lines.length
}, removeInner: function(t, e) {
for (let r=t, n=t+e; r<n; ++r) {
var i=this.lines[r]; this.height-=i.height, (o=i).parent=null, He(o), gr(i, "delete");} var o; this.lines.splice(t, e);}, collapse: function(t) {
t.push.apply(t, this.lines)
}, insertInner: function(t, e, r) {
this.height+=r, this.lines=this.lines.slice(0, t).concat(e).concat(this.lines.slice(t)); for (let n=0; n<e.length; ++n)e[n].parent=this;}, iterN: function(t, e, r) {
for (let n=t+e; t<n; ++t) if (r(this.lines[t])) return !0
} }, To.prototype={ chunkSize: function() {
return this.size
}, removeInner: function(t, e) {
this.size-=e; for (let r=0; r<this.children.length; ++r) {
var n=this.children[r]; var i=n.chunkSize(); if (t<i) {
var o=Math.min(e, i-t); var s=n.height; if (n.removeInner(t, o), this.height-=s-n.height, i==o&&(this.children.splice(r--, 1), n.parent=null), 0==(e-=o)) break; t=0;} else t-=i;} if (this.size-e<25&&(1<this.children.length||!(this.children[0]instanceof Ao))) {
var a=[]; this.collapse(a), this.children=[new Ao(a)], this.children[0].parent=this;}
}, collapse: function(t) {
for (let e=0; e<this.children.length; ++e) this.children[e].collapse(t);}, insertInner: function(t, e, r) {
this.size+=e.length, this.height+=r; for (let n=0; n<this.children.length; ++n) {
var i=this.children[n]; var o=i.chunkSize(); if (t<=o) {
if (i.insertInner(t, e, r), i.lines&&50<i.lines.length) {
for (var s=i.lines.length%25+25, a=s; a<i.lines.length;) {
var l=new Ao(i.lines.slice(a, a+=25)); i.height-=l.height, this.children.splice(++n, 0, l), l.parent=this
}i.lines=i.lines.slice(0, s), this.maybeSpill()
} break;}t-=o;}
}, maybeSpill: function() {
if (!(this.children.length<=10)) {
var t=this; do {
var e=new To(t.children.splice(t.children.length-5, 5)); if (t.parent) {
t.size-=e.size, t.height-=e.height; var r=K(t.parent.children, t); t.parent.children.splice(r+1, 0, e)
} else {
var n=new To(t.children); (n.parent=t).children=[n, e], t=n;}e.parent=t.parent;} while (10<t.children.length);t.parent.maybeSpill();}
}, iterN: function(t, e, r) {
for (let n=0; n<this.children.length; ++n) {
var i=this.children[n]; var o=i.chunkSize(); if (t<o) {
var s=Math.min(e, o-t); if (i.iterN(t, s, r)) return !0; if (0==(e-=s)) break; t=0;} else t-=o;}
} }; function ko(t, e, r) {
if (r) for (let n in r)r.hasOwnProperty(n)&&(this[n]=r[n]); this.doc=t, this.node=e
} function Ro(t, e, r) {
Ye(e)<(t.curOp&&t.curOp.scrollTop||t.doc.scrollTop)&&On(t, r)
}ko.prototype.clear=function() {
var t=this.doc.cm; var e=this.line.widgets; var r=this.line; var n=ie(r); if (null!=n&&e) {
for (let i=0; i<e.length; ++i)e[i]==this&&e.splice(i--, 1); e.length||(r.widgets=null); var o=Rr(this); ne(r, Math.max(0, r.height-o)), t&&(ni(t, function() {
Ro(t, r, -o), vn(t, n, "widget");}), gr(t, "lineWidgetCleared", t, this, n))
}
}, ko.prototype.changed=function() {
var t=this; var e=this.height; var r=this.doc.cm; var n=this.line; this.height=null; var i=Rr(this)-e; i&&($e(this.doc, n)||ne(n, n.height+i), r&&ni(r, function() {
r.curOp.forceUpdate=!0, Ro(r, n, i), gr(r, "lineWidgetChanged", r, t, ie(n))
}));}, Rt(ko); var Mo=0; var Lo=function(t, e) {
this.lines=[], this.type=e, this.doc=t, this.id=++Mo;}; function Eo(e, n, i, t, r) {
if (t&&t.shared) return function(t, r, n, i, o) {
(i=P(i)).shared=!1; var s=[Eo(t, r, n, i, o)]; var a=s[0]; var l=i.widgetNode; return _i(t, function(t) {
l&&(i.widgetNode=l.cloneNode(!0)), s.push(Eo(t, ge(t, r), ge(t, n), i, o)); for (let e=0; e<t.linked.length; ++e) if (t.linked[e].isParent) return; a=$(s);}), new No(s, a);}(e, n, i, t, r); if (e.cm&&!e.cm.curOp) return ii(e.cm, Eo)(e, n, i, t, r); var o=new Lo(e, r); var s=ue(n, i); if (t&&P(t, o, !1), 0<s||0==s&&!1!==o.clearWhenEmpty) return o; if (o.replacedWith&&(o.collapsed=!0, o.widgetNode=L('span', [o.replacedWith], "CodeMirror-widget"), t.handleMouseEvents||o.widgetNode.setAttribute('cm-ignore-events', "true"), t.insertLeft&&(o.widgetNode.insertLeft=!0)), o.collapsed) {
if (Je(e, n.line, n, i, o)||n.line!=i.line&&Je(e, i.line, n, i, o)) throw new Error('Inserting collapsed marker partially overlapping an existing one'); Ee=!0
}o.addToHistory&&Wi(e, { from: n, to: i, origin: "markText" }, e.sel, NaN); var a; var l=n.line; var u=e.cm; if (e.iter(l, i.line+1, function(t) {
var e; var r; u&&o.collapsed&&!u.options.lineWrapping&&Ve(t)==u.display.maxLine&&(a=!0), o.collapsed&&l!=n.line&&ne(t, 0), e=t, r=new Ne(o, l==n.line?n.ch:null, l==i.line?i.ch:null), e.markedSpans=e.markedSpans?e.markedSpans.concat([r]):[r], r.marker.attachLine(e), ++l
}), o.collapsed&&e.iter(n.line, i.line+1, function(t) {
$e(e, t)&&ne(t, 0)
}), o.clearOnEnter&&bt(o, "beforeCursorEnter", function() {
return o.clear()
}), o.readOnly&&(Le=!0, (e.history.done.length||e.history.undone.length)&&e.clearHistory()), o.collapsed&&(o.id=++Mo, o.atomic=!0), u) {
if (a&&(u.curOp.updateMaxLine=!0), o.collapsed)mn(u, n.line, i.line+1); else if (o.className||o.startStyle||o.endStyle||o.css||o.attributes||o.title) for (let c=n.line; c<=i.line; c++)vn(u, c, "text"); o.atomic&&so(u.doc), gr(u, "markerAdded", u, o);} return o;}Lo.prototype.clear=function() {
if (!this.explicitlyCleared) {
var t=this.doc.cm; var e=t&&!t.curOp; if (e&&Yn(t), kt(this, "clear")) {
var r=this.find(); r&&gr(this, "clear", r.from, r.to);} for (var n=null, i=null, o=0; o<this.lines.length; ++o) {
var s=this.lines[o]; var a=De(s.markedSpans, this); t&&!this.collapsed?vn(t, ie(s), "text"):t&&(null!=a.to&&(i=ie(s)), null!=a.from&&(n=ie(s))), s.markedSpans=Ie(s.markedSpans, a), null==a.from&&this.collapsed&&!$e(this.doc, s)&&t&&ne(s, ln(t.display));} if (t&&this.collapsed&&!t.options.lineWrapping) for (let l=0; l<this.lines.length; ++l) {
var u=Ve(this.lines[l]); var c=Ze(u); c>t.display.maxLineLength&&(t.display.maxLine=u, t.display.maxLineLength=c, t.display.maxLineChanged=!0);}null!=n&&t&&this.collapsed&&mn(t, n, i+1), this.lines.length=0, this.explicitlyCleared=!0, this.atomic&&this.doc.cantEdit&&(this.doc.cantEdit=!1, t&&so(t.doc)), t&&gr(t, "markerCleared", t, this, n, i), e&&Zn(t), this.parent&&this.parent.clear();}
}, Lo.prototype.find=function(t, e) {
var r; var n; null==t&&'bookmark'==this.type&&(t=1); for (let i=0; i<this.lines.length; ++i) {
var o=this.lines[i]; var s=De(o.markedSpans, this); if (null!=s.from&&(r=le(e?o:ie(o), s.from), -1==t)) return r; if (null!=s.to&&(n=le(e?o:ie(o), s.to), 1==t)) return n
} return r&&{ from: r, to: n }
}, Lo.prototype.changed=function() {
var o=this; var s=this.find(-1,!0); var a=this; var l=this.doc.cm; s&&l&&ni(l, function() {
var t=s.line; var e=ie(s.line); var r=Pr(l, e); if (r&&(Wr(r), l.curOp.selectionChanged=l.curOp.forceUpdate=!0), l.curOp.updateMaxLine=!0, !$e(a.doc, t)&&null!=a.height) {
var n=a.height; a.height=null; var i=Rr(a)-n; i&&ne(t, t.height+i)
}gr(l, "markerChanged", l, o);});}, Lo.prototype.attachLine=function(t) {
if (!this.lines.length&&this.doc.cm) {
var e=this.doc.cm.curOp; e.maybeHiddenMarkers&&-1!=K(e.maybeHiddenMarkers, this)||(e.maybeUnhiddenMarkers||(e.maybeUnhiddenMarkers=[])).push(this)
} this.lines.push(t);}, Lo.prototype.detachLine=function(t) {
if (this.lines.splice(K(this.lines, t), 1), !this.lines.length&&this.doc.cm) {
var e=this.doc.cm.curOp; (e.maybeHiddenMarkers||(e.maybeHiddenMarkers=[])).push(this)
}
}, Rt(Lo); var No=function(t, e) {
this.markers=t, this.primary=e; for (let r=0; r<t.length; ++r)t[r].parent=this
}; function Do(t) {
return t.findMarks(le(t.first, 0), t.clipPos(le(t.lastLine())), function(t) {
return t.parent;})
} function Io(o) {
for (let t=function(t) {
var e=o[t]; var r=[e.primary.doc]; _i(e.primary.doc, function(t) {
return r.push(t)
}); for (let n=0; n<e.markers.length; n++) {
var i=e.markers[n]; -1==K(r, i.doc)&&(i.parent=null, e.markers.splice(n--, 1))
}
}, e=0; e<o.length; e++)t(e)
}No.prototype.clear=function() {
if (!this.explicitlyCleared) {
this.explicitlyCleared=!0; for (let t=0; t<this.markers.length; ++t) this.markers[t].clear(); gr(this, "clear")
}
}, No.prototype.find=function(t, e) {
return this.primary.find(t, e);}, Rt(No); var Bo=0; var Oo=function(t, e, r, n, i) {
if (!(this instanceof Oo)) return new Oo(t, e, r, n, i); null==r&&(r=0), To.call(this, [new Ao([new tr('', null)])]), this.first=r, this.scrollTop=this.scrollLeft=0, this.cantEdit=!1, this.cleanGeneration=1, this.modeFrontier=this.highlightFrontier=r; var o=le(r, 0); this.sel=Li(o), this.history=new ji(null), this.id=++Bo, this.modeOption=e, this.lineSep=n, this.direction='rtl'==i?'rtl':'ltr', this.extend=!1, "string"==typeof t&&(t=this.splitLines(t)), Pi(this, { from: o, to: o, text: t }), no(this, Li(o), z);}; Oo.prototype=Z(To.prototype, { constructor: Oo, iter: function(t, e, r) {
r?this.iterN(t-this.first, e-t, r):this.iterN(this.first, this.first+this.size, t);}, insert: function(t, e) {
for (var r=0, n=0; n<e.length; ++n)r+=e[n].height; this.insertInner(t-this.first, e, r)
}, remove: function(t, e) {
this.removeInner(t-this.first, e);}, getValue: function(t) {
var e=re(this, this.first, this.first+this.size); return !1===t?e:e.join(t||this.lineSeparator());}, setValue: si(function(t) {
var e=le(this.first, 0); var r=this.first+this.size-1; po(this, { from: e, to: le(r, te(this, r).text.length), text: this.splitLines(t), origin: "setValue", full: !0 }, !0), this.cm&&Pn(this.cm, 0, 0), no(this, Li(e), z)
}), replaceRange: function(t, e, r, n) {
xo(this, t, e=ge(this, e), r=r?ge(this, r):e, n)
}, getRange: function(t, e, r) {
var n=ee(this, ge(this, t), ge(this, e)); return !1===r?n:n.join(r||this.lineSeparator());}, getLine: function(t) {
var e=this.getLineHandle(t); return e&&e.text;}, getLineHandle: function(t) {
if (se(this, t)) return te(this, t);}, getLineNumber: function(t) {
return ie(t);}, getLineHandleVisualStart: function(t) {
return "number"==typeof t&&(t=te(this, t)), Ve(t)
}, lineCount: function() {
return this.size
}, firstLine: function() {
return this.first;}, lastLine: function() {
return this.first+this.size-1
}, clipPos: function(t) {
return ge(this, t)
}, getCursor: function(t) {
var e=this.sel.primary(); return null==t||'head'==t?e.head:'anchor'==t?e.anchor:'end'==t||'to'==t||!1===t?e.to():e.from()
}, listSelections: function() {
return this.sel.ranges
}, somethingSelected: function() {
return this.sel.somethingSelected()
}, setCursor: si(function(t, e, r) {
eo(this, ge(this, "number"==typeof t?le(t, e||0):t), null, r);}), setSelection: si(function(t, e, r) {
eo(this, ge(this, t), ge(this, e||t), r);}), extendSelection: si(function(t, e, r) {
Zi(this, ge(this, t), e&&ge(this, e), r);}), extendSelections: si(function(t, e) {
Qi(this, me(this, t), e)
}), extendSelectionsBy: si(function(t, e) {
Qi(this, me(this, X(this.sel.ranges, t)), e);}), setSelections: si(function(t, e, r) {
if (t.length) {
for (var n=[], i=0; i<t.length; i++)n[i]=new Ri(ge(this, t[i].anchor), ge(this, t[i].head)); null==e&&(e=Math.min(t.length-1, this.sel.primIndex)), no(this, Mi(this.cm, n, e), r);}
}), addSelection: si(function(t, e, r) {
var n=this.sel.ranges.slice(0); n.push(new Ri(ge(this, t), ge(this, e||t))), no(this, Mi(this.cm, n, n.length-1), r)
}), getSelection: function(t) {
for (var e, r=this.sel.ranges, n=0; n<r.length; n++) {
var i=ee(this, r[n].from(), r[n].to()); e=e?e.concat(i):i;} return !1===t?e:e.join(t||this.lineSeparator())
}, getSelections: function(t) {
for (var e=[], r=this.sel.ranges, n=0; n<r.length; n++) {
var i=ee(this, r[n].from(), r[n].to()); !1!==t&&(i=i.join(t||this.lineSeparator())), e[n]=i
} return e;}, replaceSelection: function(t, e, r) {
for (var n=[], i=0; i<this.sel.ranges.length; i++)n[i]=t; this.replaceSelections(n, e, r||'+input')
}, replaceSelections: si(function(t, e, r) {
for (var n=[], i=this.sel, o=0; o<i.ranges.length; o++) {
var s=i.ranges[o]; n[o]={ from: s.from(), to: s.to(), text: this.splitLines(t[o]), origin: r }
} for (var a=e&&'end'!=e&&function(t, e, r) {
for (var n=[], i=le(t.first, 0), o=i, s=0; s<e.length; s++) {
var a=e[s]; var l=Ii(a.from,i,o); var u=Ii(Ei(a), i, o); if (i=a.to, o=u, "around"==r) {
var c=t.sel.ranges[s]; var h=ue(c.head, c.anchor)<0; n[s]=new Ri(h?u:l, h?l:u);} else n[s]=new Ri(l, l)
} return new ki(n, t.sel.primIndex);}(this, n, e), l=n.length-1; 0<=l; l--)po(this, n[l]); a?ro(this, a):this.cm&&Hn(this.cm)
}), undo: si(function() {
mo(this, "undo");}), redo: si(function() {
mo(this, "redo")
}), undoSelection: si(function() {
mo(this, "undo", !0);}), redoSelection: si(function() {
mo(this, "redo", !0);}), setExtending: function(t) {
this.extend=t
}, getExtending: function() {
return this.extend
}, historySize: function() {
for (var t=this.history, e=0, r=0, n=0; n<t.done.length; n++)t.done[n].ranges||++e; for (let i=0; i<t.undone.length; i++)t.undone[i].ranges||++r; return { undo: e, redo: r };}, clearHistory: function() {
this.history=new ji(this.history.maxGeneration)
}, markClean: function() {
this.cleanGeneration=this.changeGeneration(!0);}, changeGeneration: function(t) {
return t&&(this.history.lastOp=this.history.lastSelOp=this.history.lastOrigin=null), this.history.generation
}, isClean: function(t) {
return this.history.generation==(t||this.cleanGeneration)
}, getHistory: function() {
return { done: Xi(this.history.done), undone: Xi(this.history.undone) }
}, setHistory: function(t) {
var e=this.history=new ji(this.history.maxGeneration); e.done=Xi(t.done.slice(0), null, !0), e.undone=Xi(t.undone.slice(0), null, !0);}, setGutterMarker: si(function(t, r, n) {
return Co(this, t, "gutter", function(t) {
var e=t.gutterMarkers||(t.gutterMarkers={}); return !(e[r]=n)&&rt(e)&&(t.gutterMarkers=null), 1
})
}), clearGutter: si(function(e) {
var r=this; this.iter(function(t) {
t.gutterMarkers&&t.gutterMarkers[e]&&Co(r, t, "gutter", function() {
return t.gutterMarkers[e]=null, rt(t.gutterMarkers)&&(t.gutterMarkers=null), 1
});})
}), lineInfo: function(t) {
var e; if ('number'==typeof t) {
if (!se(this, t)) return null; if (!(t=te(this, e=t))) return null
} else if (null==(e=ie(t))) return null; return { line: e, handle: t, text: t.text, gutterMarkers: t.gutterMarkers, textClass: t.textClass, bgClass: t.bgClass, wrapClass: t.wrapClass, widgets: t.widgets }
}, addLineClass: si(function(t, r, n) {
return Co(this, t, "gutter"==r?'gutter':'class', function(t) {
var e='text'==r?'textClass':'background'==r?'bgClass':'gutter'==r?'gutterClass':'wrapClass'; if (t[e]) {
if (A(n).test(t[e])) return; t[e]+=' '+n
} else t[e]=n; return 1;})
}), removeLineClass: si(function(t, o, s) {
return Co(this, t, "gutter"==o?'gutter':'class', function(t) {
var e='text'==o?'textClass':'background'==o?'bgClass':'gutter'==o?'gutterClass':'wrapClass', r=t[e]; if (r) {
if (null==s)t[e]=null; else {
var n=r.match(A(s)); if (!n) return; var i=n.index+n[0].length; t[e]=r.slice(0, n.index)+(n.index&&i!=r.length?' ':'')+r.slice(i)||null;} return 1
}
});}), addLineWidget: si(function(t, e, r) {
return i=t, o=new ko(n=this, e, r), (s=n.cm)&&o.noHScroll&&(s.display.alignWidgets=!0), Co(n, i, "widget", function(t) {
var e=t.widgets||(t.widgets=[]); if (null==o.insertAt?e.push(o):e.splice(Math.min(e.length-1, Math.max(0, o.insertAt)), 0, o), o.line=t, s&&!$e(n, t)) {
var r=Ye(t)<n.scrollTop; ne(t, t.height+Rr(o)), r&&On(s, o.height), s.curOp.forceUpdate=!0
} return 1;}), s&&gr(s, "lineWidgetAdded", s, o, "number"==typeof i?i:ie(i)), o; var n; var i; var o; var s
}), removeLineWidget: function(t) {
t.clear();}, markText: function(t, e, r) {
return Eo(this, ge(this, t), ge(this, e), r, r&&r.type||'range');}, setBookmark: function(t, e) {
var r={ replacedWith: e&&(null==e.nodeType?e.widget:e), insertLeft: e&&e.insertLeft, clearWhenEmpty: !1, shared: e&&e.shared, handleMouseEvents: e&&e.handleMouseEvents }; return Eo(this, t=ge(this, t), t, r, "bookmark");}, findMarksAt: function(t) {
var e=[]; var r=te(this, (t=ge(this, t)).line).markedSpans; if (r) for (let n=0; n<r.length; ++n) {
var i=r[n]; (null==i.from||i.from<=t.ch)&&(null==i.to||i.to>=t.ch)&&e.push(i.marker.parent||i.marker);} return e;}, findMarks: function(i, o, s) {
i=ge(this, i), o=ge(this, o); var a=[]; var l=i.line; return this.iter(i.line, o.line+1, function(t) {
var e=t.markedSpans; if (e) for (let r=0; r<e.length; r++) {
var n=e[r]; null!=n.to&&l==i.line&&i.ch>=n.to||null==n.from&&l!=i.line||null!=n.from&&l==o.line&&n.from>=o.ch||s&&!s(n.marker)||a.push(n.marker.parent||n.marker)
}++l
}), a
}, getAllMarks: function() {
var n=[]; return this.iter(function(t) {
var e=t.markedSpans; if (e) for (let r=0; r<e.length; ++r)null!=e[r].from&&n.push(e[r].marker);}), n;}, posFromIndex: function(r) {
var n; var i=this.first; var o=this.lineSeparator().length; return this.iter(function(t) {
var e=t.text.length+o; if (r<e) return n=r, !0; r-=e, ++i;}), ge(this, le(i, n))
}, indexFromPos: function(t) {
var e=(t=ge(this, t)).ch; if (t.line<this.first||t.ch<0) return 0; var r=this.lineSeparator().length; return this.iter(this.first, t.line, function(t) {
e+=t.text.length+r
}), e
}, copy: function(t) {
var e=new Oo(re(this, this.first, this.first+this.size), this.modeOption, this.first, this.lineSep, this.direction); return e.scrollTop=this.scrollTop, e.scrollLeft=this.scrollLeft, e.sel=this.sel, e.extend=!1, t&&(e.history.undoDepth=this.history.undoDepth, e.setHistory(this.getHistory())), e
}, linkedDoc: function(t) {
t=t||{}; var e=this.first; var r=this.first+this.size; null!=t.from&&t.from>e&&(e=t.from), null!=t.to&&t.to<r&&(r=t.to); var n=new Oo(re(this, e, r), t.mode||this.modeOption, e, this.lineSep, this.direction); return t.sharedHist&&(n.history=this.history), (this.linked||(this.linked=[])).push({ doc: n, sharedHist: t.sharedHist }), n.linked=[{ doc: this, isParent: !0, sharedHist: t.sharedHist }], function(t, e) {
for (let r=0; r<e.length; r++) {
var n=e[r]; var i=n.find(); var o=t.clipPos(i.from); var s=t.clipPos(i.to); if (ue(o, s)) {
var a=Eo(t, o, s, n.primary, n.primary.type); n.markers.push(a), a.parent=n;}
}
}(n, Do(this)), n
}, unlinkDoc: function(t) {
if (t instanceof Ds&&(t=t.doc), this.linked) for (let e=0; e<this.linked.length; ++e) {
if (this.linked[e].doc==t) {
this.linked.splice(e, 1), t.unlinkDoc(this), Io(Do(this)); break
}
} if (t.history==this.history) {
var r=[t.id]; _i(t, function(t) {
return r.push(t.id);}, !0), t.history=new ji(null), t.history.done=Xi(this.history.done, r), t.history.undone=Xi(this.history.undone, r);}
}, iterLinkedDocs: function(t) {
_i(this, t)
}, getMode: function() {
return this.mode;}, getEditor: function() {
return this.cm
}, splitLines: function(t) {
return this.lineSep?t.split(this.lineSep):Kt(t);}, lineSeparator: function() {
return this.lineSep||'\n'}, setDirection: si(function(t) {
var e; "rtl"!=t&&(t='ltr'), t!=this.direction&&(this.direction=t, this.iter(function(t) {
return t.order=null
}), this.cm&&ni(e=this.cm, function() {
Ki(e), mn(e)
}));}) }), Oo.prototype.eachLine=Oo.prototype.iter; var Ho=0; function Po(t) {
var i=this; if (_o(i), !At(i, t)&&!Mr(i.display, t)) {
Mt(t), w&&(Ho=+new Date); var o=pn(i, t, !0); var e=t.dataTransfer.files; if (o&&!i.isReadOnly()) if (e&&e.length&&window.FileReader&&window.File) for (var s=e.length, a=Array(s), l=0, r=function(t, r) {
if (!i.options.allowDropFileTypes||-1!=K(i.options.allowDropFileTypes, t.type)) {
var n=new FileReader; n.onload=ii(i, function() {
var t=n.result; if (/[\x00-\x08\x0e-\x1f]{2}/.test(t)&&(t=''), a[r]=t, ++l==s) {
var e={ from: o=ge(i.doc, o), to: o, text: i.doc.splitLines(a.join(i.doc.lineSeparator())), origin: "paste" }; po(i.doc, e), ro(i.doc, Li(o, Ei(e)))
}
}), n.readAsText(t);}
}, n=0; n<s; ++n)r(e[n], n); else {
if (i.state.draggingText&&-1<i.doc.sel.contains(o)) return i.state.draggingText(t), void setTimeout(function() {
return i.display.input.focus();}, 20); try {
var u=t.dataTransfer.getData('Text'); if (u) {
var c; if (i.state.draggingText&&!i.state.draggingText.copy&&(c=i.listSelections()), io(i.doc, Li(o, o)), c) for (let h=0; h<c.length; ++h)xo(i.doc, "", c[h].anchor, c[h].head, "drag"); i.replaceSelection(u, "around", "paste"), i.display.input.focus();}
} catch (t) {}
}
}
} function _o(t) {
t.display.dragCursor&&(t.display.lineSpace.removeChild(t.display.dragCursor), t.display.dragCursor=null)
} function Uo(e) {
if (document.getElementsByClassName) {
for (var t=document.getElementsByClassName('CodeMirror'), r=[], n=0; n<t.length; n++) {
var i=t[n].CodeMirror; i&&r.push(i);}r.length&&r[0].operation(function() {
for (let t=0; t<r.length; t++)e(r[t])
});}
} var Ko=!1; function jo() {
var t; Ko||(bt(window, "resize", function() {
null==t&&(t=setTimeout(function() {
t=null, Uo(Fo);}, 100))
}), bt(window, "blur", function() {
return Uo(En);}), Ko=!0);} function Fo(t) {
var e=t.display; e.cachedCharWidth=e.cachedTextHeight=e.cachedPaddingH=null, e.scrollbarsClipped=!1, t.setSize()
} for (var zo={ 3: "Pause", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt", 19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert", 46: "Delete", 59: ";", 61: "=", 91: "Mod", 92: "Mod", 93: "Mod", 106: "*", 107: "=", 109: "-", 110: ".", 111: "/", 145: "ScrollLock", 173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'", 63232: "Up", 63233: "Down", 63234: "Left", 63235: "Right", 63272: "Delete", 63273: "Home", 63275: "End", 63276: "PageUp", 63277: "PageDown", 63302: "Insert" }, Wo=0; Wo<10; Wo++)zo[Wo+48]=zo[Wo+96]=String(Wo); for (let Jo=65; Jo<=90; Jo++)zo[Jo]=String.fromCharCode(Jo); for (let Vo=1; Vo<=12; Vo++)zo[Vo+111]=zo[Vo+63235]='F'+Vo; var qo={}; function Go(t) {
var e; var r; var n; var i; var o=t.split(/-(?!$)/); t=o[o.length-1]; for (let s=0; s<o.length-1; s++) {
var a=o[s]; if (/^(cmd|meta|m)$/i.test(a))i=!0; else if (/^a(lt)?$/i.test(a))e=!0; else if (/^(c|ctrl|control)$/i.test(a))r=!0; else {
if (!/^s(hift)?$/i.test(a)) throw new Error('Unrecognized modifier name: '+a); n=!0
}
} return e&&(t='Alt-'+t), r&&(t='Ctrl-'+t), i&&(t='Cmd-'+t), n&&(t='Shift-'+t), t
} function $o(t) {
var e={}; for (let r in t) if (t.hasOwnProperty(r)) {
var n=t[r]; if (/^(name|fallthrough|(de|at)tach)$/.test(r)) continue; if ('...'==n) {
delete t[r]; continue
} for (let i=X(r.split(' '), Go), o=0; o<i.length; o++) {
var s=void 0; var a=void 0; s=o==i.length-1?(a=i.join(' '), n):(a=i.slice(0, o+1).join(' '), "..."); var l=e[a]; if (l) {
if (l!=s) throw new Error('Inconsistent bindings for '+a);} else e[a]=s
} delete t[r]
} for (let u in e)t[u]=e[u]; return t;} function Xo(t, e, r, n) {
var i=(e=ts(e)).call?e.call(t, n):e[t]; if (!1===i) return "nothing"; if ('...'===i) return "multi"; if (null!=i&&r(i)) return "handled"; if (e.fallthrough) {
if ('[object Array]'!=Object.prototype.toString.call(e.fallthrough)) return Xo(t, e.fallthrough, r, n); for (let o=0; o<e.fallthrough.length; o++) {
var s=Xo(t, e.fallthrough[o], r, n); if (s) return s;}
}
} function Yo(t) {
var e='string'==typeof t?t:zo[t.keyCode]; return "Ctrl"==e||'Alt'==e||'Shift'==e||'Mod'==e
} function Zo(t, e, r) {
var n=t; return e.altKey&&'Alt'!=n&&(t='Alt-'+t), (y?e.metaKey:e.ctrlKey)&&'Ctrl'!=n&&(t='Ctrl-'+t), (y?e.ctrlKey:e.metaKey)&&'Cmd'!=n&&(t='Cmd-'+t), !r&&e.shiftKey&&'Shift'!=n&&(t='Shift-'+t), t
} function Qo(t, e) {
if (m&&34==t.keyCode&&t.char) return !1; var r=zo[t.keyCode]; return null!=r&&!t.altGraphKey&&(3==t.keyCode&&t.code&&(r=t.code), Zo(r, t, e));} function ts(t) {
return "string"==typeof t?qo[t]:t
} function es(e, t) {
for (var r=e.doc.sel.ranges, n=[], i=0; i<r.length; i++) {
for (var o=t(r[i]); n.length&&ue(o.from, $(n).to)<=0;) {
var s=n.pop(); if (ue(s.from, o.from)<0) {
o.from=s.from; break;}
}n.push(o)
}ni(e, function() {
for (let t=n.length-1; 0<=t; t--)xo(e.doc, "", n[t].from, n[t].to, "+delete"); Hn(e)
})
} function rs(t, e, r) {
var n=ot(t.text, e+r, r); return n<0||n>t.text.length?null:n;} function ns(t, e, r) {
var n=rs(t, e.ch, r); return null==n?null:new le(e.line, n, r<0?'after':'before');} function is(t, e, r, n, i) {
if (t) {
var o=yt(r, e.doc.direction); if (o) {
var s; var a=i<0?$(o):o[0]; var l=i<0==(1==a.level)?'after':'before'; if (0<a.level||'rtl'==e.doc.direction) {
var u=_r(e, r); s=i<0?r.text.length-1:0; var c=Ur(e, u, s).top; s=st(function(t) {
return Ur(e, u, t).top==c
}, i<0==(1==a.level)?a.from:a.to-1, s), "before"==l&&(s=rs(r, s, 1))
} else s=i<0?a.to:a.from; return new le(n, s, l)
}
} return new le(n, i<0?r.text.length:0, i<0?'before':'after');} function os(e, r, a, t) {
var l=yt(r, e.doc.direction); if (!l) return ns(r, a, t); a.ch>=r.text.length?(a.ch=r.text.length, a.sticky='before'):a.ch<=0&&(a.ch=0, a.sticky='after'); var n=lt(l, a.ch, a.sticky); var i=l[n]; if ('ltr'==e.doc.direction&&i.level%2==0&&(0<t?i.to>a.ch:i.from<a.ch)) return ns(r, a, t); function u(t, e) {
return rs(r, t instanceof le?t.ch:t, e)
} function o(t) {
return e.options.lineWrapping?(s=s||_r(e, r), on(e, r, s, t)):{ begin: 0, end: r.text.length }
} var s; var c=o('before'==a.sticky?u(a, -1):a.ch); if ('rtl'==e.doc.direction||1==i.level) {
var h=1==i.level==t<0; var f=u(a, h?1:-1); if (null!=f&&(h?f<=i.to&&f<=c.end:f>=i.from&&f>=c.begin)) {
var d=h?'before':'after'; return new le(a.line, f, d)
}
} function p(t, e, r) {
for (let n=function(t, e) {
return e?new le(a.line, u(t, 1), "before"):new le(a.line, t, "after")
}; 0<=t&&t<l.length; t+=e) {
var i=l[t]; var o=0<e==(1!=i.level); var s=o?r.begin:u(r.end, -1); if (i.from<=s&&s<i.to) return n(s, o); if (s=o?i.from:u(i.to, -1), r.begin<=s&&s<r.end) return n(s, o);}
} var g=p(n+t, t, c); if (g) return g; var m=0<t?c.end:u(c.begin, -1); return null==m||0<t&&m==r.text.length||!(g=p(0<t?0:l.length-1, t, o(m)))?null:g
}qo.basic={ Left: "goCharLeft", Right: "goCharRight", Up: "goLineUp", Down: "goLineDown", End: "goLineEnd", Home: "goLineStartSmart", PageUp: "goPageUp", PageDown: "goPageDown", Delete: "delCharAfter", Backspace: "delCharBefore", "Shift-Backspace": "delCharBefore", Tab: "defaultTab", "Shift-Tab": "indentAuto", Enter: "newlineAndIndent", Insert: "toggleOverwrite", Esc: "singleSelection" }, qo.pcDefault={ "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo", "Ctrl-Home": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Up": "goLineUp", "Ctrl-Down": "goLineDown", "Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd", "Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "save", "Ctrl-F": "find", "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll", "Ctrl-[": "indentLess", "Ctrl-]": "indentMore", "Ctrl-U": "undoSelection", "Shift-Ctrl-U": "redoSelection", "Alt-U": "redoSelection", fallthrough: "basic" }, qo.emacsy={ "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown", "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd", "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore", "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars", "Ctrl-O": "openLine" }, qo.macDefault={ "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo", "Cmd-Home": "goDocStart", "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft", "Alt-Right": "goGroupRight", "Cmd-Left": "goLineLeft", "Cmd-Right": "goLineRight", "Alt-Backspace": "delGroupBefore", "Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "save", "Cmd-F": "find", "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll", "Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delWrappedLineLeft", "Cmd-Delete": "delWrappedLineRight", "Cmd-U": "undoSelection", "Shift-Cmd-U": "redoSelection", "Ctrl-Up": "goDocStart", "Ctrl-Down": "goDocEnd", fallthrough: ['basic', "emacsy"] }, qo.default=b?qo.macDefault:qo.pcDefault; var ss={ selectAll: ho, singleSelection: function(t) {
return t.setSelection(t.getCursor('anchor'), t.getCursor('head'), z)
}, killLine: function(r) {
return es(r, function(t) {
if (t.empty()) {
var e=te(r.doc, t.head.line).text.length; return t.head.ch==e&&t.head.line<r.lastLine()?{ from: t.head, to: le(t.head.line+1, 0) }:{ from: t.head, to: le(t.head.line, e) };} return { from: t.from(), to: t.to() };});}, deleteLine: function(e) {
return es(e, function(t) {
return { from: le(t.from().line, 0), to: ge(e.doc, le(t.to().line+1, 0)) }
});}, delLineLeft: function(t) {
return es(t, function(t) {
return { from: le(t.from().line, 0), to: t.from() }
});}, delWrappedLineLeft: function(r) {
return es(r, function(t) {
var e=r.charCoords(t.head, "div").top+5; return { from: r.coordsChar({ left: 0, top: e }, "div"), to: t.from() };})
}, delWrappedLineRight: function(n) {
return es(n, function(t) {
var e=n.charCoords(t.head, "div").top+5; var r=n.coordsChar({ left: n.display.lineDiv.offsetWidth+100, top: e }, "div"); return { from: t.from(), to: r };});}, undo: function(t) {
return t.undo();}, redo: function(t) {
return t.redo()
}, undoSelection: function(t) {
return t.undoSelection()
}, redoSelection: function(t) {
return t.redoSelection();}, goDocStart: function(t) {
return t.extendSelection(le(t.firstLine(), 0))
}, goDocEnd: function(t) {
return t.extendSelection(le(t.lastLine()));}, goLineStart: function(e) {
return e.extendSelectionsBy(function(t) {
return as(e, t.head.line)
}, { origin: "+move", bias: 1 });}, goLineStartSmart: function(e) {
return e.extendSelectionsBy(function(t) {
return ls(e, t.head);}, { origin: "+move", bias: 1 })
}, goLineEnd: function(e) {
return e.extendSelectionsBy(function(t) {
return function(t, e) {
var r=te(t.doc, e); var n=function(t) {
for (var e; e=ze(t);)t=e.find(1, !0).line; return t;}(r); n!=r&&(e=ie(n)); return is(!0, t, r, e, -1);}(e, t.head.line);}, { origin: "+move", bias: -1 })
}, goLineRight: function(r) {
return r.extendSelectionsBy(function(t) {
var e=r.cursorCoords(t.head, "div").top+5; return r.coordsChar({ left: r.display.lineDiv.offsetWidth+100, top: e }, "div");}, J)
}, goLineLeft: function(r) {
return r.extendSelectionsBy(function(t) {
var e=r.cursorCoords(t.head, "div").top+5; return r.coordsChar({ left: 0, top: e }, "div");}, J)
}, goLineLeftSmart: function(n) {
return n.extendSelectionsBy(function(t) {
var e=n.cursorCoords(t.head, "div").top+5; var r=n.coordsChar({ left: 0, top: e }, "div"); return r.ch<n.getLine(r.line).search(/\S/)?ls(n, t.head):r;}, J)
}, goLineUp: function(t) {
return t.moveV(-1, "line")
}, goLineDown: function(t) {
return t.moveV(1, "line")
}, goPageUp: function(t) {
return t.moveV(-1, "page")
}, goPageDown: function(t) {
return t.moveV(1, "page");}, goCharLeft: function(t) {
return t.moveH(-1, "char");}, goCharRight: function(t) {
return t.moveH(1, "char");}, goColumnLeft: function(t) {
return t.moveH(-1, "column");}, goColumnRight: function(t) {
return t.moveH(1, "column")
}, goWordLeft: function(t) {
return t.moveH(-1, "word")
}, goGroupRight: function(t) {
return t.moveH(1, "group")
}, goGroupLeft: function(t) {
return t.moveH(-1, "group");}, goWordRight: function(t) {
return t.moveH(1, "word")
}, delCharBefore: function(t) {
return t.deleteH(-1, "char")
}, delCharAfter: function(t) {
return t.deleteH(1, "char");}, delWordBefore: function(t) {
return t.deleteH(-1, "word")
}, delWordAfter: function(t) {
return t.deleteH(1, "word");}, delGroupBefore: function(t) {
return t.deleteH(-1, "group");}, delGroupAfter: function(t) {
return t.deleteH(1, "group")
}, indentAuto: function(t) {
return t.indentSelection('smart')
}, indentMore: function(t) {
return t.indentSelection('add');}, indentLess: function(t) {
return t.indentSelection('subtract');}, insertTab: function(t) {
return t.replaceSelection('\t')
}, insertSoftTab: function(t) {
for (var e=[], r=t.listSelections(), n=t.options.tabSize, i=0; i<r.length; i++) {
var o=r[i].from(); var s=_(t.getLine(o.line), o.ch, n); e.push(G(n-s%n));}t.replaceSelections(e)
}, defaultTab: function(t) {
t.somethingSelected()?t.indentSelection('add'):t.execCommand('insertTab');}, transposeChars: function(s) {
return ni(s, function() {
for (var t=s.listSelections(), e=[], r=0; r<t.length; r++) if (t[r].empty()) {
var n=t[r].head; var i=te(s.doc, n.line).text; if (i) if (n.ch==i.length&&(n=new le(n.line, n.ch-1)), 0<n.ch)n=new le(n.line, n.ch+1), s.replaceRange(i.charAt(n.ch-1)+i.charAt(n.ch-2), le(n.line, n.ch-2), n, "+transpose"); else if (n.line>s.doc.first) {
var o=te(s.doc, n.line-1).text; o&&(n=new le(n.line, 1), s.replaceRange(i.charAt(0)+s.doc.lineSeparator()+o.charAt(o.length-1), le(n.line-1, o.length-1), n, "+transpose"));}e.push(new Ri(n, n))
}s.setSelections(e)
})
}, newlineAndIndent: function(n) {
return ni(n, function() {
for (var t=n.listSelections(), e=t.length-1; 0<=e; e--)n.replaceRange(n.doc.lineSeparator(), t[e].anchor, t[e].head, "+input"); t=n.listSelections(); for (let r=0; r<t.length; r++)n.indentLine(t[r].from().line, null, !0); Hn(n);});}, openLine: function(t) {
return t.replaceSelection('\n', "start");}, toggleOverwrite: function(t) {
return t.toggleOverwrite();} }; function as(t, e) {
var r=te(t.doc, e); var n=Ve(r); return n!=r&&(e=ie(n)), is(!0, t, n, e, 1)
} function ls(t, e) {
var r=as(t, e.line); var n=te(t.doc,r.line); var i=yt(n, t.doc.direction); if (i&&0!=i[0].level) return r; var o=Math.max(0, n.text.search(/\S/)); var s=e.line==r.line&&e.ch<=o&&e.ch; return le(r.line, s?0:o, r.sticky)
} function us(t, e, r) {
if ('string'==typeof e&&!(e=ss[e])) return !1; t.display.input.ensurePolled(); var n=t.display.shift; var i=!1; try {
t.isReadOnly()&&(t.state.suppressEdits=!0), r&&(t.display.shift=!1), i=e(t)!=F
} finally {
t.display.shift=n, t.state.suppressEdits=!1;} return i;} var cs=new U; function hs(t, e, r, n) {
var i=t.state.keySeq; if (i) {
if (Yo(e)) return "handled"; if (/\'$/.test(e)?t.state.keySeq=null:cs.set(50, function() {
t.state.keySeq==i&&(t.state.keySeq=null, t.display.input.reset());}), fs(t, i+' '+e, r, n)) return !0
} return fs(t, e, r, n);} function fs(t, e, r, n) {
var i=function(t, e, r) {
for (let n=0; n<t.state.keyMaps.length; n++) {
var i=Xo(e, t.state.keyMaps[n], r, t); if (i) return i
} return t.options.extraKeys&&Xo(e, t.options.extraKeys, r, t)||Xo(e, t.options.keyMap, r, t);}(t, e, n); return "multi"==i&&(t.state.keySeq=e), "handled"==i&&gr(t, "keyHandled", t, e, r), "handled"!=i&&'multi'!=i||(Mt(r), kn(t)), !!i
} function ds(e, t) {
var r=Qo(t, !0); return !!r&&(t.shiftKey&&!e.state.keySeq?hs(e, "Shift-"+r, t, function(t) {
return us(e, t, !0)
})||hs(e, r, t, function(t) {
if ('string'==typeof t?/^go[A-Z]/.test(t):t.motion) return us(e, t)
}):hs(e, r, t, function(t) {
return us(e, t);}))
} var ps=null; function gs(t) {
if (this.curOp.focus=D(), !At(this, t)) {
w&&S<11&&27==t.keyCode&&(t.returnValue=!1); var e=t.keyCode; this.display.shift=16==e||t.shiftKey; var r; var n=ds(this, t); m&&(ps=n?e:null, !n&&88==e&&!Ft&&(b?t.metaKey:t.ctrlKey)&&this.replaceSelection('', null, "cut")), g&&!b&&!n&&46==e&&t.shiftKey&&!t.ctrlKey&&document.execCommand&&document.execCommand('cut'), 18!=e||/\bCodeMirror-crosshair\b/.test(this.display.lineDiv.className)||(I(r=this.display.lineDiv, "CodeMirror-crosshair"), bt(document, "keyup", i), bt(document, "mouseover", i));} function i(t) {
18!=t.keyCode&&t.altKey||(k(r, "CodeMirror-crosshair"), St(document, "keyup", i), St(document, "mouseover", i))
}
} function ms(t) {
16==t.keyCode&&(this.doc.sel.shift=!1), At(this, t);} function vs(t) {
if (!(Mr(this.display, t)||At(this, t)||t.ctrlKey&&!t.altKey||b&&t.metaKey)) {
var e=t.keyCode; var r=t.charCode; if (m&&e==ps) return ps=null, void Mt(t); if (!m||t.which&&!(t.which<10)||!ds(this, t)) {
var n; var i=String.fromCharCode(null==r?e:r); if ('\b'!=i) if (!hs(n=this, "'"+i+'\'', t, function(t) {
return us(n, t, !0);})) this.display.input.onKeyPress(t)
}
}
} var ys; var xs; var bs=function(t, e, r) {
this.time=t, this.pos=e, this.button=r
}; function ws(t) {
var e=this; var r=e.display; if (!(At(e, t)||r.activeTouch&&r.input.supportsTouch())) if (r.input.ensurePolled(), r.shift=t.shiftKey, Mr(r, t))x||(r.scroller.draggable=!1, setTimeout(function() {
return r.scroller.draggable=!0
}, 100)); else if (!As(e, t)) {
var n; var i; var o; var s=pn(e,t); var a=It(t); var l=s?(n=s, i=a, o=+new Date, xs&&xs.compare(o, n, i)?(ys=xs=null, "triple"):ys&&ys.compare(o, n, i)?(xs=new bs(o, n, i), ys=null, "double"):(ys=new bs(o, n, i), xs=null, "single")):'single'; window.focus(), 1==a&&e.state.selectingText&&e.state.selectingText(t), s&&function(r, t, n, e, i) {
var o='Click'; "double"==e?o='Double'+o:'triple'==e&&(o='Triple'+o); return hs(r, Zo(o=(1==t?'Left':2==t?'Middle':'Right')+o, i), i, function(t) {
if ('string'==typeof t&&(t=ss[t]), !t) return !1; var e=!1; try {
r.isReadOnly()&&(r.state.suppressEdits=!0), e=t(r, n)!=F;} finally {
r.state.suppressEdits=!1;} return e
});}(e, a, s, l, t)||(1==a?s?function(t, e, r, n) {
w?setTimeout(H(Rn, t), 0):t.curOp.focus=D(); var i; var o=function(t,e,r){var n=t.getOption("configureMouse"),i=n?n(t,e,r):{};if(null==i.unit){var o=d?r.shiftKey&&r.metaKey:r.altKey;i.unit=o?"rectangle":"single"==e?"char":"double"==e?"word":"line"}null!=i.extend&&!t.doc.extend||(i.extend=t.doc.extend||r.shiftKey);null==i.addNew&&(i.addNew=b?r.metaKey:r.ctrlKey);null==i.moveOnDrag&&(i.moveOnDrag=!(b?r.altKey:r.ctrlKey));return i}(t,r,n); var s=t.doc.sel; (t.options.dragDrop&&Ht&&!t.isReadOnly()&&'single'==r&&-1<(i=s.contains(e))&&(ue((i=s.ranges[i]).from(), e)<0||0<e.xRel)&&(0<ue(i.to(), e)||e.xRel<0)?function(e, r, n, i) {
var o=e.display; var s=!1; var a=ii(e,function(t){x&&(o.scroller.draggable=!1),e.state.draggingText=!1,St(o.wrapper.ownerDocument,"mouseup",a),St(o.wrapper.ownerDocument,"mousemove",l),St(o.scroller,"dragstart",u),St(o.scroller,"drop",a),s||(Mt(t),i.addNew||Zi(e.doc,n,null,null,i.extend),x||w&&9==S?setTimeout(function(){o.wrapper.ownerDocument.body.focus(),o.input.focus()},20):o.input.focus())}); var l=function(t){s=s||10<=Math.abs(r.clientX-t.clientX)+Math.abs(r.clientY-t.clientY)}; var u=function() {
return s=!0
}; x&&(o.scroller.draggable=!0); (e.state.draggingText=a).copy=!i.moveOnDrag, o.scroller.dragDrop&&o.scroller.dragDrop(); bt(o.wrapper.ownerDocument, "mouseup", a), bt(o.wrapper.ownerDocument, "mousemove", l), bt(o.scroller, "dragstart", u), bt(o.scroller, "drop", a), Mn(e), setTimeout(function() {
return o.input.focus();}, 20);}:function(m, t, v, y) {
var s=m.display; var x=m.doc; Mt(t); var b; var w; var S=x.sel; var e=S.ranges; y.addNew&&!y.extend?(w=x.sel.contains(v), b=-1<w?e[w]:new Ri(v, v)):(b=x.sel.primary(), w=x.sel.primIndex); if ('rectangle'==y.unit)y.addNew||(b=new Ri(v, v)), v=pn(m, t, !0, !0), w=-1; else {
var r=Ss(m, v, y.unit); b=y.extend?Yi(b, r.anchor, r.head, y.extend):r;}y.addNew?-1==w?(w=e.length, no(x, Mi(m, e.concat([b]), w), { scroll: !1, origin: "*mouse" })):1<e.length&&e[w].empty()&&'char'==y.unit&&!y.extend?(no(x, Mi(m, e.slice(0, w).concat(e.slice(w+1)), 0), { scroll: !1, origin: "*mouse" }), S=x.sel):to(x, w, b, W):(no(x, new ki([b], w=0), W), S=x.sel); var C=v; function a(t) {
if (0!=ue(C, t)) if (C=t, "rectangle"==y.unit) {
for (var e=[], r=m.options.tabSize, n=_(te(x, v.line).text, v.ch, r), i=_(te(x, t.line).text, t.ch, r), o=Math.min(n, i), s=Math.max(n, i), a=Math.min(v.line, t.line), l=Math.min(m.lastLine(), Math.max(v.line, t.line)); a<=l; a++) {
var u=te(x, a).text; var c=V(u, o, r); o==s?e.push(new Ri(le(a, c), le(a, c))):u.length>c&&e.push(new Ri(le(a, c), le(a, V(u, s, r))));}e.length||e.push(new Ri(v, v)), no(x, Mi(m, S.ranges.slice(0, w).concat(e), w), { origin: "*mouse", scroll: !1 }), m.scrollIntoView(t);} else {
var h; var f=b; var d=Ss(m,t,y.unit); var p=f.anchor; p=0<ue(d.anchor, p)?(h=d.head, de(f.from(), d.anchor)):(h=d.anchor, fe(f.to(), d.head)); var g=S.ranges.slice(0); g[w]=function(t, e) {
var r=e.anchor; var n=e.head; var i=te(t.doc, r.line); if (0==ue(r, n)&&r.sticky==n.sticky) return e; var o=yt(i); if (!o) return e; var s=lt(o, r.ch, r.sticky); var a=o[s]; if (a.from!=r.ch&&a.to!=r.ch) return e; var l; var u=s+(a.from==r.ch==(1!=a.level)?0:1); if (0==u||u==o.length) return e; if (n.line!=r.line)l=0<(n.line-r.line)*('ltr'==t.doc.direction?1:-1); else {
var c=lt(o, n.ch, n.sticky); var h=c-s||(n.ch-r.ch)*(1==a.level?-1:1); l=c==u-1||c==u?h<0:0<h
} var f=o[u+(l?-1:0)]; var d=l==(1==f.level); var p=d?f.from:f.to; var g=d?'after':'before'; return r.ch==p&&r.sticky==g?e:new Ri(new le(r.line, p, g), n)
}(m, new Ri(ge(x, p), h)), no(x, Mi(m, g, w), W)
}
} var l=s.wrapper.getBoundingClientRect(); var u=0; function n(t) {
m.state.selectingText=!1, u=1/0, t&&(Mt(t), s.input.focus()), St(s.wrapper.ownerDocument, "mousemove", i), St(s.wrapper.ownerDocument, "mouseup", o), x.history.lastSelOrigin=null
} var i=ii(m, function(t) {
(0!==t.buttons&&It(t)?function t(e) {
var r=++u; var n=pn(m, e, !0, "rectangle"==y.unit); if (n) if (0!=ue(n, C)) {
m.curOp.focus=D(), a(n); var i=In(s, x); (n.line>=i.to||n.line<i.from)&&setTimeout(ii(m, function() {
u==r&&t(e)
}), 150)
} else {
var o=e.clientY<l.top?-20:e.clientY>l.bottom?20:0; o&&setTimeout(ii(m, function() {
u==r&&(s.scroller.scrollTop+=o, t(e));}), 50)
}
}:n)(t)
}); var o=ii(m, n); m.state.selectingText=o, bt(s.wrapper.ownerDocument, "mousemove", i), bt(s.wrapper.ownerDocument, "mouseup", o)
})(t, n, e, o)
}(e, s, l, t):Dt(t)==r.scroller&&Mt(t):2==a?(s&&Zi(e.doc, s), setTimeout(function() {
return r.input.focus()
}, 20)):3==a&&(C?e.display.input.onContextMenu(t):Mn(e)))
}
} function Ss(t, e, r) {
if ('char'==r) return new Ri(e, e); if ('word'==r) return t.findWordAt(e); if ('line'==r) return new Ri(le(e.line, 0), ge(t.doc, le(e.line+1, 0))); var n=r(t, e); return new Ri(n.from, n.to)
} function Cs(t, e, r, n) {
var i; var o; if (e.touches)i=e.touches[0].clientX, o=e.touches[0].clientY; else try {
i=e.clientX, o=e.clientY;} catch (e) {
return !1;} if (i>=Math.floor(t.display.gutters.getBoundingClientRect().right)) return !1; n&&Mt(e); var s=t.display; var a=s.lineDiv.getBoundingClientRect(); if (o>a.bottom||!kt(t, r)) return Et(e); o-=a.top-s.viewOffset; for (let l=0; l<t.display.gutterSpecs.length; ++l) {
var u=s.gutters.childNodes[l]; if (u&&u.getBoundingClientRect().right>=i) return Ct(t, r, t, oe(t.doc, o), t.display.gutterSpecs[l].className, e), Et(e)
}
} function As(t, e) {
return Cs(t, e, "gutterClick", !0);} function Ts(t, e) {
var r; var n; Mr(t.display, e)||(n=e, kt(r=t, "gutterContextMenu")&&Cs(r, n, "gutterContextMenu", !1))||At(t, e, "contextmenu")||C||t.display.input.onContextMenu(e);} function ks(t) {
t.display.wrapper.className=t.display.wrapper.className.replace(/\s*cm-s-\S+/g, "")+t.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), Vr(t);}bs.prototype.compare=function(t, e, r) {
return this.time+400>t&&0==ue(e, this.pos)&&r==this.button
}; var Rs={ toString: function() {
return "CodeMirror.Init"
} }; var Ms={}; var Ls={}; function Es(t, e, r) {
if (!e!=!(r&&r!=Rs)) {
var n=t.display.dragFunctions; var i=e?bt:St; i(t.display.scroller, "dragstart", n.start), i(t.display.scroller, "dragenter", n.enter), i(t.display.scroller, "dragover", n.over), i(t.display.scroller, "dragleave", n.leave), i(t.display.scroller, "drop", n.drop)
}
} function Ns(t) {
t.options.lineWrapping?(I(t.display.wrapper, "CodeMirror-wrap"), t.display.sizer.style.minWidth='', t.display.sizerWidth=null):(k(t.display.wrapper, "CodeMirror-wrap"), Qe(t)), dn(t), mn(t), Vr(t), setTimeout(function() {
return Vn(t)
}, 100)
} function Ds(t, e) {
var r=this; if (!(this instanceof Ds)) return new Ds(t, e); this.options=e=e?P(e):{}, P(Ms, e, !1); var n=e.value; "string"==typeof n?n=new Oo(n, e.mode, null, e.lineSeparator, e.direction):e.mode&&(n.modeOption=e.mode), this.doc=n; var i=new Ds.inputStyles[e.inputStyle](this); var o=this.display=new bi(t, n, i, e); for (let s in ks(o.wrapper.CodeMirror=this), e.lineWrapping&&(this.display.wrapper.className+=' CodeMirror-wrap'), $n(this), this.state={ keyMaps: [], overlays: [], modeGen: 0, overwrite: !1, delayingBlurEvent: !1, focused: !1, suppressEdits: !1, pasteIncoming: -1, cutIncoming: -1, selectingText: !1, draggingText: !1, highlight: new U, keySeq: null, specialChars: null }, e.autofocus&&!f&&o.input.focus(), w&&S<11&&setTimeout(function() {
return r.display.input.reset(!0);}, 20), function(i) {
var o=i.display; bt(o.scroller, "mousedown", ii(i, ws)), bt(o.scroller, "dblclick", w&&S<11?ii(i, function(t) {
if (!At(i, t)) {
var e=pn(i, t); if (e&&!As(i, t)&&!Mr(i.display, t)) {
Mt(t); var r=i.findWordAt(e); Zi(i.doc, r.anchor, r.head);}
}
}):function(t) {
return At(i, t)||Mt(t)
}); bt(o.scroller, "contextmenu", function(t) {
return Ts(i, t);}); var r; var n={ end: 0 }; function s() {
o.activeTouch&&(r=setTimeout(function() {
return o.activeTouch=null;}, 1e3), (n=o.activeTouch).end=+new Date)
} function a(t, e) {
if (null==e.left) return 1; var r=e.left-t.left; var n=e.top-t.top; return 400<r*r+n*n;}bt(o.scroller, "touchstart", function(t) {
if (!At(i, t)&&!function(t) {
if (1==t.touches.length) {
var e=t.touches[0]; return e.radiusX<=1&&e.radiusY<=1;}
}(t)&&!As(i, t)) {
o.input.ensurePolled(), clearTimeout(r); var e=+new Date; o.activeTouch={ start: e, moved: !1, prev: e-n.end<=300?n:null }, 1==t.touches.length&&(o.activeTouch.left=t.touches[0].pageX, o.activeTouch.top=t.touches[0].pageY);}
}), bt(o.scroller, "touchmove", function() {
o.activeTouch&&(o.activeTouch.moved=!0);}), bt(o.scroller, "touchend", function(t) {
var e=o.activeTouch; if (e&&!Mr(o, t)&&null!=e.left&&!e.moved&&new Date-e.start<300) {
var r; var n=i.coordsChar(o.activeTouch, "page"); r=!e.prev||a(e, e.prev)?new Ri(n, n):!e.prev.prev||a(e, e.prev.prev)?i.findWordAt(n):new Ri(le(n.line, 0), ge(i.doc, le(n.line+1, 0))), i.setSelection(r.anchor, r.head), i.focus(), Mt(t)
}s()
}), bt(o.scroller, "touchcancel", s), bt(o.scroller, "scroll", function() {
o.scroller.clientHeight&&(Kn(i, o.scroller.scrollTop), Fn(i, o.scroller.scrollLeft, !0), Ct(i, "scroll", i));}), bt(o.scroller, "mousewheel", function(t) {
return Ti(i, t);}), bt(o.scroller, "DOMMouseScroll", function(t) {
return Ti(i, t)
}), bt(o.wrapper, "scroll", function() {
return o.wrapper.scrollTop=o.wrapper.scrollLeft=0;}), o.dragFunctions={ enter: function(t) {
At(i, t)||Nt(t)
}, over: function(t) {
At(i, t)||(function(t, e) {
var r=pn(t, e); if (r) {
var n=document.createDocumentFragment(); Cn(t, r, n), t.display.dragCursor||(t.display.dragCursor=E('div', null, "CodeMirror-cursors CodeMirror-dragcursors"), t.display.lineSpace.insertBefore(t.display.dragCursor, t.display.cursorDiv)), M(t.display.dragCursor, n);}
}(i, t), Nt(t))
}, start: function(t) {
return function(t, e) {
if (w&&(!t.state.draggingText||new Date-Ho<100))Nt(e); else if (!At(t, e)&&!Mr(t.display, e)&&(e.dataTransfer.setData('Text', t.getSelection()), e.dataTransfer.effectAllowed='copyMove', e.dataTransfer.setDragImage&&!l)) {
var r=E('img', null, null, "position: fixed; left: 0; top: 0;"); r.src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', m&&(r.width=r.height=1, t.display.wrapper.appendChild(r), r._top=r.offsetTop), e.dataTransfer.setDragImage(r, 0, 0), m&&r.parentNode.removeChild(r);}
}(i, t);}, drop: ii(i, Po), leave: function(t) {
At(i, t)||_o(i);} }; var t=o.input.getField(); bt(t, "keyup", function(t) {
return ms.call(i, t);}), bt(t, "keydown", ii(i, gs)), bt(t, "keypress", ii(i, vs)), bt(t, "focus", function(t) {
return Ln(i, t)
}), bt(t, "blur", function(t) {
return En(i, t)
});}(this), jo(), Yn(this), this.curOp.forceUpdate=!0, Ui(this, n), e.autofocus&&!f||this.hasFocus()?setTimeout(H(Ln, this), 20):En(this), Ls)Ls.hasOwnProperty(s)&&Ls[s](this, e[s], Rs); mi(this), e.finishInit&&e.finishInit(this); for (let a=0; a<Is.length; ++a)Is[a](this); Zn(this), x&&e.lineWrapping&&'optimizelegibility'==getComputedStyle(o.lineDiv).textRendering&&(o.lineDiv.style.textRendering='auto');}Ds.defaults=Ms, Ds.optionHandlers=Ls; var Is=[]; function Bs(t, e, r, n) {
var i; var o=t.doc; null==r&&(r='add'), "smart"==r&&(o.mode.indent?i=we(t, e).state:r='prev'); var s=t.options.tabSize; var a=te(o,e); var l=_(a.text, null, s); a.stateAfter&&(a.stateAfter=null); var u; var c=a.text.match(/^\s*/)[0]; if (n||/\S/.test(a.text)) {
if ('smart'==r&&((u=o.mode.indent(i, a.text.slice(c.length), a.text))==F||150<u)) {
if (!n) return; r='prev'}
} else u=0, r='not'; "prev"==r?u=e>o.first?_(te(o, e-1).text, null, s):0:'add'==r?u=l+t.options.indentUnit:'subtract'==r?u=l-t.options.indentUnit:'number'==typeof r&&(u=l+r), u=Math.max(0, u); var h='', f=0; if (t.options.indentWithTabs) for (let d=Math.floor(u/s); d; --d)f+=s, h+='\t'; if (f<u&&(h+=G(u-f)), h!=c) return xo(o, h, le(e, 0), le(e, c.length), "+input"), !(a.stateAfter=null); for (let p=0; p<o.sel.ranges.length; p++) {
var g=o.sel.ranges[p]; if (g.head.line==e&&g.head.ch<c.length) {
var m=le(e, c.length); to(o, p, new Ri(m, m)); break;}
}
}Ds.defineInitHook=function(t) {
return Is.push(t)
}; var Os=null; function Hs(t) {
Os=t;} function Ps(t, e, r, n, i) {
var o=t.doc; t.display.shift=!1, n=n||o.sel; var s=new Date-200; var a="paste"==i||t.state.pasteIncoming>s; var l=Kt(e); var u=null; if (a&&1<n.ranges.length) if (Os&&Os.text.join('\n')==e) {
if (n.ranges.length%Os.text.length==0) {
u=[]; for (let c=0; c<Os.text.length; c++)u.push(o.splitLines(Os.text[c]));}
} else l.length==n.ranges.length&&t.options.pasteLinesPerSelection&&(u=X(l, function(t) {
return [t];})); for (var h=t.curOp.updateInput, f=n.ranges.length-1; 0<=f; f--) {
var d=n.ranges[f]; var p=d.from(); var g=d.to(); d.empty()&&(r&&0<r?p=le(p.line, p.ch-r):t.state.overwrite&&!a?g=le(g.line, Math.min(te(o, g.line).text.length, g.ch+$(l).length)):a&&Os&&Os.lineWise&&Os.text.join('\n')==e&&(p=g=le(p.line, 0))); var m={ from: p, to: g, text: u?u[f%u.length]:l, origin: i||(a?'paste':t.state.cutIncoming>s?'cut':'+input') }; po(t.doc, m), gr(t, "inputRead", t, m)
}e&&!a&&Us(t, e), Hn(t), t.curOp.updateInput<2&&(t.curOp.updateInput=h), t.curOp.typing=!0, t.state.pasteIncoming=t.state.cutIncoming=-1;} function _s(t, e) {
var r=t.clipboardData&&t.clipboardData.getData('Text'); return r&&(t.preventDefault(), e.isReadOnly()||e.options.disableInput||ni(e, function() {
return Ps(e, r, 0, null, "paste");}), 1);} function Us(t, e) {
if (t.options.electricChars&&t.options.smartIndent) for (let r=t.doc.sel, n=r.ranges.length-1; 0<=n; n--) {
var i=r.ranges[n]; if (!(100<i.head.ch||n&&r.ranges[n-1].head.line==i.head.line)) {
var o=t.getModeAt(i.head); var s=!1; if (o.electricChars) {
for (let a=0; a<o.electricChars.length; a++) if (-1<e.indexOf(o.electricChars.charAt(a))) {
s=Bs(t, i.head.line, "smart"); break
}
} else o.electricInput&&o.electricInput.test(te(t.doc, i.head.line).text.slice(0, i.head.ch))&&(s=Bs(t, i.head.line, "smart")); s&&gr(t, "electricInput", t, i.head.line);}
}
} function Ks(t) {
for (var e=[], r=[], n=0; n<t.doc.sel.ranges.length; n++) {
var i=t.doc.sel.ranges[n].head.line; var o={ anchor: le(i, 0), head: le(i+1, 0) }; r.push(o), e.push(t.getRange(o.anchor, o.head))
} return { text: e, ranges: r }
} function js(t, e, r, n) {
t.setAttribute('autocorrect', r?'':'off'), t.setAttribute('autocapitalize', n?'':'off'), t.setAttribute('spellcheck', !!e)
} function Fs() {
var t=E('textarea', null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none"); var e=E('div', [t], null, "overflow: hidden; position: relative; width: 3px; height: 0px;"); return x?t.style.width='1000px':t.setAttribute('wrap', "off"), c&&(t.style.border='1px solid black'), js(t), e
} function zs(n, i, o, t, s) {
var e=i; var r=o; var a=te(n, i.line); function l(t) {
var e; var r; if (null==(e=s?os(n.cm, a, i, o):ns(a, i, o))) {
if (t||(r=i.line+o)<n.first||r>=n.first+n.size||(i=new le(r, i.ch, i.sticky), !(a=te(n, r)))) return; i=is(s, n.cm, a, i.line, o)
} else i=e; return 1;} if ('char'==t)l(); else if ('column'==t)l(!0); else if ('word'==t||'group'==t) for (let u=null, c='group'==t, h=n.cm&&n.cm.getHelper(i, "wordChars"), f=!0; !(o<0)||l(!f); f=!1) {
var d=a.text.charAt(i.ch)||'\n', p=et(d, h)?'w':c&&'\n'==d?'n':!c||/\s/.test(d)?null:'p'; if (!c||f||p||(p='s'), u&&u!=p) {
o<0&&(o=1, l(), i.sticky='after'); break;} if (p&&(u=p), 0<o&&!l(!f)) break
} var g=uo(n, i, e, r, !0); return ce(e, g)&&(g.hitSide=!0), g;} function Ws(t, e, r, n) {
var i; var o; var s=t.doc; var a=e.left; if ('page'==n) {
var l=Math.min(t.display.wrapper.clientHeight, window.innerHeight||document.documentElement.clientHeight); var u=Math.max(l-.5*ln(t.display), 3); i=(0<r?e.bottom:e.top)+r*u;} else "line"==n&&(i=0<r?e.bottom+3:e.top-3); for (;(o=rn(t, a, i)).outside;) {
if (r<0?i<=0:i>=s.height) {
o.hitSide=!0; break
}i+=5*r
} return o;} function Js(t) {
this.cm=t, this.lastAnchorNode=this.lastAnchorOffset=this.lastFocusNode=this.lastFocusOffset=null, this.polling=new U, this.composing=null, this.gracePeriod=!1, this.readDOMTimeout=null
} function Vs(t, e) {
var r=Pr(t, e.line); if (!r||r.hidden) return null; var n=te(t.doc, e.line); var i=Or(r,n,e.line); var o=yt(n,t.doc.direction); var s='left'; o&&(s=lt(o, e.ch)%2?'right':'left'); var a=Fr(i.map, e.ch, s); return a.offset='right'==a.collapse?a.end:a.start, a
} function qs(t, e) {
return e&&(t.bad=!0), t
} function Gs(t, e, r) {
var n; if (e==t.display.lineDiv) {
if (!(n=t.display.lineDiv.childNodes[r])) return qs(t.clipPos(le(t.display.viewTo-1)), !0); e=null, r=0
} else for (n=e; ;n=n.parentNode) {
if (!n||n==t.display.lineDiv) return null; if (n.parentNode&&n.parentNode==t.display.lineDiv) break
} for (let i=0; i<t.display.view.length; i++) {
var o=t.display.view[i]; if (o.node==n) return $s(o, e, r)
}
} function $s(u, t, e) {
var r=u.text.firstChild; var n=!1; if (!t||!N(r, t)) return qs(le(ie(u.line), 0), !0); if (t==r&&(n=!0, t=r.childNodes[e], e=0, !t)) {
var i=u.rest?$(u.rest):u.line; return qs(le(ie(i), i.text.length), n);} var o=3==t.nodeType?t:null; var s=t; for (o||1!=t.childNodes.length||3!=t.firstChild.nodeType||(o=t.firstChild, e=e&&o.nodeValue.length); s.parentNode!=r;)s=s.parentNode; var c=u.measure; var h=c.maps; function a(t, e, r) {
for (let n=-1; n<(h?h.length:0); n++) for (let i=n<0?c.map:h[n], o=0; o<i.length; o+=3) {
var s=i[o+2]; if (s==t||s==e) {
var a=ie(n<0?u.line:u.rest[n]); var l=i[o]+r; return (r<0||s!=t)&&(l=i[o+(r?1:0)]), le(a, l)
}
}
} var l=a(o, s, e); if (l) return qs(l, n); for (let f=s.nextSibling, d=o?o.nodeValue.length-e:0; f; f=f.nextSibling) {
if (l=a(f, f.firstChild, 0)) return qs(le(l.line, l.ch-d), n); d+=f.textContent.length
} for (let p=s.previousSibling, g=e; p; p=p.previousSibling) {
if (l=a(p, p.firstChild, -1)) return qs(le(l.line, l.ch+g), n); g+=p.textContent.length
}
}Js.prototype.init=function(t) {
var e=this; var s=this; var a=s.cm; var l=s.div=t.lineDiv; function r(t) {
if (!At(a, t)) {
if (a.somethingSelected())Hs({ lineWise: !1, text: a.getSelections() }), "cut"==t.type&&a.replaceSelection('', null, "cut"); else {
if (!a.options.lineWiseCopyCut) return; var e=Ks(a); Hs({ lineWise: !0, text: e.text }), "cut"==t.type&&a.operation(function() {
a.setSelections(e.ranges, 0, z), a.replaceSelection('', null, "cut")
})
} if (t.clipboardData) {
t.clipboardData.clearData(); var r=Os.text.join('\n'); if (t.clipboardData.setData('Text', r), t.clipboardData.getData('Text')==r) return void t.preventDefault()
} var n=Fs(); var i=n.firstChild; a.display.lineSpace.insertBefore(n, a.display.lineSpace.firstChild), i.value=Os.text.join('\n'); var o=document.activeElement; O(i), setTimeout(function() {
a.display.lineSpace.removeChild(n), o.focus(), o==l&&s.showPrimarySelection()
}, 50);}
}js(l, a.options.spellcheck, a.options.autocorrect, a.options.autocapitalize), bt(l, "paste", function(t) {
At(a, t)||_s(t, a)||S<=11&&setTimeout(ii(a, function() {
return e.updateFromDOM()
}), 20);}), bt(l, "compositionstart", function(t) {
e.composing={ data: t.data, done: !1 };}), bt(l, "compositionupdate", function(t) {
e.composing||(e.composing={ data: t.data, done: !1 });}), bt(l, "compositionend", function(t) {
e.composing&&(t.data!=e.composing.data&&e.readFromDOMSoon(), e.composing.done=!0);}), bt(l, "touchstart", function() {
return s.forceCompositionEnd()
}), bt(l, "input", function() {
e.composing||e.readFromDOMSoon()
}), bt(l, "copy", r), bt(l, "cut", r);}, Js.prototype.prepareSelection=function() {
var t=Sn(this.cm, !1); return t.focus=this.cm.state.focused, t
}, Js.prototype.showSelection=function(t, e) {
t&&this.cm.display.view.length&&((t.focus||e)&&this.showPrimarySelection(), this.showMultipleSelections(t));}, Js.prototype.getSelection=function() {
return this.cm.display.wrapper.ownerDocument.getSelection()
}, Js.prototype.showPrimarySelection=function() {
var t=this.getSelection(); var e=this.cm; var r=e.doc.sel.primary(); var n=r.from(); var i=r.to(); if (e.display.viewTo==e.display.viewFrom||n.line>=e.display.viewTo||i.line<e.display.viewFrom)t.removeAllRanges(); else {
var o=Gs(e, t.anchorNode, t.anchorOffset); var s=Gs(e, t.focusNode, t.focusOffset); if (!o||o.bad||!s||s.bad||0!=ue(de(o, s), n)||0!=ue(fe(o, s), i)) {
var a=e.display.view; var l=n.line>=e.display.viewFrom&&Vs(e,n)||{node:a[0].measure.map[2],offset:0}; var u=i.line<e.display.viewTo&&Vs(e, i); if (!u) {
var c=a[a.length-1].measure; var h=c.maps?c.maps[c.maps.length-1]:c.map; u={ node: h[h.length-1], offset: h[h.length-2]-h[h.length-3] };} if (l&&u) {
var f; var d=t.rangeCount&&t.getRangeAt(0); try {
f=T(l.node, l.offset, u.offset, u.node);} catch (t) {}f&&(!g&&e.state.focused?(t.collapse(l.node, l.offset), f.collapsed||(t.removeAllRanges(), t.addRange(f))):(t.removeAllRanges(), t.addRange(f)), d&&null==t.anchorNode?t.addRange(d):g&&this.startGracePeriod()), this.rememberSelection()
} else t.removeAllRanges()
}
}
}, Js.prototype.startGracePeriod=function() {
var t=this; clearTimeout(this.gracePeriod), this.gracePeriod=setTimeout(function() {
t.gracePeriod=!1, t.selectionChanged()&&t.cm.operation(function() {
return t.cm.curOp.selectionChanged=!0;});}, 20);}, Js.prototype.showMultipleSelections=function(t) {
M(this.cm.display.cursorDiv, t.cursors), M(this.cm.display.selectionDiv, t.selection)
}, Js.prototype.rememberSelection=function() {
var t=this.getSelection(); this.lastAnchorNode=t.anchorNode, this.lastAnchorOffset=t.anchorOffset, this.lastFocusNode=t.focusNode, this.lastFocusOffset=t.focusOffset
}, Js.prototype.selectionInEditor=function() {
var t=this.getSelection(); if (!t.rangeCount) return !1; var e=t.getRangeAt(0).commonAncestorContainer; return N(this.div, e)
}, Js.prototype.focus=function() {
"nocursor"!=this.cm.options.readOnly&&(this.selectionInEditor()||this.showSelection(this.prepareSelection(), !0), this.div.focus());}, Js.prototype.blur=function() {
this.div.blur();}, Js.prototype.getField=function() {
return this.div
}, Js.prototype.supportsTouch=function() {
return !0;}, Js.prototype.receivedFocus=function() {
var e=this; this.selectionInEditor()?this.pollSelection():ni(this.cm, function() {
return e.cm.curOp.selectionChanged=!0;}), this.polling.set(this.cm.options.pollInterval, function t() {
e.cm.state.focused&&(e.pollSelection(), e.polling.set(e.cm.options.pollInterval, t));});}, Js.prototype.selectionChanged=function() {
var t=this.getSelection(); return t.anchorNode!=this.lastAnchorNode||t.anchorOffset!=this.lastAnchorOffset||t.focusNode!=this.lastFocusNode||t.focusOffset!=this.lastFocusOffset;}, Js.prototype.pollSelection=function() {
if (null==this.readDOMTimeout&&!this.gracePeriod&&this.selectionChanged()) {
var t=this.getSelection(); var e=this.cm; if (h&&s&&this.cm.display.gutterSpecs.length&&function(t) {
for (let e=t; e; e=e.parentNode) if (/CodeMirror-gutter-wrapper/.test(e.className)) return 1; return
}(t.anchorNode)) return this.cm.triggerOnKeyDown({ type: "keydown", keyCode: 8, preventDefault: Math.abs }), this.blur(), void this.focus(); if (!this.composing) {
this.rememberSelection(); var r=Gs(e, t.anchorNode, t.anchorOffset); var n=Gs(e, t.focusNode, t.focusOffset); r&&n&&ni(e, function() {
no(e.doc, Li(r, n), z), (r.bad||n.bad)&&(e.curOp.selectionChanged=!0)
});}
}
}, Js.prototype.pollContent=function() {
null!=this.readDOMTimeout&&(clearTimeout(this.readDOMTimeout), this.readDOMTimeout=null); var t; var e; var r; var n=this.cm; var i=n.display; var o=n.doc.sel.primary(); var s=o.from(); var a=o.to(); if (0==s.ch&&s.line>n.firstLine()&&(s=le(s.line-1, te(n.doc, s.line-1).length)), a.ch==te(n.doc, a.line).text.length&&a.line<n.lastLine()&&(a=le(a.line+1, 0)), s.line<i.viewFrom||a.line>i.viewTo-1) return !1; r=s.line==i.viewFrom||0==(t=gn(n, s.line))?(e=ie(i.view[0].line), i.view[0].node):(e=ie(i.view[t].line), i.view[t-1].node.nextSibling); var l; var u; var c=gn(n, a.line); if (u=c==i.view.length-1?(l=i.viewTo-1, i.lineDiv.lastChild):(l=ie(i.view[c+1].line)-1, i.view[c+1].node.previousSibling), !r) return !1; for (var h=n.doc.splitLines(function(l, t, e, u, c) {
var r='', h=!1, f=l.doc.lineSeparator(), d=!1; function p() {
h&&(r+=f, d&&(r+=f), h=d=!1)
} function g(t) {
t&&(p(), r+=t);} function m(t) {
if (1==t.nodeType) {
var e=t.getAttribute('cm-text'); if (e) return void g(e); var r; var n=t.getAttribute('cm-marker'); if (n) {
var i=l.findMarks(le(u, 0), le(c+1, 0), (a=+n, function(t) {
return t.id==a
})); return void(i.length&&(r=i[0].find(0))&&g(ee(l.doc, r.from, r.to).join(f)))
} if ('false'==t.getAttribute('contenteditable')) return; var o=/^(pre|div|p|li|table|br)$/i.test(t.nodeName); if (!/^br$/i.test(t.nodeName)&&0==t.textContent.length) return; o&&p(); for (let s=0; s<t.childNodes.length; s++)m(t.childNodes[s]); /^(pre|p)$/i.test(t.nodeName)&&(d=!0), o&&(h=!0)
} else 3==t.nodeType&&g(t.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " ")); var a;} for (;m(t), t!=e;)t=t.nextSibling, d=!1; return r;}(n, r, u, e, l)), f=ee(n.doc, le(e, 0), le(l, te(n.doc, l).text.length)); 1<h.length&&1<f.length;) if ($(h)==$(f))h.pop(), f.pop(), l--; else {
if (h[0]!=f[0]) break; h.shift(), f.shift(), e++;} for (var d=0, p=0, g=h[0], m=f[0], v=Math.min(g.length, m.length); d<v&&g.charCodeAt(d)==m.charCodeAt(d);)++d; for (var y=$(h), x=$(f), b=Math.min(y.length-(1==h.length?d:0), x.length-(1==f.length?d:0)); p<b&&y.charCodeAt(y.length-p-1)==x.charCodeAt(x.length-p-1);)++p; if (1==h.length&&1==f.length&&e==s.line) for (;d&&d>s.ch&&y.charCodeAt(y.length-p-1)==x.charCodeAt(x.length-p-1);)d--, p++; h[h.length-1]=y.slice(0, y.length-p).replace(/^\u200b+/, ""), h[0]=h[0].slice(d).replace(/\u200b+$/, ""); var w=le(e, d); var S=le(l, f.length?$(f).length-p:0); return 1<h.length||h[0]||ue(w, S)?(xo(n.doc, h, w, S, "+input"), !0):void 0;}, Js.prototype.ensurePolled=function() {
this.forceCompositionEnd()
}, Js.prototype.reset=function() {
this.forceCompositionEnd();}, Js.prototype.forceCompositionEnd=function() {
this.composing&&(clearTimeout(this.readDOMTimeout), this.composing=null, this.updateFromDOM(), this.div.blur(), this.div.focus());}, Js.prototype.readFromDOMSoon=function() {
var t=this; null==this.readDOMTimeout&&(this.readDOMTimeout=setTimeout(function() {
if (t.readDOMTimeout=null, t.composing) {
if (!t.composing.done) return; t.composing=null
}t.updateFromDOM();}, 80));}, Js.prototype.updateFromDOM=function() {
var t=this; !this.cm.isReadOnly()&&this.pollContent()||ni(this.cm, function() {
return mn(t.cm)
})
}, Js.prototype.setUneditable=function(t) {
t.contentEditable='false'}, Js.prototype.onKeyPress=function(t) {
0==t.charCode||this.composing||(t.preventDefault(), this.cm.isReadOnly()||ii(this.cm, Ps)(this.cm, String.fromCharCode(null==t.charCode?t.keyCode:t.charCode), 0));}, Js.prototype.readOnlyChanged=function(t) {
this.div.contentEditable=String('nocursor'!=t);}, Js.prototype.onContextMenu=function() {}, Js.prototype.resetPosition=function() {}, Js.prototype.needsContentAttribute=!0; function Xs(t) {
this.cm=t, this.prevInput='', this.pollingFast=!1, this.polling=new U, this.hasSelection=!1, this.composing=null;} var Ys; var Zs; var Qs; var ta; var ea; function ra(t, e, n, r) {
Ys.defaults[t]=e, n&&(Zs[t]=r?function(t, e, r) {
r!=Rs&&n(t, e, r);}:n);}Xs.prototype.init=function(r) {
var t=this; var n=this; var i=this.cm; this.createField(r); var o=this.textarea; function e(t) {
if (!At(i, t)) {
if (i.somethingSelected())Hs({ lineWise: !1, text: i.getSelections() }); else {
if (!i.options.lineWiseCopyCut) return; var e=Ks(i); Hs({ lineWise: !0, text: e.text }), "cut"==t.type?i.setSelections(e.ranges, null, z):(n.prevInput='', o.value=e.text.join('\n'), O(o))
}'cut'==t.type&&(i.state.cutIncoming=+new Date);}
}r.wrapper.insertBefore(this.wrapper, r.wrapper.firstChild), c&&(o.style.width='0px'), bt(o, "input", function() {
w&&9<=S&&t.hasSelection&&(t.hasSelection=null), n.poll();}), bt(o, "paste", function(t) {
At(i, t)||_s(t, i)||(i.state.pasteIncoming=+new Date, n.fastPoll());}), bt(o, "cut", e), bt(o, "copy", e), bt(r.scroller, "paste", function(t) {
if (!Mr(r, t)&&!At(i, t)) {
if (!o.dispatchEvent) return i.state.pasteIncoming=+new Date, void n.focus(); var e=new Event('paste'); e.clipboardData=t.clipboardData, o.dispatchEvent(e);}
}), bt(r.lineSpace, "selectstart", function(t) {
Mr(r, t)||Mt(t)
}), bt(o, "compositionstart", function() {
var t=i.getCursor('from'); n.composing&&n.composing.range.clear(), n.composing={ start: t, range: i.markText(t, i.getCursor('to'), { className: "CodeMirror-composing" }) }
}), bt(o, "compositionend", function() {
n.composing&&(n.poll(), n.composing.range.clear(), n.composing=null);})
}, Xs.prototype.createField=function(t) {
this.wrapper=Fs(), this.textarea=this.wrapper.firstChild
}, Xs.prototype.prepareSelection=function() {
var t=this.cm; var e=t.display; var r=t.doc; var n=Sn(t); if (t.options.moveInputWithCursor) {
var i=Qr(t, r.sel.primary().head, "div"); var o=e.wrapper.getBoundingClientRect(); var s=e.lineDiv.getBoundingClientRect(); n.teTop=Math.max(0, Math.min(e.wrapper.clientHeight-10, i.top+s.top-o.top)), n.teLeft=Math.max(0, Math.min(e.wrapper.clientWidth-10, i.left+s.left-o.left))
} return n;}, Xs.prototype.showSelection=function(t) {
var e=this.cm.display; M(e.cursorDiv, t.cursors), M(e.selectionDiv, t.selection), null!=t.teTop&&(this.wrapper.style.top=t.teTop+'px', this.wrapper.style.left=t.teLeft+'px')
}, Xs.prototype.reset=function(t) {
if (!this.contextMenuPending&&!this.composing) {
var e=this.cm; if (e.somethingSelected()) {
this.prevInput=''; var r=e.getSelection(); this.textarea.value=r, e.state.focused&&O(this.textarea), w&&9<=S&&(this.hasSelection=r)
} else t||(this.prevInput=this.textarea.value='', w&&9<=S&&(this.hasSelection=null));}
}, Xs.prototype.getField=function() {
return this.textarea
}, Xs.prototype.supportsTouch=function() {
return !1
}, Xs.prototype.focus=function() {
if ('nocursor'!=this.cm.options.readOnly&&(!f||D()!=this.textarea)) try {
this.textarea.focus()
} catch (t) {}
}, Xs.prototype.blur=function() {
this.textarea.blur()
}, Xs.prototype.resetPosition=function() {
this.wrapper.style.top=this.wrapper.style.left=0;}, Xs.prototype.receivedFocus=function() {
this.slowPoll()
}, Xs.prototype.slowPoll=function() {
var t=this; this.pollingFast||this.polling.set(this.cm.options.pollInterval, function() {
t.poll(), t.cm.state.focused&&t.slowPoll()
})
}, Xs.prototype.fastPoll=function() {
var e=!1; var r=this; r.pollingFast=!0, r.polling.set(20, function t() {
r.poll()||e?(r.pollingFast=!1, r.slowPoll()):(e=!0, r.polling.set(60, t));});}, Xs.prototype.poll=function() {
var t=this; var e=this.cm; var r=this.textarea; var n=this.prevInput; if (this.contextMenuPending||!e.state.focused||jt(r)&&!n&&!this.composing||e.isReadOnly()||e.options.disableInput||e.state.keySeq) return !1; var i=r.value; if (i==n&&!e.somethingSelected()) return !1; if (w&&9<=S&&this.hasSelection===i||b&&/[\uf700-\uf7ff]/.test(i)) return e.display.input.reset(), !1; if (e.doc.sel==e.display.selForContextMenu) {
var o=i.charCodeAt(0); if (8203!=o||n||(n='​'), 8666==o) return this.reset(), this.cm.execCommand('undo');} for (var s=0, a=Math.min(n.length, i.length); s<a&&n.charCodeAt(s)==i.charCodeAt(s);)++s; return ni(e, function() {
Ps(e, i.slice(s), n.length-s, null, t.composing?'*compose':null), 1e3<i.length||-1<i.indexOf('\n')?r.value=t.prevInput='':t.prevInput=i, t.composing&&(t.composing.range.clear(), t.composing.range=e.markText(t.composing.start, e.getCursor('to'), { className: "CodeMirror-composing" }))
}), !0;}, Xs.prototype.ensurePolled=function() {
this.pollingFast&&this.poll()&&(this.pollingFast=!1);}, Xs.prototype.onKeyPress=function() {
w&&9<=S&&(this.hasSelection=null), this.fastPoll();}, Xs.prototype.onContextMenu=function(t) {
var r=this; var n=r.cm; var i=n.display; var o=r.textarea; r.contextMenuPending&&r.contextMenuPending(); var e=pn(n, t); var s=i.scroller.scrollTop; if (e&&!m) {
n.options.resetSelectionOnContextMenu&&-1==n.doc.sel.contains(e)&&ii(n, no)(n.doc, Li(e), z); var a; var l=o.style.cssText; var u=r.wrapper.style.cssText; var c=r.wrapper.offsetParent.getBoundingClientRect(); if (r.wrapper.style.cssText='position: static', o.style.cssText='position: absolute; width: 30px; height: 30px;\n      top: '+(t.clientY-c.top-5)+'px; left: '+(t.clientX-c.left-5)+'px;\n      z-index: 1000; background: '+(w?'rgba(255, 255, 255, .05)':'transparent')+';\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);', x&&(a=window.scrollY), i.input.focus(), x&&window.scrollTo(null, a), i.input.reset(), n.somethingSelected()||(o.value=r.prevInput=' '), r.contextMenuPending=d, i.selForContextMenu=n.doc.sel, clearTimeout(i.detectingSelectAll), w&&9<=S&&f(), C) {
Nt(t); var h=function() {
St(window, "mouseup", h), setTimeout(d, 20)
}; bt(window, "mouseup", h)
} else setTimeout(d, 50);} function f() {
if (null!=o.selectionStart) {
var t=n.somethingSelected(); var e='​'+(t?o.value:''); o.value='⇚', o.value=e, r.prevInput=t?'':'​', o.selectionStart=1, o.selectionEnd=e.length, i.selForContextMenu=n.doc.sel
}
} function d() {
if (r.contextMenuPending==d&&(r.contextMenuPending=!1, r.wrapper.style.cssText=u, o.style.cssText=l, w&&S<9&&i.scrollbars.setScrollTop(i.scroller.scrollTop=s), null!=o.selectionStart)) {
(!w||w&&S<9)&&f(); var t=0; var e=function() {
i.selForContextMenu==n.doc.sel&&0==o.selectionStart&&0<o.selectionEnd&&'​'==r.prevInput?ii(n, ho)(n):t++<10?i.detectingSelectAll=setTimeout(e, 500):(i.selForContextMenu=null, i.input.reset());}; i.detectingSelectAll=setTimeout(e, 200);}
}
}, Xs.prototype.readOnlyChanged=function(t) {
t||this.reset(), this.textarea.disabled='nocursor'==t;}, Xs.prototype.setUneditable=function() {}, Xs.prototype.needsContentAttribute=!1, Zs=(Ys=Ds).optionHandlers, Ys.defineOption=ra, Ys.Init=Rs, ra('value', "", function(t, e) {
return t.setValue(e)
}, !0), ra('mode', null, function(t, e) {
t.doc.modeOption=e, Bi(t)
}, !0), ra('indentUnit', 2, Bi, !0), ra('indentWithTabs', !1), ra('smartIndent', !0), ra('tabSize', 4, function(t) {
Oi(t), Vr(t), mn(t);}, !0), ra('lineSeparator', null, function(t, n) {
if (t.doc.lineSep=n) {
var i=[]; var o=t.doc.first; t.doc.iter(function(t) {
for (let e=0; ;) {
var r=t.text.indexOf(n, e); if (-1==r) break; e=r+n.length, i.push(le(o, r))
}o++
}); for (let e=i.length-1; 0<=e; e--)xo(t.doc, n, i[e], le(i[e].line, i[e].ch+n.length));}
}), ra('specialChars', /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g, function(t, e, r) {
t.state.specialChars=new RegExp(e.source+(e.test('\t')?'':'|\t'), "g"), r!=Rs&&t.refresh();}), ra('specialCharPlaceholder', or, function(t) {
return t.refresh();}, !0), ra('electricChars', !0), ra('inputStyle', f?'contenteditable':'textarea', function() {
throw new Error('inputStyle can not (yet) be changed in a running editor')
}, !0), ra('spellcheck', !1, function(t, e) {
return t.getInputField().spellcheck=e;}, !0), ra('autocorrect', !1, function(t, e) {
return t.getInputField().autocorrect=e
}, !0), ra('autocapitalize', !1, function(t, e) {
return t.getInputField().autocapitalize=e;}, !0), ra('rtlMoveVisually', !p), ra('wholeLineUpdateBefore', !0), ra('theme', "default", function(t) {
ks(t), xi(t);}, !0), ra('keyMap', "default", function(t, e, r) {
var n=ts(e); var i=r!=Rs&&ts(r); i&&i.detach&&i.detach(t, n), n.attach&&n.attach(t, i||null);}), ra('extraKeys', null), ra('configureMouse', null), ra('lineWrapping', !1, Ns, !0), ra('gutters', [], function(t, e) {
t.display.gutterSpecs=vi(e, t.options.lineNumbers), xi(t);}, !0), ra('fixedGutter', !0, function(t, e) {
t.display.gutters.style.left=e?hn(t.display)+'px':'0', t.refresh()
}, !0), ra('coverGutterNextToScrollbar', !1, function(t) {
return Vn(t);}, !0), ra('scrollbarStyle', "native", function(t) {
$n(t), Vn(t), t.display.scrollbars.setScrollTop(t.doc.scrollTop), t.display.scrollbars.setScrollLeft(t.doc.scrollLeft)
}, !0), ra('lineNumbers', !1, function(t, e) {
t.display.gutterSpecs=vi(t.options.gutters, e), xi(t);}, !0), ra('firstLineNumber', 1, xi, !0), ra('lineNumberFormatter', function(t) {
return t
}, xi, !0), ra('showCursorWhenSelecting', !1, wn, !0), ra('resetSelectionOnContextMenu', !0), ra('lineWiseCopyCut', !0), ra('pasteLinesPerSelection', !0), ra('selectionsMayTouch', !1), ra('readOnly', !1, function(t, e) {
"nocursor"==e&&(En(t), t.display.input.blur()), t.display.input.readOnlyChanged(e);}), ra('disableInput', !1, function(t, e) {
e||t.display.input.reset()
}, !0), ra('dragDrop', !0, Es), ra('allowDropFileTypes', null), ra('cursorBlinkRate', 530), ra('cursorScrollMargin', 0), ra('cursorHeight', 1, wn, !0), ra('singleCursorHeightPerLine', !0, wn, !0), ra('workTime', 100), ra('workDelay', 100), ra('flattenSpans', !0, Oi, !0), ra('addModeClass', !1, Oi, !0), ra('pollInterval', 100), ra('undoDepth', 200, function(t, e) {
return t.doc.history.undoDepth=e;}), ra('historyEventDelay', 1250), ra('viewportMargin', 10, function(t) {
return t.refresh()
}, !0), ra('maxHighlightLength', 1e4, Oi, !0), ra('moveInputWithCursor', !0, function(t, e) {
e||t.display.input.resetPosition();}), ra('tabindex', null, function(t, e) {
return t.display.input.getField().tabIndex=e||''}), ra('autofocus', null), ra('direction', "ltr", function(t, e) {
return t.doc.setDirection(e)
}, !0), ra('phrases', null), ta=(Qs=Ds).optionHandlers, ea=Qs.helpers={}, Qs.prototype={ constructor: Qs, focus: function() {
window.focus(), this.display.input.focus();}, setOption: function(t, e) {
var r=this.options; var n=r[t]; r[t]==e&&'mode'!=t||(r[t]=e, ta.hasOwnProperty(t)&&ii(this, ta[t])(this, e, n), Ct(this, "optionChange", this, t));}, getOption: function(t) {
return this.options[t]
}, getDoc: function() {
return this.doc
}, addKeyMap: function(t, e) {
this.state.keyMaps[e?'push':'unshift'](ts(t))
}, removeKeyMap: function(t) {
for (let e=this.state.keyMaps, r=0; r<e.length; ++r) if (e[r]==t||e[r].name==t) return e.splice(r, 1), !0;}, addOverlay: oi(function(t, e) {
var r=t.token?t:Qs.getMode(this.options, t); if (r.startState) throw new Error('Overlays may not be stateful.'); !function(t, e, r) {
for (var n=0, i=r(e); n<t.length&&r(t[n])<=i;)n++; t.splice(n, 0, e);}(this.state.overlays, { mode: r, modeSpec: t, opaque: e&&e.opaque, priority: e&&e.priority||0 }, function(t) {
return t.priority
}), this.state.modeGen++, mn(this)
}), removeOverlay: oi(function(t) {
for (let e=this.state.overlays, r=0; r<e.length; ++r) {
var n=e[r].modeSpec; if (n==t||'string'==typeof t&&n.name==t) return e.splice(r, 1), this.state.modeGen++, void mn(this);}
}), indentLine: oi(function(t, e, r) {
"string"!=typeof e&&'number'!=typeof e&&(e=null==e?this.options.smartIndent?'smart':'prev':e?'add':'subtract'), se(this.doc, t)&&Bs(this, t, e, r)
}), indentSelection: oi(function(t) {
for (let e=this.doc.sel.ranges, r=-1, n=0; n<e.length; n++) {
var i=e[n]; if (i.empty())i.head.line>r&&(Bs(this, i.head.line, t, !0), r=i.head.line, n==this.doc.sel.primIndex&&Hn(this)); else {
var o=i.from(); var s=i.to(); var a=Math.max(r, o.line); r=Math.min(this.lastLine(), s.line-(s.ch?0:1))+1; for (let l=a; l<r; ++l)Bs(this, l, t); var u=this.doc.sel.ranges; 0==o.ch&&e.length==u.length&&0<u[n].from().ch&&to(this.doc, n, new Ri(o, u[n].to()), z)
}
}
}), getTokenAt: function(t, e) {
return ke(this, t, e)
}, getLineTokens: function(t, e) {
return ke(this, le(t), e, !0);}, getTokenTypeAt: function(t) {
t=ge(this.doc, t); var e; var r=be(this,te(this.doc,t.line)); var n=0; var i=(r.length-1)/2; var o=t.ch; if (0==o)e=r[2]; else for (;;) {
var s=n+i>>1; if ((s?r[2*s-1]:0)>=o)i=s; else {
if (!(r[2*s+1]<o)) {
e=r[2*s+2]; break
}n=1+s
}
} var a=e?e.indexOf('overlay '):-1; return a<0?e:0==a?null:e.slice(0, a-1);}, getModeAt: function(t) {
var e=this.doc.mode; return e.innerMode?Qs.innerMode(e, this.getTokenAt(t).state).mode:e
}, getHelper: function(t, e) {
return this.getHelpers(t, e)[0]
}, getHelpers: function(t, e) {
var r=[]; if (!ea.hasOwnProperty(e)) return r; var n=ea[e]; var i=this.getModeAt(t); if ('string'==typeof i[e])n[i[e]]&&r.push(n[i[e]]); else if (i[e]) for (let o=0; o<i[e].length; o++) {
var s=n[i[e][o]]; s&&r.push(s);} else i.helperType&&n[i.helperType]?r.push(n[i.helperType]):n[i.name]&&r.push(n[i.name]); for (let a=0; a<n._global.length; a++) {
var l=n._global[a]; l.pred(i, this)&&-1==K(r, l.val)&&r.push(l.val)
} return r
}, getStateAfter: function(t, e) {
var r=this.doc; return we(this, (t=pe(r, null==t?r.first+r.size-1:t))+1, e).state
}, cursorCoords: function(t, e) {
var r=this.doc.sel.primary(); return Qr(this, null==t?r.head:'object'==typeof t?ge(this.doc, t):t?r.from():r.to(), e||'page')
}, charCoords: function(t, e) {
return Zr(this, ge(this.doc, t), e||'page')
}, coordsChar: function(t, e) {
return rn(this, (t=Yr(this, t, e||'page')).left, t.top);}, lineAtHeight: function(t, e) {
return t=Yr(this, { top: t, left: 0 }, e||'page').top, oe(this.doc, t+this.display.viewOffset);}, heightAtLine: function(t, e, r) {
var n; var i=!1; if ('number'==typeof t) {
var o=this.doc.first+this.doc.size-1; t<this.doc.first?t=this.doc.first:o<t&&(t=o, i=!0), n=te(this.doc, t)
} else n=t; return Xr(this, n, { top: 0, left: 0 }, e||'page', r||i).top+(i?this.doc.height-Ye(n):0)
}, defaultTextHeight: function() {
return ln(this.display)
}, defaultCharWidth: function() {
return un(this.display);}, getViewport: function() {
return { from: this.display.viewFrom, to: this.display.viewTo };}, addWidget: function(t, e, r, n, i) {
var o; var s; var a; var l=this.display; var u=(t=Qr(this,ge(this.doc,t))).bottom; var c=t.left; if (e.style.position='absolute', e.setAttribute('cm-ignore-events', "true"), this.display.input.setUneditable(e), l.sizer.appendChild(e), "over"==n)u=t.top; else if ('above'==n||'near'==n) {
var h=Math.max(l.wrapper.clientHeight, this.doc.height); var f=Math.max(l.sizer.clientWidth, l.lineSpace.clientWidth); ('above'==n||t.bottom+e.offsetHeight>h)&&t.top>e.offsetHeight?u=t.top-e.offsetHeight:t.bottom+e.offsetHeight<=h&&(u=t.bottom), c+e.offsetWidth>f&&(c=f-e.offsetWidth);}e.style.top=u+'px', e.style.left=e.style.right='', "right"==i?(c=l.sizer.clientWidth-e.offsetWidth, e.style.right='0px'):('left'==i?c=0:'middle'==i&&(c=(l.sizer.clientWidth-e.offsetWidth)/2), e.style.left=c+'px'), r&&(o=this, s={ left: c, top: u, right: c+e.offsetWidth, bottom: u+e.offsetHeight }, null!=(a=Bn(o, s)).scrollTop&&Kn(o, a.scrollTop), null!=a.scrollLeft&&Fn(o, a.scrollLeft))
}, triggerOnKeyDown: oi(gs), triggerOnKeyPress: oi(vs), triggerOnKeyUp: ms, triggerOnMouseDown: oi(ws), execCommand: function(t) {
if (ss.hasOwnProperty(t)) return ss[t].call(null, this)
}, triggerElectric: oi(function(t) {
Us(this, t)
}), findPosH: function(t, e, r, n) {
var i=1; e<0&&(i=-1, e=-e); for (var o=ge(this.doc, t), s=0; s<e&&!(o=zs(this.doc, o, i, r, n)).hitSide; ++s);return o;}, moveH: oi(function(e, r) {
var n=this; this.extendSelectionsBy(function(t) {
return n.display.shift||n.doc.extend||t.empty()?zs(n.doc, t.head, e, r, n.options.rtlMoveVisually):e<0?t.from():t.to();}, J)
}), deleteH: oi(function(r, n) {
var t=this.doc.sel; var i=this.doc; t.somethingSelected()?i.replaceSelection('', null, "+delete"):es(this, function(t) {
var e=zs(i, t.head, r, n, !1); return r<0?{ from: e, to: t.head }:{ from: t.head, to: e };});}), findPosV: function(t, e, r, n) {
var i=1; var o=n; e<0&&(i=-1, e=-e); for (var s=ge(this.doc, t), a=0; a<e; ++a) {
var l=Qr(this, s, "div"); if (null==o?o=l.left:l.left=o, (s=Ws(this, l, i, r)).hitSide) break;} return s;}, moveV: oi(function(n, i) {
var o=this; var s=this.doc; var a=[]; var l=!this.display.shift&&!s.extend&&s.sel.somethingSelected(); if (s.extendSelectionsBy(function(t) {
if (l) return n<0?t.from():t.to(); var e=Qr(o, t.head, "div"); null!=t.goalColumn&&(e.left=t.goalColumn), a.push(e.left); var r=Ws(o, e, n, i); return "page"==i&&t==s.sel.primary()&&On(o, Zr(o, r, "div").top-e.top), r
}, J), a.length) for (let t=0; t<s.sel.ranges.length; t++)s.sel.ranges[t].goalColumn=a[t];}), findWordAt: function(t) {
var e=te(this.doc, t.line).text; var r=t.ch; var n=t.ch; if (e) {
var i=this.getHelper(t, "wordChars"); "before"!=t.sticky&&n!=e.length||!r?++n:--r; for (var o=e.charAt(r), s=et(o, i)?function(t) {
return et(t, i);}:/\s/.test(o)?function(t) {
return /\s/.test(t)
}:function(t) {
return !/\s/.test(t)&&!et(t)
}; 0<r&&s(e.charAt(r-1));)--r; for (;n<e.length&&s(e.charAt(n));)++n;} return new Ri(le(t.line, r), le(t.line, n));}, toggleOverwrite: function(t) {
null!=t&&t==this.state.overwrite||(((this.state.overwrite=!this.state.overwrite)?I:k)(this.display.cursorDiv, "CodeMirror-overwrite"), Ct(this, "overwriteToggle", this, this.state.overwrite))
}, hasFocus: function() {
return this.display.input.getField()==D()
}, isReadOnly: function() {
return !(!this.options.readOnly&&!this.doc.cantEdit);}, scrollTo: oi(function(t, e) {
Pn(this, t, e)
}), getScrollInfo: function() {
var t=this.display.scroller; return { left: t.scrollLeft, top: t.scrollTop, height: t.scrollHeight-Dr(this)-this.display.barHeight, width: t.scrollWidth-Dr(this)-this.display.barWidth, clientHeight: Br(this), clientWidth: Ir(this) };}, scrollIntoView: oi(function(t, e) {
var r; var n; null==t?(t={ from: this.doc.sel.primary().head, to: null }, null==e&&(e=this.options.cursorScrollMargin)):'number'==typeof t?t={ from: le(t, 0), to: null }:null==t.from&&(t={ from: t, to: null }), t.to||(t.to=t.from), t.margin=e||0, null!=t.from.line?(n=t, _n(r=this), r.curOp.scrollToPos=n):Un(this, t.from, t.to, t.margin);}), setSize: oi(function(t, e) {
function r(t) {
return "number"==typeof t||/^\d+$/.test(String(t))?t+'px':t
} var n=this; null!=t&&(this.display.wrapper.style.width=r(t)), null!=e&&(this.display.wrapper.style.height=r(e)), this.options.lineWrapping&&Jr(this); var i=this.display.viewFrom; this.doc.iter(i, this.display.viewTo, function(t) {
if (t.widgets) for (let e=0; e<t.widgets.length; e++) if (t.widgets[e].noHScroll) {
vn(n, i, "widget"); break;}++i;}), this.curOp.forceUpdate=!0, Ct(this, "refresh", this);}), operation: function(t) {
return ni(this, t)
}, startOperation: function() {
return Yn(this)
}, endOperation: function() {
return Zn(this)
}, refresh: oi(function() {
var t=this.display.cachedTextHeight; mn(this), this.curOp.forceUpdate=!0, Vr(this), Pn(this, this.doc.scrollLeft, this.doc.scrollTop), di(this.display), (null==t||.5<Math.abs(t-ln(this.display)))&&dn(this), Ct(this, "refresh", this);}), swapDoc: oi(function(t) {
var e=this.doc; return e.cm=null, this.state.selectingText&&this.state.selectingText(), Ui(this, t), Vr(this), this.display.input.reset(), Pn(this, t.scrollLeft, t.scrollTop), this.curOp.forceScroll=!0, gr(this, "swapDoc", this, e), e
}), phrase: function(t) {
var e=this.options.phrases; return e&&Object.prototype.hasOwnProperty.call(e, t)?e[t]:t;}, getInputField: function() {
return this.display.input.getField();}, getWrapperElement: function() {
return this.display.wrapper;}, getScrollerElement: function() {
return this.display.scroller
}, getGutterElement: function() {
return this.display.gutters;} }, Rt(Qs), Qs.registerHelper=function(t, e, r) {
ea.hasOwnProperty(t)||(ea[t]=Qs[t]={ _global: [] }), ea[t][e]=r;}, Qs.registerGlobalHelper=function(t, e, r, n) {
Qs.registerHelper(t, e, n), ea[t]._global.push({ pred: r, val: n })
}; var na; var ia='iter insert remove copy getEditor constructor'.split(' '); for (let oa in Oo.prototype)Oo.prototype.hasOwnProperty(oa)&&K(ia, oa)<0&&(Ds.prototype[oa]=function(t) {
return function() {
return t.apply(this.doc, arguments);};}(Oo.prototype[oa])); return Rt(Oo), Ds.inputStyles={ textarea: Xs, contenteditable: Js }, Ds.defineMode=function(t) {
Ds.defaults.mode||'null'==t||(Ds.defaults.mode=t), function(t, e) {
2<arguments.length&&(e.dependencies=Array.prototype.slice.call(arguments, 2)), Wt[t]=e
}.apply(this, arguments);}, Ds.defineMIME=function(t, e) {
Jt[t]=e;}, Ds.defineMode('null', function() {
return { token: function(t) {
return t.skipToEnd()
} }
}), Ds.defineMIME('text/plain', "null"), Ds.defineExtension=function(t, e) {
Ds.prototype[t]=e
}, Ds.defineDocExtension=function(t, e) {
Oo.prototype[t]=e;}, Ds.fromTextArea=function(e, r) {
if ((r=r?P(r):{}).value=e.value, !r.tabindex&&e.tabIndex&&(r.tabindex=e.tabIndex), !r.placeholder&&e.placeholder&&(r.placeholder=e.placeholder), null==r.autofocus) {
var t=D(); r.autofocus=t==e||null!=e.getAttribute('autofocus')&&t==document.body
} function n() {
e.value=a.getValue();} var i; if (e.form&&(bt(e.form, "submit", n), !r.leaveSubmitMethodAlone)) {
var o=e.form; i=o.submit; try {
var s=o.submit=function() {
n(), o.submit=i, o.submit(), o.submit=s
}
} catch (t) {}
}r.finishInit=function(t) {
t.save=n, t.getTextArea=function() {
return e;}, t.toTextArea=function() {
t.toTextArea=isNaN, n(), e.parentNode.removeChild(t.getWrapperElement()), e.style.display='', e.form&&(St(e.form, "submit", n), r.leaveSubmitMethodAlone||'function'!=typeof e.form.submit||(e.form.submit=i));};}, e.style.display='none'; var a=Ds(function(t) {
return e.parentNode.insertBefore(t, e.nextSibling);}, r); return a;}, (na=Ds).off=St, na.on=bt, na.wheelEventPixels=Ai, na.Doc=Oo, na.splitLines=Kt, na.countColumn=_, na.findColumn=V, na.isWordChar=tt, na.Pass=F, na.signal=Ct, na.Line=tr, na.changeEnd=Ei, na.scrollbarModel=Gn, na.Pos=le, na.cmpPos=ue, na.modes=Wt, na.mimeModes=Jt, na.resolveMode=Vt, na.getMode=qt, na.modeExtensions=Gt, na.extendMode=$t, na.copyState=Xt, na.startState=Zt, na.innerMode=Yt, na.commands=ss, na.keyMap=qo, na.keyName=Qo, na.isModifierKey=Yo, na.lookupKey=Xo, na.normalizeKeyMap=$o, na.StringStream=Qt, na.SharedTextMarker=No, na.TextMarker=Lo, na.LineWidget=ko, na.e_preventDefault=Mt, na.e_stopPropagation=Lt, na.e_stop=Nt, na.addClass=I, na.contains=N, na.rmClass=k, na.keyNames=zo, Ds.version='5.50.2', Ds;}), function(e) {
"object"==typeof exports&&'object'==typeof module?e(require('../../lib/codemirror'), "cjs"):'function'==typeof define&&define.amd?define(['../../lib/codemirror'], function(t) {
e(t, "amd");}):e(CodeMirror, "plain");}(function(u, s) {
u.modeURL||(u.modeURL='../mode/%N/%N.js'); var a={}; function l(t, e) {
var r=u.modes[t].dependencies; if (!r) return e(); for (var n=[], i=0; i<r.length; ++i)u.modes.hasOwnProperty(r[i])||n.push(r[i]); if (!n.length) return e(); var o; var s; var a; var l=(o=e, s=n.length, a=s, function() {
0==--a&&o()
}); for (i=0; i<n.length; ++i)u.requireMode(n[i], l);}u.requireMode=function(t, e) {
if ('string'!=typeof t&&(t=t.name), u.modes.hasOwnProperty(t)) return l(t, e); if (a.hasOwnProperty(t)) return a[t].push(e); var r=u.modeURL.replace(/%N/g, t); if ('plain'==s) {
var n=document.createElement('script'); n.src=r; var i=document.getElementsByTagName('script')[0]; var o=a[t]=[e]; u.on(n, "load", function() {
l(t, function() {
for (let t=0; t<o.length; ++t)o[t]();})
}), i.parentNode.insertBefore(n, i)
} else "cjs"==s?(require(r), e()):'amd'==s&&requirejs([r], e)
}, u.autoLoadMode=function(t, e) {
u.modes.hasOwnProperty(e)||u.requireMode(e, function() {
t.setOption('mode', t.getOption('mode'))
})
};}), function(t) {
"object"==typeof exports&&'object'==typeof module?t(require('../lib/codemirror')):'function'==typeof define&&define.amd?define(['../lib/codemirror'], t):t(CodeMirror);}(function(o) {
"use strict"; o.modeInfo=[{ name: "APL", mime: "text/apl", mode: "apl", ext: ['dyalog', "apl"] }, { name: "PGP", mimes: ['application/pgp', "application/pgp-encrypted", "application/pgp-keys", "application/pgp-signature"], mode: "asciiarmor", ext: ['asc', "pgp", "sig"] }, { name: "ASN.1", mime: "text/x-ttcn-asn", mode: "asn.1", ext: ['asn', "asn1"] }, { name: "Asterisk", mime: "text/x-asterisk", mode: "asterisk", file: /^extensions\.conf$/i }, { name: "Brainfuck", mime: "text/x-brainfuck", mode: "brainfuck", ext: ['b', "bf"] }, { name: "C", mime: "text/x-csrc", mode: "clike", ext: ['c', "h", "ino"] }, { name: "C++", mime: "text/x-c++src", mode: "clike", ext: ['cpp', "c++", "cc", "cxx", "hpp", "h++", "hh", "hxx"], alias: ['cpp'] }, { name: "Cobol", mime: "text/x-cobol", mode: "cobol", ext: ['cob', "cpy"] }, { name: "C#", mime: "text/x-csharp", mode: "clike", ext: ['cs'], alias: ['csharp', "cs"] }, { name: "Clojure", mime: "text/x-clojure", mode: "clojure", ext: ['clj', "cljc", "cljx"] }, { name: "ClojureScript", mime: "text/x-clojurescript", mode: "clojure", ext: ['cljs'] }, { name: "Closure Stylesheets (GSS)", mime: "text/x-gss", mode: "css", ext: ['gss'] }, { name: "CMake", mime: "text/x-cmake", mode: "cmake", ext: ['cmake', "cmake.in"], file: /^CMakeLists.txt$/ }, { name: "CoffeeScript", mimes: ['application/vnd.coffeescript', "text/coffeescript", "text/x-coffeescript"], mode: "coffeescript", ext: ['coffee'], alias: ['coffee', "coffee-script"] }, { name: "Common Lisp", mime: "text/x-common-lisp", mode: "commonlisp", ext: ['cl', "lisp", "el"], alias: ['lisp'] }, { name: "Cypher", mime: "application/x-cypher-query", mode: "cypher", ext: ['cyp', "cypher"] }, { name: "Cython", mime: "text/x-cython", mode: "python", ext: ['pyx', "pxd", "pxi"] }, { name: "Crystal", mime: "text/x-crystal", mode: "crystal", ext: ['cr'] }, { name: "CSS", mime: "text/css", mode: "css", ext: ['css'] }, { name: "CQL", mime: "text/x-cassandra", mode: "sql", ext: ['cql'] }, { name: "D", mime: "text/x-d", mode: "d", ext: ['d'] }, { name: "Dart", mimes: ['application/dart', "text/x-dart"], mode: "dart", ext: ['dart'] }, { name: "diff", mime: "text/x-diff", mode: "diff", ext: ['diff', "patch"] }, { name: "Django", mime: "text/x-django", mode: "django" }, { name: "Dockerfile", mime: "text/x-dockerfile", mode: "dockerfile", file: /^Dockerfile$/ }, { name: "DTD", mime: "application/xml-dtd", mode: "dtd", ext: ['dtd'] }, { name: "Dylan", mime: "text/x-dylan", mode: "dylan", ext: ['dylan', "dyl", "intr"] }, { name: "EBNF", mime: "text/x-ebnf", mode: "ebnf" }, { name: "ECL", mime: "text/x-ecl", mode: "ecl", ext: ['ecl'] }, { name: "edn", mime: "application/edn", mode: "clojure", ext: ['edn'] }, { name: "Eiffel", mime: "text/x-eiffel", mode: "eiffel", ext: ['e'] }, { name: "Elm", mime: "text/x-elm", mode: "elm", ext: ['elm'] }, { name: "Embedded Javascript", mime: "application/x-ejs", mode: "htmlembedded", ext: ['ejs'] }, { name: "Embedded Ruby", mime: "application/x-erb", mode: "htmlembedded", ext: ['erb'] }, { name: "Erlang", mime: "text/x-erlang", mode: "erlang", ext: ['erl'] }, { name: "Esper", mime: "text/x-esper", mode: "sql" }, { name: "Factor", mime: "text/x-factor", mode: "factor", ext: ['factor'] }, { name: "FCL", mime: "text/x-fcl", mode: "fcl" }, { name: "Forth", mime: "text/x-forth", mode: "forth", ext: ['forth', "fth", "4th"] }, { name: "Fortran", mime: "text/x-fortran", mode: "fortran", ext: ['f', "for", "f77", "f90", "f95"] }, { name: "F#", mime: "text/x-fsharp", mode: "mllike", ext: ['fs'], alias: ['fsharp'] }, { name: "Gas", mime: "text/x-gas", mode: "gas", ext: ['s'] }, { name: "Gherkin", mime: "text/x-feature", mode: "gherkin", ext: ['feature'] }, { name: "GitHub Flavored Markdown", mime: "text/x-gfm", mode: "gfm", file: /^(readme|contributing|history).md$/i }, { name: "Go", mime: "text/x-go", mode: "go", ext: ['go'] }, { name: "Groovy", mime: "text/x-groovy", mode: "groovy", ext: ['groovy', "gradle"], file: /^Jenkinsfile$/ }, { name: "HAML", mime: "text/x-haml", mode: "haml", ext: ['haml'] }, { name: "Haskell", mime: "text/x-haskell", mode: "haskell", ext: ['hs'] }, { name: "Haskell (Literate)", mime: "text/x-literate-haskell", mode: "haskell-literate", ext: ['lhs'] }, { name: "Haxe", mime: "text/x-haxe", mode: "haxe", ext: ['hx'] }, { name: "HXML", mime: "text/x-hxml", mode: "haxe", ext: ['hxml'] }, { name: "ASP.NET", mime: "application/x-aspx", mode: "htmlembedded", ext: ['aspx'], alias: ['asp', "aspx"] }, { name: "HTML", mime: "text/html", mode: "htmlmixed", ext: ['html', "htm", "handlebars", "hbs"], alias: ['xhtml'] }, { name: "HTTP", mime: "message/http", mode: "http" }, { name: "IDL", mime: "text/x-idl", mode: "idl", ext: ['pro'] }, { name: "Pug", mime: "text/x-pug", mode: "pug", ext: ['jade', "pug"], alias: ['jade'] }, { name: "Java", mime: "text/x-java", mode: "clike", ext: ['java'] }, { name: "Java Server Pages", mime: "application/x-jsp", mode: "htmlembedded", ext: ['jsp'], alias: ['jsp'] }, { name: "JavaScript", mimes: ['text/javascript', "text/ecmascript", "application/javascript", "application/x-javascript", "application/ecmascript"], mode: "javascript", ext: ['js'], alias: ['ecmascript', "js", "node"] }, { name: "JSON", mimes: ['application/json', "application/x-json"], mode: "javascript", ext: ['json', "map"], alias: ['json5'] }, { name: "JSON-LD", mime: "application/ld+json", mode: "javascript", ext: ['jsonld'], alias: ['jsonld'] }, { name: "JSX", mime: "text/jsx", mode: "jsx", ext: ['jsx'] }, { name: "Jinja2", mime: "text/jinja2", mode: "jinja2", ext: ['j2', "jinja", "jinja2"] }, { name: "Julia", mime: "text/x-julia", mode: "julia", ext: ['jl'] }, { name: "Kotlin", mime: "text/x-kotlin", mode: "clike", ext: ['kt'] }, { name: "LESS", mime: "text/x-less", mode: "css", ext: ['less'] }, { name: "LiveScript", mime: "text/x-livescript", mode: "livescript", ext: ['ls'], alias: ['ls'] }, { name: "Lua", mime: "text/x-lua", mode: "lua", ext: ['lua'] }, { name: "Markdown", mime: "text/x-markdown", mode: "markdown", ext: ['markdown', "md", "mkd"] }, { name: "mIRC", mime: "text/mirc", mode: "mirc" }, { name: "MariaDB SQL", mime: "text/x-mariadb", mode: "sql" }, { name: "Mathematica", mime: "text/x-mathematica", mode: "mathematica", ext: ['m', "nb", "wl", "wls"] }, { name: "Modelica", mime: "text/x-modelica", mode: "modelica", ext: ['mo'] }, { name: "MUMPS", mime: "text/x-mumps", mode: "mumps", ext: ['mps'] }, { name: "MS SQL", mime: "text/x-mssql", mode: "sql" }, { name: "mbox", mime: "application/mbox", mode: "mbox", ext: ['mbox'] }, { name: "MySQL", mime: "text/x-mysql", mode: "sql" }, { name: "Nginx", mime: "text/x-nginx-conf", mode: "nginx", file: /nginx.*\.conf$/i }, { name: "NSIS", mime: "text/x-nsis", mode: "nsis", ext: ['nsh', "nsi"] }, { name: "NTriples", mimes: ['application/n-triples', "application/n-quads", "text/n-triples"], mode: "ntriples", ext: ['nt', "nq"] }, { name: "Objective-C", mime: "text/x-objectivec", mode: "clike", ext: ['m'], alias: ['objective-c', "objc"] }, { name: "Objective-C++", mime: "text/x-objectivec++", mode: "clike", ext: ['mm'], alias: ['objective-c++', "objc++"] }, { name: "OCaml", mime: "text/x-ocaml", mode: "mllike", ext: ['ml', "mli", "mll", "mly"] }, { name: "Octave", mime: "text/x-octave", mode: "octave", ext: ['m'] }, { name: "Oz", mime: "text/x-oz", mode: "oz", ext: ['oz'] }, { name: "Pascal", mime: "text/x-pascal", mode: "pascal", ext: ['p', "pas"] }, { name: "PEG.js", mime: "null", mode: "pegjs", ext: ['jsonld'] }, { name: "Perl", mime: "text/x-perl", mode: "perl", ext: ['pl', "pm"] }, { name: "PHP", mimes: ['text/x-php', "application/x-httpd-php", "application/x-httpd-php-open"], mode: "php", ext: ['php', "php3", "php4", "php5", "php7", "phtml"] }, { name: "Pig", mime: "text/x-pig", mode: "pig", ext: ['pig'] }, { name: "Plain Text", mime: "text/plain", mode: "null", ext: ['txt', "text", "conf", "def", "list", "log"] }, { name: "PLSQL", mime: "text/x-plsql", mode: "sql", ext: ['pls'] }, { name: "PostgreSQL", mime: "text/x-pgsql", mode: "sql" }, { name: "PowerShell", mime: "application/x-powershell", mode: "powershell", ext: ['ps1', "psd1", "psm1"] }, { name: "Properties files", mime: "text/x-properties", mode: "properties", ext: ['properties', "ini", "in"], alias: ['ini', "properties"] }, { name: "ProtoBuf", mime: "text/x-protobuf", mode: "protobuf", ext: ['proto'] }, { name: "Python", mime: "text/x-python", mode: "python", ext: ['BUILD', "bzl", "py", "pyw"], file: /^(BUCK|BUILD)$/ }, { name: "Puppet", mime: "text/x-puppet", mode: "puppet", ext: ['pp'] }, { name: "Q", mime: "text/x-q", mode: "q", ext: ['q'] }, { name: "R", mime: "text/x-rsrc", mode: "r", ext: ['r', "R"], alias: ['rscript'] }, { name: "reStructuredText", mime: "text/x-rst", mode: "rst", ext: ['rst'], alias: ['rst'] }, { name: "RPM Changes", mime: "text/x-rpm-changes", mode: "rpm" }, { name: "RPM Spec", mime: "text/x-rpm-spec", mode: "rpm", ext: ['spec'] }, { name: "Ruby", mime: "text/x-ruby", mode: "ruby", ext: ['rb'], alias: ['jruby', "macruby", "rake", "rb", "rbx"] }, { name: "Rust", mime: "text/x-rustsrc", mode: "rust", ext: ['rs'] }, { name: "SAS", mime: "text/x-sas", mode: "sas", ext: ['sas'] }, { name: "Sass", mime: "text/x-sass", mode: "sass", ext: ['sass'] }, { name: "Scala", mime: "text/x-scala", mode: "clike", ext: ['scala'] }, { name: "Scheme", mime: "text/x-scheme", mode: "scheme", ext: ['scm', "ss"] }, { name: "SCSS", mime: "text/x-scss", mode: "css", ext: ['scss'] }, { name: "Shell", mimes: ['text/x-sh', "application/x-sh"], mode: "shell", ext: ['sh', "ksh", "bash"], alias: ['bash', "sh", "zsh"], file: /^PKGBUILD$/ }, { name: "Sieve", mime: "application/sieve", mode: "sieve", ext: ['siv', "sieve"] }, { name: "Slim", mimes: ['text/x-slim', "application/x-slim"], mode: "slim", ext: ['slim'] }, { name: "Smalltalk", mime: "text/x-stsrc", mode: "smalltalk", ext: ['st'] }, { name: "Smarty", mime: "text/x-smarty", mode: "smarty", ext: ['tpl'] }, { name: "Solr", mime: "text/x-solr", mode: "solr" }, { name: "SML", mime: "text/x-sml", mode: "mllike", ext: ['sml', "sig", "fun", "smackspec"] }, { name: "Soy", mime: "text/x-soy", mode: "soy", ext: ['soy'], alias: ['closure template'] }, { name: "SPARQL", mime: "application/sparql-query", mode: "sparql", ext: ['rq', "sparql"], alias: ['sparul'] }, { name: "Spreadsheet", mime: "text/x-spreadsheet", mode: "spreadsheet", alias: ['excel', "formula"] }, { name: "SQL", mime: "text/x-sql", mode: "sql", ext: ['sql'] }, { name: "SQLite", mime: "text/x-sqlite", mode: "sql" }, { name: "Squirrel", mime: "text/x-squirrel", mode: "clike", ext: ['nut'] }, { name: "Stylus", mime: "text/x-styl", mode: "stylus", ext: ['styl'] }, { name: "Swift", mime: "text/x-swift", mode: "swift", ext: ['swift'] }, { name: "sTeX", mime: "text/x-stex", mode: "stex" }, { name: "LaTeX", mime: "text/x-latex", mode: "stex", ext: ['text', "ltx", "tex"], alias: ['tex'] }, { name: "SystemVerilog", mime: "text/x-systemverilog", mode: "verilog", ext: ['v', "sv", "svh"] }, { name: "Tcl", mime: "text/x-tcl", mode: "tcl", ext: ['tcl'] }, { name: "Textile", mime: "text/x-textile", mode: "textile", ext: ['textile'] }, { name: "TiddlyWiki ", mime: "text/x-tiddlywiki", mode: "tiddlywiki" }, { name: "Tiki wiki", mime: "text/tiki", mode: "tiki" }, { name: "TOML", mime: "text/x-toml", mode: "toml", ext: ['toml'] }, { name: "Tornado", mime: "text/x-tornado", mode: "tornado" }, { name: "troff", mime: "text/troff", mode: "troff", ext: ['1', "2", "3", "4", "5", "6", "7", "8", "9"] }, { name: "TTCN", mime: "text/x-ttcn", mode: "ttcn", ext: ['ttcn', "ttcn3", "ttcnpp"] }, { name: "TTCN_CFG", mime: "text/x-ttcn-cfg", mode: "ttcn-cfg", ext: ['cfg'] }, { name: "Turtle", mime: "text/turtle", mode: "turtle", ext: ['ttl'] }, { name: "TypeScript", mime: "application/typescript", mode: "javascript", ext: ['ts'], alias: ['ts'] }, { name: "TypeScript-JSX", mime: "text/typescript-jsx", mode: "jsx", ext: ['tsx'], alias: ['tsx'] }, { name: "Twig", mime: "text/x-twig", mode: "twig" }, { name: "Web IDL", mime: "text/x-webidl", mode: "webidl", ext: ['webidl'] }, { name: "VB.NET", mime: "text/x-vb", mode: "vb", ext: ['vb'] }, { name: "VBScript", mime: "text/vbscript", mode: "vbscript", ext: ['vbs'] }, { name: "Velocity", mime: "text/velocity", mode: "velocity", ext: ['vtl'] }, { name: "Verilog", mime: "text/x-verilog", mode: "verilog", ext: ['v'] }, { name: "VHDL", mime: "text/x-vhdl", mode: "vhdl", ext: ['vhd', "vhdl"] }, { name: "Vue.js Component", mimes: ['script/x-vue', "text/x-vue"], mode: "vue", ext: ['vue'] }, { name: "XML", mimes: ['application/xml', "text/xml"], mode: "xml", ext: ['xml', "xsl", "xsd", "svg"], alias: ['rss', "wsdl", "xsd"] }, { name: "XQuery", mime: "application/xquery", mode: "xquery", ext: ['xy', "xquery"] }, { name: "Yacas", mime: "text/x-yacas", mode: "yacas", ext: ['ys'] }, { name: "YAML", mimes: ['text/x-yaml', "text/yaml"], mode: "yaml", ext: ['yaml', "yml"], alias: ['yml'] }, { name: "Z80", mime: "text/x-z80", mode: "z80", ext: ['z80'] }, { name: "mscgen", mime: "text/x-mscgen", mode: "mscgen", ext: ['mscgen', "mscin", "msc"] }, { name: "xu", mime: "text/x-xu", mode: "mscgen", ext: ['xu'] }, { name: "msgenny", mime: "text/x-msgenny", mode: "mscgen", ext: ['msgenny'] }]; for (let t=0; t<o.modeInfo.length; t++) {
var e=o.modeInfo[t]; e.mimes&&(e.mime=e.mimes[0])
}o.findModeByMIME=function(t) {
t=t.toLowerCase(); for (let e=0; e<o.modeInfo.length; e++) {
var r=o.modeInfo[e]; if (r.mime==t) return r; if (r.mimes) for (let n=0; n<r.mimes.length; n++) if (r.mimes[n]==t) return r;} return /\+xml$/.test(t)?o.findModeByMIME('application/xml'):/\+json$/.test(t)?o.findModeByMIME('application/json'):void 0;}, o.findModeByExtension=function(t) {
t=t.toLowerCase(); for (let e=0; e<o.modeInfo.length; e++) {
var r=o.modeInfo[e]; if (r.ext) for (let n=0; n<r.ext.length; n++) if (r.ext[n]==t) return r
}
}, o.findModeByFileName=function(t) {
for (let e=0; e<o.modeInfo.length; e++) {
var r=o.modeInfo[e]; if (r.file&&r.file.test(t)) return r;} var n=t.lastIndexOf('.'); var i=-1<n&&t.substring(n+1, t.length); if (i) return o.findModeByExtension(i)
}, o.findModeByName=function(t) {
t=t.toLowerCase(); for (let e=0; e<o.modeInfo.length; e++) {
var r=o.modeInfo[e]; if (r.name.toLowerCase()==t) return r; if (r.alias) for (let n=0; n<r.alias.length; n++) if (r.alias[n].toLowerCase()==t) return r;}
}
}), function(t) {
"object"==typeof exports&&'object'==typeof module?t(require('../../lib/codemirror')):'function'==typeof define&&define.amd?define(['../../lib/codemirror'], t):t(CodeMirror)
}(function(ee) {
"use strict"; ee.defineMode('javascript', function(t, h) {
var e; var r; var n; var i; var o; var s; var f=t.indentUnit; var d=h.statementIndent; var a=h.jsonld; var l=h.json||a; var u=h.typescript; var c=h.wordCharacters||/[\w$\xa1-\uffff]/; var p=(e=g('keyword a'), r=g('keyword b'), n=g('keyword c'), i=g('keyword d'), o=g('operator'), s={ type: "atom", style: "atom" }, { if: g('if'), while: e, with: e, else: r, do: r, try: r, finally: r, return: i, break: i, continue: i, new: g('new'), delete: n, void: n, throw: n, debugger: g('debugger'), var: g('var'), const: g('var'), let: g('var'), function: g('function'), catch: g('catch'), for: g('for'), switch: g('switch'), case: g('case'), default: g('default'), in: o, typeof: o, instanceof: o, true: s, false: s, null: s, undefined: s, NaN: s, Infinity: s, this: g('this'), class: g('class'), super: g('atom'), yield: n, export: g('export'), import: g('import'), extends: n, await: n }); function g(t) {
return { type: t, style: "keyword" };} var m; var v; var y=/[+\-*&%=<>!?|~^@]/; var x=/^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/; function b(t, e, r) {
return m=t, v=r, e
} function w(t, e) {
var i; var r=t.next(); if ('"'==r||'\''==r) return e.tokenize=(i=r, function(t, e) {
var r; var n=!1; if (a&&'@'==t.peek()&&t.match(x)) return e.tokenize=w, b('jsonld-keyword', "meta"); for (;null!=(r=t.next())&&(r!=i||n);)n=!n&&'\\'==r; return n||(e.tokenize=w), b('string', "string");}), e.tokenize(t, e); if ('.'==r&&t.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)) return b('number', "number"); if ('.'==r&&t.match('..')) return b('spread', "meta"); if (/[\[\]{}\(\),;\:\.]/.test(r)) return b(r); if ('='==r&&t.eat('>')) return b('=>', "operator"); if ('0'==r&&t.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)) return b('number', "number"); if (/\d/.test(r)) return t.match(/^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/), b('number', "number"); if ('/'==r) return t.eat('*')?(e.tokenize=S)(t, e):t.eat('/')?(t.skipToEnd(), b('comment', "comment")):te(t, e, 1)?(function(t) {
for (var e, r=!1, n=!1; null!=(e=t.next());) {
if (!r) {
if ('/'==e&&!n) return; "["==e?n=!0:n&&']'==e&&(n=!1)
}r=!r&&'\\'==e;}
}(t), t.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/), b('regexp', "string-2")):(t.eat('='), b('operator', "operator", t.current())); if ('`'==r) return (e.tokenize=C)(t, e); if ('#'==r) return t.skipToEnd(), b('error', "error"); if ('<'==r&&t.match('!--')||'-'==r&&t.match('->')) return t.skipToEnd(), b('comment', "comment"); if (y.test(r)) return ">"==r&&e.lexical&&'>'==e.lexical.type||(t.eat('=')?'!'!=r&&'='!=r||t.eat('='):/[<>*+\-]/.test(r)&&(t.eat(r), ">"==r&&t.eat(r))), b('operator', "operator", t.current()); if (c.test(r)) {
t.eatWhile(c); var n=t.current(); if ('.'!=e.lastType) {
if (p.propertyIsEnumerable(n)) {
var o=p[n]; return b(o.type, o.style, n);} if ('async'==n&&t.match(/^(\s|\/\*.*?\*\/)*[\[\(\w]/, !1)) return b('async', "keyword", n)
} return b('variable', "variable", n)
}
} function S(t, e) {
for (var r, n=!1; r=t.next();) {
if ('/'==r&&n) {
e.tokenize=w; break;}n='*'==r
} return b('comment', "comment");} function C(t, e) {
for (var r, n=!1; null!=(r=t.next());) {
if (!n&&('`'==r||'$'==r&&t.eat('{'))) {
e.tokenize=w; break;}n=!n&&'\\'==r;} return b('quasi', "string-2", t.current());} var A='([{}])'; function T(t, e) {
e.fatArrowAt&&(e.fatArrowAt=null); var r=t.string.indexOf('=>', t.start); if (!(r<0)) {
if (u) {
var n=/:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(t.string.slice(t.start, r)); n&&(r=n.index);} for (var i=0, o=!1, s=r-1; 0<=s; --s) {
var a=t.string.charAt(s); var l=A.indexOf(a); if (0<=l&&l<3) {
if (!i) {
++s; break;} if (0==--i) {
"("==a&&(o=!0); break;}
} else if (3<=l&&l<6)++i; else if (c.test(a))o=!0; else if (/["'\/`]/.test(a)) for (;;--s) {
if (0==s) return; if (t.string.charAt(s-1)==a&&'\\'!=t.string.charAt(s-2)) {
s--; break;}
} else if (o&&!i) {
++s; break;}
}o&&!i&&(e.fatArrowAt=s);}
} var k={ atom: !0, number: !0, variable: !0, string: !0, regexp: !0, this: !0, "jsonld-keyword": !0 }; function R(t, e, r, n, i, o) {
this.indented=t, this.column=e, this.type=r, this.prev=i, this.info=o, null!=n&&(this.align=n)
} function M(t, e) {
for (var r=t.localVars; r; r=r.next) if (r.name==e) return 1; for (let n=t.context; n; n=n.prev) for (r=n.vars; r; r=r.next) if (r.name==e) return 1
} var L={ state: null, column: null, marked: null, cc: null }; function E() {
for (let t=arguments.length-1; 0<=t; t--)L.cc.push(arguments[t]);} function N() {
return E.apply(null, arguments), !0
} function D(t, e) {
for (let r=e; r; r=r.next) if (r.name==t) return 1
} function I(t) {
var e=L.state; if (L.marked='def', e.context) if ('var'==e.lexical.info&&e.context&&e.context.block) {
var r=function t(e, r) {
{if (r) {
if (r.block) {
var n=t(e, r.prev); return n?n==r.prev?r:new O(n, r.vars, !0):null
} return D(e, r.vars)?r:new O(r.prev, new H(e, r.vars), !1)
} return null;}
}(t, e.context); if (null!=r) return void(e.context=r)
} else if (!D(t, e.localVars)) return void(e.localVars=new H(t, e.localVars)); h.globalVars&&!D(t, e.globalVars)&&(e.globalVars=new H(t, e.globalVars))
} function B(t) {
return "public"==t||'private'==t||'protected'==t||'abstract'==t||'readonly'==t;} function O(t, e, r) {
this.prev=t, this.vars=e, this.block=r
} function H(t, e) {
this.name=t, this.next=e;} var P=new H('this', new H('arguments', null)); function _() {
L.state.context=new O(L.state.context, L.state.localVars, !1), L.state.localVars=P
} function U() {
L.state.context=new O(L.state.context, L.state.localVars, !0), L.state.localVars=null;} function K() {
L.state.localVars=L.state.context.vars, L.state.context=L.state.context.prev
} function j(n, i) {
function t() {
var t=L.state; var e=t.indented; if ('stat'==t.lexical.type)e=t.lexical.indented; else for (let r=t.lexical; r&&')'==r.type&&r.align; r=r.prev)e=r.indented; t.lexical=new R(e, L.stream.column(), n, null, t.lexical, i);} return t.lex=!0, t
} function F() {
var t=L.state; t.lexical.prev&&(')'==t.lexical.type&&(t.indented=t.lexical.indented), t.lexical=t.lexical.prev);} function z(r) {
return function t(e) {
return e==r?N():';'==r||'}'==e||')'==e||']'==e?E():N(t);};} function W(t, e) {
return "var"==t?N(j('vardef', e), Tt, z(';'), F):'keyword a'==t?N(j('form'), G, W, F):'keyword b'==t?N(j('form'), W, F):'keyword d'==t?L.stream.match(/^\s*$/, !1)?N():N(j('stat'), X, z(';'), F):'debugger'==t?N(z(';')):'{'==t?N(j('}'), U, ft, F, K):';'==t?N():'if'==t?('else'==L.state.lexical.info&&L.state.cc[L.state.cc.length-1]==F&&L.state.cc.pop()(), N(j('form'), G, W, F, Nt)):'function'==t?N(Ot):'for'==t?N(j('form'), Dt, W, F):'class'==t||u&&'interface'==e?(L.marked='keyword', N(j('form', "class"==t?t:e), Kt, F)):'variable'==t?u&&'declare'==e?(L.marked='keyword', N(W)):u&&('module'==e||'enum'==e||'type'==e)&&L.stream.match(/^\s*\w/, !1)?(L.marked='keyword', "enum"==e?N(Zt):'type'==e?N(Pt, z('operator'), vt, z(';')):N(j('form'), kt, z('{'), j('}'), ft, F, F)):u&&'namespace'==e?(L.marked='keyword', N(j('form'), V, W, F)):u&&'abstract'==e?(L.marked='keyword', N(W)):N(j('stat'), ot):'switch'==t?N(j('form'), G, z('{'), j('}', "switch"), U, ft, F, F, K):'case'==t?N(V, z(':')):'default'==t?N(z(':')):'catch'==t?N(j('form'), _, J, W, F, K):'export'==t?N(j('stat'), Wt, F):'import'==t?N(j('stat'), Vt, F):'async'==t?N(W):'@'==e?N(V, W):E(j('stat'), V, z(';'), F);} function J(t) {
if ('('==t) return N(_t, z(')'))
} function V(t, e) {
return $(t, e, !1);} function q(t, e) {
return $(t, e, !0)
} function G(t) {
return "("!=t?E():N(j(')'), V, z(')'), F)
} function $(t, e, r) {
if (L.state.fatArrowAt==L.stream.start) {
var n=r?rt:et; if ('('==t) return N(_, j(')'), ct(_t, ")"), F, z('=>'), n, K); if ('variable'==t) return E(_, kt, z('=>'), n, K);} var i; var o=r?Z:Y; return k.hasOwnProperty(t)?N(o):'function'==t?N(Ot, o):'class'==t||u&&'interface'==e?(L.marked='keyword', N(j('form'), Ut, F)):'keyword c'==t||'async'==t?N(r?q:V):'('==t?N(j(')'), X, z(')'), F, o):'operator'==t||'spread'==t?N(r?q:V):'['==t?N(j(']'), Yt, F, o):'{'==t?ht(at, "}", null, o):'quasi'==t?E(Q, o):'new'==t?N((i=r, function(t) {
return "."==t?N(i?it:nt):'variable'==t&&u?N(St, i?Z:Y):E(i?q:V);})):'import'==t?N(V):N()
} function X(t) {
return t.match(/[;\}\)\],]/)?E():E(V)
} function Y(t, e) {
return ","==t?N(V):Z(t, e, !1);} function Z(t, e, r) {
var n=0==r?Y:Z; var i=0==r?V:q; return "=>"==t?N(_, r?rt:et, K):'operator'==t?/\+\+|--/.test(e)||u&&'!'==e?N(n):u&&'<'==e&&L.stream.match(/^([^>]|<.*?>)*>\s*\(/, !1)?N(j('>'), ct(vt, ">"), F, n):'?'==e?N(V, z(':'), i):N(i):'quasi'==t?E(Q, n):';'!=t?'('==t?ht(q, ")", "call", n):'.'==t?N(st, n):'['==t?N(j(']'), X, z(']'), F, n):u&&'as'==e?(L.marked='keyword', N(vt, n)):'regexp'==t?(L.state.lastType=L.marked='operator', L.stream.backUp(L.stream.pos-L.stream.start-1), N(i)):void 0:void 0;} function Q(t, e) {
return "quasi"!=t?E():'${'!=e.slice(e.length-2)?N(Q):N(V, tt)
} function tt(t) {
if ('}'==t) return L.marked='string-2', L.state.tokenize=C, N(Q);} function et(t) {
return T(L.stream, L.state), E('{'==t?W:V);} function rt(t) {
return T(L.stream, L.state), E('{'==t?W:q);} function nt(t, e) {
if ('target'==e) return L.marked='keyword', N(Y);} function it(t, e) {
if ('target'==e) return L.marked='keyword', N(Z)
} function ot(t) {
return ":"==t?N(F, W):E(Y, z(';'), F)
} function st(t) {
if ('variable'==t) return L.marked='property', N()
} function at(t, e) {
if ('async'==t) return L.marked='property', N(at); if ('variable'==t||'keyword'==L.style) {
return (L.marked='property', "get"==e||'set'==e)?N(lt):(u&&L.state.fatArrowAt==L.stream.start&&(r=L.stream.match(/^\s*:\s*/, !1))&&(L.state.fatArrowAt=L.stream.pos+r[0].length), N(ut)); var r
} else {
if ('number'==t||'string'==t) return L.marked=a?'property':L.style+' property', N(ut); if ('jsonld-keyword'==t) return N(ut); if (u&&B(e)) return L.marked='keyword', N(at); if ('['==t) return N(V, dt, z(']'), ut); if ('spread'==t) return N(q, ut); if ('*'==e) return L.marked='keyword', N(at); if (':'==t) return E(ut);}
} function lt(t) {
return "variable"!=t?E(ut):(L.marked='property', N(Ot))
} function ut(t) {
return ":"==t?N(q):'('==t?E(Ot):void 0
} function ct(n, i, o) {
function s(t, e) {
if (o?-1<o.indexOf(t):','==t) {
var r=L.state.lexical; return "call"==r.info&&(r.pos=(r.pos||0)+1), N(function(t, e) {
return t==i||e==i?E():E(n)
}, s);} return t==i||e==i?N():o&&-1<o.indexOf(';')?E(n):N(z(i))
} return function(t, e) {
return t==i||e==i?N():E(n, s)
};} function ht(t, e, r) {
for (let n=3; n<arguments.length; n++)L.cc.push(arguments[n]); return N(j(e, r), ct(t, e), F);} function ft(t) {
return "}"==t?N():E(W, ft);} function dt(t, e) {
if (u) {
if (':'==t) return N(vt); if ('?'==e) return N(dt)
}
} function pt(t, e) {
if (u&&(':'==t||'in'==e)) return N(vt)
} function gt(t) {
if (u&&':'==t) return L.stream.match(/^\s*\w+\s+is\b/, !1)?N(V, mt, vt):N(vt)
} function mt(t, e) {
if ('is'==e) return L.marked='keyword', N()
} function vt(t, e) {
return "keyof"==e||'typeof'==e||'infer'==e?(L.marked='keyword', N('typeof'==e?q:vt)):'variable'==t||'void'==e?(L.marked='type', N(wt)):'|'==e||'&'==e?N(vt):'string'==t||'number'==t||'atom'==t?N(wt):'['==t?N(j(']'), ct(vt, "]", ","), F, wt):'{'==t?N(j('}'), ct(xt, "}", ",;"), F, wt):'('==t?N(ct(bt, ")"), yt, wt):'<'==t?N(ct(vt, ">"), vt):void 0;} function yt(t) {
if ('=>'==t) return N(vt);} function xt(t, e) {
return "variable"==t||'keyword'==L.style?(L.marked='property', N(xt)):'?'==e||'number'==t||'string'==t?N(xt):':'==t?N(vt):'['==t?N(z('variable'), pt, z(']'), xt):'('==t?E(Ht, xt):void 0
} function bt(t, e) {
return "variable"==t&&L.stream.match(/^\s*[?:]/, !1)||'?'==e?N(bt):':'==t?N(vt):'spread'==t?N(bt):E(vt)
} function wt(t, e) {
return "<"==e?N(j('>'), ct(vt, ">"), F, wt):'|'==e||'.'==t||'&'==e?N(vt):'['==t?N(vt, z(']'), wt):'extends'==e||'implements'==e?(L.marked='keyword', N(vt)):'?'==e?N(vt, z(':'), vt):void 0;} function St(t, e) {
if ('<'==e) return N(j('>'), ct(vt, ">"), F, wt);} function Ct() {
return E(vt, At)
} function At(t, e) {
if ('='==e) return N(vt)
} function Tt(t, e) {
return "enum"==e?(L.marked='keyword', N(Zt)):E(kt, dt, Lt, Et)
} function kt(t, e) {
return u&&B(e)?(L.marked='keyword', N(kt)):'variable'==t?(I(e), N()):'spread'==t?N(kt):'['==t?ht(Mt, "]"):'{'==t?ht(Rt, "}"):void 0
} function Rt(t, e) {
return "variable"!=t||L.stream.match(/^\s*:/, !1)?('variable'==t&&(L.marked='property'), "spread"==t?N(kt):'}'==t?E():'['==t?N(V, z(']'), z(':'), Rt):N(z(':'), kt, Lt)):(I(e), N(Lt))
} function Mt() {
return E(kt, Lt);} function Lt(t, e) {
if ('='==e) return N(q)
} function Et(t) {
if (','==t) return N(Tt)
} function Nt(t, e) {
if ('keyword b'==t&&'else'==e) return N(j('form', "else"), W, F)
} function Dt(t, e) {
return "await"==e?N(Dt):'('==t?N(j(')'), It, F):void 0;} function It(t) {
return "var"==t?N(Tt, Bt):('variable'==t?N:E)(Bt);} function Bt(t, e) {
return ")"==t?N():';'==t?N(Bt):'in'==e||'of'==e?(L.marked='keyword', N(V, Bt)):E(V, Bt)
} function Ot(t, e) {
return "*"==e?(L.marked='keyword', N(Ot)):'variable'==t?(I(e), N(Ot)):'('==t?N(_, j(')'), ct(_t, ")"), F, gt, W, K):u&&'<'==e?N(j('>'), ct(Ct, ">"), F, Ot):void 0
} function Ht(t, e) {
return "*"==e?(L.marked='keyword', N(Ht)):'variable'==t?(I(e), N(Ht)):'('==t?N(_, j(')'), ct(_t, ")"), F, gt, K):u&&'<'==e?N(j('>'), ct(Ct, ">"), F, Ht):void 0;} function Pt(t, e) {
return "keyword"==t||'variable'==t?(L.marked='type', N(Pt)):'<'==e?N(j('>'), ct(Ct, ">"), F):void 0;} function _t(t, e) {
return "@"==e&&N(V, _t), "spread"==t?N(_t):u&&B(e)?(L.marked='keyword', N(_t)):u&&'this'==t?N(dt, Lt):E(kt, dt, Lt)
} function Ut(t, e) {
return ('variable'==t?Kt:jt)(t, e)
} function Kt(t, e) {
if ('variable'==t) return I(e), N(jt)
} function jt(t, e) {
return "<"==e?N(j('>'), ct(Ct, ">"), F, jt):'extends'==e||'implements'==e||u&&','==t?('implements'==e&&(L.marked='keyword'), N(u?vt:V, jt)):'{'==t?N(j('}'), Ft, F):void 0
} function Ft(t, e) {
return "async"==t||'variable'==t&&('static'==e||'get'==e||'set'==e||u&&B(e))&&L.stream.match(/^\s+[\w$\xa1-\uffff]/, !1)?(L.marked='keyword', N(Ft)):'variable'==t||'keyword'==L.style?(L.marked='property', N(u?zt:Ot, Ft)):'number'==t||'string'==t?N(u?zt:Ot, Ft):'['==t?N(V, dt, z(']'), u?zt:Ot, Ft):'*'==e?(L.marked='keyword', N(Ft)):u&&'('==t?E(Ht, Ft):';'==t||','==t?N(Ft):'}'==t?N():'@'==e?N(V, Ft):void 0
} function zt(t, e) {
if ('?'==e) return N(zt); if (':'==t) return N(vt, Lt); if ('='==e) return N(q); var r=L.state.lexical.prev; return E(r&&'interface'==r.info?Ht:Ot);} function Wt(t, e) {
return "*"==e?(L.marked='keyword', N(Xt, z(';'))):'default'==e?(L.marked='keyword', N(V, z(';'))):'{'==t?N(ct(Jt, "}"), Xt, z(';')):E(W);} function Jt(t, e) {
return "as"==e?(L.marked='keyword', N(z('variable'))):'variable'==t?E(q, Jt):void 0
} function Vt(t) {
return "string"==t?N():'('==t?E(V):E(qt, Gt, Xt)
} function qt(t, e) {
return "{"==t?ht(qt, "}"):('variable'==t&&I(e), "*"==e&&(L.marked='keyword'), N($t))
} function Gt(t) {
if (','==t) return N(qt, Gt)
} function $t(t, e) {
if ('as'==e) return L.marked='keyword', N(qt);} function Xt(t, e) {
if ('from'==e) return L.marked='keyword', N(V);} function Yt(t) {
return "]"==t?N():E(ct(q, "]"))
} function Zt() {
return E(j('form'), kt, z('{'), j('}'), ct(Qt, "}"), F, F)
} function Qt() {
return E(kt, Lt);} function te(t, e, r) {
return e.tokenize==w&&/^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(e.lastType)||'quasi'==e.lastType&&/\{\s*$/.test(t.string.slice(0, t.pos-(r||0)))
} return F.lex=K.lex=!0, { startState: function(t) {
var e={ tokenize: w, lastType: "sof", cc: [], lexical: new R((t||0)-f, 0, "block", !1), localVars: h.localVars, context: h.localVars&&new O(null, null, !1), indented: t||0 }; return h.globalVars&&'object'==typeof h.globalVars&&(e.globalVars=h.globalVars), e;}, token: function(t, e) {
if (t.sol()&&(e.lexical.hasOwnProperty('align')||(e.lexical.align=!1), e.indented=t.indentation(), T(t, e)), e.tokenize!=S&&t.eatSpace()) return null; var r=e.tokenize(t, e); return "comment"==m?r:(e.lastType='operator'!=m||'++'!=v&&'--'!=v?m:'incdec', function(t, e, r, n, i) {
var o=t.cc; for (L.state=t, L.stream=i, L.marked=null, L.cc=o, L.style=e, t.lexical.hasOwnProperty('align')||(t.lexical.align=!0); ;) {
if ((o.length?o.pop():l?V:W)(r, n)) {
for (;o.length&&o[o.length-1].lex;)o.pop()(); return L.marked?L.marked:'variable'==r&&M(t, n)?'variable-2':e
}
}
}(e, r, m, v, t))
}, indent: function(t, e) {
if (t.tokenize==S) return ee.Pass; if (t.tokenize!=w) return 0; var r; var n=e&&e.charAt(0); var i=t.lexical; if (!/^\s*else\b/.test(e)) for (let o=t.cc.length-1; 0<=o; --o) {
var s=t.cc[o]; if (s==F)i=i.prev; else if (s!=Nt) break;} for (;('stat'==i.type||'form'==i.type)&&('}'==n||(r=t.cc[t.cc.length-1])&&(r==Y||r==Z)&&!/^[,\.=+\-*:?[\(]/.test(e));)i=i.prev; d&&')'==i.type&&'stat'==i.prev.type&&(i=i.prev); var a; var l; var u=i.type; var c=n==u; return "vardef"==u?i.indented+('operator'==t.lastType||','==t.lastType?i.info.length+1:0):'form'==u&&'{'==n?i.indented:'form'==u?i.indented+f:'stat'==u?i.indented+(l=e, "operator"==(a=t).lastType||','==a.lastType||y.test(l.charAt(0))||/[,.]/.test(l.charAt(0))?d||f:0):'switch'!=i.info||c||0==h.doubleIndentSwitch?i.align?i.column+(c?0:1):i.indented+(c?0:f):i.indented+(/^(?:case|default)\b/.test(e)?f:2*f)
}, electricInput: /^\s*(?:case .*?:|default:|\{|\})$/, blockCommentStart: l?null:'/*', blockCommentEnd: l?null:'*/', blockCommentContinue: l?null:' * ', lineComment: l?null:'//', fold: "brace", closeBrackets: "()[]{}''\"\"``", helperType: l?'json':'javascript', jsonldMode: a, jsonMode: l, expressionAllowed: te, skipExpression: function(t) {
var e=t.cc[t.cc.length-1]; e!=V&&e!=q||t.cc.pop();} }
}), ee.registerHelper('wordChars', "javascript", /[\w$]/), ee.defineMIME('text/javascript', "javascript"), ee.defineMIME('text/ecmascript', "javascript"), ee.defineMIME('application/javascript', "javascript"), ee.defineMIME('application/x-javascript', "javascript"), ee.defineMIME('application/ecmascript', "javascript"), ee.defineMIME('application/json', { name: "javascript", json: !0 }), ee.defineMIME('application/x-json', { name: "javascript", json: !0 }), ee.defineMIME('application/ld+json', { name: "javascript", jsonld: !0 }), ee.defineMIME('text/typescript', { name: "javascript", typescript: !0 }), ee.defineMIME('application/typescript', { name: "javascript", typescript: !0 })
}), function(t) {
"object"==typeof exports&&'object'==typeof module?t(require('../../lib/codemirror')):'function'==typeof define&&define.amd?define(['../../lib/codemirror'], t):t(CodeMirror)
}(function(C) {
"use strict"; var A={ autoSelfClosers: { area: !0, base: !0, br: !0, col: !0, command: !0, embed: !0, frame: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0, menuitem: !0 }, implicitlyClosed: { dd: !0, li: !0, optgroup: !0, option: !0, p: !0, rp: !0, rt: !0, tbody: !0, td: !0, tfoot: !0, th: !0, tr: !0 }, contextGrabbers: { dd: { dd: !0, dt: !0 }, dt: { dd: !0, dt: !0 }, li: { li: !0 }, option: { option: !0, optgroup: !0 }, optgroup: { optgroup: !0 }, p: { address: !0, article: !0, aside: !0, blockquote: !0, dir: !0, div: !0, dl: !0, fieldset: !0, footer: !0, form: !0, h1: !0, h2: !0, h3: !0, h4: !0, h5: !0, h6: !0, header: !0, hgroup: !0, hr: !0, menu: !0, nav: !0, ol: !0, p: !0, pre: !0, section: !0, table: !0, ul: !0 }, rp: { rp: !0, rt: !0 }, rt: { rp: !0, rt: !0 }, tbody: { tbody: !0, tfoot: !0 }, td: { td: !0, th: !0 }, tfoot: { tbody: !0 }, th: { td: !0, th: !0 }, thead: { tbody: !0, tfoot: !0 }, tr: { tr: !0 } }, doNotIndent: { pre: !0 }, allowUnquoted: !0, allowMissing: !0, caseFold: !0 }; var T={ autoSelfClosers: {}, implicitlyClosed: {}, contextGrabbers: {}, doNotIndent: {}, allowUnquoted: !1, allowMissing: !1, allowMissingTagName: !1, caseFold: !1 }; C.defineMode('xml', function(t, e) {
var s; var o; var a=t.indentUnit; var l={}; var r=e.htmlMode?A:T; for (var n in r)l[n]=r[n]; for (var n in e)l[n]=e[n]; function u(e, r) {
function t(t) {
return (r.tokenize=t)(e, r)
} var n=e.next(); return "<"==n?e.eat('!')?e.eat('[')?e.match('CDATA[')?t(i('atom', "]]>")):null:e.match('--')?t(i('comment', "--\x3e")):e.match('DOCTYPE', !0, !0)?(e.eatWhile(/[\w\._\-]/), t(function n(i) {
return function(t, e) {
for (var r; null!=(r=t.next());) {
if ('<'==r) return e.tokenize=n(i+1), e.tokenize(t, e); if ('>'==r) {
if (1!=i) return e.tokenize=n(i-1), e.tokenize(t, e); e.tokenize=u; break;}
} return "meta"
};}(1))):null:e.eat('?')?(e.eatWhile(/[\w\._\-]/), r.tokenize=i('meta', "?>"), "meta"):(s=e.eat('/')?'closeTag':'openTag', r.tokenize=c, "tag bracket"):'&'!=n?(e.eatWhile(/[^&<]/), null):(e.eat('#')?e.eat('x')?e.eatWhile(/[a-fA-F\d]/)&&e.eat(';'):e.eatWhile(/[\d]/)&&e.eat(';'):e.eatWhile(/[\w\.\-:]/)&&e.eat(';'))?'atom':'error'} function c(t, e) {
var r=t.next(); if ('>'==r||'/'==r&&t.eat('>')) return e.tokenize=u, s='>'==r?'endTag':'selfcloseTag', "tag bracket"; if ('='==r) return s='equals', null; if ('<'!=r) return /[\'\"]/.test(r)?(e.tokenize=(n=r, o.isInAttribute=!0, o), e.stringStartCol=t.column(), e.tokenize(t, e)):(t.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/), "word"); e.tokenize=u, e.state=p, e.tagName=e.tagStart=null; var n; var i=e.tokenize(t, e); return i?i+' tag error':'tag error'; function o(t, e) {
for (;!t.eol();) if (t.next()==n) {
e.tokenize=c; break;} return "string";}
} function i(r, n) {
return function(t, e) {
for (;!t.eol();) {
if (t.match(n)) {
e.tokenize=u; break;}t.next()
} return r
};} function h(t, e, r) {
this.prev=t.context, this.tagName=e, this.indent=t.indented, this.startOfLine=r, (l.doNotIndent.hasOwnProperty(e)||t.context&&t.context.noIndent)&&(this.noIndent=!0)
} function f(t) {
t.context&&(t.context=t.context.prev);} function d(t, e) {
for (var r; ;) {
if (!t.context) return; if (r=t.context.tagName, !l.contextGrabbers.hasOwnProperty(r)||!l.contextGrabbers[r].hasOwnProperty(e)) return; f(t);}
} function p(t, e, r) {
return "openTag"==t?(r.tagStart=e.column(), g):'closeTag'==t?m:p
} function g(t, e, r) {
return "word"==t?(r.tagName=e.current(), o='tag', x):l.allowMissingTagName&&'endTag'==t?(o='tag bracket', x(t, e, r)):(o='error', g)
} function m(t, e, r) {
if ('word'!=t) return l.allowMissingTagName&&'endTag'==t?(o='tag bracket', v(t, e, r)):(o='error', y); var n=e.current(); return r.context&&r.context.tagName!=n&&l.implicitlyClosed.hasOwnProperty(r.context.tagName)&&f(r), r.context&&r.context.tagName==n||!1===l.matchClosing?(o='tag', v):(o='tag error', y);} function v(t, e, r) {
return "endTag"!=t?(o='error', v):(f(r), p)
} function y(t, e, r) {
return o='error', v(t, 0, r);} function x(t, e, r) {
if ('word'==t) return o='attribute', b; if ('endTag'!=t&&'selfcloseTag'!=t) return o='error', x; var n=r.tagName; var i=r.tagStart; return r.tagName=r.tagStart=null, "selfcloseTag"==t||l.autoSelfClosers.hasOwnProperty(n)?d(r, n):(d(r, n), r.context=new h(r, n, i==r.indented)), p;} function b(t, e, r) {
return "equals"==t?w:(l.allowMissing||(o='error'), x(t, 0, r));} function w(t, e, r) {
return "string"==t?S:'word'==t&&l.allowUnquoted?(o='string', x):(o='error', x(t, 0, r));} function S(t, e, r) {
return "string"==t?S:x(t, 0, r);} return u.isInText=!0, { startState: function(t) {
var e={ tokenize: u, state: p, indented: t||0, tagName: null, tagStart: null, context: null }; return null!=t&&(e.baseIndent=t), e
}, token: function(t, e) {
if (!e.tagName&&t.sol()&&(e.indented=t.indentation()), t.eatSpace()) return null; s=null; var r=e.tokenize(t, e); return (r||s)&&'comment'!=r&&(o=null, e.state=e.state(s||r, t, e), o&&(r='error'==o?r+' error':o)), r;}, indent: function(t, e, r) {
var n=t.context; if (t.tokenize.isInAttribute) return t.tagStart==t.indented?t.stringStartCol+1:t.indented+a; if (n&&n.noIndent) return C.Pass; if (t.tokenize!=c&&t.tokenize!=u) return r?r.match(/^(\s*)/)[0].length:0; if (t.tagName) return !1!==l.multilineTagIndentPastTag?t.tagStart+t.tagName.length+2:t.tagStart+a*(l.multilineTagIndentFactor||1); if (l.alignCDATA&&/<!\[CDATA\[/.test(e)) return 0; var i=e&&/^<(\/)?([\w_:\.-]*)/.exec(e); if (i&&i[1]) for (;n;) {
if (n.tagName==i[2]) {
n=n.prev; break
} if (!l.implicitlyClosed.hasOwnProperty(n.tagName)) break; n=n.prev;} else if (i) for (;n;) {
var o=l.contextGrabbers[n.tagName]; if (!o||!o.hasOwnProperty(i[2])) break; n=n.prev;} for (;n&&n.prev&&!n.startOfLine;)n=n.prev; return n?n.indent+a:t.baseIndent||0;}, electricInput: /<\/[\s\w:]+>$/, blockCommentStart: "\x3c!--", blockCommentEnd: "--\x3e", configuration: l.htmlMode?'html':'xml', helperType: l.htmlMode?'html':'xml', skipAttribute: function(t) {
t.state==w&&(t.state=x)
}, xmlCurrentTag: function(t) {
return t.tagName?{ name: t.tagName, close: "closeTag"==t.type }:null;}, xmlCurrentContext: function(t) {
for (var e=[], r=t.context; r; r=r.prev)r.tagName&&e.push(r.tagName); return e.reverse()
} };}), C.defineMIME('text/xml', "xml"), C.defineMIME('application/xml', "xml"), C.mimeModes.hasOwnProperty('text/html')||C.defineMIME('text/html', { name: "xml", htmlMode: !0 })
}), function(t) {
"object"==typeof exports&&'object'==typeof module?t(require('../../lib/codemirror')):'function'==typeof define&&define.amd?define(['../../lib/codemirror'], t):t(CodeMirror);}(function(t) {
"use strict"; t.defineMode('yaml', function() {
var i=new RegExp('\\b(('+['true', "false", "on", "off", "yes", "no"].join(')|(')+'))$', "i"); return { token: function(t, e) {
var r=t.peek(); var n=e.escaped; if (e.escaped=!1, "#"==r&&(0==t.pos||/\s/.test(t.string.charAt(t.pos-1)))) return t.skipToEnd(), "comment"; if (t.match(/^('([^']|\\.)*'?|"([^"]|\\.)*"?)/)) return "string"; if (e.literal&&t.indentation()>e.keyCol) return t.skipToEnd(), "string"; if (e.literal&&(e.literal=!1), t.sol()) {
if (e.keyCol=0, e.pair=!1, e.pairStart=!1, t.match(/---/)) return "def"; if (t.match(/\.\.\./)) return "def"; if (t.match(/\s*-\s+/)) return "meta"
} if (t.match(/^(\{|\}|\[|\])/)) return "{"==r?e.inlinePairs++:'}'==r?e.inlinePairs--:'['==r?e.inlineList++:e.inlineList--, "meta"; if (0<e.inlineList&&!n&&','==r) return t.next(), "meta"; if (0<e.inlinePairs&&!n&&','==r) return e.keyCol=0, e.pair=!1, e.pairStart=!1, t.next(), "meta"; if (e.pairStart) {
if (t.match(/^\s*(\||\>)\s*/)) return e.literal=!0, "meta"; if (t.match(/^\s*(\&|\*)[a-z0-9\._-]+\b/i)) return "variable-2"; if (0==e.inlinePairs&&t.match(/^\s*-?[0-9\.\,]+\s?$/)) return "number"; if (0<e.inlinePairs&&t.match(/^\s*-?[0-9\.\,]+\s?(?=(,|}))/)) return "number"; if (t.match(i)) return "keyword";} return !e.pair&&t.match(/^\s*(?:[,\[\]{}&*!|>'"%@`][^\s'":]|[^,\[\]{}#&*!|>'"%@`])[^#]*?(?=\s*:($|\s))/)?(e.pair=!0, e.keyCol=t.indentation(), "atom"):e.pair&&t.match(/^:\s*/)?(e.pairStart=!0, "meta"):(e.pairStart=!1, e.escaped='\\'==r, t.next(), null);}, startState: function() {
return { pair: !1, pairStart: !1, keyCol: 0, inlinePairs: 0, inlineList: 0, literal: !1, escaped: !1 };}, lineComment: "#", fold: "indent" }
}), t.defineMIME('text/x-yaml', "yaml"), t.defineMIME('text/yaml', "yaml")
}), function(t) {
"object"==typeof exports&&'object'==typeof module?t(require('../../lib/codemirror'), require('../xml/xml'), require('../javascript/javascript'), require('../css/css')):'function'==typeof define&&define.amd?define(['../../lib/codemirror', "../xml/xml", "../javascript/javascript", "../css/css"], t):t(CodeMirror)
}(function(p) {
"use strict"; var i={ script: [['lang', /(javascript|babel)/i, "javascript"], ['type', /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i, "javascript"], ['type', /./, "text/plain"], [null, null, "javascript"]], style: [['lang', /^css$/i, "css"], ['type', /^(text\/)?(x-)?(stylesheet|css)$/i, "css"], ['type', /./, "text/plain"], [null, null, "css"]] }; var o={}; function g(t, e) {
var r; var n=t.match(o[r=e]||(o[r]=new RegExp('\\s+'+r+'\\s*=\\s*(\'|")?([^\'"]+)(\'|")?\\s*'))); return n?/^\s*(.*?)\s*$/.exec(n[2])[1]:''} function m(t, e) {
return new RegExp((e?'^':'')+'</s*'+t+'s*>', "i");} function s(t, e) {
for (let r in t) for (let n=e[r]||(e[r]=[]), i=t[r], o=i.length-1; 0<=o; o--)n.unshift(i[o]);}p.defineMode('htmlmixed', function(c, t) {
var h=p.getMode(c, { name: "xml", htmlMode: !0, multilineTagIndentFactor: t.multilineTagIndentFactor, multilineTagIndentPastTag: t.multilineTagIndentPastTag }); var f={}; var e=t&&t.tags; var r=t&&t.scriptTypes; if (s(i, f), e&&s(e, f), r) for (let n=r.length-1; 0<=n; n--)f.script.unshift(['type', r[n].matches, r[n].mode]); function d(t, e) {
var r; var n=h.token(t,e.htmlState); var i=/\btag\b/.test(n); if (i&&!/[<>\s\/]/.test(t.current())&&(r=e.htmlState.tagName&&e.htmlState.tagName.toLowerCase())&&f.hasOwnProperty(r))e.inTag=r+' '; else if (e.inTag&&i&&/>$/.test(t.current())) {
var o=/^([\S]+) (.*)/.exec(e.inTag); e.inTag=null; var s='>'==t.current()&&function(t, e) {
for (let r=0; r<t.length; r++) {
var n=t[r]; if (!n[0]||n[1].test(g(e, n[0]))) return n[2]
}
}(f[o[1]], o[2]); var a=p.getMode(c,s); var l=m(o[1],!0); var u=m(o[1], !1); e.token=function(t, e) {
return t.match(l, !1)?(e.token=d, e.localState=e.localMode=null, null):(r=t, n=u, i=e.localMode.token(t, e.localState), o=r.current(), -1<(s=o.search(n))?r.backUp(o.length-s):o.match(/<\/?$/)&&(r.backUp(o.length), r.match(n, !1)||r.match(o)), i); var r; var n; var i; var o; var s
}, e.localMode=a, e.localState=p.startState(a, h.indent(e.htmlState, "", ""));} else e.inTag&&(e.inTag+=t.current(), t.eol()&&(e.inTag+=' ')); return n;} return { startState: function() {
return { token: d, inTag: null, localMode: null, localState: null, htmlState: p.startState(h) };}, copyState: function(t) {
var e; return t.localState&&(e=p.copyState(t.localMode, t.localState)), { token: t.token, inTag: t.inTag, localMode: t.localMode, localState: e, htmlState: p.copyState(h, t.htmlState) }
}, token: function(t, e) {
return e.token(t, e)
}, indent: function(t, e, r) {
return !t.localMode||/^\s*<\//.test(e)?h.indent(t.htmlState, e, r):t.localMode.indent?t.localMode.indent(t.localState, e, r):p.Pass;}, innerMode: function(t) {
return { state: t.localState||t.htmlState, mode: t.localMode||h };} };}, "xml", "javascript", "css"), p.defineMIME('text/html', "htmlmixed");}), function(t) {
"object"==typeof exports&&'object'==typeof module?t(require('../../lib/codemirror')):'function'==typeof define&&define.amd?define(['../../lib/codemirror'], t):t(CodeMirror);}(function(h) {
"use strict"; var p='CodeMirror-lint-markers'; function c(t) {
t.parentNode&&t.parentNode.removeChild(t)
} function f(t, e, r) {
var n; var i; var o; var s=(n=t, i=e, (o=document.createElement('div')).className='CodeMirror-lint-tooltip', o.appendChild(i.cloneNode(!0)), document.body.appendChild(o), h.on(document, "mousemove", a), a(n), null!=o.style.opacity&&(o.style.opacity=1), o); function a(t) {
if (!o.parentNode) return h.off(document, "mousemove", a); o.style.top=Math.max(0, t.clientY-o.offsetHeight-5)+'px', o.style.left=t.clientX+5+'px'} function l() {
var t; h.off(r, "mouseout", l), s&&((t=s).parentNode&&(null==t.style.opacity&&c(t), t.style.opacity=0, setTimeout(function() {
c(t)
}, 600)), s=null);} var u=setInterval(function() {
if (s) for (let t=r; ;t=t.parentNode) {
if (t&&11==t.nodeType&&(t=t.host), t==document.body) return; if (!t) {
l(); break;}
} if (!s) return clearInterval(u)
}, 400); h.on(r, "mouseout", l)
} function l(e, t, r) {
this.marked=[], this.options=t, this.timeout=null, this.hasGutter=r, this.onMouseOver=function(t) {
!function(t, e) {
var r=e.target||e.srcElement; if (!/\bCodeMirror-lint-mark-/.test(r.className)) return; for (var n=r.getBoundingClientRect(), i=(n.left+n.right)/2, o=(n.top+n.bottom)/2, s=t.findMarksAt(t.coordsChar({ left: i, top: o }, "client")), a=[], l=0; l<s.length; ++l) {
var u=s[l].__annotation; u&&a.push(u);}a.length&&function(t, e) {
for (var r=e.target||e.srcElement, n=document.createDocumentFragment(), i=0; i<t.length; i++) {
var o=t[i]; n.appendChild(v(o));}f(e, n, r);}(a, e)
}(e, t);}, this.waitingFor=0;} function g(t) {
var e=t.state.lint; e.hasGutter&&t.clearGutter(p); for (let r=0; r<e.marked.length; ++r)e.marked[r].clear(); e.marked.length=0
} function m(e, t, r, n) {
var i=document.createElement('div'); var o=i; return i.className='CodeMirror-lint-marker-'+t, r&&((o=i.appendChild(document.createElement('div'))).className='CodeMirror-lint-marker-multiple'), 0!=n&&h.on(o, "mouseover", function(t) {
f(t, e, o)
}), i;} function v(t) {
var e=t.severity; e=e||'error'; var r=document.createElement('div'); return r.className='CodeMirror-lint-message-'+e, void 0!==t.messageHTML?r.innerHTML=t.messageHTML:r.appendChild(document.createTextNode(t.message)), r
} function u(e) {
var r; var t; var n; var i; var o; var s=e.state.lint.options; var a=s.options||s; var l=s.getAnnotations||e.getHelper(h.Pos(0, 0), "lint"); if (l) if (s.async||l.async)t=l, n=a, i=(r=e).state.lint, o=++i.waitingFor, r.on('change', c), t(r.getValue(), function(t, e) {
r.off('change', c), i.waitingFor==o&&(e&&t instanceof h&&(t=e), r.operation(function() {
d(r, t);}))
}, n, r); else {
var u=l(e.getValue(), a, e); if (!u) return; u.then?u.then(function(t) {
e.operation(function() {
d(e, t);})
}):e.operation(function() {
d(e, u)
})
} function c() {
o=-1, r.off('change', c)
}
} function d(t, e) {
g(t); for (var r, n, i=t.state.lint, o=i.options, s=function(t) {
for (var e=[], r=0; r<t.length; ++r) {
var n=t[r]; var i=n.from.line; (e[i]||(e[i]=[])).push(n);} return e
}(e), a=0; a<s.length; ++a) {
var l=s[a]; if (l) {
for (var u=null, c=i.hasGutter&&document.createDocumentFragment(), h=0; h<l.length; ++h) {
var f=l[h]; var d=f.severity; n=d=d||'error', u='error'==(r=u)?r:n, o.formatAnnotation&&(f=o.formatAnnotation(f)), i.hasGutter&&c.appendChild(v(f)), f.to&&i.marked.push(t.markText(f.from, f.to, { className: "CodeMirror-lint-mark-"+d, __annotation: f }))
}i.hasGutter&&t.setGutterMarker(a, p, m(c, u, 1<l.length, i.options.tooltips));}
}o.onUpdateLinting&&o.onUpdateLinting(e, s, t)
} function y(t) {
var e=t.state.lint; e&&(clearTimeout(e.timeout), e.timeout=setTimeout(function() {
u(t)
}, e.options.delay||500))
}h.defineOption('lint', !1, function(t, e, r) {
if (r&&r!=h.Init&&(g(t), !1!==t.state.lint.options.lintOnChange&&t.off('change', y), h.off(t.getWrapperElement(), "mouseover", t.state.lint.onMouseOver), clearTimeout(t.state.lint.timeout), delete t.state.lint), e) {
for (var n=t.getOption('gutters'), i=!1, o=0; o<n.length; ++o)n[o]==p&&(i=!0); var s=t.state.lint=new l(t, (a=e)instanceof Function?{ getAnnotations: a }:(a&&!0!==a||(a={}), a), i); !1!==s.options.lintOnChange&&t.on('change', y), 0!=s.options.tooltips&&'gutter'!=s.options.tooltips&&h.on(t.getWrapperElement(), "mouseover", s.onMouseOver), u(t);} var a
}), h.defineExtension('performLint', function() {
this.state.lint&&u(this)
})
}), function(t) {
"object"==typeof exports&&'object'==typeof module?t(require('../../lib/codemirror')):'function'==typeof define&&define.amd?define(['../../lib/codemirror'], t):t(CodeMirror);}(function(i) {
"use strict"; i.registerHelper('lint', "json", function(t) {
var n=[]; if (!window.jsonlint) return window.console&&window.console.error('Error: window.jsonlint not defined, CodeMirror JSON linting cannot run.'), n; var e=window.jsonlint.parser||window.jsonlint; e.parseError=function(t, e) {
var r=e.loc; n.push({ from: i.Pos(r.first_line-1, r.first_column), to: i.Pos(r.last_line-1, r.last_column), message: t });}; try {
e.parse(t)
} catch (t) {} return n
})
});