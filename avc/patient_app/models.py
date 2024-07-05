from django.db import models
from django.utils.html import format_html
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User

def default_json():
    return {"name":{"help text": "", "default value":""}}

def default_score():
    return {}

def validate_json(value):
    for field in value:
        if (len(value.get(field)) > 2):
            raise ValidationError(
                _('Not valid format'))
        if ("help text" not in value.get(field) or 
            "default value" not in value.get(field)):
            raise ValidationError(
                _('%(field)s is not in the form {"help text": "%(help text)s\", "default value": "%(default value)s\"}'),
                params={'field': field, 
                        'help text': [*value.get(field).values()][0], 
                        'default value': [*value.get(field).values()][1]
                        },)
           
class Game(models.Model): 
    game_name = models.CharField(max_length=10, default="", unique=True)
    description = models.TextField(default=_("No description for this game"))
    score = models.JSONField(default=default_json,
                                  help_text=_("score as json to save"))

    attributes = models.JSONField(default = default_json,
                                  validators=[validate_json],
                                  help_text=_(""" 
                                              <ul>
                                              <li>- This is a json object that defines the attributes of the game . 
                                              keep in mind that this attributes are used to create a game level . </li>
                                              <li>- Follow the structure above to create multiple attributes in one object . </li>
                                              <li>- Replace the structure above with {} in case of 0 attributes. </li>
                                              <li>- Structure references : </li>
                                              <ol>
                                              <li> "name" : edit this to the name of your attribute (must be unique). </li>
                                              <li> "help text" : holds the help text (don\'t edit the key\'s name).</li>
                                              <li> "default value" : the default value of the attribute .</li></ol></ul>"""))

    class Meta:
        verbose_name = ('Game')
        db_table = 'Game'
        
    def __init__(self, *args, **kwargs):
        super(Game,self).__init__(*args,**kwargs)
        self.link = self.game_name.replace(' ', '_') 
        
    def __str__(self) -> str:
        return self.game_name
    
class GameLevel(models.Model) :
    level = models.PositiveIntegerField(default=1, help_text=_("a number to identify the level"), null=True)
    game = models.ForeignKey('game', on_delete=models.PROTECT, default=1)
    attributes = models.JSONField(default=default_json)

    class Meta:
        verbose_name = 'Game level'
        db_table = 'Game level'

    def clean(self) -> None: 
        if(len(GameLevel.objects.filter(level=self.level, game=self.game)) != 0):
            raise ValidationError("this level exists try another number")
        
        return super().clean()
    
        
    def __str__(self):
        return f"{self.game} level {self.level}"

class Patient(User):
    therapist = models.CharField(max_length=50)
    note = models.TextField(max_length=500, default='')
    level = models.ManyToManyField(GameLevel)
    
    class Meta:
        verbose_name = ('Patient')
        db_table = 'Patient'

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs) 
        self.is_staff = True
    
class PatientScore(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, default="")
    
    class Meta:
        db_table = 'PatientScore'
    
    def __str__(self):
        return self.patient.username

class Score(models.Model):
    level = models.ForeignKey(GameLevel, on_delete=models.PROTECT)
    score_data = models.JSONField(default=default_score)
    score = models.ForeignKey(PatientScore, on_delete=models.CASCADE)
    create_date = models.DateTimeField(auto_now=True)
        
    class Meta:
        db_table = 'Score'
        
    def __str__(self):
        import datetime
        day = 'unkown'
        days_ago = int((datetime.datetime.today().date() - self.create_date.date()).days)
        if days_ago <= 7 and days_ago > 1:
            day = 'This weak'
        
        elif days_ago <= 14:
            day = 'Last weak'

        elif days_ago < 1:
            day = 'Today'

        elif days_ago == 1:
            day = 'Yesterday'

        if days_ago < 31:
            day = 'This month'
            
        if days_ago >= 31 and days_ago <= 62:
            day = 'A month ago'
        
        if days_ago > 62:
            day = f'{int(days_ago / 31)} months ago'

        return format_html(f"&nbsp&nbsp&nbsp&nbsp{self.create_date.strftime('In %d %B, %Y')}&nbsp&nbsp ({day})")