from flask import Flask, render_template, jsonify, request, abort
from datetime import datetime
import os
from data import PROJECTS, PERSONAL_PROJECTS 

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['DEBUG'] = True 
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['SECRET_KEY'] = os.urandom(24)

@app.route('/')
def home():
    is_mobile = request.user_agent.platform in ['android', 'iphone', 'ipad']
    try:
        return render_template('index.html', 
                              projects=PROJECTS, 
                              personal_projects=PERSONAL_PROJECTS, 
                              name="Le Huynh Anh Tuyet",
                              year=datetime.now().year,
                              degree="Very Good (GPA : 8.13 / 10)",
                              education="University of Information Technology, HCM City (UIT)",
                              major="Information Technology",
                              dob="14/10/2000",
                              phone="0817493884",
                              email="lehuynhanh.tuyet10@gmail.com",
                              address="Ho Chi Minh, Vietnam",
                              is_mobile=is_mobile)
    except Exception as e:
        return f"Error rendering template: {str(e)}", 500

@app.route('/favicon.ico')
def favicon():
    return '', 204

@app.route('/api/projects')
def api_projects():
    token = request.args.get('token')
    if not token or token != 'your-secret-token-123':
        abort(403)
    return jsonify({"projects": PROJECTS, "personal_projects": PERSONAL_PROJECTS})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)