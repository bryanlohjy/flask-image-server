from flask import Flask, render_template, request, Response
import re
import base64
from scipy.misc import imsave, imread, imresize
import json

app = Flask(__name__)

def convertImage(baseURI):
    imgstr = re.search(r'base64,(.*)', str(baseURI)).group(1)
    with open('output.png','wb') as output:
        output.write(base64.b64decode(imgstr))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/encode',methods=['GET','POST'])
def encode_image(): # base uri to array
    baseURI = request.get_data()
    # Convert to image and save
    convertImage(baseURI)
    # Read image and convert to array
    x = imread('output.png',mode='L')
    x = imresize(x,(64, 64))
    return Response(json.dumps(x.tolist()),  mimetype='application/json')

@app.route('/decode/',methods=['GET','POST'])
def decode_image():
    array = request.get_data()
    return 'decode the IMG'

if __name__ == '__main__':
    app.run(debug=True)
