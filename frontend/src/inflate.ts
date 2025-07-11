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

    // By default let jelly be the blob
    let jelly: Blob = blob;

    // If it's a gzip file, decompress it
    if (blob.type === 'application/gzip') {
      
      // See: https://stackoverflow.com/a/68829631
      const ungzip = new DecompressionStream('gzip');
      const stream = blob.stream().pipeThrough(ungzip);
      
      // See: https://stackoverflow.com/a/50875615
      jelly = await new Response(stream).blob()
        .then(blob => blob.slice(0, blob.size, "application/javascript"));
    }

    // Encode the blob as a data url
    const url = await encode(jelly);

    // Import the stream as a module
    return await import(/* @vite-ignore */ url);

}
