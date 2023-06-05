import { MdRender } from "../mdrender/index";
import { cursorCtr, focus, getCursor, getOffset, setCursorByOffset } from "./cursor";
import { insertNewLine, promoteLine, renewLine } from "./renew";
import { DOMUtil } from "../utils/index";
export namespace EventCenter {
	export function listen(editor: IEditor) {
		editor.root_ele.addEventListener('input', inputHandler.bind(null, editor));
		editor.root_ele.addEventListener('keyup', keyupHandler.bind(null, editor));
		editor.root_ele.addEventListener('click', clickHandler.bind(null, editor));
		editor.root_ele.addEventListener('keydown', keydownHandler.bind(null, editor));
		setInterval(renewDaemon, 1200, editor)
	}
	function keyupHandler(editor: IEditor, e: KeyboardEvent) {
		if (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'ArrowLeft')
			cursorCtr(editor);
		if (e.key == 'ArrowRight')
			cursorCtr(editor, false);
	}
	function clickHandler(editor: IEditor, e: Event) {
		cursorCtr(editor)
	}
	function keydownHandler(editor: IEditor, e: KeyboardEvent) {
		if (e.key === 'Enter')
			enterHandler(editor, e);
		if (e.key == '[') editor.promoteLine()
		if (e.ctrlKey && e.altKey) {
			if (e.key == '1' || e.key == '2' || e.key == '3'
				|| e.key == '4' || e.key == '5' || e.key == '6')
				editor.setHeading(Number(e.key))
			else if (e.key == 'b')
				editor.setInlineFormat("**")
			else if (e.key == 'i') {
				editor.setInlineFormat("*")
			} else if (e.key == 'k')
				editor.setInlineFormat("link")
			else if (e.key == 'p')
				editor.setInlineFormat("img")
			else if (e.key == 'm')
				editor.setInlineFormat("$")
			else if (e.key == '`')
				editor.setInlineFormat("`")
			else if (e.key == 'd')
				editor.deleteTable()
		}
	}

	function enterHandler(editor: IEditor, e: KeyboardEvent) {
		e.preventDefault()
		var cursor = getCursor();
		// 更新旧行
		var line_node = DOMUtil.getLineNode(cursor.node);
		if (!line_node) return
		const offset = getOffset(line_node, cursor)
		let [line, needInsert] = renewLine(line_node, offset)
		line_node.replaceWith(line)
		// 插入新行		
		const mdtext = MdRender.toMd(line_node);
		// 重置光标
		if (needInsert || offset != mdtext.length) {
			let new_line = insertNewLine(line, mdtext.substring(offset))
			setCursorByOffset(editor, new_line, 0)
		} else {
			if (line.tagName == 'TABLE')
				setCursorByOffset(editor, (line as HTMLTableElement).
					firstChild.firstChild.firstChild as HTMLElement, 0)
			else if (line.tagName == 'PRE')
				setCursorByOffset(editor, line.firstChild as HTMLElement, 0)

		}
		focus(editor)
	}

	function inputHandler(editor: IEditor, e: InputEvent) {
		var cursor = getCursor();
		if (e.inputType == "insertFromPaste") {
			let line_node = DOMUtil.getLineNode(cursor.node)
			if (line_node.textContent.indexOf('\n') != -1) editor.setValue(editor.getMd())
			else { editor.state = 2; editor.need_update.add(line_node); }
			return
		}
		editor.state = 2;
		if (!cursor) return;
		let line_node = DOMUtil.getLineNode(cursor.node)
		editor.need_update.add(line_node)
	}

	function renewDaemon(editor: IEditor) {
		if (editor.state != 2) return
		var cursor = getCursor();
		editor.state = 1;
		if (!cursor) return;
		var line_node = DOMUtil.getLineNode(cursor.node);
		if (editor.need_update.has(line_node)) editor.need_update.delete(line_node)
		const offset = getOffset(line_node, cursor)
		let new_node = renewLine(line_node)[0];
		line_node.replaceWith(new_node);
		setCursorByOffset(editor, new_node, offset);
		editor.need_update.forEach((node) => {
			let new_node = renewLine(node)[0];
			node.replaceWith(new_node);
		})
		editor.need_update.clear();
		focus(editor);
	}
}