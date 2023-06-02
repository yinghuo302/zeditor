const set = new Set<string>(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'])
export const toMd = function (node: HTMLElement): string {
	if(set.has(node.tagName)) return lineToMd(node)
	return blockToMd(node).join('\n')
}



export const tableToMd = function (node: HTMLTableElement): string[] {
	let ths = node.querySelectorAll('th')
	let trs = node.querySelectorAll('tr')
	let ret: string[] = []
	let md = '|';
	for (let th of ths)
		md += ` ${th.textContent} |`;
	ret.push(md)
	md = '|';
	for (let i = 0; i < ths.length; i++) {
		if (ths.item(i).align == 'left') md += `:---|`;
		else if (ths.item(i).align == 'right') md += `---:|`
		else md += `---|`
	}
	ret.push(md);
	for (let tr of trs) {
		let tds = tr.querySelectorAll('td');
		md = '|';
		for (let td of tds) {
			md += ` ${td.textContent} |`;
		}
		ret.push(md)
	}
	return ret;
}

export const preToMd = function (node: HTMLElement): string[] {
	let ret = []
	ret.push( "```" + node.className)
	for (const child of node.childNodes)
		ret.push((child as HTMLPreElement).innerText)
	return ret
}

export const listToMd = function(node:HTMLElement):string[]{
	let tag = node.tagName, ret = []
	node.childNodes.forEach((node,idx)=>{
		let childs = blockToMd(node as HTMLElement)
		for(let i=0;i<childs.length;i++){
			if(i==0)
				ret.push((tag=='OL'? (idx+1) + '. ' : '+ ') + childs[i])
			else
				ret.push('   ' + childs[i])
		}
	})
	return ret
}

export const quoteToMd = function(node:HTMLElement):string[]{
	let childs = blockToMd(node)
	for(let i=0;i<childs.length;i++)
		childs[i] = '> ' + childs[i]
	return childs
}

export const blockToMd = function(node:HTMLElement):string[] {
	let ret:string[] = []
	for(const child of node.childNodes){
		console.log(child)
		if(child.nodeType==3) ret.push((child as Text).nodeValue)
		let html = child as HTMLElement
		let tag = html.tagName
		if(tag=='PRE') ret.push(...preToMd(html))
		else if(tag=='UL'||tag=='OL') ret.push(...listToMd(html))
		else if(tag=='TABLE') ret.push(...tableToMd(html as HTMLTableElement))
		else if(tag=='BLOCKQUOTE') ret.push(...quoteToMd(html))
		else ret.push(lineToMd(html))
	}
	return ret
}

export const lineToMd = function(node:HTMLElement):string{
	if (node.nodeType == 3) return node.nodeValue
	let html = node as HTMLElement
	let tag = html.tagName
	if (html.classList.contains("katex")) return ""
	if (tag == 'IMG') return ""
	if (tag == 'A') return ""
	let mdtext = ""
	html.childNodes.forEach(function (node) {
		mdtext += lineToMd(node as HTMLElement)
	})
	return mdtext
}
