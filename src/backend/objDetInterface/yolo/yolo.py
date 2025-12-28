DEBUG = True
import os
import sys
from ultralytics import YOLO
file_dir = os.path.dirname(__file__)
sys.path.append(file_dir)

import torch
import cv2 as cv
import math
# model = torch.hub.load(r'E:\University\RAIS\scripts\yolo_img_p\yolov5','custom',path=r"E:\University\RAIS\scripts\yolo_img_p\yolov5\runs\train\exp\weights\last.pt",source='local', force_reload=True)

class Yolo:
    def __init__(self, folder_path, model_path, conf,mode):
        if mode=='src':
            self.model = torch.hub.load(folder_path,'custom',path=model_path,source='local', force_reload=True)
            self.model.conf = conf
        elif mode=='dest':
            self.model = YOLO(model_path)
            print("model loaded")
        
    
    def get_bound_box(self, frame):
        self.results = self.model(frame)
        self.df = self.results.pandas().xyxy[0]
        self.xmin = self.df.iloc[:,0]
        self.xmax = self.df.iloc[:,2]
        self.ymin = self.df.iloc[:,1]
        self.ymax = self.df.iloc[:,3]
         
        for i, pixel in self.xmin:
            pass
        
        
    def get_center_coord(self,frame):
        self.dot_coordinates = []
        self.results = self.model(frame)
        self.df = self.results.pandas().xyxy[0]
        self.xmin = self.df.iloc[:,0]
        self.xmax = self.df.iloc[:,2]
        self.ymin = self.df.iloc[:,1]
        self.ymax = self.df.iloc[:,3]

        self.image = frame.copy()
        
        for i in range(len(self.xmax)):
            self.bottomright = [int(self.xmax[i]),int(self.ymin[i])]
            self.topleft = [int(self.xmin[i]),int(self.ymax[i])]
            
            self.cX = int((self.topleft[0] + self.bottomright[0]) / 2.0)
            self.cY = int((self.topleft[1] + self.bottomright[1]) / 2.0)
        
            self.center = (self.cX,self.cY,0)#0 is the orientation, needs to be replaced with actual orientation value
            
            if DEBUG: 
                self.image = cv.circle(frame, (self.cX,self.cY), radius=0, color=(0, 0, 255), thickness=5) 
            self.dot_coordinates.append(self.center)
   
        if DEBUG:
            cv.imshow("obj det", self.image)
            cv.waitKey(0)
            cv.destroyAllWindows()
   
   
        return self.dot_coordinates
    def getd_center_coord(self,frame):
        centers = []
        classname = "blank"
        self.res=self.model(frame)
        print(type(self.res))
        self.image = frame.copy()
        for r in self.res:
            boxes = r.boxes
        #print(boxes)
            for box in boxes:
                if(int(box.cls[0])==0):
            # bounding box
                 x1, y1, x2, y2 = box.xyxy[0]
                 x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2) # convert to int values
                 self.cx = int((x1+x2)/2.0)
                 self.cy = int((y1+y2)/2.0)
                 centers.append([self.cx,self.cy])
            # put box in cam
                 self.image = cv.circle(frame, (self.cx,self.cy), radius=0,color=(255, 0, 255), thickness=3)
           
        cv.imshow('Webcam', self.image)
        cv.waitKey(0) 
        cv.destroyAllWindows()
        center_coords = sorted(centers,key=lambda x : x[1],reverse=True)
        return center_coords
    def get_orientation(self,frame):
        temp=[]
        for i in range(len(self.dot_coordinates)):
            temp.append(0)
        return temp
    
    

if DEBUG:
    print("yolo module loaded successfully")