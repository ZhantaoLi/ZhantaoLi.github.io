---
title: WSL 记录
tags:
  - Linux
  - WSL
  - Docker
categories: DevOps
date: 2026-03-09
updated: 2026-03-09
---

[[toc]]


<!-- more -->

## WSL Command
```powershell
wsl -l -v	# list

wsl -d <name>	# 启动

wsl --terminate <name>	# 暂停

wsl --export <name> <name.tar>	# 导出/备份

wsl --import <name> <folder> <name.tar>	# 导入

wsl --unregister <name> # 删除

wsl --shutdown	# 关闭
```


## 迁移到D盘：

1. 找到当前的 ext4.vhdx 路径，例如：C:\Users\LZT\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu22.04LTS_79rhkp1fndgsc\LocalState
2. 关闭wsl，再将`ext4.vhdx`复制到新的文件夹，例如：D:\ProgramData\wsl_ubuntu

   ```powershell
   wsl -l -v
   wsl -l --all
   wsl --shutdown
   ```

3. 修改注册表路径

   > 在`HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Lxss\`找到原来的`BasePath`并修改为新的路径


## WSL & Docker 压缩虚拟磁盘

### wsl

 因为 ext4.vhdx 是 WSL2 的“动态扩容”虚拟磁盘文件：它会随着你在 Linux 里写入数据而变大，但删除文件后不会自动缩小。所以会出现：

- Linux 里 df 看到已用 9.8G：这是 ext4 文件系统“当前占用”。
- Windows 里看到 ext4.vhdx 有 19.3GB：这是这个 VHDX 在 NTFS 上 "已经分配/膨胀到" 的大小（里面可能有很多已删除但尚未回收的块、缓存/构建产物曾经占用过的空间、文件系统/日志开销等）。

  想把 ext4.vhdx 真正变小，需要 "释放可回收块 + 关机后压缩" ：

1. 在 WSL 里执行（让空闲块可被回收）
   `sudo fstrim -av`
2. 退出并关闭 WSL
   `wsl --shutdown`
3. 在 Windows PowerShell（管理员）压缩 VHDX（二选一）

- 有 Hyper-V 模块时：
  `Optimize-VHD -Path "C:\Users\LZT\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu22.04LTS_79rhkp1fndgsc\LocalState\ext4.vhdx" -Mode Full`

  `Optimize-VHD -Path "C:\Users\LZT\AppData\Local\Docker\wsl\data\ext4.vhdx" -Mode Full`
- 没有 Hyper-V 时用 diskpart：

  ```powershell
  diskpart
  select vdisk file="C:\...\ext4.vhdx"
  attach vdisk readonly
  compact vdisk
  detach vdisk
  exit
  ```

### docker

```powershell
docker image prune	# 清理docker build构建缓存
docker builder prune -f	# 删除构建过程中产生的缓存文件

docker system prune -a	# 删除所有已停止的容器、无用的网络和悬空镜像

wsl --shutdown
wsl -l -v

Optimize-VHD -Path "C:\Users\LZT\AppData\Local\Docker\wsl\data\ext4.vhdx" -Mode Full
```