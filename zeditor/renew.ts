import { MdRender } from "../mdrender/index";
import hljs from "highlightjs";
import "../assets/css/vs.css"
import { DOMUtil } from "../utils/index";

// insert new line after node
export const insertNewLine = function (node: HTMLElement, mdtext: string, position: 'afterend' | 'beforebegin' = 'afterend'): HTMLElement {
	let node1 = MdRender.renderLine(mdtext)
	if (node.tagName == 'LI') {
		let line = DOMUtil.createDOM('li','md-block')
		line.appendChild(node1)
		node.insertAdjacentElement(position, line)
		return line
	}
	if (node.tagName == 'PRE') {
		if (node.parentElement.tagName == 'PRE')
			node1 = DOMUtil.createDOM('PRE', 'md-line', hljs.highlightAuto(mdtext).value)
		node.insertAdjacentElement(position, node1)
		return node1
	}
	node.insertAdjacentElement(position, node1)
	return node1
}
// 将当前行提升一个等级
export function promoteLine(node: HTMLElement):HTMLElement {
	let parentElement = node.parentElement
	if (parentElement.classList.contains('md-root')) return
	if(parentElement.tagName=='TH'||parentElement.tagName=='TD'){
		let mdtext = MdRender.toMd(node)
		if(parentElement.childElementCount>=1)
			parentElement.removeChild(node)
		else	
			node.outerHTML = `<p class="md-line"></p>`
		return insertNewLine(parentElement.parentElement.parentElement, mdtext)
	}
	parentElement.removeChild(node)
	let mdtext = MdRender.toMd(node)
	if(parentElement.tagName=='LI'&&!parentElement.hasChildNodes()){
		node = parentElement
		parentElement = parentElement.parentElement
		parentElement.removeChild(node)
	}
	return insertNewLine(parentElement, mdtext)
}

export const renewLine = function (node: HTMLElement, offset: number = -1): [HTMLElement, boolean] {
	let mdtext = MdRender.toMd(node);
	if (offset != -1) mdtext = mdtext.substring(0, offset)
	if (offset != -1) {
		if (mdtext[0] == '|' || mdtext[mdtext.length - 1] == '|') {
			var table = document.createElement('table');
			let prev: number = 1;
			let cur: number = 1;
			let col = 0;
			var tr = document.createElement('tr');
			while (cur < mdtext.length) {
				while (mdtext.charAt(cur) != '|')
					++cur;
				if (mdtext.charAt(cur - 1) != '\\') {
					let item = DOMUtil.createDOM('th','md-block')
					++col;
					item.append(MdRender.renderLine(mdtext.slice(prev, cur)));
					tr.appendChild(item);
					prev = cur + 1;
				}
				++cur;
			}
			table.appendChild(tr);
			tr = document.createElement('tr');
			while (col > 0) {
				tr.appendChild(DOMUtil.createDOM('td', 'md-block', `<p class='md-line'></p>`));
				--col;
			}
			table.appendChild(tr);
			return [table, false];
		}
		else if (mdtext.slice(0, 3) == '```') {
			var code = DOMUtil.createDOM('pre', 'md-block');
			code.setAttribute('data-lang',mdtext.slice(3))
			code.append(DOMUtil.createDOM('pre', 'md-line'))
			return [code, false];
		}
		let ch = mdtext.charAt(0)
		if (ch == '*' || ch == '-') {
			let i = 1;
			while (mdtext.charAt(i) == ch)
				++i;
			if (i == mdtext.length && i >= 3)
				return [document.createElement('hr'), true]
		}
	}
	if (node.tagName == 'PRE') {
		var lang = node.parentElement.getAttribute('data-lang');
		let pre = DOMUtil.createDOM('pre', 'md-line',
			hljs.highlightAuto(mdtext,lang? [lang]:undefined).value)
		return [pre, true]
	}
	return [MdRender.renderLine(mdtext), true];
}


