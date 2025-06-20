from flask import Flask, render_template, request, redirect, session, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import random
import json
import os

# Config.json se parameters load karna
with open('config.json', 'r') as c:
    parmas = json.load(c)["parmas"]

app = Flask(__name__)
app.secret_key = 'supersecretkey123'

# Mail configuration
app.config.update(
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME=parmas['user_name'],
    MAIL_PASSWORD=parmas['password']
)
mail = Mail(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = parmas['local_url']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ------------------ Database Models ------------------

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)

class Templates(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    category = db.Column(db.String(50))
    background = db.Column(db.String(100))
    thumbnail = db.Column(db.String(100))
    json_data = db.Column(db.Text)

class About(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    templates = db.Column(db.Integer)
    certificates = db.Column(db.Integer)
    subscribers = db.Column(db.Integer)
    clients = db.Column(db.Integer)

class Contact(db.Model):
    s_no = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    message = db.Column(db.String(100), nullable=False)

# ------------------ Routes ------------------

@app.route("/")
def login():
    return render_template("Login.html", parmas=parmas)

@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        otp_input = request.form.get('otp')

        if otp_input:
            if otp_input == session.get('otp'):
                new_user = Users(name=session['name'], email=session['email'], password=session['password'])
                db.session.add(new_user)
                db.session.commit()
                session.clear()
                return redirect(url_for('home'))
            else:
                return render_template('Login.html', parmas=parmas, show_otp=True, otp_error="Invalid OTP")

        existing_user = Users.query.filter_by(email=email).first()
        if existing_user:
            return render_template('Login.html', parmas=parmas, email_error="Email already registered")

        otp = str(random.randint(100000, 999999))
        session['otp'] = otp
        session['name'] = name
        session['email'] = email
        session['password'] = password

        try:
            mail.send_message(
                'Your OTP for Registration',
                sender=parmas['user_name'],
                recipients=[email],
                body=f"Hello {name},\n\nYour OTP is: {otp}\n\nThank you!"
            )
            return render_template('Login.html', parmas=parmas, show_otp=True)
        except Exception as e:
            return f"Failed to send OTP. Error: {e}"

    return render_template("Login.html", parmas=parmas)

@app.route('/verify_otp', methods=['GET', 'POST'])
def verify_otp():
    if request.method == 'POST':
        user_otp = request.form.get('otp')
        session_otp = session.get('otp')

        if not session_otp or not session.get('email'):
            return "❌ Session expired. Please register again."

        if user_otp == session_otp:
            try:
                new_user = Users(
                    name=session['name'],
                    email=session['email'],
                    password=session['password']
                )
                db.session.add(new_user)
                db.session.commit()
            except Exception as e:
                return f"❌ Failed to register user: {e}"

            session.clear()
            return redirect(url_for('home'))
        else:
            return "❌ Invalid OTP. Please try again."

    return render_template("/register")

@app.route('/home')
def home():
    return render_template("Home.html", parmas=parmas)

@app.route('/about')
def about():
    stats = About.query.first()
    return render_template("About.html", stats=stats)

# @app.route('/editor')
# def editor_1():
#     return render_template("Editor.html", parmas=parmas)

@app.route('/team')
def team():
    return render_template("Team.html", parmas=parmas)

@app.route("/contact", methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        entry = Contact(name=name, email=email, message=message)
        db.session.add(entry)
        db.session.commit()
        try:
            mail.send_message('New message from ' + name,
                              sender=parmas['user_name'],
                              recipients=[parmas['user_name']],
                              body=f"Name={name}\n Email={email}\n Message={message}\n")
            mail.send_message('Thank you for contacting us',
                              sender=parmas['user_name'],
                              recipients=[email],
                              cc=[parmas['user_name']],
                              body=f"Dear {name},\n\nThank you for reaching out to us. We have received your message:\n"
                                   f"\n{message}\n\nWe will get back to you soon!\n\nBest Regards,\nYour Website Team"
                              )
            print("Email sent successfully!")
        except Exception as e:
            print(f"Error sending email: {e}")

    return render_template('contact.html', parmas=parmas)

@app.route("/login", methods=["POST"])
def login_post():
    email = request.form.get("email")
    password = request.form.get("password")
    user = Users.query.filter_by(email=email, password=password).first()
    if user:
        session['user_id'] = user.id
        return redirect(url_for("home"))
    else:
        return "❌ Invalid login credentials"

# ------------------ Templates Management ------------------

@app.route("/services")
def services():
    templates = Templates.query.all()
    return render_template("Services.html", templates=templates, parmas=parmas)

@app.route('/editor')
def editor_1():
    templates = Templates.query.all()  # ya jahan se bhi aa rahe ho
    return render_template('Editor.html', templates=templates)

@app.route("/all_templates")
def all_templates():
    templates = Templates.query.all()
    return render_template("all_templates.html", templates=templates)

@app.route("/insert_templates")
def insert_templates():
    base_path = os.path.join("static", "templates")
    inserted = 0

    for folder in os.listdir(base_path):
        path = os.path.join(base_path, folder)
        if os.path.isdir(path):
            try:
                bg_path = f"templates/{folder}/bg.png"
                thumb_path = f"templates/{folder}/thumbnail.png"
                with open(os.path.join(path, "data.json"), "r") as f:
                    json_data = f.read()

                if not Templates.query.filter_by(name=folder).first():
                    new_template = Templates(
                        name=folder,
                        category='academic',
                        background=bg_path,
                        thumbnail=thumb_path,
                        json_data=json_data
                    )
                    db.session.add(new_template)
                    inserted += 1
            except Exception as e:
                print(f"Error adding template {folder}: {e}")

    db.session.commit()
    return f"✅ Total templates inserted: {inserted}"
@app.route('/save_template/<int:template_id>', methods=['POST'])
def save_template(template_id):
    data = request.get_json()
    template = Templates.query.get_or_404(template_id)
    template.json_data = data.get('json_data', '')
    db.session.commit()
    return render_template({'status': 'success'})
@app.route("/api/template/<int:id>")
def get_template(id):
    template = Templates.query.get_or_404(id)
    return {
        "id": template.id,
        "name": template.name,
        "background": template.background,
        "json_data": template.json_data
    }

@app.route('/editor/<int:id>')
def editor(id):
    template = Templates.query.get_or_404(id)
    all_templates = Templates.query.all()
    return render_template("Editor.html", template=template, templates=all_templates)


# ------------------ Main ------------------

if __name__ == "__main__":
    app.run(debug=True, port=8050)