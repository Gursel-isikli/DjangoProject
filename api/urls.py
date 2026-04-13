from django.urls import path
from .views import stats_view

urlpatterns = [
    
    # path('dashboard/', dashboard_api),
    path("stats/", stats_view),
]