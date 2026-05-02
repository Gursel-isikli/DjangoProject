from django.urls import path
from .views import stats_view,dashboard_stats, register, rechnung_list, create_rechnung,me,kontakt_list,activity_list,chart_stats

urlpatterns = [
    
    path("stats_admin/",stats_view),
    path("stats/", dashboard_stats),
    path('register/', register),
    path("rechnungen/", rechnung_list),
    path("rechnung/create/", create_rechnung),
    path("me/", me),
    path("kontakte/", kontakt_list),
    path("activity/", activity_list),
    path("chart/", chart_stats),
    

]






