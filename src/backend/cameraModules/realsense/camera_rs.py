import os
import sys

file_dir = os.path.dirname(__file__)
sys.path.append(file_dir)

DEBUG = False

import pyrealsense2 as rs
import cv2 as cv    
import numpy as np


class RSCamera:
    def __init__(self,resolution,fps):        
        # pass
        print(resolution,fps)
        self.pipeline = rs.pipeline()
        self.config = rs.config()

        # self.config.enable_stream(rs.stream.color, 640, 480, rs.format.bgr8, 30)
        # self.config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 30)
        self.config.enable_stream(rs.stream.color, resolution[0], resolution[1], rs.format.bgr8, fps)
        self.config.enable_stream(rs.stream.depth, resolution[0], resolution[1], rs.format.z16, fps)

        # pipeline.start(config)
        self.pipeline_profile = self.pipeline.start(self.config)

        self.align_to = rs.stream.color
        self.align = rs.align(self.align_to)
    
        frames = self.pipeline.wait_for_frames()
        aligned_frames = self.align.process(frames)
        self.depth_frame = aligned_frames.get_depth_frame()
        self.color_frame = aligned_frames.get_color_frame()
        
        if DEBUG:
            profile = self.pipeline.get_active_profile()
            camera = profile.get_device()
            is_streaming = camera.is_streaming()
            print(is_streaming)
    
    
    def get_distance(self,pixel_x,pixel_y):
        # pass
        # depth_frame, _ = self.get_frames()
        self.frames = self.pipeline.wait_for_frames()
        self.aligned_frames = self.align.process(self.frames)
        depth_frame = self.aligned_frames.get_depth_frame()
        depth_value = depth_frame.get_distance(pixel_x,pixel_y)
        
        if DEBUG:
            print(depth_value)
        
        return depth_value
    
    def deproject(self, pixel_x,pixel_y,depth_frame):
        # pass
        # depth_frame, _ = self.get_frames()
        if DEBUG:
            print(f"Pixel Coords: {pixel_x}, {pixel_y}")
        
        # print("inside_rs",pixel_x,pixel_y)
        # self.frames = self.pipeline.wait_for_frames()
        # self.aligned_frames = self.align.process(self.frames)
        # depth_frame = self.aligned_frames.get_depth_frame()
        
        depth_intrinsics = depth_frame.profile.as_video_stream_profile().intrinsics
        depth_sensor = self.pipeline_profile.get_device().first_depth_sensor()

        depth_scale = depth_sensor.get_depth_scale() 
        
        depth_value = depth_frame.get_distance(pixel_x,pixel_y)
        real_world_coords = rs.rs2_deproject_pixel_to_point(depth_intrinsics, [pixel_x,pixel_y], depth_value / depth_scale)
        
        if DEBUG:
            print(real_world_coords)
        
        return real_world_coords

    def get_parameters(self):
        pass
        

    def get_pose(self, pixel_x,pixel_y):
        pass
    
    def get_frames(self):
        # pass
        self.frames = self.pipeline.wait_for_frames()
        self.aligned_frames = self.align.process(self.frames)
        depth_frame = self.aligned_frames.get_depth_frame()
        color_frame = self.aligned_frames.get_color_frame()
        depth_colormap = cv.applyColorMap(cv.convertScaleAbs(np.asanyarray(depth_frame.get_data()), alpha=0.03), cv.COLORMAP_JET)
        # color_image = cv2.cvtColor(np.asanyarray(color_frame.get_data()), cv2.COLOR_BGR2RGB)
        color_image = np.asanyarray(color_frame.get_data())
    
        
        if DEBUG:
            cv.imshow("Depth Image", depth_colormap)
            cv.imshow("Color Image", color_image)
            cv.waitKey()
            cv.destroyAllWindows()
        
        return depth_frame, color_image
        
    def stop_pipeline(self):
        self.pipeline.stop()

    
# cam1 = RSCamera([640,480],30)
if __name__ == '__main__':
    pass