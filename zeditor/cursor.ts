import { DOMUtil } from "../utils/index";
export const getCursor = function():ICursor|null{
	var range = document.getSelection().getRangeAt(0);
	if(range.collapsed)
		return {node:range.endContainer,offset:range.endOffset};
	else
		return null;
}
export const setCursor = function(editor:IEditor,_node,_offset){
	editor.tem_cursor = {node:_node,offset:_offset};
}
export const focus = function(editor:IEditor){
	if(!editor.tem_cursor) return ;
	var range = document.createRange();
	range.setStart(editor.tem_cursor.node,editor.tem_cursor.offset);
	range.collapse(true);
	var selection = document.getSelection() as Selection;
	selection.removeAllRanges();
	selection.addRange(range);
	editor.range = range.cloneRange();
	editor.old_cursor = editor.tem_cursor;
	editor.tem_cursor = null;
}

export const cursorCtr = (editor:IEditor,left:boolean = true)=>{
	editor.range = document.getSelection().getRangeAt(0).cloneRange();
	if(!editor.range.collapsed) return;
	let cursor = {node:editor.range.endContainer,offset: editor.range.endOffset};
	let katex_node = DOMUtil.closestParent(cursor.node,'katex')
	if(katex_node){
		katex_node = katex_node.parentElement
		let hide = katex_node.previousElementSibling
		if(!left) hide = katex_node.nextElementSibling
		let text = hide.firstChild
		setCursor(editor,text,text.nodeValue.length)
		focus(editor)
	}
	if(cursor.node.nodeType!=3) return 
	if(cursor.node!=editor.old_cursor?.node||cursor.offset<=1||cursor.offset==cursor.node.nodeValue.length){
		hideTag(editor)
		showTag(cursor)
	}
}

export const getOffset = function(line_node:HTMLElement,cursor:ICursor) :number{
	let offset = 0
	let flag = false
	const dfs = function(node:Node){
		if(node==cursor.node){
			offset += cursor.offset
			flag = true
		}
		if(flag) return
		let type = DOMUtil.checkNode(node)
		if(type==DOMUtil.TEXT_NODE){
			offset += node.nodeValue.length
			return 
		}
		if(type==DOMUtil.IGNORE_NODE) return 
		node.childNodes.forEach(dfs)
	}
	dfs(line_node)
	return offset
}

export const setCursorByOffset = function(editor:IEditor,line_node:HTMLElement,offset:number){
	if(!line_node.hasChildNodes()){
		line_node.append(document.createElement('br'))
		setCursor(editor,line_node.firstChild,0)
		showTag(editor.tem_cursor)
		return
	}
	let flag = false
	const dfs = (node:Node)=>{
		if(flag) return
		let type = DOMUtil.checkNode(node)
		if(type==DOMUtil.TEXT_NODE){
			if(offset<=node.nodeValue.length){
				setCursor(editor,node,offset)
				flag = true
			}
			offset -= node.nodeValue.length
			return 
		}
		if(type==DOMUtil.IGNORE_NODE) return 
		node.childNodes.forEach(dfs)
	}
	dfs(line_node);
	showTag(editor.tem_cursor)
}

export const showTag = function(cursor:ICursor){
	let nodes = getNodeNeedExpand(cursor)
	nodes.forEach((node)=>{
		var tem = node.firstElementChild;
		if(tem&&tem.className=='md-hide')
			tem.className = 'md-show';
		tem = node.lastElementChild;
		if(tem&&tem.className=='md-hide')
			tem.className = 'md-show';
	})
}

export const hideTag = function (editor:IEditor){
	let arr = editor.root_ele.querySelectorAll('.md-show')
	arr.forEach((node)=>{
		node.classList.remove('md-show')
		node.classList.add('md-hide');
	})
}
function getNodeNeedExpand(cursor:ICursor):HTMLElement[]{
	if(!cursor)
		return [];
	var ele = cursor.node,arr:HTMLElement[] = [],flag:number = 0;
	if(ele.nodeValue&&ele.nodeValue.length==cursor.offset)
		flag = 1;
	if(cursor.offset==0)
		flag = 2;
	while(ele){
		if(flag!=0){
			var tem = ele.nextSibling;
			if(flag==2) tem = ele.previousSibling;
			if (tem) flag = 0;
			if (DOMUtil.checkNode(tem)==DOMUtil.MD_NODE) arr.push(tem as HTMLElement);
		}
		if(DOMUtil.checkNode(ele)==DOMUtil.MD_NODE)
			arr.push(ele as HTMLElement);
		ele = ele.parentElement
	}
	return arr;
}