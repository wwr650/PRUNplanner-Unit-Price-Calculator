# 📍 项目位置变更通知

## ✅ 已完成迁移

PRUNplanner Unit Price Calculator 扩展项目已经从 frontend 项目迁移到独立项目。

### 📂 新旧位置对比

**旧位置（已删除）：**
f:\github_project\frontend\edge-extension\

**新位置（当前）：**
f:\github_project\prunplanner-extension\

---

## 📁 新项目结构

f:\github_project\
├── frontend\                    # PRUNplanner 前端项目
│   └── (原有文件)
│
└── prunplanner-extension\       # ✨ 浏览器扩展项目（独立）
    ├── manifest.json         # 扩展配置
    ├── content.js           # 核心脚本
    ├── package.json          # 项目配置
    ├── README.md             # 完整文档
    ├── INSTALL.md            # 安装指南
    ├── PROJECT_SUMMARY.md    # 项目总结
    ├── install.ps1           # 安装脚本
    ├── generate-icons.html   # 图标生成器
    ├── test-page.html        # 测试页面
    ├── LOCATION_CHANGE.md    # 本文件
    ├── .gitignore               # Git忽略配置
    └── icons/                # 图标目录

---

## 🎯 迁移原因

1. **独立性** - 扩展项目独立于前端项目，便于单独维护和发布
2. **清晰的边界** - 前端代码和扩展代码分离
3. **版本管理** - 可以独立进行版本控制和发布
4. **简化结构** - 避免在前端项目中混入扩展代码

---

## 🔄 影响说明

### ✅ 不受影响的
- 前端项目 (frontend/) 正常运行
- 扩展功能完全保持不变
- 所有文档和脚本继续有效

### ⚠️ 需要注意的
- 安装扩展时需要指向新路径：f:\github_project\prunplanner-extension\
- 如果之前已加载旧位置的扩展，需要重新加载

---

## 🚀 重新加载扩展（如需要）

如果你之前已经加载了这个扩展：

### 步骤1：移除旧扩展
1. 打开 edge://extensions/
2. 找到 "PRUNplanner Unit Price Calculator"
3. 点击"移除"

### 步骤2：加载新位置
1. 点击"加载解压缩的扩展"
2. 选择新路径：f:\github_project\prunplanner-extension\
3. 确认加载成功

### 或使用PowerShell脚本
powershell
cd f:\github_project\prunplanner-extension
.\install.ps1

---

## 📝 下一步

### 立即使用
powershell
# 进入新项目目录
cd f:\github_project\prunplanner-extension

# 运行安装脚本
.\install.ps1

### 版本控制（可选）
bash
# 进入项目目录
cd f:\github_project\prunplanner-extension

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: PRUNplanner Unit Price Calculator v1.0.0"

---

## 📞 问题排查

### 问题：找不到扩展文件

**解决方案：**
确认在新位置：
powershell
Test-Path "f:\github_project\prunplanner-extension\manifest.json"

### 问题：扩展无法加载

**解决方案：**
1. 检查路径是否正确
2. 确认 manifest.json 存在
3. 查看浏览器控制台错误信息

---

## ✨ 总结

迁移已成功完成！扩展现在是一个独立的项目，位于：

f:\github_project\prunplanner-extension\

所有功能保持不变，可以正常使用。

---

**迁移完成时间：** 2026-06-07  
**迁移状态：** ✅ 成功
