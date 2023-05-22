export namespace DOMUtil{
	
	export const closestParent = function(node:Node,className:string):null|HTMLElement{
		if (!node)  return null;
		if (node.nodeType === 3) node = node.parentElement as HTMLElement;
		let e = node as HTMLElement;
		while(e){
			if(className==''||e.classList.contains(className)) return e;
			e = e.parentElement as HTMLElement
		}
		return null
	}

	export const closestParents = function(node:Node,check:(HTMLElement)=>boolean):null|HTMLElement{
		if (!node)  return null;
		if (node.nodeType === 3) node = node.parentElement as HTMLElement;
		let e = node as HTMLElement;
		while(e){
			if(check(e)) return e;
			e = e.parentElement as HTMLElement
		}
		return null
	}


	export const  createDOM = function(tagName:string,className?:string,content?:string):HTMLElement{
		let span = document.createElement(tagName)
		if(className&&className!="") span.className = className
		if(content&&content!="") span.innerHTML = content
		return span
	}
	export const  createLink = function(href:string,text:string,className:string):HTMLElement{
		let link = document.createElement('a')
		link.href = href
		link.innerText = text
		if(className!='') link.className = className
		return link
	}
	export const  createImg = function(src:string,text:string,className:string):HTMLElement{
		let img = document.createElement('img')
		img.src = src
		img.alt = text
		if(className!='') img.className = className
		return img
	}
	export const  nextNode = function(node:Node):null|HTMLElement{
		return null
	}
	export const  previousNode =function (node:Node):HTMLElement{
		return null
	}

	export const getLineNode = function(node:Node) :HTMLElement{
		let parent = node.parentElement as HTMLElement
		while(parent&&parent.tagName!='li'&&!parent.classList.contains('md-root')){
			if((node as HTMLElement).classList.contains('md-line')) return node as HTMLElement
			node = parent
			parent = parent.parentElement as HTMLElement
		}
		return node as HTMLElement
	}

	export const  checkNode = function(node:Node):number{
		if(!node) return IGNORE_NODE
		if (node.nodeType==3) return TEXT_NODE;
		let html = node as HTMLElement,tagName = html.tagName
		if(html.classList.contains('md-node')) return MD_NODE
		if(html.classList.contains('md-line')) return LINE_NODE
		if (html.classList.contains("katex")) return IGNORE_NODE
		if (tagName == 'IMG') return IGNORE_NODE
		if (tagName == 'A') return IGNORE_NODE
		return MD_NODE;
	}

	export const LINE_NODE = 4
	export const MD_NODE = 2
	export const TEXT_NODE = 1
	export const IGNORE_NODE = 0
}