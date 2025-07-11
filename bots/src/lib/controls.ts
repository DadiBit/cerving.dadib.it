export type HTMLControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export type Controls = {
    [id: string]: [HTMLLabelElement | undefined, HTMLControlElement];
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
}, options: {
    [key: string]: any | any[];
}) : [HTMLLabelElement, HTMLSelectElement];

export function control(type: string, description: string = '', attributes: {
    [key: string]: any;
} = {}, options: {
    [key: string]: any | any[];
} | string[] = {}) : [HTMLLabelElement | undefined, HTMLControlElement] {

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
            if (Array.isArray(options)) {
                for (const option of new Set(options))
                    control.appendChild(new Option(option, option));
            } else {
                for (const [value, label] of Object.entries(options))
                    control.appendChild(new Option(label, value));
            }
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

    Object.assign(control, attributes);

    // Return a pair of label and control
    return [label, control];
}