from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import DBAPIError
from .models import User, Event
from .security import check_password, hash_password
from datetime import datetime
import uuid

# --- AUTHENTICATION ---

@view_config(route_name='register', renderer='json', request_method='POST')
def register(request):
    try:
        data = request.json_body
        # Cek email duplikat
        if request.dbsession.query(User).filter_by(email=data['email']).first():
            request.response.status = 400
            return {'message': 'Email already exists'}

        new_user = User(
            name=data['name'],
            email=data['email'],
            password=hash_password(data['password']),
            role=data['role'] # 'organizer' atau 'attendee'
        )
        request.dbsession.add(new_user)
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
            return {
                'message': 'Login success',
                'user_id': user.id,
                'role': user.role,
                'name': user.name
            }
        
        request.response.status = 401
        return {'message': 'Invalid email or password'}
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# --- EVENT MANAGEMENT ---

@view_config(route_name='events', renderer='json', request_method='GET')
def get_events(request):
    # Mengambil semua event (Fitur Browse untuk Attendee)
    events = request.dbsession.query(Event).all()
    return [{
        'id': e.id,
        'title': e.title,
        'description': e.description,
        'date': e.date.isoformat(),
        'location': e.location,
        'capacity': e.capacity,
        'ticket_price': e.ticket_price,
        'organizer_id': e.organizer_id
    } for e in events]

@view_config(route_name='events', renderer='json', request_method='POST')
def create_event(request):
    try:
        data = request.json_body
        
        # Cek apakah user adalah organizer
        # (Catatan: Di aplikasi real, user_id diambil dari Token/Session, bukan dikirim mentah dari body)
        organizer = request.dbsession.query(User).get(data['organizer_id'])
        if not organizer or organizer.role != 'organizer':
            request.response.status = 403
            return {'message': 'Only organizers can create events'}

        # Parsing tanggal (Format: YYYY-MM-DD HH:MM)
        # Contoh input: "2025-12-31 19:00"
        event_date = datetime.strptime(data['date'], '%Y-%m-%d %H:%M')

        new_event = Event(
            organizer_id=data['organizer_id'],
            title=data['title'],
            description=data.get('description', ''),
            date=event_date,
            location=data['location'],
            capacity=int(data['capacity']),
            ticket_price=int(data['ticket_price'])
        )
        request.dbsession.add(new_event)
        return {'message': 'Event created successfully', 'id': new_event.id}
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='event_detail', renderer='json', request_method='DELETE')
def delete_event(request):
    # Fitur Hapus Event
    event_id = request.matchdict['id']
    event = request.dbsession.query(Event).get(event_id)
    
    if event:
        request.dbsession.delete(event)
        return {'message': 'Event deleted'}
    
    request.response.status = 404
    return {'message': 'Event not found'}