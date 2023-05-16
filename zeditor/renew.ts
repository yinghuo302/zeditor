import { MdRender } from "../mdrender/index";
import hljs from "highlightjs";
import "../assets/css/vs.css"
import { DOMUtil } from "../utils/index";


export const insertNewLine = function(node:HTMLElement){
	
}


export const renewLineWithEnter = function(mdtext:string):HTMLElement{
	if(mdtext[0]=='|'||mdtext[mdtext.length-1]=='|'){
		var table = document.createElement('table');
		let prev:number = 1;
		let cur:number = 1;
		let col = 0;
		var tr = document.createElement('tr');
		while(cur<mdtext.length){
			while(mdtext.charAt(cur)!='|')
				++cur;
			if(mdtext.charAt(cur-1)!='\\'){
				let item = document.createElement('th');
				++col;
				item.append(MdRender.renderLine(mdtext.slice(prev,cur)));
				tr.appendChild(item);
				prev = cur+1;
			}
			++cur;
		}
		table.appendChild(tr);
		tr = document.createElement('tr');
		while(col>0){
			tr.appendChild(document.createElement('td'));
			--col;
		}
		table.appendChild(tr);
		return table;
	}
	else if(mdtext.slice(0,3)=='```'){
		var code = DOMUtil.createDOM('pre',mdtext.slice(3),'');
		code.append(DOMUtil.createDOM('pre','md-line',''))
		return code;
	}
	else
		return MdRender.renderLine(mdtext);
}


export const renewLine = function(node:HTMLElement){
	let tagName = node.tagName
	if(tagName=='PRE'){
		var lang = node.parentElement.className;
		let pre = DOMUtil.createDOM('pre','md-line')
		if(lang=='')
			pre.innerHTML = hljs.highlightAuto(node.innerText).value;
		else
			pre.innerHTML = hljs.highlightAuto(node.innerText,[lang]).value;
		return pre
	}
	const mdtext = MdRender.toMd(node);
	return MdRender.renderLine(mdtext);
}
