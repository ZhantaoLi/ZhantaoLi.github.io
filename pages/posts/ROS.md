---
title: ROS2 Learning Notes
description: ROS2 学习笔记
tags:
  - ROS2
categories: ROS2
date: 2026-04-29
updated: 2026-05-02
---

## system setup

VMware / WSL2
Ubuntu 24.04 LTS Desktop 64-bit

```bash
sudo apt update
sudo apt-get install open-vm-tools open-vm-tools-desktop -y
bash <(curl -sSL https://linuxmirrors.cn/main.sh)
sudo apt upgrade -y
sudo apt install openssh-server -y
sudo systemctl enable ssh
sudo apt install tar bzip2 wget git ripgrep -y

# folder name language
export LANG=en_US
xdg-user-dirs-gtk-update

# reboot
locale # expected UTF-8
```

```bash [other tools]
clash-verge-rev
cc-switch
npm
claude
codex
```

## ROS2 setup

```bash [fishros install script]
wget http://fishros.com/install -O fishros && . fishros
```

```bash [ROS2 env setup]
sudo apt install software-properties-common
sudo add-apt-repository universe

# [add ros2 apt source](https://mirror.tuna.tsinghua.edu.cn/help/ros2/)
sudo apt install curl gnupg2
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key  -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] https://mirrors.tuna.tsinghua.edu.cn/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

sudo apt update && sudo apt upgrade -y
sudo apt install ros-dev-tools -y
sudo apt install ros-jazzy-desktop -y   # ros core libs

echo "source /opt/ros/jazzy/setup.bash" >> ~/.bashrc
source ~/.bashrc

# check ros
ros2 run turtlesim turtlesim_node
ros2 run turtlesim turtle_teleop_key
rqt

## additional tools
sudo apt install -y python3-colcon-common-extensions
sudo apt install -y python3-rosdep
sudo rosdep init
rosdep update
```

## ROS2 workspace setup

 - Workspace
 - Package
 - Node

A ROS2 workspace is a directory where you can build and manage your ROS2 packages.

 - `src` folder where the source code of ROS packages will be located
 - `build` folder where intermediate files are stored
 - `install` folder where each package will be installed to
 - `log` folder contains various logging information about each colcon invocation

```bash [project example]
mkdir -p ~/ros2_ws_t/src && cd ~/ros2_ws_t
colcon build

# create a package
cd src
ros2 pkg create pkg_py --build-type ament_python --node-name node_t     # python package
ros2 pkg create pkg_cpp --build-type ament_cmake --node-name node_t_cpp # cpp package

# build and run
cd ~/ros2_ws_t
colcon build
source install/setup.bash
ros2 run <package_name> <executable_name>
```

```bash [rosdep]
# install dependencies
rosdep install -i --from-path src --rosdistro jazzy -y
```

## ROS2 Concepts

### Node
Each node in ROS should be responsible for a single, modular purpose. Each node can send and receive data from other nodes via topics, services, actions, or parameters.
In ROS 2, a single executable (C++ program, Python program, etc.) can contain one or more nodes.
A node is a fundamental ROS 2 element that serves a single, modular purpose in a robotics system.
![Nodes](https://docs.ros.org/en/rolling/_images/Nodes-TopicandService.gif)

```bash [run]
ros2 run <package_name> <executable_name>
```

### Topic
Topics don’t have to only be one-to-one communication; they can be one-to-many, many-to-one, or many-to-many.
Nodes publish information over topics, which allows any number of other nodes to subscribe to and access that information.
![Topic](https://docs.ros.org/en/rolling/_images/Topic-MultiplePublisherandMultipleSubscriber.gif)

```bash [topic pub]
ros2 topic pub <topic_name> <msg_type> '<args>'
# pub from yaml
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist --yaml-file cmd_vel.yaml
```

```bash [topic echo]
ros2 topic echo <topic_name>
```

```cpp [topic statistics]
// manually enable topic statistics via options
auto options = rclcpp::SubscriptionOptions();
options.topic_stats_options.state = rclcpp::TopicStatisticsState::Enable;
```

### Service
Services are based on a call-and-response model versus the publisher-subscriber model of topics.
Nodes can communicate using services in ROS 2. Unlike a topic - a one way communication pattern where a node publishes information that can be consumed by one or more subscribers - a service is a request/response pattern where a client makes a request to a node providing the service and the service processes the request and generates a response.
![Service](https://docs.ros.org/en/rolling/_images/Service-MultipleServiceClient.gif)

```bash [service call]
ros2 service call <service_name> <service_type> <arguments>
```

```bash [service echo]
ros2 service echo <service_name | service_type> <arguments>
```

### Parameter
A parameter is a configuration value of a node.
Nodes have parameters to define their default configuration values.

```bash [param set / load]
ros2 param set <node_name> <parameter_name> <value>
ros2 param load <node_name> <parameter_file(yaml)>
```

```bash [param get / dump]
ros2 param get <node_name> <parameter_name>
ros2 param dump <node_name>
```

#### Monitoring for Parameter Changes

Use the `ParameterEventHandler` class to set a callback to monitor changes to that parameter.
```python
import rclpy.parameter
from rclpy.parameter_event_handler import ParameterEventHandler

class SampleNodeWithParameters(Node):
    def __init__(self):
        super().__init__('node_with_parameters')

        self.declare_parameter('an_int_param', 0)

        self.handler = ParameterEventHandler(self)

        self.callback_handle = self.handler.add_parameter_callback(
            parameter_name="an_int_param",
            node_name="node_with_parameters",
            callback=self.callback,
        )

        # monitor another node's parameter
        self.callback_handle2 = self.handler.add_parameter_callback(
            parameter_name="a_double_param",
            node_name="parameter_blackboard",
            callback=self.callback,
        )

        # monitor all parameters
        self.event_calback_handle = self.handler.add_parameter_event_callback(
            callback=self.event_callback,
        )

    def callback(self, p: rclpy.parameter.Parameter) -> None:
        self.get_logger().info(f"Received an update to parameter: {p.name}: {rclpy.parameter.parameter_value_to_python(p.value)}")

    def event_callback(self, parameter_event):
        self.get_logger().info(f"Received parameter event from node {parameter_event.node}")

    for p in parameter_event.changed_parameters:
        self.get_logger().info(
            f"Inside event: {p.name} changed to: {rclpy.parameter.parameter_value_to_python(p.value)}"
        )
```

### Action
Actions are one of the communication types in ROS 2 and are intended for long running tasks. They consist of three parts: a goal, feedback, and a result.
Actions use a client-server model, similar to the publisher-subscriber model (described in the topics tutorial). An “action client” node sends a goal to an “action server” node that acknowledges the goal and returns a stream of feedback and a result.

![Action](https://docs.ros.org/en/rolling/_images/Action-SingleActionClient.gif)

```bash [action send_goal]
ros2 action send_goal <action_name> <action_type> <values>
```

```bash [action echo]
ros2 action echo <action_name> <optional arguments/action_type>
```

Actions are like services that allow you to execute long running tasks, provide regular feedback, and are cancelable.

## Tips

### rqt_console
rqt_console is a graphical tool that allows you to view and filter log messages from ROS 2 nodes in real time. It provides a convenient interface for monitoring the output of your nodes and debugging your ROS 2 applications.

### ros2 launch
Running a single launch file with the ros2 launch command will start up your entire system - all nodes and their configurations - at once.
```bash [ros2 launch]
ros2 launch <package_name> <launch_file.launch.py>
```
Launch files allow you to start up and configure a number of executables containing ROS 2 nodes simultaneously.
```python [launch file example]
from launch import LaunchDescription
import launch_ros.actions


def generate_launch_description():
    return LaunchDescription([
        launch_ros.actions.Node(
            namespace='turtlesim1', package='turtlesim',
            executable='turtlesim_node', output='screen'),
        launch_ros.actions.Node(
            namespace='turtlesim2', package='turtlesim',
            executable='turtlesim_node', output='screen'),
    ])
```

### ros2 bag
ros2 bag is a command line tool for recording data published on topics, services and actions in your ROS 2 system.
```bash [ros2 bag]
mkdir -p ./ros2_bag && cd ./ros2_bag
ros2 bag record --topics <topic_name> <topic_name> ...
ros2 bag record --service <service_name> <service_name> ...
ros2 bag record --action <action_name> <action_name> ...
ros2 bag play <bag_file_name>
ros2 bag play --publish-service-requests <bag_file_name>
ros2 bag play --send-actions-as-client <bag_file_name>
```

### colcon

```bash [symlink]
colcon build --symlink-install
```

```bash [test]
colcon test
colcon test-result --verbose
```

```bash [mixin]
colcon mixin add default https://raw.githubusercontent.com/colcon/colcon-mixin-repository/master/index.yaml
colcon mixin update default
colcon mixin show
colcon build --mixin debug
```

### format

```bash [clang-format]
sudo apt install -y ros-jazzy-ament-cmake-clang-format
clang-format -i ~/ros2_ws_t/src/pkg_cpp/src/*.cpp
```

### plugin

only C++ packages built with ament_cmake can be plugins, and they must export the plugin description in their CMakeLists.txt using `pluginlib_export_plugin_description_file()`. You can list all available plugins in your ROS 2 system using the `ros2 plugin list` command.

```bash [plugin]
ros2 plugin list
```

### rosdep
rosdep is a dependency management utility. It is a command-line utility for identifying and installing dependencies to build or install a package. rosdep is not a package manager in its own right; it is a meta-package manager that uses its own knowledge of the system and the dependencies to find the appropriate package to install on a particular platform.
The package.xml is the file in your software where rosdep finds the set of dependencies. It is important that the list of dependencies in the package.xml is complete and correct, which allows all of the tooling to determine the packages dependencies.
`<depend>`
`<build_depend>`  `<build_export_depend>`
`<exec_depend>`
`<test_depend>`

```bash [rosdep]
sudo apt-get install python3-rosdep
sudo rosdep init
rosdep update
rosdep install --from-paths src -y --ignore-src
```

### msg & srv & action

Note that it is, and can only be, a CMake package.
::: note
It is good practice to keep .msg, .srv, and .action files in separate packages from the nodes that use them. This makes it easier to reuse the interface definitions across different packages.
:::

```msg
# Message definition
```
```srv
# Request
---
# Response
```
```action
# Request
---
# Result
---
# Feedback
```

### AsyncNode (asyncio, Python)

`AsyncNode` is an asyncio-native node API (in `rclpy.experimental`) that lets you write `async def` callbacks and `await` other async operations directly inside ROS callbacks. It runs on the `asyncio` event loop, so it composes naturally with the Python async ecosystem (web clients, DB drivers, async HTTP libs).

Note: `AsyncNode` requires Python 3.12+ and actions are not yet supported.

#### Service — `async def` callback

```python [async_service.py]
import asyncio, rclpy
from rclpy.experimental import AsyncNode

class TriggerServer(AsyncNode):
    def __init__(self):
        super().__init__('trigger_server')
        self.srv = self.create_service(
            Trigger, 'trigger', self._cb, concurrent=True)

    async def _cb(self, _req, resp):          # async callback
        await self.get_clock().sleep(2.0)     # ROS-aware sleep
        await asyncio.to_thread(blocking_fn)  # offload to thread
        resp.success = True
        return resp

async def _main():
    with rclpy.init():
        await TriggerServer().run()           # = rclpy.spin()

def main(): asyncio.run(_main())
```

#### Client — `await client.call()` directly (no Future)

```python [async_client.py]
import asyncio, rclpy
from rclpy.experimental import AsyncNode

async def _main():
    with rclpy.init():
        async with AsyncNode('client') as node:     # auto destroy
            cli = node.create_client(Trigger, 'trigger')
            await cli.wait_for_service()            # no busy-wait
            resp = await cli.call(Trigger.Request()) # no Future

def main(): asyncio.run(_main())
```

#### Key differences from regular `Node`

| | regular `Node` | `AsyncNode` |
|---|---|---|
| run | `rclpy.spin(node)` | `await node.run()` |
| callback | `def cb(req, resp)` sync | `async def cb(req, resp)` can await |
| wait for service | `while not wait_for_service()` poll | `await client.wait_for_service()` suspend |
| call service | `call_async()` → `Future` → `spin_until_future_complete()` | `await client.call()` direct |
| blocking I/O in callback | blocks the executor | `await asyncio.to_thread(sync_func)` |

### URDF

URDF (Unified Robot Description Format) is a file following the XML format for specifying the geometry and organization of robots in ROS.

```bash [URDF]
# View the URDF model
ros2 launch urdf_tutorial display.launch.py model:=my_robot.urdf
# Check the URDF model
check_urdf my_robot.urdf
# graphiz
urdf_to_graphviz my_robot.urdf
```

`xacro` is a macro language for XML. It allows you to define reusable components and macros for your URDF models.

## OpenCV

### Basic Operations
 - access pixel : img[y, x] (row, column)
 - pixel vector : [B, G, R]
 - HSV : Hue(0-179)  Saturation(0-255)  Value(0-255)
```cpp
 img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
```
 - Erode & Dilate
```python
 kernel = np.ones((5, 5), np.uint8)
 img_erode = cv2.erode(img, kernel, iterations=erode_iterations)
 img_dilate = cv2.dilate(img, kernel, iterations=dilate_iterations)
```
 - Mask Location
```python
 contours, hierarchy = cv2.findContours(img_binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
```
 - Canny Edge Detection
```python
 edges = cv2.Canny(img, 100, 200)
```
 - Hough Line Transform
```python
 lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=100, minLineLength=50, maxLineGap=10)
```

### Camera Setup

```bash [camera setup]
sudo apt install -y cheese
sudo apt install -y ros-jazzy-usb-cam
ros2 run usb_cam usb_cam_node_exe
ros2 run rqt_image_view rqt_image_view
```

### TF2

tf2 is the transform library that lets you keep track of multiple coordinate frames over time. It maintains the relationship between frames in a **tree structure** and allows you to query the transform between any two frames at any point in time.

 - **Coordinate Frame** : named reference frame (e.g. `world`, `turtle1`); child frames are attached to parent frames
 - **TransformStamped** : a stamped transform message containing `header.frame_id` (parent), `child_frame_id`, translation `(x, y, z)` and rotation (quaternion)
 - **Broadcaster** : publishes `TransformStamped` messages to tf2 (one broadcaster per moving frame)
 - **Listener + Buffer** : subscribes to all tf2 transforms and caches them; `lookup_transform` queries the relative pose between any two frames

```bash [install]
sudo apt-get install -y ros-jazzy-turtle-tf2-py ros-jazzy-tf2-ros ros-jazzy-tf2-tools
```

#### Demo

```bash [run demo]
# terminal 1 — launch turtlesim + tf2 broadcasters
ros2 launch turtle_tf2_py turtle_tf2_demo.launch.py
# terminal 2 — drive turtle1, turtle2 will follow
ros2 run turtlesim turtle_teleop_key
```

#### tf2 Tools

```bash [view_frames]
# generate frames.pdf — a tree diagram of all broadcast frames
ros2 run tf2_tools view_frames
```

```bash [tf2_echo]
# print the live transform between two frames
ros2 run tf2_ros tf2_echo [source_frame] [target_frame]
# example: transform of turtle2 w.r.t. turtle1
ros2 run tf2_ros tf2_echo turtle2 turtle1
```

```bash [rviz2]
# visualize tf2 frames in 3D
ros2 run rviz2 rviz2 -d $(ros2 pkg prefix --share turtle_tf2_py)/rviz/turtle_rviz.rviz
```

#### Broadcaster

Subscribe to a pose topic → fill a `TransformStamped` → call `sendTransform()`.

#### Listener

Create a `Buffer` + `TransformListener` → call `lookup_transform(to, from, time)` to get the relative pose.

## Links

 - [ROS2 Documentation](https://docs.ros.org/en/rolling)
 - [Example packages for ROS 2](https://github.com/ros2/examples)
