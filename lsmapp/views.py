from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from django.conf import settings
from .models import InteractionLog

def message_view(request):
    """Render the main message page with typing animation"""
    return render(request, 'lsmapp/message.html')

def bouquet_view(request):
    """Render the bouquet reveal page"""
    return render(request, 'lsmapp/bouquet.html')

def get_messages(request):
    """API endpoint to fetch messages JSON data"""
    json_path = os.path.join(settings.BASE_DIR, 'lsmapp', 'static', 'lsmapp', 'data', 'messages.json')
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return JsonResponse(data, safe=False)
    except FileNotFoundError:
        return JsonResponse({'error': 'Messages file not found'}, status=404)

def get_letter(request):
    """API endpoint to fetch letter JSON data"""
    json_path = os.path.join(settings.BASE_DIR, 'lsmapp', 'static', 'lsmapp', 'data', 'letter.json')
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return JsonResponse(data, safe=False)
    except FileNotFoundError:
        return JsonResponse({'error': 'Letter file not found'}, status=404)

@csrf_exempt
def log_interaction(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            InteractionLog.objects.create(
                session_id=data.get('session_id'),
                message_id=data.get('message_id'),
                choice_text=data.get('choice_text'),
                next_message_id=data.get('next_message_id')
            )
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)

def logs_view(request):
    # Group logs by session_id
    logs = InteractionLog.objects.all().order_by('-timestamp')
    sessions = {}
    
    for log in logs:
        if log.session_id not in sessions:
            sessions[log.session_id] = []
        sessions[log.session_id].append(log)
    
    return render(request, 'lsmapp/logs.html', {'sessions': sessions})

@csrf_exempt
def clear_logs(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body) if request.body else {}
            session_id = data.get('session_id')
            
            if session_id:
                InteractionLog.objects.filter(session_id=session_id).delete()
            else:
                InteractionLog.objects.all().delete()
                
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)
