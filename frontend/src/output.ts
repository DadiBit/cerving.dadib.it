import { encode, inflate } from './inflate';

/**
 * This is the function that will be executed in the browser.
 * @param bot The base64 encoded module
 * @param data The JSON data
 */
async function run(bot: string, data: { [key: string] : string }) {

    // See: https://stackoverflow.com/a/36183085
    const res = await fetch(bot);
    const blob = await res.blob();

    // Type the blob as a module after inflating it
    const { action } : {
        action?: (data: { [key: string] : string }) => Promise<any>;
    } = await inflate(blob);
    if (!action) throw new Error('Bot does not export an action function');

    // This can be useful if the action returns something
    // and we want to wrap the output in a function that does something
    return await action(data);
}

export async function output(bot: File, data: { [key: string] : string }) {
    const module = await encode(bot);
    const json = JSON.stringify(data);
    // This is an IIFE which returns the run function
    // Then the run function is called with the base64 encoded module and the JSON data
    return `(()=>{${encode};${inflate};return ${run}})()("${module}",${json})`;
}