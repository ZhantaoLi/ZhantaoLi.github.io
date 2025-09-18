---
title: HDLBits刷题
tags:
  - 笔记
  - FPGA
categories:
  - 笔记
date: 2023-4-12 19:07:32
updated: 2023-12-21 14:08:45
---

### 复习Verilog

#### 知识点

* 在`always`里**不能**有`assign`赋值，报错`Procedural Continuous Assignment to register is not supported`
* `assign`赋值左侧为`wire`；`always`里赋值左侧为`reg`
* 连续赋值(`assign x = y;`**不在**always里)；阻塞赋值: (`x = y;`**组合**always)；非阻塞赋值: (`x <= y;`**时序**always)
* `casez`标示`case`语句中可存在z(无关位)与?同义，`2'bz0==2'b?0`
* `data[begin +: width]`指`data[(begin+width-1) : begin]`，`data[end -: width]`与`data[end : (end-width+1)]`

​		如此`assign out = in[sel*4+3 : sel*4];`会报错(上界不可以为变量)

* **SOP标准式**：找出真值表中所有输出为1的表项，按照输入情况，为1用变量表示，为0用反变量表示，得出若干乘积项，然后求和。
* **POS标准式**：找出真值表中所有输出为0的表项，按照输入情况，为1用反变量表示，为0用变量表示，得出若干求和项，然后求积。
* 组合电路一般使用`=`，时序电路一般使用`<=`
* **算数右移与逻辑右移**An *arithmetic* right shift shifts in the sign bit of the number in the shift register (`q[63]` in this case) instead of zero as done by a *logical* right shift. Another way of thinking about an arithmetic right shift is that it assumes the number being shifted is signed and preserves the sign, so that arithmetic right shift divides a signed number by a power of two.

	**算数左移和逻辑左移**There is no difference between logical and arithmetic *left* shifts.

* ``define`、`parameter`、`localparam`三者的区别:

​		``define`:作用 -> 常用于定义常量可以跨模块、跨文件;

​				范围 -> 整个工程;

​		`parameter`:作用 -> 常用于模块间参数传递;

​              		范围 -> 本module内有效的定义;

​		`localparam`:作用 -> 常用于**状态机**的参数定义;

​				范围 -> 本module内有效的定义，不可用于参数传递;

| and  | or   | xor  | not   | xnor |
| ---- | ---- | ---- | ----- | ---- |
| &    | \|   | ^    | ! (~) | ~^   |
| ·    | +    | ⊕    | ˉˉ    | ⊙    |

#### 程序记录

##### 全加器

```verilog
module full_adder(//全加器
		input a,
		input b,
		input c_in,
		output sum,
		output c_out
);
	assign {c_out,sum} = a + b + c_in;
    //assign sum = a ^ b ^ cin;
    //assign cout = (a & b) | (a & cin) | (b & cin);
endmodule
```

##### 向量逆序

```verilog
module top_module(//向量倒序
    input [99:0] in,
    output [99:0] out
);
	always @(*) begin
        for(int i = 0; i < $bits(out); ++i) begin
            out[i] = in[$bits(out) - 1 - i];
        end
	end
endmodule
```

##### 优先级编码器

```verilog
module top_module(//当给定输入位向量时，它输出向量中第一个1位的位置
    input [3:0] in,
    output reg [1:0] pos
);
	always @ (*) begin
        case(1)//判断值在case中
            in[0]:pos = 0; 
            in[1]:pos = 1; 
            in[2]:pos = 2; 
            in[3]:pos = 3; 
            default:pos = 0;
        endcase        
    end
endmodule
```

##### [百位加法器](https://hdlbits.01xz.net/wiki/Adder100i)

Create a 100-bit binary ripple-carry adder by instantiating 100 [full adders](https://hdlbits.01xz.net/wiki/Fadd). The adder adds two 100-bit numbers and a carry-in to produce a 100-bit sum and carry out. To encourage you to actually instantiate full adders, also output the carry-out from *each* full adder in the ripple-carry adder. `cout[99]` is the final carry-out from the last full adder, and is the carry-out you usually see.

Module Declaration

```
module top_module( 
    input [99:0] a, b,
    input cin,
    output [99:0] cout,
    output [99:0] sum );
```

Hint...

There are many full adders to instantiate. An instance array or generate statement would help here.

```verilog
module top_module( 
    input [99:0] a, b,         // 输入 a 和 b
    input cin,                // 输入进位
    output [99:0] cout,       // 输出进位
    output [99:0] sum         // 输出和
);
    always @(*) begin
        {cout[0], sum[0]} = a[0] + b[0] + cin + 2'b00;    // 计算第一个数字的和及进位
        // sum[0] = a[0] ^ b[0] ^ cin;
        // cout[0] = (a[0] & b[0]) | (a[0] & cin) | (b[0] & cin);
        for (int i = 1; i < 100; i = i + 1) begin         // 循环计算其他数字的和及进位
            {cout[i], sum[i]} = a[i] + b[i] + cout[i-1];
            //sum[i] = a[i] ^ b[i] ^ cout[i-1];            // 计算当前位的和
            //cout[i] = (a[i] & b[i]) | (a[i] & cout[i-1]) | (b[i] & cout[i-1]);    // 计算当前位的进位
        end
    end
endmodule
```

##### [百位BCD加法器](https://hdlbits.01xz.net/wiki/Bcdadd100#)

You are provided with a BCD one-digit adder named `bcd_fadd` that adds two BCD digits and carry-in, and produces a sum and carry-out.

```
module bcd_fadd (
    input [3:0] a,
    input [3:0] b,
    input     cin,
    output   cout,
    output [3:0] sum );
```

Instantiate 100 copies of `bcd_fadd` to create a 100-digit BCD ripple-carry adder. Your adder should add two 100-digit BCD numbers (packed into 400-bit vectors) and a carry-in to produce a 100-digit sum and carry out.

Module Declaration

```
module top_module( 
    input [399:0] a, b,
    input cin,
    output cout,
    output [399:0] sum );
```

Hint...
An instance array or generate statement would be useful here.

```verilog
module top_module( 
    input [399:0] a, b,     // 输入 a 和 b，每个有400位
    input cin,              // 输入进位
    output cout,            // 输出进位
    output [399:0] sum      // 输出和
);

    wire [99:0] cout_temp;   // 存储每个 bcd_fadd 实例的进位输出值

    // 第一个 bcd_fadd 实例
    bcd_fadd u_bcd_fadd(
        .a(a[3:0]),          // 取 a 的低4位
        .b(b[3:0]),          // 取 b 的低4位
        .cin(cin),
        .cout(cout_temp[0]),  // 连接第一个进位输出
        .sum(sum[3:0])       // 连接第一个和的低4位
    );

    generate
        genvar i;
        for(i=1; i<100; ++i) begin : block1   // 生成其他 99 个 bcd_fadd 实例
            bcd_fadd u_bcd_fadd(
                .a(a[4*i+3 : 4*i]),        // 每次取 a 的下一个4位
                .b(b[4*i+3 : 4*i]),        // 每次取 b 的下一个4位
                .cin(cout_temp[i-1]),     // 连接前一个实例的进位输出
                .cout(cout_temp[i]),       // 连接当前实例的进位输出
                .sum(sum[4*i+3 : 4*i])     // 连接当前实例的和的4位
            );
        end
    endgenerate

    assign cout = cout_temp[99];   // 将最后一个进位输出赋给 cout
endmodule
```

##### [边沿检测](https://hdlbits.01xz.net/wiki/Edgedetect)

```verilog
module top_module (
    input clk,
    input [7:0] in,
    output [7:0] pedge
);
    reg [7:0]in_last;
    always@(posedge clk) begin
        in_last <= in;
        pedge <= ~in_last & in; //下降沿检测:nedge <= in_last & ~in;
    end
endmodule
/*解析
信号前一状态 in_last 为 0 低电平，当前状态 in 为 1 高电平，即可检测出该信号的上升沿。因此电路组成：保存信号前一状态的D触发器 + 输出组合逻辑 out = ~in_last & in(上升沿)
*/
```

##### [算数/逻辑移位](https://hdlbits.01xz.net/wiki/Shift18)

```verilog
module top_module(
    input clk,                // 时钟信号
    input load,               // 载入数据的控制信号
    input ena,                // 使能操作的控制信号
    input [1:0] amount,       // 操作模式选择信号，2位宽
    input [63:0] data,        // 输入数据，64位宽
    output reg [63:0] q);     // 输出数据，64位宽

    always@(posedge clk) begin
        if (load)               // 如果load信号为1，将输入数据加载到输出
            q <= data;
        else if (ena) begin     // 如果ena信号为1，根据amount选择操作模式
            case (amount)
                2'b00:           // 当amount为00时，将输出数据左移1位
                    q <= q << 1;
                2'b01:           // 当amount为01时，将输出数据左移8位
                    q <= q << 8;
                2'b10:begin      // 当amount为10时，将输出数据右移1位
                    q <= q >> 1;
                    if (q[63] == 1) // 如果最高位为1，将其置为0
                        q[63] <= 1'b0;
                end
                2'b11:begin      // 当amount为11时，将输出数据右移8位
                    q <= q >> 8;
                    if (q[63] == 1) // 如果最高位为1，将最高8位都置为1
                        q[63:56] <= {8{1'b1}};
                end
            endcase
        end
    end
endmodule
```

##### [Rule110](https://hdlbits.01xz.net/wiki/Rule110)

```verilog
module top_module(
    input clk,
    input load,
    input [511:0] data,
    output [511:0] q
); 
    wire [511:0] q_left, q_right;
    
    assign q_left = {1'b0,q[511:1]};//q_left = q<<1;
    assign q_right = {q[510:0],1'b0};//q_right = q>>1;
    
    always@(posedge clk) begin
        if(load)
            q <= data;
    else  begin
        q <= (q & ~q_right) | (~q_left & q_right) | (~q & q_right);//卡诺图化简真值表
    end
        end
endmodule
```

##### [★Conwaylife](https://hdlbits.01xz.net/wiki/Conwaylife)

###### 题目

[康威的《生命游戏》](https://en.wikipedia.org/wiki/Conway's_Game_of_Life)是一个二维的细胞自动机。

“游戏”在二维单元格网格上进行，其中每个单元格为1（生存）或0（死亡）。在每个时间步长，每个小区都会根据其具有的邻居数量来更改状态：

0-1个邻居：单元格变为0。
2个邻居：单元格状态不变。
3个邻居：单元格变成1。
4个以上邻居：单元格变为0。

该游戏适用于无限网格。在此电路中，我们将使用16x16的网格。为了使事情变得更有趣，我们将使用16x16的环形面，其侧面环绕在网格的另一侧。例如，角单元格（0,0）有8个邻居：（15,1），（15,0），（15,15），（0,1），（0,15），（1,1） ，（1,0）和（1,15）。 16x16网格由长度为256的矢量表示，其中16个单元格的每一行由子矢量表示：q [15：0]是第0行，q [31:16]是第1行，依此类推。（此工具接受SystemVerilog，因此你可以根据需要使用2D向量。）

load：在下一个时钟沿将数据加载到q中，以加载初始状态。
q：游戏的16x16当前状态，每个时钟周期更新一次。

游戏状态应在每个时钟周期前移一个时间步长。

数学家，生命游戏细胞自动机的创造者约翰·康威（John Conway）于2020年4月11日因COVID-19逝世。

###### 题解

1.if-else判断其位置

```verilog
module top_module(
    input clk,
    input load,
    input [255:0] data,
    output [255:0] q ); 
    
    reg [15:0] q_2d [15:0]; //2-d q 当前值
    reg [15:0] q_next [15:0]; //2-d q_next 下一时刻值
    reg [3:0] sum;
    integer i,j;
    //组合逻辑部分
    always@(*)begin
        for(i=0;i<16;i++)begin
            for(j=0;j<16;j++)begin
                if(i==0 && j==0)//左上角
                    sum=q_2d[15][1]+q_2d[15][0]+q_2d[15][15]+q_2d[0][1]
                    +q_2d[0][15]+q_2d[1][0]+q_2d[1][1]+q_2d[1][15];
                else if(i==0 && j==15)//右上角
                    sum=q_2d[0][0]+q_2d[0][14]+q_2d[15][0]+q_2d[15][14]
                    +q_2d[15][15]+q_2d[1][0]+q_2d[1][14]+q_2d[1][15];
                else if(i==15 && j==0)//左下角
                    sum=q_2d[15][1]+q_2d[15][15]+q_2d[14][0]+q_2d[14][15]
                    +q_2d[14][1]+q_2d[0][0]+q_2d[0][1]+q_2d[0][15];
                else if(i==15 && j==15)//右下角
                    sum=q_2d[15][0]+q_2d[15][14]+q_2d[14][15]+q_2d[14][0]
                    +q_2d[14][14]+q_2d[0][0]+q_2d[0][15]+q_2d[0][14];
                else if(i==0)//上边界
                    sum=q_2d[0][j-1]+q_2d[0][j+1]+q_2d[1][j-1]+q_2d[1][j]
                    +q_2d[1][j+1]+q_2d[15][j-1]+q_2d[15][j]+q_2d[15][j+1];
                else if(i==15)//下边界
                    sum=q_2d[15][j-1]+q_2d[15][j+1]+q_2d[0][j-1]+q_2d[0][j]
                    +q_2d[0][j+1]+q_2d[14][j-1]+q_2d[14][j]+q_2d[14][j+1];
                else if(j==0)//左边界
                    sum=q_2d[i][1]+q_2d[i][15]+q_2d[i-1][0]+q_2d[i-1][15]
                    +q_2d[i-1][1]+q_2d[i+1][0]+q_2d[i+1][1]+q_2d[i+1][15];
                else if(j==15)//右边界
                    sum=q_2d[i][0]+q_2d[i][14]+q_2d[i-1][0]+q_2d[i-1][14]
                    +q_2d[i-1][15]+q_2d[i+1][0]+q_2d[i+1][14]+q_2d[i+1][15];
                else  //中间元素
                    sum=q_2d[i-1][j]+q_2d[i-1][j-1]+q_2d[i-1][j+1]+q_2d[i][j-1]
                    +q_2d[i][j+1]+q_2d[i+1][j]+q_2d[i+1][j-1]+q_2d[i+1][j+1];
                case(sum)
                    2:q_next[i][j]=q_2d[i][j];
                    3:q_next[i][j]=1'b1;
                    default:q_next[i][j]=0;
                endcase
                //q_2d = q_next;
        end
    end
end
    //时序逻辑部分
    always@(posedge clk)begin
        if(load)begin
            for(i=0;i<16;i++)begin
                for(j=0;j<16;j++)begin
                	q_2d[i][j] <=data[i*16+j]; 
            end 
        end
    end
        else 
            q_2d <= q_next;    
    end
    //输出维度转换
    genvar m,n;
    generate
        for(m = 0; m < 16; m = m + 1) begin : line_reverse
            for(n = 0; n < 16; n = n + 1) begin : list_reverse
                assign q[m*16+n] = q_2d[m][n];
        end
       end
    endgenerate
endmodule
```

因为不想代表显得太冗长，这里引入了 4 个整形变量 `idx_i_d,idx_i_u,idx_j_r,idx_j_l` ，在不同的情况下，来确立四条边界。

```verilog
module top_module(
    input clk,
    input load,
    input [255:0] data,
    output [255:0] q ); 

    reg [15:0] q_2d [15:0]; //2-d q
    wire [2:0] nghbr_num [255:0];
    int idx_i_d,idx_i_u,idx_j_r,idx_j_l,i,j;

    //count num of neighbours
    always@(*) begin
        for(i = 0 ; i < 16 ; i = i + 1) begin
            for(j = 0 ; j < 16 ; j = j + 1) begin
                idx_i_u = (i == 0) ? i-1+16 :i-1; //up idx
                idx_i_d = (i == 15)? i+1-16 :i+1; //down idx
                idx_j_l = (j == 0) ? j-1+16 :j-1; //left idx
                idx_j_r = (j == 15)? j+1-16 :j+1; //right idx
                nghbr_num[i*16+j] = q_2d[idx_i_u][idx_j_l] + q_2d[idx_i_u][j  ] + q_2d[idx_i_u][idx_j_r]
                                +   q_2d[i      ][idx_j_l]                      + q_2d[i      ][idx_j_r]
                                +   q_2d[idx_i_d][idx_j_l] + q_2d[idx_i_d][j  ] + q_2d[idx_i_d][idx_j_r];
            end
        end
    end

    //next state transform base on num of neighbours
    always @(posedge clk) begin
        if(load) begin:init
            for(i = 0 ; i < 16 ; i = i + 1) begin
                for(j = 0 ; j < 16 ; j = j + 1) begin
                    q_2d[i][j]    <=  data[i*16+j];
                end
            end
        end
        else begin:set_val
            for(i = 0 ; i < 16 ; i = i + 1) begin
                for(j = 0 ; j < 16 ; j = j + 1) begin
                    if(nghbr_num[i*16+j] < 2)
                        q_2d[i][j]      <=  1'b0;
                    else if (nghbr_num[i*16+j] > 3)
                        q_2d[i][j]      <=  1'b0;
                    else if (nghbr_num[i*16+j] == 3)
                        q_2d[i][j]      <=  1'b1;
                    else
                        q_2d[i][j]      <=  q_2d[i][j];
                end
            end
        end
    end

    //output
    always@(*) begin
        for(i = 0 ; i < 16 ; i = i + 1) begin
            for(j = 0 ; j < 16 ; j = j + 1) begin
                q[i*16+j] = q_2d[i][j];
            end
        end
    end

endmodule
```

2.扩展至18*18矩阵

```verilog
module top_module(
    input clk,
    input load,
    input [255:0] data,
    output [255:0] q ); 
    
    integer i,m,n;
    reg [17:0] g_2d [17:0];
    reg [2:0] sum;
    // extend 16×16 toroid to 18×18 grid 组合逻辑部分
    always@(*) begin
        g_2d[0] = {q[16*15],q[16*15 +: 16],q[16*16 -1]};
        g_2d[17] = {q[16*0],q[16*0 +: 16],q[16*1 -1]};
        for(i = 1 ; i < 17 ; i += 1) begin //note index starting point
            g_2d[i] = {q[16*(i-1)],q[16*(i-1) +: 16],q[16*i -1]};
        end
    end
    // judge every cell’s life 时序逻辑部分
    always@(posedge clk) begin
        if(load) begin
            q <= data;
        end
        else begin
            for(m = 0 ; m < 16 ; m += 1) begin: row
                for(n = 0 ; n < 16 ; n += 1) begin: col
                    sum = g_2d[m][n] + g_2d[m][n+1] + g_2d[m][n+2] + g_2d[m+1][n]
                    + g_2d[m+1][n+2] + g_2d[m+2][n] + g_2d[m+2][n+1] + g_2d[m+2][n+2];
                    case(sum)
                        3'b010: q[16*m+n] <= q[16*m+n];
                        3'b011: q[16*m+n] <= 1'b1;
                        default: q[16*m+n] <= 1'b0;
                    endcase
                end
            end
        end
    end
endmodule
```



###### 思考

联想到利用Vivado HLS进行卷积操作

