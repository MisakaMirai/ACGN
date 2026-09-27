---
alwaysApply: true
scene: file_edit
---

# 文件读写规则

## 核心要求

**一律不使用 PowerShell 读写文件内容。** 读取、修改、创建文件一律使用专用工具；PowerShell 只用来执行命令。

## 工具对照

| 操作     | 使用工具        | 禁止                                              |
| -------- | --------------- | ------------------------------------------------- |
| 读文件   | read            | `Get-Content`、`type`、`cat`                       |
| 改文件   | edit            | `Set-Content`、`Add-Content`、`Out-File`、回写替换 |
| 写新文件 | write           | `New-Item`、`>` / `>>` 重定向                     |
| 搜内容   | grep / glob     | `Select-String`、`findstr`                        |
| 执行命令 | bash            | —                                                 |

## 为什么

Windows PowerShell 5.1 的默认编码是系统 ANSI 代码页（本机为 GBK/936），不是 UTF-8。两个方向都会出错：

### 读取：中文乱码，且会吞掉换行

`Get-Content` 不带 `-Encoding` 时按 ANSI 解码无 BOM 的 UTF-8 文件，中文全部乱码。更糟的是 GBK 属变长编码，前导字节会把紧随的 `\r` 当作第二字节吃掉，表现为**注释行与下一行粘连**——看着像文件损坏，实际只是显示层错乱，文件本身完好。

```powershell
# 错误：输出乱码 + 行尾被吃掉
Get-Content .gitignore
# 实际显示：# 编辑器文�?.vscode/
# 误判：以为 .gitignore 坏了、node_modules/ 失去忽略
# 真相：git check-ignore 一切正常，文件无需修改
```

### 写入：BOM 破坏构建

`Set-Content -Encoding UTF8` 在 5.1 中会写入 **UTF-8 BOM**。`.vue` / `.js` 文件开头多出 BOM 会让 Vite / Rolldown 解析失败：

```
RolldownError: Parse failure
```

`-Encoding utf8NoBOM` 是 PowerShell 6+ 才有的选项，5.1 不可用。

### 回写：内容被静默破坏

`Get-Content -Raw` 读进来（已乱码）再 `Set-Content` 写回去，文件内容永久损坏，**全程无任何报错**。本项目已因此损坏过 `TheNavbar.spec.js` 的中文。

### 显示层同样不可信

即使只读不写，bash 工具的输出管道也会因控制台代码页而乱码。**核对文件内容一律用 read 工具**，不要相信 bash 里看到的中文。

## 允许的 PowerShell 用途

只要不触碰文件内容，PowerShell 执行命令是允许的：

```powershell
npm run lint
npm run format:check
npm test
npm run build
git status --short
git log --oneline -5
node scripts/validate-sites.js
```

判断标准：**这个命令是"跑程序"还是"读写文件"？** 前者可以，后者不行。

## 例外

- 批量重命名、移动、删除文件时，可用 bash 配合 `Move-Item` / `Remove-Item`，但**不涉及内容读取**
- 查看文件内容一律用 read，不用 `git show` / `git diff` 的输出来间接读
