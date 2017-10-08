import Canvas from 'canvas';
import fs from 'fs';

const { Image } = Canvas;

export function createCanvas(width, height) {
  return new Canvas(width, height);
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    fs.readFile(src, (err, data) => {
      if (err) {
        return reject(err);
      }
      const image = new Image();
      image.src = data;
      return resolve(image);
    });
  });
}
