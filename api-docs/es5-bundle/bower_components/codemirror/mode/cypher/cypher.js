(function(mod){if("object"==("undefined"===typeof exports?"undefined":babelHelpers.typeof(exports))&&"object"==("undefined"===typeof module?"undefined":babelHelpers.typeof(module)))mod(require("../../lib/codemirror"));else if("function"==typeof define&&define.amd)define(["../../lib/codemirror"],mod);else mod(CodeMirror)})(function(CodeMirror){"use strict";var wordRegexp=function wordRegexp(words){return new RegExp("^(?:"+words.join("|")+")$","i")};CodeMirror.defineMode("cypher",function(config){var tokenBase=function tokenBase(stream){var ch=stream.next();if("\""===ch){stream.match(/.*?"/);return"string"}if("'"===ch){stream.match(/.*?'/);return"string"}if(/[{}\(\),\.;\[\]]/.test(ch)){curPunc=ch;return"node"}else if("/"===ch&&stream.eat("/")){stream.skipToEnd();return"comment"}else if(operatorChars.test(ch)){stream.eatWhile(operatorChars);return null}else{stream.eatWhile(/[_\w\d]/);if(stream.eat(":")){stream.eatWhile(/[\w\d_\-]/);return"atom"}var word=stream.current();if(funcs.test(word))return"builtin";if(preds.test(word))return"def";if(keywords.test(word))return"keyword";return"variable"}},pushContext=function pushContext(state,type,col){return state.context={prev:state.context,indent:state.indent,col:col,type:type}},popContext=function popContext(state){state.indent=state.context.indent;return state.context=state.context.prev},indentUnit=config.indentUnit,curPunc,funcs=wordRegexp(["abs","acos","allShortestPaths","asin","atan","atan2","avg","ceil","coalesce","collect","cos","cot","count","degrees","e","endnode","exp","extract","filter","floor","haversin","head","id","keys","labels","last","left","length","log","log10","lower","ltrim","max","min","node","nodes","percentileCont","percentileDisc","pi","radians","rand","range","reduce","rel","relationship","relationships","replace","reverse","right","round","rtrim","shortestPath","sign","sin","size","split","sqrt","startnode","stdev","stdevp","str","substring","sum","tail","tan","timestamp","toFloat","toInt","toString","trim","type","upper"]),preds=wordRegexp(["all","and","any","contains","exists","has","in","none","not","or","single","xor"]),keywords=wordRegexp(["as","asc","ascending","assert","by","case","commit","constraint","create","csv","cypher","delete","desc","descending","detach","distinct","drop","else","end","ends","explain","false","fieldterminator","foreach","from","headers","in","index","is","join","limit","load","match","merge","null","on","optional","order","periodic","profile","remove","return","scan","set","skip","start","starts","then","true","union","unique","unwind","using","when","where","with","call","yield"]),operatorChars=/[*+\-<>=&|~%^]/;return{startState:function startState(){return{tokenize:tokenBase,context:null,indent:0,col:0}},token:function token(stream,state){if(stream.sol()){if(state.context&&null==state.context.align){state.context.align=!1}state.indent=stream.indentation()}if(stream.eatSpace()){return null}var style=state.tokenize(stream,state);if("comment"!==style&&state.context&&null==state.context.align&&"pattern"!==state.context.type){state.context.align=!0}if("("===curPunc){pushContext(state,")",stream.column())}else if("["===curPunc){pushContext(state,"]",stream.column())}else if("{"===curPunc){pushContext(state,"}",stream.column())}else if(/[\]\}\)]/.test(curPunc)){while(state.context&&"pattern"===state.context.type){popContext(state)}if(state.context&&curPunc===state.context.type){popContext(state)}}else if("."===curPunc&&state.context&&"pattern"===state.context.type){popContext(state)}else if(/atom|string|variable/.test(style)&&state.context){if(/[\}\]]/.test(state.context.type)){pushContext(state,"pattern",stream.column())}else if("pattern"===state.context.type&&!state.context.align){state.context.align=!0;state.context.col=stream.column()}}return style},indent:function indent(state,textAfter){var firstChar=textAfter&&textAfter.charAt(0),context=state.context;if(/[\]\}]/.test(firstChar)){while(context&&"pattern"===context.type){context=context.prev}}var closing=context&&firstChar===context.type;if(!context)return 0;if("keywords"===context.type)return CodeMirror.commands.newlineAndIndent;if(context.align)return context.col+(closing?0:1);return context.indent+(closing?0:indentUnit)}}});CodeMirror.modeExtensions.cypher={autoFormatLineBreaks:function autoFormatLineBreaks(text){for(var i,lines,reProcessedPortion,lines=text.split("\n"),reProcessedPortion=/\s+\b(return|where|order by|match|with|skip|limit|create|delete|set)\b\s/g,i=0;i<lines.length;i++){lines[i]=lines[i].replace(reProcessedPortion," \n$1 ").trim()}return lines.join("\n")}};CodeMirror.defineMIME("application/x-cypher-query","cypher")});