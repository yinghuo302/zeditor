import { DOMUtil } from "../utils";
import { MdRender } from "./index";
const aligns = ["left", "left", "right", "center"];
export const renderTable = function (lines: string[], index: number): RenderInfo | null {
	var line = lines[index], row = 0;
	if (line[0] != '|' || line[line.length - 1] != '|')
		return null;
	var table = document.createElement('table');
	while (index < lines.length) {
		line = lines[index]
		if (line[0] != '|' || line[line.length - 1] != '|') break;
		if (row == 1) {
			let align: number = 0, col: number = 0, i = 1;
			while (i < line.length) {
				align = 0;
				if (line.charAt(i) === ':') align += 1;
				while (line.charAt(i) != '|') ++i;
				if (line.charAt(i - 1) == ':') align += 2;
				setAlign(table, col, align);
				++col; ++i;
			}
			++row; ++index; line = lines[index]
			continue;
		}
		let prev: number = 1, cur: number = 1;
		let tr = document.createElement('tr');
		while (cur < line.length) {
			let col = 0;
			while (line.charAt(cur) != '|') ++cur;
			if (line.charAt(cur - 1) != '\\') {
				let item: HTMLElement;
				if (row == 0) item = DOMUtil.createDOM('th', 'md-block');
				else {
					item = DOMUtil.createDOM('td', 'md-block');
					(item as HTMLTableCellElement).align = table.rows[0].cells[col].align;
				}
				item.append(MdRender.renderLine(line.slice(prev, cur)))
				tr.appendChild(item);
				++col; prev = cur + 1;
			}
			++cur;
		}
		table.appendChild(tr);
		++row; ++index;
	}
	return { val: table, end: index };
}
const setAlign = (table: HTMLTableElement, num: number, align: number) => {
	const col = table.rows[0].cells.length;
	if (num >= col)
		return;
	table.rows[0].cells[num].align = aligns[align];
}