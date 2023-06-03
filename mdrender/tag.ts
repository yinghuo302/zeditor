import katex from 'katex'
import { DOMUtil } from '../utils/index';
const md_keyword = "![]`\\~*$";
const tags:string[] = ["`","$","***","**","*","~"]
const tag_mp = {"***":"strong","**":"strong","*":"em","~":"del"}
const class_mp = {"***":"md-em","**":"","*":"","~":""}
const findMatchTag = (mdtext:string,tag:string,pos:number,end:number):number =>{
    while(true){
        var match = mdtext.indexOf(tag,pos);
        if(match==-1||match+tag.length>end)
            return -1;
        else if(mdtext.charAt(match-1)=='\\')
            pos = match + 1;
        else
            return match;
    }
}
export const renderTag = (mdtext:string,left:number,right:number):Node[] =>{
    var pos:number = left; var p:number;
    var nodes:Node[] = []
    while(left<right){
        var ch = mdtext.charAt(left);
        if (ch == '\\') {
            if (md_keyword.indexOf(mdtext.charAt(left + 1)) != -1){
				let text1 = document.createTextNode(mdtext.slice(pos,left))
				let hide = DOMUtil.createDOM('span','md-hide','\\')
				let text2 = document.createTextNode(mdtext.charAt(left+1))
				let span = DOMUtil.createDOM('span','md-node','')
				span.append(hide,text2)
				nodes.push(text1,span)
                pos = left+2;
                ++left;
				continue
            }
        }
        for(const tag of tags){
			let info = renderSym(mdtext,left,right,tag)
			if(!info) continue;
			nodes.push(document.createTextNode(mdtext.slice(pos,left)))
			nodes.push(info.val)
			pos = info.end;	left = pos - 1;
			break;
		}
		if(ch=='!'||ch=='['){
			let info = renderLink(mdtext,left,right)
			if(info){
				nodes.push(document.createTextNode(mdtext.slice(pos,left)))
				nodes.push(info.val)
				pos = info.end
				left = pos-1
			}
		}
		++left
    }
	if(pos!=right) nodes.push(document.createTextNode(mdtext.substring(pos,right)))
	return nodes
}
const linkRegex = /\[([^\]]*)\]\(([^\)]+)\)/;
const renderLink = function(mdtext:string,left:number,right:number):RenderInfo{
	let p = findMatchTag(mdtext,')',left,right)
	if(p==-1) return null
	let content = mdtext.substring(left,p+1)
	let match = content.match(linkRegex)
	if(!match) return null
	let node:HTMLElement
	if(mdtext[left]=='!')
		node = DOMUtil.createImg(match[2],match[1],'md-ignore')	
	else{
		if(match[0][1]=='') return null
		node = DOMUtil.createLink(match[2],match[1],'md-ignore')
	}
	let span = DOMUtil.createDOM('span','md-node','')
	let hide = DOMUtil.createDOM('span','md-hide',content)
	span.append(hide,node)
	return {val:span,end:p+1}
}
const renderSym = function(mdtext,begin:number,end:number,tag:string):RenderInfo {
	if(begin+tag.length>=end) return null;
	if(mdtext.substring(begin,begin+tag.length)!=tag) return null;
	let p = findMatchTag(mdtext,tag,begin+tag.length+1,end);
	let span = DOMUtil.createDOM('span','md-node','')
	let l_hide = DOMUtil.createDOM('span','md-hide',tag)
	let r_hide = DOMUtil.createDOM('span','md-hide',tag)
	if (p == -1) return null 
		switch (tag){
		case "`":{
			let content = mdtext.substring(begin+tag.length,p)
			let code = DOMUtil.createDOM('code','',content)
			if(content=='`') return null
			span.append(l_hide,code,r_hide)
			break;
		}
		case "$":{
			let content = mdtext.substring(begin+tag.length,p)
			let l_hide = DOMUtil.createDOM('span','md-hide',`$${content}`)
			let node = DOMUtil.createDOM('span','md-ignore','')
			katex.render(content,node,{displayMode:false,output:"html"})
			let r_hide = DOMUtil.createDOM('span','md-hide','$')
			span.append(l_hide,node,r_hide); break;
		}
		default:{
			let node = DOMUtil.createDOM(tag_mp[tag],class_mp[tag],'')
			node.append(...renderTag(mdtext,begin+tag.length,p))
			span.append(l_hide,node,r_hide)
		}
	}
	return {val:span,end:p+tag.length}
}