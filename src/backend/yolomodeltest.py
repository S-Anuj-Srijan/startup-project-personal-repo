import cv2
from ultralytics import YOLO

# Load your trained model (replace with your model path if needed)
model = YOLO('C:/Users/text2/Desktop/Gantry/model/data/Gantry/backend/Yolo-Models/test_tube.pt')  # or your own model path, e.g., 'best.pt' or 'yolo11.pt'

# Open the default webcam (0). Use 1, 2, etc., if multiple cameras are connected
cap = cv2.VideoCapture(2)

# Check if the webcam is opened correctly
if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

# Set optional frame dimensions
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Run detection on the current frame
    results = model.predict(source=frame, show=False, stream=False, verbose=False)

    # Render results on the frame
    annotated_frame = results[0].plot()

    # Display the annotated frame
    cv2.imshow("YOLO Object Detection", annotated_frame)

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
