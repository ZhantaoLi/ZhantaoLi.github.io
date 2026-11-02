---
title: SO-ARM101 记录
description: SO-ARM101 机械臂使用记录:环境准备、遥操作、数据采集、ACT/SmolVLA 训练与推理
tags:
  - EAI
  - SO-ARM101
categories: EAI
date: 2026-07-29
updated: 2026-09-26
---

[[toc]]

之前玩了下 [SO-ARM101](https://github.com/TheRobotStudio/SO-ARM100)，最近整理一下对应笔记。

## 环境准备

数据集:[LMing66/so101_pickpen](https://huggingface.co/buckets/LMing66/so101_pickpen)

```bash
ls /dev/ttyACM*
sudo chmod 666 /dev/ttyACM*

lerobot-find-cameras opencv
```

### 校准文件

- `~/.cache/huggingface/lerobot/calibration/robots/so_follower/my_follower_arm.json`
- `~/.cache/huggingface/lerobot/calibration/teleoperators/so_leader/my_leader_arm.json`
- `~/phosphobot/calibration/ so-100_{id}_config.json`

---

### 同类小工具（phosphobot）

```bash [phosphobot]
uvx phosphobot@latest run --port=8020
```

---

## 遥操作

遥操作超过从臂校准范围：

```bash
(lerobot) lming@HP:~/lerobot$ lerobot-teleoperate   --robot.type=so101_follower   --robot.port=/dev/ttyACM0   --robot.id=my_follower_arm   --teleop.type=so101_leader   --teleop.port=/dev/ttyACM1   --teleop.id=my_leader_arm
INFO 2026-07-29 19:30:11 eoperate.py:207 {'display_compressed_images': False,
 'display_data': False,
 'display_ip': None,
 'display_port': None,
 'fps': 60,
 'robot': {'calibration_dir': None,
           'cameras': {},
           'disable_torque_on_disconnect': True,
           'id': 'my_follower_arm',
           'max_relative_target': None,
           'port': '/dev/ttyACM0',
           'use_degrees': False},
 'teleop': {'calibration_dir': None,
            'id': 'my_leader_arm',
            'port': '/dev/ttyACM1',
            'use_degrees': False},
 'teleop_time_s': None}
INFO 2026-07-29 19:30:11 so_leader.py:79 my_leader_arm SOLeader connected.
INFO 2026-07-29 19:30:11 follower.py:106 my_follower_arm SOFollower connected.
Teleop loop time: 16.76ms (60 Hz)
INFO 2026-07-29 19:30:56 o_leader.py:156 my_leader_arm SOLeader dTraceback (most recent call last):
  File "/home/lming/lerobot/src/lerobot/scripts/lerobot_teleoperate.py", line 224, in teleoperate
    teleop_loop(
  File "/home/lming/lerobot/src/lerobot/scripts/lerobot_teleoperate.py", line 163, in teleop_loop
    obs = robot.get_observation()
  File "/home/lming/lerobot/src/lerobot/utils/decorators.py", line 29, in wrapper
    return func(self, *args, **kwargs)
  File "/home/lming/lerobot/src/lerobot/robots/so_follower/so_follower.py", line 182, in get_observation
    obs_dict = self.bus.sync_read("Present_Position")
  File "/home/lming/lerobot/src/lerobot/utils/decorators.py", line 29, in wrapper
    return func(self, *args, **kwargs)
  File "/home/lming/lerobot/src/lerobot/motors/motors_bus.py", line 1146, in sync_read
    ids_values, _ = self._sync_read(
  File "/home/lming/lerobot/src/lerobot/motors/motors_bus.py", line 1178, in _sync_read
    raise ConnectionError(f"{err_msg} {self.packet_handler.getTxRxResult(comm)}")
ConnectionError: Failed to sync read 'Present_Position' on ids=[1, 2, 3, 4, 5, 6] after 1 tries. [TxRxResult] There is no status packet!

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/home/lming/miniforge3/envs/lerobot/bin/lerobot-teleoperate", line 6, in <module>
    sys.exit(main())
  File "/home/lming/lerobot/src/lerobot/scripts/lerobot_teleoperate.py", line 246, in main
    teleoperate()
  File "/home/lming/lerobot/src/lerobot/configs/parser.py", line 233, in wrapper_inner
    response = fn(cfg, *args, **kwargs)
  File "/home/lming/lerobot/src/lerobot/scripts/lerobot_teleoperate.py", line 241, in teleoperate
    robot.disconnect()
  File "/home/lming/lerobot/src/lerobot/utils/decorators.py", line 29, in wrapper
    return func(self, *args, **kwargs)
  File "/home/lming/lerobot/src/lerobot/robots/so_follower/so_follower.py", line 226, in disconnect
    self.bus.disconnect(self.config.disable_torque_on_disconnect)
  File "/home/lming/lerobot/src/lerobot/utils/decorators.py", line 29, in wrapper
    return func(self, *args, **kwargs)
  File "/home/lming/lerobot/src/lerobot/motors/motors_bus.py", line 537, in disconnect
    self.disable_torque(num_retry=5)
  File "/home/lming/lerobot/src/lerobot/motors/feetech/feetech.py", line 297, in disable_torque
    self.write("Torque_Enable", motor, TorqueMode.DISABLED.value, num_retry=num_retry)
  File "/home/lming/lerobot/src/lerobot/utils/decorators.py", line 29, in wrapper
    return func(self, *args, **kwargs)
  File "/home/lming/lerobot/src/lerobot/motors/motors_bus.py", line 1082, in write
    self._write(addr, length, id_, value, num_retry=num_retry, raise_on_error=True, err_msg=err_msg)
  File "/home/lming/lerobot/src/lerobot/motors/motors_bus.py", line 1106, in _write
    raise ConnectionError(f"{err_msg} {self.packet_handler.getTxRxResult(comm)}")
ConnectionError: Failed to write 'Torque_Enable' on id_=1 with '0' after 6 tries. [TxRxResult] There is no status packet!
```

### 两个摄像头，遥操作并显示摄像头画面

```bash [teleoperate]
lerobot-teleoperate \
--robot.type=so101_follower \
--robot.port=/dev/ttyACM0 \
--robot.id=my_follower_arm \
--robot.cameras="{ wrist_cam: {type: opencv, index_or_path: /dev/video2, width: 640, height: 480, fps: 30, fourcc: "MJPG"}, top_cam: {type: opencv, index_or_path: /dev/video1, width: 640, height: 480, fps: 30, fourcc: "MJPG"}}" \
--teleop.type=so101_leader \
--teleop.port=/dev/ttyACM1 \
--teleop.id=my_leader_arm \
--display_data=true
```

---

## 数据采集

```bash [record]
lerobot-record   --robot.type=so101_follower   --robot.port=/dev/ttyACM0   --robot.id=my_awesome_follower_arm   --robot.cameras='{ front: {type: opencv, index_or_path: 0, width: 640, height: 480, fps: 30, fourcc: "MJPG"}, side: {type: opencv, index_or_path: 2, width: 640, height: 480, fps: 30, fourcc: "MJPG"} }'   --teleop.type=so101_leader   --teleop.port=/dev/ttyACM1   --teleop.id=my_awesome_leader_arm   --display_data=true   --dataset.repo_id=seeedstudio123/test   --dataset.num_episodes=5   --dataset.single_task="Grab the black cube"   --dataset.push_to_hub=false   --dataset.episode_time_s=30   --dataset.reset_time_s=30

lerobot-record \
    --robot.type=so101_follower \
    --robot.port=/dev/ttyACM0 \
    --robot.id=my_follower_arm \
    --robot.cameras="{ wrist_cam: {type: opencv, index_or_path: /dev/video2, width: 640, height: 480, fps: 30, fourcc: "MJPG"}, top_cam: {type: opencv, index_or_path: /dev/video0, width: 640, height: 480, fps: 30, fourcc: "MJPG"}}" \
    --teleop.type=so101_leader \
    --teleop.port=/dev/ttyACM1 \
    --teleop.id=my_leader_arm \
    --display_data=true \
    --dataset.repo_id=lming/so101_test0 \
    --dataset.num_episodes=50 \
    --dataset.single_task="pick up the pen" \
    --dataset.push_to_hub=false \
    --dataset.episode_time_s=15 \
    --dataset.reset_time_s=5
```

可视化数据集 https://io-ai.tech/lerobot/

---

## 训练

### ACT

```bash [act train]
HF_ENDPOINT=https://hf-mirror.com lerobot-train \
  --dataset.repo_id=lming/so101_test0 \
  --dataset.root=/home/lming/.cache/huggingface/lerobot/lming/so101_test0 \
  --dataset.streaming=false \
  --policy.type=act \
  --output_dir=outputs/train/act_so101_test \
  --job_name=act_pick_pen \
  --policy.device=cuda \
  --wandb.enable=false \
  --policy.push_to_hub=false \
  --steps=5000 \
  --batch_size=4 \
  --policy.gradient_clip_norm=5 \
  --save_freq=1000
```

### Smolvla

```bash [smolvla train]
HF_ENDPOINT=https://hf-mirror.com lerobot-train \
  --policy.path=lerobot/smolvla_base \
  --dataset.repo_id=lming/smolvla_so101_test \
  --dataset.root=/home/lming/.cache/huggingface/lerobot/lming/so101_test0 \
  --dataset.streaming=false \
  --output_dir=outputs/train/smolvla_so101_test \
  --job_name=smolvla_pick_pen \
  --policy.device=cuda \
  --wandb.enable=false \
  --policy.push_to_hub=false \
  --steps=20000 \
  --batch_size=4 \
  --rename_map='{"observation.images.top_cam":"observation.images.camera1","observation.images.wrist_cam":"observation.images.camera2"}' \
  --policy.empty_cameras=1 \
  --save_freq=5000 
```

```bash [resume train]
HF_ENDPOINT=https://hf-mirror.com lerobot-train \
  --resume=true \
  --config_path=outputs/train/smolvla_so101_test/checkpoints/005000/pretrained_model/train_config.json
```

---

## 推理

### ACT

```bash [act interface]
lerobot-record  \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyACM0 \
  --robot.cameras="{ wrist_cam: {type: opencv, index_or_path: /dev/video0, width: 640, height: 480, fps: 30, fourcc: "MJPG"}, top_cam: {type: opencv, index_or_path: /dev/video2, width: 640, height: 480, fps: 30, fourcc: "MJPG"}}" \
  --robot.id=my_follower_arm \
  --display_data=false \
  --dataset.repo_id=lming/eval_so101_test_pick_pen \
  --dataset.single_task="pick up the pen" \
  --dataset.episode_time_s=1000 \
  --policy.path=/home/lming/lerobot/outputs/train/act_so101_test/checkpoints/020000/pretrained_model
```

### Smolvla

```bash [smolvla interface]
HF_ENDPOINT=https://hf-mirror.com lerobot-record \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyACM0 \
  --robot.cameras="{ wrist_cam: {type: opencv, index_or_path: /dev/video0, width: 640, height: 480, fps: 30, fourcc: \"MJPG\"}, top_cam: {type: opencv, index_or_path: /dev/video2, width: 640, height: 480, fps: 30, fourcc: \"MJPG\"}}" \
  --robot.id=my_follower_arm \
  --display_data=false \
  --dataset.repo_id=lming/eval_so101_smolvla_pick_pen \
  --dataset.single_task="pick up the pen" \
  --dataset.episode_time_s=1000 \
  --dataset.push_to_hub=false \
  --dataset.rename_map='{"observation.images.top_cam":"observation.images.camera1","observation.images.wrist_cam":"observation.images.camera2"}' \
  --policy.path=/home/lming/lerobot/outputs/train/smolvla_so101_test/checkpoints/020000/pretrained_model
```

```bash
# 先备份
cp /home/lming/lerobot/outputs/train/smolvla_so101_test/checkpoints/020000/pretrained_model/config.json \
   /home/lming/lerobot/outputs/train/smolvla_so101_test/checkpoints/020000/pretrained_model/config.json.bak

# 把 camera1→top_cam, camera2→wrist_cam
sed -i 's/observation.images.camera1/observation.images.top_cam/g' \
  /home/lming/lerobot/outputs/train/smolvla_so101_test/checkpoints/020000/pretrained_model/config.json

sed -i 's/observation.images.camera2/observation.images.wrist_cam/g' \
  /home/lming/lerobot/outputs/train/smolvla_so101_test/checkpoints/020000/pretrained_model/config.json

# 然后去掉 --dataset.rename_map，直接跑
HF_ENDPOINT=https://hf-mirror.com lerobot-record \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyACM0 \
  --robot.cameras="{ wrist_cam: {type: opencv, index_or_path: /dev/video0, width: 640, height: 480, fps: 30, fourcc: \"MJPG\"}, top_cam: {type: opencv, index_or_path: /dev/video2, width: 640, height: 480, fps: 30, fourcc: \"MJPG\"}}" \
  --robot.id=my_follower_arm \
  --display_data=false \
  --dataset.repo_id=lming/eval_so101_smolvla_pick_pen \
  --dataset.single_task="pick up the pen" \
  --dataset.episode_time_s=1000 \
  --dataset.push_to_hub=false \
  --policy.path=/home/lming/lerobot/outputs/train/smolvla_so101_test/checkpoints/020000/pretrained_model
```

这是 smolvla 的效果（数据集 50 组，steps 在 20k 时）

但是一次成功率很低

1. 采集数据集的时候可以动作“机械”一点，用成功率高的动作方式，例如，先寻找（两摄像头均看到物体）再夹取；夹爪张的充分一些；包含第一次夹取失败后抬起第二次寻找并夹取的数据（待测）
2. 可以测试多种模型的效果对比，例如，act, diffusion, smolvla...
3. 训练模型的时候可以讲 save_freq 设置小一点，这样模型权重会保存频繁一些，在测试推理的时候也可以多对比不同 steps 的效果，分析欠拟合/过拟合的真机表现效果
4. 后续根据实际效果也可适当补充数据集-合并-训练-推理

### TurboVLA

```bash
python scripts/run_so101_inference.py \
    --ckpt results/Checkpoints/turbovla_so101_v1/checkpoints/steps_40000_ema_pytorch_model.pt \
    --task "pick up the pen" \
    --port /dev/ttyACM0 \
    --wrist-cam /dev/video0 --top-cam /dev/video2
    
python scripts/run_so101_inference.py  --ckpt results/Checkpoints/turbovla_so101_v1/final_model/ema_ema_pytorch_model.pt  --task "pick up the pen"  --port /dev/ttyACM0  --wrist-cam /dev/video0  --top-cam /dev/video2  --vel-clamp 10.0  --exec-steps 1  --smooth 10  --ensemble-coeff 0.1
```

TurboVLA 自带的 gr00t dataloader 没有过滤静止帧,导致 79% 静止帧主导训练,模型学不会运动。

### 机械臂卡顿与颤动排查

我在 smolvla 部署的过程中,机械臂也存在稍微卡顿和颤动之类的不够丝滑,这又是什么原因?

1. 推理延迟超过控制周期(最可能)

   SmolVLA 是 vision encoder + SmolLM 骨干,单次推理在 6GB 显存卡上可能要 30-80ms。而 LeRobot 控制周期通常是 50Hz(20ms)或 30Hz(33ms)。
   如果推理时间 > 控制周期,执行流程就变成“推理→等→发送→推理→等→发送”,机械臂收到的是时间间隔不均匀的命令,物理上表现为一顿一顿地动,不是连续流畅的运动。

   这个最容易判断:看 lerobot-record 跑的时候终端有没有打印 fps 低于设定值,或者 GPU 利用率是不是打满。

2. Action chunk 执行策略

   SmolVLA 输出一个 chunk(比如 16 步),执行方式影响丝滑度:

   - 执行太多步才重预测:chunk 后半段已经过时,和新预测衔接处产生跳变 → 周期性顿挫
   - 每步都重预测:每次预测有微小噪声,直接映射到舵机 → 高频颤动
   - temporal ensembling(ACT 论文那套指数加权重叠)能消除边界跳变,但 lerobot 默认可能没开,或者系数不合适

3. 舵机响应与通信抖动

   SO-101 用的 STS3215 舵机:

   - USB 通信本身有 1-3ms 抖动,多舵机同步读/写会累积
   - 舵机 PID 和速度限制:预测命令要求移动速度超过舵机最大转速时,舵机会“滞后追赶”再到位,表现为先慢后快地抽
   - 如果命令里相邻两步位置差很小(亚度级),舵机可能不响应或抖动在死区里

4. 预测噪声直接放大

   VLA 模型预测的 action 不可能完全平滑,会有 ±0.5% 级别的噪声。如果直接发绝对位置命令,这些噪声变成舵机微小颤动。ACT/SmolVLA 没有额外低通滤波,颤动会传到机械臂。

**怎么区分**

得看具体现象:

- 一顿一顿(低频顿挫) → 推理延迟(原因 1)或 chunk 衔接(原因 2)
- 持续细颤(高频颤动) → 预测噪声(原因 4)或舵机死区(原因 3)
- 某个速度区间才抖 → 舵机速度限制(原因 3)

## 数据飞轮与在线优化

机器人运行 → 产生数据 → 发现失败或不确定样本 → 人工标注或干预 → 加入训练集 → 模型变强 → 机器人继续运行 → 产生更多数据

1. 数据选择
2. 数据增广
3. 不同数据重加权
