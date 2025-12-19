from pyramid.view import view_config
from app.models import User
from app.security import check_password, hash_password, create_token, verify_token
from datetime import datetime, timedelta
import random
import string

# --- HELPER FUNCTION (Digunakan oleh file lain untuk cek token) ---
def get_user_from_request(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, "Missing Token"
    
    payload = verify_token(auth_header)
    if not payload:
        return None, "Invalid or Expired Token"
        
    return payload, None # payload berisi {'sub': user_id, 'role': role}

# --- AUTHENTICATION VIEWS ---

@view_config(route_name='register', renderer='json', request_method='POST')
def register(request):
    try:
        data = request.json_body
        
        # 1. VALIDASI ROLE (Hanya 'admin' atau 'user')
        input_role = data.get('role', '').lower() # Ubah ke huruf kecil semua
        if input_role not in ['admin', 'user']:
            request.response.status = 400
            return {'message': 'Invalid role. Choose "admin" or "user"'}

        # Cek email duplikat
        if request.dbsession.query(User).filter_by(email=data['email']).first():
            request.response.status = 400
            return {'message': 'Email already exists'}

        new_user = User(
            name=data['name'],
            email=data['email'],
            password=hash_password(data['password']),
            role=input_role # Simpan yang sudah di-lowercase
        )
        
        request.dbsession.add(new_user)
        request.dbsession.flush()
        
        return {'message': 'User created successfully', 'id': new_user.id}
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='login', renderer='json', request_method='POST')
def login(request):
    try:
        data = request.json_body
        user = request.dbsession.query(User).filter_by(email=data['email']).first()
        
        if user and check_password(data['password'], user.password):
            # GENERATE JWT TOKEN
            token = create_token(user.id, user.role)
            
            return {
                'message': 'Login success',
                'token': token,  # <-- Kirim Token ke User
                'user_id': user.id,
                'role': user.role,
                'name': user.name
            }
        
        request.response.status = 401
        return {'message': 'Invalid email or password'}
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# --- ADMIN FEATURE (MONITORING USERS) ---
# Saya masukkan fitur ini di auth.py karena berhubungan dengan User Management

@view_config(route_name='users_list', renderer='json', request_method='GET')
def get_all_users(request):
    try:
        # 1. Cek Siapa yang Request? (Sementara pakai query param admin_id)
        # Nanti bisa diupgrade pakai Token juga biar lebih aman
        admin_id = request.params.get('admin_id')

        if not admin_id:
            request.response.status = 401
            return {'message': 'Unauthorized: Please provide admin_id'}

        # 2. Cek di Database: Apakah ID ini beneran Admin?
        admin = request.dbsession.query(User).get(admin_id)
        if not admin or admin.role != 'admin':
            request.response.status = 403 # Forbidden
            return {'message': 'Access Denied: Only Admins can view user list'}

        # 3. Jika Lolos, Tampilkan Semua User
        users = request.dbsession.query(User).all()
        return [{
            'id': u.id,
            'name': u.name,
            'email': u.email,
            'role': u.role,
            'created_at': u.created_at.isoformat()
        } for u in users]

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}
    

@view_config(route_name='forgot_password', renderer='json', request_method='POST')
def forgot_password(request):
    try:
        data = request.json_body
        email = data.get('email')
        
        # 1. Cari User berdasarkan Email
        user = request.dbsession.query(User).filter_by(email=email).first()
        
        # Jika user tidak ditemukan, demi keamanan, kita tetap bilang "Email terkirim" 
        # atau beri pesan error (tergantung kebijakan, untuk tugas kita kasih tau aja errornya)
        if not user:
            request.response.status = 404
            return {'message': 'Email not found'}

        # 2. Generate Token 6 Digit (Huruf Besar + Angka)
        chars = string.ascii_uppercase + string.digits
        token = ''.join(random.choices(chars, k=6))
        
        # 3. Simpan Token & Expiry (15 Menit dari sekarang) ke Database
        user.reset_token = token
        user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=15)
        
        request.dbsession.flush() # Simpan perubahan
        
        # 4. Kirim Email (Perlu import fungsinya dulu)
        from app.email_utils import send_reset_token_email
        send_reset_token_email(user.email, token)
        
        return {'message': 'Reset token sent to your email'}

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}


@view_config(route_name='reset_password', renderer='json', request_method='POST')
def reset_password(request):
    try:
        data = request.json_body
        email = data.get('email')
        token = data.get('token')
        new_password = data.get('new_password')
        
        # 1. Cari User
        user = request.dbsession.query(User).filter_by(email=email).first()
        if not user:
            request.response.status = 404
            return {'message': 'User not found'}
            
        # 2. Validasi Token
        # Cek apakah tokennya sama?
        if user.reset_token != token:
            request.response.status = 400
            return {'message': 'Invalid token'}
            
        # Cek apakah token sudah kadaluwarsa?
        if not user.reset_token_expiry or datetime.utcnow() > user.reset_token_expiry:
            request.response.status = 400
            return {'message': 'Token has expired. Please request a new one.'}
            
        # 3. Ganti Password
        # PENTING: Hash password baru!
        user.password = hash_password(new_password)
        
        # 4. Hapus Token (Supaya tidak bisa dipakai lagi)
        user.reset_token = None
        user.reset_token_expiry = None
        
        request.dbsession.flush()
        
        return {'message': 'Password has been reset successfully. Please login.'}

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}
