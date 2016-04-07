NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

for (let element of document.querySelectorAll(".content"))
{
	transform(element);
}
new MutationObserver(onMutation).observe(document, {childList: true, subtree: true});

function onMutation(mutations)
{
	for (let mutation of mutations)
	{
		for (let node of mutation.addedNodes)
		{
			if (node instanceof Element)
			{
				for (let element of node.querySelectorAll(".content"))
				{
					transform(element);
				}
			}
		}
	}
}

function transform(element)
{
	let walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
	for (let node = walker.nextNode(); node !== null; node = walker.nextNode())
	{
		chrome.runtime.sendMessage(chrome.runtime.id, {method: "message", text: node.textContent}, {}, response => node.textContent = response);
	}
}