import { Socket } from 'socket.io';
import { z } from 'zod';
import { Drawings } from '../../drawings';
import { drawingDataPayloadSchema, requestDrawingDataPayloadSchema } from '../schemas';

export function requestDrawingDataHandler(socket: Socket, payloadRaw: any) {
  const { drawingId } = requestDrawingDataPayloadSchema.parse(payloadRaw);

  const drawingData = Drawings.findDrawingData(drawingId);
  if (!drawingData) {
    // TODO: Send an error or something
    return;
  }

  const response: z.infer<typeof drawingDataPayloadSchema> = {
    drawing: drawingData,
  };

  socket.emit('drawingData', response);
}
