from django.apps import AppConfig

class PatientAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'patient_app'
    verbose_name = "Patient Manager"