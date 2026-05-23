---
title: Gazebo Learning Notes
description: Gazebo 学习笔记
tags:
  - ROS2
categories: ROS2
date: 2026-05-14
updated: 2026-05-14
---

## ROS/Gazebo Installation

This table includes all currently supported versions of ROS and Gazebo. All other ROS and Gazebo releases are end of life and we do not recommend their continued use.

| ROS / Gazebo | GZ Fortress (LTS) | GZ Harmonic (LTS) | GZ Ionic | GZ Jetty (LTS) |
|---|---:|---:|---:|---:|
| ROS 2 Rolling | ❌ | ⚡ | ⚡ | ✅ |
| ROS 2 Lyrical (LTS) | ❌ | ⚡ | ⚡ | ✅ |
| ROS 2 Kilted | ❌ | ⚡ | ✅ | ❌ |
| ROS 2 Jazzy (LTS) | ❌ | ✅ | ❌ | ❌ |
| ROS 2 Humble (LTS) | ✅ | ⚡ | ❌ | ❌ |

Notes:
- ✅ Recommended combination
- ❌ Incompatible / not possible
- ⚡ Possible, but use with caution; these combinations can be made to work but may require extra effort.

(Source: https://gazebosim.org/docs/jetty/ros_installation/)

```bash
sudo apt install -y ros-${ROS_DISTRO}-ros-gz
sudo apt install -y ros-jazzy-ros2-control ros-jazzy-ros2-controllers ros-jazzy-gz-ros2-control
# VMWare "Accelerated 3D Graphics"
echo "export SVGA_VGPU10=0" >> ~/.profile
```


## Gazebo MCP

[kvgrok/gazebo-mcp](https://github.com/kvgork/gazebo-mcp)

```bash
git clone https://github.com/kvgork/gazebo-mcp.git
cd gazebo-mcp

source /opt/ros/jazzy/setup.bash
pip install -r requirements.txt

colcon build
source install/setup.bash

python -m mcp.server.server
```

```json
{
  "mcpServers": {
    "gazebo": {
      "command": "python",
      "args": ["-m", "gazebo_mcp.server"],
      "cwd": "{PLACEHOLDER_PATH}/gazebo_mcp_package",
      "env": {
        "PYTHONPATH": "{PLACEHOLDER_PATH}/gazebo_mcp_package/src",
        "ROS_DOMAIN_ID": "0",
        "GAZEBO_BACKEND": "modern",
        "GAZEBO_WORLD_NAME": "default",
        "GAZEBO_TIMEOUT": "5.0"
      }
    }
  }
}
```
