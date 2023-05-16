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
	setValue(mdtext:string):void
	getMd():string
	getOutline():IOutLine[]
	setHeading(level:number):void
	setInlineFormat(format:InlineFormat):void
	setBlockFormat(format:BlockFormat):void
	getRoot():HTMLDivElement
	alignTableItem(align:string)
	getDescription():string
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

type InlineFormat = "bold"|"em"|"bold-em"|"link"|"img"|"del"|"code"|"math"
type BlockFormat = "ol"|"ul"|"code"|"math"|"quote"
type TableAlignType = ""