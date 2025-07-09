export async function deserialize(data: `data:application/gzip;base64,${string}`) {

    // See: https://stackoverflow.com/a/36183085
    const res = await fetch(data);
    const blob = await res.blob();

    // See: https://stackoverflow.com/a/68829631
    const ungzip = new DecompressionStream('gzip');
    const stream = blob.stream().pipeThrough(ungzip);
    
    // Import the stream as a module (actual bot)
    // See: https://stackoverflow.com/a/50875615
    const bot = new Response(stream).blob()
        .then(blob => blob.slice(0, blob.size, "application/javascript"))
        .then(blob => URL.createObjectURL(blob))
        .then(url => import(/* @vite-ignore */ url));
    
    return bot;

}