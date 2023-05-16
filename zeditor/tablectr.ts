export const AlignCtr = (table:HTMLTableElement,num:number,align:string) =>{
	const row = table.rows.length;
	const col = table.rows[0].cells.length;
	if(num>=col)
		return ;
	else
		for(let i=0;i<row;++i)
			table.rows[i].cells[num].align = align;
}

export const updateTable = (table:HTMLTableElement,row:number,column:number) => {
	const oldRow = table.rows.length;
	const oldColumn = table.rows[0].cells.length;
	if(row<=0||column<=0)
		return ;
	if (row === oldRow && oldColumn === column)
		return;
	if (oldColumn !== column) {
		let columnDiff = column - oldColumn;
		for(let i=0;i<oldRow;++i){
			if(columnDiff>0)
				for(let j=0;j<columnDiff;++j)
					table.rows[i].appendChild(document.createElement('td'));
			else
				for(let j=0;j<columnDiff;++j)
					table.rows[i].cells[oldColumn-j-1].remove();
		}
	}
	if(oldRow!=row){
		let row_diff = row - oldRow;
		if(row_diff>0){
			for(let i=0;i<row_diff;++i){
				var tr = document.createElement('tr');
				for(let j=0;j<column;++j)
					tr.appendChild(document.createElement('td'));
				table.appendChild(tr);
			}
		}
		else{
			for(let i=0;i<row_diff;++i)
				table.rows[oldRow-i].remove();
		}
	}
};