import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

/** Update the seed file to additionally seed at least 2 users.
 *  Each user should have a playlist containing at least 5 tracks.
 *  You will have to edit how playlists are seeded as well, since they now are required to belong to a user!
 */
async function seed() {
  for (let i = 1; i <= 25; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  for (let i = 1; i <= 5; i++) {
    const user = await createUser("user" + i, "password");
    await createPlaylist("playlist" + i, "description" + i, user.id);
    for (let j = 0; j < 5; j++) {
      await createPlaylistTrack(playlist.id, (i - 1) * 5 + j + 1);
    }
  }
}
