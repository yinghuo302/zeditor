import { renderCode } from './code';
import { renderHr, renderLine as lineFunc } from './line'
import { renderOList, renderQuote,renderUList  } from './block';
import { renderTable } from './table';
import { toMd as toMdFunc } from './tomd';
const line_funcs = [renderOList,renderUList,renderQuote,lineFunc];
const all_funcs = [renderCode,renderTable,renderOList,renderUList,renderQuote,renderHr,lineFunc];
export const convert =  (lines:string[]):HTMLElement[] => {
	var curr = 0;
	let nodes:HTMLElement[] = []
	while(curr<lines.length){
		for(const func of all_funcs) {
			let result = func(lines,curr);
			if(result){
				nodes.push(result.val);
				curr = result.end;
				break;
			}
		}
	}
	return nodes
}

export namespace MdRender{
	export const render = (mdtext:string):HTMLElement[] => {
		var lines = mdtext.split('\n');
		return convert(lines)
	}
	export const renderLine = function(mdtext:string):HTMLElement{
		let lines = [mdtext]
		for(const func of line_funcs){
			let result = func(lines,0);
			if(result) return result.val
		}
		return null
	}
	export const toMd = toMdFunc
	
};