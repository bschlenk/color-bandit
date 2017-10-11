import { createCanvas } from 'canvas-everywhere';

/**
 * CanvasImage Class
 * Class that wraps the html image element and canvas.
 * It also simplifies some of the canvas context manipulation
 * with a set of helper functions.
 */
export default class CanvasImage {
  constructor(image) {
    const { width, height } = image;

    this.canvas = createCanvas(width, height);
    this.context = this.canvas.getContext('2d');

    this.width = width;
    this.height = height;

    this.context.drawImage(image, 0, 0, this.width, this.height);
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  update(imageData) {
    this.context.putImageData(imageData, 0, 0);
  }

  getPixelCount() {
    return this.width * this.height;
  }

  getImageData() {
    return this.context.getImageData(0, 0, this.width, this.height);
  }
}
