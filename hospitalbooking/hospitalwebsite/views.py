from urllib import request

from django.shortcuts import render
from django.shortcuts import redirect
from .models import Doctors, Appointment, Feedback, User
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.forms import UserCreationForm
from rest_framework import permissions
#login
from django.contrib.auth import authenticate,login,logout
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND, HTTP_200_OK


from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404,redirect

# Create your views here.

from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.decorators import user_passes_test
from django.utils.timezone import now
from django.db.models import Q
from django.db.models import Count
from datetime import datetime
from .serializers import FeedbackSerializer
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache


# 🔐 Admin check
def admin_check(user):
    return user.email=="admin@gmail.com"   # or user.is_superuser


# 🔑 Login
def admin_login(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            
            # 🔴 Blocked user check
            if not user.is_active:
                messages.error(request, "Account is blocked")
                return redirect('admin_login')

            # 🔴 Admin check
            if not user.is_admin:
                messages.error(request, "You are not authorized as admin")
                return redirect('admin_login')

            auth_login(request, user)
            return redirect('dashboard/')

        else:
            messages.error(request, "Invalid username or password")

    return render(request, 'login.html')

    


# 📊 Dashboard
@user_passes_test(admin_check)
def dashboard(request):
    doctors_count = Doctors.objects.count()

    # ❌ before: all users
    # users_count = User.objects.count()

    # ✅ now: only normal users
    users_count = User.objects.filter(is_admin=False).count()

    appointments_count = Appointment.objects.count()

    today_count = Appointment.objects.filter(
        appointment_date__date=now().date()
    ).count()

    return render(request, 'dashboard.html', {
        'doctors_count': doctors_count,
        'users_count': users_count,
        'appointments_count': appointments_count,
        'today_count': today_count
    })
    

# 🚪 Logout
def admin_logout(request):
    logout(request)
    return redirect('admin_login')





#add dr

def add_dr(request):
    if request.method == "POST":
        name = request.POST.get('name')
        
        field = request.POST.get('field')
        experience = request.POST.get('experience')
        qualification = request.POST.get('qualification')
        image = request.FILES.get('image')

        Doctors.objects.create(
            name=name,
            
            field=field,
            experience=experience,
            qualification=qualification,
            image=image
        )
        messages.success(request, "Doctor added successfully")

        return redirect('/doctors/')  # or dashboard
    return render(request, 'add_doctors.html')
    
#display all doctors
@user_passes_test(admin_check)
def doctors(request):
    all_doctors = Doctors.objects.all()
    return render(request, 'doctors.html', {'doctors': all_doctors})

#user
def user_list(request):
    users = User.objects.filter(is_admin=False)
    return render(request,'user.html', {'users': users})


# BLOCK USER
def block_user(request, id):
    user = get_object_or_404(User, id=id)
    user.is_blocked = True
    user.save()
    return redirect('user')


# UNBLOCK USER
def unblock_user(request, id):
    user = get_object_or_404(User, id=id)
    user.is_blocked = False
    user.save()
    return redirect('user')


def appointments(request):
    date = request.GET.get('date')
    doctor_id = request.GET.get('doctor')

    appointments = Appointment.objects.all()
    doctors = Doctors.objects.all()

    if date:
        appointments = appointments.filter(appointment_date__date=date)

    if doctor_id and doctor_id != "all":
        appointments = appointments.filter(doctors_id=int(doctor_id))

    return render(request, 'appointments.html', {
        'appointments': appointments,
        'doctors': doctors,
        'date': date,
        'doctor_id': doctor_id
    })
def complete_appointment(request, id):
    appointment = get_object_or_404(Appointment, id=id)
    appointment.status = "Completed"
    appointment.save()
    return redirect('/appointments/')

def cancel_appointment_admin(request, id):
    appointment = get_object_or_404(Appointment, id=id)
    appointment.status = "Cancelled"
    appointment.save()
    return redirect('/appointments/')



def reports(request):

    month = request.GET.get('month')
    doctor_id = request.GET.get('doctor')

    appointments = Appointment.objects.all()
    doctors = Doctors.objects.all()

    # 📅 filter by month
    if month:
        try:
            year, month_num = month.split('-')
            appointments = appointments.filter(
                appointment_date__year=int(year),
                appointment_date__month=int(month_num)
            )
        except:
            pass

    # 👨‍⚕️ filter by doctor
    if doctor_id and doctor_id != "all":
        appointments = appointments.filter(doctors_id=int(doctor_id))

    total_appointments = appointments.count()
    cancelled_count = appointments.filter(status="Cancelled").count()

    report_qs = appointments.values('doctors__name')\
        .annotate(total=Count('id'))\
        .order_by('-total')

    # ✅ handle tie
    if report_qs:
        max_count = report_qs[0]['total']
        top_doctors = [
            d['doctors__name'] for d in report_qs
            if d['total'] == max_count
        ]
    else:
        top_doctors = []

    return render(request, 'reports.html', {
        'doctors': doctors,
        'month': month,
        'doctor_id': doctor_id,
        'total_appointments': total_appointments,
        'cancelled_count': cancelled_count,
        'top_doctors': top_doctors,
        'report_data': report_qs
    })

@user_passes_test(admin_check)
# ✏️ Edit Doctor
def edit_doctor(request, id):
    doctor = get_object_or_404(Doctors, id=id)

    if request.method == "POST":
        doctor.name = request.POST.get('name')
        doctor.field = request.POST.get('field')
        doctor.experience = request.POST.get('experience')
        doctor.qualification = request.POST.get('qualification')

        if request.FILES.get('image'):
            doctor.image = request.FILES.get('image')

        doctor.save()
        return redirect('/doctors/')

    return render(request, 'edit.html', {'doctor': doctor})


# 🗑️ Delete Doctor
def delete_doctor(request, id):
    doctor = get_object_or_404(Doctors, id=id)
    doctor.delete()
    return redirect('/doctors/')
    
def user_profile(request, id):
    user = get_object_or_404(User, id=id)

    # 🔥 THIS LINE IS KEY
    appointments = Appointment.objects.filter(patient=user).order_by('-appointment_date')

    print("APPOINTMENTS:", appointments)  # 👈 DEBUG

    return render(request, 'userprofile.html', {
        'user': user,
        'appointments': appointments
    })

def navbar(request):
    return render(request,'navbar.html')






#userapi creation

@api_view(['POST'])
@permission_classes((AllowAny,))



def Signup(request):
    email = request.data.get("email")
    password = request.data.get("password")
    name = request.data.get("name")
    dob = request.data.get("dob")
    gender = request.data.get("gender")
    address = request.data.get("address")
    phone = request.data.get("phone")

    if not name or not email or not password:
        return Response({'message': 'Required fields missing'})

    if User.objects.filter(email=email).exists():
        return JsonResponse({'message': 'Email already exists'})

    user = User.objects.create_user(email=email, password=password)
    user.name = name
    user.dob = dob
    user.gender = gender
    user.address = address
    user.phone = phone
    user.save()

    return JsonResponse(
        {'message': 'User created successfully'},
        status=200
    )



#login api creation

@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if email is None or password is None:
        return Response({'error': 'Please provide both email and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(email=email, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)
    
    if  user.is_blocked:
         return Response({'error': 'Account blocked'}, status=403)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key},status=HTTP_200_OK)


    #api for get all doctors
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_doctors(request):
    doctors = Doctors.objects.all()
    data = []
    for doctor in doctors:
        data.append({
            'id': doctor.id,
            'name': doctor.name,
            'field': doctor.field,
            'experience': doctor.experience,
            'qualification': doctor.qualification,
            'image': doctor.image.url if doctor.image else None
        })
    return JsonResponse(data, safe=False)

#api for particular doctor details
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_doctor_details(request, doctor_id):
    try:
        doctor = Doctors.objects.get(id=doctor_id)
    except Doctors.DoesNotExist:
        return JsonResponse({'message': 'Doctor not found'}, status=404)

    data = {
        'id': doctor.id,
        'name': doctor.name,
        'field': doctor.field,
        'experience': doctor.experience,
        'qualification': doctor.qualification,
        'image': doctor.image.url if doctor.image else None
    }
    return JsonResponse(data, safe=False)

#api for book appointment only authenticated users
@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def book_appointment(request):
    doctor_id = request.data.get('doctors_id')
    date = request.data.get('appointment_date')
    time_slot = request.data.get('time_slot')

    try:
        doctor = Doctors.objects.get(id=doctor_id)
    except Doctors.DoesNotExist:
        return JsonResponse({'message': 'Doctor not found'}, status=404)

    Appointment.objects.create(
        patient=request.user,
        doctors=doctor,
        appointment_date=date,
        time_slot=time_slot
    )

    return JsonResponse({'message': 'Appointment booked successfully'}, status=200)

# my appointments api
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def my_appointments(request):
    appointments = Appointment.objects.filter(patient=request.user)
    data = []
    for appointment in appointments:
        data.append({
            'id': appointment.id,
            'doctor_name': appointment.doctors.name,
            'appointment_date': appointment.appointment_date,
            'time_slot': appointment.time_slot,
        })
    return Response(data)
# update password api
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def update_password(request):
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not request.user.check_password(current_password):
        return JsonResponse({'message': 'Current password is incorrect'}, status=400)

    request.user.set_password(new_password)
    request.user.save()
    return JsonResponse({'message': 'Password updated successfully'}, status=200)
# cancel appointment api
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def cancel_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id, patient=request.user)
    except Appointment.DoesNotExist:
        return JsonResponse({'message': 'Appointment not found'}, status=404)

    appointment.delete()
    return JsonResponse({'message': 'Appointment cancelled successfully'}, status=200)

# doctor search api
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def search_doctors(request):
    query = request.GET.get('q')

    doctors = Doctors.objects.filter(name__icontains=query)

    data = []

    for doctor in doctors:
        data.append({
            'id': doctor.id,
            'name': doctor.name,
            'field': doctor.field,
            'experience': doctor.experience,
            'qualification': doctor.qualification,
            'image': doctor.image.url if doctor.image else None
        })

    return JsonResponse(data, safe=False)


#feedback api
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def doctor_feedback(request, doctor_id):

    doctor = get_object_or_404(Doctors, id=doctor_id)

    # 🔹 GET → all feedbacks
    if request.method == 'GET':
        feedbacks = Feedback.objects.filter(doctor=doctor).order_by('-created_at')
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data)

    # 🔹 POST → create/update
    if request.method == 'POST':
        feedback, created = Feedback.objects.update_or_create(
            doctor=doctor,
            user=request.user,
            defaults={
                'message': request.data.get('message'),
                'rating': request.data.get('rating')
            }
        )

        serializer = FeedbackSerializer(feedback)
        return Response(serializer.data)