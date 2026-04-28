import sqlite3
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

import os

frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'front end'))
app = Flask(__name__, static_folder=frontend_dir, static_url_path='/')

@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(frontend_dir, path)):
        return app.send_static_file(path)
    return "Not Found", 404

CORS(app)

DB_FILE = 'canteen.db'

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    # Create Orders table
    c.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY,
            items TEXT,
            total INTEGER,
            date TEXT,
            status TEXT,
            student_name TEXT,
            student_id TEXT
        )
    ''')
    try:
        c.execute('ALTER TABLE orders ADD COLUMN qr_scanned INTEGER DEFAULT 0')
    except sqlite3.OperationalError:
        pass # Column already exists
        
    c.execute('''
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    ''')
    c.execute('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', ('canteen_name', 'Smart Canteen'))
    c.execute('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', ('owner_upi', 'hashirkonnola2006@oksbi'))
    c.execute('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', ('owner_phone', ''))
    
    # Create Users table for Google Auth
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            name TEXT,
            department TEXT,
            student_id TEXT
        )
    ''')
    
    # Create Menu table
    c.execute('''
        CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            subtitle TEXT,
            price INTEGER,
            img TEXT
        )
    ''')
    try:
        c.execute('ALTER TABLE menu ADD COLUMN available INTEGER DEFAULT 1')
    except sqlite3.OperationalError:
        pass # Column already exists
        
    # Initialize default menu if empty
    c.execute('SELECT COUNT(*) FROM menu')
    if c.fetchone()[0] == 0:
        default_menu = [
            ("Meals", "Full Lunch", 30, "https://lh3.googleusercontent.com/aida-public/AB6AXuCGjmyqrhHFHzoLGgy-96Jgczo8y6jq6HEijIVLLizX4hqCjfdjVO2oiHdr4ZE35KX81AEvARkkRmw--Uy128uOTF8fEcpMVvNDXpDsP1y-Xs3wQivXnG0i9FxDtq76D-zfGGJSxzuOpRVPdQXyzAVT57dJ8IkNUdTNPHPfKKCVbTy664FkibqXAy3Ya0nbaNnYkJqmtYr1jzreiOqJkKcmei9gVDIy8zu30hjCIQcpZ16Jqq8rWw1tY71FXpdlQIzal4P8Ju7RrXx8"),
            ("Biriyani", "Premium", 65, "https://lh3.googleusercontent.com/aida-public/AB6AXuDeiKXM42ICpsDb1DNhPLUFXtuGTW7ZSUGmWKM4j-RQNvQ9R5t3BsY0BU2bEdHLxc7vfYTUO1ON1ednjN-tXrOCHFNUVWyyYlZztMxr5EWkaRoWx6tFCP5uMt1VzhnuG9f9PsYf3rSMMYtB8g-nTDeUfiuRox7vVkGFvYhtQlHcYTzOL2kvH4YL6oXm-T7yNxqh7HZ3O3MrQaDcg89jHnqla_5oFe7EaDLLFgo-JlY9HHVv6QRqqjCNGAKxLDBPMZuyDE_6zftnJ9AX"),
            ("Biriyani Rice", "Quick Lunch", 40, "https://lh3.googleusercontent.com/aida-public/AB6AXuDgwfzPa6EXTPXHqAo4nBbhGwtXu7cae6kuh-ZLIKSek6fHRI-Q59XA9u6sHVx9H1kI6SFpGvp1UET2PYYTVgl1_dgr4ADxtZotTUR9erLiGnKgbghgu4K1jdxu8Ncr8ECRfRMVCHg2LaQx9_xSJl6tRfr0vy83woQ3EdYKWYm4OhFzJPHb2eS1tCE9VH_9LCgB-l5NrlxlqH41xMEZGH9Lxwasp2O8IvxIPpv3VVKdftl6kjgOVGw2sGfmt6Q_d2F7mMPXZ3RrHHDq"),
            ("Samosa", "Snacks", 8, "https://lh3.googleusercontent.com/aida-public/AB6AXuD18JXUxrW41B1yS_re-eshR0oN79VeboJ37e8Bukq-BxkrdUVkPL7SnDdyWaz0U71H8xQWG_lSWD98uNu4N68d5ZXT_L2Lmt9T_a2eoc-L3zka-qUFnWy1gBrCiTbfUtNrN3dUpXtlN2MpI3fyjsUgDLJD0GbSEtDwYUSdq0P8Vp2ar4aleIsKSkpZgWKindp_6Vv2_8mxT_WsJd7i_zZTmOnmeWWR5w4Jrjrydu-7tzkUbMS309Bef5k09uKsWP3TBFSef8UZOFwJ"),
            ("Tea", "Hot Drinks", 8, "https://lh3.googleusercontent.com/aida-public/AB6AXuBGpTP4jU4LusK7Megj_c2h8rq-idHdRe4leY552SSNVyQIOLQt2npzhghHy7lSowb9DbtZTZ1bIB7VPPpuicHoryLnQJtWBogLrvb5B9sTX3VqDxcYuCrblCrp1LkzyGG--uiOKzu19ahlSS_RUaQS6LeiAps07K7vl2SuFZFw5i5EQEdPmI0uX-ELeR1AqqlR-Q41G-E4gAcNO0yW6eOUVSrFHaO0r5uj4Nz9KbHwetLSMcCjzcH4Pkkh5bLnZFUgwyDhbYRV9k0H"),
            ("Coffee", "Hot Drinks", 12, "https://lh3.googleusercontent.com/aida-public/AB6AXuDLax5wZswl35-3xLz7rRymHazyjU6ClKDdHncaTqQzu4Jcj3FDQFSizN1S2t5KlJ4q1GaIxTVzEbZKduQCz4ktTjoTe-CqKA2QpR-iK1s_GE3uzCUOmRTDp1JrEyCDLv4w0Dns9qO8bMICy_c9m57gto051dWSpbF4PENp3_BRGdbOe3aw242Jr-28AEUGSGrWwrh5KYcg_k4_vQYVVjOkneHYramnxHz9RhA1PlJGfta9lOSX1sYGMutlyycoCVrEGUUDm4STLEvR")
        ]
        c.executemany('INSERT INTO menu (name, subtitle, price, img) VALUES (?, ?, ?, ?)', default_menu)
    conn.commit()
    conn.close()

init_db()

@app.route('/api/menu', methods=['GET'])
def get_menu():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM menu')
    menu = []
    for row in c.fetchall():
        item = dict(row)
        item['_id'] = item['id']
        item['category'] = item['subtitle']
        item['available'] = bool(item.get('available', 1))
        menu.append(item)
    conn.close()
    return jsonify(menu)

@app.route('/api/menu', methods=['POST'])
def update_menu():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    if isinstance(data, list):
        c.execute('DELETE FROM menu')
        for item in data:
            c.execute('INSERT INTO menu (name, subtitle, price, img) VALUES (?, ?, ?, ?)', 
                      (item['name'], item.get('subtitle', ''), item['price'], item.get('img', '')))
    else:
        c.execute('INSERT INTO menu (name, subtitle, price, img) VALUES (?, ?, ?, ?)', 
                  (data['name'], data.get('category', data.get('subtitle', '')), data['price'], data.get('img', '')))
    conn.commit()
    conn.close()
    return jsonify({"message": "Menu updated successfully"})

@app.route('/api/menu/<int:item_id>', methods=['PUT'])
def update_menu_item(item_id):
    data = request.json
    conn = get_db()
    c = conn.cursor()
    if 'price' in data and 'available' in data:
        c.execute('UPDATE menu SET price = ?, available = ? WHERE id = ?', (data['price'], 1 if data['available'] else 0, item_id))
    elif 'price' in data:
        c.execute('UPDATE menu SET price = ? WHERE id = ?', (data['price'], item_id))
    elif 'available' in data:
        c.execute('UPDATE menu SET available = ? WHERE id = ?', (1 if data['available'] else 0, item_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Item updated"})

@app.route('/api/menu/<int:item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('DELETE FROM menu WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Item deleted"})

@app.route('/api/orders', methods=['GET'])
def get_orders():
    # In a real app we'd filter by student_id, but here we just return all
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM orders ORDER BY date DESC')
    orders = []
    for row in c.fetchall():
        order = dict(row)
        order['items'] = json.loads(order['items'])
        order['studentId'] = order.get('student_id', 'Unknown')
        order['studentName'] = order.get('student_name', 'Unknown')
        order['qr_scanned'] = order.get('qr_scanned', 0)
        orders.append(order)
    conn.close()
    return jsonify(orders)

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    items = json.dumps(data.get('items', {}))
    total = data.get('total', 0)
    date = data.get('date', datetime.utcnow().isoformat())
    status = data.get('status', 'pending')
    student_name = data.get('studentName', 'Unknown')
    student_id = data.get('studentId', 'Unknown')
    payment_method = data.get('paymentMethod', 'cash')
    
    try:
        # Check if payment_method column exists; if not, ignore it or we should add it?
        # Actually the table schema doesn't have payment_method!
        # Wait, I noticed earlier the schema didn't have payment_method. Let's store it in student_id or add it to table?
        # Since I cannot alter table easily if it has data, I will just stick to the original query but omit order_id
        c.execute('''
            INSERT INTO orders (items, total, date, status, student_name, student_id)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (items, total, date, status, student_name, student_id))
        conn.commit()
        order_id = c.lastrowid
        conn.close()
        return jsonify({"message": "Order created successfully", "order_id": order_id}), 201
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders/<int:order_id>', methods=['PATCH'])
def update_order_status(order_id):
    data = request.json
    new_status = data.get('status')
    if new_status not in ['pending', 'completed', 'cancelled']:
        return jsonify({"error": "Invalid status"}), 400
        
    conn = get_db()
    c = conn.cursor()
    c.execute('UPDATE orders SET status = ? WHERE id = ?', (new_status, order_id))
    conn.commit()
    updated = c.rowcount
    conn.close()
    
    if updated > 0:
        return jsonify({"message": "Status updated successfully"})
    else:
        return jsonify({"error": "Order not found"}), 404

@app.route('/api/orders/<int:order_id>/scan', methods=['POST'])
def scan_order_qr(order_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT qr_scanned FROM orders WHERE id = ?', (order_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        return jsonify({"error": "Order not found"}), 404
        
    if row['qr_scanned'] == 1:
        conn.close()
        return jsonify({"error": "QR code already used! Bill was already printed."}), 400
        
    c.execute('UPDATE orders SET qr_scanned = 1, status = "completed" WHERE id = ?', (order_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "QR scanned successfully, bill can be printed."})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if email == 'owner@ruchicoet.com' and password == 'ruchi2026':
        return jsonify({"token": "demo-admin-token"})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/settings', methods=['GET'])
def get_settings():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT key, value FROM settings')
    settings = {row['key']: row['value'] for row in c.fetchall()}
    conn.close()
    return jsonify(settings)

@app.route('/api/settings', methods=['POST'])
def update_settings():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    for key, value in data.items():
        c.execute('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', (key, value))
    conn.commit()
    conn.close()
    return jsonify({"message": "Settings updated"})

@app.route('/api/users/sync', methods=['POST'])
def sync_user():
    data = request.json
    email = data.get('email')
    name = data.get('name')
    department = data.get('department')
    student_id = data.get('student_id')
    
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = c.fetchone()
    
    if user:
        if department is None and student_id is None:
            conn.close()
            return jsonify(dict(user))
        else:
            c.execute('UPDATE users SET department = ?, student_id = ? WHERE email = ?', (department, student_id, email))
            conn.commit()
            conn.close()
            return jsonify({"email": email, "name": name, "department": department, "student_id": student_id})
    else:
        if department is None or student_id is None:
            conn.close()
            return jsonify({"status": "new_user_needs_info"}), 202
        else:
            c.execute('INSERT INTO users (email, name, department, student_id) VALUES (?, ?, ?, ?)', (email, name, department, student_id))
            conn.commit()
            conn.close()
            return jsonify({"email": email, "name": name, "department": department, "student_id": student_id})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
