DEBUG = False
import os
import sys
import time 

file_dir = os.path.dirname(__file__)
sys.path.append(file_dir)

import DobotDllType as dType

class Dobot:
    def __init__(self,port):
        # pass
        CON_STR = {
        dType.DobotConnect.DobotConnect_NoError:  "DobotConnect_NoError",
        dType.DobotConnect.DobotConnect_NotFound: "DobotConnect_NotFound",
        dType.DobotConnect.DobotConnect_Occupied: "DobotConnect_Occupied"}
        
        
        self.api = dType.load()
        self.state = dType.ConnectDobot(self.api, port, 115200)[0]
        print("Connect status:",CON_STR[self.state])
        
        if (self.state == dType.DobotConnect.DobotConnect_NoError):

            dType.SetQueuedCmdClear(self.api)

            dType.SetHOMEParams(self.api, 200, 200, 200, 200, isQueued = 1)
            dType.SetPTPJointParams(self.api, 400, 400, 400, 400, 400, 400, 400, 400, isQueued = 1)
            dType.SetPTPCommonParams(self.api, 100, 100, isQueued = 1)
            dType.SetPTPJumpParams(self.api, 0, 0)
            time.sleep(1)
            dType.SetIODO(self.api, 13, 1, 1)
            pos = dType.GetPose(self.api)
            # dType.SetIODO(self.api, 13, 1, 1)
            self.cls_freq = 38
            self.opn_freq = 31


        else:
            print("Dobot not connected")
            exit()
        
            
    def move_to(self, x=None, y=None, z=None, rHead=None, gripper_state=None):
        if DEBUG:
            print(f"X:{x}, Y:{y}, Z:{z}, rHead:{rHead}, gripper:{gripper_state}")
            
        self.clear_alarm()
        if (self.state == dType.DobotConnect.DobotConnect_NoError):
            pos = dType.GetPose(self.api)
            if x is None:
                x = pos[0]
            if y is None:
                y = pos[1]
            if z is None:
                z = pos[2]
            if rHead is None:
                rHead = pos[3]
            if gripper_state is None:
                gripper_state = dType.GetEndEffectorGripper(self.api)[0]
                
            dType.SetQueuedCmdClear(self.api)

            indexx = dType.SetPTPCmd(self.api, 1, x, y, z, rHead, 1)[0]
            indexx = dType.SetEndEffectorGripper(self.api, 1,  gripper_state, isQueued=1)[0]
            # self.custom_gripper(gripper_state)
            if gripper_state == 1:
                freq = self.cls_freq
            elif gripper_state == 0:
                freq = self.opn_freq
            indexx = dType.SetIOPWM(self.api, 14, freq, 5, 1)[0]
            
            
            dType.SetQueuedCmdStartExec(self.api)

            while indexx > dType.GetQueuedCmdCurrentIndex(self.api)[0]:
                # print(dType.GetAlarmsState(self.api))
                dType.dSleep(100)

            dType.SetQueuedCmdStopExec(self.api)	
        
        # pass
    
    def rotate_gripper(self, rHead):
        # pass
        self.clear_alarm()
        if (self.state == dType.DobotConnect.DobotConnect_NoError):
            pos = dType.GetPose(self.api)
            x = pos[0]
            y = pos[1]
            z = pos[2]
            # rHead = pos[3]
                
            dType.SetQueuedCmdClear(self.api)

            indexx = dType.SetPTPCmd(self.api, 1, x, y, z, rHead, 1)[0]
            
            dType.SetQueuedCmdStartExec(self.api)

            while indexx > dType.GetQueuedCmdCurrentIndex(self.api)[0]:
                dType.dSleep(100)

            dType.SetQueuedCmdStopExec(self.api)	
            
    def custom_gripper(self,state):
        if state == 1:
            freq = self.cls_freq
        elif state == 0:
            freq = self.opn_freq
        self.set_pwm(13,14,freq)
        
    
    def gripper(self, gripper_state):
        # pass
        self.clear_alarm()
        if (self.state == dType.DobotConnect.DobotConnect_NoError):

            indexx = dType.SetEndEffectorGripper(self.api, 1,  gripper_state, isQueued=1)[0]
            # self.custom_gripper(gripper_state)
            if gripper_state == 1:
                freq = self.cls_freq
            elif gripper_state == 0:
                freq = self.opn_freq
            indexx = dType.SetIOPWM(self.api, 14, freq, 5, 1)[0]
            
            dType.SetQueuedCmdStartExec(self.api)

            while indexx > dType.GetQueuedCmdCurrentIndex(self.api)[0]:
                dType.dSleep(100)

            dType.SetQueuedCmdStopExec(self.api)	
    
    def get_pose(self):
        # pass
        pose = dType.GetPose(self.api)
        pose.append(dType.GetEndEffectorGripper(self.api)[0])
        return pose
    
    def clear_alarm(self):
        # pass
        dType.ClearAllAlarmsState(self.api)
    
    def home(self):
        # pass
        if (self.state == dType.DobotConnect.DobotConnect_NoError):
            dType.SetQueuedCmdClear(self.api)
            indexx = dType.SetHOMECmd(self.api, 1, isQueued=0)[0]
            dType.SetQueuedCmdStartExec(self.api)
            while indexx > dType.GetQueuedCmdCurrentIndex(self.api)[0]:
                dType.dSleep(100)
            dType.SetQueuedCmdStopExec(self.api)	
    
    def set_pwm(self,pwr_pin,pwm_pin,freq):
        if (self.state == dType.DobotConnect.DobotConnect_NoError):
                indexx = dType.SetIODO(self.api, pwr_pin, 1, 1)[0]
                indexx = dType.SetIOPWM(self.api, pwm_pin, freq, 5, 1)[0]
                while indexx > dType.GetQueuedCmdCurrentIndex(self.api)[0]:
                    dType.dSleep(100)
                dType.SetQueuedCmdStopExec(self.api)
                
        
    def transformation(self, x, y, z, rHead):
        # pass
        if x==0 or y==0 or z==0:
            # return ValueError("InvalidCoordinates")
            return None
        # d_x = 202.4 - y 
        d_x = 198 - y 
        d_y = 37.3 - x
        d_z = 622 - z - 122 - 45
        # d_x = 227 + 1.7 - y + 3 - 1.5 - 20 - 3
        # d_y = 57 - 4.5 - x - 10 - 3
        # d_z = 622 - z - 10 - 20 - 69 + 45
        if d_z<-64:
            d_z = -64
        # if d_z<-35:
        #     d_z = -35
        d_rHead = -rHead
        
        return [d_x, d_y, d_z, d_rHead]
    
    
# asd = Dobot('COM10')