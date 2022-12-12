const drawingsData: { id: string; data: string }[] = [];

function saveDrawingData(drawingId: string, drawingData: string) {
  drawingsData.push({ id: drawingId, data: drawingData });
}

function findDrawingData(drawingId: string) {
  const data = drawingsData.find((d) => d.id === drawingId);
  return data || null;
}

export const Drawings = {
  saveDrawingData,
  findDrawingData,
};
