# simple-canvas-drawer 前端海报绘制 canvas 库

## 安装

- `npm install simple-canvas-drawer --registry=http://nexus.dlab.cn/repository/daddylab-fe/`或
- `yarn add simple-canvas-drawer --registry=http://nexus.dlab.cn/repository/daddylab-fe/`

## 使用

```javascript
import CanvasDrawer from 'simple-canvas-drawer';

const drawer = new CanvasDrawer({ width: 375, height: 650 });
drawer
  .draw([
    {
      type: 'block',
      width: 375,
      height: 650,
      top: 0,
      left: 0,
      backgroundColor: '#ccc',
    },
    {
      type: 'img',
      width: 375,
      src: 'https://cdn-test.daddylab.com/Upload/bms/20210917/075820/hbx8sj9f0tzj6hg3.jpg',
      bottom: 0,
      left: 0,
    },
    {
      type: 'text',
      text: 'simple-canvas-drawer是一个前端海报绘制的简易canvas库',
      top: 20,
      left: 30,
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
  - `CanvasDrawer`的构造函数，参数`config`的详细结构见下方`Config`相关说明
- `draw()`：
  - `args: drawItems: Array<ItemConfig>`
  - `return: Promise<CanvasDrawer>`
  - 绘制方法，传入一个数组参数，该数组中每个元素表示一个要绘制的图形，返回一个`Promise`。数组元素的详细结构见下方`ItemConfig`相关说明
- `dataURL`：`canvas`调用`toDataURL()`后获得的 base64 url
- `getTempFilePath()`
  - `args: component: any`
  - `return: Promise<string>`
  - 生成 canvas 绘制图片的临时文件路径，仅在微信小程序环境下可用，传入参数`component`参考小程序`wx.canvasToTempFilePath()`

#### Config

`CanvasDrawer`构造函数的参数结构：

```typescript
interface Config {
  canvas?: HTMLCanvasElement; // 绘制需要的canvas对象。微信小程序环境下必传；web环境可不传，simple-canvas-drawer会自动创建
  width?: number; // canvas的宽度，canvas未传的时候必传，传了canvas的时候可不传
  height?: number; // canvas的高度，同上
}
```

#### ItemConfig

`CanvasDrawer.draw()`方法参数数组的元素结构，允许如下类型：

- `BlockConfig`：绘制矩形色块的结构
  ```typescript
  interface BlockConfig {
    type: 'block';
    width: number; // 宽度
    height: number; // 高度
    backgroundColor?: string; // 填充颜色
    gradientBackground?:
      | Array<string>
      | {
          direction: 'horizontal' | 'vertical';
          colors: Array<string>;
        }; // 渐变色填充，有值的时候会覆盖backgroundColor，默认竖直方向渐变
    top?: number; // top,left,right,bottom,元素相对canvas的定位，top和bottom必要有一个，left和right必要有一个，bottom和right优先级更高
    left?: number;
    right?: number;
    bottom?: number;
    border?: string; // 矩形边框样式，格式与css border属性相同，线形支持dash和solid两种
    borderRadius?: number; // 矩形圆角半径值
  }
  ```
  - 关于边框和矩形尺寸的说明：
    - 矩形尺寸`width`和`height`是包括了边框的尺寸；
    - 当矩形同时有填充颜色和边框样式的情况下，填充颜色会覆盖边框的内侧一半。
- `TextConfig`：绘制文本的结构
  ```typescript
  interface TextConfig {
    type: 'text';
    text: string; // 文本内容
    fontSize?: number; // 文字尺寸，默认24
    fontWeight?: number | string;
    lineHeight?: number;
    color?: string;
    font?: string; // 文字样式，格式遵循原生CanvasRenderingContext2D.font，会覆盖fontSize和fontWeight
    top?: number; // 同BlockConfig
    left?: number;
    right?: number;
    bottom?: number;
    textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
    maxWidth?: number; // 文本最大宽度，设置了该值后，如果文本量超出宽度会自动换行
  }
  ```
- `ImgConfig`：绘制图片的结构
  ```typescript
  interface ImgConfig {
    type: 'img';
    src?: string; // 图片地址
    image?: HTMLImageElement; // 图片对象，会覆盖src，该属性会直接被绘制到canvas，如果想自己来加载图片就使用这个属性
    width?: number; // 图片宽度，如果没有设置height，图片会保持纵横比缩放至该宽度
    height?: number; // 图片高度，如果没有设置width，图片会保持纵横比缩放至该高度
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    borderRadius?: number; // 图片圆角
  }
  ```
- `CustomConfig`：自定义绘制结构
  ```typescript
  interface CustomConfig {
    type: 'custom';
    render: (ctx: CanvasRenderingContext2D) => void | Promise<void>;
    // render自定义函数，接收CanvasRenderingContext2D，使用者可以利用该函数进行自定义绘制
  }
  ```
