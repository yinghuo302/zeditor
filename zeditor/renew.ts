import { MdRender } from "../mdrender/index";
import hljs from "highlightjs";
import "../assets/css/vs.css"
import { DOMUtil } from "../utils/index";

// insert new line after node
export const insertNewLine = function(node:HTMLElement,mdtext:string,position:'afterend'|'beforebegin' = 'afterend'):HTMLElement{
	let node1 = MdRender.renderLine(mdtext)
	if(node.tagName=='LI'){
		let line = document.createElement('li')
		line.appendChild(node1)
		node.insertAdjacentElement(position,line)
		return line
	}
	if(node.tagName=='PRE'){
		if(node.parentElement.tagName!='PRE')
			node1 = DOMUtil.createDOM('PRE','', hljs.highlightAuto(mdtext).value)
		node.insertAdjacentElement(position,node1)
		return node1
	}
	node.insertAdjacentElement(position,node1)
	return node1
}
// 将当前行提升一个等级
export function promoteLine(node:HTMLElement){
	let parentElement = node.parentElement
	if(parentElement.classList.contains('md-root')) return 
	parentElement.removeChild(node)
	let mdtext = MdRender.toMd(node)
	insertNewLine(parentElement,mdtext)
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
			tr.appendChild(DOMUtil.createDOM('td','',`<p class='md-line'></p>`));
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


export const renewLine = function(node:HTMLElement,offset:number = -1):HTMLElement{
	if(offset!=-1){
		const mdtext = MdRender.toMd(node);
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
				tr.appendChild(DOMUtil.createDOM('td','',`<p class='md-line'></p>`));
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
	}
	let mdtext = MdRender.toMd(node);
	mdtext = mdtext.substring(offset)
	if(node.tagName=='PRE'){
		var lang = node.parentElement.className;
		let pre = DOMUtil.createDOM('pre','md-line')
		if(lang=='')
			pre.innerHTML = hljs.highlightAuto(mdtext).value;
		else
			pre.innerHTML = hljs.highlightAuto(mdtext,[lang]).value;
		return pre
	}
	return MdRender.renderLine(mdtext);
}
