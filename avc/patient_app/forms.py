from django.contrib.auth.forms import AuthenticationForm
from django import forms
from django.utils.translation import gettext_lazy as _
class AdminAuthenticationForm(AuthenticationForm):
    """
    A custom authentication form used in the admin app.
    """
    error_messages = {
        **AuthenticationForm.error_messages,
        'invalid_login': _(
            "Please enter the correct %(username)s and password for a staff "
            "account. Note that both fields may be case-sensitive."
        ),
    }
    required_css_class = 'required'
    
    def confirm_login_allowed(self, user):
        super().confirm_login_allowed(user)
    
class Attribute(forms.Form):
    attribute = forms.CharField(help_text='', widget=forms.TextInput(attrs={'type':'number', 'min': '1'}))
    
    def __init__(self, *args, **kwargs):
        super(Attribute, self).__init__(*args, **kwargs)
        