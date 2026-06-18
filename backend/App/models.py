from django.core.validators import FileExtensionValidator
from django.db import models
from django.contrib.auth.hashers import make_password, check_password as django_check_password
from django.utils.text import slugify

class Course(models.Model):
    """Admin-managed course catalog. Persisted in DB."""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    imageUrl = models.URLField(max_length=500, blank=True, default='')
    duration = models.CharField(max_length=50, blank=True, default='90 days')
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            n = 1
            while Course.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class UserRegister(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.email
    

class AdminUser(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.TextField()
     
    def __str__(self):
        return self.email


class Trainer(models.Model):
    """Trainer account created by TXHub admin. Scoped to one assigned_course."""
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    assigned_course = models.CharField(max_length=100, blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password):
        return django_check_password(raw_password, self.password_hash)

    def __str__(self):
        return f"{self.name} ({self.email}) — {self.assigned_course}"

from django.db import models

class Student(models.Model):

    # 🔹 Choices (keep for controlled fields)
    ENROLLMENT_CHOICES = [
        ("Training", "Training"),
        ("Internship", "Internship"),
        ("Training+Internship", "Training+Internship"),
    ]

    MODE_CHOICES = [
        ("Online", "Online"),
        ("Offline", "Offline"),
        ("Hybrid", "Hybrid"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("Paid", "Paid"),
        ("Pending", "Pending"),
    ]

    # 🔹 Basic Info
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, default="0000000000")
    password = models.CharField(max_length=255)

    # 🔹 Academic Info
    collegeName = models.CharField(max_length=200, blank=True, null=True)
    branch = models.CharField(max_length=100, blank=True, null=True)

    # ✅ Flexible (no dropdown restriction)
    degreeType = models.CharField(max_length=50)  
    passOutYear = models.CharField(max_length=10)

    cgpa = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)

    # 🔹 Course Info
    enrollmentType = models.CharField(
        max_length=30,
        choices=ENROLLMENT_CHOICES,
        default="Training"
    )

    courseSpecialization = models.CharField(
    max_length=100,
    default="Not Specified"
)

    mode = models.CharField(
        max_length=20,
        choices=MODE_CHOICES,
        default="Online"
    )

    couponCode = models.CharField(max_length=50, blank=True, null=True)

    # 🔹 Payment
    paymentStatus = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="Pending"
    )

    # 🔹 Meta
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"
 
class Enrollment(models.Model):
    ENROLLMENT_CHOICES = [
        ('full', 'Full Payment'),
        ('installment', 'Installment'),
        ('slot', 'Seat Booking'),
    ]
 
    PAYMENT_METHOD_CHOICES = [
        ('upi', 'UPI'),
        ('card', 'Card'),
        ('netbanking', 'Net Banking'),
    ]
 
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('partial', 'Partial'),
        ('completed', 'Completed'),
    ]
 
    # ------------------------
    # USER
    # ------------------------
    user = models.ForeignKey(
    "UserRegister",
    on_delete=models.CASCADE,
    null=True,       # ✅ allow null
    blank=True       # ✅ allow empty
)
 
    assigned_batch = models.ForeignKey(
        'Batch',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='enrollments'
    )
    assigned_mentor = models.ForeignKey(
        'Trainer',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_enrollments'
    )
 
    # ------------------------
    # COURSE DATA
    # ------------------------
    title = models.CharField(max_length=255, blank=True)
    # titles = models.TextField(blank=True)
    items = models.JSONField()
   
 
    # ------------------------
    # PAYMENT DATA
    # ------------------------
    total_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    remaining_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
 
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default='pending'
    )
 
    # ------------------------
    # EXTRA INFO (FROM UI)
    # ------------------------
    enrollment_type = models.CharField(max_length=20, choices=ENROLLMENT_CHOICES)
    batch_date = models.CharField(max_length=50)
 
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    billing_country = models.CharField(max_length=50)
    billing_state = models.CharField(max_length=50)
 
    # ------------------------
    # TIMESTAMP
    # ------------------------
    created_at = models.DateTimeField(auto_now_add=True)
 
    # ------------------------
    # 🔥 AUTO CALCULATION
    # ------------------------
    def calculate_total_fee(self):
        total = 0
        if not isinstance(self.items, list):
            return 0
        for item in self.items:
            price = item.get("price", 0)
            if price is None:
                price = 0
 
            if isinstance(price, str):
                digits = ''.join(filter(str.isdigit, price))
                price = int(digits) if digits else 0
 
            total += price
 
        return total
 
    def save(self, *args, **kwargs):
        # ✅ 1. Calculate total fee from items
        self.total_fee = self.calculate_total_fee()
 
        # ✅ 2. remaining amount
        self.remaining_amount = self.total_fee - self.amount_paid
 
        # ✅ 3. payment status
        if self.amount_paid == 0:
            self.payment_status = "pending"
        elif self.remaining_amount <= 0:
            self.payment_status = "completed"
            self.remaining_amount = 0
        else:
            self.payment_status = "partial"
 
        super().save(*args, **kwargs)
 
    def __str__(self):
        return f"{self.user} - ₹{self.amount_paid}/{self.total_fee} ({self.payment_status})"

 
# COURSE_CHOICES = [
#     ('All Courses', 'All Courses'),
#     ('React Full Stack Development', 'React Full Stack Development'),
#     ('Java Full Stack', 'Java Full Stack'),
#     ('Python Development', 'Python Development'),
#     ('MERN Stack', 'MERN Stack'),
#     ('SQL & Data Analytics', 'SQL & Data Analytics'),
# ]

COURSE_CHOICES = [
    ('All Courses', 'All Courses'),
    ('React Full Stack Development', 'React Full Stack Development'),
    ('Java Full Stack', 'Java Full Stack'),
    ('Python Development', 'Python Development'),
    ('MERN Stack', 'MERN Stack'),
    ('SQL & Data Analytics', 'SQL & Data Analytics'),
    ('Software Development', 'Software Development'),
    ('Testing', 'Testing'),
    ('UI/UX Design', 'UI/UX Design'),

    # ✅ Accept BOTH formats
    ('Devops', 'Devops'),
    ('DevOps', 'DevOps'),

    ('AI/ML', 'AI/ML'),
    ('AL/ML', 'AL/ML'),  # ✅ allow frontend mistake

    ('Data Science', 'Data Science'),
    ('Soft Skills', 'Soft Skills'),
]
 
BATCH_CHOICES = [
    ('All Batches', 'All Batches'),
    ('June Batch', 'June Batch'),
    ('Sept Batch', 'Sept Batch'),
    ('Dec Batch', 'Dec Batch'),
]

ACCESS_TYPE_CHOICES = [
    ('Demo Class (Slot Booking)', 'Demo Class'),
    ('Full Course (Fully Paid)', 'Full Course'),
]
 
 
class LiveClass(models.Model):
    topic = models.CharField(max_length=255)
    link = models.URLField()
    date = models.DateField(null=True, blank=True)
    time = models.TimeField(null=True, blank=True)
    targetCourse = models.CharField(max_length=100, choices=COURSE_CHOICES)
    batchMonth = models.CharField(max_length=100, choices=BATCH_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    accessType = models.CharField(
        max_length=100,
        choices=ACCESS_TYPE_CHOICES,
        default='Demo Class (Slot Booking)'
    )
 
 
class RecordedClass(models.Model):
    title = models.CharField(max_length=255)
    videoLink = models.URLField()
    duration = models.CharField(max_length=50, blank=True)
    targetCourse = models.CharField(max_length=100, choices=COURSE_CHOICES)
    batchMonth = models.CharField(max_length=100, choices=BATCH_CHOICES)
    accessType = models.CharField(
    max_length=100,
    choices=ACCESS_TYPE_CHOICES,
    default='Demo Class (Slot Booking)'
)
    created_at = models.DateTimeField(auto_now_add=True)
 
 
class Resource(models.Model):
    title = models.CharField(max_length=255)
    driveLink = models.URLField()
    description = models.TextField(blank=True)
    targetCourse = models.CharField(max_length=100, choices=COURSE_CHOICES)
    batchMonth = models.CharField(max_length=100, choices=BATCH_CHOICES)
    accessType = models.CharField(
    max_length=100,
    choices=ACCESS_TYPE_CHOICES,
    default='Demo Class (Slot Booking)'
)
    created_at = models.DateTimeField(auto_now_add=True)


    # models.py
class Cart(models.Model):
    email = models.EmailField()
    course_id = models.IntegerField()
    title = models.CharField(max_length=255)
    price = models.CharField(max_length=50)
    img = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Assignment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    course = models.CharField(max_length=100)
    batch_month = models.CharField(max_length=100, blank=True, default='')  # e.g. 'June Batch'
    dueDate = models.DateField(null=True, blank=True)
    fileLink = models.FileField(
        upload_to='assignments/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])]
    )
    trainer = models.ForeignKey('Trainer', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
class Note(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    course = models.CharField(max_length=100)
    batch_month = models.CharField(max_length=100, blank=True, default='')  # e.g. 'June Batch'
    fileLink = models.FileField(upload_to='notes/', blank=True, null=True)
    trainer = models.ForeignKey('Trainer', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
class StudentAttendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    batch = models.ForeignKey('Batch', on_delete=models.CASCADE, null=True, blank=True)
    mentor = models.ForeignKey('Trainer', on_delete=models.SET_NULL, null=True, blank=True)
    attendance_date = models.DateField()
    status = models.CharField(max_length=20, default='Absent')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
   
    class Meta:
        unique_together = ('student', 'attendance_date', 'batch')
 

class Batch(models.Model):
    name = models.CharField(max_length=100)
    course = models.CharField(max_length=200, blank=True, default='')
    startDate = models.DateField(null=True, blank=True)
    assigned_mentor = models.ForeignKey('Trainer', on_delete=models.SET_NULL, null=True, blank=True, related_name='batches')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.course}"

class AssignmentSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='submissions', null=True, blank=True)
    fileLink = models.FileField(upload_to='submissions/', blank=True, null=True)
    status = models.CharField(max_length=20, default='submitted')
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        student_name = self.student.name if self.student else 'Unknown'
        return f"{self.assignment.title} - {student_name}"

class OnlineClass(models.Model):
    title = models.CharField(max_length=255)
    mentor = models.ForeignKey(Trainer, on_delete=models.CASCADE, related_name='online_classes')
    batch = models.CharField(max_length=100) # Assuming batch name string like 'June Batch' to match existing Batch choices
    meeting_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    status = models.CharField(max_length=20, default='SCHEDULED', choices=[('SCHEDULED', 'Scheduled'), ('LIVE', 'Live'), ('ENDED', 'Ended')])
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    meeting_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
 
    def __str__(self):
        return f"{self.title} - {self.batch} ({self.status})"