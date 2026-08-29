# PRUNplanner Unit Price Calculator - Browser Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 简介 / Introduction

这是一个专为 [PRUNplanner](https://prunplanner.org) 设计的浏览器插件（支持 Edge/Chrome），用于在材料IO表格中自动计算并显示单价列。

This is a specialized browser extension for [PRUNplanner](https://prunplanner.org) (Edge/Chrome compatible) that automatically calculates and displays a "Unit Price" column in Material IO tables.

## 功能 / Features

- ✨ **自动检测表格** - 自动识别帝国材料IO表格和基地详情表格
- 🧮 **单价计算** - 单价 = 利润差值 / 差值 (Unit Price = deltaPrice / delta)
- 🎨 **颜色编码** - 正值显示绿色，负值显示红色
- 🔄 **实时更新** - 监听DOM变化，数据更新、增删行、重渲染时自动重算
- 🌐 **多语言支持** - 支持中文和英文界面
- 📊 **双表格支持** - 同时支持帝国视图和基地详情视图

## 安装说明 / Installation Guide

### 方法一：开发者模式加载（推荐） / Method 1: Load Unpacked (Recommended)

1. **打开Edge扩展管理页面**
   - 在地址栏输入：`edge://extensions/`
   - 或点击菜单：`...` → `扩展` → `管理扩展`

2. **启用开发者模式**
   - 在页面左侧找到"开发人员模式"开关
   - 将其打开

3. **加载扩展**
   - 点击"加载解压缩的扩展"按钮
   - 选择本项目的根目录（包含 `manifest.json` 的目录）
   - 确认加载

4. **验证安装**
   - 扩展列表中应显示 "PRUNplanner Unit Price Calculator"
   - 状态应为"已启用"

### 方法二：打包安装 / Method 2: Packaged Installation

1. 在 `edge://extensions/` 或 `chrome://extensions/` 页面点击"打包扩展"
2. 选择本项目根目录
3. 将生成的 `.crx` 文件拖放到扩展管理页面

## 使用方法 / Usage

1. **访问 PRUNplanner**
   - 打开 [prunplanner.org](https://prunplanner.org)
   - 导航到帝国视图（Empire View）或基地详情页面（Plan View）

2. **自动生效**
   - 插件会自动检测材料IO表格
   - 在表格最后一列添加"单价"列
   - 自动计算并显示单价数值

3. **查看结果**
   - 表头显示：`单价 / Unit Price`
   - 数值格式：保留2位小数
   - 颜色标识：
     - 🟢 绿色：正单价
     - 🔴 红色：负单价
     - ⚪ 灰色：无法计算（差值为0）

## 支持的表格 / Supported Tables

### 1. 帝国材料IO表格 (Empire Material IO)
- **位置**: 帝国视图 (Empire View)
- **列识别**: `差值` + `利润差值`
- **计算公式**: 单价 = 利润差值 / 差值

### 2. 基地详情表格 (Plan Material IO)
- **位置**: 基地详情页 (Plan View)
- **列识别**: `Δ` + `ȼ / 天`
- **计算公式**: 单价 = ȼ / 天 / Δ

## 计算公式 / Calculation Formulas

### 帝国材料IO表格 / Empire Material IO Table
```
单价 (Unit Price) = 利润差值 (deltaPrice) / 差值 (delta)
```

### 基地详情表格 / Plan Material IO Table
```
单价 (Unit Price) = ȼ / 天 (price) / Δ (delta)
```

### 示例 / Example

| 材料 | 差值 | 利润差值 | 单价 |
|------|------|----------|------|
| DW   | 100  | 500      | 5.00 |
| O2   | -50  | -200     | 4.00 |
| FE   | 0    | 100      | —    |

## 技术细节 / Technical Details

### 文件结构 / File Structure

```
prunplanner-extension/
├── manifest.json          # 扩展配置文件 (Manifest V3)
├── content.js             # 主要内容脚本
├── icons/                 # 扩展图标
│   ├── icon16.png        # 16x16 图标
│   ├── icon48.png        # 48x48 图标
│   └── icon128.png       # 128x128 图标
├── generate-icons.html    # 图标生成工具
├── test-page.html         # 本地测试页面
├── install.ps1            # Windows 快速安装脚本
├── README.md              # 说明文档
├── INSTALL.md             # 详细安装指南
├── PROJECT_SUMMARY.md     # 项目总结
├── LOCATION_CHANGE.md     # 位置变更说明
├── package.json           # NPM 配置
└── .gitignore             # Git 忽略规则
```

### 工作原理 / How It Works

1. **DOM监听** - 使用 MutationObserver 监听页面变化
2. **表格识别** - 通过表头文字智能识别材料IO表格（支持多种列名）
3. **数据提取** - 从"差值/Δ"和"利润差值/ȼ / 天"列提取数值
4. **计算显示** - 计算单价并插入新列到表格最后
5. **实时更新** - 表格数据变化（值更新、增删行、重渲染）时自动重新计算已有列，无需刷新

### 兼容性 / Compatibility

- ✅ Microsoft Edge (Chromium)
- ✅ Google Chrome
- ✅ 其他 Chromium 内核浏览器
- ✅ PRUNplanner.org 所有页面

## 故障排除 / Troubleshooting

### 问题：单价列没有显示

**解决方案：**
1. 检查扩展是否已启用并已重新加载最新版本
2. 确认你在正确的页面（帝国视图或基地详情）
3. 表格数据更新后插件会自动重新计算，无需手动刷新
4. 打开浏览器控制台查看错误信息（F12）

### 问题：计算结果不正确

**解决方案：**
1. 检查表格是否包含"差值"和"利润差值"列
2. 确认数值格式正确（无特殊字符）
3. 在控制台查看调试信息

### 查看日志 / View Logs

插件默认不输出调试日志，保持控制台简洁。如需排查问题，打开浏览器开发者工具（F12）查看是否有报错信息。

## 开发说明 / Development Notes

### 本地开发 / Local Development

```bash
# 进入项目目录
cd prunplanner-extension

# 编辑 content.js
# 测试后在 edge://extensions/ 或 chrome://extensions/ 中重新加载
```

### 生成图标 / Generate Icons

如果图标文件缺失，可以使用提供的工具生成：

1. 在浏览器中打开 `generate-icons.html`
2. 点击"生成所有图标"按钮
3. 将下载的图标文件移动到 `icons/` 目录

### 测试 / Testing

打开 `test-page.html` 进行本地测试，模拟材料IO表格环境。

### 修改配置 / Modify Configuration

在 `content.js` 顶部可以修改配置：

```javascript
const CONFIG = {
  columnHeader: '单价\nUnit Price',  // 列标题
  decimalPlaces: 2,                   // 小数位数
  retryInterval: 1000,                // 重试间隔（毫秒）
  maxRetries: 30,                     // 最大重试次数
  debounceDelay: 500                  // 防抖延迟（毫秒）
};
```

### 发布流程 / Release Workflow

项目包含一个手动触发的 GitHub Actions 工作流（`.github/workflows/release.yml`），用于自动构建打包、打标签并发布 Release。

**触发方式：**

1. 将代码推送到 GitHub 仓库（需先在 `package.json` 的 `repository` 字段填写实际仓库地址）
2. 打开仓库的 **Actions** 页面，选择 **Build & Release** 工作流
3. 点击 **Run workflow** 手动执行

**工作流自动完成：**

1. 从 `manifest.json` 读取版本号（如 `1.2.0`）
2. 构建打包为 `PRUNplanner-Unit-Price-Calculator-<版本号>.zip`（全量版）
3. 校验包内版本号与命名一致，不一致则构建失败
4. 创建并推送 `v<版本号>` 标签（已存在则跳过）
5. 创建 GitHub Release 并上传 zip 资产（已存在则覆盖更新资产，可安全重跑）

**可选参数：**

- `dry_run`（默认关闭）：勾选后仅构建与打标签，不创建 Release，用于发布前验证

**版本升级流程：**

1. 修改 `manifest.json` 和 `package.json` 中的 `version` 字段
2. 提交并推送代码
3. 手动触发 **Build & Release** 工作流
4. 标签与 Release 自动按新版本号生成

## 版本历史 / Version History

### v1.2.0 (2026-08-29)
- 🐛 修复表格更新后单价列不自动重算的问题（不再需要刷新页面）
- 🔄 数据更新、增删行、重渲染时自动重新计算已有单价列，新行自动补列
- ⚡ 值未变化时不写入DOM，避免无效刷新
- 📝 更新文档

### v1.1.0 (2026-06-07)
- ✨ 新增基地详情表格支持
- 🔧 优化表格识别逻辑（支持 Δ 符号）
- 🐛 移除调试日志
- 📝 更新文档

### v1.0.0 (2026-06-07)
- ✨ 初始版本发布
- 🧮 实现单价计算功能
- 🎨 添加颜色编码
- 🔄 支持实时更新

## 许可证 / License

MIT License

## 支持与反馈 / Support & Feedback

如有问题或建议，请提交 Issue 或联系开发者。

---

**注意：** 此插件仅在客户端运行，不会修改PRUNplanner的服务器数据。
**Note:** This extension runs client-side only and does not modify PRUNplanner server data.
