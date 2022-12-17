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

export const gameStateSchema = z.enum(['NotStarted', 'EnteringPrompts', 'Drawing', 'Results']);

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

export const promptResultSchema = z.object({
  type: z.literal('prompt'),
  playerName: z.string(),
  text: z.string(),
});

export const drawingResultSchema = z.object({
  type: z.literal('drawing'),
  playerName: z.string(),
  drawingData: z.string(),
});

export const resultEntryschema = z.union([promptResultSchema, drawingResultSchema]);

export const chainResultSchema = z.object({
  initialPlayerName: z.string(),
  entries: z.array(resultEntryschema),
});

export const gameResultSchema = z.object({
  chains: z.array(chainResultSchema),
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
  drawingId: z.string().optional(),
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

export const gameResultPayloadSchema = z.object({
  gameResult: gameResultSchema,
});
