from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth, TruncYear
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.shortcuts import redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import RechnungSerializer
from .models import Rechnung, Zahlung, Kontakt, Mahnung
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
   

#=======================================
# Aktivitäts Daten
#=======================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def activity_list(request):

    data = []

    # Letzte Recnungen
    rechnungen = Rechnung.objects.filter(
        user=request.user
    ).order_by("-erstellt_am")[:3]

    for item in rechnungen:
        data.append({
            "title": "Neue Rechnung erstellt",
            "text": f"{item.rechnungsnummer}",
            "time": item.erstellt_am.strftime("%d.%m.%Y"),
            "color": "primary",
            "icon": "bi bi-receipt-cutoff"
        })

    # Letzte Kontakt
    kontakte = Kontakt.objects.filter(
        user=request.user
    ).order_by("-erstellt_am")[:2]

    for item in kontakte:
        data.append({
            "title": "Neuer Kontakt",
            "text": item.name,
            "time": item.erstellt_am.strftime("%d.%m.%Y"),
            "color": "info",
            "icon": "bi bi-person-plus-fill"
        })

    # Letzte Mahnungen
    mahnungen = Mahnung.objects.filter(
        rechnung__user=request.user
    ).order_by("-erstellt_am")[:2]

    for item in mahnungen:
        data.append({
            "title": "Mahnung gesendet",
            "text": item.rechnung.rechnungsnummer,
            "time": item.erstellt_am.strftime("%d.%m.%Y"),
            "color": "danger",
            "icon": "bi bi-exclamation-triangle-fill"
        })

    return Response(data[:6])


#=======================================
# Benutzer Daten
#=======================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({
        "username": request.user.username,
        "email": request.user.email
    })


#=======================================
# Kontakt Daten
#=======================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def kontakt_list(request):

    kontakte = Kontakt.objects.filter(
        user=request.user
    ).values("id", "name")

    return Response(list(kontakte))

#=======================================
# Rechnung Erstellen
#=======================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_rechnung(request):
    try:
        kontakt_id = request.data.get("kontakt")

        if not kontakt_id:
            return Response(
                {"error": "Kontakt seçilmedi"},
                status=400
            )

        kontakt = Kontakt.objects.get(
            id=kontakt_id,
            user=request.user
        )

        obj = Rechnung.objects.create(
            user=request.user,
            kontakt=kontakt,
            rechnungsnummer=request.data.get("rechnungsnummer"),
            datum=request.data.get("datum"),
            faelligkeitsdatum=request.data.get("faelligkeitsdatum"),
            status=request.data.get("status", "offen"),
        )

        serializer = RechnungSerializer(obj)
        return Response(serializer.data)

    except Kontakt.DoesNotExist:
        return Response(
            {"error": "Kontaktdaten nicht gefunden."},
            status=404
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=500
        )

        

#=======================================
# Rechnung Daten
#=======================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def rechnung_list(request):
    rechnungen = Rechnung.objects.filter(
        user=request.user
    ).order_by('-datum')

    serializer = RechnungSerializer(
        rechnungen,
        many=True
    )

    return Response(serializer.data)


#=======================================
# Admin
#=======================================
def stats_view(request):
    if request.user.is_staff:
        return redirect('/admin/')
    return redirect('/admin/logout/')





#=======================================
# Register
#=======================================
@api_view(['POST'])
def register(request):
    username = request.data['username']
    email = request.data['email']
    password = request.data['password']

    if User.objects.filter(username=username).exists():
        return Response({"error": "User exists"})

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response({"message": "User created"})

#=======================================
#StatCards Daten
#=======================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):

    rechnungen = Rechnung.objects.filter(
        user=request.user
    )

    total = rechnungen.count()

    offen = rechnungen.filter(
        status="offen"
    ).count()

    bezahlt = rechnungen.filter(
        status="bezahlt"
    ).count()

    ueberfaellig = rechnungen.filter(
        status="ueberfaellig"
    ).count()

    kontakte = Kontakt.objects.filter(
        user=request.user
    ).count()

    return Response({
        "total": total,
        "offen": offen,
        "bezahlt": bezahlt,
        "ueberfaellig": ueberfaellig,
        "kontakte": kontakte
    })


#=======================================
#Charts Daten
#=======================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def chart_stats(request):

    qs = Rechnung.objects.filter(
        user=request.user
    ).annotate(
        month=TruncMonth("datum")
    ).values("month", "status").annotate(
        total=Count("id")
    ).order_by("month")

    result = {}

    for item in qs:
        month = item["month"].strftime("%b")

        if month not in result:
            result[month] = {
                "month": month,
                "offen": 0,
                "bezahlt": 0,
                "ueberfaellig": 0
            }

        result[month][item["status"]] = item["total"]

    return Response(list(result.values()))



