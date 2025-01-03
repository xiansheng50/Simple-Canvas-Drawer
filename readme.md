# Simple Canvas Drawer, easier for front-end to create posters/images

## Install

- `npm install simple-canvas-drawer` or
- `yarn add simple-canvas-drawer`

## Usage

```javascript
import CanvasDrawer from 'simple-canvas-drawer';

const drawer = new CanvasDrawer({ width: 400, height: 650 });
drawer
  .draw([
    {
      type: 'block',
      width: 400,
      height: 650,
      top: 0,
      left: 0,
      backgroundColor: '#ccc',
    },
    {
      type: 'img',
      width: 375,
      src: 'https://i.postimg.cc/yWsBgkkg/Comfy-UI-temp-mlyka-00004.png',
      bottom: 0,
      left: 0,
    },
    {
      type: 'text',
      text: 'Simple Canvas-Drawer is a simple canvas library for drawing posters',
      top: 20,
      left: 30,
      maxWidth: 360,
    },
  ])
  .then(() => {
    console.log(drawer.dataURL);
  });
```

## API

#### CanvasDrawer

- `constructor()`：
  - `args: config: Config`
  - `return: CanvasDrawer`
  - the constructor method of `CanvasDrawer`. For detailed structure of the `config` parameter, please refer to the related `Config` explanation below
- `draw()`：
  - `args: drawItems: Array<ItemConfig>`
  - `return: Promise<CanvasDrawer>`
  - the drawing method, accepts an array as a parameter, where each element of the array represents a shape to be drawn. It returns a `Promise`. For the detailed structure of the array elements, please refer to the `ItemConfig` explanation below
- `dataURL`：the base64 URL obtained after calling the `toDataURL()` method on the canvas element
- `getTempFilePath()`
  - `args: component: any`
  - `return: Promise<string>`
  - generates a temporary file path for the canvas drawing image, available only in the WeChat mini-program environment. The input parameter `component` refers to the `wx.canvasToTempFilePath()` method in the WeChat mini-program.

#### Config

The parameter structure for the `CanvasDrawer` constructor:

```typescript
interface Config {
  canvas?: HTMLCanvasElement; // the canvas element required for drawing. Required in the WeChat mini-program environment; in the web environment, it can be omitted, as Simple Canvas Drawer will automatically create one
  width?: number; // width of canvas, required when canvas is omitted
  height?: number; // height of canvas, same as width
}
```

#### ItemConfig

The element structure for the array parameter of `CanvasDrawer.draw()`, can be of the following types：

- `BlockConfig`: Rectangular color block
  ```typescript
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
        }; // gradient background. when passing a color string array, direction will be defaultly set vertical
    top?: number; // top,left,right,bottom,are the positioning relative to the canvas, one of 'left' or 'right' must be included, same as 'top' and 'bottom'
    left?: number;
    right?: number;
    bottom?: number;
    border?: string; // border style, with the format similar to the CSS border property, supports two types of line styles: dashed and solid
    borderRadius?: number; // borderRadius
  }
  ```
  - About the border and size:
    - `width` and `height` includes the border;
    - if `backgroundColor` and `border` are both set, half of the border will be covered by the background color.
- `TextConfig`: Text block
  ```typescript
  interface TextConfig {
    type: 'text';
    text: string; // text content
    fontSize?: number; // default set 24
    fontWeight?: number | string;
    lineHeight?: number;
    color?: string;
    font?: string; // same format with CanvasRenderingContext2D.font, will cover fontSize and fontWeight
    top?: number; // same with BlockConfig
    left?: number;
    right?: number;
    bottom?: number;
    textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
    maxWidth?: number; // max width of text，if set, text will wrap automatically
  }
  ```
- `ImgConfig`: image block
  ```typescript
  interface ImgConfig {
    type: 'img';
    src?: string;
    image?: HTMLImageElement; // image element, will cover src
    width?: number; // image width, if height is not set, image will keep aspect ratio
    height?: number; // image height, if width is not set, image will keep aspect ratio
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    borderRadius?: number;
  }
  ```
- `CustomConfig`
  ```typescript
  interface CustomConfig {
    type: 'custom';
    render: (ctx: CanvasRenderingContext2D) => void | Promise<void>;
    // custom render method
  }
  ```
