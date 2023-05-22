interface IOutLine {
	level:number
	title:string
}

interface ICursor{
	node:Node;
	offset:number;
}

interface IEditor{
	root_ele:HTMLDivElement;
	old_cursor:ICursor;
	tem_cursor:ICursor;
	range:Range
	setValue(mdtext:string):void
	getMd():string
	getOutline():IOutLine[]
	setHeading(level:number):void
	setInlineFormat(format:InlineFormat):void
	setBlockFormat(format:BlockFormat):void
	getRoot():HTMLDivElement
	alignTableItem(align:string)
	getDescription():string
	alterTable(row:number,col:number):void
	createTable(row:number,col:number):void
}


interface RenderInfo{
	val:HTMLElement;
	end:number;
}

interface RenewInfo{
	node:HTMLElement;
	cnt:number;
}

interface LineInfo{
	val:string;
	offset:number;
}

type InlineFormat = "**"|"*"|"***"|"~"|"`"|"$"|"link"|"img"
type BlockFormat = "ol"|"ul"|"code"|"math"|"quote"
type TableAlignType = ""