from symtable import Class

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager 
from django.db import models 


class UserManager(BaseUserManager):
     def create_user(self, email, password=None): 
          if not email: 
              raise ValueError("Users must have an email address") 
          email = self.normalize_email(email) 
          user = self.model(email=email) 
          user.set_password(password)
          user.save(using=self._db)
          return user 
 
     def create_superuser(self, email, password): 
        user = self.create_user(email, password) 
        user.is_admin = True 
        User.is_superuser = True 
        user.save(using=self._db) 
        return user 
 
class User(AbstractBaseUser): 
    email = models.EmailField(unique=True) 
    name = models.CharField(max_length =255) 
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    is_active = models.BooleanField(default=True) 
    is_admin = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False) 

    objects = UserManager()
    USERNAME_FIELD = 'email'
    
class Doctors(models.Model): 
    name=models.CharField(max_length=100) 
    field=models.CharField(max_length=100)
    experience=models.CharField(max_length=100)
    image=models.FileField()
    qualification=models.CharField(max_length=100) 
    
class Appointment(models.Model):
    time_slots=(
        ('9:00 AM - 10:00 AM','9:00 AM - 10:00 AM'),
        ('10:00 AM - 11:00 AM','10:00 AM - 11:00 AM'),
        ('11:00 AM - 12:00 PM','11:00 AM - 12:00 PM'),
        ('1:00 PM - 2:00 PM','1:00 PM - 2:00 PM'),
        ('2:00 PM - 3:00 PM','2:00 PM - 3:00 PM'),
        ('3:00 PM - 4:00 PM','3:00 PM - 4:00 PM'),
    )
    patient=models.ForeignKey(User,on_delete=models.CASCADE)
    doctors=models.ForeignKey(Doctors,on_delete=models.CASCADE)  
    appointment_date=models.DateTimeField()
    
    time_slot=models.CharField(max_length=100, choices=time_slots)
    
    status = models.CharField(
        max_length=20,
        choices=[
            
            ('Completed', 'Completed'),
            ('Cancelled', 'Cancelled')
        ],
        default='Completed'
    )

    def __str__(self):
        return f"{self.patient.email} - {self.doctors.name}"
    
class Feedback(models.Model):
        user = models.ForeignKey(User, on_delete=models.CASCADE)
        doctor = models.ForeignKey(Doctors, on_delete=models.CASCADE)
        message = models.TextField()
        rating = models.IntegerField()
        created_at = models.DateTimeField(auto_now_add=True)
        def __str__(self):
            return f"Feedback from {self.user.email} for {self.doctor.name}"