# 贡献指南 / Contributing Guide

感谢你对 PRUNplanner Unit Price Calculator 项目的关注！欢迎贡献代码、报告问题或提出建议。

## 目录 / Table of Contents

- [报告问题 / Reporting Bugs](#报告问题--reporting-bugs)
- [提出功能建议 / Feature Requests](#提出功能建议--feature-requests)
- [提交代码 / Code Contributions](#提交代码--code-contributions)
- [开发流程 / Development Workflow](#开发流程--development-workflow)
- [代码规范 / Code Standards](#代码规范--code-standards)

## 报告问题 / Reporting Bugs

如果你发现了 bug，请创建一个 Issue 并包含以下信息：

1. **问题描述** - 清晰简洁地描述问题
2. **复现步骤** - 如何重现这个问题
3. **预期行为** - 你期望发生什么
4. **实际行为** - 实际发生了什么
5. **截图** - 如果可能，添加截图
6. **环境信息**：
   - 浏览器及版本（Edge/Chrome）
   - 扩展版本
   - 操作系统

## 提出功能建议 / Feature Requests

我们欢迎所有功能建议！请创建 Issue 并：

- 使用 `[Feature Request]` 前缀
- 描述你想要的功能
- 说明这个功能能解决什么问题
- 如果可能，提供示例或 mockup

## 提交代码 / Code Contributions

### 1. Fork 项目

在 GitHub 上点击 "Fork" 按钮创建你自己的副本

### 2. 克隆到本地

```bash
git clone https://github.com/YOUR_USERNAME/prunplanner-extension.git
cd prunplanner-extension
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 4. 进行修改

- 保持代码简洁清晰
- 添加必要的注释
- 确保功能正常工作

### 5. 测试

在浏览器中测试你的修改：

1. 加载扩展到 `edge://extensions/` 或 `chrome://extensions/`
2. 访问 PRUNplanner 测试功能
3. 打开 `test-page.html` 进行本地测试

### 6. 提交 Commit

```bash
git add .
git commit -m "feat: add new feature" 
# 或
git commit -m "fix: resolve bug issue"
```

**Commit 消息规范**：
- `feat:` - 新功能
- `fix:` - 修复 bug
- `docs:` - 文档更新
- `style:` - 代码格式调整
- `refactor:` - 代码重构
- `test:` - 测试相关
- `chore:` - 构建/工具链相关

### 7. 推送到 GitHub

```bash
git push origin feature/your-feature-name
```

### 8. 创建 Pull Request

- 回到原始项目的 GitHub 页面
- 点击 "Compare & pull request"
- 填写 PR 描述
- 等待代码审查

## 开发流程 / Development Workflow

### 本地开发

```bash
# 1. 编辑 content.js
# 2. 在浏览器扩展页面重新加载
# 3. 测试功能
# 4. 重复直到满意
```

### 调试技巧

1. **查看控制台日志** - 按 F12 打开开发者工具
2. **使用测试页面** - 打开 `test-page.html`
3. **热重载** - 修改后在扩展页面点击"重新加载"

### 项目结构

```
prunplanner-extension/
├── content.js          # 主要功能代码
├── manifest.json       # 扩展配置
├── icons/              # 图标文件
├── test-page.html      # 测试页面
└── generate-icons.html # 图标生成工具
```

## 代码规范 / Code Standards

### JavaScript 规范

- 使用 `'use strict'` 模式
- 使用 IIFE 避免全局污染
- 变量使用 `const` 或 `let`，避免使用 `var`
- 函数命名使用 camelCase
- 常量使用 UPPER_SNAKE_CASE

### 注释规范

- 使用 JSDoc 格式注释函数
- 复杂逻辑添加行内注释
- 保持注释简洁明了

### 示例

```javascript
/**
 * Calculate unit price from deltaPrice and delta
 * 
 * @param {number} deltaPrice - The price delta
 * @param {number} delta - The quantity delta
 * @returns {number|null} The unit price or null if delta is 0
 */
function calculateUnitPrice(deltaPrice, delta) {
  if (!delta || delta === 0) {
    return null;
  }
  return deltaPrice / delta;
}
```

## 有问题？/ Questions?

如果你有任何问题，欢迎：

- 创建 Issue
- 在现有 Issue 中评论
- 联系项目维护者

## 行为准则 / Code of Conduct

- 尊重他人
- 接受建设性批评
- 关注对项目最有利的事情
- 对其他社区成员表现出同理心

---

感谢你的贡献！🎉
