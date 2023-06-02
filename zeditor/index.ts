import {  EventCenter } from "./event";
import { MdRender } from "../mdrender";
import "../assets/css/md-github.css"
import "../assets/css/katex.min.css"
import "../assets/css/vs.css"
import "../assets/css/md-base.css"
import { DOMUtil } from "../utils";
import { AlignCtr, updateTable } from "./tablectr";
import { insertNewLine, promoteLine } from "./renew";
export class ZEditor implements IEditor{
	root_ele:HTMLDivElement;
	container:HTMLDivElement
	old_cursor:ICursor;
	tem_cursor:ICursor;
	range:Range
	constructor(ele:HTMLDivElement){
		this.root_ele = ele
		this.root_ele.classList.add('md-root');
		this.root_ele.contentEditable = 'true';
		EventCenter.listen(this)
	}
	// 将编辑器的内容设置为mdtext并进行渲染
	setValue = (mdtext:string) =>{
		this.root_ele.innerHTML = ''
		this.root_ele.append(...MdRender.render(mdtext));
	}
	getRoot():HTMLDivElement{
		return this.root_ele
	}
	// 获取编辑器中的内容
	getMd = () =>{
		return MdRender.toMd(this.root_ele);
	}
	getDescription(): string {
		return("这是一个描述");
	}
	getOutline(): IOutLine[] {
		let headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
		let ret:IOutLine[] = []
 		headings.forEach((heading)=>{
			ret.push({
				level: parseInt(heading.tagName.substring(1)),
				title: MdRender.toMd(heading as HTMLElement)
			})
		})
		return ret
	}
	setHeading(level: number) {
		if(this.range.startContainer!=this.range.endContainer) return
		let line_node = DOMUtil.getLineNode(this.range.startContainer)
		if(line_node.tagName=='P'){
			let text_node = document.createTextNode('#'.repeat(level)+' ')
			line_node.prepend(text_node)
			this.tem_cursor.offset += (level+1)
		}
	}
	setInlineFormat(format:InlineFormat){
		if(this.range.startContainer!=this.range.endContainer) return
		if(format=='img'||format=='link'){
			if(this.range.startOffset!=this.range.endOffset) return 
			let str = format=='img'? '![]()' : '[]()'
			let text_node = document.createTextNode(str)
			this.range.insertNode(text_node)
		}
		let str = this.range.startContainer.textContent.
			substring(this.range.startOffset,this.range.endOffset);
		let text_node = document.createTextNode( format + str + format);
		this.range.deleteContents()
		this.range.insertNode(text_node)
	}
	setBlockFormat(format:BlockFormat){
		if(this.range.startContainer!=this.range.endContainer) return
		let line_node = DOMUtil.getLineNode(this.range.startContainer)
		if(format=='code'){
			let pre = DOMUtil.createDOM('pre','','<pre></pre>')
			line_node.insertAdjacentElement('afterend',pre)
		} else if(line_node.tagName=='P'){
			let str = MdRender.toMd(line_node)
			if(format=='ol') str = "1. "+str
			if(format=='ul') str = "+ "+str
			if(format=='quote') str = "> "+str
			line_node.replaceWith(MdRender.renderLine(str))
		}
	}
	alterTable(row:number,col:number){
		if(this.range.startContainer!=this.range.endContainer) return ;
		let table = DOMUtil.closestParents(this.range.startContainer,
			(node:HTMLElement)=>node.tagName=='TABLE')
		if(table) updateTable(table as HTMLTableElement ,row,col)
	}
	createTable(row:number,col:number){
		if(this.range.startContainer!=this.range.endContainer) return ;
		let line_node=DOMUtil.getLineNode(this.range.startContainer)
		let table = document.createElement('table')
		let str = ''
		for(let i=0;i<row;i++){
			str += "<tr>"
			for(let j=0;j<col;j++)
				str += i==0? `<th><p class="md-line"></p></th>` :`<td><p class="md-line"></p></td>`
			str +=  "</tr>"
		}
		table.innerHTML = str
		line_node.insertAdjacentElement('afterend',table)
	}
	alignTableItem(align:string){
		let table = DOMUtil.closestParents(this.range.startContainer,
			(node:HTMLElement)=>node.tagName=='TH'||node.tagName=='TD')
		// AlignCtr(table,0,align)
	}
	deleteTable(){
		if(this.range.startContainer!=this.range.endContainer) return ;
		let table = DOMUtil.closestParents(this.range.startContainer,
			(node:HTMLElement)=>node.tagName=='TABLE')
		if(table) table.remove()
	}
	insertNewLineBefore(){
		if(this.range.startContainer!=this.range.endContainer) return
		let line_node = DOMUtil.getLineNode(this.range.startContainer)
		insertNewLine(line_node,"",'beforebegin')
	}
	insertNewLineAfter(){
		if(this.range.startContainer!=this.range.endContainer) return
		let line_node = DOMUtil.getLineNode(this.range.startContainer)
		insertNewLine(line_node,"",'afterend')
	}
	promoteLine(){
		if(this.range.startContainer!=this.range.endContainer) return
		let line_node = DOMUtil.getLineNode(this.range.startContainer)
		promoteLine(line_node)
	}
}

export default ZEditor;