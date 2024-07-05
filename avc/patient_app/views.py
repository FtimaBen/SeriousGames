
from django.shortcuts import redirect
from django.http.response import HttpResponse
from django.template.response import TemplateResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout

from patient_app.models import *
import json

@login_required
def redirect_to_profile(request):
    return redirect(f'auth/user/{request.user.id}/change')
    
def save_score(request, score):
    patient_score = PatientScore.objects.get(patient=request.user)
    game = Game.objects.get(game_name=score['game'])
    patient_level = Patient.objects.get(id=request.user.id).level.filter(game=game)[0]
    score_data_ = game.score

    print(['game', *score_data_.keys()] == ['game', *score.keys()])
    if ['game', *score_data_.keys()] == ['game', *score.keys()]:
        print('ok')
        model_ = Score.objects.create(score=patient_score, level=patient_level, score_data=score)
        model_.save()
        
def get_patient_game_data(request, game_name):
    if not request.user.groups.filter(name='Patients').exists() :
        return {}

    game = Game.objects.get(game_name=game_name.replace('_', ' '))
    return Patient.objects.get(id=request.user.id).level.filter(game=game)[0].attributes

def get_game_for_therapist(request, game_name):
    game = Game.objects.get(game_name=game_name.replace('_', ' '))
    
    if 'level' in request.GET:
        try:
            att = GameLevel.objects.filter(game=game, level=request.GET['level'])[0]        
            return att.attributes or {}
        
        except: pass 
                    
    att = game.attributes
    att_keys = [*att.keys()]
    
    for att_ in att_keys:
        att.update({att_: att[att_]['default value']})
        
    return att or {}

@login_required
def game_redirect(request, game_name):
    if not request.user.groups.filter(name='Patients').exists():
        redirect('/logout')
        logout(request)
        
    if request.method == 'POST' and request.content_type == "application/json":
        save_score(request, json.loads(request.body.decode('utf-8')))
        return HttpResponse('')
    try:
        template = TemplateResponse( request, 
                                    'patient/' + game_name + '.html', 
                                    {'json_data': get_game_attributes(request, game_name)})
        
    except:
        template = TemplateResponse( request, 'patient/game_not_found.html')
    
    return template

def get_game_attributes(request, game_name):
    game_name = game_name.replace('_', ' ')
    if 'NonePlayer' in request.GET: 
        game_data = get_game_for_therapist(request, game_name)
    else:
        game_data = get_patient_game_data(request, game_name) 
    
    return game_data
