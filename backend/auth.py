
# Endpoint for user login and token generation
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    user = users.get(username)

    if not user or user['password'] != password:
        return jsonify({'message': 'Invalid username or password'}), 401

    # Generate JWT token
    
    token = jwt.encode({'username': username, 'role': user['role'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({'token': token}), 200

# Decorator to enforce admin permissions
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Authorization token is missing'}), 401

        try:
            decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            print(decoded_token['role'])
            print(decoded_token['username'])
            if decoded_token['role'] != 'admin':
                return jsonify({'message': 'Admin permission required'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated_function

# Protected endpoint accessible only to admins
@app.route('/api/admin', methods=['GET'])
@admin_required
def admin_only_endpoint():
    return jsonify({'message': 'Admin endpoint'}), 200
