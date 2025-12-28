import os
import sys

file_dir = os.path.dirname(__file__)
sys.path.append(file_dir)

DEBUG = False

import realsense.camera_rs as rs

class Camera:
    def __init__(self,type,resolution,fps):
        if type == 0:
            # realsense
            self.camera = rs.RSCamera(resolution,fps) 
            
        
    def calibration(self):
        pass
    
    def get_depth(self):
        pass
    
    def get_frames(self):
        pass
    
    def pose(self): 
        pass
    
    def transform(self):
        pass
    
    def stop_pipeline(self):
        self.camera.stop_pipeline()