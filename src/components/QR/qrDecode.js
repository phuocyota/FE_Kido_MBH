export async function decodeQr(source, width, height) {
  const { default: jsQR } = await import("jsqr");
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 1600 / Math.max(width, height));
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  return jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: "attemptBoth" })?.data || "";
}

export async function decodeQrFile(file) {
  if (!file.type.startsWith("image/")) throw new Error("Vui lòng chọn một tệp hình ảnh.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return await decodeQr(image, image.naturalWidth, image.naturalHeight);
  } finally {
    URL.revokeObjectURL(url);
  }
}
