---
title: Linux记录
date: 2024-04-12
updated: 2025-09-09
categories: 笔记
tags:
  - 笔记
  - Linux
---

### 桌面操作系统

1. Ubuntu

2. Deepin

3. Kali Linux

```bash
#kali linux && wsl
wsl --update
wsl --shutdown

wsl -l -o
wsl --install kali-linux
wsl -d kali-linux

apt install -y kali-win-kex

cd /home
kex
```



### 命令记录

[Linux常用命令知识点总结](https://www.cnblogs.com/zqingyang/p/18142052)

```bash
sudo passwd
sudo passwd root
sudo -i
#sudo apt update && sudo apt upgrade -y
apt update
apt install curl telnet net-tools inetutils-ping ufw -y

#1c1g cloud server: optimizime resource usage
vim /etc/apt/apt.conf.d/10periodic
	APT::Periodic::Update-Package-Lists "0";
	APT::Periodic::Download-Upgradeable-Packages "0";
	APT::Periodic::AutocleanInterval "0";
vim /etc/update-manager/release-upgrades
	Prompt=never
#enlarge swapfile 	
swapon --show
free -h
dd if=/dev/zero of=/swapfile bs=1M count=2048
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
swapon --show
free -h
vim /etc/fstab
	/swapfile none swap sw 0 0

echo 1 > /sys/module/zswap/parameters/enabled
#限制部分docker的cpu/memory资源分配

#sources
bash <(curl -sSL https://linuxmirrors.cn/main.sh)
apt upgrade -y
#docker
bash <(curl -sSL https://linuxmirrors.cn/docker.sh)
#1Panel
curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && sudo bash quick_start.sh
1pctl user-info
1pctl update password
#1pctl update port --port=80
#https://www.bilibili.com/video/BV1ED421V7Dr
#ohmyzsh
cat /etc/shells
sudo apt install zsh
chsh -s /bin/zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
#xiaoya树莓派
#wget -qO pi.sh https://cafe.cpolar.cn/wkdaily/zero3/raw/branch/main/zero3/pi.sh && chmod +x pi.sh && ./pi.sh
###wifi
#	https://blog.csdn.net/Alan_615/article/details/123801163

#
apt install s-tui cpufrequtils linux-cpupower	
s-tui
cpupower -c all frequency-set -g powersave    #优化能效 平衡性能与功耗
cpupower -c all frequency-set -g performance  #最大化 CPU 性能
cpufreq-info -o
# wireguard		注意Endpoints
curl -O https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
chmod +x wireguard-install.sh
./wireguard-install.sh
qrencode -t ansiutf8 < ./xxx.conf		#自己命名的conf
#qing long
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

`neofetch` `screenfetch`

`htop`

```bash
curl ipinfo.io #
netsh wlan show profiles name="" key=clear #
```

```shell
df -h	#文件系统的磁盘空间使用状况
	sudo fdisk -l
	lsblk
free -h	#系统的内存使用情况
	cat /proc/meminfo
lscpu	#有关系统的 CPU 架构和拓扑结构的详细信息
	cat /proc/cpuinfo
	iostat
dmidecode	#出系统BIOS、主板、内存、处理器等信息
	sudo dmidecode -t processor
	sudo dmidecode -t memory
lshw
	sudo lshw -class processor
	sudo lshw -class disk
	sudo lshw -class memory
hwinfo
	yum -y install hwinfo
	hwinfo --cpu
	hwinfo --disk
```

### Linux根文件夹目录

---

> /bin	：存储一些二进制可执行命令文件， /usr/bin 也存放了一些基于用户的命令文件  
> /sbin	： 存储了很多系统命令， /usr/sbin 也存储了许多系统命令  
> /root	：超级用户 root 的根目录文件  
> /home	：普通用户默认目录，在该目录下，每个用户都有一个以本用户名命名的文件夹  
> /boot	：存放 Ubuntu 系统内核和系统启动文件  
> /mnt	：通常包括系统引导后被挂载的文件系统的挂载点  
> /dev	：存放设备文件，我们后面学习 Linux 驱动主要是跟这个文件夹打交道的   
> /etc	：保存系统管理所需的配置文件和目录  
> /lib	：保存系统程序运行所需的库文件， /usr/lib 下存放了一些用于普通用户的库文件  
> /lost+found	：一般为空，当系统非正常关机以后，此文件夹会保存一些零散文件  
> /var	：存储一些不断变化的文件，比如日志文件  
> /usr	：包括与系统用户直接有关的文件和目录，比如应用程序和所需的库文件  
> /media	：存放 Ubuntu 系统自动挂载的设备文件  
> /proc	：虚拟目录，不实际存储在磁盘上，通常用来保存系统信息和进程信息  
> /tmp	： 存储系统和用户的临时文件，该文件夹对所有的用户都提供读写权限  
> /opt	：可选文件和程序的存放目录  
> /sys	：系统设备和文件层次结构，并向用户程序提供详细的内核数据信息  

---

### 系统配置

curl

ssh

vnc

git	gcc g++ cmake	python3 pip 	iverilog gtkwave	pandoc

zsh

[LACT](https://github.com/ilya-zlobintsev/LACT)用于在 Linux 下管理 AMD 显卡

**Fail2ban**  

`kex` for kali

### 软件安装

https://flathub.org/

AdGuard Home

bpython3

Chromium

Code::Blocks IDE

draw.io

GVim

LibreOffice

QQ

Spotify

Steam

Visual Studio Code

#### arpspoof

```bash
apt-get install -y dsniff ssldump
# arpspoof [-i interface] [-c own|host|both] [-t target] [-r] host
arpspoof -i eth0 -t 192.168.31.45  192.168.31.1
cat /proc/sys/net/ipv4/ip_forward
```



### 对于Termux

ZeroTermux

[Moe/TMOE](https://gitee.com/mo2/linux/blob/2021/Readme-old.md)

```basg
pkg update && pkg upgrade -y
pkg install root-repo
apt sources
termux-change-repo
pkg install termux-api
termux-location
pkg install tmux
tmux switch -t 0
pkg install docker docker-compose -y
```

github:

```bash
curl -LO --compressed https://raw.githubusercontent.com/2moe/tmoe/2/2.awk
awk -f 2.awk
```

gitee:

```bash
curl -LO https://gitee.com/mo2/linux/raw/2/2.awk
awk -f 2.awk
```

```bash
apt install alist
echo 'alist server &' >> ~/.bashrc
alist admin && alist server
```



### vi/vim

```bash
#光标移动
          ^							
          k								
    < h       l >
          j						
          v
空格>		CTRL-E下滑	
#编辑	i
#删除	d	dd	dw
#撤销	u
#复制	y			v
#粘贴	p
#跳转	G	gg	CTRL-O
#搜索	/	?		n	N
#保存	:w		:wq
```

[.vimrc配置](https://www.cnblogs.com/XNQC1314/p/8692993.html)

```bash
"保存.vimrc文件时自动重启加载，即让此文件立即生效
autocmd BufWritePost $MYVIMRC source $MYVIMRC

syntax on
set fileencodings=utf-8,ucs-bom,gb18030,gbk,gb2312,cp936
set termencoding=utf-8
set encoding=utf-8
set number
set cursorline
set nobackup
set autowrite

set tabstop=4	" Tab显示为4空格
set shiftwidth=4	" 自动缩进4空格
set expandtab	" 按Tab键实际输入空格
set autoindent	" 自动缩进

set hlsearch	" 高亮搜索结果
set incsearch	" 实时搜索反馈
set ignorecase	" 搜索忽略大小写
set smartcase	" 如果包含大写则区分大小写

"=============显示中文帮助
if version >= 603
    set helplang=cn
    set encoding=utf-8
endif
```

### chmod

```bash
chmod [选项] 权限模式 文件...
#[options]
	-R	#对目前目录下的所有文件与子目录进行相同的权限变更
#权限模式
	#ugoa +/- 模式
    #u表示user即文件或目录的所有者	g表示group即与文件属主有相同组ID的所有用户	o表示其他others用户	a表示所有all用户
    +	#添加某个权限
    -	#取消某个权限
    =	#赋予给定权限
    r	#可读权限
    w	#可写权限
    x	#可执行权限
    chmod a+r 1.txt	#将文件 file1.txt 设为所有人皆可读取
    chmod u+x 1.py	#将 1.py 设定为只有该文件拥有者可以执行
    chmod -R a+r *	#将目前目录下的所有文件与子目录皆设为任何人可读取
	#3位8进制模式
		#Linux/Unix 的文件调用权限分为三级:文件所有者Owner用户组Group其它用户Other Users;	每一级各有读,写,执行的三位权限
		chmod 777 file	#将 file 设为所有人均可读+写+执行
		7	读+写+执行	rwx	111
    6	读+写				rw-	110
    5	读+执行			r-x	101
    4	只读				r--	100
    3	写+执行			-wx	011
    2	只写				-w-	010
    1	只执行				--x	001
    0	无						---	000
```



### tar

```bash
tar [options] -f archive.tar [files...]
[options]:
	-c	#创建一个新的归档文件
	-x	#解压归档文件
	-t	#列出归档文件的内容
	-r	#向现有归档文件中追加文件
	
	-z	#使用 gzip 压缩归档文件
	-a	#自动选择压缩方式(基于归档文件的扩展名，如 .tar.gz、.tar.bz2 等)
	-v	#显示详细操作过程（verbose）
	
  -f <file>	#指定归档文件的名称(必须放在选项列表的最后)
```

### dpkg

```bash
dpkg [options] [.deb package name]
[options]:
	-i	#install a package
	-r	#remove an installed package
	-l <package_name>	#查询软件包的信息
```



### Docker (Compose)

```bash
docker
	pull		#拉取镜像
  images	#显示镜像
  rmi			#删除镜像
  
	run	#启动容器
		-d			#后台运行
		-p			#端口映射	80:80
		-v			#挂载目录	主机路径:容器路径[:权限]
		-e			#环境变量
		--name	#指定名称
	ps -a	#列出容器
	stop nginx_d	#停止容器
	start	nginx_d	#启用停止的容器
	rm nginx_d		#删除容器
	exec -it nginx_d /bin/bash	#进入容器内部	-it(交互模式)	/bin/bash(指定shell)
	logs nginx_d	#日志
	stats nginx_d	#资源占用
	
	volume
	network
	system
	info
```

#### 青龙面板

#### Azure IP防火墙

| SSH            | 22          |
| -------------- | ----------- |
| HTTPS          | 443         |
| HTTP           | 80          |
| wireguard      | 51985       |
| 1panel         | 42090       |
| alist/openlist | 5244        |
| qbittorrent    | 8181,48181  |
| splayer        | 25884       |
| yesplaymusic   | 40075       |
| linuxcommand   | 40255       |
| qinglong       | 5700,5701   |
| synctv         | 9999        |
| bililive_go    | 8080        |
| rustdesk       | 21114:21119 |

RustDesk：

- `hbbs`：
  - `21114` (TCP): 用于网页控制台，仅在 `Pro` 版本中可用
  - `21115` (TCP): 用于 NAT 类型测试
  - `21116` (TCP/UDP): **请注意 `21116` 应该同时为 TCP 和 UDP 启用** `21116/UDP` 用于 ID 注册和心跳服务 `21116/TCP` 用于 TCP 打洞和连接服务
  - `21118` (TCP): 用于支持网页客户端

- `hbbr`：
  - `21117` (TCP): 用于中继服务
  - `21119` (TCP): 用于支持网页客户端

*如果您不需要网页客户端支持，可以禁用相应的端口 `21118`、`21119`*

### Linux c 编程

#### GCC

```bash
gcc [options] [filename...]
	-o	#指定输出文件名
	-g 	#添加调试信息
	-O	#对程序进行优化编译
	-O2	#增加优化程度进行编译
```

> GCC 编译器的编译流程是：预处理、编译、汇编和链接  
> 预处理就是展开所有的头文件、替换程序中的宏、解析条件编译并添加到文件中  
> 编译是将经过预编译处理的代码编译成汇编代码，也就是我们常说的程序编译  
> 汇编就是将汇编语言文件编译成二进制目标文件  
> 链接就是将汇编出来的多个二进制目标文件链接在一起，形成最终的可执行文件，链接的时候还会涉及到静态库和动态库等问题  

#### Makefile



#### CMake
