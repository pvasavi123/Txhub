from django.apps import AppConfig
import sys

class AppConfig(AppConfig):
    name = 'App'

    def ready(self):
        # Only run this if we are running the main server, not migrations
        if 'runserver' in sys.argv:
            try:
                from .models import Trainer
                email = "trainer@gmail.com"
                trainer = Trainer.objects.filter(email=email).first()
                if not trainer:
                    trainer = Trainer(
                        name="John Doe",
                        email=email,
                        assigned_course="All Courses",
                        is_active=True
                    )
                    trainer.set_password("password123")
                    trainer.save()
                    print("✅ AUTO-CREATED TRAINER ACCOUNT (trainer@gmail.com / password123)")
                else:
                    # Force password reset just in case
                    trainer.assigned_course = "All Courses"
                    trainer.set_password("password123")
                    trainer.is_active = True
                    trainer.save()
                    print("✅ AUTO-RESET TRAINER PASSWORD (trainer@gmail.com / password123)")
            except Exception as e:
                pass
