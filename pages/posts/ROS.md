---
title: ROS2 setup
---

## system setup

VMware
Ubuntu 24.04 LTS Desktop 64-bit

```bash
sudo apt update
sudo apt-get install open-vm-tools open-vm-tools-desktop -y
bash <(curl -sSL https://linuxmirrors.cn/main.sh)
sudo apt upgrade -y
sudo apt install open-vm-tools-desktop openssh-server -y
sudo systemctl enable ssh
sudo apt install tar bzip2 wget git -y

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
[Nodes](https://docs.ros.org/en/rolling/_images/Nodes-TopicandService.gif)

```bash [run]
ros2 run <package_name> <executable_name>
```

### Topic
Topics don’t have to only be one-to-one communication; they can be one-to-many, many-to-one, or many-to-many.
Nodes publish information over topics, which allows any number of other nodes to subscribe to and access that information.
[Topic](https://docs.ros.org/en/rolling/_images/Topic-MultiplePublisherandMultipleSubscriber.gif)

```bash [topic pub]
ros2 topic pub <topic_name> <msg_type> '<args>'
```

```bash [topic echo]
ros2 topic echo <topic_name>
```

### Service
Services are based on a call-and-response model versus the publisher-subscriber model of topics.
Nodes can communicate using services in ROS 2. Unlike a topic - a one way communication pattern where a node publishes information that can be consumed by one or more subscribers - a service is a request/response pattern where a client makes a request to a node providing the service and the service processes the request and generates a response.
[Service](https://docs.ros.org/en/rolling/_images/Service-MultipleServiceClient.gif)

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

### Action
Actions are one of the communication types in ROS 2 and are intended for long running tasks. They consist of three parts: a goal, feedback, and a result.
Actions use a client-server model, similar to the publisher-subscriber model (described in the topics tutorial). An “action client” node sends a goal to an “action server” node that acknowledges the goal and returns a stream of feedback and a result.

[Action](https://docs.ros.org/en/rolling/_images/Action-SingleActionClient.gif)

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

## OpenCV

### Basic Operations
 - access pixel : img[y, x] (row, column)
 - pixel vector : [B, G, R]
 - HSV : Hue(0-179)  Saturation(0-255)  Value(0-255)
```cpp
 img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
```
 - Erode & Dilate
```cpp
 kernel = np.ones((5, 5), np.uint8)
 img_erode = cv2.erode(img, kernel, iterations=erode_iterations)
 img_dilate = cv2.dilate(img, kernel, iterations=dilate_iterations)
```
 - Mask Location
```cpp
 contours, hierarchy = cv2.findContours(img_binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
```
 - Canny Edge Detection
```cpp
 edges = cv2.Canny(img, 100, 200)
```
 - Hough Line Transform
```cpp
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
