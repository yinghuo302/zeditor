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
	state:number	
	old_cursor:ICursor;
	tem_cursor:ICursor;
	need_update:Set<HTMLElement>
	setValue(mdtext:string):void
	getMd():string
	getOutline():IOutLine[]
	setHeading(level:number):void
	setInlineFormat(format:InlineFormat):void
	setBlockFormat(format:BlockFormat):void
	getRoot():HTMLDivElement
	alignTableItem(align:TableAlignType):void
	alterTable(range:Range,row:number,col:number):void
	createTable(range:Range,row:number,col:number):void
	deleteTable():void
	insertNewLineBefore():void
	insertNewLineAfter():void
	promoteLine():void
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
type TableAlignType = "left"|"right"|"center"