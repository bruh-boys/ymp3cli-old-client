import { Ask, ink } from "../deps.ts";

/** @type {string} ─ Description. */
const url = "http://127.0.0.1:8000/";

await (async (): Promise<void> => {
  // Print welcome message.
  console.log(`
    ${await Deno.readTextFile("welcome.txt")}
    Welcome to ymp3cli!
    version 0.0.2

    Type <ctrl + c> to exit.
  `);

  while (true) {
    /** @type {Response} ─ Description. */
    const availableSongs: Response = await fetch(url + "songs", {
      method: "GET",
    });

    /**@type {string} ─ Description. */
    const songs: string = await availableSongs.text();

    console.log(ink.colorize(`<magenta>available songs:\n${songs}</magenta>`));

    /** @type {Ask} ─ Description. */
    const ask: Ask = new Ask();

    /** @type {Result<boolean | number | string | undefined>} ─ Description. */
    const nsongs = await ask.prompt([
      {
        name: "n",
        type: "number",
        message:
          "Type the number of the song you want to listen\n(if there is no songs or you want to skip to download one just type 99 + enter to skip):",
      },
      {
        name: "d",
        type: "number",
        message:
          "If you want to delete a song type the number of the song\nif there is no songs\nor you don't want a delete a song\nor you just want to listen the song just type 99 + enter to skip:",
      },
    ]);

    /** @type {Response} ─ Description. */
    const nSong: Response = await fetch(`${url}y`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nsong: nsongs.n,
      }),
      method: "POST",
    });

    /** @type {string} ─ Description. */
    const content: string = await nSong.text();
    console.log(content);

    const deleteSong: Response = await fetch(`${url}delete`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        delete: nsongs.d,
      }),
      method: "DELETE",
    });
    /** @type {string} ─ Description. */
    const contentDelete: string = await deleteSong.text();
    console.log(contentDelete);

    /** @type {string | null} ─ Description. */
    const ytUrl: string | null = prompt(
      ink.colorize(
        "<green>? Insert a youtube url to download the song / music (you can type s + enter for skip):</green>"
      )
    );

    /** @type {Response} ─ Description. */
    const res: Response = await fetch(`${url}download`, {
      body: JSON.stringify({
        url: ytUrl,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    console.log(await res.json());
  }
})();

export {};
