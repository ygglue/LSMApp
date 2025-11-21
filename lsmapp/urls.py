from django.urls import path
from . import views

urlpatterns = [
    path('', views.message_view, name='message'),
    path('bouquet/', views.bouquet_view, name='bouquet'),
    path('api/messages/', views.get_messages, name='api_messages'),
    path('api/letter/', views.get_letter, name='api_letter'),
]
