from django.urls import path
from . import views

urlpatterns = [
    path('', views.admin_login,name='admin_login' ),
    path('doctors/', views.doctors),
    path('add_doctors/', views.add_dr),
    path('user/', views.user_list, name='user'),
    path('appointments/', views.appointments, name='appointments'),
    path('complete/<int:id>/', views.complete_appointment),
    path('cancel/<int:id>/', views.cancel_appointment_admin),
    path('reports/', views.reports),
    
    path('userprofile/<int:id>/',views.user_profile),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('navbar/',views.navbar),
    
    path('edit_doctor/<int:id>/', views.edit_doctor, name='edit_doctor'),
    path('delete_doctor/<int:id>/', views.delete_doctor, name='delete_doctor'),
    path('block_user/<int:id>/', views.block_user),
    path('unblock_user/<int:id>/', views.unblock_user),
    path('logout/', views.admin_logout, name='logout'),

    # USER api URLS
    path('signup/',views.Signup),
    path('login/',views.login),
    path('doctors_list/',views.get_doctors),
    path('doctor_profile/<int:doctor_id>/',views.get_doctor_details),
    path('book_appointment/',views.book_appointment),
    
   path('my_appointments/',views.my_appointments),
   path('update_password/',views.update_password),
   path('cancel_appointment/<int:appointment_id>/',views.cancel_appointment),
   path('doctor_search/', views.search_doctors, name='doctor_search'),
   path('doctor_feedback/<int:doctor_id>/', views.doctor_feedback),
]
    
