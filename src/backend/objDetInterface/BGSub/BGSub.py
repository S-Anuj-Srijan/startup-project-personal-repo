DEBUG = True

import cv2 as cv
from skimage.metrics import structural_similarity
import numpy as np

print("BGSub module loaded successfully")
   
    
class BGSub:
    def __init__(self,bg):
        self.bg = cv.imread(bg)
        
        
    def get_center_coord(self,frame):
        
        self.center_coords=[]        
        self.orientation_list=[]        
        
        self.bg_frame = self.bg

        self.before_gray = cv.cvtColor(self.bg_frame, cv.COLOR_BGR2GRAY)
        self.after_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)

        _, self.diff = structural_similarity(self.before_gray, self.after_gray, full=True)
        # print("Image Similarity: {:.4f}%".format(score * 100))

        self.diff = (self.diff * 255).astype("uint8")
        self.diff_box = cv.merge([self.diff, self.diff, self.diff])

        self.thresh = cv.threshold(
            self.diff, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU)[1]
        
        contours = cv.findContours(
            self.thresh, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
        
        contours = contours[0] if len(contours) == 2 else contours[1]

        self.mask = np.zeros(self.bg_frame.shape, dtype='uint8')
        self.filled_after = frame.copy()

        for c in contours:
            area = cv.contourArea(c)
            if area > 40:
                cv.drawContours(self.mask, [c], 0, (255, 255, 255), -1)
                # cv.drawContours(filled_after, [c], 0, (0,255,0), -1)

        if DEBUG:
            cv.imshow('mask_det', self.mask)
            cv.waitKey()

        self.mask = cv.cvtColor(self.mask, cv.COLOR_BGR2GRAY)

        ret, self.mask = cv.threshold(self.mask, 127, 255, cv.THRESH_BINARY)
        num_labels, labels, stats, centroids = cv.connectedComponentsWithStats(
            self.mask, connectivity=8)
        
        image_with_line = frame.copy()
        img_cont = self.mask.copy()
        img_cont = cv.cvtColor(img_cont, cv.COLOR_GRAY2BGR)
        
        for label in range(1, num_labels):
            self.mask = np.uint8(labels == label) * 255
            isolated_object = cv.bitwise_and(self.mask, self.mask, mask=self.mask)

            contours, _ = cv.findContours(
                isolated_object, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
            img_cont = cv.drawContours(img_cont, contours, -1, (255, 0, 0), 2)
            
            if len(contours) > 0:
                largest_contour = max(contours, key=cv.contourArea)
                area = cv.contourArea(largest_contour)
                perimeter = cv.arcLength(largest_contour, True)
                circularity = 4 * np.pi * area / (perimeter * perimeter)

                if circularity > 0.8:
                    self.orientation = 0
                else:
                    contour_points = largest_contour.reshape(
                        -1, 2).astype(np.float32)
                    mean, eigenvectors = cv.PCACompute(contour_points, mean=None)
                    principal_axis = eigenvectors[0]
                    self.orientation = np.arctan2(principal_axis[1], principal_axis[0])
                    print("orientation: ", np.degrees(self.orientation))
                    self.orientation = self.orientation + np.pi / 2
                    # print("orrirjifjiwie",np.degrees(self.orientation))
                    if self.orientation >= (np.pi / 2):
                        self.orientation = self.orientation - np.pi
                    

                angle_degrees = np.degrees(self.orientation)
                print(f"Object {label} orientation: {angle_degrees:.2f} degrees")

                M = cv.moments(largest_contour)
                self.cx = int(M['m10'] / M['m00'])
                self.cy = int(M['m01'] / M['m00'])
                line_length = 30
                x2 = int(self.cx + line_length * np.cos(self.orientation))
                y2 = int(self.cy + line_length * np.sin(self.orientation))

                image_with_line = cv.line(image_with_line, (self.cx, self.cy), (x2, y2), (255, 0, 0), 2)
                self.center_coords.append((self.cx, self.cy, np.degrees(self.orientation)))
                image_with_line = cv.circle(image_with_line, (self.cx,self.cy), radius=0, color=(0, 0, 255), thickness=5)
                
        if DEBUG:
            # print(f"center of the object: {self.cx},{self.cy}")
            cv.imshow("Image with orientation line",image_with_line)
            cv.waitKey(0)
            cv.imshow("Image with contours",img_cont)
            cv.waitKey(0)
                # self.orientation_list.append(self.orientation)
                
        return self.center_coords
    
    
    def get_orientation(self,frame):
        return self.orientation_list
    
    def update_bg(self,bg):
        self.bg = cv.imread(bg)