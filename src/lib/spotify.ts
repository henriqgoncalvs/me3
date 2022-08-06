import { stringify } from 'querystring';
import fetch from 'isomorphic-unfetch';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const SEARCH_BASE_ENDPOINT = `https://api.spotify.com/v1/search?q=`;

export const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
};

export const getTrackSearch = async ({ q }: { q: string }) => {
  const { access_token } = await getAccessToken();

  return fetch(`${SEARCH_BASE_ENDPOINT}${encodeURIComponent(q)}&type=track&limit=5`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export type SongFromSpotify = {
  id: string;
  name: string;
  href: string;
  preview_url: string;
  album: {
    name: string;
    // "2018-03-09"
    release_date: string;
    images: {
      url: string;
    }[];
  };
  artists: {
    name: string;
  }[];
};

export type SpotifyApiResponse = {
  tracks: {
    items: SongFromSpotify[];
  };
};
