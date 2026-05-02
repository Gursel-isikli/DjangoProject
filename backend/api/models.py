from django.db import models
from django.contrib.auth.models import User


# ==============================
# Basis Modell (Zeitstempel)
# ==============================
class BasisModell(models.Model):
    erstellt_am = models.DateTimeField(auto_now_add=True)
    aktualisiert_am = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# ==============================
# Benutzerprofil (optional)
# ==============================
class Benutzerprofil(BasisModell):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


# ==============================
# Kontakt (User-spezifisch)
# ==============================
class Kontakt(BasisModell):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    telefon = models.CharField(max_length=50, blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


# ==============================
# Rechnung
# ==============================
class Rechnung(BasisModell):

    STATUS_CHOICES = [
        ('offen', 'Offen'),
        ('bezahlt', 'Bezahlt'),
        ('ueberfaellig', 'Überfällig'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    kontakt = models.ForeignKey(Kontakt, on_delete=models.CASCADE)

    rechnungsnummer = models.CharField(max_length=50, unique=True)
    datum = models.DateField()
    faelligkeitsdatum = models.DateField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='offen')

    def __str__(self):
        return self.rechnungsnummer

    # Gesamtbetrag dynamisch berechnen
    @property
    def gesamtbetrag(self):
        return sum(p.gesamtpreis() for p in self.positionen.all())

    @property
    def bezahlt_betrag(self):
        return sum(z.betrag for z in self.zahlungen.all())

    @property
    def restbetrag(self):
        return self.gesamtbetrag - self.bezahlt_betrag


# ==============================
# Rechnungsposition
# ==============================
class Rechnungsposition(BasisModell):
    rechnung = models.ForeignKey(
        Rechnung,
        on_delete=models.CASCADE,
        related_name='positionen'
    )

    beschreibung = models.CharField(max_length=255)
    menge = models.PositiveIntegerField()
    preis = models.DecimalField(max_digits=10, decimal_places=2)

    def gesamtpreis(self):
        return self.menge * self.preis

    def __str__(self):
        return self.beschreibung


# ==============================
# Zahlung
# ==============================
class Zahlung(BasisModell):

    ZAHLUNGSMETHODEN = [
        ('bank', 'Bank'),
        ('paypal', 'PayPal'),
        ('cash', 'Bar'),
    ]

    rechnung = models.ForeignKey(
        Rechnung,
        on_delete=models.CASCADE,
        related_name='zahlungen'
    )

    betrag = models.DecimalField(max_digits=10, decimal_places=2)
    datum = models.DateField()
    methode = models.CharField(max_length=20, choices=ZAHLUNGSMETHODEN)

    def __str__(self):
        return f"{self.betrag} - {self.rechnung.rechnungsnummer}"


# ==============================
# Mahnung
# ==============================
class Mahnung(BasisModell):

    rechnung = models.ForeignKey(
        Rechnung,
        on_delete=models.CASCADE,
        related_name='mahnungen'
    )

    mahnstufe = models.PositiveIntegerField()
    datum = models.DateField()
    gebuehr = models.DecimalField(max_digits=10, decimal_places=2)
    gesendet = models.BooleanField(default=False)

    def __str__(self):
        return f"Mahnung {self.mahnstufe} - {self.rechnung.rechnungsnummer}"


# ==============================
# Rechnungsdokument (PDF)
# ==============================
class Rechnungsdokument(BasisModell):
    rechnung = models.ForeignKey(
        Rechnung,
        on_delete=models.CASCADE,
        related_name='dokumente'
    )

    datei = models.FileField(upload_to='rechnungen/')

    def __str__(self):
        return f"PDF - {self.rechnung.rechnungsnummer}"


# ==============================
# Gescanntes Dokument (OCR)
# ==============================
class GescanntesDokument(BasisModell):
    datei = models.FileField(upload_to='scans/')
    erkannter_text = models.TextField(blank=True, null=True)
    verarbeitet = models.BooleanField(default=False)

    def __str__(self):
        return f"Scan {self.id}"
