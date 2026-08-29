# 🎉 PRUNplanner Unit Price Calculator - Edge浏览器插件

## ✅ 项目完成总结

我已经成功为你创建了一个完整的Edge浏览器插件，用于在PRUNplanner的帝国材料IO表格中自动计算并显示单价列。

---

## 📁 文件结构

```
edge-extension/
├── manifest.json           # 插件配置文件 (Manifest V3)
├── content.js              # 核心功能脚本 (377行)
├── icons/                  # 插件图标目录
│   └── (需要生成 icon16.png, icon48.png, icon128.png)
├── generate-icons.html     # 图标生成工具
├── test-page.html          # 本地测试页面
├── install.ps1             # PowerShell安装脚本
├── README.md               # 完整文档
├── INSTALL.md              # 快速安装指南
└── PROJECT_SUMMARY.md      # 本文件
```

---

## 🎯 核心功能

### 1. 自动检测表格
- 智能识别PRUNplanner的帝国材料IO表格
- 通过表头文字匹配（"差值"、"利润差值"）
- 支持多种表格结构

### 2. 单价计算
```javascript
单价 = 利润差值 / 差值
Unit Price = deltaPrice / delta
```

### 3. 视觉优化
- 🟢 **绿色**：正单价（盈利）
- 🔴 **红色**：负单价（亏损）
- ⚪ **灰色**：无法计算（差值为0）

### 4. 实时更新
- 使用 MutationObserver 监听DOM变化
- 表格数据更新、增删行、重渲染时自动重新计算
- 列已存在时更新数值而非跳过（无需刷新页面）
- 值未变化时不写入DOM，防抖处理避免性能问题

---

## 🚀 快速开始

### 方法一：使用安装脚本（推荐）

```powershell
# 在PowerShell中运行
cd f:\github_project\frontend\edge-extension
.\install.ps1
```

### 方法二：手动安装

1. **生成图标**（可选）
   - 打开 `generate-icons.html`
   - 点击"生成所有图标"
   - 将图标文件移到 `icons/` 目录

2. **加载插件**
   - Edge浏览器打开：`edge://extensions/`
   - 开启"开发人员模式"
   - 点击"加载解压缩的扩展"
   - 选择 `edge-extension` 文件夹

3. **测试插件**
   - 访问 https://prunplanner.org
   - 或打开 `test-page.html` 本地测试

---

## 💡 工作原理

### 数据流程

```
1. 页面加载
   ↓
2. content.js 注入
   ↓
3. MutationObserver 监听DOM
   ↓
4. 查找包含"差值"和"利润差值"的表格
   ↓
5. 提取数值并计算单价
   ↓
6. 插入新列到表格末尾
   ↓
7. 持续监听变化，更新已有列的数值（无需刷新）
```

### 关键代码片段

```javascript
// 计算单价
function calculateUnitPrice(deltaPrice, delta) {
  if (!delta || delta === 0) {
    return null;
  }
  return deltaPrice / delta;
}

// 查找表格
function findMaterialIOTable() {
  const allTables = document.querySelectorAll('table');
  for (const table of allTables) {
    const headers = Array.from(table.querySelectorAll('th'));
    const headerTexts = headers.map(h => h.textContent.trim());
    
    const hasDelta = headerTexts.some(text => 
      text === '差值' || text === 'delta'
    );
    const hasDeltaPrice = headerTexts.some(text => 
      text === '利润差值' || text === 'deltaPrice'
    );
    
    if (hasDelta && hasDeltaPrice) {
      return table;
    }
  }
  return null;
}
```

---

## 📊 测试用例

| 材料 | 差值 | 利润差值 | 计算过程 | 单价 | 颜色 |
|------|------|----------|----------|------|------|
| DW   | 100  | 500      | 500/100  | 5.00 | 🟢 绿 |
| O2   | -50  | -200     | -200/-50 | 4.00 | 🟢 绿 |
| FE   | 75   | 375.50   | 375.5/75 | 5.01 | 🟢 绿 |
| AL   | -30  | -90      | -90/-30  | 3.00 | 🟢 绿 |
| CU   | 0    | 0        | 0/0      | —    | ⚪ 灰 |

---

## 🔧 配置选项

在 `content.js` 顶部可以自定义配置：

```javascript
const CONFIG = {
  columnHeader: '单价\nUnit Price',  // 列标题
  decimalPlaces: 2,                   // 小数位数
  retryInterval: 1000,                // 重试间隔（毫秒）
  maxRetries: 30,                     // 最大重试次数
  debounceDelay: 500                  // 防抖延迟（毫秒）
};
```

---

## 🌐 兼容性

- ✅ Microsoft Edge (Chromium 86+)
- ✅ Google Chrome (86+)
- ✅ 其他 Chromium 内核浏览器
- ✅ PRUNplanner.org 所有页面
- ✅ 本地测试页面

---

## 🐛 故障排除

### 问题1：单价列没有显示

**解决方案：**
1. 刷新页面（F5）
2. 检查扩展是否已启用
3. 确认在正确的页面（帝国视图）
4. 按F12查看控制台日志

### 问题2：计算结果不正确

**解决方案：**
1. 检查表头文字是否匹配
2. 确认数值格式正确
3. 查看控制台调试信息

### 问题3：图标缺失警告

**解决方案：**
- 图标不影响功能，可以忽略
- 或运行 `generate-icons.html` 生成图标

---

## 📝 日志查看

插件默认不输出调试日志，保持控制台简洁。
如需排查问题，打开浏览器开发者工具（F12）查看是否有报错信息。

---

## 🎨 自定义样式

如果需要修改单价列的样式，编辑 `content.js` 中的CSS：

```javascript
// 表头样式
headerCell.style.cssText = `
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  ...
`;

// 数据单元格样式
newCell.style.cssText = `
  padding: 8px;
  text-align: center;
  font-family: monospace;
  ...
`;
```

---

## 🔒 安全说明

- ✅ **无权限要求**：manifest.json 中 permissions 为空
- ✅ **仅客户端运行**：不发送任何数据到服务器
- ✅ **只读访问**：仅读取和修改DOM，不修改原始数据
- ✅ **开源代码**：所有代码可见可审计

---

## 📈 性能优化

1. **防抖处理**：避免频繁DOM操作
2. **智能匹配**：快速定位目标表格
3. **增量更新**：仅在表格变化时重新计算
4. **值未变化不写入DOM**：避免触发监听反馈循环
5. **资源清理**：页面卸载时断开监听器

---

## 🎓 技术栈

- **Manifest V3**：最新的浏览器扩展标准
- **Vanilla JavaScript**：无依赖，轻量高效
- **MutationObserver**：高效的DOM变化监听
- **CSS3**：渐变色、动画效果

---

## 📞 支持与反馈

如有问题或建议：

1. 查看 [README.md](README.md) 获取完整文档
2. 查看 [INSTALL.md](INSTALL.md) 获取安装帮助
3. 检查浏览器控制台日志
4. 提交 Issue 或联系开发者

---

## 📄 许可证

MIT License - 可自由使用、修改和分发

---

## 🎯 下一步

### 立即可用
1. ✅ 运行 `.\install.ps1` 安装插件
2. ✅ 访问 PRUNplanner 测试功能
3. ✅ 查看单价列自动添加

### 可选优化
- [ ] 生成插件图标
- [ ] 自定义颜色主题
- [ ] 添加更多计算指标
- [ ] 支持其他语言

---

## ✨ 总结

这个插件完全满足你的需求：
- ✅ 自动计算单价（利润差值 / 差值）
- ✅ 显示在表格最后一列
- ✅ 实时监听表格变化
- ✅ 视觉友好，颜色编码
- ✅ 易于安装和使用

**现在就可以开始使用了！** 🚀
