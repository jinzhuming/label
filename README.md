# label

一款方便快捷的标注图像与视频，将支持 pc、macos、web 等多个平台

### 技术架构：

* 基础: React + TypeScript
* canvas: 绘图， Konva
* 视频解码: wasm ffmpeg
* css: emotion.js css in js 方案
* 数据存储: store.js
* 跨平台: 核心 canvas 标注图像以及视频解码部分将支持 Web 端使用，剩余定制化功能将使用 Electron 做多平台分发封装

## 开发进度

目前正在开发 canvas 绘图部分

## Getting Started

Install dependencies,

```bash
$ yarn
```

Start the dev server,

```bash
$ yarn start
```
