type ItemConfig =
  | BlockConfig
  | TextConfig
  | ImgConfig
  | TriangleConfig
  | CustomConfig;

interface BlockConfig {
  type: 'block';
  width: number;
  height: number;
  backgroundColor?: string;
  gradientBackground?:
    | Array<string>
    | {
        direction: 'horizontal' | 'vertical';
        colors: Array<string>;
      };
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  border?: string;
  borderRadius?: number;
}

interface TextConfig {
  type: 'text';
  text: string;
  fontSize?: number;
  fontWeight?: number | string;
  lineHeight?: number;
  color?: string;
  font?: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
  maxWidth?: number;
}

interface ImgConfig {
  type: 'img';
  src?: string;
  image?: HTMLImageElement;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  borderRadius?: number;
}
type Point = [number, number];
interface TriangleConfig {
  type: 'triangle';
  border?: string;
  backgroundColor?: string;
  points?: [Point, Point, Point];
}
interface CustomConfig {
  type: 'custom';
  render: (ctx: CanvasRenderingContext2D) => void | Promise<void>;
}

interface Config {
  canvas?: HTMLCanvasElement;
  width?: number;
  height?: number;
}

// eslint-disable-next-line no-var
declare var wx: any;

class CanvasDrawer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private inWeapp: boolean;
  constructor({ canvas, width, height }: Config) {
    this.canvas = canvas || document.createElement('canvas');
    width && (this.canvas.width = width);
    height && (this.canvas.height = height);
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    try {
      this.inWeapp = !!(wx && wx.getUpdateManager);
    } catch (e) {
      this.inWeapp = false;
    }
  }

  public async draw(drawItems: Array<ItemConfig>): Promise<CanvasDrawer> {
    for (let i = 0; i < drawItems.length; i++) {
      const item = drawItems[i];
      this.ctx.save();
      switch (item.type) {
        case 'block':
          this.drawBlock(item);
          break;
        case 'text':
          this.drawText(item);
          break;
        case 'img':
          await this.drawImg(item);
          break;
        case 'custom':
          await item.render(this.ctx);
          break;
        default:
          throw `不支持的元素类型${item.type}`;
      }
      this.ctx.restore();
    }
    return this;
  }

  public get dataURL(): string {
    return this.canvas.toDataURL();
  }

  public getTempFilePath(component: any): Promise<string> {
    if (!this.inWeapp) throw '当前不处于微信小程序环境！';
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath(
        {
          canvas: this.canvas,
          success: ({ tempFilePath }: { tempFilePath: string }) => {
            resolve(tempFilePath);
          },
          fail: (res: { errMsg: string }) => {
            reject(res.errMsg);
          },
        },
        component || null
      );
    });
  }

  private drawBlock(block: BlockConfig): void {
    if (block.borderRadius) {
      return this.drawRoundCornerBlock(block);
    }
    let borderWidth = 0;
    if (block.border) {
      borderWidth = this.setBorder(block.border);
    }
    const [x, y] = this.calcBlockStart(block);
    this.ctx.beginPath();
    this.ctx.rect(
      x + borderWidth / 2,
      y + borderWidth / 2,
      block.width - borderWidth,
      block.height - borderWidth
    );
    block.border && this.ctx.stroke();
    this.blockGradient(block, borderWidth, { x, y });
    if (block.backgroundColor) {
      this.ctx.fillStyle = block.backgroundColor;
    }
    (block.gradientBackground || block.backgroundColor) && this.ctx.fill();
  }

  private drawRoundCornerBlock(block: BlockConfig): void {
    let borderWidth = 0;
    if (block.border) {
      borderWidth = this.setBorder(block.border);
    }
    const [x, y] = this.calcBlockStart(block);
    this.blockGradient(block, borderWidth, { x, y });
    if (block.backgroundColor) {
      this.ctx.fillStyle = block.backgroundColor;
      borderWidth = borderWidth * 2;
      this.ctx.lineWidth = borderWidth;
    }
    const drawLeft = x + borderWidth / 2;
    const drawTop = y + borderWidth / 2;
    const drawWidth = block.width - borderWidth;
    const drawHeight = block.height - borderWidth;
    const drawRadius = (block.borderRadius as number) - borderWidth / 2;
    this.roundCornerPath(drawLeft, drawTop, drawWidth, drawHeight, drawRadius);
    this.ctx.stroke();
    (block.gradientBackground || block.backgroundColor) && this.ctx.fill();
  }

  private calcBlockStart(
    block: BlockConfig | ImgConfig,
    size?: { width: number; height: number }
  ): [number, number] {
    const width = size ? size.width : (block.width as number);
    const height = size ? size.height : (block.height as number);
    const x =
      block.right || block.right === 0
        ? this.canvas.width - block.right - width
        : (block.left as number);
    const y =
      block.bottom || block.bottom === 0
        ? this.canvas.height - block.bottom - height
        : (block.top as number);
    return [x, y];
  }

  private roundCornerPath(
    drawLeft: number,
    drawTop: number,
    drawWidth: number,
    drawHeight: number,
    drawRadius: number
  ): void {
    const leftCenterX = drawLeft + drawRadius;
    const topCenterY = drawTop + drawRadius;
    const rightCenterX = drawLeft + drawWidth - drawRadius;
    const bottomCenterY = drawTop + drawHeight - drawRadius;
    this.ctx.beginPath();
    // 左上圆弧
    this.ctx.arc(leftCenterX, topCenterY, drawRadius, -Math.PI, -Math.PI / 2);
    // 顶部水平线
    // this.ctx.moveTo(leftCenterX, drawTop);
    this.ctx.lineTo(rightCenterX, drawTop);
    // 右上弧线
    this.ctx.arc(rightCenterX, topCenterY, drawRadius, -Math.PI / 2, 0);
    // 右侧竖线
    this.ctx.lineTo(drawLeft + drawWidth, bottomCenterY);
    // 右下弧线
    this.ctx.arc(rightCenterX, bottomCenterY, drawRadius, 0, Math.PI / 2);
    // 底部水平线
    this.ctx.lineTo(leftCenterX, drawTop + drawHeight);
    // 左下弧线
    this.ctx.arc(leftCenterX, bottomCenterY, drawRadius, Math.PI / 2, Math.PI);
    // 左侧竖线
    this.ctx.closePath();
  }

  private blockGradient(
    block: BlockConfig,
    borderWidth: number,
    start: { x: number; y: number }
  ): void {
    if (block.gradientBackground) {
      let direction = 'vertical';
      let gradientColors = block.gradientBackground as Array<string>;
      if (!(block.gradientBackground instanceof Array)) {
        direction = block.gradientBackground.direction;
        gradientColors = block.gradientBackground.colors;
      }
      const gradientEnd: [number, number] =
        direction === 'horizontal'
          ? [block.width - 2 * borderWidth, start.y + borderWidth]
          : [start.x + borderWidth, block.height + start.y - 2 * borderWidth];
      const gradient = this.ctx.createLinearGradient(
        start.x + borderWidth,
        start.y + borderWidth,
        ...gradientEnd
      );
      const colorGap = 1 / (gradientColors.length - 1);
      gradientColors.forEach((color, index) => {
        gradient.addColorStop(colorGap * index, color);
      });
      this.ctx.fillStyle = gradient;
    }
  }

  private setBorder(border: string): number {
    const styles = border.split(' ');
    const dash = styles.includes('dash');
    const [lineWidth, lineColor] = styles.filter(
      l => l !== 'dash' && l !== 'solid'
    );
    dash && this.ctx.setLineDash([5, 5]);
    lineColor && (this.ctx.strokeStyle = lineColor);
    if (lineWidth) {
      const width = parseInt(lineWidth);
      this.ctx.lineWidth = width;
      return width;
    }
    return 0;
  }

  private drawText(textBlock: TextConfig): void {
    this.ctx.textBaseline = 'top';
    textBlock.color && (this.ctx.strokeStyle = textBlock.color);
    let font = '';
    let fontSize = 24;
    if (textBlock.font) {
      font = textBlock.font as string;
      const result = font.match(/([0-9])+px/);
      fontSize = result ? parseInt(result[1]) : 10;
    } else {
      font = `${textBlock.fontWeight ? `${textBlock.fontWeight} ` : ''}${
        textBlock.fontSize ? `${textBlock.fontSize}px ` : ''
      }`;
      textBlock.fontSize && (fontSize = textBlock.fontSize as number);
      font = font
        ? `${font} PingFangSC-Regular,PingFang SC`
        : '24px PingFangSC-Regular,PingFang SC';
    }
    this.ctx.font = font;
    this.ctx.textAlign = textBlock.textAlign || 'left';
    textBlock.color && (this.ctx.fillStyle = textBlock.color);

    if (textBlock.maxWidth) {
      return this.drawMultiLineText(textBlock, fontSize);
    }
    const [x, y] = this.calcSingleLineTextStart(textBlock, fontSize);
    this.ctx.fillText(textBlock.text, x, y);
  }

  private calcSingleLineTextStart(
    textBlock: TextConfig,
    fontSize: number
  ): [number, number] {
    let y: number;
    if (textBlock.lineHeight) {
      y =
        textBlock.bottom || textBlock.bottom === 0
          ? this.canvas.height -
            textBlock.bottom -
            textBlock.lineHeight +
            (textBlock.lineHeight - fontSize) / 2
          : (textBlock.top as number) + (textBlock.lineHeight - fontSize) / 2;
    } else {
      y =
        textBlock.bottom || textBlock.bottom === 0
          ? this.canvas.height - textBlock.bottom - fontSize
          : (textBlock.top as number);
    }
    const x =
      textBlock.right || textBlock.right === 0
        ? this.canvas.width -
          textBlock.right -
          this.ctx.measureText(textBlock.text).width
        : (textBlock.left as number);
    return [x, y];
  }

  private drawMultiLineText(textBlock: TextConfig, fontSize: number): void {
    const { maxWidth, lineHeight, text } = textBlock;
    const textLines = [];
    let index = 0;
    let lastIndex = 0;
    let totalWidth = this.ctx.measureText(text).width;
    while (totalWidth > (maxWidth as number)) {
      index = Math.floor(
        ((maxWidth as number) / totalWidth) * (text.length - lastIndex)
      );
      let lineText = text.slice(lastIndex, index);
      let lineWidth = this.ctx.measureText(lineText).width;
      while (lineWidth < (maxWidth as number)) {
        index += 1;
        lineText = text.slice(lastIndex, index);
        lineWidth = this.ctx.measureText(lineText).width;
      }
      while (lineWidth > (maxWidth as number)) {
        index -= 1;
        lineText = text.slice(lastIndex, index);
        lineWidth = this.ctx.measureText(lineText).width;
      }
      textLines.push(lineText);
      totalWidth = this.ctx.measureText(text.slice(index)).width;
      lastIndex = index;
    }
    if (index < text.length) {
      textLines.push(text.slice(index));
    }

    const [x, startY] = this.calcTextStart(
      textBlock,
      fontSize,
      textLines.length
    );
    let y = startY;
    textLines.forEach(lineText => {
      this.ctx.fillText(lineText, x, y);
      y += lineHeight || fontSize;
    });
  }

  private calcTextStart(
    textBlock: TextConfig,
    fontSize: number,
    lineCount: number
  ): [number, number] {
    let y: number;
    if (textBlock.lineHeight) {
      const height = lineCount * textBlock.lineHeight;
      y =
        textBlock.bottom || textBlock.bottom === 0
          ? this.canvas.height -
            textBlock.bottom -
            height +
            (textBlock.lineHeight - fontSize) / 2
          : (textBlock.top as number) + (textBlock.lineHeight - fontSize) / 2;
    } else {
      const height = lineCount * fontSize;
      y =
        textBlock.bottom || textBlock.bottom === 0
          ? this.canvas.height - textBlock.bottom - height
          : (textBlock.top as number);
    }
    const x =
      textBlock.right || textBlock.right === 0
        ? this.canvas.width - textBlock.right - (textBlock.maxWidth as number)
        : (textBlock.left as number);
    return [x, y];
  }

  private async drawImg(imgBlock: ImgConfig): Promise<void> {
    const img = imgBlock.image || (await this.loadImg(imgBlock.src as string));
    let { width, height } = imgBlock;
    if (!width && !height) {
      width = img.width;
      height = img.height;
    } else if (!height) {
      height = img.height * ((width as number) / img.width);
    } else if (!width) {
      width = img.width * (height / img.height);
    }
    if (imgBlock.borderRadius) {
      this.drawRoundCornerImg(imgBlock, img, width as number, height);
      return;
    }

    this.ctx.drawImage(
      img,
      ...this.calcBlockStart(imgBlock, { width: width as number, height }),
      width as number,
      height as number
    );
  }

  private loadImg(src: string): Promise<HTMLImageElement> {
    const img: HTMLImageElement = this.inWeapp
      ? (this.canvas as any).createImage()
      : new Image();
    this.inWeapp || (img.crossOrigin = 'Anonymous');
    img.src = src;
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject('图片加载失败');
    });
  }

  private drawRoundCornerImg(
    imgBlock: ImgConfig,
    img: HTMLImageElement,
    width: number,
    height: number
  ): void {
    const [x, y] = this.calcBlockStart(imgBlock, { width, height });
    const { borderRadius } = imgBlock;
    this.roundCornerPath(x, y, width, height, borderRadius as number);
    this.ctx.clip();
    this.ctx.drawImage(img, x, y, width, height);
  }
}

export default CanvasDrawer;
