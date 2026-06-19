from rest_framework import serializers
from App.models import UserRegister, AdminUser, Student, Enrollment, LiveClass, RecordedClass, Resource, Cart, Assignment, Note, StudentAttendance, Trainer, Batch, AssignmentSubmission, OnlineClass, Course, Contact, PaymentOrder, Certificate,CertificateTemplate

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'imageUrl', 'duration', 'category', 'price', 'slug', 'created_at']  
        read_only_fields = ['id', 'slug', 'created_at']


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRegister
        fields = '__all__'

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['name', 'email', 'password']


class TrainerSerializer(serializers.ModelSerializer):
    students = serializers.SerializerMethodField()

    class Meta:
        model = Trainer
        fields = ['id', 'name', 'email', 'assigned_course', 'is_active', 'created_at', 'students']
        read_only_fields = ['id', 'created_at']

    def get_students(self, obj):
        enrollments = obj.assigned_enrollments.all()
        return [{"id": e.user.id, "name": e.user.full_name, "email": e.user.email} for e in enrollments if e.user]

class TrainerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'
 

class EnrollmentSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField(source='user.full_name')
    email = serializers.ReadOnlyField(source='user.email')
    assigned_batch_name = serializers.ReadOnlyField(source='assigned_batch.name')
    assigned_mentor_name = serializers.ReadOnlyField(source='assigned_mentor.name')
    imageUrl = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = "__all__"
        read_only_fields = [
            'user',
            'remaining_amount',
            'payment_status',
            'total_fee',
        ]

    def get_progress(self, obj):
        if not obj.user:
            return 0
        title = obj.title or (obj.items[0].get('title') if isinstance(obj.items, list) and len(obj.items) > 0 else '')
        if not title:
            return 0
        try:
            from App.views import normalize_course
            normalized_title = normalize_course(title)
            if not normalized_title:
                return 0
            from App.models import Assignment, AssignmentSubmission, Student
            all_assignments = Assignment.objects.all()
            course_assignments = [a for a in all_assignments if normalize_course(a.course) == normalized_title]
            total_assignments = len(course_assignments)
            if total_assignments == 0:
                return 0
            student = Student.objects.filter(email__iexact=obj.user.email).first()
            if not student:
                return 0
            course_assignment_ids = {a.id for a in course_assignments}
            completed_count = AssignmentSubmission.objects.filter(
                student=student,
                assignment_id__in=course_assignment_ids
            ).values_list('assignment_id', flat=True).distinct().count()
            return min(int((completed_count / total_assignments) * 100), 100)
        except Exception:
            return 0

    def get_imageUrl(self, obj):
        def make_absolute(url):
            if not url:
                return None
            if url.startswith('http://') or url.startswith('https://'):
                return url
            # Prepend local server if it is a relative path
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return 'http://127.0.0.1:8000' + ('/' if not url.startswith('/') else '') + url

        # 1. Exact case-insensitive match
        course = Course.objects.filter(title__iexact=obj.title).first()
        if course and course.imageUrl:
            return make_absolute(course.imageUrl)

        # 2. Substring matching for variations
        obj_title = obj.title.lower().strip() if obj.title else ""
        if obj_title:
            for c in Course.objects.all():
                c_title = c.title.lower().strip()
                if c_title and (c_title in obj_title or obj_title in c_title):
                    if c.imageUrl:
                        return make_absolute(c.imageUrl)

        # 3. Fallback check using first item's title
        if obj.items and isinstance(obj.items, list) and len(obj.items) > 0:
            item_title = obj.items[0].get('title', '')
            if item_title:
                item_title_lower = item_title.lower().strip()
                course = Course.objects.filter(title__iexact=item_title).first()
                if course and course.imageUrl:
                    return make_absolute(course.imageUrl)
                for c in Course.objects.all():
                    c_title = c.title.lower().strip()
                    if c_title and (c_title in item_title_lower or item_title_lower in c_title):
                        if c.imageUrl:
                            return make_absolute(c.imageUrl)
        return None



# class LiveClassSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LiveClass
#         fields = '__all__'

from rest_framework import serializers
from .models import LiveClass

class LiveClassSerializer(serializers.ModelSerializer):

    def validate_targetCourse(self, value):
        if value == "AL/ML":
            return "AI/ML"
        if value == "DevOps":
            return "Devops"
        return value

    def validate_accessType(self, value):
        # ✅ Normalize frontend values
        if value == "Demo Class":
            return "Demo Class (Slot Booking)"
        if value == "Full Course":
            return "Full Course (Fully Paid)"
        return value

    class Meta:
        model = LiveClass
        fields = '__all__'
 
 
class RecordedClassSerializer(serializers.ModelSerializer):

    def validate_accessType(self, value):
        if value == "Demo Class":
            return "Demo Class (Slot Booking)"
        if value == "Full Course":
            return "Full Course (Fully Paid)"
        return value

    class Meta:
        model = RecordedClass
        fields = '__all__'
 
 
class ResourceSerializer(serializers.ModelSerializer):

    def validate_accessType(self, value):
        if value == "Demo Class":
            return "Demo Class (Slot Booking)"
        if value == "Full Course":
            return "Full Course (Fully Paid)"
        return value

    class Meta:
        model = Resource
        fields = '__all__'
 
# serializers.py
from rest_framework import serializers
from .models import Cart

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'




from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    isAdmin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'isAdmin']

    def get_isAdmin(self, obj):
        return obj.is_staff

class AssignmentSerializer(serializers.ModelSerializer):
    assigned_students_count = serializers.SerializerMethodField()
 
    class Meta:
        model = Assignment
        fields = '__all__'
 
    def get_assigned_students_count(self, obj):
        from .models import Enrollment
        if obj.batch_month and obj.batch_month != 'Not Specified':
            count = Enrollment.objects.filter(assigned_batch__name=obj.batch_month).count()
            if count == 0:
                count = Enrollment.objects.filter(batch_date=obj.batch_month).count()
            return count
        return 0

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'

class StudentAttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.name')
    student_email = serializers.ReadOnlyField(source='student.email')
    batch_name = serializers.ReadOnlyField(source='batch.name')
    mentor_name = serializers.ReadOnlyField(source='mentor.name')
 
    class Meta:
        model = StudentAttendance
        fields = '__all__'

class BatchSerializer(serializers.ModelSerializer):
    students = serializers.SerializerMethodField()
    assigned_mentor_name = serializers.SerializerMethodField()

    class Meta:
        model = Batch
        fields = '__all__'

    def get_students(self, obj):
        enrollments = obj.enrollments.all()
        return [{"id": e.user.id, "name": e.user.full_name, "email": e.user.email} for e in enrollments if e.user]

    def get_assigned_mentor_name(self, obj):
        if obj.assigned_mentor:
            return obj.assigned_mentor.name
        return None

class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.name')
    assignment_title = serializers.ReadOnlyField(source='assignment.title')

    class Meta:
        model = AssignmentSubmission
        fields = '__all__'

class OnlineClassSerializer(serializers.ModelSerializer):
    mentor_name = serializers.ReadOnlyField(source='mentor.name')

    class Meta:
        model = OnlineClass
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = "__all__"

class PaymentOrderSerializer(serializers.ModelSerializer):
    class Meta :
        model = PaymentOrder
        fields = '__all__'

class CertificateSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.full_name')
 
    class Meta:
        model = Certificate
        fields = '__all__'

class CertificateTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateTemplate
        fields = '__all__'