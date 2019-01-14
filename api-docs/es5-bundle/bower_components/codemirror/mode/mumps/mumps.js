(function(mod){if("object"==("undefined"===typeof exports?"undefined":babelHelpers.typeof(exports))&&"object"==("undefined"===typeof module?"undefined":babelHelpers.typeof(module)))mod(require("../../lib/codemirror"));else if("function"==typeof define&&define.amd)define(["../../lib/codemirror"],mod);else mod(CodeMirror)})(function(CodeMirror){"use strict";CodeMirror.defineMode("mumps",function(){function wordRegexp(words){return new RegExp("^(("+words.join(")|(")+"))\\b","i")}var singleOperators=/^[\+\-\*\/&#!_?\\<>=\'\[\]]/,doubleOperators=/^(('=)|(<=)|(>=)|('>)|('<)|([[)|(]])|(^$))/,singleDelimiters=/^[\.,:]/,brackets=/[()]/,identifiers=/^[%A-Za-z][A-Za-z0-9]*/,commandKeywords=["break","close","do","else","for","goto","halt","hang","if","job","kill","lock","merge","new","open","quit","read","set","tcommit","trollback","tstart","use","view","write","xecute","b","c","d","e","f","g","h","i","j","k","l","m","n","o","q","r","s","tc","tro","ts","u","v","w","x"],intrinsicFuncsWords=["\\$ascii","\\$char","\\$data","\\$ecode","\\$estack","\\$etrap","\\$extract","\\$find","\\$fnumber","\\$get","\\$horolog","\\$io","\\$increment","\\$job","\\$justify","\\$length","\\$name","\\$next","\\$order","\\$piece","\\$qlength","\\$qsubscript","\\$query","\\$quit","\\$random","\\$reverse","\\$select","\\$stack","\\$test","\\$text","\\$translate","\\$view","\\$x","\\$y","\\$a","\\$c","\\$d","\\$e","\\$ec","\\$es","\\$et","\\$f","\\$fn","\\$g","\\$h","\\$i","\\$j","\\$l","\\$n","\\$na","\\$o","\\$p","\\$q","\\$ql","\\$qs","\\$r","\\$re","\\$s","\\$st","\\$t","\\$tr","\\$v","\\$z"],intrinsicFuncs=wordRegexp(intrinsicFuncsWords),command=wordRegexp(commandKeywords);function tokenBase(stream,state){if(stream.sol()){state.label=!0;state.commandMode=0}var ch=stream.peek();if(" "==ch||"\t"==ch){state.label=!1;if(0==state.commandMode)state.commandMode=1;else if(0>state.commandMode||2==state.commandMode)state.commandMode=0}else if("."!=ch&&0<state.commandMode){if(":"==ch)state.commandMode=-1;else state.commandMode=2}if("("===ch||"\t"===ch)state.label=!1;if(";"===ch){stream.skipToEnd();return"comment"}if(stream.match(/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?/))return"number";if("\""==ch){if(stream.skipTo("\"")){stream.next();return"string"}else{stream.skipToEnd();return"error"}}if(stream.match(doubleOperators)||stream.match(singleOperators))return"operator";if(stream.match(singleDelimiters))return null;if(brackets.test(ch)){stream.next();return"bracket"}if(0<state.commandMode&&stream.match(command))return"variable-2";if(stream.match(intrinsicFuncs))return"builtin";if(stream.match(identifiers))return"variable";if("$"===ch||"^"===ch){stream.next();return"builtin"}if("@"===ch){stream.next();return"string-2"}if(/[\w%]/.test(ch)){stream.eatWhile(/[\w%]/);return"variable"}stream.next();return"error"}return{startState:function startState(){return{label:!1,commandMode:0}},token:function token(stream,state){var style=tokenBase(stream,state);if(state.label)return"tag";return style}}});CodeMirror.defineMIME("text/x-mumps","mumps")});