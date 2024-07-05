from django import template

register = template.Library()

@register.filter
def concat(var_1, var_2):
    return str(var_1) + str(var_2)