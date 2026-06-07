import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylistsByUserId,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

/** 🔒All /playlists routes now require the user to be logged in. */
router.use(requireUser);

/** GET /playlists sends array of all playlists owned by the user. */
router.get("/", async (req, res) => {
  const playlists = await getPlaylistsByUserId(req.user.id);
  res.send(playlists);
});

/** POST /playlists creates a new playlist owned by the user. */
router.post("/", requireBody(["name", "description"]), async (req, res) => {
  const { name, description } = req.body;
  const playlist = await createPlaylist(name, description, req.user.id);
  res.status(201).send(playlist);
});

/** GET /playlists/:id sends 403 error if the user does not own the playlist. */
router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  router.get("/:id", (req, res) => {
    if (req.user.id !== req.playlist.user_id) {
      return res
        .status(403)
        .send(
          "You are not authorized to access playlists owned by another user.",
        );
    }
    res.send(req.playlist);
  });

  req.playlist = playlist;
  next();
});

/**  */
router.get("/:id/tracks", async (req, res) => {
  if (playlist.user_id !== req.user.id)
    return res
      .status(403)
      .send(
        "You are not authorized to access playlists owned by another user.",
      );
  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.send(tracks);
});
/** GET /playlists/:id/tracks sends 403 error if the user does not own the playlist. */
router.post("/:id/tracks", requireBody(["trackId"]), async (req, res) => {
  if (playlist.user_id !== req.user.id)
    return res
      .status(403)
      .send(
        "You are not authorized to access playlists owned by another user.",
      );

  const { trackId } = req.body;
  const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
  res.status(201).send(playlistTrack);
});
