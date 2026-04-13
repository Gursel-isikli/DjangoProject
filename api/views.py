from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth, TruncYear
from .models import Rechnung
from django.http import JsonResponse



# def dashboard_api(request):
#    data = get_dashboard_stats()     
#    return JsonResponse(data, safe=False)


def stats_view(request):
    data = {
        "total_income": 1000
    }
    return JsonResponse(data)



def get_dashboard_stats():

    #gesamteinnahmen
    total_income = Rechnung.objects.filter(status='bezahlt').aggregate(
        total=Sum('betrag')
    )['total'] or 0

    #bezahlte Rechnungen
    paid_invoices = Rechnung.objects.filter(status='bezahlt').count()

    #überfällige Rechnungen
    overdue_invoices = Rechnung.objects.filter(status='ueberfaellig').count()

    #Monatsdiagramm
    monthly = (
        Rechnung.objects
        .filter(status='bezahlt')
        .annotate(month=TruncMonth('datum'))
        .values('month')
        .annotate(total=Sum('betrag'))
        .order_by('month')
    )

    # Jahresdiagramm
    yearly = (
        Rechnung.objects
        .filter(status='bezahlt')
        .annotate(year=TruncYear('datum'))
        .values('year')
        .annotate(total=Sum('betrag'))
        .order_by('year')
    )

    return {
        "total_income": total_income,
        "paid_invoices": paid_invoices,
        "overdue_invoices": overdue_invoices,
        "monthly": list(monthly),
        "yearly": list(yearly),
    }
