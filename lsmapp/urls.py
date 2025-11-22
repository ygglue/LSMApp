from django.urls import path
from . import views

urlpatterns = [
    path('', views.message_view, name='message'),
    path('bouquet/', views.bouquet_view, name='bouquet'),
    path('api/messages/', views.get_messages, name='get_messages'),
    path('api/log-interaction/', views.log_interaction, name='log_interaction'),
    path('api/clear-logs/', views.clear_logs, name='clear_logs'),
    path('logs/', views.logs_view, name='logs'),
    path('api/letter/', views.get_letter, name='api_letter'),
]
