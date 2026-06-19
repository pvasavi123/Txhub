from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Sum
from django.core.cache import cache
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
 
from google.oauth2 import id_token
from google.auth.transport import requests
 
import os
import random
 
from App.models import (
    UserRegister, AdminUser, Student, Enrollment,
    LiveClass, RecordedClass, Resource, Cart,
    Assignment, Note, StudentAttendance, Trainer, Batch, AssignmentSubmission, Course
)
from App.serializers import (
    UserRegisterSerializer, StudentSerializer, EnrollmentSerializer,
    LiveClassSerializer, RecordedClassSerializer, ResourceSerializer, CartSerializer,
    AssignmentSerializer, NoteSerializer, StudentAttendanceSerializer,
    TrainerSerializer, TrainerLoginSerializer, BatchSerializer, AssignmentSubmissionSerializer,
    CourseSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, authentication_classes
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def register_user(request):
    data = request.data.copy()

    # check email exists
    if UserRegister.objects.filter(email=data.get('email')).exists():
        return Response({"error": "Email already exists"}, status=400)

    # Hash the password before saving
    raw_password = data.get('password', '')
    if raw_password:
        data['password'] = make_password(raw_password)

    serializer = UserRegisterSerializer(data=data)

    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User registered successfully",
            "data": {
                "id": user.id,
                "full_name": data.get('full_name'),
                "email": data.get('email'),
                "phone": data.get('phone'),
            }
        }, status=201)

    return Response(serializer.errors, status=400)


# @api_view(['POST'])
# def login_user(request):
#     email = request.data.get('email')
#     password = request.data.get('password')
   
#     admin = AdminUser.objects.filter(email=email).first()
#     if admin:
#         if password == admin.password:  
#             return Response({
#                 "message": "Admin Login successful",
#             }, status=200)
#         else:
#             return Response({"error": "Invalid password"}, status=401)
        
#     user = UserRegister.objects.filter(email=email).first()
#     if user:
#         if password == user.password:  
#             return Response({
#                 "message": "User Login successful",
#                 "type": "user",
#                 "data": {
#                     "full_name": user.full_name,
#                     "email": user.email,
#                     "phone": user.phone
#                 }
#             }, status=200)
#         else:
#             return Response({"error": "Invalid password"}, status=401)
        
#     return Response({"error": "User not found"}, status=404)


from django.contrib.auth.hashers import check_password

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
 
    # 🔹 1. Check Admin
    admin = AdminUser.objects.filter(email=email).first()
    if admin:
        if password == admin.password or check_password(password, admin.password):
            return Response({
                "message": "Admin Login successful",
                "type": "admin",
                "data": {
                    "email": admin.email
                }
            }, status=200)
        else:
            return Response({"error": "Invalid password"}, status=401)
 
    # 🔹 2. Check Normal User
    user = UserRegister.objects.filter(email=email).first()
    if user:
        if password == user.password or check_password(password, user.password):
            return Response({
                "message": "User Login successful",
                "type": "user",
                "data": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone": user.phone
                }
            }, status=200)
        else:
            return Response({"error": "Invalid password"}, status=401)
 
    # 🔹 3. Check Student
    student = Student.objects.filter(email=email).first()
    if student:
        if password == student.password or check_password(password, student.password):
            return Response({
                "message": "Student Login successful",
                "type": "student",
                "data": {
                    "id": student.id,
                    "name": student.name,
                    "email": student.email,
                    "college": student.collegeName,
                    "branch": student.branch,
                    "degree": student.degreeType,
                    "status": student.paymentStatus
                }
            }, status=200)
        else:
            return Response({"error": "Invalid password"}, status=401)
 
    return Response({"error": "User not found"}, status=404)

from App.models import Trainer
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def trainer_login(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '').strip()
 
    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)
 
    trainer = Trainer.objects.filter(email__iexact=email).first()
 
    if not trainer:
        return Response({"error": "Invalid email or password"}, status=401)
 
    if not trainer.check_password(password):
        return Response({"error": "Invalid email or password"}, status=401)
 
    if not trainer.is_active:
        return Response({"error": "Account is deactivated. Please contact admin."}, status=403)
 
    try:
        # Build JWT manually (Trainer is not a Django auth user)
        refresh = RefreshToken()
        refresh['trainer_id'] = trainer.id
        refresh['email'] = trainer.email
        refresh['name'] = trainer.name
        refresh['role'] = 'trainer'
        refresh['assigned_course'] = trainer.assigned_course
 
        return Response({
            "message": "Trainer Login successful",
            "type": "trainer",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "data": {
                "id": trainer.id,
                "name": trainer.name,
                "email": trainer.email,
                "assigned_course": trainer.assigned_course,
            }
        }, status=200)
 
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("JWT generation error:", e)
        return Response({"error": "Login failed due to a server error. Please try again."}, status=500)
 
@api_view(['GET'])
def trainer_profile(request):
    trainer_id = request.query_params.get('trainer_id')
    if not trainer_id:
        return Response({"error": "trainer_id required"}, status=400)
       
    try:
        trainer = Trainer.objects.get(id=trainer_id)
        return Response(TrainerSerializer(trainer).data)
    except Trainer.DoesNotExist:
        return Response({"error": "Trainer not found"}, status=404)
 



@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def register_student(request):
    data = request.data.copy()
    
    # Hash password if provided
    raw_password = data.get('password', '')
    if raw_password:
        data['password'] = make_password(raw_password)
        
    serializer = StudentSerializer(data=data)
   
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
   
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
 
# @api_view(['POST'])
# def create_enrollment(request):
#     data = request.data.copy()
 
#     print("📥 INCOMING DATA:", data)
 
#     email = data.get("email")  # expecting email in request
#     if not email:
#         return Response({"error": "Email is required to associate a user"}, status=400)
 
#     try:
#         user = UserRegister.objects.get(email=email)
#     except UserRegister.DoesNotExist:
#         return Response({"error": "User with this email does not exist"}, status=404)
 
#     items = data.get("items", [])
#     if not items or not isinstance(items, list):
#         return Response({"error": "No items provided"}, status=400)
 
#     # keep items as it is
#     data['items'] = items
 
#     # combine all titles into one column
#     titles = [item.get("title", "") for item in items if item.get("title")]
#     data['title'] = " | ".join(titles) if titles else "Untitled Course"
 
#     # map amount_paid
#     data['amount_paid'] = data.get('amount', 0)
#     data.pop("amount", None)
 
#     # remove email from data since we already resolved user
#     data.pop("email", None)
 
#     # serialize
#     serializer = EnrollmentSerializer(data=data)
#     if not serializer.is_valid():
#         print("❌ ERRORS:", serializer.errors)
#         return Response(serializer.errors, status=400)
 
#     # save enrollment with user assigned
#     enrollment = serializer.save(user=user)
 
#     print("✅ SAVED (single row):", enrollment.id)
 
#     return Response({
#         "message": "Enrollment created ✅",
#         "data": EnrollmentSerializer(enrollment).data
#     }, status=201)
 

# @api_view(['POST'])
# def create_enrollment(request):


@api_view(['POST'])
def create_enrollment(request):
    data = request.data
    print("📥 INCOMING DATA:", data)

    # ✅ Get email
    email = data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=400)

    try:
        user = UserRegister.objects.get(email=email)
    except UserRegister.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # ✅ Get items
    items = data.get("items", [])
    if not items or not isinstance(items, list):
        return Response({"error": "No items provided"}, status=400)

    enrollment_type = data.get("enrollment_type")  # full | slot
    amount = int(data.get("amount", 0))
    total_fee = int(data.get("total_fee", 0))
    batch_date = data.get("batch_date")

    results = []

    for item in items:
        print("👉 Processing:", item)

        title = item.get("title")

        if not title:
            print("⚠️ Skipping item without title")
            continue

        # 🔍 Check existing enrollment
        existing = Enrollment.objects.filter(
            user=user,
            title=title
        ).first()

        if existing:
            print(f"⚠️ Already exists: {title}")

            # ✅ SLOT PAYMENT (increment)
            if enrollment_type == "slot":
                existing.amount_paid += 500

            # ✅ FULL PAYMENT (overwrite)
            elif enrollment_type == "full":
                existing.amount_paid = total_fee

            # ✅ Update other fields
            existing.enrollment_type = enrollment_type
            existing.batch_date = batch_date
            existing.items = [item]   # 🔥 FIX for NOT NULL error
            existing.total_fee = total_fee

            existing.save()

            results.append(f"Updated {title}")

        else:
            # ✅ CREATE NEW ENROLLMENT
            new_enrollment = Enrollment.objects.create(
                user=user,
                title=title,
                items=[item],   # 🔥 FIX for NOT NULL error
                amount_paid=amount if enrollment_type == "full" else 500,
                total_fee=total_fee,
                enrollment_type=enrollment_type,
                batch_date=batch_date
            )

            print("✅ CREATED:", new_enrollment.id)
            results.append(f"Created {title}")

    return Response({
        "message": "Processed successfully ✅",
        "results": results
    }, status=200)

from rest_framework.decorators import authentication_classes, permission_classes

def _get_students_data(course=None, trainer_id=None):
    target_course = None
    trainer = None
    if trainer_id:
        try:
            trainer = Trainer.objects.get(id=trainer_id)
            if trainer.assigned_course and trainer.assigned_course != 'All Courses':
                target_course = normalize_course(trainer.assigned_course)
        except Trainer.DoesNotExist:
            pass
            
    if course and course != 'All Courses':
        target_course = normalize_course(course)

    data = []
    seen_emails = set()

    # Get enrollments explicitly assigned to this trainer
    explicitly_assigned_emails = set()
    if trainer:
        assigned_enrollments = Enrollment.objects.filter(assigned_mentor=trainer).select_related('user')
        for e in assigned_enrollments:
            if e.user:
                explicitly_assigned_emails.add(e.user.email)

    # 1. From Student table
    for s in Student.objects.all().order_by('-id'):
        s_course = normalize_course(s.courseSpecialization)
        
        # Determine if this student should be shown to the mentor
        is_assigned = s.email in explicitly_assigned_emails
        
        # If mentor is fetching, show only if explicitly assigned
        if trainer and not is_assigned:
            continue
            
        if s.email in seen_emails:
            continue
        seen_emails.add(s.email)

        enrollment = Enrollment.objects.filter(user__email=s.email).order_by('-created_at').first()
        batch_date = enrollment.batch_date if enrollment and enrollment.batch_date else "Not Specified"
        batch_id = None
        if enrollment and enrollment.assigned_batch:
            batch_date = enrollment.assigned_batch.name
            batch_id = enrollment.assigned_batch.id
        
        data.append({
            'id': s.id,
            'name': s.name,
            'email': s.email,
            'phone': s.phone,
            'course': s.courseSpecialization or 'Not Specified',
            'status': 'Active' if s.paymentStatus == 'Paid' else 'At Risk',
            'progress': 0,
            'batch_date': batch_date,
            'batch_id': batch_id,
        })
        
    # 2. From Enrollment table
    for e in Enrollment.objects.select_related('user', 'assigned_batch').all().order_by('-created_at'):
        if not e.user or e.user.email in seen_emails:
            continue
            
        has_match = False
        e_course_name = "Not Specified"
        
        is_assigned = e.user.email in explicitly_assigned_emails
        
        if isinstance(e.items, list):
            for item in e.items:
                title = item.get("title") or item.get("name")
                norm_title = normalize_course(title)
                if not target_course or norm_title == target_course:
                    has_match = True
                    e_course_name = title
                    break
                    
        # If mentor is fetching, show only if explicitly assigned
        if trainer and not is_assigned:
            continue
        if not trainer and not has_match:
            continue
                    
        seen_emails.add(e.user.email)
        batch_val = e.assigned_batch.name if e.assigned_batch else (e.batch_date or "Not Specified")
        batch_id = e.assigned_batch.id if e.assigned_batch else None
        data.append({
            'id': e.user.id, # fallback to user id
            'name': e.user.full_name,
            'email': e.user.email,
            'phone': e.user.phone,
            'course': e_course_name,
            'status': 'Active' if e.payment_status == 'completed' else 'At Risk',
            'progress': 0,
            'batch_date': batch_val,
            'batch_id': batch_id,
        })

    return data

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def get_students(request):
    course = request.query_params.get('course')
    trainer_id = request.query_params.get('trainer_id')
    trainer_email = request.query_params.get('trainer_email')
    
    if (not trainer_id or trainer_id == 'undefined') and trainer_email:
        trainer = Trainer.objects.filter(email__iexact=trainer_email).first()
        if trainer:
            trainer_id = trainer.id
            
    data = _get_students_data(course=course, trainer_id=trainer_id)
    return Response(data)




GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def google_login(request):
    token = request.data.get("access_token")
 
    try:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )
 
        email = idinfo.get('email')
        name = idinfo.get('name', '')
 
        # 🔥 ONLY use UserRegister
        user = UserRegister.objects.filter(email=email).first()
 
        if user:
            return Response({
                "message": "Login successful",
                "data": {
                    "full_name": user.full_name,
                    "email": user.email,
                    "phone": user.phone
                }
            })
 
        # 🔥 create user in SAME TABLE
        user = UserRegister.objects.create(
            full_name=name,
            email=email,
            phone="",
            password=""  # Google users no password
        )
 
        return Response({
            "message": "Google account created",
            "data": {
                "full_name": user.full_name,
                "email": user.email,
                "phone": user.phone
            }
        })
 
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    


from django.db import connection

@api_view(['GET'])
def get_enrollments(request):
    """
    Retrieve all enrollments, optionally filtered by email
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute("ALTER TABLE App_batch ADD COLUMN assigned_mentor_id integer NULL;")
    except Exception as e:
        if "duplicate column name" not in str(e).lower():
            return Response({"error": f"Alter App_batch failed: {str(e)}"}, status=500)
            
    try:
        with connection.cursor() as cursor:
            cursor.execute("ALTER TABLE App_enrollment ADD COLUMN assigned_mentor_id integer NULL;")
    except Exception as e:
        if "duplicate column name" not in str(e).lower():
            return Response({"error": f"Alter App_enrollment mentor failed: {str(e)}"}, status=500)
            
    try:
        with connection.cursor() as cursor:
            cursor.execute("ALTER TABLE App_enrollment ADD COLUMN assigned_batch_id integer NULL;")
    except Exception as e:
        if "duplicate column name" not in str(e).lower():
            return Response({"error": f"Alter App_enrollment batch failed: {str(e)}"}, status=500)
        
    try:
        email = request.query_params.get('email')
        
        if email:
            enrollments = Enrollment.objects.filter(user__email=email).select_related('user').order_by('-created_at')
        else:
            enrollments = Enrollment.objects.select_related('user').all().order_by('-created_at')
            
        serializer = EnrollmentSerializer(enrollments, many=True)
        data = serializer.data
        return Response({
            "message": f"Enrollments retrieved for {email if email else 'all users'} ✅",
            "count": len(data),
            "data": data
        })
    except Exception as e:
        import traceback
        return Response({
            "error": str(e),
            "traceback": traceback.format_exc()
        }, status=500)


import random
# Cart Views

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def forgot_password(request):
    email = request.data.get('email')
    action = request.data.get('action')
    entered_otp = request.data.get('otp')
    new_password = request.data.get('new_password')

    if not email:
        return Response({"error": "Email is required"}, status=400)

    # Find user
    user_record = None
    for model in [AdminUser, UserRegister, Student]:
        user_record = model.objects.filter(email=email).first()
        if user_record:
            break

    # Always return same message (security)
    if not user_record:
        return Response({"message": "If email exists, OTP sent"}, status=200)

    # ---------------- REQUEST OTP ----------------
    if action == "request":
        otp = str(random.randint(100000, 999999))

        # Store OTP (5 mins)
        cache.set(email, otp, timeout=300)

        send_mail(
            subject="Password Reset OTP",
            message=f"Your OTP is {otp}. It expires in 5 minutes.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
        )

        return Response({"message": "OTP sent to email"}, status=200)

    # ---------------- VERIFY OTP ----------------
    elif action == "verify":
        stored_otp = cache.get(email)

        if not stored_otp:
            return Response({"error": "OTP expired"}, status=400)

        if entered_otp != stored_otp:
            return Response({"error": "Invalid OTP"}, status=400)

        return Response({"message": "OTP verified"}, status=200)

    # ---------------- RESET PASSWORD ----------------
    elif action == "reset":
        stored_otp = cache.get(email)

        if not stored_otp:
            return Response({"error": "Session expired"}, status=400)

        try:
            validate_password(new_password)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

        user_record.password = make_password(new_password)
        user_record.save()

        cache.delete(email)

        return Response({"message": "Password updated successfully"}, status=200)

    return Response({"error": "Invalid action"}, status=400)


@api_view(['GET', 'POST'])
def create_live_class(request):
    if request.method == 'GET':
        live_classes = LiveClass.objects.all().order_by('-id')
        serializer = LiveClassSerializer(live_classes, many=True)
        return Response(serializer.data)
    
    serializer = LiveClassSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Live class created successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_live_class(request, pk):
    try:
        live_class = LiveClass.objects.get(pk=pk)
        live_class.delete()
        return Response({"message": "Live class deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except LiveClass.DoesNotExist:
        return Response({"error": "Live class not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
def create_recorded_class(request):
    if request.method == 'GET':
        recorded_classes = RecordedClass.objects.all().order_by('-id')
        serializer = RecordedClassSerializer(recorded_classes, many=True)
        return Response(serializer.data)
        
    serializer = RecordedClassSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Recorded class saved successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_recorded_class(request, pk):
    try:
        recorded_class = RecordedClass.objects.get(pk=pk)
        recorded_class.delete()
        return Response({"message": "Recorded class deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except RecordedClass.DoesNotExist:
        return Response({"error": "Recorded class not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
def create_resource(request):
    if request.method == 'GET':
        resources = Resource.objects.all().order_by('-id')
        serializer = ResourceSerializer(resources, many=True)
        return Response(serializer.data)
        
    serializer = ResourceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Resource added successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_resource(request, pk):
    try:
        resource = Resource.objects.get(pk=pk)
        resource.delete()
        return Response({"message": "Resource deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Resource.DoesNotExist:
        return Response({"error": "Resource not found"}, status=status.HTTP_404_NOT_FOUND)



# views.py

@api_view(['POST'])
def add_to_cart(request):
    email = request.data.get("email")
    course_id = request.data.get("course_id")

    # ✅ prevent duplicate
    if Cart.objects.filter(email=email, course_id=course_id).exists():
        return Response({"message": "Already in cart"}, status=200)

    serializer = CartSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Added to cart"}, status=201)

    return Response(serializer.errors, status=400)


# Cart Views continued


@api_view(['GET'])
def get_cart(request):
    email = request.GET.get('email')

    if not email:
        return Response({"error": "Email required"}, status=400)

    items = Cart.objects.filter(email=email)
    serializer = CartSerializer(items, many=True)

    return Response({"data": serializer.data}, status=200)



@api_view(['DELETE'])
def delete_cart(request, id):
    try:
        item = Cart.objects.get(id=id)
        item.delete()
        return Response({"message": "Deleted successfully"}, status=200)
    except Cart.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)
    

@api_view(['DELETE'])
def clear_cart(request):
    email = request.GET.get('email')

    if not email:
        return Response({"error": "Email required"}, status=400)

    Cart.objects.filter(email=email).delete()

    return Response({"message": "Cart cleared"}, status=200)


from collections import Counter
 
COURSE_CATEGORIES = [
    "React Full Stack Development",
    "Java Full Stack",
    "Python Development",
    "MERN Stack",
    "UI/UX Design",
    "AI/ML",
    "Testing",
    "Devops",
    "Data Science",
    "Soft Skills"
]
 
 
def normalize_course(name):
    if not name:
        return None

    n = name.lower().strip()

    # Full Stack variants
    if 'java' in n and ('full' in n or 'stack' in n):
        return 'Java Full Stack'
    if 'python' in n and ('full' in n or 'stack' in n or 'dev' in n):
        return 'Python Development'
    if 'mern' in n:
        return 'MERN Stack'
    if 'react' in n or ('full' in n and 'stack' in n) or 'fullstack' in n:
        return 'React Full Stack Development'
    if 'front end' in n or 'frontend' in n or 'web dev' in n:
        return 'React Full Stack Development'

    # UI/UX
    if 'ui' in n or 'ux' in n or 'design' in n:
        return 'UI/UX Design'

    # AI/ML
    if 'ai' in n or ' ml' in n or 'machine learning' in n or 'artificial' in n:
        return 'AI/ML'

    # Testing
    if 'test' in n or 'qa ' in n or 'quality' in n or 'selenium' in n or 'postman' in n or 'automation' in n:
        return 'Testing'

    # DevOps
    if 'devops' in n or 'dev ops' in n or 'aws' in n or 'cloud' in n or 'docker' in n or 'kubernetes' in n:
        return 'Devops'

    # Data
    if 'data science' in n:
        return 'Data Science'
    if 'data analytic' in n or 'sql' in n or 'analytics' in n:
        return 'Data Science'

    # Soft Skills
    if 'soft' in n or 'leadership' in n or 'speaking' in n or 'communication' in n or 'critical thinking' in n:
        return 'Soft Skills'

    # Exact match fallback
    for cat in COURSE_CATEGORIES:
        if cat.lower() == n:
            return cat

    return None


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def submit_assignment(request):
    try:
        data = request.data
        assignment_id = data.get('assignment_id')
        student_id = data.get('student_id')
        email = data.get('email') # Need to pass email from frontend! Or lookup UserRegister then Student
        
        assignment = Assignment.objects.get(id=assignment_id)
        student = None
        user = None
        if email:
            student = Student.objects.filter(email=email).first()
            if not student:
                user = UserRegister.objects.filter(email=email).first()
        elif student_id:
            student = Student.objects.filter(id=student_id).first()
            if not student:
                user = UserRegister.objects.filter(id=student_id).first()
                if user:
                    student = Student.objects.filter(email=user.email).first()

        if not student and user:
            # find course from enrollment
            enr = Enrollment.objects.filter(user=user).order_by('-created_at').first()
            course_spec = "Not Specified"
            if enr and isinstance(enr.items, list) and len(enr.items) > 0:
                course_spec = enr.items[0].get("title") or enr.items[0].get("name") or "Not Specified"

            # Automatically create a Student record to link the submission
            student = Student.objects.create(
                name=user.full_name,
                email=user.email,
                phone=user.phone,
                password=user.password,
                courseSpecialization=course_spec,
                degreeType="Not Specified",
                passOutYear="Not Specified"
            )

        if not student:
            return Response({"error": "Student not found"}, status=404)
        
        # Check if already submitted
        submission = AssignmentSubmission.objects.filter(assignment=assignment, student=student).first()
        if submission:
            if 'file' in request.FILES:
                submission.fileLink = request.FILES['file']
                submission.save()
            return Response({"message": "Assignment updated successfully"}, status=200)
            
        submission = AssignmentSubmission.objects.create(
            assignment=assignment,
            student=student,
            fileLink=request.FILES.get('file')
        )
        return Response({"message": "Assignment submitted successfully"}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def get_assignment_submissions(request):
    assignment_id = request.query_params.get('assignment_id')
    if not assignment_id:
        return Response({"error": "assignment_id required"}, status=400)
        
    submissions = AssignmentSubmission.objects.filter(assignment_id=assignment_id).order_by('-submitted_at')
    serializer = AssignmentSubmissionSerializer(submissions, many=True, context={'request': request})
    return Response(serializer.data, status=200)
 
    if "all courses" in name:
        return "All Courses"
        
    if "java" in name:
        return "Java Full Stack"
    if "python" in name:
        return "Python Development"
    if "mern" in name:
        return "MERN Stack"
    if "sql" in name or "analytics" in name:
        return "SQL & Data Analytics"
    if "software" in name:
        return "Software Development"
 
    # 🔹 FULL STACK
    if "full" in name or "react" in name:
        return "React Full Stack Development"
 
    # 🔹 UI/UX
    elif "ui" in name or "ux" in name:
        return "UI/UX Design"
 
    # ✅ AI/ML (FIXED STRONG MATCH)
    elif (
        "ai/ml" in name or
        "ai ml" in name or
        "aiml" in name or
        "machine learning" in name or
        "artificial intelligence" in name or
        ("ai" in name and "ml" in name)
    ):
        return "AI/ML"
 
    # ✅ TESTING
    elif "test" in name or "qa" in name:
        return "Testing"
 
    # ✅ DEVOPS
    elif "devops" in name or "dev ops" in name:
        return "Devops"
 
    # ✅ DATA SCIENCE
    elif "data" in name:
        return "Data Science"
 
    # ✅ SOFT SKILLS
    elif (
        "soft" in name or
        "communication" in name or
        "leadership" in name or
        "speaking" in name or
        "management" in name or
        "problem solving" in name or
        "thinking" in name
    ):
        return "Soft Skills"
 
    return None
 

@api_view(['GET'])
def dashboard_counts(request):

    total_students = Student.objects.count()
    total_enrollments = Enrollment.objects.count()

    # ------------------------------------
    # ✅ UNIQUE USERS BY EMAIL (FIXED 🔥)
    # ------------------------------------

    # Normalize student emails
    student_emails = set(
        email.strip().lower()
        for email in Student.objects.values_list('email', flat=True)
        if email
    )

    # Normalize enrollment emails
    enrollment_emails = set(
        email.strip().lower()
        for email in Enrollment.objects.filter(user__isnull=False)
        .values_list('user__email', flat=True)
        if email
    )

    # ✅ Merge both
    total_users = len(student_emails.union(enrollment_emails))

    # ------------------------------------
    # ✅ PAYMENT CALCULATIONS
    # ------------------------------------
    payments = Enrollment.objects.aggregate(
        total_received=Sum('amount_paid'),
        total_pending=Sum('remaining_amount')
    )

    total_received = payments['total_received'] or 0
    total_pending = payments['total_pending'] or 0

    # ------------------------------------
    # ✅ COURSE COUNTS
    # ------------------------------------
    course_counts = {category: 0 for category in COURSE_CATEGORIES}

    # From Students
    for course in Student.objects.values_list('courseSpecialization', flat=True):
        normalized = normalize_course(course)
        if normalized:
                    course_counts[normalized] = course_counts.get(normalized, 0) + 1

    # From Enrollments
    for enroll in Enrollment.objects.all():
        if isinstance(enroll.items, list):
            for item in enroll.items:
                title = item.get("title") or item.get("name")
                normalized = normalize_course(title)
                if normalized:
                            course_counts[normalized] = course_counts.get(normalized, 0) + 1

    return Response({
        "total_students": total_students,
        "total_enrollments": total_enrollments,
        "total_users": total_users,  # ✅ NOW DUPLICATE-FREE

        "total_received": total_received,
        "total_pending": total_pending,

        "course_counts": course_counts
    })

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def mentor_overview(request):
    """Single endpoint for the Mentor Dashboard Overview tab stats."""
    trainer_id = request.query_params.get('trainer_id')
    trainer_email = request.query_params.get('trainer_email')
    if (not trainer_id or trainer_id == 'undefined') and trainer_email:
        trainer = Trainer.objects.filter(email__iexact=trainer_email).first()
        if trainer:
            trainer_id = trainer.id
            
    # Leverage the helper to get cross-table filtered students
    students_data = _get_students_data(trainer_id=trainer_id)
    
    assignments = Assignment.objects.all()
    notes = Note.objects.all()
    
    if trainer_id:
        try:
            trainer = Trainer.objects.get(id=trainer_id)
            if trainer.assigned_course and trainer.assigned_course != 'All Courses':
                target_course = normalize_course(trainer.assigned_course)
                # Keep assignments and notes matching the trainer's course
                assignments = [a for a in assignments if target_course in (normalize_course(a.course) or "")]
                notes = [n for n in notes if target_course in (normalize_course(n.course) or "")]
        except Trainer.DoesNotExist:
            pass

    total_students = len(students_data)
    total_assignments = len(assignments) if isinstance(assignments, list) else assignments.count()
    
    if isinstance(assignments, list):
        active_assignments = len([a for a in assignments if getattr(a, 'dueDate', None) is not None])
    else:
        active_assignments = assignments.filter(dueDate__isnull=False).count()
        
    total_notes = len(notes) if isinstance(notes, list) else notes.count()
    
    # Course breakdown from students_data
    course_breakdown = {}
    for s in students_data:
        course = s.get('course')
        if course:
            normalized = normalize_course(course)
            if normalized:
                course_breakdown[normalized] = course_breakdown.get(normalized, 0) + 1
    
    # Recent 5 students
    recent_students = students_data[:5]
    
    return Response({
        'total_students': total_students,
        'total_assignments': total_assignments,
        'active_assignments': active_assignments,
        'total_notes': total_notes,
        'course_breakdown': course_breakdown,
        'recent_students': recent_students,
    })

# ==========================================
# MENTOR DASHBOARD VIEWS
# ==========================================

@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def manage_assignments(request):
    if request.method == 'GET':
        course = request.query_params.get('course')
        trainer_id = request.query_params.get('trainer_id')
        trainer_email = request.query_params.get('trainer_email')
        if (not trainer_id or trainer_id == 'undefined') and trainer_email:
            trainer = Trainer.objects.filter(email__iexact=trainer_email).first()
            if trainer:
                trainer_id = trainer.id
                
        assignments = Assignment.objects.all()
        if trainer_id:
            assignments = assignments.filter(trainer_id=trainer_id)
        if course and course != 'All Courses':
            assignments = assignments.filter(course__icontains=course)
            
        assignments = assignments.order_by('-created_at')
        serializer = AssignmentSerializer(assignments, many=True, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['DELETE'])
@authentication_classes([])
@permission_classes([])
def delete_assignment(request, pk):
    try:
        assignment = Assignment.objects.get(pk=pk)
        assignment.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Assignment.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def manage_notes(request):
    if request.method == 'GET':
        course = request.query_params.get('course')
        trainer_id = request.query_params.get('trainer_id')
        trainer_email = request.query_params.get('trainer_email')
        if (not trainer_id or trainer_id == 'undefined') and trainer_email:
            trainer = Trainer.objects.filter(email__iexact=trainer_email).first()
            if trainer:
                trainer_id = trainer.id
                
        notes = Note.objects.all()
        if trainer_id:
            notes = notes.filter(trainer_id=trainer_id)
        if course and course != 'All Courses':
            notes = notes.filter(course__icontains=course)
            
        notes = notes.order_by('-created_at')
        serializer = NoteSerializer(notes, many=True, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("NoteSerializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['DELETE'])
@authentication_classes([])
@permission_classes([])
def delete_note(request, pk):
    try:
        note = Note.objects.get(pk=pk)
        note.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Note.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def manage_attendance(request):
    if request.method == 'GET':
        mentor_id = request.query_params.get('mentor_id')
        batch_id = request.query_params.get('batch_id')
        date = request.query_params.get('date')
       
        query = StudentAttendance.objects.all()
        if mentor_id:
            query = query.filter(mentor_id=mentor_id)
        if batch_id:
            query = query.filter(batch_id=batch_id)
        if date:
            query = query.filter(attendance_date=date)
           
        serializer = StudentAttendanceSerializer(query.order_by('-attendance_date', '-id'), many=True)
        return Response(serializer.data)
       
    elif request.method == 'POST':
        # Expecting a list of records: [{"student": 1, "attendance_date": "2023-10-01", "status": "Present", "batch": 1, "mentor": 2}]
        data = request.data
        if not isinstance(data, list):
            data = [data]
           
        saved_records = []
        for item in data:
            student_id = item.get('student')
            date = item.get('attendance_date')
            batch_id = item.get('batch')
            mentor_id = item.get('mentor')
            status_val = item.get('status')
           
            if not all([student_id, date, status_val]):
                continue
               
            try:
                student = Student.objects.get(pk=student_id)
            except Student.DoesNotExist:
                try:
                    ur = UserRegister.objects.get(pk=student_id)
                    student = Student.objects.filter(email=ur.email).first()
                    if not student:
                        student = Student.objects.create(
                            name=ur.full_name,
                            email=ur.email,
                            phone=ur.phone,
                            courseSpecialization='Not Specified',
                            paymentStatus='Paid'
                        )
                except UserRegister.DoesNotExist:
                    continue
 
            batch = Batch.objects.filter(pk=batch_id).first() if batch_id else None
            mentor = Trainer.objects.filter(pk=mentor_id).first() if mentor_id else None
 
            obj, created = StudentAttendance.objects.update_or_create(
                student=student, attendance_date=date, batch=batch,
                defaults={
                    'status': status_val,
                    'mentor': mentor
                }
            )
            saved_records.append(StudentAttendanceSerializer(obj).data)
               
        return Response(saved_records, status=status.HTTP_200_OK)
    
def get_student_info(student_id=None, email=None):
    student_course = ""
    batch_date = ""
    
    # 1. Try Student model
    try:
        if student_id:
            s = Student.objects.get(id=student_id)
        elif email:
            s = Student.objects.get(email__iexact=email)
        else:
            raise Student.DoesNotExist
            
        student_course = s.courseSpecialization or ""
        enrollment = Enrollment.objects.filter(user__email__iexact=s.email).order_by('-created_at').first()
        if enrollment:
            if enrollment.assigned_batch:
                batch_date = enrollment.assigned_batch.name
            elif enrollment.batch_date:
                batch_date = enrollment.batch_date
            # Fallback to enrollment course if Student course is empty or Not Specified
            if student_course == "" or student_course == "Not Specified":
                if isinstance(enrollment.items, list) and len(enrollment.items) > 0:
                    student_course = enrollment.items[0].get("title") or enrollment.items[0].get("name") or student_course
        return student_course, batch_date
    except Student.DoesNotExist:
        pass
        
    # 2. Try UserRegister model
    try:
        if student_id:
            u = UserRegister.objects.get(id=student_id)
        elif email:
            u = UserRegister.objects.get(email__iexact=email)
        else:
            raise UserRegister.DoesNotExist
            
        enrollment = Enrollment.objects.filter(user=u).order_by('-created_at').first()
        if enrollment:
            if enrollment.assigned_batch:
                batch_date = enrollment.assigned_batch.name
            elif enrollment.batch_date:
                batch_date = enrollment.batch_date
            if isinstance(enrollment.items, list) and len(enrollment.items) > 0:
                student_course = enrollment.items[0].get("title") or enrollment.items[0].get("name") or ""
        return student_course, batch_date
    except UserRegister.DoesNotExist:
        pass
        
    return None, None

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def student_notes(request):
    student_id = request.query_params.get('student_id')
    email = request.query_params.get('email')
    
    if not student_id and not email:
        with open("debug_notes.txt", "a") as f:
            f.write(f"student_notes API called with id={student_id}, email={email}\n")
        return Response({"error": "student_id or email is required"}, status=400)
        
    student_course, batch_date = get_student_info(student_id=student_id, email=email)
    if student_course is None:
        return Response({"error": "Student not found"}, status=404)

    notes = Note.objects.all().order_by('-created_at')
    filtered_notes = []

    norm_student_course = normalize_course(student_course) or student_course.lower()

    for n in notes:
        norm_note_course = normalize_course(n.course) or (n.course.lower() if n.course else "")
        # Match course (fallback to exact match if normalize fails)
        if norm_note_course == norm_student_course or norm_note_course in norm_student_course or norm_student_course in norm_note_course or n.course == student_course:
            # Match batch robustly (Month and Year)
            if batch_date and n.batch_month and n.batch_month != 'Not Specified':
                b1 = " ".join(batch_date.split()[-2:]).lower()
                b2 = " ".join(n.batch_month.split()[-2:]).lower()
                if b1 and b2 and b1 != b2:
                    continue
            filtered_notes.append(n)

    return Response(NoteSerializer(filtered_notes, many=True).data)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def student_assignments(request):
    # Clean up John Doe records from the DB
    try:
        Trainer.objects.filter(name="John Doe").delete()
        Student.objects.filter(name="John Doe").delete()
        UserRegister.objects.filter(full_name="John Doe").delete()
    except Exception:
        pass

    student_id = request.query_params.get('student_id')
    email = request.query_params.get('email')
    
    if not student_id and not email:
        return Response({"error": "student_id or email is required"}, status=400)
        
    student_course, batch_date = get_student_info(student_id=student_id, email=email)
    if student_course is None:
        return Response({"error": "Student not found"}, status=404)
        
    assignments = Assignment.objects.all().order_by('-created_at')
    filtered_assignments = []
    
    norm_student_course = normalize_course(student_course) or student_course.lower()
    
    for a in assignments:
        norm_assignment_course = normalize_course(a.course) or (a.course.lower() if a.course else "")
        # Match course
        if norm_assignment_course == norm_student_course or norm_assignment_course in norm_student_course or norm_student_course in norm_assignment_course or a.course == student_course:
            # Match batch robustly (Month and Year)
            if batch_date and a.batch_month and a.batch_month != 'Not Specified':
                b1 = " ".join(batch_date.split()[-2:]).lower()
                b2 = " ".join(a.batch_month.split()[-2:]).lower()
                if b1 and b2 and b1 != b2:
                    continue
            filtered_assignments.append(a)
            
    data = AssignmentSerializer(filtered_assignments, many=True, context={'request': request}).data
    
    # Check submissions
    student = None
    if email:
        student = Student.objects.filter(email=email).first()
    elif student_id:
        student = Student.objects.filter(id=student_id).first()
        if not student:
            user = UserRegister.objects.filter(id=student_id).first()
            if user:
                student = Student.objects.filter(email=user.email).first()
                
    if student:
        submissions = AssignmentSubmission.objects.filter(student=student)
        submission_dict = {sub.assignment_id: sub for sub in submissions}
        for item in data:
            if item['id'] in submission_dict:
                sub = submission_dict[item['id']]
                item['is_submitted'] = True
                item['submission_file'] = request.build_absolute_uri(sub.fileLink.url) if sub.fileLink else None
                item['submission_date'] = sub.submitted_at
                item['submission_status'] = sub.status
            else:
                item['is_submitted'] = False
                item['submission_status'] = None
            
    return Response(data)

@api_view(['GET'])
def debug_db(request):
    students = list(Student.objects.values('id', 'name', 'courseSpecialization'))
    notes = list(Note.objects.values('id', 'title', 'course', 'batch_month'))
    assignments = list(Assignment.objects.values('id', 'title', 'course', 'batch_month'))
    enrolls = list(Enrollment.objects.values('user_id', 'title', 'items', 'batch_date'))
    users = list(UserRegister.objects.values('id', 'full_name', 'email'))
    
    # Test get_student_info for all users
    debug_students = {}
    for u in users:
        c, b = get_student_info(u['id'])
        debug_students[u['id']] = {"course": c, "batch": b}
    
    return Response({
        "users": users,
        "students": students,
        "notes": notes,
        "assignments": assignments,
        "enrolls": enrolls,
        "debug_students": debug_students
    })

from django.db.models import Q
from datetime import datetime

def parse_batch_date(date_str):
    if not date_str:
        return None
    # Assuming formats like "15 May 2026" or "01 June 2026"
    try:
        return datetime.strptime(date_str.strip(), "%d %B %Y").date()
    except ValueError:
        pass
    try:
        return datetime.strptime(date_str.strip(), "%d %b %Y").date()
    except ValueError:
        pass
    return None

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def student_live_classes(request):
    email = request.query_params.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=400)
        
    target_course = None
    batch_date = None
    
    # 1. Try Enrollment
    enrollment = Enrollment.objects.filter(user__email=email).order_by('-created_at').first()
    if enrollment:
        batch_date = enrollment.batch_date
        if isinstance(enrollment.items, list) and len(enrollment.items) > 0:
            item = enrollment.items[0]
            title = item.get("title") or item.get("name")
            target_course = normalize_course(title)
            
    # 2. Try Student Table if target_course still empty
    if not target_course:
        student = Student.objects.filter(email=email).order_by('-created_at').first()
        if student:
            target_course = normalize_course(student.courseSpecialization)
            
    if not target_course:
        return Response([], status=200)
        
    live_classes = LiveClass.objects.filter(Q(targetCourse=target_course) | Q(targetCourse='All Courses'))
    
    if batch_date and batch_date != 'All Batches':
        q_exact = Q(batchMonth=batch_date)
        q_all = Q(batchMonth='All Batches') | Q(batchMonth='') | Q(batchMonth__isnull=True)
        
        parsed_batch = parse_batch_date(batch_date)
        if parsed_batch:
            q_all = q_all & Q(created_at__date__gte=parsed_batch)
            
        live_classes = live_classes.filter(q_exact | q_all)
        
    serializer = LiveClassSerializer(live_classes.distinct().order_by('-id'), many=True)
    return Response(serializer.data, status=200)

@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def manage_batches(request):
    if request.method == 'GET':
        trainer_id = request.query_params.get('trainer_id') or request.query_params.get('mentor_id')
        trainer_email = request.query_params.get('trainer_email')
        if (not trainer_id or trainer_id == 'undefined') and trainer_email:
            trainer = Trainer.objects.filter(email__iexact=trainer_email).first()
            if trainer:
                trainer_id = trainer.id
                
        if trainer_id:
            batches = Batch.objects.filter(assigned_mentor_id=trainer_id).order_by('-id')
        else:
            batches = Batch.objects.all().order_by('-id')
        serializer = BatchSerializer(batches, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = BatchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@authentication_classes([])
@permission_classes([])
def delete_batch(request, pk):
    try:
        batch = Batch.objects.get(pk=pk)
        batch.delete()
        return Response({"message": "Batch deleted successfully"}, status=204)
    except Batch.DoesNotExist:
        return Response({"error": "Batch not found"}, status=404)

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def assign_mentor_to_batch(request, pk):
    """Assign or unassign a mentor to a specific batch."""
    try:
        batch = Batch.objects.get(pk=pk)
    except Batch.DoesNotExist:
        return Response({"error": "Batch not found"}, status=404)

    mentor_id = request.data.get('mentor_id')
    if mentor_id:
        try:
            trainer = Trainer.objects.get(id=mentor_id)
            batch.assigned_mentor = trainer
        except Trainer.DoesNotExist:
            return Response({"error": "Mentor not found"}, status=404)
    else:
        batch.assigned_mentor = None

    batch.save()
    serializer = BatchSerializer(batch)
    return Response({"message": "Mentor assigned successfully", "data": serializer.data})

@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def manage_trainers(request):
    if request.method == 'GET':
        try:
            Trainer.objects.filter(name="John Doe").delete()
        except Exception:
            pass
        trainers = Trainer.objects.all().order_by('-id')
        serializer = TrainerSerializer(trainers, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data.copy()
        raw_password = data.get('password')
        if not raw_password:
            return Response({"error": "Password is required"}, status=400)
        serializer = TrainerSerializer(data=data)
        if serializer.is_valid():
            serializer.save(password_hash=make_password(raw_password))
            return Response(serializer.data, status=201)
        print("Trainer registration failed. Errors:", serializer.errors)
        return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@authentication_classes([])
@permission_classes([])
def delete_trainer(request, pk):
    try:
        trainer = Trainer.objects.get(pk=pk)
        trainer.delete()
        return Response({"message": "Mentor deleted successfully"}, status=204)
    except Trainer.DoesNotExist:
        return Response({"error": "Mentor not found"}, status=404)

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def assign_batch_mentor(request, pk):
    try:
        enrollment = Enrollment.objects.get(pk=pk)
    except Enrollment.DoesNotExist:
        return Response({"error": "Enrollment not found"}, status=404)

    batch_id = request.data.get('batch_id')
    mentor_id = request.data.get('mentor_id')

    if batch_id:
        try:
            enrollment.assigned_batch = Batch.objects.get(id=batch_id)
        except Batch.DoesNotExist:
            return Response({"error": "Batch not found"}, status=404)
    elif batch_id == "": # allowing unassign
        enrollment.assigned_batch = None
        
    if mentor_id:
        try:
            enrollment.assigned_mentor = Trainer.objects.get(id=mentor_id)
        except Trainer.DoesNotExist:
            return Response({"error": "Mentor not found"}, status=404)
    elif mentor_id == "": # allowing unassign
        enrollment.assigned_mentor = None

    enrollment.save()
    serializer = EnrollmentSerializer(enrollment)
    return Response({"message": "Assigned successfully", "data": serializer.data})

from rest_framework import viewsets
from rest_framework.decorators import action
from .models import OnlineClass
from .serializers import OnlineClassSerializer
from . import bbb_utils
import uuid

class OnlineClassViewSet(viewsets.ModelViewSet):
    queryset = OnlineClass.objects.all().order_by('-created_at')
    serializer_class = OnlineClassSerializer
    permission_classes = [] # Allow any for now as requested
    authentication_classes = []

    def get_queryset(self):
        queryset = super().get_queryset()
        mentor_id = self.request.query_params.get('mentor_id')
        mentor_email = self.request.query_params.get('mentor_email')
        batch = self.request.query_params.get('batch')
        student_id = self.request.query_params.get('student_id')
        email = self.request.query_params.get('email')
        
        if (not mentor_id or mentor_id == 'undefined') and mentor_email:
            trainer = Trainer.objects.filter(email__iexact=mentor_email).first()
            if trainer:
                mentor_id = trainer.id
                
        if mentor_id:
            queryset = queryset.filter(mentor_id=mentor_id)

        # Filter by student's batch if student_id or email is provided
        resolved_batches = []
        if email or student_id:
            _, resolved_batch = get_student_info(student_id=student_id, email=email)
            if resolved_batch:
                resolved_batches.append(resolved_batch)
            
            # Gather from all enrollments
            enroll_q = Enrollment.objects.all()
            if email:
                enroll_q = enroll_q.filter(user__email__iexact=email)
            elif student_id:
                enroll_q = enroll_q.filter(user_id=student_id)
            for e in enroll_q:
                if e.assigned_batch:
                    resolved_batches.append(e.assigned_batch.name)
                if e.batch_date:
                    resolved_batches.append(e.batch_date)
                
        if resolved_batches:
            q_filter = Q()
            for b_name in set(resolved_batches):
                q_filter |= Q(batch__icontains=b_name)
            # Also support 'All Batches' or empty/null batch
            q_filter |= Q(batch__iexact='All Batches') | Q(batch='') | Q(batch__isnull=True)
            queryset = queryset.filter(q_filter)
        elif batch:
            queryset = queryset.filter(batch__icontains=batch)
            
        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if not data.get('mentor') and data.get('mentor_email'):
            trainer = Trainer.objects.filter(email__iexact=data.get('mentor_email')).first()
            if trainer:
                data['mentor'] = trainer.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        online_class = self.get_object()
        
        # Generate meeting ID if not exists
        if not online_class.meeting_id:
            online_class.meeting_id = f"txhub-{online_class.id}-{uuid.uuid4().hex[:8]}"
            online_class.save()
            
        # Update status
        online_class.status = 'LIVE'
        online_class.save()
        
        # We don't necessarily need to call the BBB create API here if we rely on join creating it.
        # But explicitly creating it is better.
        try:
            import requests
            create_url = bbb_utils.get_create_meeting_url(
                meeting_id=online_class.meeting_id,
                name=online_class.title,
            )
            requests.get(create_url)
        except Exception as e:
            pass # Ignoring create error, joining as moderator often auto-creates in BBB

        if online_class.meeting_link:
            join_url = online_class.meeting_link
        else:
            mentor_name = online_class.mentor.name if online_class.mentor else "Mentor"
            join_url = bbb_utils.get_join_url(
                meeting_id=online_class.meeting_id,
                full_name=mentor_name,
                password='mp' # moderator password
            )
        return Response({"join_url": join_url, "status": online_class.status})

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        online_class = self.get_object()
        student_name = request.data.get('student_name', 'Student')
        
        if online_class.status != 'LIVE' and online_class.status != 'SCHEDULED':
             return Response({"error": "Class is not active"}, status=400)
             
        if online_class.meeting_link:
            join_url = online_class.meeting_link
        else:
            join_url = bbb_utils.get_join_url(
                meeting_id=online_class.meeting_id,
                full_name=student_name,
                password='ap' # attendee password
            )
        return Response({"join_url": join_url})

    @action(detail=True, methods=['post'])
    def end(self, request, pk=None):
        online_class = self.get_object()
        online_class.status = 'ENDED'
        from django.utils import timezone
        online_class.end_time = timezone.now()
        online_class.save()
        return Response({"status": online_class.status, "message": "Class ended successfully"})



@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def get_course_progress(request, course_id):
    """
    Student Progress Dashboard API.
    Fetches all enrolled students for a course with their assignment-based
    completion metrics. Optimized to avoid N+1 queries.

    Returns per-student:
      student_id, name, email, enrollment_date,
      completion_percentage, total_assignments,
      completed_assignments, pending_assignments,
      last_activity_date, status, batch_name, mentor_name
    """
    from collections import defaultdict

    # ------------------------------------------------------------------
    # 1. Resolve course keywords from URL slug
    # ------------------------------------------------------------------
    keyword_map = {
        'react-full-stack-development': ['react', 'mern', 'fullstack', 'full stack'],
        'mern-stack': ['react', 'mern', 'fullstack', 'full stack'],
        'java-full-stack': ['java'],
        'testing': ['test', 'selenium', 'qa', 'automation'],
        'software-testing': ['test', 'selenium', 'qa', 'automation'],
        'python-development': ['python'],
        'data-science': ['data science'],
        'ai-ml': ['ai', 'ml', 'machine learning', 'artificial intelligence'],
        'aiml': ['ai', 'ml', 'machine learning', 'artificial intelligence'],
        'devops': ['devops', 'dev ops', 'aws', 'cloud', 'docker'],
        'ui-ux-design': ['ui', 'ux', 'design', 'figma'],
        'uiux-design': ['ui', 'ux', 'design', 'figma'],
        'soft-skills': ['soft skills', 'leadership', 'communication'],
        'sql-data-analytics': ['sql', 'analytics', 'data analytic'],
    }
    keywords = keyword_map.get(course_id, [course_id.replace('-', ' ')])

    def matches_course(text):
        if not text:
            return False
        t = text.lower()
        return any(k in t for k in keywords)

    # ------------------------------------------------------------------
    # 2. Fetch all Assignments for this course (single query)
    # ------------------------------------------------------------------
    all_assignments = list(Assignment.objects.all())
    course_assignments = [a for a in all_assignments if matches_course(a.course)]
    total_assignments = len(course_assignments)
    course_assignment_ids = {a.id for a in course_assignments}

    # ------------------------------------------------------------------
    # 3. Fetch all submissions for course assignments (single query - no N+1)
    # ------------------------------------------------------------------
    student_submission_map = defaultdict(set)   # student.id -> set of assignment_ids
    student_last_activity = {}                  # student.id -> last submitted_at datetime

    if course_assignment_ids:
        submissions = (
            AssignmentSubmission.objects
            .filter(assignment_id__in=course_assignment_ids)
            .select_related('student')
            .order_by('-submitted_at')
        )
        for sub in submissions:
            if sub.student_id is not None:
                student_submission_map[sub.student_id].add(sub.assignment_id)
                if sub.student_id not in student_last_activity:
                    student_last_activity[sub.student_id] = sub.submitted_at

    # ------------------------------------------------------------------
    # 4. Collect enrolled students for this course (deduplicated by email)
    # ------------------------------------------------------------------
    seen_emails = set()
    enrolled = []

    # 4a. Students in the Student table matching this course
    for s in Student.objects.all().order_by('-id'):
        if not matches_course(s.courseSpecialization):
            continue
        if s.email in seen_emails:
            continue
        seen_emails.add(s.email)
        enrolled.append({
            'student_id': s.id,
            'name': s.name,
            'email': s.email,
            'enrollment_date': s.created_at,
            'batch_name': 'Unassigned',
            'mentor_name': 'Unassigned',
        })

    # 4b. Students enrolled via Enrollment table (UserRegister users)
    enrollments = (
        Enrollment.objects
        .select_related('user', 'assigned_batch', 'assigned_mentor')
        .all()
        .order_by('-created_at')
    )
    for e in enrollments:
        if not e.user:
            continue
        if e.user.email in seen_emails:
            continue
        # Check if this enrollment matches the course
        item_match = False
        if isinstance(e.items, list):
            for item in e.items:
                title = item.get('title') or item.get('name', '')
                if matches_course(title):
                    item_match = True
                    break
        if not item_match and not matches_course(e.title):
            continue
        seen_emails.add(e.user.email)
        batch_name = 'Unassigned'
        mentor_name = 'Unassigned'
        if e.assigned_batch:
            batch_name = e.assigned_batch.name
        elif e.batch_date:
            batch_name = e.batch_date
        if e.assigned_mentor:
            mentor_name = e.assigned_mentor.name
        enrolled.append({
            'student_id': e.user.id,
            'name': e.user.full_name,
            'email': e.user.email,
            'enrollment_date': e.created_at,
            'batch_name': batch_name,
            'mentor_name': mentor_name,
        })

    # ------------------------------------------------------------------
    # 5. Build response with per-student assignment completion metrics
    # ------------------------------------------------------------------
    data = []
    for s in enrolled:
        sid = s['student_id']
        completed_count = len(student_submission_map.get(sid, set()))
        pending_count = max(total_assignments - completed_count, 0)

        if total_assignments > 0:
            completion_pct = round((completed_count / total_assignments) * 100, 1)
        else:
            completion_pct = 0.0

        if completion_pct >= 100:
            status_label = 'Completed'
        elif completion_pct > 0:
            status_label = 'In Progress'
        else:
            status_label = 'Not Started'

        last_activity = student_last_activity.get(sid)
        last_activity_str = (
            last_activity.strftime('%Y-%m-%d %H:%M:%S') if last_activity else None
        )
        enrollment_date = s['enrollment_date']
        enrollment_date_str = (
            enrollment_date.strftime('%Y-%m-%d') if enrollment_date else None
        )

        # Compute days elapsed since enrollment (cap at 90 for display)
        from django.utils import timezone
        if enrollment_date:
            aware_enrollment = enrollment_date if enrollment_date.tzinfo else timezone.make_aware(
                enrollment_date.replace(tzinfo=None) if hasattr(enrollment_date, 'replace') else enrollment_date
            )
            delta = timezone.now() - aware_enrollment
            days_elapsed = max(delta.days, 0)
        else:
            days_elapsed = 0

        days_completed = min(days_elapsed, 90)
        # Certificate: must complete within 90 days AND reach 100%
        certificate_eligible = (days_elapsed <= 90 and completion_pct >= 100)

        data.append({
            'student_id': sid,
            'name': s['name'],
            'email': s['email'],
            'enrollment_date': enrollment_date_str,
            'days_completed': days_completed,
            'days_elapsed': days_elapsed,
            'certificate_eligible': certificate_eligible,
            'completion_percentage': completion_pct,
            'total_assignments': total_assignments,
            'completed_assignments': completed_count,
            'pending_assignments': pending_count,
            'last_activity_date': last_activity_str,
            'status': status_label,
            'batch_name': s['batch_name'],
            'mentor_name': s['mentor_name'],
            # Legacy field kept for backward compatibility with existing UI
            'progress': int(completion_pct),
        })

    return Response({
        'course_id': course_id,
        'total_assignments': total_assignments,
        'count': len(data),
        'students': data,
    })

@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def manage_courses(request):
    """List all admin-created courses (GET) or create a new one (POST)."""
    if request.method == 'GET':
        courses = Course.objects.all().order_by('-created_at')
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)
 
    # POST - create
    data = request.data.copy()
    title = data.get('title', '').lower()
    desc = data.get('description', '').lower()
    combined_text = title + " " + desc
   
    if not data.get('category') or data.get('category') == 'Other':
        if any(kw in combined_text for kw in ['gen ai', 'ai', 'ml', 'llm', 'data science']):
            data['category'] = 'AI/ML' if 'ai' in combined_text or 'ml' in combined_text or 'gen ai' in combined_text or 'llm' in combined_text else 'Data Science'
        elif any(kw in combined_text for kw in ['react', 'javascript', 'python', 'full stack', 'backend', 'frontend', 'developer', 'software']):
            data['category'] = 'Software Development'
        elif any(kw in combined_text for kw in ['ui/ux', 'figma', 'design']):
            data['category'] = 'UI/UX Design'
        elif any(kw in combined_text for kw in ['marketing', 'seo']):
            data['category'] = 'Marketing'
        elif any(kw in combined_text for kw in ['test', 'qa', 'selenium']):
            data['category'] = 'Testing'
        elif any(kw in combined_text for kw in ['devops', 'aws', 'docker', 'cloud']):
            data['category'] = 'DevOps'
        elif any(kw in combined_text for kw in ['soft skills', 'communication', 'leadership']):
            data['category'] = 'Soft Skills'
        else:
            data['category'] = 'Software Development' # Fallback
           
    serializer = CourseSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
 
@api_view(['DELETE'])
@authentication_classes([])
@permission_classes([])
def delete_course(request, pk):
    try:
        course = Course.objects.get(pk=pk)
        course.delete()
        return Response({'message': 'Deleted'}, status=status.HTTP_204_NO_CONTENT)
    except Course.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
 