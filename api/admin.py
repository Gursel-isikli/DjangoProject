from django.contrib import admin
from .models import (
    Kunden,
    Rechnung,
    Rechnungsposition,
    Zahlung,
    Mahnung,
    InvoiceDocument,
    ScannedDocument
)


# Rechnungsposition Inline
#-------------------------------
class RechnungspositionInline(admin.TabularInline):
    model = Rechnungsposition
    extra = 1


# Zahlung Inline
#-------------------------------
class ZahlungInline(admin.TabularInline):
    model = Zahlung
    extra = 1


# Mahnung Inline
#-------------------------------
class MahnungInline(admin.TabularInline):
    model = Mahnung
    extra = 0


# Document Inline
#-------------------------------
class InvoiceDocumentInline(admin.TabularInline):
    model = InvoiceDocument
    extra = 0


# Kunde Admin
#-------------------------------
@admin.register(Kunden)
class KundenAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'telefon', 'erstellt_am')
    search_fields = ('name', 'email')
    list_filter = ('erstellt_am',)
    readonly_fields = ('erstellt_am',)
    ordering = ('-erstellt_am',)


# Rechnung Admin (Haupt)
#-----------------------------
@admin.register(Rechnung)
class RechnungAdmin(admin.ModelAdmin):
    list_display = (
        'rechnungsnummer',
        'kunde',
        'status',
        'gesamtbetrag_display',
        'datum',
        'faelligkeitsdatum'
    )

    list_filter = ('status', 'datum')
    search_fields = ('rechnungsnummer', 'kunde__name')
    readonly_fields = ('erstellt_am',)

    inlines = [
        RechnungspositionInline,
        ZahlungInline,
        MahnungInline,
        InvoiceDocumentInline
    ]

    # gesamt anzeigen
    def gesamtbetrag_display(self, obj):
        return obj.gesamtbetrag()

    gesamtbetrag_display.short_description = "Gesamtbetrag (CHF)"


# Mahnung Admin 
#--------------------------------
@admin.register(Mahnung)
class MahnungAdmin(admin.ModelAdmin):
    list_display = ('rechnung', 'mahnstufe', 'datum', 'gebuehr', 'gesendet')
    list_filter = ('mahnstufe', 'gesendet')
    search_fields = ('rechnung__rechnungsnummer',)


# Zahlung Admin
# -------------------------------
@admin.register(Zahlung)
class ZahlungAdmin(admin.ModelAdmin):
    list_display = ('rechnung', 'betrag', 'datum', 'methode')
    list_filter = ('methode',)
    search_fields = ('rechnung__rechnungsnummer',)


# Scanned Document Admin
# -----------------------------------
@admin.register(ScannedDocument)
class ScannedDocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'processed', 'created_at')
    list_filter = ('processed',)
    readonly_fields = ('created_at',)
    search_fields = ('extracted_text',)


# Invoice Document Admin
# -----------------------------------
@admin.register(InvoiceDocument)
class InvoiceDocumentAdmin(admin.ModelAdmin):
    list_display = ('rechnung', 'created_at')
    readonly_fields = ('created_at',)