from flask import Flask,render_template,jsonify,request
import numpy as np

class ProxyMLP:
    def __init__(self,coefs):
        self.coefs_ = coefs

    def predict(self,x):
        tmp = x
        for c in self.coefs_:
            tmp = np.dot(tmp,c)
        return tmp.argmax() + 1

clf = ProxyMLP( np.load( "tmp.npy" ,allow_pickle=1 ) )


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("canvas-demo.html")


@app.route("/predict",methods=["POST"])
def predict_api():
    mat = request.form.get('mat')
    if mat is None:
        return '',404
    print(mat)
    m = np.array(list(mat),dtype=int)
    print("prediction:%d"%clf.predict(m))
    return jsonify({"prediction": int(clf.predict(m))})

if __name__ == "__main__":
    app.run(debug=1)
