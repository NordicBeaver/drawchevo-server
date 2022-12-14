// This file should contain schemas for every data type used in the client/server communication.
// It's meant to be shared between the client and the server code.
// TODO: Find a better way to keep the types in sync

import { z } from 'zod';

export const playerDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const promptDtoSchema = z.object({
  id: z.string(),
  text: z.string(),
  playerId: z.string(),
});

export const drawingDtoSchema = z.object({
  id: z.string(),
  playerId: z.string(),
});

export const chainDtoSchema = z.object({
  initialPlayerId: z.string(),
  entries: z.array(z.string()),
});

export const gameStateSchema = z.enum(['NotStarted', 'EnteringPrompts', 'Drawing', 'Finished']);

export const gameDtoSchema = z.object({
  id: z.string(),
  code: z.string(),
  hostId: z.string(),
  state: gameStateSchema,
  stage: z.number(),
  players: z.array(playerDtoSchema),
  prompts: z.array(promptDtoSchema),
  drawings: z.array(drawingDtoSchema),
  chains: z.array(chainDtoSchema),
  playersOrder: z.array(z.string()),
});

export const drawingDataSchema = z.object({
  id: z.string(),
  data: z.string(),
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

export const requestDrawingDataPayloadSchema = z.object({
  drawingId: z.string(),
});

export const drawingDataPayloadSchema = z.object({
  drawing: drawingDataSchema,
});
