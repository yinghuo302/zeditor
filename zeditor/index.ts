import { EventCenter } from "./event";
import { MdRender } from "../mdrender";
import "../assets/css/md-github.css"
import "../assets/css/katex.min.css"
import "../assets/css/vs.css"
import "../assets/css/md-base.css"
import { DOMUtil } from "../utils";
import { AlignCtr, updateTable } from "./tablectr";
import {  insertNewLine, promoteLine } from "./renew";
import { focus, getCursor, getOffset, setCursorByOffset } from "./cursor";
export class ZEditor implements IEditor {
	root_ele: HTMLDivElement;
	container: HTMLDivElement
	old_cursor: ICursor;
	tem_cursor: ICursor;
	state: number
	constructor(ele: HTMLDivElement) {
		this.root_ele = ele
		this.root_ele.classList.add('md-root', 'md-block');
		this.root_ele.contentEditable = 'true';
		this.state = 0
		EventCenter.listen(this)
	}
	// 将编辑器的内容设置为mdtext并进行渲染
	setValue = (mdtext: string) => {
		this.root_ele.innerHTML = ''
		this.root_ele.append(...MdRender.render(mdtext));
	}
	getRoot(): HTMLDivElement {
		return this.root_ele
	}
	// 获取编辑器中的内容
	getMd = () => {
		return MdRender.toMd(this.root_ele);
	}
	getOutline(): IOutLine[] {
		let headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
		let ret: IOutLine[] = []
		headings.forEach((heading) => {
			ret.push({
				level: parseInt(heading.tagName.substring(1)),
				title: MdRender.toMd(heading as HTMLElement)
			})
		})
		return ret
	}
	setHeading(level: number) {
		this.state = 2
		let range = document.getSelection().getRangeAt(0)
		if (range.startContainer != range.endContainer) return
		let line_node = DOMUtil.getLineNode(range.startContainer)
		if (line_node.nodeType == 3) {
			line_node.nodeValue = '#'.repeat(level) + ' ' + line_node.nodeValue
		}
		else if (line_node.tagName == 'P') {
			let text_node = document.createTextNode('#'.repeat(level) + ' ')
			line_node.prepend(text_node)
		}
	}
	setInlineFormat(format: InlineFormat) {
		this.state = 2
		let range = document.getSelection().getRangeAt(0)
		if (range.startContainer != range.endContainer) return
		if (format == 'img' || format == 'link') {
			if (range.startOffset != range.endOffset) return
			let str = format == 'img' ? '![]()' : '[]()'
			let text_node = document.createTextNode(str)
			range.insertNode(text_node)
			return
		}
		let str = range.startContainer.textContent.
			substring(range.startOffset, range.endOffset);
		let text_node = document.createTextNode(format + str + format);
		range.deleteContents()
		range.insertNode(text_node)
	}
	setBlockFormat(format: BlockFormat) {
		this.state = 2
		let range = document.getSelection().getRangeAt(0)
		if (range.startContainer != range.endContainer) return
		let line_node = DOMUtil.getLineNode(range.startContainer)
		if (format == 'code') {
			let pre = DOMUtil.createDOM('pre', 'md-block', `<pre class="md-line"></pre>`)
			line_node.insertAdjacentElement('afterend', pre)
		} else if (line_node.nodeType == 3 || line_node.tagName == 'P') {
			let str = MdRender.toMd(line_node)
			if (format == 'ol') str = "1. " + str
			if (format == 'ul') str = "+ " + str
			if (format == 'quote') str = "> " + str
			line_node.replaceWith(MdRender.renderLine(str))
		}
	}
	alterTable(range:Range,row: number, col: number) {
		console.log(range)
		if (range.startContainer != range.endContainer) return;
		let table = DOMUtil.closestParents(range.startContainer,
			(node: HTMLElement) => node.tagName == 'TABLE')
		if (table) updateTable(table as HTMLTableElement, row, col)
	}
	createTable(range:Range,row: number, col: number) {
		console.log(range)
		if (range.startContainer != range.endContainer) return;
		let line_node = DOMUtil.getLineNode(range.startContainer)
		let table = document.createElement('table')
		let str = ''
		for (let i = 0; i < row; i++) {
			str += "<tr>"
			for (let j = 0; j < col; j++)
				str += i == 0 ? `<th class="md-block"><p class="md-line"></p></th>` : `<td class="md-block"><p class="md-line"></p></td>`
			str += "</tr>"
		}
		table.innerHTML = str
		line_node.insertAdjacentElement('afterend', table)
	}
	alignTableItem(align: string) {
		let range = document.getSelection().getRangeAt(0)
		let tableCell = DOMUtil.closestParents(range.startContainer,
			(node: HTMLElement) => node.tagName == 'TH' || node.tagName == 'TD')
		if(!tableCell) return
		let tr = tableCell.parentElement
		let idx = 0
		tr.childNodes.forEach((child,i)=>{
			if(child==tableCell) idx = i
		})
		AlignCtr(tr.parentElement as HTMLTableElement,idx,align)
	}
	deleteTable() {
		let range = document.getSelection().getRangeAt(0)
		if (range.startContainer != range.endContainer) return;
		let table = DOMUtil.closestParents(range.startContainer,
			(node: HTMLElement) => node.tagName == 'TABLE')
			document.getSelection().removeAllRanges()
		if (table) table.remove()
	}
	insertNewLineBefore() {
		let range = document.getSelection().getRangeAt(0)
		if (range.startContainer != range.endContainer) return
		let line_node = DOMUtil.getLineNode(range.startContainer)
		insertNewLine(line_node, "", 'beforebegin')
	}
	insertNewLineAfter() {
		let range = document.getSelection().getRangeAt(0)
		if (range.startContainer != range.endContainer) return
		let line_node = DOMUtil.getLineNode(range.startContainer)
		insertNewLine(line_node, "", 'afterend')
	}
	promoteLine() {
		let cursor = getCursor();
		if(!cursor) return 
		let line_node = DOMUtil.getLineNode(cursor.node)
		let offset = getOffset(line_node,cursor)
		line_node =  promoteLine(line_node)
		setCursorByOffset(this,line_node,offset)
		focus(this)
	}
}

export default ZEditor;