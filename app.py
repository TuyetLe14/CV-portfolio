from flask import Flask, render_template, jsonify, request, abort
from datetime import datetime
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['DEBUG'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['SECRET_KEY'] = os.urandom(24)

PROJECTS = [
    {
        "title": "YOLO Online Shopping System",
        "description": "Crafted a responsive frontend and optimized APIs/Firebase, boosting performance by 20% during internship at Data Design Vietnam (12/2020 - 06/2021).",
        "tools": "JavaScript, Visual Studio Code, Postman",
        "image": "https://via.placeholder.com/300x200?text=YOLO",
        "achievement": "Mastered MVC architecture for seamless integration."
    },
    {
        "title": "Blockchain Wallet System",
        "description": "Engineered a robust backend with Firebase, achieving 95% transaction accuracy at Data Design Vietnam (12/2020 - 06/2021).",
        "tools": "C#, .NET, Firebase",
        "image": "https://via.placeholder.com/300x200?text=Blockchain",
        "achievement": "Pioneered real-time database solutions."
    },
    {
        "title": "Website BMA Calculator",
        "description": "Developed automated testing with Selenium, cutting manual effort by 30% at Testing Vietnam (05/2022 - 09/2022).",
        "tools": "Selenium, Jira, JMeter",
        "image": "https://via.placeholder.com/300x200?text=BMA",
        "achievement": "Implemented an innovative CI/CD pipeline."
    },
    {
        "title": "Attendance System (Facial Recognition)",
        "description": "Created a facial recognition attendance system with 95% accuracy at Smart Attendance System (03/2020 - 09/2020).",
        "tools": "Python, JavaScript, Anaconda, Visual Studio Code",
        "image": "https://via.placeholder.com/300x200?text=Attendance",
        "achievement": "Enhanced API efficiency with RESTful design."
    },
    {
        "title": "OrangeHRM Manual Testing",
        "description": "Conducted manual testing to elevate quality at Testing Vietnam (05/2022 - 09/2022).",
        "tools": "Jira",
        "image": "https://via.placeholder.com/300x200?text=OrangeHRM",
        "achievement": "Streamlined bug reporting processes."
    }
]

PERSONAL_PROJECTS = [
    {
        "title": "Personal Automation Tool",
        "description": "Built a custom Selenium script for automated testing, inspired by internship insights.",
        "tools": "Python, Selenium",
        "image": "https://via.placeholder.com/300x200?text=Personal",
        "achievement": "Boosted efficiency by 25% in testing workflows."
    }
]

@app.route('/')
def home():
    is_mobile = request.user_agent.platform in ['android', 'iphone', 'ipad']
    try:
        return render_template('index.html', 
                              projects=PROJECTS, 
                              personal_projects=PERSONAL_PROJECTS, 
                              name="Le Huynh Anh Tuyet",
                              year=datetime.now().year,
                              degree="Very Good (GPA > 8)",
                              education="University of Information Technology, HCM City (UIT)",
                              dob="14/10/2000",
                              phone="0817493884",
                              email="tgdd.ld9941@gmail.com",
                              address="Ho Chi Minh, Vietnam",
                              is_mobile=is_mobile)
    except Exception as e:
        return f"Error rendering template: {str(e)}", 500

@app.route('/api/projects')
def api_projects():
    token = request.args.get('token')
    if not token or token != 'your-secret-token-123':
        abort(403)
    return jsonify({"projects": PROJECTS, "personal_projects": PERSONAL_PROJECTS})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)