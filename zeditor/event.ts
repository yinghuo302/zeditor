import { MdRender } from "../mdrender/index";
import { cursorCtr, focus, getCursor, getOffset, setCursorByOffset } from "./cursor";
import { insertNewLine, renewLine, renewLineWithEnter } from "./renew";
import { DOMUtil } from "../utils/index";
export class EventCenter{
	static keyword = "#*$~`> ![]()+-0123456789 ";
	static listen(editor:IEditor){
		editor.root_ele.addEventListener('input',EventCenter.inputHandler.bind(null,editor));
		editor.root_ele.addEventListener('keyup',EventCenter.keyupHandler.bind(null,editor));
		editor.root_ele.addEventListener('click',EventCenter.clickHandler.bind(null,editor));
		editor.root_ele.addEventListener('keydown',EventCenter.keydownHandler.bind(null,editor));
	}
	static keyupHandler(editor:IEditor,e:KeyboardEvent){
		if(e.key=='ArrowUp'||e.key=='ArrowDown'||e.key=='ArrowLeft')
			cursorCtr(editor);
		if(e.key=='ArrowRight')
			cursorCtr(editor,false);
	}
	static clickHandler(editor:IEditor,e:Event){
		cursorCtr(editor)
	}
	static keydownHandler(editor:IEditor,e:KeyboardEvent){
		if(e.key==='Enter')
			EventCenter.enterHandler(editor,e);
		// if(e.key==='Backspace')
		// 	EventCenter.deleteHandler(editor,e)
	}
	static deleteHandler(editor:IEditor,e:KeyboardEvent){
		e.preventDefault()
		let cursor = getCursor();
		var line_node = DOMUtil.closestParent(cursor.node,'md-line');
		let offset = getOffset(line_node,cursor);
		let str = MdRender.toMd(line_node)
		if(offset!=0) offset -= 1
		let mdtext = `${str.substring(0,offset)}${str.substring(offset+1)}`
		let new_line = MdRender.renderLine(mdtext)
		line_node.replaceWith(new_line)
		setCursorByOffset(editor,new_line,offset)
		focus(editor)
	}

	//  table,ul,ol,blockquote,pre
	static enterHandler(editor:IEditor,e:KeyboardEvent){
		e.preventDefault()
		var cursor = getCursor();
		var line_node = DOMUtil.closestParent(cursor.node,'md-line');
		let tagName = line_node.tagName
		const mdtext = MdRender.toMd(line_node);
		const offset = getOffset(line_node,cursor)
		let line = renewLine(line_node,offset)
		tagName = line.tagName
		line_node.replaceWith(line)
		if(tagName=='TABLE')
			setCursorByOffset(editor,(line as HTMLTableElement).firstChild.firstChild.firstChild as HTMLElement,0)
		else if(tagName=='PRE')
			setCursorByOffset(editor,line.firstChild as HTMLElement,0)
		let new_line = insertNewLine(line,mdtext.substring(offset))
		setCursorByOffset(editor,new_line,0)
		focus(editor)
	}
	// TODO: debounce
	static inputHandler(editor:IEditor,e:InputEvent){
		var cursor = getCursor();
		if(!cursor) return ;
		var line_node = DOMUtil.closestParent(cursor.node,'md-line');
		if(EventCenter.checkInput(e)&&
			!cursor.node.parentElement?.classList.contains('md-show')) 
			return ;
		const offset = getOffset(line_node,cursor)
		let new_node = renewLine(line_node);
		line_node.replaceWith(new_node);
		setCursorByOffset(editor,new_node,offset);
		focus(editor);
	}

	static checkInput(e:InputEvent):boolean{
		if(e.data&&e.data.length<5){
			let str = e.data;
			for(let i=0;i<str.length;++i)
				if(EventCenter.keyword.indexOf(str[i])!=-1)
					return false;
			return true;
		}
		else
			return false;
	}
}