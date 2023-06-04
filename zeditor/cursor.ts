import { DOMUtil } from "../utils/index";
export const getCursor = function (): ICursor | null {
	var range = document.getSelection().getRangeAt(0);
	if (range.collapsed)
		return { node: range.endContainer, offset: range.endOffset };
	else
		return null;
}
export const setCursor = function (editor: IEditor, _node, _offset) {
	editor.tem_cursor = { node: _node, offset: _offset };
}
export const focus = function (editor: IEditor) {
	if (!editor.tem_cursor) return;
	var range = document.createRange();
	range.setStart(editor.tem_cursor.node, editor.tem_cursor.offset);
	range.collapse(true);
	var selection = document.getSelection() as Selection;
	selection.removeAllRanges();
	selection.addRange(range);
	editor.old_cursor = editor.tem_cursor;
	editor.tem_cursor = null;
}

export const cursorCtr = (editor: IEditor, left: boolean = true) => {
	let cursor = getCursor();
	if (!cursor) return
	let katex_node = DOMUtil.closestParents(cursor.node, (node: HTMLElement) => node.classList.contains('katex'))
	if (katex_node) {
		katex_node = katex_node.parentElement
		let hide = katex_node.previousElementSibling
		if (!left) hide = katex_node.nextElementSibling
		let text = hide.firstChild
		setCursor(editor, text, text.nodeValue.length)
		focus(editor)
	}
	if (cursor.node != editor.old_cursor?.node ||
		cursor.offset <= 1 || cursor.offset == cursor.node.nodeValue.length) {
		hideTag(editor)
		showTag(cursor)
	}
}

export const getOffset = function (line_node: HTMLElement, cursor: ICursor): number {
	let offset = 0
	let flag = false
	const dfs = function (node: Node) {
		if (node == cursor.node) {
			offset += cursor.offset
			flag = true
		}
		if (flag) return
		let type = DOMUtil.checkNode(node)
		if (type == DOMUtil.TEXT_NODE) {
			offset += node.nodeValue.length
			return
		}
		if (type == DOMUtil.IGNORE_NODE) return
		node.childNodes.forEach(dfs)
	}
	dfs(line_node)
	return offset
}

export const setCursorByOffset = function (editor: IEditor, line_node: HTMLElement, offset: number) {
	if (line_node.nodeType != 3 && line_node.hasAttribute('data-offset'))
		offset -= Number(line_node.getAttribute('data-offset'))

	let flag = false
	const dfs = (node: Node) => {
		if (flag) return
		let type = DOMUtil.checkNode(node)
		if (type == DOMUtil.TEXT_NODE) {
			if (offset <= node.nodeValue.length) {
				setCursor(editor, node, offset)
				flag = true
			}
			offset -= node.nodeValue.length
			return
		}
		if (type == DOMUtil.IGNORE_NODE) return
		if (!node.hasChildNodes()) {
			setCursor(editor, node, 0)
			flag = true
		} else
			node.childNodes.forEach(dfs)
	}
	dfs(line_node);
	showTag(editor.tem_cursor)
}

export const showTag = function (cursor: ICursor) {
	let nodes = getNodeNeedExpand(cursor)
	console.log(nodes)
	nodes.forEach((node) => {
		var tem = node.firstElementChild;
		if (tem && tem.className == 'md-hide')
			tem.className = 'md-show';
		tem = node.lastElementChild;
		if (tem && tem.className == 'md-hide')
			tem.className = 'md-show';
	})
}

export const hideTag = function (editor: IEditor) {
	let arr = editor.root_ele.querySelectorAll('.md-show')
	arr.forEach((node) => {
		node.classList.remove('md-show')
		node.classList.add('md-hide');
	})
}

function getNodeNeedExpand(cursor: ICursor): HTMLElement[] {
	if (!cursor) return [];
	var ele = cursor.node, arr: HTMLElement[] = [], flag: number = 0;
	if (ele.nodeValue && ele.nodeValue.length == cursor.offset)
		flag = 1;
	if (cursor.offset == 0)
		flag = 2;
	while (ele) {
		var tem = (flag == 1) ? ele.nextSibling : ((flag == 0) ? undefined : ele.previousSibling)
		if (ele.nodeType != 3 && (ele as HTMLElement).classList.contains('md-node'))
			arr.push(ele as HTMLElement);
		ele = ele.parentElement
		if (ele.nodeType != 3 && (ele as HTMLElement).classList.contains('md-block')) return arr
		if (tem) {
			flag = 0;
			if (tem.nodeType != 3 && (tem as HTMLElement).classList.contains('md-node'))
				arr.push(tem as HTMLElement);
		}
	}
	return arr;
}