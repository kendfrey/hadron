const extensions = new Map();

chrome.runtime.onMessageExternal.addListener(extensionMessage);
chrome.runtime.onMessage.addListener(pageMessage);

function extensionMessage(message, sender)
{
	switch (message.method)
	{
		case "register":
			extensions.set(sender.id, {name: message.name});
			break;
	}
}

function pageMessage(message, sender, respond)
{
	switch (message.method)
	{
		case "message":
			transform(message.text).then(respond);
			return true;
	}
}

function transform(text)
{
	let promise = Promise.resolve(text);
	for (const extension of extensions.keys())
	{
		promise = promise.then(text => new Promise(resolve =>
		{
			chrome.runtime.sendMessage(extension, {method: "message", text: text}, {}, resolve);
		}));
	}
	return promise;
}
