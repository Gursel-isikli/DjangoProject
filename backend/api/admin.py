from django.contrib import admin
from .models import (
    Kontakt,
    Rechnung,
    Rechnungsposition,
    Zahlung,
    Mahnung,
    Rechnungsdokument,
    GescanntesDokument
)

# ==============================
# Rechnungsposition Inline
# ==============================
class RechnungspositionInline(admin.TabularInline):
    model = Rechnungsposition
    extra = 1


# ==============================
# Zahlung Inline
# ==============================
class ZahlungInline(admin.TabularInline):
    model = Zahlung
    extra = 1


# ==============================
# Mahnung Inline
# ==============================
class MahnungInline(admin.TabularInline):
    model = Mahnung
    extra = 0


# ==============================
# Rechnungsdokument Inline
# ==============================
class RechnungsdokumentInline(admin.TabularInline):
    model = Rechnungsdokument
    extra = 0


# ==============================
# Kontakt Admin (statt Kunden)
# ==============================
@admin.register(Kontakt)
class KontaktAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'telefon', 'erstellt_am')
    search_fields = ('name', 'email')
    list_filter = ('erstellt_am',)
    ordering = ('-erstellt_am',)


# ==============================
# Rechnung Admin
# ==============================
@admin.register(Rechnung)
class RechnungAdmin(admin.ModelAdmin):
    list_display = (
        'rechnungsnummer',
        'kontakt',
        'status',
        'datum',
        'faelligkeitsdatum'
    )

    list_filter = ('status', 'datum')
    search_fields = ('rechnungsnummer', 'kontakt__name')
    readonly_fields = ('erstellt_am',)

    inlines = [
        RechnungspositionInline,
        ZahlungInline,
        MahnungInline,
        RechnungsdokumentInline
    ]

    def gesamtbetrag_display(self, obj):
        return obj.gesamtbetrag

    gesamtbetrag_display.short_description = "Gesamtbetrag"


# ==============================
# Mahnung Admin
# ==============================
@admin.register(Mahnung)
class MahnungAdmin(admin.ModelAdmin):
    list_display = ('rechnung', 'mahnstufe', 'datum', 'gebuehr', 'gesendet')
    list_filter = ('mahnstufe', 'gesendet')
    search_fields = ('rechnung__rechnungsnummer',)


# ==============================
# Zahlung Admin
# ==============================
@admin.register(Zahlung)
class ZahlungAdmin(admin.ModelAdmin):
    list_display = ('rechnung', 'betrag', 'datum', 'methode')
    list_filter = ('methode',)
    search_fields = ('rechnung__rechnungsnummer',)


# ==============================
# Dokument Admin
# ==============================
@admin.register(Rechnungsdokument)
class RechnungsdokumentAdmin(admin.ModelAdmin):
    list_display = ('rechnung', 'erstellt_am')
    readonly_fields = ('erstellt_am',)


# ==============================
# Scan OCR Admin
# ==============================
@admin.register(GescanntesDokument)
class GescanntesDokumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'verarbeitet', 'erstellt_am')
    list_filter = ('verarbeitet',)
    search_fields = ('erkannter_text',)