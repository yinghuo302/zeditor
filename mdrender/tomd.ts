export const toMd = function (node: Node): string {
	if (node.nodeType == 3)
		return node.nodeValue
	let html = node as HTMLElement
	let tag = html.tagName
	if (html.classList.contains("katex"))
		return ""
	if (tag == 'IMG')
		return ""
	if (tag == 'A')
		return ""
	if (tag == 'TABLE') {
		return tableToMd(node as HTMLTableElement)
	}
	let mdtext = ""
	html.childNodes.forEach(function (node) {
		mdtext += toMd(node)
	})
	return mdtext
}

export const tableToMd = function (node: HTMLTableElement): string {
	let ths = node.querySelectorAll('th')
	let trs = node.querySelectorAll('tr')
	let md = '|';
	for (let th of ths) {
		md += ` ${th.textContent} |`;
	}
	md += '\n|';
	for (let i = 0; i < ths.length; i++) {
		if(ths.item(i).align=='left')
			md += `:---|`;
		else if(ths.item(i).align=='right')
			md += `---:|`
		else
			md += `---|`
	}
	md += '\n';
	for (let tr of trs) {
		let tds = tr.querySelectorAll('td');
		md += '|';
		for (let td of tds) {
			md += ` ${td.textContent} |`;
		}
		md += '\n';
	}

	return md;
}