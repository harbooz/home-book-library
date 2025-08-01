import Tesseract from 'tesseract.js';

export async function ocrFromDataUrl(dataUrl) {
  const result = await Tesseract.recognize(dataUrl, 'eng', {
    logger: m => console.log('OCR', m.status, m.progress),

  });
  return result.data.text;
}

  