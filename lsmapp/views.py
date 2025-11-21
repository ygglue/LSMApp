from django.shortcuts import render
from django.http import JsonResponse
import json
import os
from django.conf import settings

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

