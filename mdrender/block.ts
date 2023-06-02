import { DOMUtil } from '../utils';
import {convert, MdRender} from './index';
export const renderUList = function(lines:string[],index:number):RenderInfo|null{
	var line = lines[index];
	if(isUl(line)){
		var list = document.createElement('ul');
		while(index<lines.length&&isUl(line)){
			let arr:string[] = [];
			var item = document.createElement('li');
			arr.push(line.slice(2));
			++index;
			while(index<lines.length){
				line = lines[index];
				if(line.slice(0,3)==='   ')
					arr.push(line.slice(3));
				else
					break;
				++index;
			}
			// let span = DOMUtil.createDOM('span','md-hide',)
			// item.append()
			item.append(...convert(arr));
			list.appendChild(item);
		}
		return {val:list,end:index};
	}
    return null;
}
export const renderOList = function(lines:string[],index:number):RenderInfo|null{
	var line = lines[index];
	if(isOl(line)!=0){
		var list = document.createElement('ol');
		let pos:number;
		while(index<lines.length&&(pos=isOl(line))!=0){
			let arr:string[] = [];
			var item = document.createElement('li');
			arr.push(line.slice(pos));
			++index;
			while(index<lines.length){
				line = lines[index];
				if(line.slice(0,3)==='   ')
					arr.push(line.slice(3));
				else
					break;
				++index;
			}
			item.append(...convert(arr));
			list.appendChild(item);
		}
		return {val:list,end:index};
	}
    return null;
}
export const renderQuote = function(lines:string[],index:number):RenderInfo|null{
	var line = lines[index];
	if(line.charAt(0)=='>' &&(line.charCodeAt(1)==32||line.charCodeAt(1)==160)){
        var node = document.createElement('blockquote');
		var arr:string[] = [];
		arr.push(line.substring(2));
		++index;
		while(index<lines.length){
			line = lines[index];
			if(line.slice(0,2)!='> ') break ;
			arr.push(line.slice(2));
			++index;
		}
		node.append(...convert(arr))
		return {val:node,end:index};
    }
	return null;
}
const isUl =function(line:string):boolean{
	var ch = line.charAt(0);
	if((ch==='*'||ch==='+'||ch==='-')&&(line.charCodeAt(1)==32||line.charCodeAt(1)==160))
		return true;
	else
		return false;

}
const isOl = function(line:string):number{
	var ch = line.charAt(0);
	if(ch<='9'&&ch>='0'){
		let i = 1;
		while(line.charAt(i)<='9'&&line.charAt(i)>='0')
			++i;
		if(line.charAt(i)=='.'&&(line.charCodeAt(i+1)==32||line.charCodeAt(i+1)==160))
			return i+2;
	}
	return 0;
}