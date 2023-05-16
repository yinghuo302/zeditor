import { renderCode } from './code';
import { renderHr, renderLine } from './line'
import { renderOList, renderQuote,renderUList  } from './block';
import { renderTable } from './table';
import { toMd } from './tomd';
export class MdRender{
	static line_funcs = [renderOList,renderUList,renderQuote,renderLine];
	static all_funcs = [renderCode,renderTable,renderOList,renderUList,renderQuote,renderHr,renderLine];
	static render = (mdtext:string):HTMLElement[] => {
		var lines = mdtext.split('\n');
		return MdRender.convert(lines)
	}
	static convert =  (lines:string[]):HTMLElement[] => {
		var curr = 0;
		let nodes:HTMLElement[] = []
		while(curr<lines.length){
			for(const func of MdRender.all_funcs) {
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
	static toMd = toMd
	static renderLine = function(mdtext:string):HTMLElement{
		var funcs = [renderOList,renderUList,renderQuote,renderLine];
		let lines = [mdtext]
		for(const func of funcs){
			let result = func(lines,0);
			if(result) return result.val
		}
		return null
	}
};