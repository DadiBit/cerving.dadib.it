/**
 * Encode a blob as a base64 data url.
 * @param blob The blob to encode
 * @returns The encoded data url
 */
export function encode(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Decompress a gzip file holding a javascript module and import it.
 * @param blob The blob to decompress and import
 * @returns The imported module
 */
export async function inflate(blob: Blob) {

    // Fix for vite yelling with dynamic imports
    /* @ts-ignore */
    const __vite__injectQuery = url => url;

    // See: https://stackoverflow.com/a/68829631
    const ungzip = new DecompressionStream('gzip');
    const stream = blob.stream().pipeThrough(ungzip);
    
    // Import the stream as a module
    // See: https://stackoverflow.com/a/50875615
    return await new Response(stream).blob()
        .then(blob => blob.slice(0, blob.size, "application/javascript"))
        // We can't use blob URLs within cerved, WTF!?
        //.then(blob => URL.createObjectURL(blob))
        // Fuck them, we can just encode to data url!
        .then(blob => encode(blob))
        .then(url => import(/* @vite-ignore */ url));

}
