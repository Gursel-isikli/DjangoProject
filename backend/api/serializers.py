from rest_framework import serializers
from .models import Rechnung

class RechnungSerializer(serializers.ModelSerializer):
    kontakt_name = serializers.CharField(source="kontakt.name", read_only=True)

    class Meta:
        model = Rechnung
        fields = "__all__"