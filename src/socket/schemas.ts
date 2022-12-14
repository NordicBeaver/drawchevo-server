// This file should contain schemas for every data type used in the client/server communication.
// It's meant to be shared between the client and the server code.
// TODO: Find a better way to keep the types in sync

import { z } from 'zod';

export const playerDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const gameStateSchema = z.enum(['NotStarted', 'EnteringPrompts', 'Drawing', 'Finished']);

export const gameDtoSchema = z.object({
  id: z.string(),
  code: z.string(),
  hostId: z.string(),
  state: gameStateSchema,
  players: z.array(playerDtoSchema),
});

export const gameUpdatePayloadSchema = z.object({
  game: gameDtoSchema,
});

export const createGamePayloadSchema = z.object({
  username: z.string(),
});

export const gameCreatedPayloadSchema = z.object({
  game: gameDtoSchema,
  player: playerDtoSchema,
});

export const drawingDonePayloadSchema = z.object({
  promptId: z.string(),
  drawingData: z.string(),
});

export const joinGamePayloadSchema = z.object({
  roomCode: z.string(),
  username: z.string(),
});

export const gameJoinedPayloadSchema = z.object({
  game: gameDtoSchema,
  player: playerDtoSchema,
});

export const promptDonePayloadSchema = z.object({
  promptText: z.string(),
});

export const startGamePayloadSchema = z.object({
  playerId: z.string(),
});
