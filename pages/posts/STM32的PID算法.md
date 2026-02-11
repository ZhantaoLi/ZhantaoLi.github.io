---
title: STM32的PID算法
tags:
  - STM32
  - PID
categories: STM32
date: 2024-04-12
updated: 2024-08-03
codeHeightLimit: 400
---

这篇文章将介绍 STM32 中的 PID（比例-积分-微分）控制算法的原理和实现方法。PID 控制器是一种常用的反馈控制系统，用于调节系统的输出以达到设定值。STM32 作为一款广泛使用的微控制器，提供了丰富的资源和功能，使得实现 PID 控制算法变得更加高效和灵活。  
<!-- more -->

## STM32的PID算法

抽象化的模拟 PID 控制系统原理框图，如下图所示。该系统由模拟 PID 控制器和被控对象组成。    

![模拟 PID 控制系统原理图](https://raw.githubusercontent.com/ZhantaoLi/PicGo/main/imgs/2019-01-03_210531.png)

图中，r(t) 是给定值，y(t)是系统的实际输出值，给定值与实际输出值构成控制偏差：
$$
e(t)=r(t)-y(t)
$$
e(t)作为 PID 控制的输入，作为 PID 控制器的输出和被控对象的输入。所以模拟 PID 控制器的控制规律为
$$
u(t)=kp[e(t)+\frac{1}{Ti}\int e(t)dt+Td\frac{de(t)}{dt}]
$$
其中，Kp为控制器的比例系数，Ti为控制器的积分时间，也称积分系数，Td为控制器的微分时间，也称微分系数。

### 位置式 PID 算法

由于计算机控制是一种采样控制，它只能根据采样时刻的偏差计算控制量，而不能像模拟控制那样连续输出控制量，进行连续控制。由于这一特点，式 1-2 中的积分项和微分项不能直接使用，必须进行离散化处理。离散化处理的方法为：以 T 作为采样周期，k 作为采样序号，则离散采样时间 kT对应着连续时间 t，用矩形法数值积分近似代替积分，用一阶后向差分近似代替微分，可作如下近似变换：

$$
\int e(t)dt\approx T\sum_{j=0}^{k} e(jT) = T\sum_{j=0}^{k} e_j
$$

$$
\frac{de(t)}{dt} \approx \frac{e(kT)-e[(k-1)T]}{T} = \frac{e_k-e_{k-1}}{T}
$$

上式中，为了表达的方便，将类似于 e(kT)简化成 e_k等。

将式 2-1 代入 式 1-2 ，就可以得到离散的 PID 表达式为
$$
u_k = Kp[e_k+\frac{(T)}{Ti}\sum_{j=0}^{k}e_j+Td\frac{(e_k-e_{k-1})}{T}]
$$
或
$$
u_k = Kp*e_k+Ki\sum_{j=0}^{k}e_j+Kd(e_k-e_{k-1})
$$
其中，

> k 为采样序号，k = 0,1,2,...  
> u_k 为第 k 次采样时刻的计算机输出值  
> e_k 为第 k 次采样时刻输入的偏差值  
> e_{k-1} 为第 k-1 次采样时刻输入的偏差值   
> Ki 为积分系数 $Ki=kp*\frac{T}{Ti}$  
> Kd 为微分系数 $Kd=Kp*\frac{Td}{T}$  

如果采样周期足够小，则式 2-2 或式 2-3 的近似计算可以获得足够精确的结果，离散控制过程与连续过程十分接近。

式 2-2 或式 2-3 表示的控制算法式直接按式 1-2 所给出的 PID 控制规律定义进行计算的，所以它给出了全部控制量的大小，因此被称为全量式或位置式 PID 控制算法。

这种算法的缺点是：由于全量输出，所以每次输出均与过去状态有关，计算时要对 e_k进行累加，工作量大。并且，因为计算机输出的对应的是执行机构的实际位置，如果计算机出现故障，输出的将大幅度变化，会引起执行机构的大幅度变化，有可能因此造成严重的生产事故，这在实际生产际中是不允许的。

### 增量式 PID 算法

所谓增量式 PID 是指数字控制器的输出只是控制量的增量△u_k当执行机构需要的控制量是增量，而不是位置量的绝对数值时，可以使用增量式 PID 控制算法进行控制。 

增量式 PID 控制算法可以通过式 2－2 推导出。由式 2－2 可以得到控制器的第 k－1 个采样时刻的输出值为：
$$
u_(k-1) = Kp[e_(k-1)+\frac{(T)}{Ti}\sum_{j=0}^{k-1}e_j+Td\frac{(e_(k-1)-e_(k-2))}{T}]
$$
用式 2-2 减去式 2-4 相减并整理，就可以得到增量式 PID 控制算法公式：
$$
\bigtriangleup u_k = u_k - u_{k-1} = Kp[e_k-e_{k-1}+\frac{(T)}{Ti}e_k+Td\frac{e_k-2e_{k-1}+e_{k-2}}{T}]
$$

$$
= Kp(1+\frac{T}{T_i}+\frac{Td}{T})e_k - Kp(1+\frac{2Td}{T})e_{k-1}+Kp\frac{Td}{T}e_{k-2}
$$

$$
=Ae_k+Be_{k-1}+Ce_{k-2}
$$

其中，

> $$
> A=Kp(1+\frac{T}{T_i}+\frac{Td}{T})
> $$
>
> $$
> B=Kp(1+\frac{2Td}{T})
> $$
>
> $$
> C=Kp\frac{Td}{T}
> $$

由式 2－5 可以看出，如果计算机控制系统采用恒定的采样周期 T ，一旦确定 A、 B、 C，只要使用前后三次测量的偏差值，就可以由式 2－5 求出控制量。

增量式 PID 控制算法与位置式 PID 算法式 2－2 相比，计算量小的多，因此在实际中得到广泛的应用。

而位置式 PID 控制算法也可以通过增量式控制算法推出递推计算公式：
$$
u_k=u_{k-1}+\bigtriangleup u_k
$$
式 2-6 就是目前在计算机控制中广泛应用的数字递推 PID 控制算法。

### 采样周期的选择

香农（Shannon） 采样定律 ：为不失真地复现信号的变化， 采样频率至少应大于或等于连续信号最高频率分量的二倍。根据采样定律可以确定采样周期的上限值。实际采样周期的选择还要受到多方面因素的影响，不同的系统采样周期应根据具体情况来选择。

采样周期的选择，通常按照过程特性与干扰大小适当来选取采样周期：即对于响应快、（如流量、压力） 波动大、易受干扰的过程，应选取较短的采样周期；反之，当过程响应慢（如温度、 成份）、滞后大时，可选取较长的采样周期。

采样周期的选取应与 PID 参数的整定进行综合考虑， 采样周期应远小于过程的扰动信号的周期，在执行器的响应速度比较慢时，过小的采样周期将失去意义，因此可适当选大一点；在计算机运算速度允许的条件下，采样周期短， 则控制品质好；当过程的纯滞后时间较长时， 一般选取采样周期为纯滞后时间的 1/4～1/8。

##### 1、定义一个结构体，用来存储PID控制器的参数：

```c
struct PID_Controller
{
    float Kp;  //比例系数
    float Ki;  //积分系数
    float Kd;  //微分系数
    float SetPoint;  //设定值
    float Error;  //误差
    float PreError;  //上一次误差
    float Derivative	//微分值
    float Integral;  //积分值
};
```

##### 2、定义一个函数，用来计算PID控制器的输出：

```c
float PID_Calculate(struct PID_Controller *pid, float feedback)
{
    //计算误差
    pid->Error = pid->SetPoint - feedback;
    //计算积分值
    pid->Integral += pid->Error;
    //计算微分值
    pid->Derivative = pid->Error - pid->PreError;
    //计算控制器输出
    float output = pid->Kp * pid->Error + pid->Ki * pid->Integral + pid->Kd * pid->Derivative;
    //更新上一次误差
    pid->PreError = pid->Error;
    //返回控制器输出
    return output;
}
```

##### 3、使用PID_Calculate函数来计算PID控制器的输出：

```c
float output = PID_Calculate(&pid, feedback);
```

##### 4、调用PID_Calculate函数，每次传入新的反馈值，计算新的控制器输出，以此实现PID控制。

```c
#include <stdio.h>

//定义PID控制器结构体
struct PID_Controller
{
    float Kp;  //比例系数
    float Ki;  //积分系数
    float Kd;  //微分系数
    float SetPoint;  //设定值
    float Error;  //误差
    float PreError;  //上一次误差
    float Derivative	//微分值
    float Integral;  //积分值
};

//定义PID控制器函数
float PID_Calculate(struct PID_Controller *pid, float feedback)
{
    //计算误差
    pid->Error = pid->SetPoint - feedback;
    //计算积分值
    pid->Integral += pid->Error;
    //计算微分值
    pid->Derivative = pid->Error - pid->PreError;
    //计算控制器输出
    float output = pid->Kp * pid->Error + pid->Ki * pid->Integral + pid->Kd * pid->Derivative;
    //更新上一次误差
    pid->PreError = pid->Error;
    //返回控制器输出
    return output;
}

int main()
{
    //定义PID控制器参数
    struct PID_Controller pid;
    pid.Kp = 0.2;
    pid.Ki = 0.1;
    pid.Kd = 0.3;
    pid.SetPoint = 10;
    pid.PreError = 0;
    pid.Integral = 0;
	pid.Derivative = 0;
    
	//定义反馈变量
	float feedback = 0;

	//循环计算控制器输出
	for (int i = 0; i < 10; i++)
	{
    	float output = PID_Calculate(&pid, feedback);
    	printf("PID Output: %f\n", output);
    	feedback += output;
	}
	
	return 0;

}
```

### STM32可以使用Flash技术来实现掉电PID数据不消失的功能

1. 首先，定义PID参数结构体，将PID参数存储在结构体中；
2. 定义一个指针，指向PID参数结构体；
3. 在PID算法中，每次计算前，从Flash中读取PID参数，并将其存储在结构体中；
4. 将指针指向PID参数结构体；
5. 在PID算法中，每次计算完成后，将PID参数写入Flash中；
6. 在PID算法中，每次断电后，从Flash中读取PID参数，并将其存储在结构体中；
7. 将指针指向PID参数结构体，完成掉电PID数据不消失的功能。

```c
#include <stdio.h>

//定义PID参数结构体
typedef struct PID_parameters
{
    float kp;
    float ki;
    float kd;
    float error;	//误差
    float integral;		//积分值
    float derivative;	//微分值
    float preError;  //上一次误差
    float setpoint;	//设定值
}PID_parameters;

//定义指针，指向PID参数结构体
PID_parameters *pid_parameters;

//从Flash中读取PID参数
void read_PID_parameters_from_flash(PID_parameters *pid_parameters){
    pid_parameters->kp = read_data_from_flash(0);
    pid_parameters->ki = read_data_from_flash(1);
    pid_parameters->kd = read_data_from_flash(2);
    pid_parameters->error = read_data_from_flash(3);
    pid_parameters->integral = read_data_from_flash(4);
    pid_parameters->derivative = read_data_from_flash(5);
    pid_parameters->preError = read_data_from_flash(6);
    pid_parameters->setpoint = read_data_from_flash(7);
}

//将PID参数写入Flash中
void write_PID_parameters_to_flash(PID_parameters *pid_parameters){
    write_data_to_flash(0, pid_parameters->kp);
    write_data_to_flash(1, pid_parameters->ki);
    write_data_to_flash(2, pid_parameters->kd);
    write_data_to_flash(3, pid_parameters->error);
    write_data_to_flash(4, pid_parameters->integral);
    write_data_to_flash(5, pid_parameters->derivative);
    write_data_to_flash(6, pid_parameters->preError);
    write_data_to_flash(7, pid_parameters->setpoint);
}

//PID算法
float PID_algorithm(PID_parameters *pid_parameters, float feedback){
    //从Flash中读取PID参数
    read_PID_parameters_from_flash(pid_parameters);
    
    //将指针指向PID参数结构体
    pid_parameters = &pid_parameters;
    
    //计算PID算法
    pid_parameters->error = pid_parameters->setpoint - feedback;
    pid_parameters->integral += pid_parameters->error;
    pid_parameters->derivative = pid_parameters->error - pid_parameters->preError;
    float output = pid_parameters->kp * pid_parameters->error + pid_parameters->ki * pid_parameters->integral + pid_parameters->kd * pid_parameters->derivative + pid_parameters->setpoint;
    
    //更新上一次误差
    pid_parameters->preError = pid_parameters->error;
    
    //将PID参数写入Flash中
    write_PID_parameters_to_flash(pid_parameters);
    
    return output;
}

//掉电PID数据不消失，从Flash中读取PID参数
void initialize_PID_parameters(){
    //从Flash中读取PID参数
    read_PID_parameters_from_flash(pid_parameters);
    
    //将指针指向PID参数结构体
    pid_parameters = &pid_parameters;
}

int main()
{
    float feedback = 0;  //定义反馈值
    
    //初始化PID参数
    initialize_PID_parameters();
    
    //PID算法
    while(1)
    {
        float output = PID_algorithm(pid_parameters, feedback);
        printf("PID Output: %f\n", output);
        feedback += output;
    }
    
    return 0;
}
```

比例系数**Kp产生快速的位置调整响应**，积分系数**Ki消除稳态误差**，微分系数**Kd阻尼，稳定**

P 快，I 准，D 稳； P控制现在，I纠正曾经，D管控未来；

### 调参口诀

参数整定找最佳，从小到大顺序查 

先是比例后积分，最后再把微分加 

曲线振荡很频繁，比例度盘要放大 

曲线漂浮绕大弯，比例度盘往小扳 

曲线偏离恢复慢，积分时间往下降 

曲线波动周期长，积分时间再加长 

曲线振荡频率快，先把微分降下来 

动差大来波动慢，微分时间应加长 

理想曲线两个波，前高后低四比一 

一看二调多分析，调节质量不会低

## 加入前馈的PID

![image-20230814220520730](https://raw.githubusercontent.com/ZhantaoLi/PicGo/main/imgs/image-20230814220520730.png)

[只用PID?加上前馈解决95%的问题！]( https://www.bilibili.com/video/BV19T411t7du/?share_source=copy_web&vd_source=93852eabd464e8d094c7a76d5de4afd9)
