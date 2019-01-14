(function(mod){if("object"==typeof exports&&"object"==typeof module)mod(require("../../lib/codemirror"));else if("function"==typeof define&&define.amd)define(["../../lib/codemirror"],mod);else mod(CodeMirror)})(function(CodeMirror){"use strict";CodeMirror.defineMode("yacas",function(_config,_parserConfig){function words(str){for(var obj={},words=str.split(" "),i=0;i<words.length;++i)obj[words[i]]=!0;return obj}var bodiedOps=words("Assert BackQuote D Defun Deriv For ForEach FromFile "+"FromString Function Integrate InverseTaylor Limit "+"LocalSymbols Macro MacroRule MacroRulePattern "+"NIntegrate Rule RulePattern Subst TD TExplicitSum "+"TSum Taylor Taylor1 Taylor2 Taylor3 ToFile "+"ToStdout ToString TraceRule Until While"),pFloatForm="(?:(?:\\.\\d+|\\d+\\.\\d*|\\d+)(?:[eE][+-]?\\d+)?)",pIdentifier="(?:[a-zA-Z\\$'][a-zA-Z0-9\\$']*)",reFloatForm=new RegExp(pFloatForm),reIdentifier=new RegExp(pIdentifier),rePattern=new RegExp(pIdentifier+"?_"+pIdentifier),reFunctionLike=new RegExp(pIdentifier+"\\s*\\(");function tokenBase(stream,state){var ch;ch=stream.next();if("\""===ch){state.tokenize=tokenString;return state.tokenize(stream,state)}if("/"===ch){if(stream.eat("*")){state.tokenize=tokenComment;return state.tokenize(stream,state)}if(stream.eat("/")){stream.skipToEnd();return"comment"}}stream.backUp(1);var m=stream.match(/^(\w+)\s*\(/,!1);if(null!==m&&bodiedOps.hasOwnProperty(m[1]))state.scopes.push("bodied");var scope=currentScope(state);if("bodied"===scope&&"["===ch)state.scopes.pop();if("["===ch||"{"===ch||"("===ch)state.scopes.push(ch);scope=currentScope(state);if("["===scope&&"]"===ch||"{"===scope&&"}"===ch||"("===scope&&")"===ch)state.scopes.pop();if(";"===ch){while("bodied"===scope){state.scopes.pop();scope=currentScope(state)}}if(stream.match(/\d+ *#/,!0,!1)){return"qualifier"}if(stream.match(reFloatForm,!0,!1)){return"number"}if(stream.match(rePattern,!0,!1)){return"variable-3"}if(stream.match(/(?:\[|\]|{|}|\(|\))/,!0,!1)){return"bracket"}if(stream.match(reFunctionLike,!0,!1)){stream.backUp(1);return"variable"}if(stream.match(reIdentifier,!0,!1)){return"variable-2"}if(stream.match(/(?:\\|\+|\-|\*|\/|,|;|\.|:|@|~|=|>|<|&|\||_|`|'|\^|\?|!|%|#)/,!0,!1)){return"operator"}return"error"}function tokenString(stream,state){var next,end=!1,escaped=!1;while(null!=(next=stream.next())){if("\""===next&&!escaped){end=!0;break}escaped=!escaped&&"\\"===next}if(end&&!escaped){state.tokenize=tokenBase}return"string"};function tokenComment(stream,state){var prev,next;while(null!=(next=stream.next())){if("*"===prev&&"/"===next){state.tokenize=tokenBase;break}prev=next}return"comment"}function currentScope(state){var scope=null;if(0<state.scopes.length)scope=state.scopes[state.scopes.length-1];return scope}return{startState:function(){return{tokenize:tokenBase,scopes:[]}},token:function(stream,state){if(stream.eatSpace())return null;return state.tokenize(stream,state)},indent:function(state,textAfter){if(state.tokenize!==tokenBase&&null!==state.tokenize)return CodeMirror.Pass;var delta=0;if("]"===textAfter||"];"===textAfter||"}"===textAfter||"};"===textAfter||");"===textAfter)delta=-1;return(state.scopes.length+delta)*_config.indentUnit},electricChars:"{}[]();",blockCommentStart:"/*",blockCommentEnd:"*/",lineComment:"//"}});CodeMirror.defineMIME("text/x-yacas",{name:"yacas"})});