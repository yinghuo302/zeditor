import {  EventCenter } from "./event";
import { MdRender } from "../mdrender";
import "../assets/css/md-github.css"
import "../assets/css/katex.min.css"
import "../assets/css/vs.css"
import "../assets/css/md-base.css"
export class ZEditor implements IEditor{
	root_ele:HTMLDivElement;
	container:HTMLDivElement
	old_cursor:ICursor;
	tem_cursor:ICursor;
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
		return("这是一个演示");
	}
	getOutline(): IOutLine[] {
		let headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
		let ret:IOutLine[] = []
 		headings.forEach((heading)=>{
			ret.push({
				level: parseInt(heading.tagName.substring(1)),
				title: MdRender.toMd(heading)
			})
		})
		return ret
	}
	setHeading(level: number) {
		console.log(this.tem_cursor)
		console.log(this.old_cursor)
	}
	setInlineFormat(format:InlineFormat){

	}
	setBlockFormat(format:BlockFormat){

	}
	alterTable(row:number,col:number){

	}
	alignTableItem(align:string){

	}
	
}

export default ZEditor;