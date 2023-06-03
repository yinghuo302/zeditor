import { DOMUtil } from "../utils";
import { MdRender } from "./index";
const aligns = ["left","left","right","center"];
export const renderTable = function(lines:string[],index:number):RenderInfo|null{
	var line = lines[index];
	var row = 0;
	if(line[0]!='|'||line[line.length-1]!='|')
		return null;
	var table = document.createElement('table');
	while(line[0]=='|'&&line[line.length-1]=='|'){
		if(row==1){
			var align:number = 0;
			var col:number = 0;
			let i = 1;
			while(i<line.length){
				align = 0;
				if(line.charAt(i)===':')
					align += 1;
				while(line.charAt(i)!='|')
					++i;
				if(line.charAt(i-1)==':')
					align += 2;
				++i;
				setAlign(table,col,align);
				++col;
			}
			++row; ++index; line = lines[index]
			continue;
		}
		let prev:number = 1;
		let cur:number = 1;
		let tr = document.createElement('tr');
		while(cur<line.length){
			let col = 0;
			while(line.charAt(cur)!='|')
				++cur;
			if(line.charAt(cur-1)!='\\'){
				let item:HTMLElement;
				if(row==0)
					item = DOMUtil.createDOM('th','md-block');
				else{
					item = DOMUtil.createDOM('td','md-block');
					(item as HTMLTableCellElement).align = table.rows[0].cells[col].align;
				}
				++col;
				item.className = 'md-line';
				item.append(MdRender.renderLine(line.slice(prev,cur)))
				tr.appendChild(item);
				prev = cur+1;
			}
			++cur;
		}
		table.appendChild(tr);
		++row; ++index; line = lines[index]
	}
	return {val:table,end:index};
}
const setAlign = (table:HTMLTableElement,num:number,align:number) =>{
	const col = table.rows[0].cells.length;
	if(num>=col)
		return ;
	table.rows[0].cells[num].align = aligns[align];
}