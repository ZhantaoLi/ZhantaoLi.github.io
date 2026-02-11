---
title: Ai-Thinker环境搭建
tags:
  - 嵌入式
categories: 嵌入式
date: 2024-04-12
updated: 2025-02-16
---

[[toc]]

::: tip
这里使用的是 `Ai-Thinker小安派` ，更多详细资料详见官网：[小安派-开源硬件系列 从选型到开发全流程](https://docs.ai-thinker.com/open_hardware/index.html)
:::
<!-- more -->  
## 1.VSCode&Git

### VSCode

![](https://raw.githubusercontent.com/ZhantaoLi/PicGo/main/imgs/Ai-Thinker%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA_1.jpg)

### Git

![](https://raw.githubusercontent.com/ZhantaoLi/PicGo/main/imgs/Ai-Thinker%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA_2.jpg)

## 2.小安派 源码工程 克隆

### 1.克隆源码

直接在桌面或者某个文件夹里找个空的位置点击 **鼠标右键** 选择 `Open Git bash here` 即可打开安装好的git 工具。接着输入指令（可以复制运行）：

```git
git clone https://gitee.com/Ai-Thinker-Open/AiPi-Open-Kits.git
```

开始克隆小安派的SDK。

![](https://raw.githubusercontent.com/ZhantaoLi/PicGo/main/imgs/Ai-Thinker%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA_3.jpg)

### 2.拉取M61的SDK 子模块

在拉取SDK之前，需要修改一下子模块的来源，不然可能会拉取失败。

进入`AiPi-Open-Kits` 中，用文本打开`.gitmodules` 文件**url** 参数中的 `github.com` 改成`gitee.com`

然后在**git 工具**中分别执行：

```git
cd AiPi-Open-Kits/
git submodule init
git submodule update
```

### 3.拉取M61 SDK中的子模块

M61 SDK 是小安派仓库的子模块，而M61 SDK自己也有子模块，所以也需要拉取，否则会编译不成功。

#### 1)进入到SDK中拉取子模块

逐条运行以下指令：

```git
cd aithinker_Ai-M6X_SDK/
git submodule init
git submodule update
```

#### 2)克隆适用Windows 的编译工具链

就在`aithinker_Ai-M6X_SDK/`文件夹中拉取工具链，直接适用git 工具拉取：

```git
git clone https://gitee.com/bouffalolab/toolchain_gcc_t-head_windows.git
```

## 三、编译工具路径设置

所有都拉取完成之后，需要把三个路径加入到电脑的环境变量当中，分别是：

```shell
aithinker_Ai-M6X_SDK\toolchain_gcc_t-head_windows\bin	//添加工具链路径
aithinker_Ai-M6X_SDK\tools\make		//添加make路径
aithinker_Ai-M6X_SDK\tools\ninja	//添加nanja路径
```

而且需要把`aithinker_Ai-M6X_SDK\tools\make`路径上移到最高层

### 4.验证是否成功设置

在桌面按住 `shift` 键点击`鼠标右键`打开**PowerShell** 。在PowerShell 输入：

```shell
make -v
```

成功输出信息：

```shell
GNU Make 4.2.1
Built for x86_64-w64-mingw32
Copyright (C) 1988-2016 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
```

输入：

```shell
 riscv64-unknown-elf-gcc -v
```

成功时输出信息：

```shell
Using built-in specs.
COLLECT_GCC=D:\Desktop\AiPi-Open-Kits\aithinker_Ai-M6X_SDK\toolchain_gcc_t-head_windows\bin\riscv64-unknown-elf-gcc.exe
COLLECT_LTO_WRAPPER=d:/desktop/aipi-open-kits/aithinker_ai-m6x_sdk/toolchain_gcc_t-head_windows/bin/../libexec/gcc/riscv64-unknown-elf/10.2.0/lto-wrapper.exe
Target: riscv64-unknown-elf
Configured with: /mnt/ssd/jenkins_iotsw/slave/workspace/Toolchain/build-gnu-riscv/./source/riscv/riscv-gcc/configure --target=riscv64-unknown-elf --host=i686-w64-mingw32 --with-gmp=/mnt/ssd/jenkins_iotsw/slave/workspace/Toolchain/build-gnu-riscv/build-gcc-riscv64-unknown-elf/build-Xuantie-900-gcc-elf-newlib-mingw-V2.6.1/lib-for-gcc-mingw --with-mpfr=/mnt/ssd/jenkins_iotsw/slave/workspace/Toolchain/build-gnu-riscv/build-gcc-riscv64-unknown-elf/build-Xuantie-900-gcc-elf-newlib-mingw-V2.6.1/lib-for-gcc-mingw --with-mpc=/mnt/ssd/jenkins_iotsw/slave/workspace/Toolchain/build-gnu-riscv/build-gcc-riscv64-unknown-elf/build-Xuantie-900-gcc-elf-newlib-mingw-V2.6.1/lib-for-gcc-mingw --with-libexpat-prefix=/mnt/ssd/jenkins_iotsw/slave/workspace/Toolchain/build-gnu-riscv/build-gcc-riscv64-unknown-elf/build-Xuantie-900-gcc-elf-newlib-mingw-V2.6.1/lib-for-gcc-mingw --with-libmpfr-prefix=/mnt/ssd/jenkins_iotsw/slave/workspace/Toolchain/build-gnu-riscv/build-gcc-riscv64-unknown-elf/build-Xuantie-900-gcc-elf-newlib-mingw-V2.6.1/lib-for-gcc-mingw --with-pkgversion='Xuantie-900 elf newlib gcc Toolchain V2.6.1 B-20220906' CXXFLAGS='-g -O2 -DTHEAD_VERSION_NUMBER=2.6.1 ' --enable-libgcctf --prefix=/mnt/ssd/jenkins_iotsw/slave/workspace/Toolchain/build-gnu-riscv/build-gcc-riscv64-unknown-elf/Xuantie-900-gcc-elf-newlib-mingw-V2.6.1 --disable-shared --enable-threads=posix --enable-languages=c,c++ --without-system-zlib --enable-tls --with-newlib --with-sysroot=/mnt/ssd/jenkins_iotsw/slave/workspace/Toolchain/build-gnu-riscv/build-gcc-riscv64-unknown-elf/Xuantie-900-gcc-elf-newlib-mingw-V2.6.1/riscv64-unknown-elf --with-native-system-header-dir=/include --disable-libmudflap --disable-libssp --disable-libquadmath --disable-libgomp --disable-nls --disable-tm-clone-registry --src=/mnt/ssd/jenkins_iotsw/slave/workspace/Toolchain/build-gnu-riscv/./source/riscv/riscv-gcc --enable-multilib --with-abi=lp64d --with-arch=rv64gcxthead 'CFLAGS_FOR_TARGET=-Os   -mcmodel=medany' 'CXXFLAGS_FOR_TARGET=-Os   -mcmodel=medany'
Thread model: posix
Supported LTO compression algorithms: zlib zstd
gcc version 10.2.0 (Xuantie-900 elf newlib gcc Toolchain V2.6.1 B-20220906)
```

![](https://raw.githubusercontent.com/ZhantaoLi/PicGo/main/imgs/Ai-Thinker%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA_4.jpg)

## 四、编译天气站程序

### 1.在VScode 打开小安派仓库源码

打开 **VScode**，在VScode 打开`AiPi-Open-Kits` 文件夹，即可看到源码

### 2.编译AiPi-Eyes_weather

AiPi-Eyes_weather 是天气站的源码，选中该文件之后，`鼠标右键`选择`在集成终端中打开`，然后在终端输入：

```shell
make
```

开始编译源码。

## 五、烧录程序

在`终端`运行指令：

```shell
make flash COMX=COMxx
```

> COMxx：是电脑中实际接入小安派TTL工具的 COM口

按照以下提示按小安派的复位键即可。

![](https://raw.githubusercontent.com/ZhantaoLi/PicGo/main/imgs/Ai-Thinker%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA_5.jpg)