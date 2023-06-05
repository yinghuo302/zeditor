const set = new Set<string>(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'])
const mp = new Map([["","---|"],["right","---:|"],["left",":----|"],["center",":----:|"]])
export const toMd = function (node: HTMLElement): string {
	return blockToMd(node).join('\n')
}

export const tableToMd = function (node: HTMLTableElement): string[] {
	let ret: string[] = []
	for(let i=0;i<node.rows.length;i++){
		let md = '|';
		for(let j=0;j<node.rows[i].cells.length;j++)
			md += `${node.rows[i].cells[j].textContent}|`
		ret.push(md)
		if(i==0){
			md = "|"
			for(let j=0;j<node.rows[i].cells.length;j++)
				md += mp.get(node.rows[i].cells[j].align)
			ret.push(md)
		}
	}
	return ret
}

export const preToMd = function (node: HTMLElement): string[] {
	let ret = []
	ret.push("```" + node.className)
	for (const child of node.childNodes)
		ret.push((child as HTMLPreElement).innerText)
	ret.push("```")
	return ret
}

export const listToMd = function (node: HTMLElement): string[] {
	let tag = node.tagName, ret = []
	node.childNodes.forEach((node, idx) => {
		let childs = blockToMd(node as HTMLElement)
		for (let i = 0; i < childs.length; i++) {
			if (i == 0) ret.push((tag == 'OL' ? (idx + 1) + '. ' : '+ ') + childs[i])
			else ret.push('   ' + childs[i])
		}
	})
	return ret
}

export const quoteToMd = function (node: HTMLElement): string[] {
	let ret = []
	node.childNodes.forEach((child) => {
		let lines = blockToMd(child as HTMLElement)
		for (let i = 0; i < lines.length; i++)
			ret.push('> ' + lines[i])
	})
	return ret
}

export const blockToMd = function (node: HTMLElement): string[] {
	if (node.nodeType == 3) return [node.nodeValue]
	let tag = node.tagName
	if (node.classList.contains('md-line') || set.has(tag)) return [lineToMd(node)]
	if (tag == 'PRE') return preToMd(node)
	if (tag == 'TABLE') return tableToMd(node as HTMLTableElement)
	if (tag == 'UL' || tag == 'OL') return listToMd(node)
	if (tag == 'BLOCKQUOTE') return quoteToMd(node)
	if (tag=='HR') return ["***"]
	let ret = []
	node.childNodes.forEach((ele) => {
		ret.push(...blockToMd(ele as HTMLElement))
	})
	return ret
}

export const lineToMd = function (node: HTMLElement): string {
	if (node.nodeType == 3) return node.nodeValue
	let html = node as HTMLElement
	let tag = html.tagName
	if (tag == 'PRE') return node.innerText
	if (html.classList.contains("katex")) return ""
	if (tag == 'IMG') return ""
	if (tag == 'A') return ""
	let mdtext = ""
	html.childNodes.forEach(function (node) {
		mdtext += lineToMd(node as HTMLElement)
	})
	return mdtext
}