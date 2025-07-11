export type HTMLControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export type Controls = {
    [id: string]: [HTMLLabelElement | undefined, HTMLControlElement];
}

export function loadOptions(control: HTMLSelectElement, options: object | any[]) {
    if (Array.isArray(options)) {
        for (const option of new Set(options))
            control.appendChild(new Option(option, option));
    } else {
        for (const [value, label] of Object.entries(options))
            control.appendChild(new Option(label, value));
    }
}

export function control(type: 'hidden') : [undefined, HTMLInputElement];

export function control(type: 'number', description: string, attributes: {
    required?: boolean;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
}) : [HTMLLabelElement, HTMLInputElement];

export function control(type: 'string', description: string, attributes: {
    required?: boolean;
    value?: string;
    minlength?: number;
    maxlength?: number;
}) : [HTMLLabelElement, HTMLInputElement];

export function control(type: 'text', description: string, attributes: {
    required?: boolean;
    value?: string;
    minlength?: number;
    maxlength?: number;
}) : [HTMLLabelElement, HTMLTextAreaElement];

export function control(type: 'select', description: string, attributes: {
    required?: boolean;
    value?: string;
}, options: object | any[]) : [HTMLLabelElement, HTMLSelectElement];

export function control(type: string, description: string = '', attributes: {
    [key: string]: any;
} = {}, options: object | any[] = {}) : [HTMLLabelElement | undefined, HTMLControlElement] {

    // Create the label element
    let label: HTMLLabelElement | undefined = undefined;
    if (description != '') {
        label = document.createElement("label");
        label.innerText = description;
    }

    let control: HTMLControlElement;
    switch (type) {
        case 'select':
            control = document.createElement("select");
            loadOptions(control, options);
            break;
        case 'text':
            control = document.createElement("textarea");
            break;
        /* @ts-ignore */
        case 'string':
            type = 'text';
        default:
            control = document.createElement("input");
            control.type = type;
            break;
    }

    // Assign attributes
    Object.assign(control, attributes);

    // Return a pair of label and control
    return [label, control];
}