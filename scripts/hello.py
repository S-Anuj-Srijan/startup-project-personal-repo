import tkinter as tk
from tkinter import messagebox
import cv2
from PIL import Image, ImageTk

class CameraApp:
    def __init__(self, root, cam_index=0):
        self.root = root
        self.root.title("Hi + Camera")
        self.root.protocol("WM_DELETE_WINDOW", self.on_close)

        # Top "Hi" label
        self.lbl_hi = tk.Label(root, text="Hi 👋", font=("Arial", 24))
        self.lbl_hi.pack(pady=8)

        # Video area
        self.video_label = tk.Label(root)
        self.video_label.pack()

        # Controls
        btn_frame = tk.Frame(root)
        btn_frame.pack(pady=8)
        tk.Button(btn_frame, text="Start", command=self.start).pack(side=tk.LEFT, padx=5)
        tk.Button(btn_frame, text="Stop", command=self.stop).pack(side=tk.LEFT, padx=5)
        tk.Button(btn_frame, text="Quit", command=self.on_close).pack(side=tk.LEFT, padx=5)

        self.cam_index = cam_index
        self.cap = None
        self.running = False
        self.photo = None  # keep reference to avoid GC

    def start(self):
        if self.running:
            return
        self.cap = cv2.VideoCapture(self.cam_index)
        if not self.cap.isOpened():
            messagebox.showerror("Camera Error", f"Could not open camera index {self.cam_index}")
            self.cap.release()
            self.cap = None
            return
        self.running = True
        self.update_frame()

    def stop(self):
        self.running = False
        if self.cap:
            self.cap.release()
            self.cap = None
        # Clear last frame
        self.video_label.config(image="")

    def update_frame(self):
        if not self.running or not self.cap:
            return
        ok, frame = self.cap.read()
        if not ok:
            # Try to recover once
            self.stop()
            messagebox.showwarning("Camera", "Frame grab failed. Stopped.")
            return

        # Convert BGR (OpenCV) -> RGB (PIL/Tk)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Optional: resize preview to a reasonable width
        max_w = 800
        h, w, _ = frame.shape
        if w > max_w:
            scale = max_w / w
            frame = cv2.resize(frame, (int(w*scale), int(h*scale)))

        img = Image.fromarray(frame)
        self.photo = ImageTk.PhotoImage(image=img)
        self.video_label.config(image=self.photo)

        # Schedule next frame
        self.root.after(15, self.update_frame)  # ~60–66 fps target

    def on_close(self):
        self.stop()
        self.root.destroy()

if __name__ == "__main__":
    root = tk.Tk()
    app = CameraApp(root, cam_index=0)  # change to 1/2 if you have multiple cameras
    root.mainloop()
