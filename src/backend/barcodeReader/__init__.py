import serial
import time

class BarcodeReader:
    
    def __init__(self,port):
        self.port = port
        try:
            self.barcodeScanner = serial.Serial(port=port, baudrate=115200, timeout=0.1)
        except:
            pass
        print(self.barcodeScanner.is_open == True)
        # self.timeout = timeout
        
    def readBarcode(self,timeout):
        if self.barcodeScanner.is_open:
            pass
        else:
            self.barcodeScanner = serial.Serial(port=self.port, baudrate=115200, timeout=0.1)
        self.start_time = time.time()
        self.timeout = timeout
        self.barcodeScanner.flushInput()
        self.barcode_data = ""
        ret = False
        while not self.barcode_data and not (time.time() - self.start_time) >= self.timeout:
            self.barcode_data = self.barcodeScanner.readline().decode('utf-8').strip()
        
        if self.barcode_data != "":
            ret = True
        
        return ret, self.barcode_data
    
    
