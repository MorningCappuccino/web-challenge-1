export const getEl = (selector: string) => {
    return document.querySelector(selector);
};

export function htmlToElement(html: string): HTMLTemplateElement {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template;
}

export const convertStringToHTML = function (str: string): HTMLElement {
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');
    return doc.body.firstElementChild as HTMLElement;
};
