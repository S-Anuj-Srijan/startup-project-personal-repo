import json
import sys

def main():
    payload = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
    params = payload.get("params", {})
    node_id = payload.get("nodeId", "unknown")

    model_obj = params.get("modelFile", {})
    model_path = ""
    if isinstance(model_obj, dict):
        model_path = model_obj.get("path") or model_obj.get("name") or ""
    elif isinstance(model_obj, str):
        model_path = model_obj

    import cv2

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise RuntimeError("Cannot open camera (index 0). If you run 2 YOLO nodes, the 2nd will likely fail.)")

    win = f"YOLO Node - {node_id}"

    yolo = None
    try:
        from ultralytics import YOLO
        if model_path:
            yolo = YOLO(model_path)
    except Exception:
        yolo = None

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        if yolo is not None:
            try:
                results = yolo(frame, verbose=False)
                frame = results[0].plot()
            except Exception:
                pass
        else:
            cv2.putText(
                frame,
                "ultralytics not installed OR model path missing",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 0, 255),
                2,
            )
            cv2.putText(
                frame,
                f"model: {model_path}",
                (20, 70),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 255),
                2,
            )

        cv2.imshow(win, frame)
        if cv2.waitKey(1) & 0xFF == 27:  # ESC
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
