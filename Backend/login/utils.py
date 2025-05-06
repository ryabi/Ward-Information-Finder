import random 
from django.core.mail import EmailMessage
from .models import User,OneTimePassword
def generate_otp():
    otp=''
    for i in range (4):
        otp += str(random.randint(0,9))
    return otp

def send_otp(email):
    Subject='OTP Code'
    otp_code=generate_otp()
    print(otp_code)
    user=User.objects.get(email=email)
    current_site='myAuth.com'
    pass