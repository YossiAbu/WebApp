import base64
from io import BytesIO
from pathlib import Path
import PIL.Image
import torchvision.transforms as T
from fastai.vision import load_learner
from fastai.vision.image import Image
from flask import Flask, request, jsonify
from torch.nn import Module
from flask_cors import CORS
import os

class FeatureLoss(Module):
    def __init__(self, m_feat, layer_ids, layer_wgts):
        super().__init__()
        self.m_feat = m_feat
        self.loss_features = [self.m_feat[i] for i in layer_ids]
        self.hooks = hook_outputs(self.loss_features, detach=False)
        self.wgts = layer_wgts
        self.metric_names = ['pixel'] +\
                            [f'feat_{i}' for i in range(len(layer_ids))] +\
                            [f'gram_{i}' for i in range(len(layer_ids))]

    def make_features(self, x, clone=False):
        self.m_feat(x)
        return [(o.clone() if clone else o) for o in self.hooks.stored]

    def forward(self, input, target):
        out_feat = self.make_features(target, clone=True)
        in_feat = self.make_features(input)
        self.feat_losses = [base_loss(input, target)]
        self.feat_losses += [base_loss(f_in, f_out)*w
                             for f_in, f_out, w in zip(in_feat, out_feat, self.wgts)]
        self.feat_losses += [base_loss(gram_matrix(f_in), gram_matrix(f_out))*w**2 * 5e3
                             for f_in, f_out, w in zip(in_feat, out_feat, self.wgts)]
        self.metrics = dict(zip(self.metric_names, self.feat_losses))
        return sum(self.feat_losses)

    def __del__(self): self.hooks.remove()

# app configuration 
app = Flask(__name__)
cors = CORS(app, resources={r"/process_image": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# load the model
path = Path(".")
model = load_learner(path, 'SkinDeep2.pkl')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/process_image', methods=['POST'])
def process_image():
    image = request.files['image']
    output = process_image_function(image)
    return jsonify({'output': output})

def process_image_function(image):
    img = PIL.Image.open(image.stream).convert("RGB")
    img_t = T.ToTensor()(img)
    img_fast = Image(img_t)
    _, img_hr, _ = model.predict(img_fast)
    # Convert the tensor back to a PIL image
    img_hr = PIL.Image.fromarray((img_hr.permute(1, 2, 0).numpy() * 255).astype('uint8'))
    # Save the processed image to a BytesIO buffer to return as a base64 encoded string
    buffer = BytesIO()
    img_hr.save(buffer, format='JPEG')
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return img_base64
    
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(debug=True, host="0.0.0.0", port=port)
