import type { Controls } from "./controls";

export type ActionData<T extends Controls> = {
    [K in keyof T]: string;
}

export const EVENTS = {
    click: new Event("click", { bubbles: true }),
    change: new Event("change", { bubbles: true }),
};

export function wait(condition: () => boolean, timeout: number = -1) {
    return new Promise<boolean>(resolve => {

        // If we don't want to wait, return true as result immediately
        // Otherwise, check if the condition is met, if so return the result true immediately
        if (timeout == 0 || condition()) return resolve(true);

        // Create a MutationObserver to watch for new elements matching the selector
        const observer = new MutationObserver(() => {
            if (condition()) {
                observer.disconnect();
                resolve(true);
            }
        });

        // If a wait timeout is specified
        if (timeout > 0) {
            // Set a timeout to disconnect the observer
            setTimeout(() => {
                observer.disconnect();
                // Don't forget to return the condtion result, no matter what happens, at this point
                resolve(condition());
            }, timeout);
        }
        
        // Actually start observing!
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });

    })
}

/**
 * Try matching the selector and return the result before an optional timeout is reached.
 * @param selector A selector used by [document.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
 * @param timeout An optional timeout in milliseconds
 */
export function match(selector: string, timeout: number = -1) {
    return new Promise<NodeListOf<Element>>(resolve => {

        // Try to match the selector directly
        let elements = document.querySelectorAll(selector);

        // If we don't want to wait, return the result immediately
        // Otherwise, check if at least one element was found, if so return the result immediately
        if (timeout == 0 || elements.length != 0) return resolve(elements);

        // Create a MutationObserver to watch for new elements matching the selector
        const observer = new MutationObserver(() => {
            let elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                observer.disconnect();
                resolve(elements);
            }
        });

        // If a wait timeout is specified
        if (timeout > 0) {
            // Set a timeout to disconnect the observer
            setTimeout(() => {
                observer.disconnect();
                // Don't forget to return the elements, no matter what happens, at this point
                let elements = document.querySelectorAll(selector);
                resolve(elements);
            }, timeout);
        }
        
        // Actually start observing!
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });

    })
}

/**
 * Try setting a value to all elements matching the selector before an optional timeout is reached.
 * @param selector A selector used by [document.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
 * @param value The value to set the elements to
 * @param timeout An optional timeout in milliseconds
 */
export async function set(selector: string, value: any, timeout: number = -1) {

    // Process one matching element at a time
    // Once the value is set, simulate user input
    const matches = await match(selector, timeout);
    for (const match of matches) {
        
        if (match instanceof HTMLInputElement) {
            switch (match.type) {
                case 'checkbox':
                    match.checked = !!value;
                    match.dispatchEvent(EVENTS.click);
                    break;
                case 'file':
                    // TODO: implement file upload with blobs/base64
                    // match.files = value;
                    break;
                default:
                    match.value = value.toString();
                    match.dispatchEvent(EVENTS.change);
                    break;
            }
        } else if (match instanceof HTMLTextAreaElement || match instanceof HTMLSelectElement) {
            match.value = value.toString();
            match.dispatchEvent(EVENTS.change);
        } else {
            // We warn the user that the element is not supported, maybe we can add support for it in the future!
            // No need to throw an error, the user can still use the plugin
            console.warn(`Selector '${selector}' matched an element of type '${match.tagName}', which is not supported.`);
            continue;
        }

    }

}

/**
 * Try to populate a document controls given a data object before an optional timeout is reached.
 * @param data An object containing selectors as keys and values to set the elements to
 * @param timeout An optional timeout in milliseconds
 */
export function populate(data: { [selector: string]: any }, timeout: number = -1) {
    const selectors = Object.keys(data);
    return Promise.all(selectors.map(selector => set(selector, data[selector], timeout)));
}

/**
 * Try to click an HTML element matching the selector before an optional timeout is reached.
 * @param selector A selector used by [document.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
 * @param timeout An optional timeout in milliseconds
 */
export async function click(selector: string, timeout: number = -1) {
    const matches = await match(selector, timeout);
    for (const match of matches)
        if (match instanceof HTMLElement)
            match.click();
}
