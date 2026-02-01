---
title: ffmpeg常用教程
tags:
  - ffmpeg
categories: ffmpeg
date: 2024-06-01
updated: 2025-08-05
---

# ffmpeg

[[toc]]

## 一、安装

**ffmpeg官网：https://www.ffmpeg.org/download.html**

该网站中的FFMPEG分为3个版本：Static，Shared，Dev。  <!-- more -->  
前两个版本可以直接在命令行中使用，他们的区别在于 Static 里面只有3个应用程序：

- ffmpeg.exe
- ffplay.exe
- ffprobe.exe

Shared里面除了3个应用程序：ffmpeg.exe，ffplay.exe，ffprobe.exe之外，还有一些Dll，比如说avcodec-54.dll之类的。

Shared里面的exe体积很小，他们在运行的时候，到相应的Dll中调用功能。

Dev版本是用于开发的，里面包含了库文件xxx.lib以及头文件xxx.h，这个版本不包含exe文件。

这里我们使用static版本，下载zip压缩文件，解压到指定目录，利用Windows自带命令提示符CMD，CD到解压的路径，

例如：D:\ffmpeg201200216\bin，这样bin下面的ffmpeg.exe就可以在命令行中使用了，可以用ffmpeg -version测试一下：

放一个mp4视频，然后把声音提取到output.acc，用命令测试一下：

```
ffmpeg -i movie.mp4 -acodec copy -vn output.aac
```

## 二、常用命令

主要参数：

- -i 设定输入流
- -f 设定输出格式
- -ss 开始时间

视频参数：

- -b 设定视频流量(码率)，默认为200Kbit/s
- -r 设定帧速率，默认为25
- -s 设定画面的宽与高
- -aspect 设定画面的比例
- -vn 不处理视频
- -vcodec 设定视频编解码器，未设定时则使用与输入流相同的编解码器

音频参数：

- -ar 设定采样率
- -ac 设定声音的Channel数
- -acodec 设定声音编解码器，未设定时则使用与输入流相同的编解码器
- -an 不处理音频

### 1. 视频格式转换

比如一个avi文件，想转为mp4。

```
ffmpeg -i input.avi output.mp4
```

### 2. 提取音频

比如一个相声.MP4文件,只想听声音，提取音频为.ACC格式：

```
ffmpeg -i 相声.mp4 -acodec aac -vn output.aac
```

(-vn 不处理视频 )

### 3. 提取视频

比如一个相声.MP4文件,只想看视频影像不听声音：

```
ffmpeg -i 相声.mp4 -vcodec copy -an output.mp4
```

（-an 不处理音频）

### 4. 视频剪切

截取视频从时间为00:00:15开始，截取5秒钟的视频：

```
ffmpeg -ss 00:00:15 -t 00:00:05 -i input.mp4 -vcodec copy -acodec copy output.mp4
```

-ss表示开始切割的时间，-t表示要切多少。

> ffmpeg 在切割视频的时候无法做到时间绝对准确，因为视频编码中关键帧（I帧）和跟随它的B帧、P帧是无法分割开的，否则就需要进行重新帧内编码，会让视频体积增大。所以，如果切割的位置刚好在两个关键帧中间，那么 ffmpeg 会向前/向后切割，所以最后切割出的 chunk 长度总是会大于等于应有的长度。

### 5.码率控制

**码率： bitrate = file size / duration**

比如一个文件20.8M，时长1分钟，那么，码率就是：

*biterate = 20.8M bit/60s = 20.8*1024*1024*8 bit/60s= 2831Kbps*

ffmpg控制码率有3种选择:

- -minrate
- -b:v
- -maxrate

-b:v 主要是控制平均码率。 比如一个视频源的码率太高了，有10Mbps，文件太大，想把文件弄小一点，但是又不破坏分辨率:

```
ffmpeg -i input.mp4 -b:v 2000k -bufsize 2000k output.mp4
```

-minrate -maxrate 设置码率波动阈值

```
ffmpeg -i input.mp4 -b:v 2000k -bufsize 2000k -maxrate 2500k output.mp4
```

### 6. 视频编码格式转换

相声.mp4的编码是MPEG4，转换H264编码：

```
ffmpeg -i input.mp4 -vcodec h264 output.mp4
```

相反

```
ffmpeg -i input.mp4 -vcodec mpeg4 output.mp4
```

### 7.为视频添加logo

水印logo.png贴到一个视频上，那可以用如下命令：

```
ffmpeg -i input.mp4 -i logo.png -filter_complex overlay output.mp4
```

### 8. 旋转视频

在手机上录的视频，在电脑放，是颠倒的，需要旋转90度。

```
ffmpeg -i 相声.mp4 -vf transpose=1 rotate8.mp4
```

## 三、其他命令

官方文档：https://www.ffmpeg.org/ffmpeg.html



---

---

---



[FFmpeg教程（超级详细版）](https://blog.csdn.net/m0_37605642/article/details/121566820)

ffmpeg是一款非常好用处理音视频的工具包。那什么是ffmpeg呢？FFmpeg是一套可以用来记录、转换数字音频、视频，并能将其转化为流的开源计算机程序，可以结合开发一些处理视频音频的功能。

## **1.ffmpeg下载**

首先打开 [ffmpeg官网下载](https://link.segmentfault.com/?enc=Izolw4%2BjJMVj5SDMjqiKrw%3D%3D.Mto17U43p5v3DiIB07eqx9ppbLCst%2B4VFIH20eXjeY4yL6NJcpM5IVgk1EZ5cDb3YbYinyhbsUfXIMAslvKEGQ%3D%3D)
然后点击 windows 对应的图标，再点击下面的”Windows EXE Files”随便选一个点进去选择一个版本下载。

## **2.下载后解压，配置环境变量**

下载解压后就能在 bin 文件夹下能看到三个可执行程序：ffmpeg、ffplay、ffprobe，为bin文件夹配置好环境变量后即可使用。

验证是否成功：
cmd窗口输入 `ffmpeg -version` 验证是否安装成功。

## **3.关键指令**

一.查看FFmpeg支持的编码器

```ebnf
ffmpeg configure -encoders
```

二.查看FFmpeg支持的解码器

```ebnf
ffmpeg configure -decoders
```

三.查看FFmpeg支持的通信协议

```ebnf
ffmpeg configure -protocols
```

四.查看FFmpeg所支持的音视频编码格式、文件封装格式与流媒体传输协议

```ada
ffmpeg configure --help
```

五.播放视频
[FFmpeg命令行工具学习(二)：播放媒体文件的工具ffplay](https://link.segmentfault.com/?enc=MbRHi7LQKjNQ9cBKCUyXFw%3D%3D.HFbVidqg8FuLbNzY6ZOf7XGzGGSd21yQoXugZEkmI5U17yYSkXAm%2BM%2Bio8hYxrqc)

```graphql
ffplay input.mp4

# 播放完自动退出
ffplay -autoexit input.mp4
```

六.设置视频的屏幕高宽比

```stylus
ffmpeg -i input.mp4 -aspect 16:9 output.mp4 
通常使用的宽高比是：
16:9
4:3
16:10
5:4
2:21:1
2:35:1
2:39:1
```

七.编码格式转换
MPEG4编码转成H264编码

```stylus
ffmpeg -i input.mp4 -strict -2 -vcodec h264 output.mp4
```

H264编码转成MPEG4编码

```stylus
ffmpeg -i input.mp4 -strict -2 -vcodec mpeg4 output.mp4
```

## **4.视频压缩**

```apache
ffmpeg -i 2020.mp4 -vcodec h264 -vf scale=640:-2 -threads 4 2020_conv.mp4

ffmpeg -i 1579251906.mp4 -strict -2 -vcodec h264 1579251906_output.mp4
```

参数解释:

```diff
-i 2020.mp4
输入文件，源文件

2020_conv.mp4
输出文件，目标文件

-vf scale=640:-2  
改变视频分辨率，缩放到640px宽，高度的-2是考虑到libx264要求高度是偶数，所以设置成-2,让软件自动计算得出一个接近等比例的偶数高

-threads 4
4核运算
```

其他参数：

```diff
-s 1280x720 
设置输出文件的分辨率，w*h。

-b:v 
输出文件的码率，一般500k左右即可，人眼看不到明显的闪烁，这个是与视频大小最直接相关的。

-preset
指定输出的视频质量，会影响文件的生成速度，有以下几个可用的值 ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow。
与 veryslow相比，placebo以极高的编码时间为代价，只换取了大概1%的视频质量提升。这是一种收益递减准则：slow 与 medium相比提升了5%~10%；slower 与 slow相比提升了5%；veryslow 与 slower相比提升了3%。
针对特定类型的源内容（比如电影、动画等），还可以使用-tune参数进行特别的优化。

-an
去除音频流。

-vn
去除视频流。

-c:a
指定音频编码器。

-c:v
指定视频编码器，libx264，libx265，H.262，H.264，H.265。
libx264：最流行的开源 H.264 编码器。
NVENC：基于 NVIDIA GPU 的 H.264 编码器。
libx265：开源的 HEVC 编码器。
libvpx：谷歌的 VP8 和 VP9 编码器。
libaom：AV1 编码器。

-vcodec copy
表示不重新编码，在格式未改变的情况采用。

-re 
以源文件固有帧率发送数据。

-minrate 964K -maxrate 3856K -bufsize 2000K 
指定码率最小为964K，最大为3856K，缓冲区大小为 2000K。

-y
不经过确认，输出时直接覆盖同名文件。

-crf
参数来控制转码，取值范围为 0~51，其中0为无损模式，18~28是一个合理的范围，数值越大，画质越差。
```

## **5.视频拼接**

一.将4个视频拼接成一个很长的视频（无声音）

```stylus
ffmpeg -i 0.mp4 -i 1.mp4 -i 2.mp4 -i 3.mp4 -filter_complex '[0:0][1:0] [2:0][3:0] concat=n=4:v=1 [v]' -map '[v]' output.mp4
```

二.将4个视频拼接成一个很长的视频（有声音）

```inform7
ffmpeg -i 1.mp4 -i 2.mp4 -i 3.mp4 -filter_complex '[0:0][0:1] [1:0][1:1] [2:0][2:1] concat=n=3:v=1:a=1 [v][a]' -map '[v]' -map '[a]’  output.mp4
```

参数解释：

```inform7
[0:0][0:1] [1:0][1:1] [2:0][2:1] 
分别表示第1个输入文件的视频、音频，第2个输入文件的视频、音频，第3个输入文件的视频、音频。

concat=n=3:v=1:a=1 
表示有3个输入文件，输出一条视频流和一条音频流。

[v][a] 
得到的视频流和音频流的名字，注意在 bash 等 shell 中需要用引号，防止通配符扩展。
```

三.横向拼接2个视频

```stylus
ffmpeg -i 0.mp4 -i 1.mp4 -filter_complex "[0:v]pad=iw*2:ih*1[a];[a][1:v]overlay=w" out.mp4
```

参数解释

```routeros
pad
将合成的视频宽高，这里iw代表第1个视频的宽，iw*2代表合成后的视频宽度加倍，ih为第1个视频的高，合成的两个视频最好分辨率一致。

overlay
覆盖，[a][1:v]overlay=w，后面代表是覆盖位置w:0。
```

四.竖向拼接2个视频

```stylus
ffmpeg -i 0.mp4 -i 1.mp4 -filter_complex "[0:v]pad=iw:ih*2[a];[a][1:v]overlay=0:h" out_2.mp4
```

五.横向拼接3个视频

```inform7
ffmpeg -i 0.mp4 -i 1.mp4 -i 2.mp4 -filter_complex "[0:v]pad=iw*3:ih*1[a];[a][1:v]overlay=w[b];[b][2:v]overlay=2.0*w" out_v3.mp4
```

六.竖向拼接3个视频

```inform7
ffmpeg -i 0.mp4 -i 1.mp4 -i 2.mp4 -filter_complex "[0:v]pad=iw:ih*3[a];[a][1:v]overlay=0:h[b];[b][2:v]overlay=0:2.0*h" out_v4.mp4
```

七.4个视频2x2方式排列

```inform7
ffmpeg -i 0.mp4 -i 1.mp4 -i 2.mp4 -i 3.mp4 -filter_complex "[0:v]pad=iw*2:ih*2[a];[a][1:v]overlay=w[b];[b][2:v]overlay=0:h[c];[c][3:v]overlay=w:h" out.mp4
```

## **6.视频帧操作**

[ffmpeg和H264视频的编解码](https://link.segmentfault.com/?enc=Sb1JvoyOfFuBGmRsBDo7%2BQ%3D%3D.6Hpu2r%2BOci0ASqjs6dAWnLDhrkEYDXTTBqcnda8wjKTLM9fJ9Zb5%2B1%2FnDMifPKrv)

一.查看每帧的信息

```nginx
ffprobe -v error -show_frames gemfield.mp4 
```

从pict_type=I可以看出这是个关键帧，然后key_frame=1 表示这是IDR frame，如果key_frame=0表示这是Non-IDR frame。

二.截取视频中的某一帧
把gemfield.mp4视频的第1分05秒的一帧图像截取出来。

```apache
# input seeking
ffmpeg -ss 00:1:05 -i gemfield.mp4 -frames:v 1 out.jpg
# output seeking
ffmpeg -i gemfield.mp4 -ss 00:1:05 -frames:v 1 out1.jpg
```

参数解释：

```sas
-frame:v 1，在video stream上截取1帧。
input seeking使用的是key frames，所以速度很快；而output seeking是逐帧decode，直到1分05秒，所以速度很慢。
```

重要说明：

```pgsql
ffmpeg截取视频帧有2种 seeking 方式，对应有2种 coding 模式：transcoding 和 stream copying（ffmpeg -c copy）。

transcoding 模式：需要 decoding + encoding 的模式，即先 decoding 再encoding。

stream copying 模式：不需要decoding + encoding的模式，由命令行选项-codec加上参数copy来指定（-c:v copy ）。在这种模式下，ffmpeg在video stream上就会忽略 decoding 和 encoding步骤。
```

三.查看视频总帧数

```routeros
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_frames -of default=nokey=1:noprint_wrappers=1 gemfield.mp4
```

四.查看 key frame 帧数

```routeros
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nokey=1:noprint_wrappers=1 -skip_frame nokey gemfield.mp4
```

五.查看 key frame 所在的时间

```routeros
ffprobe -v error -skip_frame nokey -select_streams v:0 -show_entries frame=pkt_pts_time -of csv=print_section=0 gemfield.mp4
```

六.查看 key frame 分布的情况

```elm
ffprobe -v error -show_frames gemfield.mp4 | grep pict_type
```

七.查看 key frame 所在的帧数

```routeros
ffprobe -v error -select_streams v -show_frames -show_entries frame=pict_type -of csv gemfield.mp4 | grep -n I | cut -d ':' -f 1
```

八.重新设置 key frame interval

```oxygene
ffmpeg -i gemfield.mp4 -vcodec libx264 -x264-params keyint=1:scenecut=0 -acodec copy out.mp4
```

九.查看视频波特率

```routeros
ffprobe -v error -select_streams v:0 -show_entries stream=bit_rate -of default=noprint_wrappers=1:nokey=1 gemfield.mp4
```

## **7.图片与视频**

7.1 图片转视频（规则的名称）

```apache
ffmpeg -f image2 -i 'in%6d.jpg' -vcodec libx264 -r 25 -b 200k test.mp4
```

参数解释：

```armasm
-r 25 表示每秒播放25帧
-b 200k 指定码率为200k
    
图片的文件名为"in000000.jpg"，从0开始依次递增。
```

7.2 图片转视频（不规则的名称）
不规则图片名称转视频。
7.2.1 方法一
不规则图片名称合成视频文件。

```stata
ffmpeg -framerate 10 -pattern_type glob -i '*.jpg' out.mp4

cat *.png | ffmpeg -f image2pipe -i - output.mp4

参数解释：
-framerate 10：视频帧率
-pattern_type glob：Glob pattern 模糊匹配
-f image2pipe：图像管道，模糊匹配得到图片名称
```

7.2.2 方法二
不规则图片名称合成视频文件。
一.先动手把不规则文件重命名规则图片名。

```vim
def getTpyeFile(filelist, type):     
    res = []     
    for item in filelist:
         name, suf = os.path.splitext(item) # 文件名，后缀
         if suf == type:
             res.append(item)
     return res
 
pwd = os.getcwd() # 返回当前目录的绝对路径
dirs = os.listdir() # 当前目录下所有的文件名组成的数组
typefiles = getTpyeFile(dirs, '.jpg')
 
for i in range(0,len(typefiles)):
     os.rename(typefiles[i],"./%d.jpg" % (i)) #将文件以数字规则命令
```

二.将需要合成的图片放在txt中，通过读取txt文件合并成视频。

```lua
ffmpeg -f concat -i files.txt output.mp4
```

7.3 图片格式转换
[ffmpeg图片格式转换](https://link.segmentfault.com/?enc=5bIZXMoulTEaCeqgg4zpbQ%3D%3D.DUnnx1L7rD2OhkOFdMiQVShs3E1EAl%2BPS7gcKRfAdErCx4%2FQiQCZ0dJ7z4h%2F9KwsujLbgabastPrMq%2BwDweKUQ%3D%3D)

webp转换成jpg

```stylus
ffmpeg -i in.webp out.jpg
```

webp转换成png

```stylus
ffmpeg -i in.webp out.png
```

jpg转换成png

```stylus
ffmpeg -i in.jpg out.png
```

jpg转换成webp

```stylus
ffmpeg -i in.jpg out.webp
```

png转换成webp

```stylus
ffmpeg -i in.png out.webp
```

png转换成jpg

```stylus
ffmpeg -i in.png out.jpg
```

## **8、硬解码与软解码**

一.CPU富余、需要精准控制解码流程、有解码算法的优化、通用性要求高，直接使用软解（也就是CPU解码）;
二.有其他编解码芯片/模组、CPU不够用，就不得不需要转向硬解码（也就是专用芯片解码）。

2022-09-13 新增
[ffmpeg命令目录](https://link.segmentfault.com/?enc=0PTchLkkUS0WiWqtOetXrQ%3D%3D.cuZbtzsgZAOTe42F1vmtKuoCDXuI74FEG0DZtUhFM3f9JndRKpdeUlHd%2FJhPDhBpxhYtREUmbPFiLk0Oa4zFlw%3D%3D)

**调整视频分辨率-s**

```stylus
1、用-s参数设置视频分辨率，参数值wxh，w宽度单位是像素，h高度单位是像素
ffmpeg -i input_file -s 320x240 output_file

2、预定义的视频尺寸
    下面两条命令有相同效果
    ffmpeg -i input.avi -s 640x480 output.avi
    ffmpeg -i input.avi -s vga output.avi
```

**Scale filter调整分辨率**

```stylus
Scale filter的优点是可以使用一些额外的参数
    Scale=width:height[:interl={1|-1}]
    
下面两条命令有相同效果
    ffmpeg -i input.mpg -s 320x240 output.mp4 
    ffmpeg -i input.mpg -vf scale=320:240 output.mp4

对输入视频成比例缩放
改变为源视频一半大小
    ffmpeg -i input.mpg -vf scale=iw/2:ih/2 output.mp4
改变为原视频的90%大小：
    ffmpeg -i input.mpg -vf scale=iw*0.9:ih*0.9 output.mp4
```

**在未知视频的分辨率时，保证调整的分辨率与源视频有相同的横纵比。**
可能会有错误，不推荐使用，最好传入明确的缩放值
另外，scale只能接受偶数，否则height not divisible by 2

```stylus
宽度固定400，高度成比例：
    ffmpeg -i input.avi -vf scale=400:-2

相反地，高度固定300，宽度成比例：
    ffmpeg -i input.avi -vf scale=-2:300
```