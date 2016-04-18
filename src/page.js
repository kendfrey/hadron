NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

for (const element of document.querySelectorAll(".content"))
{
	transform(element);
}
new MutationObserver(onMutation).observe(document.querySelector("#chat"), {childList: true, subtree: true});

function onMutation(mutations)
{
	for (const mutation of mutations)
	{
		for (const node of mutation.addedNodes)
		{
			if (node instanceof Element)
			{
				for (const element of node.querySelectorAll(".content"))
				{
					transform(element);
				}
			}
		}
	}
}

function transform(element)
{
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
	for (let node = walker.nextNode(); node !== null; node = walker.nextNode())
	{
		chrome.runtime.sendMessage(chrome.runtime.id, {method: "message", text: node.textContent}, {}, response => node.textContent = response);
	}
}