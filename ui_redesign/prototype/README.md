# HosieryLab 3D Prototype

这是「夜色样品馆」的离线交互原型，部署到 `/prototype/` 后作为线上评审入口，主站目录数据仍保持独立。

## 启动

在项目目录运行：

```powershell
& 'D:\ComfyUI-V9.5\python\python.exe' -m http.server 8123 --directory 'E:\AI\Projects\hosierylab\ui_redesign\prototype'
```

然后打开 `http://127.0.0.1:8123/`。

原型使用本地 `vendor/three.module.js` 和 2000 条目录记录；`palette.html` 另保留 24 条校准样本，没有 CDN 依赖。画面中的 3D 是材质示意，目录图片仍是生成结果的主要证据。

