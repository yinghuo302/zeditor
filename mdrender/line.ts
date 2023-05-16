import { DOMUtil } from "../utils/index";
import { renderTag} from './tag'
export const renderLine = function(lines:string[],index:number):RenderInfo|null{
    var line = lines[index];
    var node:HTMLElement|null = null;
    var ch = line.charAt(0);
	if(ch=='#'){
        let i =0;
        while(line.charAt(i)=='#')
            ++i;
        if(line.charCodeAt(i)==32||line.charCodeAt(i)==160){ 
			let header = DOMUtil.createDOM('h'+i,'md-line md-node','')
			let span = DOMUtil.createDOM('span','md-hide',line.substring(0,i+1))
			header.append(span,...renderTag(line,i+1,line.length))
            return {val:header,end:index+1};
        }
    }
	var p = DOMUtil.createDOM('p','md-line','');
	p.append(...renderTag(line,0,line.length))
	return {val:p,end:index+1};
} 

export const renderHr = function(lines:string[],index:number):RenderInfo|null {
	var line = lines[index];
    var node:HTMLElement|null = null;
    var ch = line.charAt(0);
	if(ch=='*'||ch=='-'){
        let i = 1;
        while(line.charAt(i)==ch)
            ++i;
        if(i==line.length){
            node = document.createElement('hr');
			return {val:node as HTMLElement,end:index+1};
		}
    }
	return null
}