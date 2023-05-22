import { MdRender } from "../mdrender/index";
import { cursorCtr, focus, getCursor, getOffset, setCursorByOffset } from "./cursor";
import { renewLine, renewLineWithEnter } from "./renew";
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
	static enterHandler(editor:IEditor,e:KeyboardEvent){
		var cursor = getCursor();
		var line_node = DOMUtil.closestParent(cursor.node,'md-line');
		let tagName = line_node.tagName
		if(tagName=='PRE')
			return ;
		e.preventDefault()
		const mdtext = MdRender.toMd(line_node);
		const offset = getOffset(line_node,cursor)
		let line = renewLineWithEnter(mdtext.substring(0,offset))
		tagName = line.tagName
		if(tagName=='TABLE'){

		}
		// TODO: ```c++<cursor>df
		else if(tagName=='PRE'){
			line_node.replaceWith(line)
			line = line.firstElementChild as HTMLElement
			setCursorByOffset(editor,line,0)
		}else{
			let new_line = MdRender.renderLine(mdtext.substring(offset))
			line_node.insertAdjacentElement('afterend',new_line)
			line_node.replaceWith(line)
			setCursorByOffset(editor,new_line,0)
		}
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
		if(e.inputType==='insertText'&&e.data.length<5){
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