from dataclasses import fields
from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from django.forms import formset_factory
from django.utils.html import format_html
from django.template.response import TemplateResponse
from django.contrib.auth.models import Group, User
from django.contrib.auth.admin import UserAdmin  
from django.http import Http404

from patient_app.views import game_redirect, redirect_to_profile
from patient_app.forms import *
from patient_app.models import *

from django.http import HttpResponse
import json

class ScoreInline(admin.StackedInline):
    model = Score
    extra = 1
    readonly_fields = ['level', 'score_data', 'score_']
    classes = ['collapse']

    class Meta:
        verbose_name_plural = "score list"
        
    def score_(self, instance):
        return format_html(
            '<span class="view_score" onclick="loadScore(this)" >view</span>')
        
    def has_delete_permission(self, request, obj):
        return False
    
    def has_view_permission(self, request, obj):
        return True
    
    def has_add_permission(self, request, obj):
        return False
    
    def has_change_permission(self, request, obj):
        return False

class ScoreAdmin(admin.ModelAdmin):
    inlines = []
    list_filter = ('patient__last_login',)
    readonly_fields = ['patient']
    list_display = ('patient', 'last_login',)

    class Media:
        css = {'all': ('admin_site/css/game_score.css', 'admin_site/css/filter_score.css')}
        js = ('admin_site/js/generate_score_in_canvas.js', 'admin_site/js/filtering.js')
    
    def last_login(self, obj):
        admin_order_field = 'last login'
        return obj.patient.last_login

    def has_change_permission(self, request, obj=None):
        return False
    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request, obj=None):
        return False

    def get_queryset(self, request):
        my_query = super(ScoreAdmin, self).get_queryset(request)
        return my_query if request.user.is_superuser else my_query.filter(patient__therapist=request.user.id)
    
    def inline(self):
        self.inlines = []
        games = Game.objects.all()

        for game in games:
            class GameScore(ScoreInline):
                verbose_name_plural = format_html(f'<a href="/patient_app/game/{game.id}/change/?e=0">{game.game_name}</a>')
                game_ = game
                
                def get_game(self):
                    return self.game_ 
                
                def get_queryset(self, request):
                    qr = super().get_queryset(request)
                    excluded_id = []
                    for qr_ in qr:
                        if qr_.level.game.game_name == self.get_game().game_name:
                            pass
                        else: 
                            excluded_id.append(qr_.id)

                    return qr.exclude(id__in = excluded_id)
                
            self.inlines += [GameScore]

    def change_view(self, request, object_id: str, form_url='', extra_context=None):
        self.inline()
        return super().change_view(request, object_id, form_url, extra_context)
    
    
class GameLevelAdmin(admin.ModelAdmin):
    exclude = ['attributes']
    search_fields = ['game__game_name']
    list_filter = ('game', 'level')
    list_display = ('game', 'level')
    list_per_page = 20
    fields = ('level', 'game')
    
    class Media:
        pass

    def generate_form(json_data, data_change=None):
        FormsetFactory = formset_factory(Attribute, extra=len(json_data))
        formset = FormsetFactory()
        
        att_label = [*json_data.keys()]
        att_values = [*json_data.values()]
        
        i = 0
        for att in formset:
            att['attribute'].html_name = att['attribute'].label = att_label[i]
            att['attribute'].field.help_text = att_values[i]['help text']
            i += 1
        
        if data_change and len(data_change): 
            data_change_table = [*data_change.values()]
            i = 0
            for att in formset:
                att['attribute'].initial = data_change_table[i]
                i += 1
        return formset
    
    def save_model(self, request, obj, form, change) -> None:
        attributes = form.data.dict()
        attributes = {key: attributes[key] for key in attributes.keys() if key not in form.cleaned_data.keys()}
        attributes = {key: attributes[key] for key in attributes.keys() if key not in {'_save': "", "csrfmiddlewaretoken": ""}.keys()}
        
        obj.attributes = json.dumps(attributes)
        return super().save_model(request, obj, form, change)
    
    def add_view(self, request, form_url='', extra_context=None):
        self.Media.js = ('admin_site/js/load_form.js', 'patient/common_files/js/send_JSON.js')
        self.fields = ('level', 'game')
        
        self.readonly_fields = []
        if request.method == 'POST' and request.content_type == "application/json":
            request_body = json.loads(request.body.decode('utf-8'))
            form_ = 'data unavailable'
            
            game = Game.objects.filter(game_name=request_body['game_name'])
            
            if len(game):
                game_att = game.values()[0]['attributes']
                form_ = GameLevelAdmin.generate_form(game_att)
                
            return HttpResponse(form_)
        
        return super().add_view(request, form_url, extra_context)
    
    def change_view(self, request, object_id, form_url="", extra_context=None):
        self.Media.js = ()
        
        self.readonly_fields = []
        if 'e' in request.GET or '?_changelist_filters' in request.get_full_path():
            self.readonly_fields = ['play_level'] + list(self.get_fields(request))    
        else: 
            self.readonly_fields = ['play_level']
            self.Media.js = ('admin_site/js/load_form.js', 'patient/common_files/js/send_JSON.js')
        
        if request.method == 'POST' and request.content_type == "application/json":   
            request_body = json.loads(request.body.decode('utf-8'))  
            game_att = Game.objects.filter(game_name=request_body['game_name']).values()[0]['attributes']
            game_level = GameLevel.objects.get(pk=object_id)
            
            if game_level.game.game_name == request_body['game_name']:
                level_att = game_level.attributes
                level_att = eval(level_att)
            
            else: 
                level_att = None
            
            game_att = {k: game_att[k] for k in level_att.keys() & game_att.keys()}

            form_ = GameLevelAdmin.generate_form(game_att, level_att)
            return HttpResponse(form_)

        return super().change_view(request, object_id, form_url, extra_context)
    
class GameAdmin(admin.ModelAdmin):
    search_fields = ['game_name']
    
    def game_page(self, instance):
        return format_html(
            '<a href="/game/{0}?NonePlayer">{1}</a>',
            instance.link,
            'view')
    
    def change_view(self, request, object_id, form_url='', extra_context=None) -> HttpResponse:
        if not request.user.is_superuser:
            self.exclude = ['attributes', 'score']
            
        self.readonly_fields = ['game_page']
        if 'e' in request.GET or '?_changelist_filters' in request.get_full_path():
            self.readonly_fields += self.get_fields(request)
        
        self.readonly_fields = [*{*self.readonly_fields}]
        return super().change_view(request, object_id, form_url, extra_context)
    
    def add_view(self, request, form_url='', extra_context=None):
        self.readonly_fields = []
        
        return super().add_view(request, form_url, extra_context)
    
class PatientModelAdmin(UserAdmin):
    list_filter = ('last_login', )
    list_display = ('username', 'last_name', 'first_name', 'last_login')
    list_per_page = 2

    class Media:
        js = ('admin_site/js/patient_form.js',)
        
    fieldsets = UserAdmin.fieldsets[:2] + UserAdmin.fieldsets[3:]
    fieldsets += (
        ('Selected Games', {
            'fields': (
                'level',
            ),
            'description': '- Choose one level for each game for this patient .',
        }),
        ('Additional info', {
            'fields': (
                'note',
            ),
        })
    )
    filter_horizontal = ('level',)
    
    def change_view(self, request, object_id, form_url='', extra_context=None) -> HttpResponse:
        if Patient.objects.get(pk=object_id).therapist != request.user.id :
            redirect('/')
        
        if 'e' in request.GET or '?_changelist_filters' in request.get_full_path():
            self.readonly_fields = self.get_fields(request)
        else:
            self.readonly_fields = []
        return super().change_view(request, object_id, form_url, extra_context)
    
    def has_add_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return True
    
    def save_model(self, request, obj, form, change):
        obj.therapist = request.user.id
        obj.is_staff = True
        super().save_model(request, obj, form, change)
        obj.groups.add(Group.objects.get(name='Patients'))
        PatientScore.objects.get_or_create(patient=obj)
    
    def get_queryset(self, request):
        my_query = super(PatientModelAdmin, self).get_queryset(request)
        return my_query if request.user.is_superuser else my_query.filter(therapist=request.user.id)
    
    
class Site(admin.AdminSite):
    site_header = 'SeriousGames'
    site_title = "SeriousGames"
    site_index_title = ""
    name = ""
    verbose_name ="patient"
    
    def get_app_list(self, request):
        apps = super().get_app_list(request)
        if len(apps) and not request.user.is_superuser: 
            apps.pop(0)
        return apps

    def get_urls(self):
        urls = super().get_urls()
        my_url = [
            path('game/<str:game_name>', game_redirect),
            path('userprofile', redirect_to_profile),
        ] + urls
        return my_url
    
    def index(self, request, extra_context=None):
        
        if request.user.groups.filter(name='Patients').exists():
            return redirect('game/bee_game')
        
        extra_context = extra_context or {}
        extra_context['add_style'] = ''
        return super().index(request, extra_context)

site = Site(name="seriousGames")
site.site_header = 'SeriousGames'
site.index_title = ''
site.site_title = 'SeriousGames'
site.site_url = ''

site.register(Patient, PatientModelAdmin)
site.register(Game, GameAdmin)
site.register(GameLevel, GameLevelAdmin)
site.register(User, UserAdmin)
site.register(PatientScore, ScoreAdmin)
site.register(Group)