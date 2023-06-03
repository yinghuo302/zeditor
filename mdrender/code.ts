import hljs from "highlightjs";
import { DOMUtil } from "../utils";
export const renderCode = (lines:string[],index:number):RenderInfo|null =>{
	var line = lines[index];
	if(line.slice(0,3)==='```'){
		var pre = DOMUtil.createDOM('pre','md-block');
		pre.setAttribute('data-lang',line.slice(3).trim())
		++index;
		line = lines[index];
		while(index<lines.length){
			line = lines[index];
			if(line=='```') break
			let line_code = document.createElement('pre');
			line_code.className = 'md-line';
			if(pre.className==='')
				line_code.innerHTML = hljs.highlightAuto(line).value;
			else
				line_code.innerHTML = hljs.highlightAuto(line,[pre.className]).value;
			pre.appendChild(line_code);
			++index;
		}
		return {val:pre,end:index+1};
	}
	else
		return null;
}