import multiprocessing
import pandas as pd
import socketio
from fastapi import FastAPI
import robotInterfaces as rb
import barcodeReader as barReader
from datetime import datetime
import uvicorn
import asyncio

x_const=6
y_const= -9
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=["http://localhost:5173"],  # Allowed origins
    cors_credentials=True  # Allow credentials like cookies
)

# Create FastAPI app
app = FastAPI()

# Combine Socket.IO and FastAPI into a single ASGI app
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)
def archive_process(queue):
    import serial.tools.list_ports

    ports = serial.tools.list_ports.comports()
    print(ports)
    for port in ports:
        device = port.device
        print(port)
        desc = port.description.lower()
        print(desc)
        if "ch340" in desc:
            print(f"{device} is the Arduino Mega.")
            robot = rb.Robot('gantry', device)

        elif "usb serial port" in desc:
            print(f"{device} is the Barcode Scanner.")
            VTReader = barReader.BarcodeReader(device)
        else:
            print(f"{device} - {port.description}")
    x_offset=0
    y_offset=3
    height_offset=1
    rhead = 50
    max_height=45
    lisdf = pd.DataFrame(columns=['Tt-id','Pick','Place','Source','Dest'])
    print(robot)
    def robot_pick(pose,rack,row,slot):	 
        pose = [int(num) for num in pose]
        print("Robot Pose:",pose)

        x,y,z = pose
        x = x + x_offset
        y = y + y_offset
        z = z + height_offset
        rHead = 49
        robot.move_to(x,y,max_height,rHead,0)
        robot.move_to(x,y,z,rHead,0)
        robot.move_to(x,y,z,rHead,1)
        #time.sleep(2)
        robot.move_to(x,y,max_height,rHead,1)
        #srac[rack].iloc[slot,row] = datetime.now().strftime('%H:%M:%S')
        return  datetime.now().strftime('%H:%M:%S')

    def robot_place(pose,rack,row,slot,barcode):	 
        x,y,z = pose
        rHead = 49
        x = x+x_offset
        y=y +y_offset
        robot.move_to(x,y,max_height,rHead,1)
        robot.move_to(x,y,max_height,rHead,1)
        robot.move_to(x,y,z,rHead,1)
        robot.move_to(x,y,z,rHead,0)
        time.sleep(1)
        robot.move_to(x,y,max_height,rHead,0)
        return datetime.now().strftime('%H:%M:%S')


    source = [([81+x_const,102+x_const,123+x_const,144+x_const,165+x_const,186+x_const,207+x_const,228+x_const,249+x_const,270+x_const,291+x_const,312+x_const],20+y_const),([84+x_const,105+x_const,126+x_const,147+x_const,168+x_const,189+x_const,210+x_const,231+x_const,252+x_const,273+x_const,294+x_const,315+x_const],41+y_const),([84+x_const,105+x_const,126+x_const,147+x_const,168+x_const,189+x_const,210+x_const,231+x_const,252+x_const,273+x_const,294+x_const,315+x_const],215+y_const)]#([121,142,163],317)]
    dest = [([108+x_const,429+x_const,450+x_const,471+x_const,492+x_const,513+x_const,534+x_const,555+x_const,576+x_const,597+x_const,618+x_const,639+x_const],220+y_const),([108+x_const,429+x_const,450+x_const,471+x_const,492+x_const,513+x_const,534+x_const,555+x_const,576+x_const,597+x_const,618+x_const,639+x_const],120+y_const),([402+x_const,423+x_const,444+x_const,465+x_const,486+x_const,507+x_const,528+x_const,549+x_const,570+x_const,591+x_const,612+x_const,633+x_const],21+y_const)]
    tt_filled = [48,48,0]
# Create a Socket.IO server with CORS configuration

    import time
    import asyncio  # Required for emitting WebSocket events in the process
    from datetime import datetime
    i, l, row, urow, ucol, col, prow = 0, 0, 0, 0, 0, 0, 0
    queue.put(["rstatus", {"cmd": "homing"}])
    robot.home()
    #asyncio.run(sio.emit("rstatus", {"cmd": "Archiving"}))
    queue.put(["rstatus", {"cmd": "Archiving",'tt':sum(tt_filled)}])
    #asyncio.sleep(0)
    print("hiiiiii")
    i=0
    for j in tt_filled:
        print("Rackkkk",i)
        k=j
        prow=0
        while j != 0:
            for k in range(0, 4 if j >= 4 else j):
                xs = source[i][0][prow]
                ys = source[i][1] + 21 * k
                zs = 160
                t1 = robot_pick((xs, ys, zs), i, prow, k)
                t2 = ''
                robot.move_to(xs, 10, 45, gripper_state=1, rHead=49)
                print("Reading barcode")
                ret, barcode = 0, 0
                start_time = time.time()
                try:
                    ret, barcode = VTReader.readBarcode(0.75)
                except Exception as e:
                    print(e)

                xc, yc, zc, rc, gr = robot.get_pose()
                rc = 49
                while not ret and time.time() - start_time <= 10:
                    robot.move_to(xc, yc, zc, rHead=rc, gripper_state=1)
                    rc = rc + 30
                    time.sleep(0.1)
                    ret, barcode = VTReader.readBarcode(0.75)
                    if rc > 180:
                        rc = 0
                print(barcode, ret)
                if ret:
                    xd = dest[l][0][row]
                    yd = dest[l][1] + 21 * col
                    zd = 160
                    t2 = robot_place((xd, yd, zd), l, row, k, barcode)
                    queue.put(['data', {'tt_id': barcode, 'pick': t1, 'place': t2,
                                                  'source': f's{i} {chr(65 + k)} {prow}',
                                                  'dest': f'd{l} {chr(65 + col)} {row}'}])
                    col += 1
                    lisdf.loc[k-j]=[barcode,t1,t2,f's{i} {chr(65 + k)} {prow}',f'd{l} {chr(65 + col)} {row}']
                    if col == 4:
                        row += 1
                        col = 0
                else:
                    xur = dest[2][0][urow]
                    yur = dest[2][1] + 21 * ucol
                    zur = 165
                    t2 = robot_place((xur, yur, zur), 2, urow, ucol, 'unrecognised')
                    queue.put(['data', {'tt_id': 'unrecognised', 'pick': t1, 'place': t2,
                                                  'source': f's{i} {chr(65 + k)} {prow}',
                                                  'dest': f'd{l} {chr(65 + ucol)} {urow}'}])
                    ucol += 1
                    lisdf.loc[k-j]=["Uncrecognised",t1,t2,f's{i} {chr(65 + k)} {prow}',f'd{l} {chr(65 + col)} {row}']
                    if ucol == 4:
                        urow += 1
                        ucol = 0

                j -= 1
            prow += 1
            if row == 13:
                l += 1
                row = 0
        i+=1
    lisdf.to_excel('output.xlsx', sheet_name='LIS')


# Socket.IO event handler
@sio.event
async def connect(sid, environ):
    print(f"Client {sid} connected")
    await sio.emit("message", {"data": "Welcome!"}, to=sid)

@sio.event
async def disconnect(sid):
    print(f"Client {sid} disconnected")

@sio.event
async def chat_message(sid, data):
    print(f"Received message: {data} from {sid}")
    await sio.emit("message", {"data": f"Echo: {data}"}, to=sid)

@sio.event
async def robotCmd(sid, data):
    if data['cmd'] == 'home':
        #await sio.emit("rstatus", {"cmd": "homing"})
        await asyncio.sleep(0)
        # Start the archival process in a new process
        queue = multiprocessing.Queue()
        archival_process = multiprocessing.Process(target=archive_process, args=(queue,))
        archival_process.start()
        while archival_process.is_alive() or not queue.empty():
            if not queue.empty():
                message = queue.get()
                await sio.emit(*message)
            await asyncio.sleep(0.1)
        archival_process.join()
        await sio.emit("rstatus", {"cmd": "completed"})
if __name__ == "__main__":
    uvicorn.run(socket_app, host="127.0.0.1", port=8000)

